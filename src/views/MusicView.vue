<template>
  <ReleaseDetailView
    v-if="openedRelease"
    :release="openedRelease"
    @back="openedRelease = null"
    @switch-release="openRelease"
  />
  <div v-else>
    <div class="px-4 sm:px-6 lg:px-16 pt-4 sm:pt-6 lg:pt-8">
    <!-- Welcome Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <h1 class="font-satoshi font-black text-xl sm:text-3xl lg:text-[42px] tracking-[-0.03em] text-ditto-text">
        Welcome back, Goldenboy! <span>👋</span>
      </h1>
      <button class="flex items-center gap-2 px-5 py-2.5 bg-ditto-purple btn-pop-purple text-white text-sm font-medium rounded-full hover:opacity-95 transition-all flex-shrink-0">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
        Create Release
      </button>
    </div>

    <!-- Snapshot Analytics -->
    <div class="mb-8">
      <p class="text-sm text-ditto-subtext mb-4">Here's a snapshot of your music's performance this week.</p>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <!-- Streams This Week -->
        <div @click="$emit('navigate', 'analytics')" class="rounded-2xl p-5 text-white relative overflow-hidden cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-all duration-200" style="background: linear-gradient(180deg, #3a1bb9, #a859cd 97%)">
          <img src="/img/equalizer-icon.svg" alt="" class="absolute top-4 right-4 w-14 h-14 rounded-xl" />
          <p class="text-xs text-white/70 mb-1">Streams This Week</p>
          <p class="text-2xl font-bold mb-2">1,696,508</p>
          <p class="text-xs text-white/50">All stores, 14–20 Apr</p>
        </div>
        <!-- Most Streamed Track -->
        <div @click="$emit('navigateView', 'analytics', 'tracks')" class="rounded-2xl p-5 text-white relative overflow-hidden cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-all duration-200" style="background: linear-gradient(180deg, #3cbbcd, #187e9f)">
          <div class="absolute top-4 right-4 w-14 h-14 rounded-xl overflow-hidden">
            <img src="https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/05301321/artwork/transforms/p1680529-edit-edit-edit-69c138b3ab4dd252257380-small.jpg" alt="Solar" class="w-full h-full object-cover" />
          </div>
          <p class="text-xs text-white/70 mb-1">Most Streamed Track</p>
          <p class="text-2xl font-bold mb-2">Solar</p>
          <p class="text-xs text-white/50">All stores • 440,333 streams</p>
        </div>
        <!-- Best Playlist -->
        <div @click="$emit('navigateView', 'analytics', 'playlists')" class="rounded-2xl p-5 text-white relative overflow-hidden cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-all duration-200" style="background: linear-gradient(180deg, #2680eb, #035cc6 97%)">
          <img src="/img/spotify-retail-logo.svg" alt="Spotify" class="absolute top-4 right-4 w-14 h-14 rounded-xl" />
          <p class="text-xs text-white/70 mb-1">Best Playlist</p>
          <p class="text-2xl font-bold mb-2">Mix</p>
          <p class="text-xs text-white/50">Spotify • 60,766 streams</p>
        </div>
        <!-- Best Platform -->
        <div @click="$emit('navigateView', 'analytics', 'source')" class="rounded-2xl p-5 text-white relative overflow-hidden cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-all duration-200" style="background: linear-gradient(180deg, #dc7b30, #b54a4c)">
          <img src="/img/spotify-retail-logo.svg" alt="Spotify" class="absolute top-4 right-4 w-14 h-14 rounded-xl" />
          <p class="text-xs text-white/70 mb-1">Best Platform</p>
          <p class="text-2xl font-bold mb-2">Spotify</p>
          <p class="text-xs text-white/50">1,089,741 streams</p>
        </div>
      </div>
    </div>
    </div>

    <!-- Sticky Release Bar -->
    <div class="sticky top-0 z-20 bg-white px-4 sm:px-6 lg:px-16 pt-4 pb-3 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.06)]">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl lg:text-3xl text-ditto-text">Your Releases</h2>
        <!-- Search -->
        <div class="relative">
          <svg class="w-4 h-4 text-ditto-subtext absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search for a release"
            class="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-ditto-text bg-white focus:outline-none focus:border-ditto-purple w-full sm:w-64"
          />
        </div>
      </div>

      <!-- Status Tabs -->
      <LiquidTabs :tabs="statusTabs" :active="activeStatus" @select="activeStatus = $event" />
    </div>

    <!-- Release Grid -->
    <EmptyState
      v-if="filteredReleases.length === 0"
      type="no-results"
      title="No releases found"
      :message="searchQuery ? `No releases match '${searchQuery}'` : 'No releases in this category'"
      class="px-4 sm:px-6 lg:px-16"
    />
    <ul v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 list-none p-0 px-4 sm:px-6 lg:px-16 pt-6">
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
import { ref, computed } from 'vue'
import EmptyState from '../components/common/EmptyState.vue'
import LiquidTabs from '../components/common/LiquidTabs.vue'
import ReleaseDetailView from './music/ReleaseDetailView.vue'
import { getReleaseDetail, releaseCatalog } from '../data/releaseDetailMockData'
import type { ReleaseDetail, ReleaseListItem } from '../data/releaseDetailMockData'

defineEmits<{
  (e: 'navigate', section: string): void
  (e: 'navigateView', section: string, view: string): void
}>()

const searchQuery = ref('')
const activeStatus = ref('all')
const openedRelease = ref<ReleaseDetail | null>(null)

const openRelease = (release: ReleaseListItem) => {
  openedRelease.value = getReleaseDetail(release)
  window.scrollTo(0, 0)
}

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
