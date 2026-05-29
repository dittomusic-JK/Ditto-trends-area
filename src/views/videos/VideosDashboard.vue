<template>
  <div v-if="currentView === 'list'">
    <div class="px-4 sm:px-6 lg:px-16 pt-4 sm:pt-6 lg:pt-8">
      <!-- Welcome Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 class="font-satoshi font-black text-xl sm:text-3xl lg:text-[42px] tracking-[-0.03em] text-ditto-text">
          My Videos
        </h1>
        <button
          @click="showCreateModal = true"
          class="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-medium rounded-full hover:opacity-90 transition-all hover:shadow-lg hover:shadow-ditto-purple/30 flex-shrink-0"
          style="background: linear-gradient(135deg, #5f1fff, #8640f4, #a855f7)"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Create Video
        </button>
      </div>

      <!-- Snapshot Analytics -->
      <div class="mb-8">
        <p class="text-sm text-ditto-subtext mb-4">Here's a snapshot of your video performance this week.</p>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <!-- Videos This Week -->
          <div class="rounded-2xl p-5 text-white relative overflow-hidden" style="background: linear-gradient(180deg, #3a1bb9, #a859cd 97%)">
            <div class="absolute top-4 right-4 w-14 h-14 rounded-xl flex items-center justify-center bg-white/10">
              <svg class="w-7 h-7 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2"/><polygon points="10,8 16,12 10,16"/>
              </svg>
            </div>
            <p class="text-xs text-white/70 mb-1">Videos This Week</p>
            <p class="text-2xl font-bold mb-2">3</p>
            <p class="text-xs text-white/50">New uploads</p>
          </div>
          <!-- Most Viewed Video -->
          <div class="rounded-2xl p-5 text-white relative overflow-hidden" style="background: linear-gradient(180deg, #3cbbcd, #187e9f)">
            <div class="absolute top-4 right-4 w-14 h-14 rounded-xl overflow-hidden">
              <img src="https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/03377228/artwork/transforms/darkoo-x-rema-favourite-girl-1-66b2194cd1729760795317-small.jpg" alt="" class="w-full h-full object-cover" />
            </div>
            <p class="text-xs text-white/70 mb-1">Most Viewed Video</p>
            <p class="text-2xl font-bold mb-2 truncate pr-16">Favourite Girl</p>
            <p class="text-xs text-white/50">5.67M views</p>
          </div>
          <!-- Best Platform -->
          <div class="rounded-2xl p-5 text-white relative overflow-hidden" style="background: linear-gradient(180deg, #2680eb, #035cc6 97%)">
            <div class="absolute top-4 right-4 w-14 h-14 rounded-xl flex items-center justify-center bg-white/10">
              <svg class="w-7 h-7 text-white/70" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 3.993L9 16z"/>
              </svg>
            </div>
            <p class="text-xs text-white/70 mb-1">Best Platform</p>
            <p class="text-2xl font-bold mb-2">VEVO</p>
            <p class="text-xs text-white/50">12.9M total views</p>
          </div>
          <!-- Total Views -->
          <div class="rounded-2xl p-5 text-white relative overflow-hidden" style="background: linear-gradient(180deg, #dc7b30, #b54a4c)">
            <div class="absolute top-4 right-4 w-14 h-14 rounded-xl flex items-center justify-center bg-white/10">
              <svg class="w-7 h-7 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <p class="text-xs text-white/70 mb-1">Total Views</p>
            <p class="text-2xl font-bold mb-2">16.3M</p>
            <p class="text-xs text-white/50">All platforms</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Filter Bar -->
    <div class="sticky top-0 z-20 bg-white px-4 sm:px-6 lg:px-16 pt-4 pb-3 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.06)]">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl lg:text-3xl text-ditto-text">Your Videos</h2>
        <!-- Search -->
        <div class="relative">
          <svg class="w-4 h-4 text-ditto-subtext absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search for a video"
            class="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-ditto-text bg-white focus:outline-none focus:border-ditto-purple w-full sm:w-64"
          />
        </div>
      </div>

      <!-- Status Tabs -->
      <div class="flex items-center gap-2">
        <button
          v-for="tab in statusTabs" :key="tab.id"
          @click="activeStatus = tab.id"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap',
            activeStatus === tab.id
              ? 'bg-ditto-text text-white'
              : 'bg-ditto-light-grey text-ditto-text hover:bg-ditto-light-grey/80'
          ]"
        >{{ tab.label }}</button>
      </div>
    </div>

    <!-- Video Grid -->
    <EmptyState
      v-if="filteredVideos.length === 0"
      type="no-results"
      title="No videos found"
      :message="searchQuery ? `No videos match '${searchQuery}'` : 'No videos in this category'"
      class="px-4 sm:px-6 lg:px-16"
    />
    <ul v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 list-none p-0 px-4 sm:px-6 lg:px-16 pt-6">
      <li v-for="video in filteredVideos" :key="video.id">
        <div class="group cursor-pointer">
          <!-- Thumbnail (16:9) -->
          <div class="relative aspect-video rounded-2xl overflow-hidden mb-3 bg-gray-100">
            <span :class="[
              'absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white z-10',
              video.status === 'Live' ? 'bg-success' :
              video.status === 'In Progress' || video.status === 'Processing' ? 'bg-warning' :
              video.status === 'Takedown' ? 'bg-error' :
              'bg-ditto-subtext'
            ]">{{ video.status }}</span>
            <img
              :src="video.artwork"
              :alt="video.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <!-- Play overlay -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
              <div class="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                <svg class="w-5 h-5 text-ditto-text ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6,4 20,12 6,20"/>
                </svg>
              </div>
            </div>
          </div>
          <!-- Info -->
          <p class="text-sm font-semibold text-ditto-text truncate">{{ video.title }}</p>
          <p class="text-xs text-ditto-subtext mt-0.5">
            <span class="text-ditto-subtext">{{ video.type }} by </span>
            <span class="text-ditto-purple">{{ video.artist }}</span>
          </p>
          <div class="flex items-center justify-between mt-0.5">
            <p class="text-xs font-semibold text-ditto-text">{{ video.year }}</p>
            <p v-if="video.views > 0" class="text-xs text-ditto-subtext">{{ formatViews(video.views) }} views</p>
          </div>
        </div>
      </li>
    </ul>

    <div class="h-8"></div>

    <!-- Create Video Modal -->
    <CreateVideoModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @create="handleCreateVideo"
    />
  </div>

  <!-- Video Builder -->
  <VideoBuilder
    v-else-if="currentView === 'builder'"
    :initial-title="builderTitle"
    @back="currentView = 'list'"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import EmptyState from '../../components/common/EmptyState.vue'
import CreateVideoModal from './CreateVideoModal.vue'
import VideoBuilder from './VideoBuilder.vue'
import { videoReleases } from '../../data/videoMockData'

const searchQuery = ref('')
const activeStatus = ref('all')
const showCreateModal = ref(false)
const currentView = ref<'list' | 'builder'>('list')
const builderTitle = ref('')

const statusTabs = [
  { id: 'all', label: 'All' },
  { id: 'inprogress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'inactive', label: 'Inactive' },
]

const filteredVideos = computed(() => {
  let result = videoReleases
  if (activeStatus.value === 'inprogress') result = result.filter(r => r.status === 'In Progress' || r.status === 'Processing')
  else if (activeStatus.value === 'completed') result = result.filter(r => r.status === 'Live')
  else if (activeStatus.value === 'inactive') result = result.filter(r => r.status === 'Takedown' || r.status === 'Inactive')
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(r => r.title.toLowerCase().includes(q) || r.artist.toLowerCase().includes(q))
  }
  return result
})

const formatViews = (views: number): string => {
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M'
  if (views >= 1000) return (views / 1000).toFixed(0) + 'K'
  return views.toString()
}

const handleCreateVideo = (title: string) => {
  showCreateModal.value = false
  builderTitle.value = title
  currentView.value = 'builder'
}
</script>
