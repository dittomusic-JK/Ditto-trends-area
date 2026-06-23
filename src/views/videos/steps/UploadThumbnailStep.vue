<template>
  <div>
    <h2 class="font-satoshi font-black tracking-[-0.03em] text-xl lg:text-2xl text-ditto-text mb-5">Upload your thumbnail</h2>

    <!-- Source Tabs -->
    <div class="flex gap-1 p-1 bg-ditto-light-grey rounded-xl mb-6 w-fit">
      <button
        @click="activeTab = 'upload'"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-all',
          activeTab === 'upload' ? 'bg-white text-ditto-text shadow-sm' : 'text-ditto-subtext hover:text-ditto-text'
        ]"
      >
        <span class="flex items-center gap-1.5">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="17 8 12 3 7 8" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="12" y1="3" x2="12" y2="15" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Upload Image
        </span>
      </button>
      <button
        @click="activeTab = 'capture'"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-all',
          activeTab === 'capture' ? 'bg-white text-ditto-text shadow-sm' : 'text-ditto-subtext hover:text-ditto-text'
        ]"
      >
        <span class="flex items-center gap-1.5">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <polygon points="10,8 16,12 10,16"/>
          </svg>
          Capture from Video
        </span>
      </button>
    </div>

    <!-- ===================== UPLOAD TAB ===================== -->
    <template v-if="activeTab === 'upload'">
      <!-- Drop Zone -->
      <div
        v-if="!isUploaded"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop.prevent="handleDrop"
        :class="[
          'border-2 border-dashed rounded-2xl p-10 lg:p-16 text-center transition-all',
          isDragging ? 'border-ditto-purple bg-ditto-purple/5' : 'border-gray-300 hover:border-ditto-purple/50'
        ]"
      >
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-ditto-light-grey flex items-center justify-center">
          <svg class="w-7 h-7 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/>
          </svg>
        </div>

        <p class="text-sm text-ditto-text mb-1">
          Drag and drop your thumbnail here or
          <button @click="triggerFileInput" class="text-ditto-purple font-medium hover:underline">browse your files</button>
        </p>
        <p class="text-xs text-ditto-subtext">JPG or PNG only &middot; 16:9, 9:16 or 4:3 &middot; 1920&times;1080 to 4500&times;4500px</p>

        <input
          ref="fileInputRef"
          type="file"
          accept=".jpg,.jpeg,.png"
          class="hidden"
          @change="handleFileSelect"
        />

        <!-- Upload Progress -->
        <div v-if="isUploading" class="mt-6 max-w-md mx-auto">
          <div class="flex items-center justify-between text-xs text-ditto-subtext mb-1">
            <span>Uploading...</span>
            <span>{{ uploadProgress }}%</span>
          </div>
          <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-ditto-purple rounded-full transition-all duration-300"
              :style="{ width: uploadProgress + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Thumbnail Preview (uploaded) -->
      <div v-else class="space-y-4">
        <div class="flex items-center gap-3 p-4 rounded-xl bg-ditto-light-grey border border-gray-100">
          <div class="w-10 h-10 rounded-lg bg-ditto-purple/10 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-ditto-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-ditto-text truncate">{{ fileName }}</p>
            <p class="text-xs text-ditto-subtext">{{ fileSize }}</p>
          </div>
          <button @click="removeFile" class="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors">
            <svg class="w-4 h-4 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Preview -->
        <div class="aspect-video rounded-2xl bg-gray-100 overflow-hidden">
          <img v-if="previewUrl" :src="previewUrl" alt="Thumbnail preview" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center">
            <p class="text-sm text-ditto-subtext">Thumbnail Preview</p>
          </div>
        </div>
      </div>
    </template>

    <!-- ===================== CAPTURE TAB ===================== -->
    <template v-else>
      <!-- No video yet -->
      <div v-if="!hasVideo" class="border-2 border-dashed border-gray-300 rounded-2xl p-10 lg:p-16 text-center">
        <div class="w-14 h-14 mx-auto mb-3 rounded-full bg-ditto-light-grey flex items-center justify-center">
          <svg class="w-6 h-6 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="4" width="20" height="16" rx="2"/><polygon points="10,8 16,12 10,16"/>
          </svg>
        </div>
        <p class="text-sm text-ditto-text font-medium mb-1">No video to capture from yet</p>
        <p class="text-xs text-ditto-subtext">Upload a video first to enable the &ldquo;Capture from Video&rdquo; option.</p>
      </div>

      <!-- Capture from the uploaded video -->
      <div v-else class="space-y-4">
        <!-- Video frame -->
        <div class="aspect-video rounded-2xl bg-black overflow-hidden">
          <video
            ref="captureVideoRef"
            :src="videoUrl || undefined"
            class="w-full h-full object-contain"
            muted
            playsinline
            preload="auto"
            @loadedmetadata="onLoadedMetadata"
            @seeked="onSeeked"
          ></video>
        </div>

        <!-- YouTube-style scrubber with hover preview -->
        <div class="space-y-3">
          <div class="relative pt-1 pb-1">
            <!-- Hover / scrub preview -->
            <div
              v-if="(hovering || isScrubbing) && duration"
              class="absolute bottom-full mb-3 z-10 pointer-events-none"
              :style="{ left: tooltipLeft + 'px' }"
            >
              <div class="w-40 rounded-lg overflow-hidden border border-white/10 shadow-xl bg-black">
                <div class="aspect-video bg-gray-900">
                  <img v-if="hoverThumb" :src="hoverThumb" alt="" class="w-full h-full object-cover" />
                </div>
              </div>
              <p class="text-center text-[11px] font-mono text-ditto-text mt-1">{{ formatTimestamp(hoverTime, true) }}</p>
            </div>

            <!-- Track -->
            <div
              ref="trackRef"
              @mousemove="onTrackHover"
              @mouseleave="hovering = false"
              @mousedown="onTrackDown"
              class="group relative h-2 rounded-full bg-gray-200 cursor-pointer select-none"
            >
              <!-- buffered/full track is the gray bg; played fill -->
              <div class="absolute inset-y-0 left-0 rounded-full bg-ditto-purple" :style="{ width: playedPct + '%' }"></div>
              <!-- hover position marker -->
              <div v-if="hovering && !isScrubbing" class="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-white/70 rounded" :style="{ left: hoverX + 'px' }"></div>
              <!-- handle -->
              <div
                class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-ditto-purple shadow-md ring-2 ring-white transition-transform group-hover:scale-110"
                :style="{ left: playedPct + '%' }"
              ></div>
            </div>
          </div>

          <div class="flex items-center justify-between gap-3 flex-wrap">
            <!-- Frame-step controls -->
            <div class="flex items-center gap-1">
              <button @click="step(-1)" class="px-2.5 h-8 rounded-lg border border-gray-200 text-xs text-ditto-text hover:border-ditto-purple/40 transition-colors" title="Back 1 second">−1s</button>
              <button @click="step(-frameStep)" class="px-2.5 h-8 rounded-lg border border-gray-200 text-xs text-ditto-text hover:border-ditto-purple/40 transition-colors" title="Previous frame">‹ frame</button>
              <button @click="step(frameStep)" class="px-2.5 h-8 rounded-lg border border-gray-200 text-xs text-ditto-text hover:border-ditto-purple/40 transition-colors" title="Next frame">frame ›</button>
              <button @click="step(1)" class="px-2.5 h-8 rounded-lg border border-gray-200 text-xs text-ditto-text hover:border-ditto-purple/40 transition-colors" title="Forward 1 second">+1s</button>
            </div>

            <!-- Editable timestamp -->
            <div class="flex items-center gap-2">
              <label class="text-xs text-ditto-subtext">Timestamp</label>
              <input
                :value="timeInput"
                @change="onTimeInputChange(($event.target as HTMLInputElement).value)"
                @keydown.enter="onTimeInputChange(($event.target as HTMLInputElement).value)"
                type="text"
                inputmode="decimal"
                placeholder="0:00.00"
                class="w-24 px-2 py-1.5 rounded-lg border border-gray-200 text-sm text-ditto-text font-mono text-center focus:outline-none focus:border-ditto-purple transition-colors"
              />
              <span class="text-xs text-ditto-subtext font-mono">/ {{ formatTimestamp(duration, true) }}</span>
            </div>
          </div>
        </div>

        <!-- Capture action -->
        <div class="flex items-center gap-3">
          <button
            @click="captureFrame"
            class="px-4 py-2.5 rounded-full bg-ditto-purple text-white text-sm font-medium hover:bg-ditto-purple/90 transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/>
            </svg>
            {{ capturedTime === null ? 'Use this frame' : 'Update frame' }}
          </button>
          <p class="text-xs text-ditto-subtext">Scrub or step to the exact frame, then capture it.</p>
        </div>

        <!-- Captured confirmation -->
        <div v-if="capturedTime !== null" class="flex items-center gap-3 p-3 rounded-xl bg-success/10 border border-success/20">
          <img v-if="capturedPreview" :src="capturedPreview" alt="Captured frame" class="w-20 aspect-video object-cover rounded-md flex-shrink-0" />
          <div>
            <p class="text-sm font-medium text-success">Frame captured at {{ formatTimestamp(capturedTime, true) }}</p>
            <p class="text-xs text-ditto-subtext mt-0.5">This frame will be used as your video thumbnail.</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'

const props = defineProps<{
  thumbnailFile: File | null
  videoFile: File | null
}>()

const emit = defineEmits<{
  (e: 'update:thumbnailFile', file: File | null): void
  (e: 'uploaded'): void
}>()

const activeTab = ref<'upload' | 'capture'>('upload')
const hasVideo = computed(() => props.videoFile !== null)

// ---- Upload Tab ----
const isDragging = ref(false)
const isUploading = ref(false)
const isUploaded = ref(props.thumbnailFile !== null)
const uploadProgress = ref(0)
const fileName = ref(props.thumbnailFile?.name || '')
const fileSize = ref('')
const previewUrl = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)

const triggerFileInput = () => fileInputRef.value?.click()

const formatFileSize = (bytes: number): string => {
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB'
  return (bytes / 1024).toFixed(0) + ' KB'
}

const simulateUpload = (file: File) => {
  fileName.value = file.name
  fileSize.value = formatFileSize(file.size)
  isUploading.value = true
  uploadProgress.value = 0

  const reader = new FileReader()
  reader.onload = (e) => { previewUrl.value = e.target?.result as string }
  reader.readAsDataURL(file)

  const interval = setInterval(() => {
    uploadProgress.value += Math.random() * 20 + 10
    if (uploadProgress.value >= 100) {
      uploadProgress.value = 100
      clearInterval(interval)
      setTimeout(() => {
        isUploading.value = false
        isUploaded.value = true
        capturedTime.value = null
        emit('update:thumbnailFile', file)
        emit('uploaded')
      }, 300)
    }
  }, 150)
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) simulateUpload(input.files[0])
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) simulateUpload(event.dataTransfer.files[0])
}

const removeFile = () => {
  isUploaded.value = false
  fileName.value = ''
  fileSize.value = ''
  previewUrl.value = ''
  emit('update:thumbnailFile', null)
}

// ---- Capture Tab ----
const captureVideoRef = ref<HTMLVideoElement | null>(null)
const videoUrl = ref<string | null>(null)
const duration = ref(0)
const currentTime = ref(0)
const capturedTime = ref<number | null>(null)
const capturedPreview = ref('')
const timeInput = ref('0:00.00')
const frameStep = 1 / 30 // ~one frame at 30fps

// Storyboard frames for the hover preview (YouTube-style precise seeking).
const storyboard = ref<{ t: number; url: string }[]>([])

// Scrubber state
const trackRef = ref<HTMLElement | null>(null)
const trackWidth = ref(0)
const hovering = ref(false)
const isScrubbing = ref(false)
const hoverTime = ref(0)
const hoverX = ref(0)

const playedPct = computed(() => duration.value ? (currentTime.value / duration.value) * 100 : 0)
const tooltipLeft = computed(() => {
  const w = 160 // preview width (w-40)
  return Math.max(0, Math.min(hoverX.value - w / 2, Math.max(0, trackWidth.value - w)))
})
const hoverThumb = computed(() => {
  if (!storyboard.value.length) return ''
  let best = storyboard.value[0]
  for (const f of storyboard.value) {
    if (Math.abs(f.t - hoverTime.value) < Math.abs(best.t - hoverTime.value)) best = f
  }
  return best.url
})

// Manage the object URL for the uploaded video + reset capture state on change.
watch(() => props.videoFile, (file) => {
  if (videoUrl.value) { URL.revokeObjectURL(videoUrl.value); videoUrl.value = null }
  duration.value = 0
  currentTime.value = 0
  storyboard.value = []
  hovering.value = false
  isScrubbing.value = false
  capturedTime.value = null
  capturedPreview.value = ''
  timeInput.value = '0:00.00'
  if (file) videoUrl.value = URL.createObjectURL(file)
}, { immediate: true })

onUnmounted(() => {
  if (videoUrl.value) URL.revokeObjectURL(videoUrl.value)
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragUp)
})

// ---- Scrubber interactions ----
const timeFromClientX = (clientX: number) => {
  const el = trackRef.value
  if (!el) return 0
  const rect = el.getBoundingClientRect()
  trackWidth.value = rect.width
  const ratio = Math.max(0, Math.min((clientX - rect.left) / rect.width, 1))
  hoverX.value = ratio * rect.width
  return ratio * duration.value
}

const onTrackHover = (e: MouseEvent) => {
  if (!duration.value) return
  hoverTime.value = timeFromClientX(e.clientX)
  hovering.value = true
}

const onTrackDown = (e: MouseEvent) => {
  if (!duration.value) return
  isScrubbing.value = true
  hoverTime.value = timeFromClientX(e.clientX)
  seek(hoverTime.value)
  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', onDragUp)
}

const onDragMove = (e: MouseEvent) => {
  hoverTime.value = timeFromClientX(e.clientX)
  hovering.value = true
  seek(hoverTime.value)
}

const onDragUp = () => {
  isScrubbing.value = false
  hovering.value = false
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragUp)
}

const formatTimestamp = (seconds: number, withFraction = false): string => {
  if (!seconds || seconds < 0) seconds = 0
  const mins = Math.floor(seconds / 60)
  const whole = Math.floor(seconds % 60)
  if (!withFraction) return `${mins}:${String(whole).padStart(2, '0')}`
  const frac = Math.round((seconds - Math.floor(seconds)) * 100)
  return `${mins}:${String(whole).padStart(2, '0')}.${String(frac).padStart(2, '0')}`
}

const parseTimestamp = (str: string): number | null => {
  const s = str.trim()
  if (!s) return null
  if (s.includes(':')) {
    const [m, sec] = s.split(':')
    const mins = parseInt(m, 10)
    const secs = parseFloat(sec)
    if (isNaN(mins) || isNaN(secs)) return null
    return mins * 60 + secs
  }
  const v = parseFloat(s)
  return isNaN(v) ? null : v
}

const seek = (t: number) => {
  const clamped = Math.max(0, Math.min(t, duration.value || 0))
  currentTime.value = clamped
  timeInput.value = formatTimestamp(clamped, true)
  if (captureVideoRef.value) captureVideoRef.value.currentTime = clamped
}

const step = (delta: number) => seek(currentTime.value + delta)

const onTimeInputChange = (value: string) => {
  const parsed = parseTimestamp(value)
  if (parsed !== null) seek(parsed)
  else timeInput.value = formatTimestamp(currentTime.value, true)
}

const onSeeked = () => {
  if (captureVideoRef.value) {
    currentTime.value = captureVideoRef.value.currentTime
    timeInput.value = formatTimestamp(currentTime.value, true)
  }
}

const onLoadedMetadata = () => {
  if (!captureVideoRef.value) return
  duration.value = captureVideoRef.value.duration || 0
  generateStoryboard()
}

// Build a storyboard of real frames from a detached video element (so the
// main preview isn't disturbed) to drive the scrubber hover preview.
const generateStoryboard = async () => {
  if (!videoUrl.value) return
  const url = videoUrl.value
  const gen = document.createElement('video')
  gen.src = url
  gen.muted = true
  gen.preload = 'auto'

  await new Promise<void>((resolve) => {
    gen.onloadedmetadata = () => resolve()
    gen.onerror = () => resolve()
  })
  const dur = gen.duration || 0
  if (!dur) return

  const canvas = document.createElement('canvas')
  canvas.width = 160
  canvas.height = 90
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Denser sampling for smooth hover scrubbing, capped for performance.
  const count = Math.min(40, Math.max(12, Math.round(dur / 3)))
  const frames: { t: number; url: string }[] = []
  for (let i = 0; i < count; i++) {
    const t = Math.min((dur * i) / (count - 1), Math.max(0, dur - 0.05))
    if (videoUrl.value !== url) return // video changed mid-generation
    await new Promise<void>((resolve) => {
      gen.onseeked = () => resolve()
      gen.currentTime = t
    })
    try {
      ctx.drawImage(gen, 0, 0, canvas.width, canvas.height)
      frames.push({ t, url: canvas.toDataURL('image/jpeg', 0.55) })
    } catch {
      // ignore a frame that failed to draw
    }
    // publish incrementally so the preview works before the full set is ready
    if (videoUrl.value === url) storyboard.value = [...frames]
  }
}

const captureFrame = () => {
  const v = captureVideoRef.value
  if (!v) return
  const canvas = document.createElement('canvas')
  canvas.width = v.videoWidth || 1920
  canvas.height = v.videoHeight || 1080
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.drawImage(v, 0, 0, canvas.width, canvas.height)
  capturedPreview.value = canvas.toDataURL('image/jpeg', 0.92)
  const stamp = currentTime.value
  canvas.toBlob((blob) => {
    if (!blob) return
    const file = new File([blob], `frame-${stamp.toFixed(2)}s.jpg`, { type: 'image/jpeg' })
    capturedTime.value = stamp
    emit('update:thumbnailFile', file)
    emit('uploaded')
  }, 'image/jpeg', 0.92)
}
</script>
