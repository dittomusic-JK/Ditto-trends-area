<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6 lg:px-16 lg:py-8 w-full max-w-full box-border">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
      <h1 class="font-poppins font-bold text-xl sm:text-3xl lg:text-[42px] tracking-tight text-ditto-text text-center sm:text-left">
        Royalties &amp; Sales <span>💰</span>
      </h1>
      <div class="flex items-center gap-2 sm:gap-3">
        <div class="relative group">
          <span class="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-ditto-subtext bg-white flex items-center gap-2 cursor-help">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Last 12 Months
          </span>
          <div class="absolute top-full left-0 mt-2 w-64 p-3 bg-ditto-text text-white text-xs leading-relaxed rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
            <p>Store royalty data is reported with a <span class="font-semibold">2–3 month delay</span>. The most recent data shown may be from a few months ago.</p>
            <div class="absolute bottom-full left-6 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-ditto-text"></div>
          </div>
        </div>
        <button
          @click="showFilters = true"
          class="flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 border border-gray-200 rounded-lg text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors flex-shrink-0"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
            <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
            <line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>
          </svg>
          <span class="hidden sm:inline">Filters</span>
        </button>
      </div>
    </div>

    <!-- Filter Chips -->
    <div v-if="activeFilters.length > 0" class="flex flex-wrap gap-2 mb-4">
      <FilterChip v-for="filter in activeFilters" :key="filter.id" :label="filter.label" :value="filter.value" @remove="removeFilter(filter.id)" />
    </div>

    <!-- Sub Nav -->
    <div class="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
      <button
        v-for="tab in sectionTabs" :key="tab.id"
        @click="activeSection = tab.id"
        :class="['px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0', activeSection === tab.id ? 'bg-ditto-text text-white' : 'bg-ditto-light-grey text-ditto-text hover:bg-ditto-light-grey/80']"
      >{{ tab.label }}</button>

      <div class="flex-1"></div>

      <button v-if="activeSection !== 'payouts'" @click="activeSection = 'payouts'" class="flex items-center gap-2 px-6 py-2.5 bg-ditto-text text-white text-sm font-semibold rounded-full hover:bg-ditto-text/90 transition-colors flex-shrink-0">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Request Payout
      </button>
    </div>

    <!-- Sales -->
    <template v-if="activeSection === 'sales'">
      <div class="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <RoyaltiesSidebar :active-view="activeView" @navigate="setActiveView" />
        <div class="flex-1 min-w-0">
          <OverviewView v-if="activeView === 'overview'" :stats="filteredStats" :earnings="filteredEarnings" :stores="storesData" :countries="countriesData" :breakdown="breakdownData" @navigate-to-countries="activeView = 'countries'" />
          <template v-else>
            <button @click="activeView = 'overview'" class="flex items-center gap-1.5 text-sm text-ditto-purple hover:text-ditto-purple/80 mb-4 transition-colors">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Back to Overview
            </button>
            <ReleasesView v-if="activeView === 'releases'" :releases="filteredReleases" />
            <TracksView v-else-if="activeView === 'tracks'" :tracks="filteredTracks" />
            <StoresView v-else-if="activeView === 'stores'" :stores="storesData" />
            <CountriesView v-else-if="activeView === 'countries'" :countries="countriesData" />
          </template>
        </div>
      </div>
    </template>
    <CollaborationsView v-else-if="activeSection === 'collaborations'" />
    <ReportsView v-else-if="activeSection === 'reports'" />
    <PayoutsView v-else-if="activeSection === 'payouts'" />
  </div>

  <!-- Filters Panel -->
  <FiltersPanel :is-open="showFilters" :current-filters="activeFilters" @close="showFilters = false" @apply="applyFilters" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { RoyaltiesSectionType, RoyaltiesViewType, Filter } from '../../types'
import FilterChip from '../../components/layout/FilterChip.vue'
import FiltersPanel from '../../components/common/FiltersPanel.vue'
import RoyaltiesSidebar from './RoyaltiesSidebar.vue'
import OverviewView from './OverviewView.vue'
import ReleasesView from './ReleasesView.vue'
import TracksView from './TracksView.vue'
import StoresView from './StoresView.vue'
import CountriesView from './CountriesView.vue'
import CollaborationsView from './CollaborationsView.vue'
import ReportsView from './ReportsView.vue'
import PayoutsView from './PayoutsView.vue'
import { statsData, earningsData, storesData, countriesData, breakdownData, releasesData, tracksData } from '../../data/royaltiesMockData'

const activeSection = ref<RoyaltiesSectionType>('sales')
const activeView = ref<RoyaltiesViewType>('overview')
const showFilters = ref(false)
const activeFilters = ref<Filter[]>([])

const sectionTabs = [
  { id: 'sales' as RoyaltiesSectionType, label: 'Sales' },
  { id: 'collaborations' as RoyaltiesSectionType, label: 'Collaborations' },
  { id: 'reports' as RoyaltiesSectionType, label: 'Reports' },
  { id: 'payouts' as RoyaltiesSectionType, label: 'Payouts' },
]

const setActiveView = (view: RoyaltiesViewType) => { activeView.value = view }
const removeFilter = (id: string) => { activeFilters.value = activeFilters.value.filter(f => f.id !== id) }
const applyFilters = (filters: Filter[]) => { activeFilters.value = filters }

// Filtered data
const hasFilters = computed(() => activeFilters.value.length > 0)
const filterScale = computed(() => {
  if (!hasFilters.value) return 1
  const artistFilters = activeFilters.value.filter(f => f.type === 'artist').length
  const releaseFilters = activeFilters.value.filter(f => f.type === 'release').length
  const trackFilters = activeFilters.value.filter(f => f.type === 'track').length
  if (trackFilters > 0) return 0.08
  if (releaseFilters > 0) return 0.15
  if (artistFilters > 0) return 0.35
  return 0.6
})

const filteredStats = computed(() => {
  if (!hasFilters.value) return statsData
  const s = filterScale.value
  return statsData.map(stat => ({
    ...stat,
    value: stat.id === 'best-store' ? stat.value : `£${Math.round(parseFloat(stat.value.replace(/[£,]/g, '')) * s).toLocaleString()}`,
  }))
})

const filteredEarnings = computed(() => {
  if (!hasFilters.value) return earningsData
  const s = filterScale.value
  return earningsData.map(d => ({ ...d, total: Math.round(d.total * s), streams: Math.round(d.streams * s), downloads: Math.round(d.downloads * s) }))
})

const filteredReleases = computed(() => {
  if (!hasFilters.value) return releasesData
  const releaseFilter = activeFilters.value.find(f => f.type === 'release')
  if (releaseFilter) return releasesData.filter(r => r.title === releaseFilter.value)
  const artistFilter = activeFilters.value.find(f => f.type === 'artist')
  if (artistFilter) return releasesData.filter(r => r.artist === artistFilter.value)
  const s = filterScale.value
  return releasesData.map(r => ({ ...r, streams: Math.round(r.streams * s), downloads: Math.round(r.downloads * s), earnings: Math.round(r.earnings * s * 100) / 100 }))
})

const filteredTracks = computed(() => {
  if (!hasFilters.value) return tracksData
  const trackFilter = activeFilters.value.find(f => f.type === 'track')
  if (trackFilter) return tracksData.filter(t => t.title === trackFilter.value)
  const artistFilter = activeFilters.value.find(f => f.type === 'artist')
  if (artistFilter) return tracksData.filter(t => t.artist === artistFilter.value)
  const s = filterScale.value
  return tracksData.map(t => ({ ...t, streams: Math.round(t.streams * s), downloads: Math.round(t.downloads * s), earnings: Math.round(t.earnings * s * 100) / 100 }))
})
</script>
