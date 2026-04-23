<template>
<aside :class="[
  'w-[280px] flex-shrink-0 border-r flex flex-col h-full',
  isDarkMode ? 'bg-[#0F0E0E] border-gray-800' : 'bg-white border-gray-200'
]">
    <!-- Header -->
    <div :class="['px-4 py-5 border-b', isDarkMode ? 'border-gray-800' : 'border-gray-200']">
      <div class="flex items-center justify-between mb-4">
        <h2 :class="['text-lg font-semibold', isDarkMode ? 'text-white' : 'text-gray-900']">Your Artists</h2>
        <div class="relative">
          <button 
            @click="showFilterDropdown = !showFilterDropdown"
            :class="['flex items-center gap-1 text-sm transition-colors', isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700']"
          >
            {{ filterLabels[activeFilter] }}
            <IconChevronDown class="w-4 h-4" :class="{ 'rotate-180': showFilterDropdown }" />
          </button>
          
          <!-- Filter Dropdown -->
          <div 
            v-if="showFilterDropdown"
            :class="['absolute right-0 top-full mt-1 w-44 border rounded-lg shadow-lg z-20 py-1', isDarkMode ? 'bg-[#1a1a1a] border-gray-700' : 'bg-white border-gray-200']"
          >
            <button
              v-for="(label, key) in filterLabels"
              :key="key"
              @click="selectFilter(key as ArtistFilterType)"
              :class="[
                'w-full px-3 py-2 text-sm text-left transition-colors',
                activeFilter === key 
                  ? 'text-ditto-purple bg-purple-50/10' 
                  : isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-ditto-light-grey'
              ]"
            >
              {{ label }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Add New Artist Button -->
      <button 
        @click="$emit('add')"
        :class="[
          'w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all',
          isDarkMode ? 'text-gray-400 hover:text-ditto-purple hover:bg-gray-800' : 'text-gray-600 hover:text-ditto-purple hover:bg-ditto-light-grey'
        ]"
      >
        <div :class="['w-6 h-6 rounded-full border border-dashed flex items-center justify-center', isDarkMode ? 'border-gray-600' : 'border-gray-400']">
          <IconPlus class="w-3 h-3" />
        </div>
        Add New Artist
      </button>
    </div>
    
    <!-- Artists List -->
    <div class="flex-1 overflow-y-auto py-2">
      <button
        v-for="artist in filteredArtists"
        :key="artist.id"
        @click="$emit('select', artist)"
        :class="[
          'flex items-center gap-3 px-3 py-2.5 transition-all rounded-lg',
          selectedArtist?.id === artist.id 
            ? isDarkMode ? 'bg-purple-900/20 border border-ditto-purple/30' : 'bg-[#FDF2F8] border border-[#A855F7]/30' 
            : isDarkMode ? 'hover:bg-gray-800 border border-transparent' : 'hover:bg-ditto-light-grey border border-transparent'
        ]"
        style="width: calc(100% - 16px); margin-left: 8px; margin-right: 8px;"
      >
        <img 
          :src="artist.avatar" 
          :alt="artist.name" 
          class="w-10 h-10 rounded-full object-cover ring-2 ring-transparent"
          :class="{ 'ring-ditto-purple': selectedArtist?.id === artist.id }"
        />
        <div class="flex-1 min-w-0 text-left">
          <p :class="['text-sm font-medium truncate', selectedArtist?.id === artist.id ? 'text-ditto-purple' : isDarkMode ? 'text-white' : 'text-gray-900']">{{ artist.name }}</p>
          <p class="text-xs text-ditto-purple">{{ artist.releaseCount }} Releases</p>
        </div>
      </button>
      
      <!-- Empty state -->
      <div v-if="filteredArtists.length === 0" class="px-4 py-8 text-center">
        <p class="text-sm text-gray-500">No {{ filterLabels[activeFilter].toLowerCase() }} found</p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Artist, ArtistFilterType } from '../../views/artists/artistTypes'
import { IconPlus, IconChevronDown } from '../icons/artistIcons'

const props = defineProps<{
  artists: Artist[]
  selectedArtist: Artist | null
  isDarkMode?: boolean
}>()

defineEmits<{
  (e: 'select', artist: Artist): void
  (e: 'add'): void
}>()

const showFilterDropdown = ref(false)
const activeFilter = ref<ArtistFilterType>('all')

const filterLabels: Record<ArtistFilterType, string> = {
  all: 'All',
  plan: 'Plan Artists',
  release: 'Release Artists',
  contributing: 'Contributing Artists'
}

const filteredArtists = computed(() => {
  if (activeFilter.value === 'all') {
    return props.artists
  }
  return props.artists.filter(artist => artist.artistType === activeFilter.value)
})

const selectFilter = (filter: ArtistFilterType) => {
  activeFilter.value = filter
  showFilterDropdown.value = false
}
</script>
