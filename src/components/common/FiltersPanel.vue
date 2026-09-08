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
        class="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-4 sm:px-6 py-5 border-b border-ditto-border-grey">
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
          <!-- Data Type (mobile only; music analytics only) -->
          <div v-if="mode !== 'video'" class="border-b border-ditto-border-grey/50 sm:hidden">
            <button 
              @click="toggleSection('dataType')"
              class="w-full flex items-center justify-between px-4 py-4 hover:bg-ditto-light-grey transition-colors"
            >
              <span class="font-semibold text-ditto-text">Data Type</span>
              <div class="flex items-center gap-2">
                <span class="text-sm text-ditto-purple">{{ selectedDataTypeLabel }}</span>
                <svg 
                  :class="['w-5 h-5 text-ditto-subtext transition-transform', expandedSection === 'dataType' ? 'rotate-180' : '']" 
                  viewBox="0 0 20 20" fill="none"
                >
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </button>
            <div v-if="expandedSection === 'dataType'" class="px-4 pb-4">
              <button 
                v-for="(label, type) in dataTypeOptions" 
                :key="type"
                @click="selectDataType(type as TrendsType)"
                class="w-full flex items-center justify-between py-2 text-left hover:text-ditto-purple transition-colors"
              >
                <div class="flex items-center gap-3">
                  <span :class="[
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                    selectedDataType === type ? 'border-ditto-purple bg-ditto-purple' : 'border-ditto-border-grey'
                  ]">
                    <svg v-if="selectedDataType === type" class="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                  <span :class="['text-sm', selectedDataType === type ? 'text-ditto-purple font-medium' : 'text-ditto-text']">{{ label }}</span>
                </div>
              </button>
            </div>
          </div>
          
          <!-- Filter sections (music or video set) -->
          <div v-for="section in sections" :key="section.type" class="border-b border-ditto-border-grey/50">
            <button 
              @click="toggleSection(section.type)"
              class="w-full flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-ditto-light-grey transition-colors"
            >
              <span class="font-semibold text-ditto-text">{{ section.title }}</span>
              <svg 
                :class="['w-5 h-5 text-ditto-subtext transition-transform', expandedSection === section.type ? 'rotate-180' : '']" 
                viewBox="0 0 20 20" fill="none"
              >
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div v-if="expandedSection === section.type" class="px-4 sm:px-6 pb-4">
              <button 
                v-for="option in section.options" 
                :key="option.id"
                @click="toggleFilter(section.type, option.id, option.name, section.title)"
                class="w-full flex items-center justify-between py-2 text-left hover:text-ditto-purple transition-colors"
              >
                <div class="flex items-center gap-3">
                  <span :class="[
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                    isSelected(section.type, option.id) ? 'border-ditto-purple bg-ditto-purple' : 'border-ditto-border-grey'
                  ]">
                    <svg v-if="isSelected(section.type, option.id)" class="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                  <span :class="['text-sm', isSelected(section.type, option.id) ? 'text-ditto-purple font-medium' : 'text-ditto-text']">{{ option.name }}</span>
                </div>
                <span v-if="option.count !== undefined" class="text-sm text-ditto-subtext">[{{ option.count.toLocaleString() }}]</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="px-4 sm:px-6 py-4 border-t border-ditto-border-grey bg-white">
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
import type { Filter, TrendsType } from '../../types'
import { videoAnalyticsData } from '../../data/videoAnalyticsMockData'

const props = defineProps<{
  isOpen: boolean
  currentFilters: Filter[]
  currentDataType?: TrendsType
  /** Which set of sections to show — music analytics (default) or the Videos ranking */
  mode?: 'music' | 'video'
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'apply', filters: Filter[]): void
  (e: 'update:dataType', type: TrendsType): void
}>()

// Filter options (mock data)
interface FilterOption { id: string; name: string; count?: number }
interface FilterSection { type: Filter['type']; title: string; options: FilterOption[] }

const musicSections: FilterSection[] = [
  { type: 'label', title: 'Label', options: [
    { id: 'l1', name: 'Kaiga Records', count: 45 },
    { id: 'l2', name: 'Independent', count: 23 },
  ] },
  { type: 'artist', title: 'Artists', options: [
    { id: 'a1', name: 'Chris Kaiga', count: 48 },
    { id: 'a2', name: 'Bensoul', count: 12 },
    { id: 'a3', name: 'Nviiri the Storyteller', count: 18 },
    { id: 'a4', name: 'Bien', count: 20 },
    { id: 'a5', name: 'Savara', count: 10 },
    { id: 'a6', name: 'Chimano', count: 14 },
    { id: 'a7', name: 'Nyashinski', count: 9 },
    { id: 'a8', name: 'Sauti Sol', count: 16 },
  ] },
  { type: 'release', title: 'Release', options: [
    { id: 'r1', name: 'Adventures of Chris Kaiga', count: 8 },
    { id: 'r2', name: 'Zimenice', count: 1 },
    { id: 'r3', name: 'Chain Chain', count: 1 },
    { id: 'r4', name: 'Niko on', count: 1 },
    { id: 'r5', name: 'Kameshika Signal', count: 1 },
    { id: 'r6', name: 'Mwazzara', count: 1 },
  ] },
  { type: 'track', title: 'Track', options: [
    { id: 't1', name: 'I Want' },
    { id: 't2', name: 'Zimenice' },
    { id: 't3', name: 'Kwa Ceiling' },
    { id: 't4', name: 'Chain Chain' },
    { id: 't5', name: 'Niko on' },
    { id: 't6', name: 'Kameshika Signal' },
  ] },
  { type: 'country', title: 'Country', options: [
    { id: 'c1', name: 'Kenya', count: 62 },
    { id: 'c2', name: 'United Kingdom', count: 12 },
    { id: 'c3', name: 'United States', count: 8 },
    { id: 'c4', name: 'Nigeria', count: 6 },
    { id: 'c5', name: 'Tanzania', count: 4 },
    { id: 'c6', name: 'Uganda', count: 3 },
  ] },
  { type: 'store', title: 'Store', options: [
    { id: 's1', name: 'Spotify' },
    { id: 's2', name: 'Apple Music' },
    { id: 's3', name: 'YouTube Music' },
    { id: 's4', name: 'Amazon Music' },
    { id: 's5', name: 'Tidal' },
    { id: 's6', name: 'SoundCloud' },
    { id: 's7', name: 'Deezer' },
    { id: 's8', name: 'Boomplay' },
  ] },
]

// Video analytics: no data type, no release/track; video, video type and platform instead
const videoSections: FilterSection[] = [
  { type: 'label', title: 'Label', options: [
    { id: 'vl1', name: 'Golden Boy Entertainment', count: 12 },
  ] },
  { type: 'artist', title: 'Artists', options: [
    { id: 'va1', name: 'Darkoo', count: 7 },
    { id: 'va2', name: 'Almost Joey', count: 5 },
    { id: 'va3', name: 'Ruger', count: 1 },
    { id: 'va4', name: 'Rema', count: 1 },
  ] },
  { type: 'video', title: 'Video', options: videoAnalyticsData.videos.map(v => ({ id: v.id, name: v.title, count: v.views })) },
  { type: 'videoType', title: 'Video type', options: [
    { id: 'vt1', name: 'Official Video', count: 6 },
    { id: 'vt2', name: 'Lyric Video', count: 1 },
    { id: 'vt3', name: 'Visualiser', count: 3 },
    { id: 'vt4', name: 'Live Performance', count: 2 },
  ] },
  { type: 'country', title: 'Country', options: [
    { id: 'c2', name: 'United Kingdom', count: 34 },
    { id: 'c4', name: 'Nigeria', count: 27 },
    { id: 'c3', name: 'United States', count: 14 },
    { id: 'c7', name: 'Ghana', count: 8 },
    { id: 'c8', name: 'France', count: 5 },
    { id: 'c9', name: 'Germany', count: 3 },
  ] },
  { type: 'platform', title: 'Store', options: [
    { id: 'vp1', name: 'Spotify' },
    { id: 'vp2', name: 'Apple Music' },
    { id: 'vp3', name: 'VEVO' },
    { id: 'vp4', name: 'TIDAL' },
    { id: 'vp5', name: 'Amazon Music' },
  ] },
]

const sections = computed(() => props.mode === 'video' ? videoSections : musicSections)

const expandedSection = ref<string | null>(null)

// Data type options for mobile
const dataTypeOptions: Record<TrendsType, string> = {
  streaming: 'Streaming',
  download: 'Download',
  fingerprint: 'Fingerprint',
  content: 'Content Production',
  preorder: 'Pre-order'
}

const selectedDataType = ref<TrendsType>(props.currentDataType || 'streaming')
const selectedDataTypeLabel = computed(() => dataTypeOptions[selectedDataType.value] || 'Streaming')

const selectDataType = (type: TrendsType) => {
  selectedDataType.value = type
  emit('update:dataType', type)
}

// Watch for external changes to currentDataType
watch(() => props.currentDataType, (newType) => {
  if (newType) selectedDataType.value = newType
})

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

const toggleFilter = (type: string, id: string, name: string, title?: string) => {
  const existingIndex = selectedFilters.value.findIndex(f => f.type === type && f.id === id)
  if (existingIndex >= 0) {
    selectedFilters.value.splice(existingIndex, 1)
  } else {
    selectedFilters.value.push({
      id,
      type: type as Filter['type'],
      label: title ?? type.charAt(0).toUpperCase() + type.slice(1),
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
