<template>
  <!-- VEVO channel details: shared by the video builder's Select Stores step
       and the "Create a channel" popup on the VEVO channels page, so the two
       can never drift apart. -->
  <div class="space-y-4">
    <h4 class="text-sm font-semibold text-ditto-text">Channel Details</h4>

    <!-- Channel Name (required; "VEVO" is appended automatically) -->
    <div>
      <label class="block text-xs font-medium text-ditto-subtext mb-1">Channel Name <span class="text-error">*</span></label>
      <div class="relative">
        <input
          :value="stores.vevoChannelName"
          @input="updateField('vevoChannelName', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="e.g. ArtistName"
          maxlength="20"
          :class="[
            'w-full px-0 py-2.5 pr-14 border-0 border-b text-sm text-ditto-text bg-transparent focus:outline-none transition-colors',
            channelNameError ? 'border-error focus:border-error' : 'border-gray-300 focus:border-ditto-purple'
          ]"
        />
        <span class="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-ditto-purple bg-ditto-purple/10 px-1.5 py-0.5 rounded" title="Added automatically">VEVO</span>
      </div>
      <p v-if="channelNameError" class="text-xs text-error mt-1.5">{{ channelNameError }}</p>
      <p v-else-if="finalChannelName" class="text-xs text-ditto-subtext mt-1.5">Your channel will be <strong class="text-ditto-text">{{ finalChannelName }}</strong> <span class="text-ditto-subtext/70">· {{ finalChannelName.length }}/20</span></p>
      <ul class="mt-2.5 space-y-1 text-[11px] text-ditto-subtext leading-relaxed">
        <li class="flex items-start gap-1.5"><span class="w-1 h-1 rounded-full bg-ditto-subtext/60 mt-[7px] flex-shrink-0"></span>Must include your artist name</li>
        <li class="flex items-start gap-1.5"><span class="w-1 h-1 rounded-full bg-ditto-subtext/60 mt-[7px] flex-shrink-0"></span>Letters and numbers only — no spaces, symbols or special characters</li>
        <li class="flex items-start gap-1.5"><span class="w-1 h-1 rounded-full bg-ditto-subtext/60 mt-[7px] flex-shrink-0"></span>20 characters max, including "VEVO"</li>
        <li class="flex items-start gap-1.5"><span class="w-1 h-1 rounded-full bg-ditto-subtext/60 mt-[7px] flex-shrink-0"></span>The VEVO tag is added automatically</li>
      </ul>
    </div>

    <!-- Biography -->
    <div>
      <label class="block text-xs font-medium text-ditto-subtext mb-1">Biography</label>
      <textarea
        :value="stores.vevoBiography"
        @input="updateField('vevoBiography', ($event.target as HTMLTextAreaElement).value)"
        rows="3"
        placeholder="Tell viewers about the artist..."
        class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-ditto-text bg-white focus:outline-none focus:border-ditto-purple transition-colors resize-none"
      ></textarea>
    </div>

    <!-- Artist Image Upload -->
    <div>
      <label class="block text-xs font-medium text-ditto-subtext mb-1">Channel Artist Image</label>
      <div
        :class="[
          'relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer',
          stores.vevoArtistImage ? 'border-ditto-purple bg-ditto-purple/5' : 'border-gray-300 hover:border-gray-400 bg-white'
        ]"
        @click="triggerFileInput('artistImage')"
      >
        <div v-if="!stores.vevoArtistImage">
          <svg class="w-8 h-8 text-ditto-subtext mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/>
          </svg>
          <p class="text-sm text-ditto-text font-medium mb-1">Upload artist image</p>
          <p class="text-[11px] text-ditto-subtext">JPEG only &middot; Min 5000 &times; 5000px &middot; Max 15MB</p>
          <div class="mt-3 pt-3 border-t border-gray-200 space-y-1">
            <p class="text-[10px] text-ditto-subtext">Press picture of the artist(s), <strong>no text or logos</strong></p>
            <p class="text-[10px] text-ditto-subtext">Artist(s) should be centred &bull; Background should not be pure white</p>
          </div>
        </div>
        <div v-else class="flex items-center gap-3">
          <div class="w-14 h-14 rounded-lg bg-ditto-light-grey flex items-center justify-center overflow-hidden flex-shrink-0">
            <img :src="getFilePreview(stores.vevoArtistImage)" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1 text-left min-w-0">
            <p class="text-sm text-ditto-text font-medium truncate">{{ stores.vevoArtistImage.name }}</p>
            <p class="text-[11px] text-ditto-subtext">{{ formatFileSize(stores.vevoArtistImage.size) }}</p>
          </div>
          <button @click.stop="updateField('vevoArtistImage', null)" class="text-ditto-subtext hover:text-error p-1">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
      <input ref="artistImageInput" type="file" accept=".jpg,.jpeg" class="hidden" @change="handleVevoFileUpload('vevoArtistImage', $event)" />
      <!-- Artist image error -->
      <div v-if="vevoFileError && vevoFileErrorField === 'vevoArtistImage'" class="mt-2 p-2.5 rounded-lg bg-error/10 border border-error/20 flex items-center gap-2">
        <svg class="w-3.5 h-3.5 text-error flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <p class="text-xs text-error">{{ vevoFileError }}</p>
      </div>
    </div>

    <!-- Channel Art / YouTube Banner -->
    <div>
      <label class="block text-xs font-medium text-ditto-subtext mb-1">Channel Art / YouTube Banner</label>
      <div
        :class="[
          'relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer',
          stores.vevoBanner ? 'border-ditto-purple bg-ditto-purple/5' : 'border-gray-300 hover:border-gray-400 bg-white'
        ]"
        @click="triggerFileInput('banner')"
      >
        <div v-if="!stores.vevoBanner">
          <svg class="w-8 h-8 text-ditto-subtext mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="6" width="20" height="12" rx="2" ry="2"/><path d="M12 6v12M7 6v12M17 6v12" stroke-dasharray="2 2"/>
          </svg>
          <p class="text-sm text-ditto-text font-medium mb-1">Upload channel art / YouTube banner</p>
          <p class="text-[11px] text-ditto-subtext">PNG only &middot; Min 2560 &times; 1440px &middot; Max 4MB</p>
          <div class="mt-3 pt-3 border-t border-gray-200">
            <p class="text-[10px] text-ditto-subtext">Can contain text &mdash; great for making your VEVO and YouTube channels look more official.</p>
          </div>
        </div>
        <div v-else class="flex items-center gap-3">
          <div class="w-20 h-11 rounded-lg bg-ditto-light-grey flex items-center justify-center overflow-hidden flex-shrink-0">
            <img :src="getFilePreview(stores.vevoBanner)" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1 text-left min-w-0">
            <p class="text-sm text-ditto-text font-medium truncate">{{ stores.vevoBanner.name }}</p>
            <p class="text-[11px] text-ditto-subtext">{{ formatFileSize(stores.vevoBanner.size) }}</p>
          </div>
          <button @click.stop="updateField('vevoBanner', null)" class="text-ditto-subtext hover:text-error p-1">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
      <input ref="bannerInput" type="file" accept=".png" class="hidden" @change="handleVevoFileUpload('vevoBanner', $event)" />
      <!-- Banner error -->
      <div v-if="vevoFileError && vevoFileErrorField === 'vevoBanner'" class="mt-2 p-2.5 rounded-lg bg-error/10 border border-error/20 flex items-center gap-2">
        <svg class="w-3.5 h-3.5 text-error flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <p class="text-xs text-error">{{ vevoFileError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

export interface VevoChannelDetailsData {
  vevoChannelName: string
  vevoBiography: string
  vevoArtistImage: File | null
  vevoBanner: File | null
}

const props = defineProps<{ stores: VevoChannelDetailsData }>()
const emit = defineEmits<{
  (e: 'update', key: keyof VevoChannelDetailsData, value: any): void
}>()

const updateField = (key: keyof VevoChannelDetailsData, value: any) => emit('update', key, value)

// Channel name: alphanumeric, "VEVO" appended automatically, 20 characters max including the tag.
// (Must include the artist name too: a note only, it isn't validated.)
const finalChannelName = computed(() => {
  const base = props.stores.vevoChannelName.trim().replace(/vevo$/i, '')
  return base ? base + 'VEVO' : ''
})
const channelNameError = computed(() => {
  const name = props.stores.vevoChannelName.trim()
  if (!name) return null
  if (!/^[A-Za-z0-9]+$/.test(name)) return 'Letters and numbers only — remove spaces, symbols or special characters.'
  if (finalChannelName.value.length > 20) return `Too long — ${finalChannelName.value.length} characters including "VEVO", the limit is 20.`
  return null
})

// VEVO file upload handling
const artistImageInput = ref<HTMLInputElement | null>(null)
const bannerInput = ref<HTMLInputElement | null>(null)

const triggerFileInput = (type: 'artistImage' | 'banner') => {
  if (type === 'artistImage') artistImageInput.value?.click()
  else bannerInput.value?.click()
}

const vevoFileError = ref('')
const vevoFileErrorField = ref<'vevoArtistImage' | 'vevoBanner' | ''>('')

const handleVevoFileUpload = (field: 'vevoArtistImage' | 'vevoBanner', event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || !input.files[0]) return
  const file = input.files[0]
  vevoFileError.value = ''
  vevoFileErrorField.value = ''

  const maxSize = field === 'vevoArtistImage' ? 15 * 1024 * 1024 : 4 * 1024 * 1024
  const maxLabel = field === 'vevoArtistImage' ? '15MB' : '4MB'
  const minW = field === 'vevoArtistImage' ? 5000 : 2560
  const minH = field === 'vevoArtistImage' ? 5000 : 1440
  const label = field === 'vevoArtistImage' ? 'Artist image' : 'Banner image'

  if (file.size > maxSize) {
    vevoFileError.value = `${label} must be under ${maxLabel}.`
    vevoFileErrorField.value = field
    input.value = ''
    return
  }

  const img = new Image()
  img.onload = () => {
    URL.revokeObjectURL(img.src)
    if (img.width < minW || img.height < minH) {
      vevoFileError.value = `${label} is ${img.width}×${img.height}px — it needs to be at least ${minW}×${minH}px.`
      vevoFileErrorField.value = field
      input.value = ''
      return
    }
    vevoFileError.value = ''
    vevoFileErrorField.value = ''
    updateField(field, file)
  }
  img.onerror = () => {
    URL.revokeObjectURL(img.src)
    vevoFileError.value = 'Could not read this image. Please try another file.'
    vevoFileErrorField.value = field
    input.value = ''
  }
  img.src = URL.createObjectURL(file)
}

const getFilePreview = (file: File): string => {
  return URL.createObjectURL(file)
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}
</script>
