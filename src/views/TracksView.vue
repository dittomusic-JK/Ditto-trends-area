<template>
  <div>
    <!-- Table Header (Desktop only) -->
    <div class="hidden sm:grid grid-cols-[40px_1fr_140px_100px_120px_120px] gap-4 px-4 py-3 text-xs text-ditto-subtext">
      <div></div>
      <div>Details</div>
      <div class="text-center">Artist</div>
      <div class="text-center">Streams</div>
      <div class="text-center">Unique Listeners</div>
      <div class="text-center">Streams per listener</div>
    </div>
    
    <!-- Table Rows -->
    <div 
      v-for="track in tracks" 
      :key="track.id"
      class="sm:grid sm:grid-cols-[40px_1fr_140px_100px_120px_120px] gap-4 px-2 sm:px-4 py-3 sm:py-4 items-center hover:bg-ditto-light-grey rounded-2xl transition-colors cursor-pointer"
    >
      <!-- Mobile: Card Layout -->
      <div class="flex items-center gap-3 w-full sm:contents">
        <!-- Rank -->
        <div class="text-base sm:text-lg text-ditto-text flex-shrink-0 w-6">{{ track.rank }}</div>
        
        <!-- Details -->
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <img 
            :src="track.artwork" 
            :alt="track.title"
            class="w-11 h-11 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
          />
          <div class="min-w-0 flex-1">
            <p class="text-sm sm:text-base font-medium text-ditto-text truncate">{{ track.title }}</p>
            <p class="text-xs text-ditto-subtext truncate">{{ track.releaseName }}</p>
            <p class="text-xs text-ditto-subtext sm:hidden mt-0.5">{{ track.streams.toLocaleString() }} streams</p>
          </div>
        </div>
      </div>
      
      <!-- Desktop only columns -->
      <div class="hidden sm:block text-center text-sm text-ditto-subtext">
        <template v-if="track.artists && track.artists.length > 1">
          {{ track.artists.slice(0, 2).join(', ') }}
        </template>
        <template v-else>{{ track.artist }}</template>
      </div>
      
      <div class="hidden sm:block text-center text-base font-medium text-ditto-text">
        {{ track.streams.toLocaleString() }}
      </div>
      
      <div class="hidden sm:block text-center text-base text-ditto-text">
        {{ track.uniqueListeners.toLocaleString() }}
      </div>
      
      <div class="hidden sm:block text-center text-base text-ditto-text">
        {{ track.streamsPerListener }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Track } from '../types'

defineProps<{
  tracks: Track[]
}>()
</script>
