<template>
  <!-- One of Apple's two required motion deliverables -->
  <div class="rounded-2xl border border-gray-200 p-4 flex flex-col">
    <div class="flex items-center gap-3 mb-3">
      <!-- Shape glyph (filled, so it never reads as a checkbox) -->
      <span class="flex-shrink-0 w-8 h-8 rounded-lg bg-ditto-light-grey flex items-center justify-center" aria-hidden="true">
        <span class="rounded-[3px] bg-ditto-purple opacity-70 block" :style="ratio === 'portrait' ? 'width:12px;height:16px' : 'width:16px;height:16px'"></span>
      </span>
      <div class="min-w-0">
        <p class="text-sm font-semibold text-ditto-text leading-tight">{{ meta.title }} <span class="font-normal text-ditto-subtext">· {{ meta.width }}×{{ meta.height }}</span></p>
        <p class="text-xs text-ditto-subtext">{{ meta.devices }}</p>
      </div>
    </div>

    <!-- Invalid -->
    <div v-if="slot.status === 'invalid'" class="border-2 border-dashed border-error/40 bg-error/5 rounded-xl p-4 flex-1">
      <p class="text-sm font-semibold text-error">Doesn't meet the spec</p>
      <p class="text-xs text-ditto-subtext mt-0.5 truncate">{{ slot.fileName }} · {{ slot.fileSize }}</p>
      <ul class="mt-2.5 space-y-1.5">
        <li v-for="err in slot.errors" :key="err" class="flex items-start gap-2 text-xs text-ditto-text">
          <svg class="w-3.5 h-3.5 text-error flex-shrink-0 mt-px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          {{ err }}
        </li>
      </ul>
      <div class="flex items-center gap-2 mt-3">
        <button @click="triggerFileInput" class="px-3.5 py-1.5 rounded-full bg-ditto-purple text-white text-xs font-semibold hover:bg-ditto-purple/90 transition-colors">Replace</button>
        <button @click="removeFile" class="px-3.5 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-ditto-text hover:border-error hover:text-error transition-colors">Remove</button>
      </div>
    </div>

    <!-- Checking -->
    <div v-else-if="slot.status === 'checking'" class="border-2 border-dashed border-ditto-purple/30 bg-ditto-purple/5 rounded-xl p-4 flex-1">
      <p class="text-sm font-medium text-ditto-text truncate">{{ slot.fileName }}</p>
      <p class="text-xs text-ditto-subtext">{{ slot.fileSize }}</p>
      <div class="flex items-center justify-between text-xs text-ditto-subtext mt-3 mb-1">
        <span>Checking…</span><span>{{ progress }}%</span>
      </div>
      <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div class="h-full bg-ditto-purple rounded-full transition-all duration-300" :style="{ width: progress + '%' }"></div>
      </div>
    </div>

    <!-- Valid -->
    <div v-else-if="slot.status === 'valid'" class="flex gap-3 items-start flex-1">
      <div class="flex-shrink-0 border border-gray-200 rounded-xl p-1.5 bg-white" :class="ratio === 'portrait' ? 'w-[72px]' : 'w-24'">
        <video
          v-if="slot.previewUrl && !previewFailed"
          :src="slot.previewUrl"
          class="w-full rounded-lg bg-black object-cover"
          :class="ratio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square'"
          autoplay muted loop playsinline
          @error="previewFailed = true"
        ></video>
        <div v-else class="w-full rounded-lg bg-ditto-light-grey flex items-center justify-center" :class="ratio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square'" title="ProRes can't preview in the browser.">
          <svg class="w-5 h-5 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><polygon points="10,8 16,12 10,16"/></svg>
        </div>
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium text-ditto-text truncate">{{ slot.fileName }}</p>
        <p class="text-xs text-ditto-subtext">{{ slot.fileSize }}<template v-if="slot.summary"> · {{ slot.summary }}</template></p>
        <p class="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-[#006633] bg-[#00e785]/10 px-2.5 py-1 rounded-full">
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Meets the spec
        </p>
        <p v-if="slot.unverified" class="text-[11px] text-ditto-subtext mt-1.5 leading-relaxed">{{ slot.unverified }}</p>
        <div class="flex items-center gap-3 mt-2">
          <button @click="triggerFileInput" class="text-xs font-medium text-ditto-purple hover:underline">Replace</button>
          <button @click="removeFile" class="text-xs font-medium text-ditto-subtext hover:text-error">Remove</button>
        </div>
      </div>
    </div>

    <!-- Idle drop zone -->
    <div
      v-else
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
      :class="['border-2 border-dashed rounded-xl px-4 py-7 text-center transition-all flex-1 flex flex-col items-center justify-center', isDragging ? 'border-ditto-purple bg-ditto-purple/5' : 'border-gray-300 hover:border-ditto-purple/50']"
    >
      <p class="text-sm text-ditto-text">
        Drop your {{ meta.title.toLowerCase() }} file or
        <button @click="triggerFileInput" class="text-ditto-purple font-medium hover:underline">browse</button>
      </p>
      <p class="text-xs text-ditto-subtext mt-1">.mov or .mp4</p>
    </div>

    <input ref="fileInputRef" type="file" accept=".mov,.mp4,video/quicktime,video/mp4" class="hidden" @change="handleFileSelect" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { MotionArtworkFile } from '../ReleaseBuilderView.vue'
import { probeMotionArtwork, ALLOWED_CODEC_TAGS } from '../motionArtworkProbe'
import type { MotionSpecKey } from './motionArtworkSpec'

const props = defineProps<{ slot: MotionArtworkFile; ratio: 'square' | 'portrait' }>()
const emit = defineEmits<{ (e: 'checked', failed: Set<MotionSpecKey>): void }>()

const RATIOS = {
  square: { title: 'Square', ratioLabel: '1:1', width: 3840, height: 3840, devices: 'Mac, iPad, smart TVs' },
  portrait: { title: 'Portrait', ratioLabel: '3:4', width: 2048, height: 2732, devices: 'iPhone, Android' },
} as const
const meta = computed(() => RATIOS[props.ratio])
const other = computed(() => RATIOS[props.ratio === 'square' ? 'portrait' : 'square'])

const isDragging = ref(false)
const progress = ref(0)
const previewFailed = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const triggerFileInput = () => fileInputRef.value?.click()

const formatFileSize = (bytes: number) =>
  bytes >= 1048576 ? (bytes / 1048576).toFixed(1) + ' MB' : (bytes / 1024).toFixed(0) + ' KB'

const removeFile = () => {
  const m = props.slot
  if (m.previewUrl) URL.revokeObjectURL(m.previewUrl)
  m.file = null; m.previewUrl = null; m.fileName = ''; m.fileSize = ''
  m.status = ''; m.errors = []; m.summary = ''; m.unverified = ''
  previewFailed.value = false
  if (fileInputRef.value) fileInputRef.value.value = ''
  emit('checked', new Set())
}
defineExpose({ removeFile })

// Validation reads the container header directly (see motionArtworkProbe.ts), so a
// ProRes file the browser can't decode is still checked against every spec Apple lists.
const ALLOWED_FPS = [23.976, 24, 25, 29.97, 30]
const near = (a: number, b: number, tol = 0.02) => Math.abs(a - b) <= tol

const handleFile = async (file: File) => {
  const m = props.slot
  if (m.previewUrl) URL.revokeObjectURL(m.previewUrl)
  previewFailed.value = false
  m.file = file
  m.fileName = file.name
  m.fileSize = formatFileSize(file.size)
  m.status = 'checking'
  m.errors = []
  m.unverified = ''
  m.summary = ''
  m.previewUrl = URL.createObjectURL(file)
  progress.value = 0
  const tick = setInterval(() => { progress.value = Math.min(90, progress.value + 12 + Math.round(Math.random() * 10)) }, 120)

  const errors: string[] = []
  const failed = new Set<MotionSpecKey>()
  const ext = (file.name.split('.').pop() || '').toLowerCase()
  if (!['mov', 'mp4'].includes(ext)) { errors.push(`File type ${ext ? '.' + ext : 'unknown'} — needs .mov or .mp4.`); failed.add('format') }

  const probe = errors.length ? null : await probeMotionArtwork(file).catch(() => null)
  if (!errors.length && !probe) { errors.push("Not a readable .mov or .mp4 file."); failed.add('format') }

  if (probe) {
    if (!probe.codecTag || !ALLOWED_CODEC_TAGS.has(probe.codecTag)) {
      errors.push(`Codec ${probe.codecLabel} — needs ProRes 422/4444 or H.264.`); failed.add('codec')
    }
    if (probe.width !== meta.value.width || probe.height !== meta.value.height) {
      const isOther = probe.width === other.value.width && probe.height === other.value.height
      errors.push(isOther
        ? `This is the ${other.value.title.toLowerCase()} file — move it to the ${other.value.title} slot.`
        : `Resolution ${probe.width}×${probe.height} — needs ${meta.value.width}×${meta.value.height}.`)
      failed.add('resolution')
    }
    if (probe.fps !== null && !ALLOWED_FPS.some(f => near(probe.fps as number, f))) {
      errors.push(`Frame rate ${+probe.fps.toFixed(3)} fps — not one of Apple's rates.`); failed.add('fps')
    }
    if (probe.duration !== null && (probe.duration < 8 || probe.duration > 35)) {
      errors.push(`Length ${probe.duration.toFixed(1)}s — needs 8 to 35 seconds.`); failed.add('duration')
    }
    if (probe.hasAudio) { errors.push('Has an audio track — remove it.'); failed.add('audio') }
    if (probe.colour && !(probe.colour.primaries === 1 && [1, 13].includes(probe.colour.transfer))) {
      errors.push('Colour profile — needs Rec. 709 or sRGB.'); failed.add('colour')
    }
    if (probe.pixelAspect && probe.pixelAspect.h !== probe.pixelAspect.v) {
      errors.push(`Pixel aspect ${probe.pixelAspect.h}:${probe.pixelAspect.v} — needs square pixels.`); failed.add('pixels')
    }
    const isH264 = probe.codecTag === 'avc1' || probe.codecTag === 'avc3'
    if (isH264 && probe.bitrateMbps !== null && (probe.bitrateMbps < 45 || probe.bitrateMbps > 100)) {
      errors.push(`Bitrate ${Math.round(probe.bitrateMbps)} Mbps — needs 45 to 100 Mbps.`); failed.add('bitrate')
    }

    m.summary = [
      probe.codecLabel,
      `${probe.width}×${probe.height}`,
      probe.fps !== null ? `${+probe.fps.toFixed(3)} fps` : null,
      probe.duration !== null ? `${+probe.duration.toFixed(1)}s` : null,
      probe.bitrateMbps !== null ? `${Math.round(probe.bitrateMbps)} Mbps` : null,
    ].filter(Boolean).join(' · ')
    const notes: string[] = []
    if (!probe.colour) notes.push('no colour profile is tagged in the file, so Rec. 709/sRGB is confirmed on delivery')
    if (!isH264 && probe.bitrateMbps !== null) notes.push(`Apple's 45–100 Mbps range applies to H.264 exports; this ProRes file is ${Math.round(probe.bitrateMbps)} Mbps`)
    if (notes.length) m.unverified = notes.join('. ').replace(/^./, c => c.toUpperCase()) + '.'
  }

  clearInterval(tick)
  progress.value = 100
  await new Promise(r => setTimeout(r, 250))
  m.errors = errors
  m.status = errors.length ? 'invalid' : 'valid'
  emit('checked', failed)
}

const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files && input.files[0]) handleFile(input.files[0])
}
const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0])
}
</script>
