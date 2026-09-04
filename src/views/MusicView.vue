<template>
  <ReleaseDetailView
    v-if="openedRelease"
    :release="openedRelease"
    @back="openedRelease = null"
    @switch-release="openRelease"
    @view-analytics="$emit('viewAnalytics', $event)"
  />
  <div v-else class="relative">
    <GlobalSearch />
    <div class="px-4 sm:px-6 lg:px-16 pt-4 sm:pt-6 lg:pt-8">
    <!-- Welcome Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <h1 class="font-satoshi font-black text-xl sm:text-3xl lg:text-[42px] tracking-[-0.03em] text-ditto-text">
        Your Releases <span>💿</span>
      </h1>
      <button @click="$emit('navigate', 'music-builder')" class="flex items-center gap-2 px-5 py-2.5 bg-ditto-purple btn-pop-purple text-white text-sm font-medium rounded-full hover:opacity-95 transition-all flex-shrink-0" :class="navStyle === 'side' ? 'lg:mr-[24.75rem]' : ''">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
        Create Release
      </button>
    </div>

    </div>

    <!-- New user: create-first-release card + ghost artwork frames -->
    <div v-if="isNewUser" class="px-4 sm:px-6 lg:px-16 pb-8">
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        <button
          @click="$emit('navigate', 'music-builder')"
          class="aspect-square rounded-2xl bg-white shadow-[0_2px_14px_rgba(16,31,60,0.08)] hover:shadow-[0_12px_32px_rgba(95,31,255,0.18)] hover:-translate-y-1 flex flex-col items-center justify-center gap-3 transition-all duration-200 group"
        >
          <img src="/img/suite/distro.svg" alt="" class="w-11 h-11 group-hover:scale-105 transition-transform" />
          <span class="text-center">
            <span class="block text-sm font-bold text-ditto-text">New release</span>
            <span class="block text-xs text-ditto-subtext mt-1">Get your music in stores</span>
          </span>
        </button>
        <div v-for="n in 7" :key="'ghost-rel-' + n" :style="{ opacity: Math.max(0, 1 - n * 0.16) }">
          <div class="aspect-square rounded-2xl bg-ditto-light-grey"></div>
          <div class="w-24 h-2.5 rounded bg-ditto-light-grey mt-3"></div>
          <div class="w-16 h-2 rounded bg-ditto-light-grey mt-2"></div>
        </div>
      </div>
    </div>

    <!-- Sticky Release Bar -->
    <div v-if="!isNewUser" class="sticky top-0 z-20 bg-white px-4 sm:px-6 lg:px-16 pt-4 pb-3 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.06)]">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <!-- Status Tabs -->
        <LiquidTabs :tabs="statusTabs" :active="activeStatus" @select="activeStatus = $event" />
        <!-- Search -->
        <SearchInput v-model="searchQuery" placeholder="Search for a release" />
      </div>
    </div>

    <!-- Release Grid -->
    <EmptyState
      v-if="!isNewUser && filteredReleases.length === 0"
      type="no-results"
      title="No releases found"
      :message="searchQuery ? `No releases match '${searchQuery}'` : 'No releases in this category'"
      class="px-4 sm:px-6 lg:px-16"
    />
    <ul v-else-if="!isNewUser" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 list-none p-0 px-4 sm:px-6 lg:px-16 pt-6">
      <!-- Release Cards -->
      <li v-for="release in filteredReleases" :key="release.title + release.artist + release.year">
        <div class="group cursor-pointer" @click="openRelease(release)">
          <!-- Artwork -->
          <div class="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-gray-100">
            <span :class="[
              'absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white z-10',
              release.status === 'Live' ? 'bg-success' :
              release.status === 'Takedown' ? 'bg-error' :
              'bg-ditto-subtext'
            ]">{{ release.status }}</span>
            <img
              :src="release.artwork"
              :alt="release.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
          <!-- Info -->
          <p class="text-sm font-semibold text-ditto-text truncate">{{ release.title }}</p>
          <p class="text-xs text-ditto-subtext mt-0.5">
            <span class="text-ditto-subtext">{{ release.type }} by </span>
            <span class="text-ditto-purple">{{ release.artist }}</span>
          </p>
          <p class="text-xs font-semibold text-ditto-text mt-0.5">{{ release.year }}</p>
        </div>
      </li>
    </ul>

    <div class="h-8"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, inject } from 'vue'

// The side-nav search overlay (GlobalSearch) needs clearance; top nav doesn't
const navStyle = inject<'top' | 'side'>('navStyle', 'top')
import EmptyState from '../components/common/EmptyState.vue'
import LiquidTabs from '../components/common/LiquidTabs.vue'
import SearchInput from '../components/common/SearchInput.vue'
import GlobalSearch from '../components/layout/GlobalSearch.vue'
import ReleaseDetailView from './music/ReleaseDetailView.vue'
import { getReleaseDetail, releaseCatalog } from '../data/releaseDetailMockData'
import { useDemoUser } from '../composables/useDemoUser'
import type { ReleaseDetail, ReleaseListItem } from '../data/releaseDetailMockData'

const props = defineProps<{ openRelease?: ReleaseListItem | null }>()

defineEmits<{
  (e: 'navigate', section: string): void
  (e: 'navigateView', section: string, view: string): void
  (e: 'viewAnalytics', release: ReleaseDetail): void
}>()

const { isNewUser } = useDemoUser()

const searchQuery = ref('')
const activeStatus = ref('all')
const openedRelease = ref<ReleaseDetail | null>(null)

const openRelease = (release: ReleaseListItem) => {
  openedRelease.value = getReleaseDetail(release)
  window.scrollTo(0, 0)
}

// Global search can land directly on a release
watch(() => props.openRelease, (item) => { if (item) openRelease(item) }, { immediate: true })

const statusTabs = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'inactive', label: 'Inactive' },
]

const filteredReleases = computed(() => {
  let result = releases
  if (activeStatus.value === 'live') result = result.filter(r => r.status === 'Live')
  else if (activeStatus.value === 'inactive') result = result.filter(r => r.status === 'Takedown' || r.status === 'Inactive')
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(r => r.title.toLowerCase().includes(q) || r.artist.toLowerCase().includes(q))
  }
  return result
})

const releases = releaseCatalog
</script>
