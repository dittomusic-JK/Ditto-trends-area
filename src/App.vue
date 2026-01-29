<template>
  <div class="min-h-screen bg-white overflow-x-hidden" data-ditto-colors-light-dark-mode="light">
    <!-- Top Navigation -->
    <TopNavbar />
    
    <!-- Main Content -->
    <div class="px-4 py-4 sm:px-6 sm:py-6 lg:px-16 lg:py-8">
      <!-- Page Header -->
      <PageHeader 
        :date-range="dateRange" 
        :trends-type="trendsType"
        @open-filters="showFiltersModal = true"
        @update:date-range="updateDateRange"
        @update:trends-type="updateTrendsType"
      />
      
      <!-- Active Filters -->
      <div v-if="activeFilters.length > 0" class="flex flex-wrap gap-2 mb-4 sm:mb-6">
        <FilterChip 
          v-for="filter in activeFilters" 
          :key="filter.id"
          :label="filter.label"
          :value="filter.value"
          @remove="removeFilter(filter.id)"
        />
      </div>
      
      <!-- Main Layout with Sidebar -->
      <div class="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <!-- Left Sidebar -->
        <LeftSidebar 
          :active-view="activeView" 
          @navigate="setActiveView"
        />
        
        <!-- Content Area -->
        <div class="flex-1 min-w-0">
          <MetricsView 
            v-if="activeView === 'metrics'" 
            :data="metricsData" 
            :show-dropdown="true"
          />
          <ReleasesView 
            v-else-if="activeView === 'releases'" 
            :releases="releasesData" 
          />
          <TracksView 
            v-else-if="activeView === 'tracks'" 
            :tracks="tracksData" 
          />
          <PlaylistsView 
            v-else-if="activeView === 'playlists'" 
            :playlists="playlistsData" 
          />
          <AudienceView 
            v-else-if="activeView === 'audience'" 
            :data="audienceData" 
          />
          <SourceView 
            v-else-if="activeView === 'source'" 
            :data="sourceData" 
          />
        </div>
      </div>
    </div>
    
    <!-- Filters Panel -->
    <FiltersPanel 
      :is-open="showFiltersModal"
      :current-filters="activeFilters"
      @close="showFiltersModal = false"
      @apply="applyFilters"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ViewType, Filter, DateRange, MetricsData, TrendsType } from './types'

// Layout Components
import TopNavbar from './components/layout/TopNavbar.vue'
import LeftSidebar from './components/layout/LeftSidebar.vue'
import PageHeader from './components/layout/PageHeader.vue'
import FilterChip from './components/layout/FilterChip.vue'
import FiltersPanel from './components/common/FiltersPanel.vue'

// View Components
import MetricsView from './views/MetricsView.vue'
import ReleasesView from './views/ReleasesView.vue'
import TracksView from './views/TracksView.vue'
import PlaylistsView from './views/PlaylistsView.vue'
import AudienceView from './views/AudienceView.vue'
import SourceView from './views/SourceView.vue'

// Mock Data - using real Ditto API data
import { 
  releasesData, 
  tracksData, 
  playlistsData, 
  audienceData,
  sourceData,
  getMetricsForDateRange,
  getMetricsForTrendsType
} from './data/mockData'

// State
const activeView = ref<ViewType>('metrics')
const showFiltersModal = ref(false)

// Date range - default to last 7 days
// Analytics data has a 3-day delay (including current date)
const today = new Date()
const latestDataDate = new Date(today)
latestDataDate.setDate(today.getDate() - 3)
const lastWeek = new Date(latestDataDate)
lastWeek.setDate(latestDataDate.getDate() - 6)

const formatDate = (d: Date) => {
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

const dateRange = ref<DateRange>({
  start: formatDate(lastWeek),
  end: formatDate(latestDataDate)
})

const activeFilters = ref<Filter[]>([])

// Trends type - controls data context across all views
const trendsType = ref<TrendsType>('streaming')

// Parse date string (DD/MM/YYYY) to Date object
const parseDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('/').map(Number)
  return new Date(year, month - 1, day)
}

// Get metrics data based on trends type and date range
const metricsData = computed<MetricsData>(() => {
  // For streaming, use date range filtered data
  if (trendsType.value === 'streaming') {
    const startDate = parseDate(dateRange.value.start)
    const endDate = parseDate(dateRange.value.end)
    return getMetricsForDateRange(startDate, endDate)
  }
  // For other types, use type-specific data
  return getMetricsForTrendsType(trendsType.value)
})

// Methods
const setActiveView = (view: ViewType) => {
  activeView.value = view
}

const removeFilter = (id: string) => {
  activeFilters.value = activeFilters.value.filter(f => f.id !== id)
}

const updateDateRange = (newRange: DateRange) => {
  dateRange.value = newRange
}

const applyFilters = (filters: Filter[]) => {
  activeFilters.value = filters
}

const updateTrendsType = (type: TrendsType) => {
  trendsType.value = type
}
</script>
