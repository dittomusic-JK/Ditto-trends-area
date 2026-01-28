<template>
  <div class="flex-1 px-6 py-4 border border-ditto-border-grey rounded-xl bg-white">
    <div class="flex items-center gap-3">
      <!-- Icon -->
      <div class="w-10 h-10 flex items-center justify-center">
        <img 
          v-if="stat.iconType === 'broadcast'" 
          src="/img/totalstreams.svg" 
          alt="Total Streams" 
          class="w-8 h-auto"
        />
        <img 
          v-else-if="stat.iconType === 'clock'" 
          src="/img/dailyaverage.svg" 
          alt="Daily Average" 
          class="w-8 h-auto"
        />
        <img 
          v-else-if="stat.iconType === 'store' && stat.storeIcon" 
          :src="getStoreIconSrc(stat.storeIcon)" 
          :alt="stat.storeName || 'Store'"
          class="w-8 h-8 rounded"
        />
      </div>
      
      <!-- Content -->
      <div class="flex-1">
        <p class="text-xs text-ditto-subtext mb-0.5">{{ stat.title }}</p>
        <div class="flex items-center gap-2">
          <span class="text-2xl font-semibold text-ditto-text">{{ stat.value }}</span>
          <span 
            v-if="stat.change" 
            class="text-xs font-medium px-1.5 py-0.5 rounded-full bg-success/20 text-success"
          >
            +{{ stat.change }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StatsCard as StatsCardType } from '../../types'

defineProps<{
  stat: StatsCardType
}>()

const storeIconMap: Record<string, string> = {
  'spotify': '/img/spotify-icon.svg',
  'apple-music': '/img/apple-music-icon.svg',
  'deezer': '/img/deezer-icon.svg',
  'youtube': '/img/youtube-icon.svg',
  'amazon-music': '/img/amazonmusic-icon.svg',
  'soundcloud': '/img/soundcloud_icon.svg',
  'tidal': '/img/tidal-icon.svg',
  'boomplay': '/img/boomplay-icon.svg',
  'tiktok': '/img/tiktok-icon.svg',
  'instagram': '/img/instagram-icon.svg',
}

const getStoreIconSrc = (iconName: string): string => {
  return storeIconMap[iconName] || ''
}
</script>
