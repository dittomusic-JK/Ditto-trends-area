<template>
  <!-- Manage view: catalog sidebar + full-width content (Option C hybrid — the
       grid stays the browsing surface; this layout takes over once a release
       is opened). Sidebar mirrors the Artists area pattern. -->
  <div class="relative flex flex-col h-[calc(100vh-var(--header-h,80px))]">
    <GlobalSearch />
    <!-- Side-nav mode: header band anchors the top edge (no top bar above) -->
    <div v-if="navStyle === 'side'" class="flex-shrink-0 px-4 sm:px-6 lg:px-16 pt-4 sm:pt-5 lg:pt-6 pb-4">
      <button @click="$emit('back')" class="flex items-center gap-1.5 text-sm text-ditto-subtext hover:text-ditto-text transition-colors mb-1.5">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        All releases
      </button>
      <h1 class="font-satoshi font-black text-xl sm:text-3xl lg:text-[42px] tracking-[-0.03em] text-ditto-text">
        Your Releases <span>💿</span>
      </h1>
    </div>

    <div class="flex flex-1 min-h-0">
    <!-- Catalog sidebar (top-nav mode only — side-nav mode uses the dropdown switcher) -->
    <ReleaseListSidebar
      v-if="navStyle !== 'side'"
      :releases="releaseCatalog"
      :current="release"
      @select="selectRelease"
      class="hidden lg:flex"
    />

    <div class="flex-1 min-w-0 overflow-y-auto">
      <!-- Sticky header: section tabs (back link only where the sidebar is hidden).
           Side-nav mode drops the stroke for the release grid's soft shadow. -->
      <div :class="[
        'sticky top-0 z-10 bg-white py-3 px-4 sm:px-6',
        navStyle === 'side'
          ? 'lg:px-16 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.06)]'
          : 'lg:px-8 border-b border-gray-200'
      ]">
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
          <button v-if="navStyle !== 'side'" @click="$emit('back')" class="lg:hidden flex items-center gap-1.5 text-sm text-ditto-purple hover:text-ditto-purple/80 transition-colors flex-shrink-0">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Back
          </button>
          <div class="overflow-x-auto scrollbar-hide">
            <LiquidTabs :tabs="sectionTabs" :active="activeSection" @select="activeSection = $event" />
          </div>

          <!-- Jump to Analytics pre-filtered to this release -->
          <button
            @click="$emit('view-analytics', release)"
            :class="[
              'flex items-center gap-2 px-3.5 h-9 rounded-full border border-gray-200 text-sm font-medium text-ditto-text hover:border-ditto-purple hover:text-ditto-purple transition-colors flex-shrink-0',
              navStyle === 'side' ? 'ml-auto' : 'ml-auto'
            ]"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            <span class="hidden sm:inline">View analytics</span>
          </button>

          <!-- Side-nav mode: release switcher dropdown, top right -->
          <div v-if="navStyle === 'side'" class="relative flex-shrink-0" ref="switcherRef">
            <button
              @click="switcherOpen = !switcherOpen"
              class="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:border-ditto-purple/40 hover:bg-ditto-light-grey transition-colors"
            >
              <img :src="release.artwork" :alt="release.title" class="w-7 h-7 rounded-lg object-cover" />
              <span class="text-sm font-semibold text-ditto-text max-w-[160px] truncate">{{ release.title }}</span>
              <svg class="w-3.5 h-3.5 text-ditto-subtext transition-transform" :class="switcherOpen ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div v-if="switcherOpen" class="absolute right-0 top-full mt-2 w-80 max-h-[420px] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-30">
              <p class="px-4 pt-1 pb-2 text-xs text-ditto-subtext">Switch release</p>
              <button
                v-for="item in releaseCatalog"
                :key="item.title + item.year"
                @click="selectRelease(item); switcherOpen = false"
                class="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                :style="item.title === release.title ? { backgroundColor: 'var(--accent-tint)' } : {}"
                :class="item.title === release.title ? '' : 'hover:bg-ditto-light-grey'"
              >
                <img :src="item.artwork" :alt="item.title" class="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                <span class="min-w-0 flex-1">
                  <span :class="['block text-sm font-semibold truncate', item.title === release.title ? 'text-ditto-purple' : 'text-ditto-text']">{{ item.title }}</span>
                  <span class="block text-xs text-ditto-subtext truncate">{{ item.artist }} · {{ item.year }}</span>
                </span>
                <span v-if="item.title === release.title" class="w-1.5 h-1.5 rounded-full bg-ditto-purple flex-shrink-0"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sections: fill the space beside the sidebar -->
      <div :class="['py-6 px-4 sm:px-6', navStyle === 'side' ? 'lg:px-16' : 'lg:px-8']">
        <div>
          <ReleaseOverviewTab v-if="activeSection === 'overview'" :release="release" />
          <ReleaseStoresTab v-else-if="activeSection === 'stores'" :release="release" :key="'stores-' + release.id" />
          <ReleaseServicesTab v-else-if="activeSection === 'services'" :release="release" :key="'services-' + release.id" />
          <ReleaseSplitsTab v-else-if="activeSection === 'splits'" :release="release" :key="'splits-' + release.id" />
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, onUnmounted } from 'vue'
import LiquidTabs from '../../components/common/LiquidTabs.vue'
import GlobalSearch from '../../components/layout/GlobalSearch.vue'
import ReleaseListSidebar from '../../components/music/ReleaseListSidebar.vue'
import ReleaseOverviewTab from './ReleaseOverviewTab.vue'
import ReleaseStoresTab from './ReleaseStoresTab.vue'
import ReleaseServicesTab from './ReleaseServicesTab.vue'
import ReleaseSplitsTab from './ReleaseSplitsTab.vue'
import { releaseCatalog } from '../../data/releaseDetailMockData'
import type { ReleaseDetail, ReleaseListItem } from '../../data/releaseDetailMockData'

const props = defineProps<{ release: ReleaseDetail }>()
const emit = defineEmits<{
  (e: 'back'): void
  (e: 'switch-release', item: ReleaseListItem): void
  (e: 'view-analytics', release: ReleaseDetail): void
}>()

// 'side' when the ?nav=side left-rail exploration is active (no top bar).
const navStyle = inject<'top' | 'side'>('navStyle', 'top')

// Side-nav mode release switcher (replaces the catalog sidebar)
const switcherOpen = ref(false)
const switcherRef = ref<HTMLElement | null>(null)
const handleClickOutside = (e: MouseEvent) => {
  if (switcherOpen.value && switcherRef.value && !switcherRef.value.contains(e.target as Node)) {
    switcherOpen.value = false
  }
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

const activeSection = ref('overview')

const sectionTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'stores', label: 'Stores' },
  { id: 'services', label: 'Services & Extras' },
  { id: 'splits', label: 'Splits' },
]

const isCurrent = (item: ReleaseListItem) =>
  item.title === props.release.title && item.artist === props.release.artist && item.status === props.release.status

const selectRelease = (item: ReleaseListItem) => {
  if (!isCurrent(item)) emit('switch-release', item)
}
</script>
