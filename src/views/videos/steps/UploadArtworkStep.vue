<template>
  <div>
    <h2 class="font-satoshi font-black tracking-[-0.03em] text-xl lg:text-2xl text-ditto-text mb-1">Upload your album artwork</h2>
    <p class="text-sm text-ditto-subtext mb-6">Stores show this square cover alongside your video — it's separate from the video thumbnail above.</p>

    <!-- Error state -->
    <div v-if="imageError" class="border-2 border-dashed border-error/40 bg-error/5 rounded-2xl p-10 text-center">
      <div class="w-14 h-14 mx-auto mb-3 rounded-full bg-error/10 flex items-center justify-center">
        <svg class="w-6 h-6 text-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <p class="text-sm font-medium text-error mb-1">We couldn't upload your artwork</p>
      <p class="text-xs text-ditto-subtext mb-4 max-w-md mx-auto">{{ imageError }}</p>
      <button @click="resetUpload" class="px-4 py-2 rounded-full bg-ditto-purple text-white text-sm font-medium hover:bg-ditto-purple/90 transition-colors">Try another file</button>
    </div>

    <!-- Uploading -->
    <div v-else-if="isUploading" class="border-2 border-dashed border-ditto-purple/30 bg-ditto-purple/5 rounded-2xl p-8">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-lg bg-ditto-purple/10 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-ditto-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-ditto-text truncate">{{ fileName }}</p>
          <p class="text-xs text-ditto-subtext">{{ fileSize }}</p>
        </div>
      </div>
      <div class="flex items-center justify-between text-xs text-ditto-subtext mb-1">
        <span>Uploading…</span>
        <span>{{ uploadProgress }}%</span>
      </div>
      <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div class="h-full bg-ditto-purple rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
      </div>
    </div>

    <!-- Uploaded preview -->
    <div v-else-if="isUploaded" class="flex flex-col sm:flex-row gap-5 items-start">
      <div class="w-48 flex-shrink-0 border border-gray-200 rounded-2xl p-2 bg-white">
        <img v-if="previewUrl" :src="previewUrl" alt="Album artwork preview" class="w-full aspect-square object-cover rounded-xl" />
        <div v-else class="w-full aspect-square rounded-xl bg-gray-100 flex items-center justify-center">
          <p class="text-xs text-ditto-subtext">Artwork preview</p>
        </div>
      </div>
      <div class="flex-1 min-w-0 w-full">
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
          <button @click="removeFile" class="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors" aria-label="Remove artwork">
            <svg class="w-4 h-4 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <ul class="mt-4 space-y-2">
          <li v-for="rule in artworkRules" :key="rule" class="flex items-center gap-2.5 text-xs text-ditto-subtext">
            <span class="w-4 h-4 rounded-full border border-ditto-subtext/50 flex items-center justify-center flex-shrink-0">
              <svg class="w-2 h-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </span>
            {{ rule }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Idle drop zone -->
    <div
      v-else
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
        Drag and drop your album artwork here or
        <button @click="triggerFileInput" class="text-ditto-purple font-medium hover:underline">browse your files</button>
      </p>
      <p class="text-xs text-ditto-subtext">JPG or JPEG only &middot; square &middot; at least 3000&times;3000px &middot; max 10 MB</p>

      <input
        ref="fileInputRef"
        type="file"
        accept=".jpg,.jpeg"
        class="hidden"
        @change="handleFileSelect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB

const props = defineProps<{
  artworkFile: File | null
}>()

const emit = defineEmits<{
  (e: 'update:artworkFile', file: File | null): void
}>()

// Same store rules the music builder's artwork step lists
const artworkRules = [
  'No social media or music platform logos.',
  'No copyrighted, explicit or pixelated images.',
  'No QR codes, web addresses or URLs.',
]

const isDragging = ref(false)
const isUploading = ref(false)
const isUploaded = ref(props.artworkFile !== null)
const uploadProgress = ref(0)
const fileName = ref(props.artworkFile?.name || '')
const fileSize = ref('')
const previewUrl = ref('')
const imageError = ref<string | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const triggerFileInput = () => fileInputRef.value?.click()

const formatFileSize = (bytes: number): string => {
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB'
  return (bytes / 1024).toFixed(0) + ' KB'
}

const validateImage = (file: File): string | null => {
  const okExt = /\.jpe?g$/i.test(file.name)
  const okMime = file.type === 'image/jpeg' || file.type === ''
  if (!okExt || !okMime) return 'Invalid file format. Album artwork must be a JPG or JPEG file.'
  if (file.size > MAX_IMAGE_SIZE) return `The file size should be no larger than 10 MB (this file is ${formatFileSize(file.size)}).`
  return null
}

const simulateUpload = (file: File) => {
  imageError.value = null

  const error = validateImage(file)
  if (error) {
    imageError.value = error
    return
  }

  fileName.value = file.name
  fileSize.value = formatFileSize(file.size)
  isUploading.value = true
  uploadProgress.value = 0

  const reader = new FileReader()
  reader.onload = (e) => {
    const dataUrl = e.target?.result as string
    const img = new Image()
    img.onload = () => { previewUrl.value = dataUrl }
    img.onerror = () => {
      isUploading.value = false
      imageError.value = 'This file is broken. Please upload a different one.'
    }
    img.src = dataUrl
  }
  reader.onerror = () => {
    isUploading.value = false
    imageError.value = 'This file is broken. Please upload a different one.'
  }
  reader.readAsDataURL(file)

  const interval = setInterval(() => {
    if (imageError.value) { clearInterval(interval); return }
    uploadProgress.value += Math.random() * 20 + 10
    if (uploadProgress.value >= 100) {
      uploadProgress.value = 100
      clearInterval(interval)
      setTimeout(() => {
        if (imageError.value) return
        isUploading.value = false
        isUploaded.value = true
        emit('update:artworkFile', file)
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
  emit('update:artworkFile', null)
}

const resetUpload = () => {
  imageError.value = null
  isUploading.value = false
  isUploaded.value = false
  fileName.value = ''
  fileSize.value = ''
  previewUrl.value = ''
  uploadProgress.value = 0
  if (fileInputRef.value) fileInputRef.value.value = ''
}
</script>
