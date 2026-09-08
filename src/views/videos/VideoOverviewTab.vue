<template>
  <div>
    <!-- Video hero: 16:9 frame instead of square artwork -->
    <div class="flex flex-col md:flex-row gap-6 lg:gap-10 mb-10">
      <div class="relative w-full max-w-[420px] aspect-video rounded-2xl overflow-hidden bg-gray-900 flex-shrink-0">
        <span :class="[
          'absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full text-white z-10',
          video.status === 'Live' ? 'bg-success' : video.status === 'Takedown' ? 'bg-error' : 'bg-ditto-subtext'
        ]">{{ video.status }}</span>
        <img :src="video.artwork" :alt="video.title" class="w-full h-full object-cover" />
        <button class="absolute inset-0 flex items-center justify-center group" aria-label="Play">
          <span class="w-14 h-14 rounded-full bg-white/90 text-ditto-text flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <svg class="w-5 h-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21"/></svg>
          </span>
        </button>
        <span class="absolute bottom-3 right-3 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-black/60 text-white tabular-nums">{{ video.length }}</span>
      </div>

      <div class="flex-1 min-w-0">
        <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl lg:text-3xl text-ditto-text">{{ video.title }}</h2>
        <p class="text-ditto-purple font-medium mt-1 mb-6">{{ video.artist }} · {{ video.type }}</p>

        <!-- Information (the catalog's card, in the release-overview meta idiom) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 max-w-2xl">
          <div v-for="item in metaItems" :key="item.label" class="flex gap-2 text-sm">
            <span class="font-semibold text-ditto-text whitespace-nowrap">{{ item.label }}:</span>
            <span class="text-ditto-subtext truncate" :title="item.value">{{ item.value }}</span>
          </div>
        </div>

        <!-- Share -->
        <div class="mt-8">
          <h3 class="font-satoshi font-black tracking-[-0.03em] text-lg text-ditto-text mb-3">Share your video</h3>
          <div class="flex items-center gap-2.5 flex-wrap">
            <button class="flex items-center gap-2 px-5 h-11 bg-ditto-purple btn-pop-purple text-white text-sm font-medium rounded-full hover:opacity-95 transition-all">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="10.5" x2="15.4" y2="6.5"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/></svg>
              Get your SmartLink
            </button>
            <button class="w-11 h-11 rounded-full bg-ditto-text text-white flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="Share on X">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Associated track -->
    <div class="bg-white rounded-2xl border border-gray-200 mb-8">
      <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="font-satoshi font-black tracking-[-0.03em] text-lg text-ditto-text">Associated track</h3>
      </div>
      <div class="hidden md:grid grid-cols-[1fr_1fr_160px_100px] gap-4 px-6 py-3 text-xs text-ditto-subtext border-b border-gray-50">
        <div>Track</div><div>Album</div><div>ISRC</div><div class="text-right">Length</div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-[1fr_1fr_160px_100px] gap-2 md:gap-4 px-6 py-4 items-center hover:bg-ditto-light-grey transition-colors text-sm">
        <span class="font-semibold text-ditto-text">{{ video.associatedTrack.title }}</span>
        <span class="text-ditto-subtext">{{ video.associatedTrack.album }}</span>
        <span class="text-ditto-subtext font-mono text-xs">{{ video.associatedTrack.isrc }}</span>
        <span class="text-ditto-subtext md:text-right tabular-nums">{{ video.associatedTrack.length }}</span>
      </div>
    </div>

    <!-- Platforms -->
    <div class="bg-white rounded-2xl border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-100 flex items-baseline justify-between">
        <h3 class="font-satoshi font-black tracking-[-0.03em] text-lg text-ditto-text">Delivered to</h3>
        <span class="text-xs text-ditto-subtext">{{ platforms.length }} platforms</span>
      </div>
      <div class="px-6 py-4 flex flex-wrap gap-2">
        <span v-for="p in platforms" :key="p.id" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ditto-light-grey text-sm font-medium text-ditto-text">
          <StoreIcon :store="p.icon" class="w-4 h-4" />
          {{ p.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StoreIcon from '../../components/common/StoreIcon.vue'
import type { VideoDetail } from '../../data/videoDetailMockData'

const props = defineProps<{ video: VideoDetail }>()

const metaItems = computed(() => [
  { label: 'Label', value: props.video.label },
  { label: 'Release date', value: props.video.releaseDate },
  { label: 'UPC', value: props.video.upc },
  { label: 'Length', value: props.video.length },
  { label: 'ISRC (video)', value: props.video.isrcVideo },
  { label: 'Resolution', value: props.video.resolution },
  { label: 'ISRC (audio)', value: props.video.isrcAudio },
  { label: 'File size', value: props.video.fileSize },
  { label: 'Video type', value: props.video.type },
  { label: 'Labelcamp ID', value: props.video.labelcampId },
])

const storeNames: Record<string, { name: string; icon: string }> = {
  youtube: { name: 'YouTube', icon: 'youtube' },
  vevo: { name: 'VEVO', icon: 'youtube' },
  apple: { name: 'Apple Music', icon: 'apple-music' },
  tiktok: { name: 'TikTok', icon: 'tiktok' },
  facebook: { name: 'Facebook', icon: 'facebook' },
  instagram: { name: 'Instagram', icon: 'instagram' },
}
const platforms = computed(() => props.video.storeIds.map(id => ({ id, ...(storeNames[id] ?? { name: id, icon: id }) })))
</script>
