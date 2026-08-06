<template>
  <div class="min-h-screen bg-white w-full max-w-full" :data-ditto-colors-light-dark-mode="isDark ? 'dark' : 'light'">
    <!-- Top Navigation (in side-nav exploration mode it only provides the mobile header) -->
    <div :class="navStyle === 'side' ? 'md:hidden' : ''">
      <TopNavbar :active-section="appSection" :royalties-section="royaltiesCurrentSection" @navigate="handleNavbarNavigate" @create-video="handleCreateVideo" @create-music="appSection = 'music-builder'" @toggle-basket="showMiniBasket = true" @open-live-performances="handleOpenLivePerformances" @open-royalties="handleOpenRoyalties" />
    </div>

    <div :class="navStyle === 'side' ? 'md:flex md:items-start' : ''">
    <!-- Alternative nav exploration (?nav=side): collapsible left rail -->
    <SideNav v-if="navStyle === 'side'" :active-section="appSection" :royalties-section="royaltiesCurrentSection" @navigate="handleNavbarNavigate" @create-video="handleCreateVideo" @create-music="appSection = 'music-builder'" @toggle-basket="showMiniBasket = true" @open-live-performances="handleOpenLivePerformances" @open-royalties="handleOpenRoyalties" />
    <div :class="navStyle === 'side' ? 'flex-1 min-w-0 md:[--header-h:0px]' : ''" :data-nav="navStyle === 'side' ? 'side' : null">
    <!-- Home hub (root, reached via the Ditto logo) -->
    <HomeView v-if="appSection === 'home'" @navigate="(s: string) => appSection = s as AppSection" />

    <!-- Analytics Section -->
    <div v-if="appSection === 'analytics'" class="relative px-4 py-4 sm:px-6 sm:py-6 lg:px-16 lg:py-8 w-full max-w-full box-border">
      <GlobalSearch />
      <!-- Page Header -->
      <PageHeader 
        :date-range="dateRange" 
        :trends-type="trendsType"
        :highlight-type-dropdown="showTypeHighlight"
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
      
      <!-- New user: analytics arrive with the first live release -->
      <NewUserEmptyState
        v-if="isNewUser"
        icon="/img/suite/playlisting.svg"
        title="No data to show yet"
        message="Streams, audience and playlist insights appear here once your first release is live in stores."
        cta-label="Create your first release"
        @cta="appSection = 'music-builder'"
      />

      <!-- Side-nav mode: the analytics views move up into a tab row -->
      <div v-if="!isNewUser && navStyle === 'side'" class="mb-6 overflow-x-auto scrollbar-hide">
        <LiquidTabs :tabs="analyticsTabs" :active="activeView" @select="setActiveView($event as ViewType)" />
      </div>

      <!-- Main Layout with Sidebar -->
      <div v-if="!isNewUser" class="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <!-- Left Sidebar -->
        <LeftSidebar
          v-if="navStyle !== 'side'"
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
            :trends-type="trendsType"
          />
          <TracksView 
            v-else-if="activeView === 'tracks'" 
            :tracks="tracksData" 
            :trends-type="trendsType"
          />
          <PlaylistsView 
            v-else-if="activeView === 'playlists'" 
            :playlists="playlistsData" 
            :trends-type="trendsType"
            @switch-to-streams="updateTrendsType('streaming')"
          />
          <AudienceView 
            v-else-if="activeView === 'audience'" 
            :data="audienceData" 
            :trends-type="trendsType"
            @switch-to-streams="updateTrendsType('streaming')"
          />
          <SourceView 
            v-else-if="activeView === 'source'" 
            :data="sourceData" 
            :trends-type="trendsType"
          />
        </div>
      </div>
    </div>
    
    <!-- Filters Panel -->
    <FiltersPanel 
      :is-open="showFiltersModal"
      :current-filters="activeFilters"
      :current-data-type="trendsType"
      @close="showFiltersModal = false"
      @apply="applyFilters"
      @update:data-type="updateTrendsType"
    />

    <!-- Royalties Section -->
    <RoyaltiesDashboard v-if="appSection === 'royalties'" :open-section="royaltiesRequest" @section-changed="royaltiesCurrentSection = $event" @navigate="appSection = $event as AppSection" />

    <!-- Music Section -->
    <!-- Keyed so re-tapping "Music" in the nav resets to the releases overview -->
    <MusicView v-if="appSection === 'music'" :key="musicViewKey" :open-release="searchRelease" @navigate="(s: string) => appSection = s as AppSection" @navigate-view="(s: string, v: string) => handleNavigateView(s as AppSection, v)" />

    <!-- Music Release Builder (Create > Music Release) -->
    <ReleaseBuilderView v-if="appSection === 'music-builder'" @back="appSection = 'music'" @navigate="(s: string) => appSection = s as AppSection" />

    <!-- Artists Section -->
    <ArtistsDashboard v-if="appSection === 'artists'" :open-artist-id="searchArtistId" />

    <!-- Publishing Section -->
    <PublishingDashboard v-if="appSection === 'publishing'" :open-live="publishingLiveRequest" @navigate="appSection = $event" @live-consumed="publishingLiveRequest = false" />

    <!-- Sync Section -->
    <SyncView v-if="appSection === 'sync'" />

    <!-- Videos Section -->
    <VideosDashboard
      v-if="appSection === 'videos'"
      :auto-open-create="videoCreateRequested"
      @create-consumed="videoCreateRequested = false"
    />

    <!-- Neighbouring Rights Section -->
    <div v-if="appSection === 'neighbouring-rights'" class="relative px-4 py-4 sm:px-6 sm:py-6 lg:px-16 lg:py-8 w-full max-w-full box-border">
      <GlobalSearch />
      <NeighbouringRightsView @navigate="appSection = $event as AppSection" />
    </div>

    <!-- Basket Section -->
    <BasketView v-if="appSection === 'basket'" @navigate="handleBasketNavigate" />

    <!-- Order Confirmation Section -->
    <OrderConfirmationView v-if="appSection === 'order-confirmation'" @navigate="appSection = 'basket'" />

    <!-- Mini basket drawer (opened from the nav basket icon) -->
    <MiniBasket :open="showMiniBasket" @close="showMiniBasket = false" @navigate="appSection = 'basket'" />
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide, markRaw, nextTick } from 'vue'
import { IconMetrics, IconReleases, IconTracks, IconPlaylists, IconAudience, IconSource } from './components/icons'
import type { ViewType, Filter, DateRange, MetricsData, TrendsType, AppSection } from './types'

// Layout Components
import TopNavbar from './components/layout/TopNavbar.vue'
import SideNav from './components/layout/SideNav.vue'
import GlobalSearch from './components/layout/GlobalSearch.vue'
import type { ReleaseListItem } from './data/releaseDetailMockData'
import LeftSidebar from './components/layout/LeftSidebar.vue'
import PageHeader from './components/layout/PageHeader.vue'
import FilterChip from './components/layout/FilterChip.vue'
import FiltersPanel from './components/common/FiltersPanel.vue'
import LiquidTabs from './components/common/LiquidTabs.vue'
import NewUserEmptyState from './components/common/NewUserEmptyState.vue'
import { useDemoUser } from './composables/useDemoUser'

// Royalties Dashboard
import RoyaltiesDashboard from './views/royalties/RoyaltiesDashboard.vue'

// Home hub
import HomeView from './views/home/HomeView.vue'

// Music page
import MusicView from './views/MusicView.vue'
import ReleaseBuilderView from './views/music/builder/ReleaseBuilderView.vue'

// Artists dashboard
import ArtistsDashboard from './views/artists/ArtistsDashboard.vue'

// Publishing dashboard
import PublishingDashboard from './views/publishing/PublishingDashboard.vue'

// Videos dashboard
import VideosDashboard from './views/videos/VideosDashboard.vue'

// Neighbouring Rights
import NeighbouringRightsView from './views/NeighbouringRightsView.vue'

// Basket & order confirmation
import BasketView from './views/basket/BasketView.vue'
import OrderConfirmationView from './views/basket/OrderConfirmationView.vue'
import MiniBasket from './components/basket/MiniBasket.vue'

// Sync
import SyncView from './views/sync/SyncView.vue'

// Theme (dark mode class + legacy token attribute)
import { useTheme } from './composables/useTheme'

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

// State — initial section can come from the URL (?section=basket), and the
// basket demo states (?demo=voucher etc.) imply the basket section.
const urlParams = new URLSearchParams(window.location.search)
// Alternative navigation exploration: ?nav=side swaps the top bar for a
// collapsible left rail. Default stays on the current top-nav iteration.
const { isDark } = useTheme()

const navStyle = urlParams.get('nav') === 'side' ? 'side' : 'top'

// New-user demo state (empty dashboards + onboarding CTAs)
const { isNewUser } = useDemoUser()
// Full-height views (Artists, release manage) read this to add their own
// header band in side-nav mode, where there's no top bar to anchor them.
provide('navStyle', navStyle)
const sectionParam = urlParams.get('section') as AppSection | null
const initialSection: AppSection =
  sectionParam ?? (urlParams.has('demo') ? 'basket' : 'home')
const appSection = ref<AppSection>(initialSection)

// Re-tapping a section in the nav resets that section to its landing state
// (e.g. Music returns from a release detail to the releases overview).
const musicViewKey = ref(0)
const handleNavbarNavigate = (s: AppSection) => {
  if (s === 'music' && appSection.value === 'music') musicViewKey.value++
  appSection.value = s
}

const showMiniBasket = ref(false)

const handleBasketNavigate = (target: 'order-confirmation' | 'music') => {
  appSection.value = target
}

// Lets "Create > Video Release" in the nav launch the video flow from any page.
const videoCreateRequested = ref(false)
const handleCreateVideo = () => {
  videoCreateRequested.value = true
  appSection.value = 'videos'
}

// The side rail's Royalties dropdown opens the dashboard on a specific section.
const royaltiesRequest = ref<string | null>(null)
const royaltiesCurrentSection = ref('sales')
// Global search: open a specific release / artist (null-then-set so repeat
// selections of the same item still re-trigger the watchers)
const searchRelease = ref<ReleaseListItem | null>(null)
const handleSearchRelease = (item: ReleaseListItem) => {
  appSection.value = 'music'
  searchRelease.value = null
  nextTick(() => { searchRelease.value = item })
}

const searchArtistId = ref<string | null>(null)
const handleSearchArtist = (id: string) => {
  appSection.value = 'artists'
  searchArtistId.value = null
  nextTick(() => { searchArtistId.value = id })
}

const handleOpenRoyalties = (section: string) => {
  appSection.value = 'royalties'
  // Null-then-set so re-clicking the same rail item still re-opens that section
  royaltiesRequest.value = null
  nextTick(() => { royaltiesRequest.value = section })
}

// Navigation API for the global search (lives inside page headers)
provide('appNav', {
  navigate: (s: string) => handleNavbarNavigate(s as AppSection),
  openRoyalties: handleOpenRoyalties,
  openRelease: handleSearchRelease,
  openArtist: handleSearchArtist,
})

// Lets "Rights Management > Register Live Performances" open Publishing on the live tab.
const publishingLiveRequest = ref(false)
const handleOpenLivePerformances = () => {
  publishingLiveRequest.value = true
  appSection.value = 'publishing'
}
const activeView = ref<ViewType>('metrics')

// Side-nav mode replaces the analytics left sidebar with a tab row
const analyticsTabs = [
  { id: 'metrics', label: 'Metrics', icon: markRaw(IconMetrics) },
  { id: 'releases', label: 'Releases', icon: markRaw(IconReleases) },
  { id: 'tracks', label: 'Tracks', icon: markRaw(IconTracks) },
  { id: 'playlists', label: 'Playlists', icon: markRaw(IconPlaylists) },
  { id: 'audience', label: 'Audience', icon: markRaw(IconAudience) },
  { id: 'source', label: 'Source', icon: markRaw(IconSource) },
]
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

// Highlight the Type dropdown when downloads is selected on tabs that don't support it
const showTypeHighlight = computed(() => {
  return trendsType.value === 'download' && (activeView.value === 'playlists' || activeView.value === 'audience')
})

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

const handleNavigateView = (section: AppSection, view: string) => {
  appSection.value = section
  if (section === 'analytics') activeView.value = view as ViewType
}
</script>
