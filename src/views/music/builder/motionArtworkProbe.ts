// Reads what Apple's motion-artwork spec needs straight from the QuickTime / MP4
// container (the `moov` header), so ProRes files the browser can't decode are
// still checked properly: codec tag, dimensions, frame rate, duration, audio
// track, colour tagging, pixel aspect ratio. Only atom headers and `moov` are
// read — `mdat` (the actual frames) is skipped by size.

export interface MotionProbe {
  container: 'mov' | 'mp4' | 'unknown'
  codecTag: string | null
  codecLabel: string
  width: number
  height: number
  fps: number | null
  duration: number | null
  hasAudio: boolean
  /** null = no colr atom (untagged) */
  colour: { primaries: number; transfer: number } | null
  pixelAspect: { h: number; v: number } | null
  bitrateMbps: number | null
}

const CODEC_LABELS: Record<string, string> = {
  ap4h: 'Apple ProRes 4444',
  ap4x: 'Apple ProRes 4444 XQ',
  apch: 'Apple ProRes 422 HQ',
  apcn: 'Apple ProRes 422',
  apcs: 'Apple ProRes 422 LT',
  apco: 'Apple ProRes 422 Proxy',
  avc1: 'H.264',
  avc3: 'H.264',
  hvc1: 'HEVC',
  hev1: 'HEVC',
  mp4v: 'MPEG-4 Visual',
}

/** Apple: "H.264 or Apple ProRes 422, 4444" */
export const ALLOWED_CODEC_TAGS = new Set(['ap4h', 'ap4x', 'apch', 'apcn', 'apcs', 'avc1', 'avc3'])

const ascii = (dv: DataView, off: number, len: number) => {
  let s = ''
  for (let i = 0; i < len; i++) s += String.fromCharCode(dv.getUint8(off + i))
  return s
}

const readU64 = (dv: DataView, off: number) => Number(dv.getBigUint64(off))

interface Box { type: string; start: number; size: number; header: number }

/** Iterate boxes inside [start, end) of a buffer */
const boxes = (dv: DataView, start: number, end: number): Box[] => {
  const out: Box[] = []
  let off = start
  while (off + 8 <= end) {
    let size = dv.getUint32(off)
    const type = ascii(dv, off + 4, 4)
    let header = 8
    if (size === 1) { size = readU64(dv, off + 8); header = 16 }
    else if (size === 0) size = end - off
    if (size < header) break
    out.push({ type, start: off, size, header })
    off += size
  }
  return out
}

const child = (dv: DataView, b: Box, type: string) => boxes(dv, b.start + b.header, b.start + b.size).find(x => x.type === type)
const children = (dv: DataView, b: Box, type: string) => boxes(dv, b.start + b.header, b.start + b.size).filter(x => x.type === type)

export async function probeMotionArtwork(file: File): Promise<MotionProbe | null> {
  // Walk the top-level atoms from disk, reading only headers, until we hit moov.
  let off = 0
  let container: MotionProbe['container'] = 'unknown'
  let moovBuf: ArrayBuffer | null = null
  while (off + 8 <= file.size) {
    const head = new DataView(await file.slice(off, off + 16).arrayBuffer())
    let size = head.getUint32(0)
    const type = ascii(head, 4, 4)
    let header = 8
    if (size === 1) { size = readU64(head, 8); header = 16 }
    else if (size === 0) size = file.size - off
    if (type === 'ftyp') {
      const brand = ascii(new DataView(await file.slice(off + header, off + header + 4).arrayBuffer()), 0, 4)
      container = brand === 'qt  ' ? 'mov' : 'mp4'
    } else if (type === 'moov') {
      if (size > 64 * 1024 * 1024) return null
      moovBuf = await file.slice(off, off + size).arrayBuffer()
      break
    }
    if (size < header) break
    off += size
  }
  if (!moovBuf) return container === 'unknown' ? null : null
  const dv = new DataView(moovBuf)
  const moov: Box = { type: 'moov', start: 0, size: moovBuf.byteLength, header: 8 }

  // Movie duration
  let duration: number | null = null
  const mvhd = child(dv, moov, 'mvhd')
  if (mvhd) {
    const v = dv.getUint8(mvhd.start + 8)
    const ts = v === 1 ? dv.getUint32(mvhd.start + 28) : dv.getUint32(mvhd.start + 20)
    const d = v === 1 ? readU64(dv, mvhd.start + 32) : dv.getUint32(mvhd.start + 24)
    if (ts > 0) duration = d / ts
  }

  const probe: MotionProbe = {
    container, codecTag: null, codecLabel: 'Unknown', width: 0, height: 0, fps: null,
    duration, hasAudio: false, colour: null, pixelAspect: null, bitrateMbps: null,
  }

  for (const trak of children(dv, moov, 'trak')) {
    const mdia = child(dv, trak, 'mdia'); if (!mdia) continue
    const hdlr = child(dv, mdia, 'hdlr'); if (!hdlr) continue
    const handler = ascii(dv, hdlr.start + 16, 4)
    if (handler === 'soun') { probe.hasAudio = true; continue }
    if (handler !== 'vide') continue

    const mdhd = child(dv, mdia, 'mdhd')
    let timescale = 0
    if (mdhd) {
      const v = dv.getUint8(mdhd.start + 8)
      timescale = v === 1 ? dv.getUint32(mdhd.start + 28) : dv.getUint32(mdhd.start + 20)
    }
    const minf = child(dv, mdia, 'minf'); const stbl = minf && child(dv, minf, 'stbl')
    if (!stbl) continue

    const stsd = child(dv, stbl, 'stsd')
    if (stsd) {
      const entry = stsd.start + 16 // fullbox(4) + entry_count(4) after the 8-byte header
      probe.codecTag = ascii(dv, entry + 4, 4)
      probe.codecLabel = CODEC_LABELS[probe.codecTag] ?? probe.codecTag.trim().toUpperCase()
      probe.width = dv.getUint16(entry + 32)
      probe.height = dv.getUint16(entry + 34)
      const entrySize = dv.getUint32(entry)
      for (const ext of boxes(dv, entry + 86, entry + entrySize)) {
        if (ext.type === 'colr') {
          probe.colour = { primaries: dv.getUint16(ext.start + 12), transfer: dv.getUint16(ext.start + 14) }
        } else if (ext.type === 'pasp') {
          probe.pixelAspect = { h: dv.getUint32(ext.start + 8), v: dv.getUint32(ext.start + 12) }
        }
      }
    }

    const stts = child(dv, stbl, 'stts')
    if (stts && timescale > 0) {
      const n = dv.getUint32(stts.start + 12)
      let bestCount = -1, bestDelta = 0
      for (let i = 0; i < n; i++) {
        const count = dv.getUint32(stts.start + 16 + i * 8)
        const delta = dv.getUint32(stts.start + 20 + i * 8)
        if (count > bestCount) { bestCount = count; bestDelta = delta }
      }
      if (bestDelta > 0) probe.fps = timescale / bestDelta
    }
  }

  if (probe.duration && probe.duration > 0) probe.bitrateMbps = (file.size * 8) / probe.duration / 1_000_000
  return probe
}
