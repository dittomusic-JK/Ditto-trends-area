<template>
  <div>
    <!-- Table Header -->
    <div class="grid grid-cols-[40px_1fr_140px_100px_120px_120px] gap-4 px-4 py-3 text-xs text-ditto-subtext">
      <div></div>
      <div>Details</div>
      <div class="text-center">Artist</div>
      <div class="text-center">Streams</div>
      <div class="text-center">Unique Listeners</div>
      <div class="text-center">Streams per listener</div>
    </div>
    
    <!-- Table Rows -->
    <div 
      v-for="release in releases" 
      :key="release.id"
      class="grid grid-cols-[40px_1fr_140px_100px_120px_120px] gap-4 px-4 py-4 items-center hover:bg-ditto-light-grey rounded-2xl transition-colors cursor-pointer"
    >
      <!-- Rank -->
      <div class="text-lg text-ditto-text">{{ release.rank }}</div>
      
      <!-- Details -->
      <div class="flex items-center gap-4">
        <img 
          :src="release.artwork" 
          :alt="release.title"
          class="w-16 h-16 rounded-lg object-cover"
        />
        <div>
          <p class="text-base font-medium text-ditto-text truncate max-w-[240px]">{{ release.title }}</p>
          <p class="text-xs text-ditto-purple">{{ release.trackCount }} Tracks</p>
        </div>
      </div>
      
      <!-- Artist -->
      <div class="text-center text-sm text-ditto-subtext">
        <template v-if="release.artists && release.artists.length > 1">
          {{ release.artists.slice(0, 2).join(', ') }}
          <span v-if="release.artists.length > 2" class="text-ditto-purple">(+{{ release.artists.length - 2 }} more)</span>
        </template>
        <template v-else>{{ release.artist }}</template>
      </div>
      
      <!-- Streams -->
      <div class="text-center text-base font-medium text-ditto-text">
        {{ release.streams.toLocaleString() }}
      </div>
      
      <!-- Unique Listeners -->
      <div class="text-center text-base text-ditto-text">
        {{ release.uniqueListeners.toLocaleString() }}
      </div>
      
      <!-- Streams per Listener -->
      <div class="text-center text-base text-ditto-text">
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
