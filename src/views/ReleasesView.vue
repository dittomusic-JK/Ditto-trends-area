<template>
  <div>
    <!-- Desktop Table Header -->
    <div class="hidden lg:grid grid-cols-[40px_1fr_140px_100px_120px_120px] gap-4 px-4 py-3 text-xs text-ditto-subtext">
      <div></div>
      <div>Details</div>
      <div class="text-center">Artist</div>
      <div class="text-center">Streams</div>
      <div class="text-center">Unique Listeners</div>
      <div class="text-center">Streams per listener</div>
    </div>
    
    <!-- Table Rows -->
    <div v-for="release in releases" :key="release.id" class="mb-1">
      <!-- Desktop Row -->
      <div class="hidden lg:grid grid-cols-[40px_1fr_140px_100px_120px_120px] gap-4 px-4 py-4 items-center hover:bg-ditto-light-grey rounded-2xl transition-colors cursor-pointer">
        <div class="text-lg text-ditto-text">{{ release.rank }}</div>
        <div class="flex items-center gap-4">
          <img :src="release.artwork" :alt="release.title" class="w-16 h-16 rounded-lg object-cover" />
          <div>
            <p class="text-base font-medium text-ditto-text truncate max-w-[220px]">{{ release.title }}</p>
            <p class="text-xs text-ditto-purple">{{ release.trackCount }} Tracks</p>
          </div>
        </div>
        <div class="text-center text-sm text-ditto-subtext">
          <template v-if="release.artists && release.artists.length > 1">
            {{ release.artists.slice(0, 2).join(', ') }}
            <span v-if="release.artists.length > 2" class="text-ditto-purple">(+{{ release.artists.length - 2 }} more)</span>
          </template>
          <template v-else>{{ release.artist }}</template>
        </div>
        <div class="text-center text-base font-medium text-ditto-text">{{ release.streams.toLocaleString() }}</div>
        <div class="text-center text-base text-ditto-text">{{ release.uniqueListeners.toLocaleString() }}</div>
        <div class="text-center text-base text-ditto-text">{{ release.streamsPerListener }}</div>
      </div>
      
      <!-- Mobile Row -->
      <div class="lg:hidden flex items-center gap-3 px-2 py-3 hover:bg-ditto-light-grey rounded-xl transition-colors cursor-pointer">
        <!-- Rank -->
        <span class="text-base font-medium text-ditto-subtext w-6 text-center flex-shrink-0">{{ release.rank }}</span>
        
        <!-- Artwork -->
        <img :src="release.artwork" :alt="release.title" class="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
        
        <!-- Info -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-ditto-text truncate">{{ release.title }}</p>
          <p class="text-xs text-ditto-purple mt-0.5">{{ release.trackCount }} Tracks</p>
        </div>
        
        <!-- Streams -->
        <span class="text-sm font-medium text-ditto-text flex-shrink-0">{{ formatShort(release.streams) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Release } from '../types'

defineProps<{
  releases: Release[]
}>()

const formatShort = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return num.toLocaleString()
}
</script>
