<template>
  <nav class="flex items-center gap-2">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      @click="$emit('navigate', tab.id)"
      :class="[
        'px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap',
        activeView === tab.id 
          ? 'bg-ditto-text text-white' 
          : 'bg-ditto-light-grey text-ditto-text hover:bg-ditto-light-grey/80'
      ]"
    >
      {{ tab.label }}
    </button>
  </nav>
</template>

<script setup lang="ts">
import type { ArtistViewType } from '../../views/artists/artistTypes'

defineProps<{
  activeView: ArtistViewType
  isDarkMode?: boolean
}>()

defineEmits<{
  (e: 'navigate', view: ArtistViewType): void
}>()

const tabs = [
  { id: 'overview' as ArtistViewType, label: 'Overview' },
  { id: 'releases' as ArtistViewType, label: 'Releases' },
  { id: 'contributions' as ArtistViewType, label: 'Contributions' },
  { id: 'smartlinks' as ArtistViewType, label: 'Smartlinks' },
  { id: 'integrations' as ArtistViewType, label: 'Integrations' },
  { id: 'contracts' as ArtistViewType, label: 'Contracts' },
]
</script>
