<template>
  <div :class="[
    'flex items-center gap-3 py-3 border-b last:border-b-0 transition-all duration-200 hover:scale-[1.01]',
    isDarkMode ? 'border-gray-700/30' : 'border-gray-100'
  ]">
    <!-- Artwork -->
    <img 
      :src="song.artwork" 
      :alt="song.title" 
      class="w-10 h-10 rounded object-cover flex-shrink-0 shadow-sm"
    />
    
    <!-- Song Info -->
    <div class="flex-1 min-w-0">
      <p :class="['text-sm font-medium truncate', isDarkMode ? 'text-white' : 'text-gray-900']">{{ song.title }}</p>
    </div>
    
    <!-- Stream Count -->
    <p :class="['text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-500']">{{ formatNumber(song.streams) }}</p>
  </div>
</template>

<script setup lang="ts">
import type { TopSong } from '../../views/artists/artistTypes'

defineProps<{
  song: TopSong
  isDarkMode?: boolean
}>()

const formatNumber = (num: number): string => {
  return num.toLocaleString()
}
</script>
