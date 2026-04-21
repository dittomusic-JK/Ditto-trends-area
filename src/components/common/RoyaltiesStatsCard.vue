<template>
  <div class="flex-1 px-6 py-4 border border-ditto-border-grey rounded-xl bg-white">
    <div class="flex items-center gap-3">
      <!-- Icon -->
      <div class="w-10 h-10 flex items-center justify-center rounded-lg" :class="iconBg">
        <svg v-if="stat.icon === 'earnings'" class="w-5 h-5" :class="iconColor" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg v-else-if="stat.icon === 'average'" class="w-5 h-5" :class="iconColor" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg v-else-if="stat.icon === 'streams'" class="w-5 h-5" :class="iconColor" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <img
          v-else-if="stat.icon === 'store' && stat.storeIcon"
          :src="getStoreIconSrc(stat.storeIcon)"
          :alt="stat.storeName || 'Store'"
          class="w-6 h-6 rounded"
        />
      </div>

      <!-- Content -->
      <div class="flex-1">
        <p class="text-xs text-ditto-subtext mb-0.5">{{ stat.title }}</p>
        <div class="flex items-center gap-2">
          <span class="text-2xl font-semibold text-ditto-text">{{ stat.value }}</span>
          <span
            v-if="stat.change"
            :class="[
              'text-xs font-medium px-1.5 py-0.5 rounded-full',
              stat.change > 0 ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
            ]"
          >
            {{ stat.change > 0 ? '+' : '' }}{{ stat.change }}%
          </span>
        </div>
        <p v-if="stat.storeName" class="text-xs text-ditto-subtext mt-0.5">{{ stat.storeName }}</p>
      </div>
    </div>
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
    case 'average': return 'bg-info/10'
    case 'streams': return 'bg-success/10'
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
