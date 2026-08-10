<template>
  <div class="relative flex flex-col h-[calc(100vh-var(--header-h,80px))]">
    <GlobalSearch />
    <!-- Side-nav mode: header band anchors the top edge (no top bar above) -->
    <div v-if="navStyle === 'side'" class="flex-shrink-0 px-4 sm:px-6 lg:px-16 pt-4 sm:pt-5 lg:pt-6 pb-4">
      <button v-if="selectedArtist" @click="backToGrid" class="flex items-center gap-1.5 text-sm text-ditto-subtext hover:text-ditto-text transition-colors mb-1.5">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        All artists
      </button>
      <h1 class="font-satoshi font-black text-xl sm:text-3xl lg:text-[42px] tracking-[-0.03em] text-ditto-text">
        Your Artists <span>🎤</span>
      </h1>
    </div>

    <div class="flex flex-1 min-h-0">
    <!-- Left Artist List Sidebar (top-nav mode only) -->
    <ArtistListSidebar
      v-if="navStyle !== 'side'"
      :artists="roster"
      :selected-artist="selectedArtist"
      :is-dark-mode="false"
      @select="selectArtist"
      @add="handleAddArtist"
      class="hidden lg:flex"
    />

    <!-- Main Content Area -->
    <div class="flex-1 min-w-0 overflow-y-auto">
      <!-- Side-nav mode: artist grid (browsing surface, like the release grid) -->
      <div v-if="!selectedArtist && navStyle === 'side'">
        <!-- Sticky filter bar (same anatomy as the release grid) -->
        <div v-if="!isNewUser" class="sticky top-0 z-20 bg-white px-4 sm:px-6 lg:px-16 pt-4 pb-3 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.06)]">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <LiquidTabs :tabs="artistFilterTabs" :active="artistFilter" @select="artistFilter = $event as ArtistFilterType" />
            <SearchInput v-model="artistSearch" placeholder="Search for an artist" />
          </div>
        </div>

        <div class="px-4 sm:px-6 lg:px-16 py-6">
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          <!-- Create new artist -->
          <button
            @click="handleAddArtist"
            class="aspect-square rounded-2xl bg-white shadow-[0_2px_14px_rgba(16,31,60,0.08)] hover:shadow-[0_12px_32px_rgba(95,31,255,0.18)] hover:-translate-y-1 flex flex-col items-center justify-center gap-3 transition-all duration-200 group"
          >
            <img src="/img/suite/add-artist.svg" alt="" class="h-12 w-auto group-hover:scale-105 transition-transform" />
            <span class="text-center">
              <span class="block text-sm font-bold text-ditto-text">New artist</span>
              <span class="block text-xs text-ditto-subtext mt-1">Profiles, IDs &amp; contracts</span>
            </span>
          </button>

          <button
            v-for="artist in filteredGridArtists"
            :key="artist.id"
            @click="selectArtist(artist)"
            class="text-left group"
          >
            <span class="relative block aspect-square rounded-2xl overflow-hidden">
              <img v-if="artist.avatar" :src="artist.avatar" :alt="artist.name" class="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300" loading="lazy" />
              <InitialsAvatar v-else :name="artist.name" text-class="text-4xl" />
              <span v-if="artist.isPlanArtist" class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-ditto-purple text-white">Plan</span>
            </span>
            <span class="block text-sm font-semibold text-ditto-text truncate mt-2.5">{{ artist.name }}</span>
            <span class="block text-xs text-ditto-subtext mt-0.5">
              {{ artist.releaseCount }} {{ artist.artistType === 'contributing' ? (artist.releaseCount === 1 ? 'Track' : 'Tracks') : (artist.releaseCount === 1 ? 'Release' : 'Releases') }}
            </span>
          </button>

          <!-- New user: ghost artist tiles -->
          <template v-if="isNewUser">
            <div v-for="n in 8" :key="'ghost-artist-' + n" :style="{ opacity: Math.max(0, 1 - n * 0.15) }">
              <div class="aspect-square rounded-2xl bg-ditto-light-grey"></div>
              <div class="w-20 h-2.5 rounded bg-ditto-light-grey mt-3"></div>
              <div class="w-14 h-2 rounded bg-ditto-light-grey mt-2"></div>
            </div>
          </template>
        </div>
        </div>
      </div>

      <!-- No Artist Selected (top-nav mode) -->
      <div v-else-if="!selectedArtist" class="p-8">
        <div class="max-w-2xl mx-auto text-center py-20">
          <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <IconPlus class="w-10 h-10 text-gray-400" />
          </div>
          <h2 class="text-2xl font-semibold text-ditto-text mb-2">Select an Artist</h2>
          <p class="text-ditto-subtext mb-6">Choose an artist from the sidebar or add a new one to get started.</p>
          <button @click="handleAddArtist" class="px-6 py-3 bg-ditto-purple text-white font-medium rounded-full hover:opacity-90 transition-opacity">
            Add New Artist
          </button>
        </div>
      </div>

      <!-- Artist Detail View -->
      <div v-else>
        <div :class="[
          'sticky top-0 z-10 bg-white py-4',
          navStyle === 'side'
            ? 'px-4 sm:px-6 lg:px-16 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.06)]'
            : 'px-6 lg:px-8 border-b border-gray-200'
        ]">
          <div class="flex items-center gap-6">
            <HorizontalTabNav :active-view="activeView" :is-dark-mode="false" @navigate="setActiveView" />

            <!-- Side-nav mode: artist switcher dropdown, top right -->
            <div v-if="navStyle === 'side'" class="relative ml-auto flex-shrink-0" ref="switcherRef">
              <button
                @click="switcherOpen = !switcherOpen"
                class="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:border-ditto-purple/40 hover:bg-ditto-light-grey transition-colors"
              >
                <span class="block w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                  <img v-if="selectedArtist.avatar" :src="selectedArtist.avatar" :alt="selectedArtist.name" class="w-full h-full object-cover" />
                  <InitialsAvatar v-else :name="selectedArtist.name" text-class="text-[10px]" />
                </span>
                <span class="text-sm font-semibold text-ditto-text max-w-[160px] truncate">{{ selectedArtist.name }}</span>
                <svg class="w-3.5 h-3.5 text-ditto-subtext transition-transform" :class="switcherOpen ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <div v-if="switcherOpen" class="absolute right-0 top-full mt-2 w-80 max-h-[420px] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-30">
                <p class="px-4 pt-1 pb-2 text-xs text-ditto-subtext">Switch artist</p>
                <button
                  v-for="item in roster"
                  :key="item.id"
                  @click="selectArtist(item); switcherOpen = false"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                  :style="item.id === selectedArtist.id ? { backgroundColor: 'var(--accent-tint)' } : {}"
                  :class="item.id === selectedArtist.id ? '' : 'hover:bg-ditto-light-grey'"
                >
                  <span class="block w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                    <img v-if="item.avatar" :src="item.avatar" :alt="item.name" class="w-full h-full object-cover" />
                    <InitialsAvatar v-else :name="item.name" text-class="text-xs" />
                  </span>
                  <span class="min-w-0 flex-1">
                    <span :class="['block text-sm font-semibold truncate', item.id === selectedArtist.id ? 'text-ditto-purple' : 'text-ditto-text']">{{ item.name }}</span>
                    <span class="block text-xs text-ditto-subtext truncate">{{ item.releaseCount }} {{ item.releaseCount === 1 ? 'Release' : 'Releases' }}</span>
                  </span>
                  <span v-if="item.id === selectedArtist.id" class="w-1.5 h-1.5 rounded-full bg-ditto-purple flex-shrink-0"></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white">
          <OverviewView v-if="activeView === 'overview'" :artist="selectedArtist" :top-songs="topSongs" :top-countries="topCountries" :integrations="integrations" :is-dark-mode="false" @edit-artist="handleEditArtist" />
          <ReleasesView v-else-if="activeView === 'releases'" :releases="releases" :is-dark-mode="false" />
          <ContributionsView v-else-if="activeView === 'contributions'" :contributions="contributions" :is-dark-mode="false" />
          <SmartlinksView v-else-if="activeView === 'smartlinks'" :smartlinks="smartlinks" :is-dark-mode="false" />
          <IntegrationsView v-else-if="activeView === 'integrations'" :integrations="integrations" :is-dark-mode="false" />
          <ContractsView v-else-if="activeView === 'contracts'" :available-contracts="availableContracts" :user-contracts="userContracts" :is-dark-mode="false" @select-contract="handleContractSelect" />
          <EditArtistView v-else-if="activeView === 'edit'" :artist="selectedArtist" @cancel="activeView = 'overview'" @save="handleSaveArtist" />
        </div>
      </div>
    </div>
    </div>

    <!-- Edit Artist Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="showEditModal = false">
      <div class="rounded-2xl max-w-5xl w-[90vw] max-h-[90vh] overflow-y-auto shadow-2xl bg-white">
        <EditArtistView :artist="isAddingNewArtist ? undefined : selectedArtist!" :is-new="isAddingNewArtist" :is-dark-mode="false" @cancel="showEditModal = false" @save="handleSaveArtist" />
      </div>
    </div>

    <!-- Contract Purchase Modal -->
    <div v-if="showContractModal && selectedContract" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="showContractModal = false">
      <div class="rounded-2xl max-w-4xl w-[90vw] max-h-[90vh] overflow-y-auto shadow-2xl bg-white">
        <ContractPurchaseView :contract="selectedContract" :artist="selectedArtist ?? undefined" :is-dark-mode="false" @back="showContractModal = false" @submit="handleContractSubmit" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, watch, onMounted, onUnmounted } from 'vue'
import { useDemoUser } from '../../composables/useDemoUser'
import type { ArtistViewType, ArtistFilterType, Artist, AvailableContract } from './artistTypes'
import LiquidTabs from '../../components/common/LiquidTabs.vue'
import SearchInput from '../../components/common/SearchInput.vue'
import InitialsAvatar from '../../components/common/InitialsAvatar.vue'
import GlobalSearch from '../../components/layout/GlobalSearch.vue'

// 'side' when the ?nav=side left-rail exploration is active (no top bar).
const navStyle = inject<'top' | 'side'>('navStyle', 'top')

const props = defineProps<{ openArtistId?: string | null }>()

import ArtistListSidebar from '../../components/artists/ArtistListSidebar.vue'
import HorizontalTabNav from '../../components/artists/HorizontalTabNav.vue'
import OverviewView from './OverviewView.vue'
import ReleasesView from './ReleasesView.vue'
import ContributionsView from './ContributionsView.vue'
import SmartlinksView from './SmartlinksView.vue'
import IntegrationsView from './IntegrationsView.vue'
import ContractsView from './ContractsView.vue'
import EditArtistView from './EditArtistView.vue'
import ContractPurchaseView from './ContractPurchaseView.vue'
import { IconPlus } from '../../components/icons/artistIcons'

import {
  artists, topSongs, topCountries, releases, contributions,
  smartlinks, integrations, availableContracts, userContracts
} from '../../data/artistsMockData'

// New-user demo: empty roster + onboarding ghosts
const { isNewUser } = useDemoUser()
const roster = computed(() => (isNewUser.value ? [] : artists))

// Side-nav mode opens on the artist grid; top-nav keeps the first artist selected
const selectedArtist = ref<Artist | null>(navStyle === 'side' || isNewUser.value ? null : artists[0])
const activeView = ref<ArtistViewType>('overview')

watch(isNewUser, (fresh) => {
  selectedArtist.value = fresh || navStyle === 'side' ? null : artists[0]
})

// Grid filters (side-nav mode): same sub-nav anatomy as the release grid
const artistFilter = ref<ArtistFilterType>('all')
const artistSearch = ref('')
const artistFilterTabs = [
  { id: 'all', label: 'All' },
  { id: 'plan', label: 'Plan' },
  { id: 'release', label: 'Release' },
  { id: 'contributing', label: 'Contributing' },
]
const filteredGridArtists = computed(() => {
  const q = artistSearch.value.trim().toLowerCase()
  return roster.value.filter(a =>
    (artistFilter.value === 'all' || a.artistType === artistFilter.value) &&
    (!q || a.name.toLowerCase().includes(q))
  )
})

// Artist switcher dropdown (side-nav detail view)
const switcherOpen = ref(false)
const switcherRef = ref<HTMLElement | null>(null)
const backToGrid = () => { selectedArtist.value = null }
const handleClickOutside = (e: MouseEvent) => {
  if (switcherOpen.value && switcherRef.value && !switcherRef.value.contains(e.target as Node)) {
    switcherOpen.value = false
  }
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
const showEditModal = ref(false)
const isAddingNewArtist = ref(false)
const showContractModal = ref(false)
const selectedContract = ref<AvailableContract | null>(null)

const selectArtist = (artist: Artist) => { selectedArtist.value = artist; activeView.value = 'overview' }

// Global search can land directly on an artist
watch(() => props.openArtistId, (id) => {
  if (!id) return
  const match = artists.find(a => a.id === id)
  if (match) selectArtist(match)
}, { immediate: true })
const setActiveView = (view: ArtistViewType) => { activeView.value = view }
const handleAddArtist = () => { isAddingNewArtist.value = true; showEditModal.value = true }
const handleEditArtist = () => { isAddingNewArtist.value = false; showEditModal.value = true }
const handleSaveArtist = (_data: any) => { showEditModal.value = false }
const handleContractSelect = (contract: AvailableContract) => { selectedContract.value = contract; showContractModal.value = true }
const handleContractSubmit = (_data: any) => { showContractModal.value = false }
</script>
