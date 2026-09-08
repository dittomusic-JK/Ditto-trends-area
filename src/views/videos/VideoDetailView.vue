<template>
  <!-- Mirrors the music ReleaseDetailView frame: catalog sidebar + tabs -->
  <div class="relative flex flex-col h-[calc(100vh-var(--header-h,80px))]">
    <GlobalSearch />
    <div v-if="navStyle === 'side'" class="flex-shrink-0 px-4 sm:px-6 lg:px-16 pt-4 sm:pt-5 lg:pt-6 pb-4">
      <button @click="$emit('back')" class="flex items-center gap-1.5 text-sm text-ditto-subtext hover:text-ditto-text transition-colors mb-1.5">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        All videos
      </button>
      <h1 class="font-satoshi font-black text-xl sm:text-3xl lg:text-[42px] tracking-[-0.03em] text-ditto-text">My Videos</h1>
    </div>

    <div class="flex flex-1 min-h-0">
      <ReleaseListSidebar
        v-if="navStyle !== 'side'"
        :releases="videos"
        :current="video"
        noun="videos"
        singular="video"
        @select="$emit('switch-video', $event as unknown as VideoRelease)"
        class="hidden lg:flex"
      />

      <div class="flex-1 min-w-0 overflow-y-auto">
        <div :class="['sticky top-0 z-10 bg-white py-3 px-4 sm:px-6', navStyle === 'side' ? 'lg:px-16 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.06)]' : 'lg:px-8 border-b border-gray-200']">
          <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
            <button v-if="navStyle !== 'side'" @click="$emit('back')" class="lg:hidden flex items-center gap-1.5 text-sm text-ditto-purple hover:text-ditto-purple/80 transition-colors flex-shrink-0">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Back
            </button>
            <div class="overflow-x-auto scrollbar-hide">
              <LiquidTabs :tabs="sectionTabs" :active="activeSection" @select="activeSection = $event" />
            </div>
            <button
              @click="$emit('view-analytics')"
              class="ml-auto flex items-center gap-2 px-3.5 h-9 rounded-full border border-gray-200 text-sm font-medium text-ditto-text hover:border-ditto-purple hover:text-ditto-purple transition-colors flex-shrink-0"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              <span class="hidden sm:inline">View analytics</span>
            </button>
          </div>
        </div>

        <div :class="['py-6 px-4 sm:px-6', navStyle === 'side' ? 'lg:px-16' : 'lg:px-8']">
          <VideoOverviewTab v-if="activeSection === 'overview'" :video="detail" />
          <VideoSplitsTab v-else :video="detail" :key="'splits-' + detail.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import LiquidTabs from '../../components/common/LiquidTabs.vue'
import GlobalSearch from '../../components/layout/GlobalSearch.vue'
import ReleaseListSidebar from '../../components/music/ReleaseListSidebar.vue'
import VideoOverviewTab from './VideoOverviewTab.vue'
import VideoSplitsTab from './VideoSplitsTab.vue'
import type { VideoRelease } from '../../data/videoMockData'
import { getVideoDetail } from '../../data/videoDetailMockData'

const props = defineProps<{ video: VideoRelease; videos: VideoRelease[] }>()
defineEmits<{
  (e: 'back'): void
  (e: 'switch-video', video: VideoRelease): void
  (e: 'view-analytics'): void
}>()

const navStyle = inject<'top' | 'side'>('navStyle', 'top')
const activeSection = ref('overview')
const sectionTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'splits', label: 'Splits' },
]
const detail = computed(() => getVideoDetail(props.video))
</script>
