// Video detail — information as the catalog shows it
// (content.dittomusic.com/catalog/videos/{id}) plus splits, mirroring releases.
import type { VideoRelease } from './videoMockData'
import type { SplitCollaborator } from './releaseDetailMockData'

export interface VideoDetail extends VideoRelease {
  label: string
  upc: string
  isrcVideo: string
  isrcAudio: string
  length: string
  resolution: string
  fileSize: string
  labelcampId: string
  releaseDate: string
  associatedTrack: { title: string; album: string; isrc: string; length: string }
  storeIds: string[]
  splits: SplitCollaborator[]
}

const c = (id: string, name: string, email: string, share: number, status: SplitCollaborator['status'], activeSince?: string): SplitCollaborator =>
  ({ id, name, email, share, status, activeSince })

// Per-video seeds; anything not listed falls back to a generated detail.
const seeds: Record<string, Partial<VideoDetail>> = {
  'vr-001': {
    label: 'Golden Boy Entertainment',
    upc: '5064089340643',
    isrcVideo: 'GXLEV2664948',
    isrcAudio: 'GXLF52643441',
    length: '03:42',
    resolution: '3840x2160',
    fileSize: '4.21 GB',
    labelcampId: '611005',
    releaseDate: '2026-06-06',
    associatedTrack: { title: 'Summer Vibes', album: '$exy Girl $ummer (Vol.1)', isrc: 'GXLF52643441', length: '03:42' },
    storeIds: ['youtube', 'vevo', 'apple', 'tiktok'],
    splits: [
      c('v1', 'Femi Adeyemi', 'femi.director@gmail.com', 20, 'active', '6 Jun 2026'),
      c('v2', 'Kraizee', 'kraizee@beats.co', 10, 'pending'),
    ],
  },
  'vr-002': {
    label: 'Golden Boy Entertainment',
    upc: '5064089341022',
    isrcVideo: 'GXLEV2665011',
    isrcAudio: 'GXLF52643502',
    length: '04:12',
    resolution: '1920x1080',
    fileSize: '2.87 GB',
    labelcampId: '611231',
    releaseDate: '2026-04-18',
    associatedTrack: { title: 'Midnight Run', album: 'Midnight Run', isrc: 'GXLF52643502', length: '04:12' },
    storeIds: ['youtube', 'vevo'],
    splits: [c('v3', 'Studio 45 Sessions', 'bookings@studio45.co.uk', 15, 'verification')],
  },
}

export const getVideoDetail = (video: VideoRelease): VideoDetail => {
  const seed = seeds[video.id] ?? {}
  const n = video.id.replace(/\D/g, '').padStart(3, '0')
  return {
    ...video,
    label: 'Golden Boy Entertainment',
    upc: `50640893${n}${n.slice(0, 2)}`,
    isrcVideo: `GXLEV26649${n}`,
    isrcAudio: `GXLF52643${n}`,
    length: '03:28',
    resolution: '1920x1080',
    fileSize: '2.10 GB',
    labelcampId: `61${n}0`,
    releaseDate: `${video.year}-03-14`,
    associatedTrack: { title: video.title.replace(/\s*\([^)]*\)\s*$/, ''), album: video.title.replace(/\s*\([^)]*\)\s*$/, ''), isrc: `GXLF52643${n}`, length: '03:28' },
    storeIds: ['youtube', 'vevo', 'apple'],
    splits: [],
    ...seed,
  }
}
