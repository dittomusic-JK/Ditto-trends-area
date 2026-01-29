<template>
  <aside class="w-full lg:w-[180px] flex-shrink-0">
    <!-- Mobile: Horizontal scrollable tabs -->
    <nav class="flex lg:flex-col gap-2 lg:gap-1 overflow-x-auto lg:overflow-visible pb-3 lg:pb-0 lg:py-4 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
      <button
        v-for="item in sidebarItems"
        :key="item.id"
        @click="$emit('navigate', item.id)"
        :class="[
          'flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-full lg:rounded-lg text-left transition-colors whitespace-nowrap flex-shrink-0',
          activeView === item.id 
            ? 'bg-ditto-purple text-white lg:bg-ditto-light-grey lg:text-ditto-purple' 
            : 'text-ditto-text bg-ditto-light-grey lg:bg-transparent hover:bg-ditto-light-grey/80'
        ]"
      >
        <component :is="item.icon" class="w-4 h-4 lg:w-5 lg:h-5" />
        <span class="text-xs lg:text-sm font-medium">{{ item.label }}</span>
      </button>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import type { ViewType } from '../../types'
import { IconMetrics, IconReleases, IconTracks, IconPlaylists, IconAudience, IconSource } from '../icons'
import { markRaw } from 'vue'

defineProps<{
  activeView: ViewType
}>()

defineEmits<{
  (e: 'navigate', view: ViewType): void
}>()

const sidebarItems = [
  { id: 'metrics' as ViewType, label: 'Metrics', icon: markRaw(IconMetrics) },
  { id: 'releases' as ViewType, label: 'Releases', icon: markRaw(IconReleases) },
  { id: 'tracks' as ViewType, label: 'Tracks', icon: markRaw(IconTracks) },
  { id: 'playlists' as ViewType, label: 'Playlists', icon: markRaw(IconPlaylists) },
  { id: 'audience' as ViewType, label: 'Audience', icon: markRaw(IconAudience) },
  { id: 'source' as ViewType, label: 'Source', icon: markRaw(IconSource) },
]
</script>
