<template>
  <!-- Manage view: catalog sidebar + full-width content (Option C hybrid — the
       grid stays the browsing surface; this layout takes over once a release
       is opened). Sidebar mirrors the Artists area pattern. -->
  <div class="flex h-[calc(100vh-80px)]">
    <ReleaseListSidebar
      :releases="releaseCatalog"
      :current="release"
      @select="selectRelease"
      class="hidden lg:flex"
    />

    <div class="flex-1 min-w-0 overflow-y-auto">
      <!-- Sticky header: section tabs (back link only where the sidebar is hidden) -->
      <div class="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3">
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
          <button @click="$emit('back')" class="lg:hidden flex items-center gap-1.5 text-sm text-ditto-purple hover:text-ditto-purple/80 transition-colors flex-shrink-0">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Back
          </button>
          <div class="overflow-x-auto scrollbar-hide">
            <LiquidTabs :tabs="sectionTabs" :active="activeSection" @select="activeSection = $event" />
          </div>
        </div>
      </div>

      <!-- Sections: fill the space beside the sidebar -->
      <div class="px-4 sm:px-6 lg:px-8 py-6">
        <div>
          <ReleaseOverviewTab v-if="activeSection === 'overview'" :release="release" />
          <ReleaseStoresTab v-else-if="activeSection === 'stores'" :release="release" :key="'stores-' + release.id" />
          <ReleaseServicesTab v-else-if="activeSection === 'services'" :release="release" :key="'services-' + release.id" />
          <ReleaseSplitsTab v-else-if="activeSection === 'splits'" :release="release" :key="'splits-' + release.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LiquidTabs from '../../components/common/LiquidTabs.vue'
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
}>()

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
