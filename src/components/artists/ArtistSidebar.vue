<template>
  <aside class="w-full lg:w-[240px] flex-shrink-0 bg-[#0F0E0E] lg:min-h-full">
    <!-- Artist Info (Desktop) -->
    <div class="hidden lg:block px-5 py-6">
      <button 
        @click="$emit('back')" 
        class="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors"
      >
        <IconChevronLeft class="w-4 h-4" />
        Back To Artists
      </button>
      
      <div class="flex items-center gap-3 mb-6">
        <img 
          :src="artist.avatar" 
          :alt="artist.name" 
          class="w-14 h-14 rounded-full object-cover border-2 border-ditto-purple"
        />
        <div>
          <h2 class="font-semibold text-white">{{ artist.name }}</h2>
          <p class="text-sm text-ditto-purple">{{ artist.releaseCount }} Releases</p>
        </div>
      </div>
    </div>
    
    <!-- Navigation -->
    <nav class="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-3 lg:pb-0 scrollbar-hide px-3 lg:px-3">
      <button
        v-for="item in sidebarItems"
        :key="item.id"
        @click="$emit('navigate', item.id)"
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors whitespace-nowrap flex-shrink-0 w-full',
          activeView === item.id 
            ? 'bg-[#141414] text-white' 
            : 'text-gray-400 hover:bg-[#141414]/50 hover:text-white'
        ]"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span class="text-sm font-medium">{{ item.label }}</span>
      </button>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import type { ArtistViewType, Artist } from '../../views/artists/artistTypes'
import { 
  IconOverview, 
  IconReleases, 
  IconContributions, 
  IconSmartlinks, 
  IconIntegrations, 
  IconContracts,
  IconChevronLeft
} from '../icons/artistIcons'
import { markRaw } from 'vue'

defineProps<{
  activeView: ArtistViewType
  artist: Artist
}>()

defineEmits<{
  (e: 'navigate', view: ArtistViewType): void
  (e: 'back'): void
}>()

const sidebarItems = [
  { id: 'overview' as ArtistViewType, label: 'Overview', icon: markRaw(IconOverview) },
  { id: 'releases' as ArtistViewType, label: 'Releases', icon: markRaw(IconReleases) },
  { id: 'contributions' as ArtistViewType, label: 'Contributions', icon: markRaw(IconContributions) },
  { id: 'smartlinks' as ArtistViewType, label: 'Smartlinks', icon: markRaw(IconSmartlinks) },
  { id: 'integrations' as ArtistViewType, label: 'Integrations', icon: markRaw(IconIntegrations) },
  { id: 'contracts' as ArtistViewType, label: 'Contracts', icon: markRaw(IconContracts) },
]
</script>
