<template>
  <div class="flex-1 px-5 py-5 border border-gray-200 rounded-2xl bg-white relative overflow-hidden">
    <!-- Icon top-right -->
    <div class="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-xl" :class="iconBg">
      <svg v-if="stat.icon === 'earnings'" class="w-6 h-6" :class="iconColor" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg v-else-if="stat.icon === 'average'" class="w-6 h-6" :class="iconColor" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg v-else-if="stat.icon === 'streams'" class="w-6 h-6" :class="iconColor" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <img
        v-else-if="stat.icon === 'store' && stat.storeIcon"
        :src="getStoreIconSrc(stat.storeIcon)"
        :alt="stat.storeName || 'Store'"
        class="w-7 h-7 rounded"
      />
    </div>

    <!-- Content left-aligned -->
    <p class="text-xs text-ditto-subtext mb-1">{{ stat.title }}</p>
    <div class="flex items-baseline gap-2 mb-1">
      <span class="text-2xl font-bold text-ditto-text">{{ stat.value }}</span>
      <span
        v-if="stat.change"
        :class="[
          'text-xs font-medium px-1.5 py-0.5 rounded-full',
          stat.change > 0 ? 'bg-success/15 text-success' : 'bg-error/15 text-error'
        ]"
      >
        {{ stat.change > 0 ? '+' : '' }}{{ stat.change }}%
      </span>
    </div>
    <p v-if="stat.storeName" class="text-xs text-ditto-subtext">{{ stat.storeName }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { StatsCard as StatsCardType } from '../../types'

const props = defineProps<{
  stat: StatsCardType
}>()

const iconBg = computed(() => {
  switch (props.stat.icon) {
    case 'earnings': return 'bg-ditto-purple/10'
    case 'average': return 'bg-info/15'
    case 'streams': return 'bg-success/15'
    case 'store': return 'bg-gray-100'
    default: return 'bg-gray-100'
  }
})

const iconColor = computed(() => {
  switch (props.stat.icon) {
    case 'earnings': return 'text-ditto-purple'
    case 'average': return 'text-info'
    case 'streams': return 'text-success'
    default: return 'text-ditto-text'
  }
})

const storeIconMap: Record<string, string> = {
  'spotify': '/img/spotify-icon.svg',
  'apple-music': '/img/apple-music-icon.svg',
  'deezer': '/img/deezer-icon.svg',
  'youtube': '/img/youtube-icon.svg',
  'amazon-music': '/img/amazonmusic-icon.svg',
}

const getStoreIconSrc = (iconName: string): string => {
  return storeIconMap[iconName] || ''
}
</script>
