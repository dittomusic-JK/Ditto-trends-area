<template>
  <div class="p-6 lg:p-8">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
      <h1 :class="['text-2xl lg:text-3xl font-bold', isDarkMode ? 'text-white' : 'text-gray-900']">Smartlinks</h1>
      
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
        <div class="col-span-4">Details</div>
        <div class="col-span-2">Status</div>
        <div class="col-span-2">Release Date</div>
        <div class="col-span-2">Clicks</div>
        <div class="col-span-2"></div>
      </div>
      
      <!-- Table Body -->
      <div :class="['divide-y', isDarkMode ? 'divide-gray-700/30' : 'divide-gray-100']">
        <div 
          v-for="smartlink in filteredSmartlinks" 
          :key="smartlink.id"
          :class="[
            'grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-4 px-4 lg:px-6 py-4 transition-colors',
            isDarkMode ? 'hover:bg-[#0F0E0E]/50' : 'hover:bg-ditto-light-grey'
          ]"
        >
          <!-- Details -->
          <div class="lg:col-span-4 flex items-center gap-3">
            <div class="relative">
              <img 
                :src="smartlink.artwork" 
                :alt="smartlink.title" 
                class="w-12 h-12 rounded object-cover flex-shrink-0 shadow-sm"
              />
              <span 
                :class="[
                  'absolute -bottom-1 -right-1 px-1.5 py-0.5 text-[9px] font-semibold rounded whitespace-nowrap',
                  smartlink.status === 'Released' ? 'bg-success text-white' : 'bg-ditto-purple text-white'
                ]"
              >
                {{ smartlink.status === 'Released' ? 'Live' : 'Pre' }}
              </span>
            </div>
            <div class="min-w-0">
              <p :class="['font-medium truncate', isDarkMode ? 'text-white' : 'text-gray-900']">{{ smartlink.title }}</p>
              <p class="text-xs text-ditto-purple">by {{ smartlink.artist }}</p>
              <p :class="['text-xs truncate', isDarkMode ? 'text-gray-500' : 'text-gray-400']">{{ smartlink.url }}</p>
            </div>
          </div>
          
          <!-- Status (Mobile shows inline) -->
          <div class="lg:col-span-2 flex items-center">
            <span class="w-3 h-3 rounded-full bg-success mr-2"></span>
            <span :class="['text-sm lg:hidden', isDarkMode ? 'text-gray-400' : 'text-gray-500']">Active</span>
          </div>
          
          <!-- Release Date -->
          <div class="lg:col-span-2 flex items-center">
            <span :class="['text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-500']">{{ smartlink.releaseDate }}</span>
          </div>
          
          <!-- Clicks -->
          <div class="lg:col-span-2 flex items-center">
            <span :class="['text-sm font-medium', isDarkMode ? 'text-white' : 'text-gray-900']">{{ formatNumber(smartlink.clicks) }}</span>
          </div>
          
          <!-- Actions -->
          <div class="lg:col-span-2 flex items-center justify-end gap-2">
            <button 
              :class="['p-2 rounded-lg transition-colors', isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-ditto-light-grey']"
              title="View Analytics"
            >
              <img src="/images/analytics.svg" alt="Analytics" class="w-5 h-5" :class="{ 'invert': isDarkMode }" />
            </button>
            <button 
              :class="['p-2 rounded-lg transition-colors', isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-ditto-light-grey']"
              title="Edit"
            >
              <img src="/images/edit.svg" alt="Edit" class="w-5 h-5" :class="{ 'invert': isDarkMode }" />
            </button>
            <button 
              @click="copyLink(smartlink.url)"
              :class="['p-2 rounded-lg transition-colors', isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-ditto-light-grey']"
              title="Copy Link"
            >
              <img src="/images/link-alt (1) 1.svg" alt="Copy Link" class="w-5 h-5" :class="{ 'invert': isDarkMode }" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="filteredSmartlinks.length === 0" class="px-6 py-12 text-center">
        <p class="text-gray-500">No smartlinks found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Smartlink } from './artistTypes'
import SearchInput from '../../components/artists/SearchInput.vue'
import { IconFilter } from '../../components/icons/artistIcons'

const props = defineProps<{
  smartlinks: Smartlink[]
  isDarkMode?: boolean
}>()

const searchQuery = ref('')

const filteredSmartlinks = computed(() => {
  if (!searchQuery.value) return props.smartlinks
  
  const query = searchQuery.value.toLowerCase()
  return props.smartlinks.filter(smartlink => 
    smartlink.title.toLowerCase().includes(query) ||
    smartlink.artist.toLowerCase().includes(query)
  )
})

const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

const copyLink = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url)
    // Could add a toast notification here
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>
