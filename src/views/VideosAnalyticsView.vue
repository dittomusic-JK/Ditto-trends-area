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
        </div>
        <p v-else class="text-xs text-ditto-subtext">Across {{ visibleVideos.length }} of {{ data.videos.length }} videos · {{ storesData.length }} stores</p>
      </div>
      <PerformanceChart :data="chartData" :key="chartKey" />
    </div>

    <!-- Rankings -->
    <div class="hidden lg:grid grid-cols-[40px_1fr_160px_110px_120px] gap-4 px-4 py-3 text-xs text-ditto-subtext">
      <div></div>
      <div>Video</div>
      <div class="text-center">Top store</div>
      <div class="text-center">Proportion</div>
      <div class="text-center">Views</div>
    </div>

    <div v-if="visibleVideos.length === 0" class="rounded-2xl border border-dashed border-gray-200 px-6 py-10 text-center mb-2">
      <p class="text-sm font-medium text-ditto-text">No videos match these filters</p>
      <p class="text-xs text-ditto-subtext mt-1">Remove a filter above to see more of your catalogue.</p>
    </div>

    <div v-for="video in visibleVideos" :key="video.id" class="mb-1">
      <!-- Desktop row -->
      <div
        @click="selectVideo(video)"
        :class="['hidden lg:grid grid-cols-[40px_1fr_160px_110px_120px] gap-4 px-4 py-4 items-center rounded-2xl transition-colors',
          focused?.id === video.id ? 'bg-ditto-purple/5 ring-1 ring-ditto-purple/30' : 'hover:bg-ditto-light-grey cursor-pointer']"
      >
        <div :class="['text-lg', focused?.id === video.id ? 'text-ditto-purple font-semibold' : 'text-ditto-text']">{{ video.rank }}</div>
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
        @click="selectVideo(video)"
        :class="['lg:hidden flex items-center gap-3 px-2 py-3 rounded-xl transition-colors',
          focused?.id === video.id ? 'bg-ditto-purple/5 ring-1 ring-ditto-purple/30' : 'hover:bg-ditto-light-grey cursor-pointer']"
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
      <StoresTable :stores="storesData" :selected-store="selectedStore" :title="focused ? `Views by store · ${focused.title}` : 'Views by store'" metric-label="Views" @select="selectedStore = $event" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import PerformanceChart from '../components/common/PerformanceChart.vue'
import StoresTable from '../components/common/StoresTable.vue'
import type { Filter } from '../types'
import type { VideoAnalyticsData, VideoRanking } from '../data/videoAnalyticsMockData'

const props = defineProps<{ data: VideoAnalyticsData; filters: Filter[] }>()
const emit = defineEmits<{ (e: 'select-video', video: { id: string; title: string }): void }>()

const selectedStore = ref<string | null>(null)

// The active filter chips are the single source of truth: a video chip focuses the
// page on that video; artist / type chips narrow the ranking; store chips narrow the table.
const filtersOf = (type: Filter['type']) => props.filters.filter(f => f.type === type)

const visibleVideos = computed(() => {
  const videoIds = filtersOf('video').map(f => f.id)
  const artists = filtersOf('artist').map(f => f.value.toLowerCase())
  const types = filtersOf('videoType').map(f => f.value)
  return props.data.videos.filter(v =>
    (videoIds.length === 0 || videoIds.includes(v.id)) &&
    (artists.length === 0 || artists.some(a => v.artist.toLowerCase().includes(a))) &&
    (types.length === 0 || types.includes(v.type))
  )
})

const focused = computed(() => (filtersOf('video').length > 0 && visibleVideos.value.length === 1) ? visibleVideos.value[0] : null)

const selectVideo = (video: VideoRanking) => {
  if (focused.value?.id === video.id) return
  emit('select-video', { id: video.id, title: video.title })
}

const headlineViews = computed(() => focused.value ? focused.value.views : visibleVideos.value.reduce((sum, v) => sum + v.views, 0))
const chartData = computed(() => {
  if (focused.value) return focused.value.performance
  if (visibleVideos.value.length === props.data.videos.length) return props.data.performance
  // Sum the visible videos' series so the chart reflects the filtered set
  return props.data.performance.map((point, i) => ({
    day: point.day,
    current: visibleVideos.value.reduce((sum, v) => sum + (v.performance[i]?.current ?? 0), 0),
    previous: visibleVideos.value.reduce((sum, v) => sum + (v.performance[i]?.previous ?? 0), 0),
  }))
})
const chartKey = computed(() => focused.value?.id ?? `set-${visibleVideos.value.map(v => v.id).join(',')}`)
const storesData = computed(() => {
  const base = focused.value ? focused.value.stores : props.data.stores
  const wanted = filtersOf('platform').map(f => f.value)
  return wanted.length ? base.filter(st => wanted.includes(st.name)) : base
})

const formatShort = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return num.toLocaleString()
}
</script>
