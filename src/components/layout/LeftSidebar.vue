<template>
  <aside class="w-[180px] py-4 flex-shrink-0">
    <nav class="flex flex-col gap-1">
      <button
        v-for="item in sidebarItems"
        :key="item.id"
        @click="$emit('navigate', item.id)"
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
          activeView === item.id 
            ? 'bg-ditto-light-grey text-ditto-purple' 
            : 'text-ditto-text hover:bg-ditto-light-grey/50'
        ]"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span class="text-sm font-medium">{{ item.label }}</span>
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
