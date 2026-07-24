<template>
  <LiquidTabs :tabs="tabs" :active="activeView" @select="$emit('navigate', $event as ArtistViewType)" />
</template>

<script setup lang="ts">
import LiquidTabs from '../common/LiquidTabs.vue'
import type { ArtistViewType } from '../../views/artists/artistTypes'

defineProps<{
  activeView: ArtistViewType
  isDarkMode?: boolean
}>()

defineEmits<{
  (e: 'navigate', view: ArtistViewType): void
}>()

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'releases', label: 'Releases' },
  { id: 'contributions', label: 'Contributions' },
  { id: 'smartlinks', label: 'Smartlinks' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'contracts', label: 'Contracts' },
]
</script>
