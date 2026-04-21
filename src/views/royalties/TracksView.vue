<template>
  <div>
    <div class="hidden lg:grid grid-cols-[40px_1fr_140px_100px_100px_120px] gap-4 px-4 py-3 text-xs text-ditto-subtext">
      <div></div>
      <div>Details</div>
      <div class="text-center">Artist</div>
      <div class="text-center">Streams</div>
      <div class="text-center">Downloads</div>
      <div class="text-center">Earnings</div>
    </div>
    <div v-for="track in tracks" :key="track.id" class="mb-1">
      <div class="hidden lg:grid grid-cols-[40px_1fr_140px_100px_100px_120px] gap-4 px-4 py-4 items-center hover:bg-ditto-light-grey rounded-2xl transition-colors cursor-pointer">
        <div class="text-lg text-ditto-text">{{ track.rank }}</div>
        <div class="flex items-center gap-4">
          <img :src="track.artwork" :alt="track.title" class="w-16 h-16 rounded-lg object-cover" />
          <div>
            <p class="text-base font-medium text-ditto-text truncate max-w-[220px]">{{ track.title }}</p>
            <p class="text-xs text-ditto-subtext truncate">{{ track.releaseName }}</p>
          </div>
        </div>
        <div class="text-center text-sm text-ditto-subtext">{{ track.artist }}</div>
        <div class="text-center text-base text-ditto-text">{{ formatShort(track.streams) }}</div>
        <div class="text-center text-base text-ditto-text">{{ track.downloads.toLocaleString() }}</div>
        <div class="text-center text-base font-semibold text-ditto-purple">{{ formatCurrency(track.earnings) }}</div>
      </div>
      <!-- Mobile -->
      <div class="lg:hidden flex items-center gap-3 px-2 py-3 hover:bg-ditto-light-grey rounded-xl transition-colors cursor-pointer">
        <span class="text-base font-medium text-ditto-subtext w-6 text-center flex-shrink-0">{{ track.rank }}</span>
        <img :src="track.artwork" :alt="track.title" class="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-ditto-text truncate">{{ track.title }}</p>
          <p class="text-xs text-ditto-subtext truncate mt-0.5">{{ track.artist }}</p>
        </div>
        <span class="text-sm font-semibold text-ditto-purple flex-shrink-0">{{ formatCurrency(track.earnings) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TrackEarnings } from '../../types'

defineProps<{
  tracks: TrackEarnings[]
}>()

const formatShort = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return num.toLocaleString()
}

const formatCurrency = (val: number): string => {
  if (val >= 1000000) return `£${(val / 1000000).toFixed(1)}M`
  if (val >= 1000) return `£${(val / 1000).toFixed(1)}K`
  return `£${val.toFixed(2)}`
}
</script>
