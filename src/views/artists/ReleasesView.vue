<template>
  <div class="p-6 lg:p-8">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
      <h1 :class="['text-2xl lg:text-3xl font-bold', isDarkMode ? 'text-white' : 'text-gray-900']">Releases</h1>
      
      <div class="flex items-center gap-3">
        <SearchInput 
          v-model="searchQuery"
          placeholder="Search for a release"
          class="lg:w-64"
          :is-dark-mode="isDarkMode"
        />
        <button :class="[
          'px-4 py-2.5 flex items-center gap-2 border rounded-lg transition-colors',
          isDarkMode ? 'border-gray-600 text-white hover:border-ditto-purple' : 'border-gray-300 text-gray-700 hover:border-ditto-purple'
        ]">
          <IconFilter :class="['w-5 h-5', isDarkMode ? 'text-gray-400' : 'text-gray-500']" />
          <span class="text-sm font-medium">Filters</span>
        </button>
      </div>
    </div>
    
    <!-- Table -->
    <div :class="[
      'rounded-xl overflow-hidden',
      isDarkMode ? 'bg-[#141414]' : 'bg-white'
    ]">
      <!-- Table Header -->
      <div :class="[
        'hidden lg:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium uppercase tracking-wider',
        isDarkMode ? 'bg-[#0F0E0E] text-gray-500' : 'bg-white text-gray-500'
      ]">
        <div class="col-span-5">Details</div>
        <div class="col-span-3">Release Date</div>
        <div class="col-span-2">Artist role</div>
        <div class="col-span-2">Status</div>
      </div>
      
      <!-- Table Body -->
      <div :class="['divide-y', isDarkMode ? 'divide-gray-700/30' : 'divide-gray-100']">
        <div 
          v-for="release in filteredReleases" 
          :key="release.id"
          :class="[
            'grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-4 px-4 lg:px-6 py-4 transition-colors',
            isDarkMode ? 'hover:bg-[#0F0E0E]/50' : 'hover:bg-ditto-light-grey'
          ]"
        >
          <!-- Details -->
          <div class="lg:col-span-5 flex items-center gap-3">
            <img 
              :src="release.artwork" 
              :alt="release.title" 
              class="w-12 h-12 rounded object-cover flex-shrink-0 shadow-sm"
            />
            <span :class="['font-medium truncate', isDarkMode ? 'text-white' : 'text-gray-900']">{{ release.title }}</span>
          </div>
          
          <!-- Release Date -->
          <div class="lg:col-span-3 flex items-center">
            <span :class="['text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-500']">{{ release.releaseDate }}</span>
          </div>
          
          <!-- Artist Role -->
          <div class="lg:col-span-2 flex items-center">
            <span :class="['text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-500']">{{ release.artistRole }}</span>
          </div>
          
          <!-- Status -->
          <div class="lg:col-span-2 flex items-center">
            <span 
              :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                getStatusClass(release.status)
              ]"
            >
              {{ release.status }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="filteredReleases.length === 0" class="px-6 py-12 text-center">
        <p class="text-gray-500">No releases found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ArtistRelease, ReleaseStatus } from './artistTypes'
import SearchInput from '../../components/artists/SearchInput.vue'
import { IconFilter } from '../../components/icons/artistIcons'

const props = defineProps<{
  releases: ArtistRelease[]
  isDarkMode?: boolean
}>()

const searchQuery = ref('')

const filteredReleases = computed(() => {
  if (!searchQuery.value) return props.releases
  
  const query = searchQuery.value.toLowerCase()
  return props.releases.filter(release => 
    release.title.toLowerCase().includes(query)
  )
})

const getStatusClass = (status: ReleaseStatus): string => {
  switch (status) {
    case 'Active':
      return 'bg-success/15 text-success'
    case 'Sent to stores':
      return 'bg-ditto-purple/20 text-ditto-purple'
    case 'Pending':
      return 'bg-warning/15 text-warning'
    case 'Processing':
      return 'bg-info/15 text-info'
    default:
      return 'bg-ditto-light-grey text-ditto-subtext'
  }
}
</script>
