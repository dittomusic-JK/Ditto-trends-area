<template>
  <!-- Optional Apple Music motion artwork. Lives on the Artwork step behind a
       toggle, beneath the still cover — no extra stage. Apple Music only. -->
  <div class="mt-14 max-w-4xl mx-auto border-t border-gray-200 pt-10">
    <div class="flex items-start justify-between gap-6">
      <div>
        <h2 class="font-satoshi font-black text-xl lg:text-2xl tracking-[-0.03em] text-ditto-text flex items-center flex-wrap gap-x-3 gap-y-1">
          <span>Add <span class="text-ditto-purple">motion artwork</span> for Apple Music?</span>
          <span class="inline-flex items-center text-[10px] font-bold uppercase tracking-[1.4px] text-ditto-subtext bg-ditto-light-grey rounded-full px-2 py-0.5 font-sans">Optional</span>
        </h2>
        <p class="text-sm text-ditto-subtext mt-2 max-w-xl leading-relaxed">
          A short looping video version of your cover. It's only distributed to Apple Music — every other store keeps the still artwork.
          <a href="https://help.apple.com/itc/albummotionguide/en.lproj/static.html" target="_blank" rel="noopener" class="text-ditto-purple hover:underline">Apple's motion artwork guide</a>
        </p>
      </div>
      <button
        type="button"
        @click="toggle"
        :class="['w-[51px] h-[31px] rounded-full relative transition-colors flex-shrink-0', ma.enabled ? 'bg-[#34c759]' : 'bg-[#e9e9eb]']"
        :aria-pressed="ma.enabled"
        aria-label="Add motion artwork"
      >
        <span :class="['absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform', ma.enabled ? 'translate-x-[20px]' : 'translate-x-0']"></span>
      </button>
    </div>

    <div v-if="ma.enabled" class="mt-6 grid lg:grid-cols-[minmax(0,1fr)_300px] gap-8 items-start">
      <!-- ── Left: upload / checking / valid / invalid ── -->
      <div>
        <!-- Invalid: must remove or replace before continuing -->
        <div v-if="ma.status === 'invalid'" class="border-2 border-dashed border-error/40 bg-error/5 rounded-2xl p-6">
          <div class="flex items-start gap-3">
            <span class="w-9 h-9 rounded-full bg-error/10 flex items-center justify-center flex-shrink-0">
              <svg class="w-4.5 h-4.5 w-[18px] h-[18px] text-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </span>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-error">This file doesn't meet Apple's motion artwork specification</p>
              <p class="text-xs text-ditto-subtext mt-0.5 truncate">{{ ma.fileName }} · {{ ma.fileSize }}</p>
              <ul class="mt-3 space-y-1.5">
                <li v-for="err in ma.errors" :key="err" class="flex items-start gap-2 text-xs text-ditto-text">
                  <svg class="w-3.5 h-3.5 text-error flex-shrink-0 mt-px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  {{ err }}
                </li>
              </ul>
              <p class="text-xs text-ditto-subtext mt-3">Your release can't continue with invalid motion artwork — remove it or replace it to carry on.</p>
              <div class="flex items-center gap-2 mt-4">
                <button @click="triggerFileInput" class="px-4 py-2 rounded-full bg-ditto-purple text-white text-xs font-semibold hover:bg-ditto-purple/90 transition-colors">Replace file</button>
                <button @click="removeFile" class="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-ditto-text hover:border-error hover:text-error transition-colors">Remove</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Checking -->
        <div v-else-if="ma.status === 'checking'" class="border-2 border-dashed border-ditto-purple/30 bg-ditto-purple/5 rounded-2xl p-6">
          <p class="text-sm font-medium text-ditto-text truncate">{{ ma.fileName }}</p>
          <p class="text-xs text-ditto-subtext">{{ ma.fileSize }}</p>
          <div class="flex items-center justify-between text-xs text-ditto-subtext mt-4 mb-1">
            <span>Checking against Apple's specification…</span>
            <span>{{ progress }}%</span>
          </div>
          <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div class="h-full bg-ditto-purple rounded-full transition-all duration-300" :style="{ width: progress + '%' }"></div>
          </div>
        </div>

        <!-- Valid: preview + file chip -->
        <div v-else-if="ma.status === 'valid'" class="flex flex-col sm:flex-row gap-5 items-start">
          <div class="w-44 flex-shrink-0 border border-gray-200 rounded-2xl p-2 bg-white">
            <video
              v-if="ma.previewUrl && !previewFailed"
              :src="ma.previewUrl"
              class="w-full rounded-xl bg-black object-cover"
              :class="ma.orientation === 'portrait' ? 'aspect-[3/4]' : 'aspect-square'"
              autoplay muted loop playsinline
              @error="previewFailed = true"
            ></video>
            <div v-else class="w-full aspect-square rounded-xl bg-ditto-light-grey flex flex-col items-center justify-center gap-2 text-center px-3">
              <svg class="w-6 h-6 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><polygon points="10,8 16,12 10,16"/></svg>
              <p class="text-[11px] text-ditto-subtext leading-snug">ProRes can't play in the browser — the preview appears after delivery.</p>
            </div>
          </div>
          <div class="flex-1 min-w-0 w-full">
            <div class="flex items-center gap-3 p-4 rounded-xl bg-ditto-light-grey border border-gray-100">
              <div class="w-10 h-10 rounded-lg bg-ditto-purple/10 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-ditto-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><polygon points="10,8 16,12 10,16"/></svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-ditto-text truncate">{{ ma.fileName }}</p>
                <p class="text-xs text-ditto-subtext">{{ ma.fileSize }}<template v-if="ma.summary"> · {{ ma.summary }}</template></p>
              </div>
              <button @click="removeFile" class="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors" aria-label="Remove motion artwork">
                <svg class="w-4 h-4 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <p class="mt-3 inline-flex items-center gap-2 text-xs font-medium text-[#006633] bg-[#00e785]/10 px-3 py-1.5 rounded-full">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Meets Apple's specification
            </p>
            <p v-if="ma.unverified" class="text-xs text-ditto-subtext mt-2 leading-relaxed">{{ ma.unverified }}</p>
            <button @click="triggerFileInput" class="mt-3 text-xs font-medium text-ditto-purple hover:underline">Replace file</button>
          </div>
        </div>

        <!-- Idle drop zone -->
        <div
          v-else
          @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false"
          @drop.prevent="handleDrop"
          :class="['border-2 border-dashed rounded-2xl p-10 text-center transition-all', isDragging ? 'border-ditto-purple bg-ditto-purple/5' : 'border-gray-300 hover:border-ditto-purple/50']"
        >
          <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-ditto-light-grey flex items-center justify-center">
            <svg class="w-6 h-6 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><polygon points="10,8 16,12 10,16"/></svg>
          </div>
          <p class="text-sm text-ditto-text mb-1">
            Drag and drop your motion artwork here or
            <button @click="triggerFileInput" class="text-ditto-purple font-medium hover:underline">browse your files</button>
          </p>
          <p class="text-xs text-ditto-subtext">.mov or .mp4 · ProRes 422/4444 or H.264 · 8–35 seconds · no audio</p>
        </div>

        <input ref="fileInputRef" type="file" accept=".mov,.mp4,video/quicktime,video/mp4" class="hidden" @change="handleFileSelect" />
      </div>

      <!-- ── Right: the specification ── -->
      <aside class="rounded-2xl border border-gray-200 p-5">
        <p class="text-xs font-semibold text-ditto-subtext uppercase tracking-wide mb-3">Apple's specification</p>
        <ul class="space-y-2">
          <li v-for="spec in specs" :key="spec.label" class="flex items-start gap-2 text-xs">
            <svg class="w-3.5 h-3.5 flex-shrink-0 mt-px" :class="specState(spec.key) === 'fail' ? 'text-error' : specState(spec.key) === 'pass' ? 'text-[#00b368]' : 'text-ditto-subtext/60'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <template v-if="specState(spec.key) === 'fail'"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></template>
              <polyline v-else points="20 6 9 17 4 12"/>
            </svg>
            <span :class="specState(spec.key) === 'fail' ? 'text-error' : 'text-ditto-text'"><span class="font-medium">{{ spec.label }}</span> <span class="text-ditto-subtext">— {{ spec.value }}</span></span>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ReleaseBuilderForm } from '../ReleaseBuilderView.vue'
import { probeMotionArtwork, ALLOWED_CODEC_TAGS } from '../motionArtworkProbe'

const props = defineProps<{ form: ReleaseBuilderForm }>()
const ma = computed(() => props.form.motionArtwork)

type SpecKey = 'format' | 'codec' | 'resolution' | 'fps' | 'colour' | 'duration' | 'audio' | 'pixels' | 'bitrate'
const specs: { key: SpecKey; label: string; value: string }[] = [
  { key: 'format', label: 'File type', value: '.mov or .mp4' },
  { key: 'codec', label: 'Codec', value: 'Apple ProRes 422 / 4444, or H.264' },
  { key: 'resolution', label: 'Resolution', value: '3840×3840 (1:1) or 2048×2732 (3:4)' },
  { key: 'fps', label: 'Frame rate', value: '23.976, 24, 25, 29.97 or 30 fps' },
  { key: 'duration', label: 'Length', value: '8 to 35 seconds' },
  { key: 'audio', label: 'Audio', value: 'No audio track' },
  { key: 'colour', label: 'Colour profile', value: 'Rec. 709 or sRGB' },
  { key: 'pixels', label: 'Pixel aspect', value: '1:1 (square pixels)' },
  { key: 'bitrate', label: 'Bitrate', value: '45–100 Mbps (H.264 exports)' },
]

const failedKeys = ref<Set<SpecKey>>(new Set())
const specState = (key: SpecKey): 'idle' | 'pass' | 'fail' => {
  if (ma.value.status === 'invalid') return failedKeys.value.has(key) ? 'fail' : 'pass'
  if (ma.value.status === 'valid') return 'pass'
  return 'idle'
}

const isDragging = ref(false)
const progress = ref(0)
const previewFailed = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const triggerFileInput = () => fileInputRef.value?.click()

const toggle = () => {
  props.form.motionArtwork.enabled = !props.form.motionArtwork.enabled
  if (!props.form.motionArtwork.enabled) removeFile()
}

const formatFileSize = (bytes: number) =>
  bytes >= 1048576 ? (bytes / 1048576).toFixed(1) + ' MB' : (bytes / 1024).toFixed(0) + ' KB'

const removeFile = () => {
  const m = props.form.motionArtwork
  if (m.previewUrl) URL.revokeObjectURL(m.previewUrl)
  m.file = null; m.previewUrl = null; m.fileName = ''; m.fileSize = ''
  m.status = ''; m.errors = []; m.summary = ''; m.unverified = ''; m.orientation = 'square'
  failedKeys.value = new Set()
  previewFailed.value = false
  if (fileInputRef.value) fileInputRef.value.value = ''
}

// Validation reads the container header directly (see motionArtworkProbe.ts), so a
// ProRes file the browser can't decode is still checked against every spec Apple lists.
const ALLOWED_FPS = [23.976, 24, 25, 29.97, 30]
const near = (a: number, b: number, tol = 0.02) => Math.abs(a - b) <= tol

const handleFile = async (file: File) => {
  const m = props.form.motionArtwork
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
  const failed = new Set<SpecKey>()
  const ext = (file.name.split('.').pop() || '').toLowerCase()
  if (!['mov', 'mp4'].includes(ext)) { errors.push(`File must be a .mov or .mp4 — this is ${ext ? '.' + ext : 'an unknown type'}.`); failed.add('format') }

  const probe = errors.length ? null : await probeMotionArtwork(file).catch(() => null)
  if (!errors.length && !probe) { errors.push("We couldn't read this file as a QuickTime or MP4 container."); failed.add('format') }

  if (probe) {
    if (!probe.codecTag || !ALLOWED_CODEC_TAGS.has(probe.codecTag)) {
      errors.push(`Codec is ${probe.codecLabel} — it must be Apple ProRes 422 or 4444, or H.264.`); failed.add('codec')
    }
    const square = probe.width === 3840 && probe.height === 3840
    const portrait = probe.width === 2048 && probe.height === 2732
    if (!square && !portrait) { errors.push(`Resolution is ${probe.width}×${probe.height} — it must be 3840×3840 (1:1) or 2048×2732 (3:4).`); failed.add('resolution') }
    if (probe.fps !== null && !ALLOWED_FPS.some(f => near(probe.fps as number, f))) {
      errors.push(`Frame rate is ${+probe.fps.toFixed(3)} fps — it must be 23.976, 24, 25, 29.97 or 30 fps.`); failed.add('fps')
    }
    if (probe.duration !== null && (probe.duration < 8 || probe.duration > 35)) {
      errors.push(`Length is ${probe.duration.toFixed(1)}s — it must be between 8 and 35 seconds.`); failed.add('duration')
    }
    if (probe.hasAudio) { errors.push('The file has an audio track — deliver motion artwork without audio.'); failed.add('audio') }
    if (probe.colour && !(probe.colour.primaries === 1 && [1, 13].includes(probe.colour.transfer))) {
      errors.push('Colour profile isn\'t Rec. 709 or sRGB.'); failed.add('colour')
    }
    if (probe.pixelAspect && probe.pixelAspect.h !== probe.pixelAspect.v) {
      errors.push(`Pixel aspect ratio is ${probe.pixelAspect.h}:${probe.pixelAspect.v} — pixels must be square (1:1).`); failed.add('pixels')
    }
    const isH264 = probe.codecTag === 'avc1' || probe.codecTag === 'avc3'
    if (isH264 && probe.bitrateMbps !== null && (probe.bitrateMbps < 45 || probe.bitrateMbps > 100)) {
      errors.push(`Bitrate is ${Math.round(probe.bitrateMbps)} Mbps — H.264 must be between 45 and 100 Mbps.`); failed.add('bitrate')
    }

    m.orientation = portrait ? 'portrait' : 'square'
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
  failedKeys.value = failed
  m.errors = errors
  m.status = errors.length ? 'invalid' : 'valid'
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
