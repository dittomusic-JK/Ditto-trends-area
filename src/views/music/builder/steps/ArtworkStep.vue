<template>
  <div>
    <div class="text-center max-w-2xl mx-auto">
      <h1 class="font-satoshi font-black text-2xl lg:text-[32px] tracking-[-0.03em] text-ditto-text mb-4">Add your artwork</h1>
      <p class="text-sm text-ditto-subtext leading-relaxed">
        Cover art must be a square .jpg or .jpeg file, at least 3000x3000 pixels,
        not blurry or pixelated and no more than 10mb in size.
      </p>
    </div>

    <!-- Artwork dropzone -->
    <div v-if="!form.artwork" class="mt-12 max-w-lg mx-auto">
      <button
        @click="uploadArtwork"
        class="w-full aspect-[4/3] border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-5 hover:border-ditto-purple hover:bg-ditto-purple/[0.03] transition-colors group"
      >
        <svg class="w-20 h-20 text-gray-300 group-hover:text-ditto-purple/40 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
        </svg>
        <span class="text-center">
          <span class="block font-satoshi font-black text-xl text-ditto-text tracking-[-0.02em]">Drag &amp; Drop Your Image</span>
          <span class="block text-sm text-ditto-subtext mt-1.5">or <span class="underline text-ditto-text">browse your files</span></span>
        </span>
      </button>
    </div>

    <!-- Uploading progress -->
    <div v-else-if="uploading" class="mt-16 max-w-md mx-auto text-center">
      <p class="text-sm text-ditto-text mb-4 truncate">{{ form.artworkFileName }}</p>
      <div class="h-1.5 rounded-full bg-ditto-light-grey overflow-hidden">
        <div class="h-full rounded-full bg-ditto-purple transition-all duration-200" :style="{ width: progress + '%' }"></div>
      </div>
    </div>

    <!-- Requirements confirm -->
    <div v-else class="mt-14 grid lg:grid-cols-[minmax(0,380px)_1fr] gap-10 lg:gap-16 items-start max-w-4xl mx-auto">
      <div>
        <div class="border border-gray-200 rounded-2xl p-3 bg-white">
          <img :src="form.artwork" alt="Release artwork" class="w-full aspect-square object-cover rounded-xl" />
        </div>
        <button
          @click="replaceArtwork"
          class="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-ditto-purple border border-ditto-purple/30 rounded-full hover:bg-ditto-purple/5 transition-colors mx-auto"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          Replace Artwork
        </button>
      </div>
      <div class="lg:pt-4">
        <h2 class="font-satoshi font-black text-xl lg:text-2xl tracking-[-0.03em] text-ditto-text mb-6 leading-tight">Check your artwork meets these requirements…</h2>
        <ul class="space-y-4">
          <li v-for="rule in artworkRules" :key="rule" class="flex items-center gap-3.5 text-sm text-ditto-subtext">
            <span class="w-5 h-5 rounded-full border-[1.5px] border-ditto-subtext/50 flex items-center justify-center flex-shrink-0">
              <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </span>
            {{ rule }}
          </li>
        </ul>
        <p class="text-sm text-ditto-subtext mt-7 leading-relaxed">
          If your cover art contains any of the above, <strong class="text-ditto-text">we will have to reject your release</strong>.
          These rules are set by the music stores and we need to follow them.
        </p>
        <button
          v-if="!form.artworkConfirmed"
          @click="form.artworkConfirmed = true"
          class="mt-7 px-7 py-2.5 bg-ditto-purple btn-pop-purple text-white text-sm font-medium rounded-full hover:opacity-95 transition-opacity"
        >Confirm</button>
        <p v-else class="mt-7 inline-flex items-center gap-2 text-sm font-medium text-[#006633] bg-[#00e785]/10 px-4 py-2 rounded-full">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Artwork confirmed
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ReleaseBuilderForm } from '../ReleaseBuilderView.vue'

const props = defineProps<{ form: ReleaseBuilderForm }>()

const artworkRules = [
  'No social media or music platform logos.',
  'No copyrighted, explicit or pixelated images.',
  'No QR codes, web addresses or URLs.',
]

// Artwork upload simulation with a brief progress sweep
const uploading = ref(false)
const progress = ref(0)

const uploadArtwork = () => {
  props.form.artwork = '/img/image-4.png'
  props.form.artworkFileName = 'DavexTems_ManchesterWarehouse_notext.jpg'
  props.form.artworkConfirmed = false
  uploading.value = true
  progress.value = 0
  const tick = () => {
    progress.value = Math.min(100, progress.value + 18 + Math.round(14 * (progress.value % 7) / 7))
    if (progress.value < 100) setTimeout(tick, 120)
    else setTimeout(() => { uploading.value = false }, 250)
  }
  setTimeout(tick, 100)
}

const replaceArtwork = () => {
  props.form.artwork = null
  props.form.artworkFileName = ''
  props.form.artworkConfirmed = false
}
</script>
