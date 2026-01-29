<template>
  <div class="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
    <!-- Table Header -->
    <div class="hidden sm:grid grid-cols-[40px_1fr_140px_100px_120px_120px] gap-4 px-4 py-3 text-xs text-ditto-subtext min-w-[700px]">
      <div></div>
      <div>Details</div>
      <div class="text-center">Artist</div>
      <div class="text-center">Streams</div>
      <div class="text-center">Unique Listeners</div>
      <div class="text-center">Streams per listener</div>
    </div>
    
    <!-- Mobile Cards / Desktop Table Rows -->
    <div 
      v-for="release in releases" 
      :key="release.id"
      class="sm:grid sm:grid-cols-[40px_1fr_140px_100px_120px_120px] gap-4 px-4 py-4 items-center hover:bg-ditto-light-grey rounded-2xl transition-colors cursor-pointer min-w-[700px] sm:min-w-0 flex flex-col sm:flex-row"
    >
      <!-- Mobile: Card Layout -->
      <div class="flex items-center gap-4 w-full sm:contents">
        <!-- Rank -->
        <div class="text-lg text-ditto-text sm:block">{{ release.rank }}</div>
        
        <!-- Details -->
        <div class="flex items-center gap-3 sm:gap-4 flex-1">
          <img 
            :src="release.artwork" 
            :alt="release.title"
            class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover"
          />
          <div class="min-w-0">
            <p class="text-sm sm:text-base font-medium text-ditto-text truncate max-w-[180px] sm:max-w-[240px]">{{ release.title }}</p>
            <p class="text-xs text-ditto-purple">{{ release.trackCount }} Tracks</p>
            <!-- Mobile: Show streams inline -->
            <p class="text-xs text-ditto-subtext sm:hidden mt-1">{{ release.streams.toLocaleString() }} streams</p>
          </div>
        </div>
      </div>
      
      <!-- Desktop only columns -->
      <div class="hidden sm:block text-center text-sm text-ditto-subtext">
        <template v-if="release.artists && release.artists.length > 1">
          {{ release.artists.slice(0, 2).join(', ') }}
          <span v-if="release.artists.length > 2" class="text-ditto-purple">(+{{ release.artists.length - 2 }} more)</span>
        </template>
        <template v-else>{{ release.artist }}</template>
      </div>
      
      <div class="hidden sm:block text-center text-base font-medium text-ditto-text">
        {{ release.streams.toLocaleString() }}
      </div>
      
      <div class="hidden sm:block text-center text-base text-ditto-text">
        {{ release.uniqueListeners.toLocaleString() }}
      </div>
      
      <div class="hidden sm:block text-center text-base text-ditto-text">
        {{ release.streamsPerListener }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Release } from '../types'

defineProps<{
  releases: Release[]
}>()
</script>
