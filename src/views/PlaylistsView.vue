<template>
  <div>
    <!-- Downloads Unavailable Message -->
    <div v-if="isDownloadsSelected" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 lg:p-12 flex flex-col items-center justify-center text-center">
      <div class="w-14 h-14 rounded-full bg-ditto-purple/10 flex items-center justify-center mb-5">
        <svg class="w-7 h-7 text-ditto-purple" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <p class="text-lg font-semibold text-ditto-text mb-2">Downloads data is not available for Playlists</p>
      <p class="text-sm text-ditto-subtext max-w-sm mb-5">Playlist analytics are only supported for Streams.</p>
      <button 
        @click="$emit('switchToStreams')"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-ditto-purple text-white text-sm font-medium rounded-full hover:bg-ditto-purple/90 transition-colors"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
        </svg>
        Switch to Streams
      </button>
    </div>

    <template v-else>
    <!-- Desktop Table Header -->
    <div class="hidden lg:grid grid-cols-[40px_1fr_100px_100px_140px_80px] gap-4 px-4 py-3 text-xs text-ditto-subtext">
      <div></div>
      <div>Details</div>
      <div class="text-center">Streams</div>
      <div class="text-center">Followers</div>
      <div class="text-center">Curator</div>
      <div class="text-center">Skip Rate</div>
    </div>
    
    <!-- Table Rows -->
    <div v-for="playlist in localPlaylists" :key="playlist.id" class="mb-1">
      <!-- Desktop Row -->
      <div 
        @click="toggleExpand(playlist.id)"
        :class="[
          'hidden lg:grid grid-cols-[40px_1fr_100px_100px_140px_80px] gap-4 px-4 py-4 items-center transition-colors',
          playlist.tracks && playlist.tracks.length > 0 ? 'cursor-pointer' : '',
          playlist.isExpanded ? 'bg-[#f8f8fc]' : 'hover:bg-ditto-light-grey rounded-2xl'
        ]"
      >
        <div class="text-lg text-ditto-text">{{ playlist.rank }}</div>
        <div class="flex items-center gap-4">
          <img :src="playlist.artwork" :alt="playlist.name" class="w-16 h-16 rounded-lg object-cover" />
          <div class="flex items-center gap-2">
            <img src="/img/spotify-icon.svg" alt="Spotify" class="w-5 h-5 flex-shrink-0" />
            <div>
              <p class="text-base font-medium text-ditto-text truncate max-w-[220px]">{{ playlist.name }}</p>
              <p class="text-xs text-ditto-purple">{{ playlist.trackCount }} Tracks</p>
            </div>
          </div>
        </div>
        <div class="text-center text-base font-medium text-ditto-text">{{ playlist.streams.toLocaleString() }}</div>
        <div class="text-center text-base text-ditto-text">{{ playlist.followers ? playlist.followers.toLocaleString() : '-' }}</div>
        <div class="text-center text-sm text-ditto-subtext">{{ playlist.curator }}</div>
        <div class="flex items-center justify-end gap-3 text-base text-ditto-text">
          <span>{{ playlist.skipRate }}%</span>
          <template v-if="playlist.tracks && playlist.tracks.length > 0">
            <IconChevronUp v-if="playlist.isExpanded" class="w-4 h-4 text-ditto-subtext" />
            <IconChevronDown v-else class="w-4 h-4 text-ditto-subtext" />
          </template>
        </div>
      </div>
      
      <!-- Mobile Row -->
      <div 
        @click="toggleExpand(playlist.id)"
        :class="[
          'lg:hidden flex items-center gap-3 px-2 py-3 transition-colors',
          playlist.tracks && playlist.tracks.length > 0 ? 'cursor-pointer' : '',
          playlist.isExpanded ? 'bg-[#f8f8fc] rounded-t-xl' : 'hover:bg-ditto-light-grey rounded-xl'
        ]"
      >
        <!-- Rank -->
        <span class="text-base font-medium text-ditto-subtext w-6 text-center flex-shrink-0">{{ playlist.rank }}</span>
        
        <!-- Artwork -->
        <img :src="playlist.artwork" :alt="playlist.name" class="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
        
        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5">
            <img src="/img/spotify-icon.svg" alt="Spotify" class="w-4 h-4 flex-shrink-0" />
            <p class="text-sm font-medium text-ditto-text truncate">{{ playlist.name }}</p>
          </div>
          <p class="text-xs text-ditto-purple mt-0.5">{{ playlist.trackCount }} Tracks</p>
        </div>
        
        <!-- Streams + Chevron -->
        <div class="flex items-center gap-1.5 flex-shrink-0">
          <span class="text-sm font-medium text-ditto-text">{{ formatShort(playlist.streams) }}</span>
          <template v-if="playlist.tracks && playlist.tracks.length > 0">
            <IconChevronUp v-if="playlist.isExpanded" class="w-4 h-4 text-ditto-subtext" />
            <IconChevronDown v-else class="w-4 h-4 text-ditto-subtext" />
          </template>
        </div>
      </div>
      
      <!-- Expanded Tracks Section - Desktop -->
      <div 
        v-if="playlist.isExpanded && playlist.tracks && playlist.tracks.length > 0"
        class="hidden lg:block bg-[#f8f8fc] px-8 pb-4 -mt-1"
      >
        <div class="grid grid-cols-[1fr_140px_100px_160px_80px] gap-4 py-2.5 text-xs font-medium text-ditto-purple bg-ditto-purple/10 rounded-lg px-4 mb-1">
          <div>Name</div>
          <div class="text-center">Artist</div>
          <div class="text-center">Streams</div>
          <div class="text-center">Add Date</div>
          <div class="text-center">Skip Rate</div>
        </div>
        <div 
          v-for="track in playlist.tracks" 
          :key="track.id"
          class="grid grid-cols-[1fr_140px_100px_160px_80px] gap-4 py-3 px-4 text-sm border-b border-ditto-border-grey/30 last:border-b-0"
        >
          <div class="text-ditto-text font-medium">{{ track.name }}</div>
          <div class="text-center text-ditto-subtext">{{ track.artist }}</div>
          <div class="text-center text-ditto-text font-medium">{{ track.streams.toLocaleString() }}</div>
          <div class="text-center">
            <div class="text-ditto-text">{{ track.addDate }}</div>
            <div v-if="track.streamsSince" class="text-xs text-ditto-purple">streams since: {{ track.streamsSince.toLocaleString() }}</div>
          </div>
          <div class="text-center text-ditto-text">{{ track.skipRate }}%</div>
        </div>
      </div>
      
      <!-- Expanded Tracks Section - Mobile -->
      <div 
        v-if="playlist.isExpanded && playlist.tracks && playlist.tracks.length > 0"
        class="lg:hidden bg-[#f8f8fc] rounded-b-xl px-3 pb-3"
      >
        <div 
          v-for="track in playlist.tracks" 
          :key="track.id"
          class="flex items-center justify-between py-2.5 border-b border-ditto-border-grey/30 last:border-b-0"
        >
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-ditto-text truncate">{{ track.name }}</p>
            <p class="text-xs text-ditto-subtext">{{ track.artist }}</p>
          </div>
          <div class="text-right flex-shrink-0 pl-3">
            <p class="text-sm font-medium text-ditto-text">{{ formatShort(track.streams) }}</p>
            <p class="text-xs text-ditto-subtext">{{ track.skipRate }}% skip</p>
          </div>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Playlist, TrendsType } from '../types'
import { IconChevronDown, IconChevronUp } from '../components/icons'

const props = defineProps<{
  playlists: Playlist[]
  trendsType?: TrendsType
}>()

defineEmits<{
  (e: 'switchToStreams'): void
}>()

const isDownloadsSelected = computed(() => props.trendsType === 'download')

const localPlaylists = ref<Playlist[]>([])

watch(() => props.playlists, (newVal) => {
  localPlaylists.value = newVal.map(p => ({ ...p, isExpanded: false }))
}, { immediate: true })

const formatShort = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return num.toLocaleString()
}

const toggleExpand = (id: string) => {
  const playlist = localPlaylists.value.find(p => p.id === id)
  if (playlist && playlist.tracks && playlist.tracks.length > 0) {
    playlist.isExpanded = !playlist.isExpanded
  }
}
</script>
