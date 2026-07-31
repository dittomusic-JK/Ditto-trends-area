<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6 lg:px-16 lg:py-8 w-full max-w-full box-border">
  <div class="max-w-[820px] mx-auto">
    <!-- Back + release switcher row -->
    <div class="flex items-center justify-between gap-3 mb-4">
      <button @click="$emit('back')" class="flex items-center gap-1.5 text-sm text-ditto-purple hover:text-ditto-purple/80 transition-colors">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Back to your releases
      </button>

      <!-- Viewing dropdown -->
      <div class="relative flex-shrink-0" ref="switcherRef">
        <button
          @click="switcherOpen = !switcherOpen"
          class="flex items-center gap-2 pl-3.5 pr-3 py-2 border border-gray-200 rounded-lg bg-white text-sm hover:border-gray-300 transition-colors max-w-[260px]"
        >
          <span class="text-ditto-text font-semibold flex-shrink-0">Viewing:</span>
          <span class="text-ditto-purple truncate">{{ release.title }}</span>
          <svg :class="['w-4 h-4 text-ditto-subtext flex-shrink-0 transition-transform', switcherOpen ? 'rotate-180' : '']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>

        <div v-if="switcherOpen" class="absolute right-0 top-full mt-2 w-[320px] max-h-[400px] overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl z-30 py-1.5">
          <button
            v-for="item in releaseCatalog"
            :key="item.title + item.artist + item.year + item.status"
            @click="selectRelease(item)"
            :class="[
              'w-full flex items-center gap-3 px-3 py-2 text-left transition-colors',
              isCurrent(item) ? 'bg-ditto-purple/5' : 'hover:bg-ditto-light-grey'
            ]"
          >
            <img :src="item.artwork" :alt="item.title" class="w-9 h-9 rounded-lg object-cover flex-shrink-0" loading="lazy" />
            <span class="flex-1 min-w-0">
              <span :class="['block text-sm truncate', isCurrent(item) ? 'font-semibold text-ditto-purple' : 'font-medium text-ditto-text']">{{ item.title }}</span>
              <span class="block text-xs text-ditto-subtext truncate">{{ item.artist }} · {{ item.year }}</span>
            </span>
            <svg v-if="isCurrent(item)" class="w-4 h-4 text-ditto-purple flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Sub nav -->
    <div class="flex items-center gap-2 mt-6 mb-8 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
      <LiquidTabs :tabs="sectionTabs" :active="activeSection" @select="activeSection = $event" />
    </div>

    <!-- Sections -->
    <ReleaseOverviewTab v-if="activeSection === 'overview'" :release="release" />
    <ReleaseStoresTab v-else-if="activeSection === 'stores'" :release="release" :key="'stores-' + release.id" />
    <ReleaseServicesTab v-else-if="activeSection === 'services'" :release="release" :key="'services-' + release.id" />
    <ReleaseSplitsTab v-else-if="activeSection === 'splits'" :release="release" :key="'splits-' + release.id" />
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import LiquidTabs from '../../components/common/LiquidTabs.vue'
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
const switcherOpen = ref(false)
const switcherRef = ref<HTMLElement | null>(null)

const sectionTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'stores', label: 'Stores' },
  { id: 'services', label: 'Services & Extras' },
  { id: 'splits', label: 'Splits' },
]

const isCurrent = (item: ReleaseListItem) =>
  item.title === props.release.title && item.artist === props.release.artist && item.status === props.release.status

const selectRelease = (item: ReleaseListItem) => {
  switcherOpen.value = false
  if (!isCurrent(item)) emit('switch-release', item)
}

const handleClickOutside = (e: MouseEvent) => {
  if (switcherOpen.value && switcherRef.value && !switcherRef.value.contains(e.target as Node)) {
    switcherOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>
