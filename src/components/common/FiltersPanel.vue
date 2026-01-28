<template>
  <div>
    <!-- Backdrop -->
    <Transition name="fade">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 bg-black/30 z-40"
        @click="$emit('close')"
      ></div>
    </Transition>
    
    <!-- Panel -->
    <Transition name="slide">
      <div 
        v-if="isOpen"
        class="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-ditto-border-grey">
          <h2 class="text-2xl font-bold text-ditto-text">Filter</h2>
          <div class="flex items-center gap-4">
            <button 
              @click="clearAll"
              class="text-sm font-medium text-ditto-text underline hover:text-ditto-purple"
            >
              CLEAR ALL
            </button>
            <button @click="$emit('close')" class="text-ditto-subtext hover:text-ditto-text">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Filter Sections -->
        <div class="flex-1 overflow-y-auto">
          <!-- Label -->
          <div class="border-b border-ditto-border-grey/50">
            <button 
              @click="toggleSection('label')"
              class="w-full flex items-center justify-between px-6 py-4 hover:bg-ditto-light-grey/50 transition-colors"
            >
              <span class="font-semibold text-ditto-text">Label</span>
              <svg 
                :class="['w-5 h-5 text-ditto-subtext transition-transform', expandedSection === 'label' ? 'rotate-180' : '']" 
                viewBox="0 0 20 20" fill="none"
              >
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div v-if="expandedSection === 'label'" class="px-6 pb-4">
              <button 
                v-for="label in filterOptions.labels" 
                :key="label.id"
                @click="toggleFilter('label', label.id, label.name)"
                class="w-full flex items-center justify-between py-2 text-left hover:text-ditto-purple transition-colors"
              >
                <div class="flex items-center gap-3">
                  <span :class="[
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                    isSelected('label', label.id) ? 'border-ditto-purple bg-ditto-purple' : 'border-ditto-border-grey'
                  ]">
                    <svg v-if="isSelected('label', label.id)" class="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                  <span :class="['text-sm', isSelected('label', label.id) ? 'text-ditto-purple font-medium' : 'text-ditto-text']">{{ label.name }}</span>
                </div>
                <span class="text-sm text-ditto-subtext">[{{ label.count }}]</span>
              </button>
            </div>
          </div>
          
          <!-- Artists -->
          <div class="border-b border-ditto-border-grey/50">
            <button 
              @click="toggleSection('artist')"
              class="w-full flex items-center justify-between px-6 py-4 hover:bg-ditto-light-grey/50 transition-colors"
            >
              <span class="font-semibold text-ditto-text">Artists</span>
              <svg 
                :class="['w-5 h-5 text-ditto-subtext transition-transform', expandedSection === 'artist' ? 'rotate-180' : '']" 
                viewBox="0 0 20 20" fill="none"
              >
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div v-if="expandedSection === 'artist'" class="px-6 pb-4">
              <button 
                v-for="artist in filterOptions.artists" 
                :key="artist.id"
                @click="toggleFilter('artist', artist.id, artist.name)"
                class="w-full flex items-center justify-between py-2 text-left hover:text-ditto-purple transition-colors"
              >
                <div class="flex items-center gap-3">
                  <span :class="[
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                    isSelected('artist', artist.id) ? 'border-ditto-purple bg-ditto-purple' : 'border-ditto-border-grey'
                  ]">
                    <svg v-if="isSelected('artist', artist.id)" class="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                  <span :class="['text-sm', isSelected('artist', artist.id) ? 'text-ditto-purple font-medium' : 'text-ditto-text']">{{ artist.name }}</span>
                </div>
                <span class="text-sm text-ditto-subtext">[{{ artist.count }}]</span>
              </button>
            </div>
          </div>
          
          <!-- Release -->
          <div class="border-b border-ditto-border-grey/50">
            <button 
              @click="toggleSection('release')"
              class="w-full flex items-center justify-between px-6 py-4 hover:bg-ditto-light-grey/50 transition-colors"
            >
              <span class="font-semibold text-ditto-text">Release</span>
              <svg 
                :class="['w-5 h-5 text-ditto-subtext transition-transform', expandedSection === 'release' ? 'rotate-180' : '']" 
                viewBox="0 0 20 20" fill="none"
              >
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div v-if="expandedSection === 'release'" class="px-6 pb-4">
              <button 
                v-for="release in filterOptions.releases" 
                :key="release.id"
                @click="toggleFilter('release', release.id, release.name)"
                class="w-full flex items-center justify-between py-2 text-left hover:text-ditto-purple transition-colors"
              >
                <div class="flex items-center gap-3">
                  <span :class="[
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                    isSelected('release', release.id) ? 'border-ditto-purple bg-ditto-purple' : 'border-ditto-border-grey'
                  ]">
                    <svg v-if="isSelected('release', release.id)" class="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                  <span :class="['text-sm', isSelected('release', release.id) ? 'text-ditto-purple font-medium' : 'text-ditto-text']">{{ release.name }}</span>
                </div>
                <span class="text-sm text-ditto-subtext">[{{ release.count }}]</span>
              </button>
            </div>
          </div>
          
          <!-- Track -->
          <div class="border-b border-ditto-border-grey/50">
            <button 
              @click="toggleSection('track')"
              class="w-full flex items-center justify-between px-6 py-4 hover:bg-ditto-light-grey/50 transition-colors"
            >
              <span class="font-semibold text-ditto-text">Track</span>
              <svg 
                :class="['w-5 h-5 text-ditto-subtext transition-transform', expandedSection === 'track' ? 'rotate-180' : '']" 
                viewBox="0 0 20 20" fill="none"
              >
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div v-if="expandedSection === 'track'" class="px-6 pb-4">
              <button 
                v-for="track in filterOptions.tracks" 
                :key="track.id"
                @click="toggleFilter('track', track.id, track.name)"
                class="w-full flex items-center justify-between py-2 text-left hover:text-ditto-purple transition-colors"
              >
                <div class="flex items-center gap-3">
                  <span :class="[
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                    isSelected('track', track.id) ? 'border-ditto-purple bg-ditto-purple' : 'border-ditto-border-grey'
                  ]">
                    <svg v-if="isSelected('track', track.id)" class="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                  <span :class="['text-sm', isSelected('track', track.id) ? 'text-ditto-purple font-medium' : 'text-ditto-text']">{{ track.name }}</span>
                </div>
              </button>
            </div>
          </div>
          
          <!-- Country -->
          <div class="border-b border-ditto-border-grey/50">
            <button 
              @click="toggleSection('country')"
              class="w-full flex items-center justify-between px-6 py-4 hover:bg-ditto-light-grey/50 transition-colors"
            >
              <span class="font-semibold text-ditto-text">Country</span>
              <svg 
                :class="['w-5 h-5 text-ditto-subtext transition-transform', expandedSection === 'country' ? 'rotate-180' : '']" 
                viewBox="0 0 20 20" fill="none"
              >
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div v-if="expandedSection === 'country'" class="px-6 pb-4">
              <button 
                v-for="country in filterOptions.countries" 
                :key="country.id"
                @click="toggleFilter('country', country.id, country.name)"
                class="w-full flex items-center justify-between py-2 text-left hover:text-ditto-purple transition-colors"
              >
                <div class="flex items-center gap-3">
                  <span :class="[
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                    isSelected('country', country.id) ? 'border-ditto-purple bg-ditto-purple' : 'border-ditto-border-grey'
                  ]">
                    <svg v-if="isSelected('country', country.id)" class="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                  <span :class="['text-sm', isSelected('country', country.id) ? 'text-ditto-purple font-medium' : 'text-ditto-text']">{{ country.name }}</span>
                </div>
                <span class="text-sm text-ditto-subtext">[{{ country.count }}]</span>
              </button>
            </div>
          </div>
          
          <!-- Store -->
          <div class="border-b border-ditto-border-grey/50">
            <button 
              @click="toggleSection('store')"
              class="w-full flex items-center justify-between px-6 py-4 hover:bg-ditto-light-grey/50 transition-colors"
            >
              <span class="font-semibold text-ditto-text">Store</span>
              <svg 
                :class="['w-5 h-5 text-ditto-subtext transition-transform', expandedSection === 'store' ? 'rotate-180' : '']" 
                viewBox="0 0 20 20" fill="none"
              >
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div v-if="expandedSection === 'store'" class="px-6 pb-4">
              <button 
                v-for="store in filterOptions.stores" 
                :key="store.id"
                @click="toggleFilter('store', store.id, store.name)"
                class="w-full flex items-center justify-between py-2 text-left hover:text-ditto-purple transition-colors"
              >
                <div class="flex items-center gap-3">
                  <span :class="[
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                    isSelected('store', store.id) ? 'border-ditto-purple bg-ditto-purple' : 'border-ditto-border-grey'
                  ]">
                    <svg v-if="isSelected('store', store.id)" class="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                  <span :class="['text-sm', isSelected('store', store.id) ? 'text-ditto-purple font-medium' : 'text-ditto-text']">{{ store.name }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="px-6 py-4 border-t border-ditto-border-grey bg-white">
          <button 
            @click="applyFilters"
            class="w-full flex items-center justify-between px-6 py-3 bg-ditto-text text-white rounded-full font-medium hover:bg-ditto-text/90 transition-colors"
          >
            <span>Apply ({{ selectedCount }})</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Filter } from '../../types'

const props = defineProps<{
  isOpen: boolean
  currentFilters: Filter[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'apply', filters: Filter[]): void
}>()

// Filter options (mock data)
const filterOptions = {
  labels: [
    { id: 'l1', name: 'Kaiga Records', count: 45 },
    { id: 'l2', name: 'Independent', count: 23 },
  ],
  artists: [
    { id: 'a1', name: 'Chris Kaiga', count: 48 },
    { id: 'a2', name: 'Bensoul', count: 12 },
    { id: 'a3', name: 'Nviiri the Storyteller', count: 18 },
    { id: 'a4', name: 'Bien', count: 20 },
    { id: 'a5', name: 'Savara', count: 10 },
    { id: 'a6', name: 'Chimano', count: 14 },
    { id: 'a7', name: 'Nyashinski', count: 9 },
    { id: 'a8', name: 'Sauti Sol', count: 16 },
  ],
  releases: [
    { id: 'r1', name: 'Adventures of Chris Kaiga', count: 8 },
    { id: 'r2', name: 'Zimenice', count: 1 },
    { id: 'r3', name: 'Chain Chain', count: 1 },
    { id: 'r4', name: 'Niko on', count: 1 },
    { id: 'r5', name: 'Kameshika Signal', count: 1 },
    { id: 'r6', name: 'Mwazzara', count: 1 },
  ],
  tracks: [
    { id: 't1', name: 'I Want', count: 48214 },
    { id: 't2', name: 'Zimenice', count: 16374 },
    { id: 't3', name: 'Kwa Ceiling', count: 10794 },
    { id: 't4', name: 'Chain Chain', count: 9205 },
    { id: 't5', name: 'Niko on', count: 8400 },
    { id: 't6', name: 'Kameshika Signal', count: 6112 },
  ],
  countries: [
    { id: 'c1', name: 'Kenya', count: 62 },
    { id: 'c2', name: 'United Kingdom', count: 12 },
    { id: 'c3', name: 'United States', count: 8 },
    { id: 'c4', name: 'Nigeria', count: 6 },
    { id: 'c5', name: 'Tanzania', count: 4 },
    { id: 'c6', name: 'Uganda', count: 3 },
  ],
  stores: [
    { id: 's1', name: 'Spotify' },
    { id: 's2', name: 'Apple Music' },
    { id: 's3', name: 'YouTube Music' },
    { id: 's4', name: 'Amazon Music' },
    { id: 's5', name: 'Tidal' },
    { id: 's6', name: 'SoundCloud' },
    { id: 's7', name: 'Deezer' },
    { id: 's8', name: 'Boomplay' },
  ]
}

const expandedSection = ref<string | null>(null)

// Local copy of selected filters
const selectedFilters = ref<Filter[]>([...props.currentFilters])

// Watch for external changes to currentFilters (e.g., when removing via FilterChip)
watch(() => props.currentFilters, (newFilters) => {
  selectedFilters.value = [...newFilters]
}, { deep: true })

const toggleSection = (section: string) => {
  expandedSection.value = expandedSection.value === section ? null : section
}

const isSelected = (type: string, id: string): boolean => {
  return selectedFilters.value.some(f => f.type === type && f.id === id)
}

const toggleFilter = (type: string, id: string, name: string) => {
  const existingIndex = selectedFilters.value.findIndex(f => f.type === type && f.id === id)
  if (existingIndex >= 0) {
    selectedFilters.value.splice(existingIndex, 1)
  } else {
    selectedFilters.value.push({
      id,
      type: type as Filter['type'],
      label: type.charAt(0).toUpperCase() + type.slice(1),
      value: name
    })
  }
}

const selectedCount = computed(() => selectedFilters.value.length)

const clearAll = () => {
  selectedFilters.value = []
}

const applyFilters = () => {
  emit('apply', [...selectedFilters.value])
  emit('close')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
