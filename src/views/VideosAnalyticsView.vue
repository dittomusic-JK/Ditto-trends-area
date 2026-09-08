<template>
  <!-- Same tokens and table anatomy as Releases / Tracks; views instead of streams. -->
  <div>
    <!-- Headline + views over time -->
    <div class="mb-8">
      <div class="flex flex-wrap items-end justify-between gap-4 mb-5 px-1">
        <div class="min-w-0">
          <p class="text-xs text-ditto-subtext mb-1">{{ focused ? 'Video views' : 'Total video views' }}</p>
          <p class="font-satoshi font-black text-3xl lg:text-4xl tracking-[-0.03em] text-ditto-text tabular-nums">{{ headlineViews.toLocaleString() }}</p>
        </div>
        <div v-if="focused" class="flex items-center gap-3 min-w-0">
          <img :src="focused.thumbnail" :alt="focused.title" class="w-16 h-9 rounded-md object-cover flex-shrink-0" />
          <div class="min-w-0">
            <p class="text-sm font-medium text-ditto-text truncate">{{ focused.title }}</p>
            <p class="text-xs text-ditto-purple">{{ focused.artist }} · {{ focused.proportion }}% of all views</p>
          </div>
          <button @click="focusedId = null" class="ml-1 flex items-center gap-1 px-3 h-8 rounded-full border border-gray-200 text-xs font-medium text-ditto-text hover:border-ditto-purple hover:text-ditto-purple transition-colors flex-shrink-0">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            All videos
          </button>
        </div>
        <p v-else class="text-xs text-ditto-subtext">Across {{ data.videos.length }} videos · {{ data.stores.length }} platforms</p>
      </div>
      <PerformanceChart :data="chartData" :key="focusedId ?? 'all'" />
    </div>

    <!-- Rankings -->
    <div class="hidden lg:grid grid-cols-[40px_1fr_160px_110px_120px] gap-4 px-4 py-3 text-xs text-ditto-subtext">
      <div></div>
      <div>Video</div>
      <div class="text-center">Platform</div>
      <div class="text-center">Proportion</div>
      <div class="text-center">Views</div>
    </div>

    <div v-for="video in data.videos" :key="video.id" class="mb-1">
      <!-- Desktop row -->
      <div
        @click="toggleFocus(video.id)"
        :class="['hidden lg:grid grid-cols-[40px_1fr_160px_110px_120px] gap-4 px-4 py-4 items-center rounded-2xl transition-colors cursor-pointer',
          focusedId === video.id ? 'bg-ditto-purple/5 ring-1 ring-ditto-purple/30' : 'hover:bg-ditto-light-grey',
          focusedId && focusedId !== video.id ? 'opacity-50' : '']"
      >
        <div :class="['text-lg', focusedId === video.id ? 'text-ditto-purple font-semibold' : 'text-ditto-text']">{{ video.rank }}</div>
        <div class="flex items-center gap-4 min-w-0">
          <img :src="video.thumbnail" :alt="video.title" class="w-[88px] h-[50px] rounded-lg object-cover flex-shrink-0" />
          <div class="min-w-0">
            <p class="text-base font-medium text-ditto-text truncate">{{ video.title }}</p>
            <p class="text-xs text-ditto-purple">{{ video.artist }}</p>
          </div>
        </div>
        <div class="text-center text-sm text-ditto-subtext">{{ video.platform }}</div>
        <div class="text-center">
          <span class="inline-flex items-center gap-2">
            <span class="w-14 h-1.5 rounded-full bg-ditto-light-grey overflow-hidden"><span class="block h-full rounded-full bg-ditto-purple" :style="{ width: (video.proportion / data.videos[0].proportion * 100) + '%' }"></span></span>
            <span class="text-sm text-ditto-text tabular-nums">{{ video.proportion }}%</span>
          </span>
        </div>
        <div class="text-center text-base font-medium text-ditto-text tabular-nums">{{ video.views.toLocaleString() }}</div>
      </div>

      <!-- Mobile row -->
      <div
        @click="toggleFocus(video.id)"
        :class="['lg:hidden flex items-center gap-3 px-2 py-3 rounded-xl transition-colors cursor-pointer',
          focusedId === video.id ? 'bg-ditto-purple/5 ring-1 ring-ditto-purple/30' : 'hover:bg-ditto-light-grey',
          focusedId && focusedId !== video.id ? 'opacity-50' : '']"
      >
        <span class="text-base font-medium text-ditto-subtext w-6 text-center flex-shrink-0">{{ video.rank }}</span>
        <img :src="video.thumbnail" :alt="video.title" class="w-16 h-9 rounded-lg object-cover flex-shrink-0" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-ditto-text truncate">{{ video.title }}</p>
          <p class="text-xs text-ditto-purple mt-0.5">{{ video.artist }} · {{ video.proportion }}%</p>
        </div>
        <span class="text-sm font-medium text-ditto-text flex-shrink-0">{{ formatShort(video.views) }}</span>
      </div>
    </div>

    <!-- Store breakdown (same table as Metrics) -->
    <div class="mt-10">
      <StoresTable :stores="storesData" :selected-store="selectedStore" :title="focused ? `Views by platform · ${focused.title}` : 'Views by platform'" metric-label="Views" @select="selectedStore = $event" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import PerformanceChart from '../components/common/PerformanceChart.vue'
import StoresTable from '../components/common/StoresTable.vue'
import type { VideoAnalyticsData } from '../data/videoAnalyticsMockData'

const props = defineProps<{ data: VideoAnalyticsData }>()

const selectedStore = ref<string | null>(null)

// Clicking a video focuses the headline, chart and platform mix on it; click again to clear
const focusedId = ref<string | null>(null)
const focused = computed(() => props.data.videos.find(v => v.id === focusedId.value) ?? null)
const toggleFocus = (id: string) => {
  focusedId.value = focusedId.value === id ? null : id
  selectedStore.value = null
}
const headlineViews = computed(() => focused.value ? focused.value.views : props.data.totalViews)
const chartData = computed(() => focused.value ? focused.value.performance : props.data.performance)
const storesData = computed(() => focused.value ? focused.value.stores : props.data.stores)

const formatShort = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return num.toLocaleString()
}
</script>
