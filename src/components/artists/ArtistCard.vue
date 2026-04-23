<template>
  <button 
    @click="$emit('select', artist)"
    :class="[
      'flex flex-col items-center p-4 rounded-xl transition-all',
      isSelected ? 'ring-2 ring-ditto-purple bg-[#141414]' : 'hover:bg-[#141414]/50'
    ]"
  >
    <!-- Avatar -->
    <div class="relative mb-3">
      <img 
        :src="artist.avatar" 
        :alt="artist.name" 
        class="w-24 h-24 lg:w-32 lg:h-32 rounded-full object-cover"
      />
      
      <!-- Plan Artist Badge -->
      <span 
        v-if="artist.isPlanArtist"
        class="absolute -bottom-1 left-1/2 -translate-x-1/2 plan-artist-badge px-2 py-0.5 text-[10px] font-semibold text-white rounded-full whitespace-nowrap"
      >
        PLAN ARTIST
      </span>
    </div>
    
    <!-- Name -->
    <h3 class="font-medium text-sm text-white text-center">{{ artist.name }}</h3>
    
    <!-- Release Count -->
    <p class="text-xs text-ditto-purple">{{ artist.releaseCount }} Releases</p>
  </button>
</template>

<script setup lang="ts">
import type { Artist } from '../../views/artists/artistTypes'

defineProps<{
  artist: Artist
  isSelected?: boolean
}>()

defineEmits<{
  (e: 'select', artist: Artist): void
}>()
</script>
