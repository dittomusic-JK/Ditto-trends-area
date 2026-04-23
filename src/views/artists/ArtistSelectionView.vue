<template>
  <div class="p-6 lg:p-8">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
      <h1 class="text-2xl lg:text-3xl font-bold text-white">Your Artists 🎤</h1>
      
      <!-- Filter Tabs & Search -->
      <div class="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
        <!-- Filter Tabs -->
        <div class="flex items-center gap-1 bg-[#141414] rounded-lg p-1">
          <button
            v-for="filter in filters"
            :key="filter.id"
            @click="activeFilter = filter.id"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-md transition-colors',
              activeFilter === filter.id
                ? 'bg-[#0F0E0E] text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            ]"
          >
            {{ filter.label }}
          </button>
        </div>
        
        <!-- Search -->
        <SearchInput 
          v-model="searchQuery"
          placeholder="Search for an artist"
          class="lg:w-64"
        />
      </div>
    </div>
    
    <!-- Artists Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <!-- Add New Artist Card -->
      <button 
        @click="$emit('add')"
        class="flex flex-col items-center justify-center p-4 min-h-[180px] border-2 border-dashed border-gray-600 rounded-xl hover:border-ditto-purple hover:bg-[#141414]/50 transition-all"
      >
        <div class="w-12 h-12 rounded-full border-2 border-gray-600 flex items-center justify-center mb-3">
          <IconPlus class="w-6 h-6 text-gray-400" />
        </div>
        <span class="text-sm font-medium text-white">Add New Artist</span>
      </button>
      
      <!-- Artist Cards -->
      <ArtistCard 
        v-for="artist in filteredArtists" 
        :key="artist.id" 
        :artist="artist"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Artist, ArtistFilterType } from './artistTypes'
import ArtistCard from '../../components/artists/ArtistCard.vue'
import SearchInput from '../../components/artists/SearchInput.vue'
import { IconPlus } from '../../components/icons/artistIcons'

const props = defineProps<{
  artists: Artist[]
}>()

defineEmits<{
  (e: 'select', artist: Artist): void
  (e: 'add'): void
}>()

const searchQuery = ref('')
const activeFilter = ref<ArtistFilterType>('all')

const filters = [
  { id: 'all' as ArtistFilterType, label: 'All' },
  { id: 'release' as ArtistFilterType, label: 'Release Artists' },
  { id: 'contributing' as ArtistFilterType, label: 'Contributing Artists' },
]

const filteredArtists = computed(() => {
  let result = props.artists
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(artist => 
      artist.name.toLowerCase().includes(query)
    )
  }
  
  // Filter by type (for now, just show all since we don't have that distinction in the data)
  // In a real app, you'd filter based on artist type
  
  return result
})
</script>
