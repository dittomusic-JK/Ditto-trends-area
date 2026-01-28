<template>
  <div>
    <!-- Table Header -->
    <div class="grid grid-cols-[40px_1fr_120px_100px] gap-4 px-4 py-3 text-xs text-ditto-subtext">
      <div></div>
      <div>Source</div>
      <div class="text-center">Streams</div>
      <div class="text-center">Proportion</div>
    </div>
    
    <!-- Table Rows -->
    <div 
      v-for="(source, index) in data.sources" 
      :key="source.id"
      class="grid grid-cols-[40px_1fr_120px_100px] gap-4 px-4 py-4 items-center hover:bg-ditto-light-grey rounded-2xl transition-colors cursor-pointer"
    >
      <!-- Rank -->
      <div class="text-lg text-ditto-text">{{ index + 1 }}</div>
      
      <!-- Source -->
      <div class="flex items-center gap-4">
        <div 
          class="w-12 h-12 rounded-xl flex items-center justify-center"
          :style="{ backgroundColor: sourceColors[index] + '15' }"
        >
          <component 
            :is="getSourceIcon(source.icon)" 
            class="w-6 h-6" 
            :style="{ color: sourceColors[index] }" 
          />
        </div>
        <div>
          <p class="text-base font-medium text-ditto-text">{{ source.name }}</p>
        </div>
      </div>
      
      <!-- Streams -->
      <div class="text-center text-base font-medium text-ditto-text">
        {{ source.streams.toLocaleString() }}
      </div>
      
      <!-- Proportion -->
      <div class="text-center text-base text-ditto-text">
        {{ source.proportion }}%
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import type { SourceViewData } from '../types'

defineProps<{
  data: SourceViewData
}>()

// Colors for each source
const sourceColors = ['#8640f4', '#F87171', '#34D399', '#FBBF24', '#60A5FA']

// Get icon component for source type
const getSourceIcon = (iconType: string) => {
  const icons: Record<string, any> = {
    radio: {
      render() {
        return h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z' })
        ])
      }
    },
    playlist: {
      render() {
        return h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' })
        ])
      }
    },
    library: {
      render() {
        return h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z' })
        ])
      }
    },
    artist: {
      render() {
        return h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })
        ])
      }
    },
    search: {
      render() {
        return h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' })
        ])
      }
    }
  }
  return icons[iconType] || icons.playlist
}
</script>
