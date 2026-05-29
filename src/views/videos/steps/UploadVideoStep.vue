<template>
  <div>
    <h2 class="font-satoshi font-black tracking-[-0.03em] text-xl lg:text-2xl text-ditto-text mb-2">Upload your video</h2>
    <p class="text-sm text-ditto-subtext mb-6">Upload a high-quality video file to get started.</p>

    <!-- Drop Zone (before upload) -->
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
      <!-- Upload Icon -->
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-ditto-light-grey flex items-center justify-center">
        <svg class="w-7 h-7 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <p class="text-sm text-ditto-text mb-1">
        Drag and drop your video here or
        <button @click="triggerFileInput" class="text-ditto-purple font-medium hover:underline">browse your files</button>
      </p>
      <p class="text-xs text-ditto-subtext">Accepted formats: MP4, MPEG, MOV, AVI, WMV, FLV, MKV &middot; Max 2GB</p>
      <p class="text-xs text-ditto-subtext mt-1">HD quality or higher &middot; Landscape orientation only (no square or vertical)</p>

      <input
        ref="fileInputRef"
        type="file"
        accept=".mp4,.mpeg,.mov,.avi,.wmv,.flv,.mkv"
        class="hidden"
        @change="handleFileSelect"
      />

      <!-- File Size Error -->
      <div v-if="fileSizeError" class="mt-4 p-3 rounded-xl bg-error/10 border border-error/20 flex items-center gap-2">
        <svg class="w-4 h-4 text-error flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <p class="text-xs text-error">{{ fileSizeError }}</p>
      </div>

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

    <!-- File Uploaded State -->
    <div v-else class="space-y-4">
      <!-- File info -->
      <div class="flex items-center gap-3 p-4 rounded-xl bg-ditto-light-grey border border-gray-100">
        <div class="w-10 h-10 rounded-lg bg-ditto-purple/10 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-ditto-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="4" width="20" height="16" rx="2"/><polygon points="10,8 16,12 10,16"/>
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

      <!-- Video Preview -->
      <div class="aspect-video rounded-2xl bg-gray-900 flex items-center justify-center overflow-hidden">
        <video
          v-if="videoPreviewUrl"
          :src="videoPreviewUrl"
          controls
          class="w-full h-full object-contain"
        ></video>
        <div v-else class="text-center">
          <div class="w-16 h-16 mx-auto rounded-full border-2 border-white/30 flex items-center justify-center mb-3">
            <svg class="w-7 h-7 text-white/70 ml-1" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6,4 20,12 6,20"/>
            </svg>
          </div>
          <p class="text-xs text-white/50">Video Preview</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024 // 2GB

const props = defineProps<{
  videoFile: File | null
}>()

const emit = defineEmits<{
  (e: 'update:videoFile', file: File | null): void
  (e: 'uploaded'): void
}>()

const isDragging = ref(false)
const isUploading = ref(false)
const isUploaded = ref(props.videoFile !== null)
const uploadProgress = ref(0)
const fileName = ref(props.videoFile?.name || '')
const fileSize = ref('')
const fileSizeError = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)
const videoPreviewUrl = ref<string | null>(props.videoFile ? URL.createObjectURL(props.videoFile) : null)

onUnmounted(() => {
  if (videoPreviewUrl.value) {
    URL.revokeObjectURL(videoPreviewUrl.value)
  }
})

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const formatFileSize = (bytes: number): string => {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + ' GB'
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB'
  return (bytes / 1024).toFixed(0) + ' KB'
}

const simulateUpload = (file: File) => {
  fileSizeError.value = ''

  // File size validation (max 2GB)
  if (file.size > MAX_FILE_SIZE) {
    fileSizeError.value = `File is too large (${formatFileSize(file.size)}). Maximum file size is 2GB.`
    return
  }

  fileName.value = file.name
  fileSize.value = formatFileSize(file.size)
  isUploading.value = true
  uploadProgress.value = 0

  const interval = setInterval(() => {
    uploadProgress.value += Math.random() * 15 + 5
    if (uploadProgress.value >= 100) {
      uploadProgress.value = 100
      clearInterval(interval)
      setTimeout(() => {
        isUploading.value = false
        isUploaded.value = true
        // Create video preview URL
        if (videoPreviewUrl.value) URL.revokeObjectURL(videoPreviewUrl.value)
        videoPreviewUrl.value = URL.createObjectURL(file)
        emit('update:videoFile', file)
        emit('uploaded')
      }, 400)
    }
  }, 200)
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
  if (videoPreviewUrl.value) {
    URL.revokeObjectURL(videoPreviewUrl.value)
    videoPreviewUrl.value = null
  }
  emit('update:videoFile', null)
}
</script>
