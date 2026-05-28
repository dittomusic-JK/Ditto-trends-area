<template>
  <div>
    <h2 class="font-poppins font-bold text-xl lg:text-2xl text-ditto-text mb-2">Upload your thumbnail</h2>
    <p class="text-sm text-ditto-subtext mb-6">
      Upload a thumbnail image or capture a frame from your video. 16:9 aspect ratio, 1920x1080 or higher.
    </p>

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
        @click="handleCaptureTab"
        :disabled="!hasVideo"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-all',
          !hasVideo
            ? 'text-gray-300 cursor-not-allowed'
            : activeTab === 'capture'
              ? 'bg-white text-ditto-text shadow-sm'
              : 'text-ditto-subtext hover:text-ditto-text'
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
        <p class="text-xs text-ditto-subtext">JPG or PNG only. 16:9 aspect ratio, 1920x1080 or higher.</p>

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
    <template v-if="activeTab === 'capture'">
      <!-- Video Preview Area -->
      <div class="aspect-video rounded-2xl bg-gray-900 mb-4 relative overflow-hidden">
        <div class="absolute inset-0 flex items-center justify-center" :class="selectedFrameGradient">
          <div v-if="selectedTimestamp === null" class="text-center">
            <svg class="w-12 h-12 text-white/20 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/>
            </svg>
            <p class="text-sm text-white/40">Select a frame below</p>
          </div>
          <div v-else class="text-center">
            <div class="w-16 h-16 rounded-full bg-ditto-purple/20 flex items-center justify-center mb-2 mx-auto">
              <svg class="w-8 h-8 text-ditto-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/>
              </svg>
            </div>
            <p class="text-sm text-white/60 font-medium">Frame at {{ formatTimestamp(selectedTimestamp) }}</p>
            <p class="text-xs text-white/30 mt-1">Selected as thumbnail</p>
          </div>
        </div>

        <!-- Timeline scrubber overlay -->
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <div class="flex items-center gap-2">
            <span class="text-[10px] text-white/60 font-mono">0:00</span>
            <div class="flex-1 h-1 bg-white/20 rounded-full relative">
              <div
                v-if="selectedTimestamp !== null"
                class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-ditto-purple rounded-full border-2 border-white shadow-lg transition-all duration-200"
                :style="{ left: `calc(${(selectedTimestamp / totalDuration) * 100}% - 6px)` }"
              ></div>
            </div>
            <span class="text-[10px] text-white/60 font-mono">{{ formatTimestamp(totalDuration) }}</span>
          </div>
        </div>
      </div>

      <!-- Frame Thumbnails -->
      <p class="text-xs font-medium text-ditto-subtext uppercase tracking-wide mb-2">Select a frame</p>
      <div class="grid grid-cols-4 sm:grid-cols-8 gap-2">
        <button
          v-for="frame in frameOptions"
          :key="frame.timestamp"
          @click="selectFrame(frame)"
          :class="[
            'aspect-video rounded-lg overflow-hidden border-2 transition-all relative',
            selectedTimestamp === frame.timestamp
              ? 'border-ditto-purple ring-2 ring-ditto-purple/20'
              : 'border-gray-200 hover:border-gray-300'
          ]"
        >
          <div class="absolute inset-0" :class="frame.gradient"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-[10px] font-mono text-white/80 bg-black/40 px-1 py-0.5 rounded">
              {{ formatTimestamp(frame.timestamp) }}
            </span>
          </div>
        </button>
      </div>

      <!-- Captured confirmation -->
      <div v-if="selectedTimestamp !== null" class="mt-4 p-3 rounded-xl bg-success/10 border border-success/20 flex items-center gap-2">
        <svg class="w-4 h-4 text-success flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke-linecap="round" stroke-linejoin="round"/>
          <polyline points="22,4 12,14.01 9,11.01" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p class="text-xs text-success font-medium">Frame captured at {{ formatTimestamp(selectedTimestamp) }}. This will be used as your video thumbnail.</p>
      </div>
    </template>

    <!-- No video hint (when capture tab is disabled) -->
    <div v-if="!hasVideo && activeTab === 'upload'" class="mt-4 p-3 rounded-xl bg-ditto-light-grey flex items-center gap-2">
      <svg class="w-4 h-4 text-ditto-subtext flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
      </svg>
      <p class="text-xs text-ditto-subtext">Upload a video first to enable the "Capture from Video" option.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  thumbnailFile: File | null
  hasVideo: boolean
}>()

const emit = defineEmits<{
  (e: 'update:thumbnailFile', file: File | null): void
  (e: 'uploaded'): void
}>()

const activeTab = ref<'upload' | 'capture'>('upload')
const isDragging = ref(false)
const isUploading = ref(false)
const isUploaded = ref(props.thumbnailFile !== null)
const uploadProgress = ref(0)
const fileName = ref(props.thumbnailFile?.name || '')
const fileSize = ref('')
const previewUrl = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedTimestamp = ref<number | null>(null)

// Simulated video duration: 3 min 15 sec
const totalDuration = 195

const frameOptions = [
  { timestamp: 5, gradient: 'bg-gradient-to-br from-gray-700 to-gray-800' },
  { timestamp: 25, gradient: 'bg-gradient-to-br from-purple-900/40 to-gray-800' },
  { timestamp: 48, gradient: 'bg-gradient-to-br from-gray-600 to-gray-700' },
  { timestamp: 72, gradient: 'bg-gradient-to-br from-blue-900/30 to-gray-800' },
  { timestamp: 98, gradient: 'bg-gradient-to-br from-gray-700 to-purple-900/30' },
  { timestamp: 125, gradient: 'bg-gradient-to-br from-gray-600 to-gray-700' },
  { timestamp: 155, gradient: 'bg-gradient-to-br from-amber-900/20 to-gray-800' },
  { timestamp: 180, gradient: 'bg-gradient-to-br from-gray-800 to-gray-900' },
]

const selectedFrameGradient = ref('bg-gradient-to-br from-gray-800 to-gray-900')

const formatTimestamp = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}

const handleCaptureTab = () => {
  if (!props.hasVideo) return
  activeTab.value = 'capture'
}

// ---- Upload Tab ----
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const formatFileSize = (bytes: number): string => {
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB'
  return (bytes / 1024).toFixed(0) + ' KB'
}

const simulateUpload = (file: File) => {
  fileName.value = file.name
  fileSize.value = formatFileSize(file.size)
  isUploading.value = true
  uploadProgress.value = 0
  selectedTimestamp.value = null

  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  const interval = setInterval(() => {
    uploadProgress.value += Math.random() * 20 + 10
    if (uploadProgress.value >= 100) {
      uploadProgress.value = 100
      clearInterval(interval)
      setTimeout(() => {
        isUploading.value = false
        isUploaded.value = true
        emit('update:thumbnailFile', file)
        emit('uploaded')
      }, 300)
    }
  }, 150)
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    simulateUpload(input.files[0])
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    simulateUpload(event.dataTransfer.files[0])
  }
}

const removeFile = () => {
  isUploaded.value = false
  fileName.value = ''
  fileSize.value = ''
  previewUrl.value = ''
  selectedTimestamp.value = null
  emit('update:thumbnailFile', null)
}

// ---- Capture Tab ----
const selectFrame = (frame: { timestamp: number; gradient: string }) => {
  selectedTimestamp.value = frame.timestamp
  selectedFrameGradient.value = frame.gradient

  // Generate a synthetic thumbnail from a canvas
  const canvas = document.createElement('canvas')
  canvas.width = 1920
  canvas.height = 1080
  const ctx = canvas.getContext('2d')!

  // Draw a dark gradient background
  const gradient = ctx.createLinearGradient(0, 0, 1920, 1080)
  gradient.addColorStop(0, '#1a1a2e')
  gradient.addColorStop(1, '#16213e')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1920, 1080)

  // Draw timestamp text
  ctx.fillStyle = 'rgba(255,255,255,0.25)'
  ctx.font = '600 48px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`Frame at ${formatTimestamp(frame.timestamp)}`, 960, 540)

  canvas.toBlob((blob) => {
    if (blob) {
      const file = new File([blob], `frame-${frame.timestamp}s.jpg`, { type: 'image/jpeg' })
      isUploaded.value = false // not "uploaded" in the traditional sense
      emit('update:thumbnailFile', file)
      emit('uploaded')
    }
  }, 'image/jpeg', 0.9)
}
</script>
