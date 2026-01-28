<template>
  <div>
    <!-- Table Header -->
    <div class="grid grid-cols-[40px_1fr_100px_100px_140px_80px] gap-4 px-4 py-3 text-xs text-ditto-subtext">
      <div></div>
      <div>Details</div>
      <div class="text-center">Streams</div>
      <div class="text-center">Followers</div>
      <div class="text-center">Curator</div>
      <div class="text-center">Skip Rate</div>
    </div>
    
    <!-- Table Rows -->
    <div v-for="playlist in localPlaylists" :key="playlist.id" class="mb-1">
      <!-- Main Row -->
      <div 
        @click="toggleExpand(playlist.id)"
        :class="[
          'grid grid-cols-[40px_1fr_100px_100px_140px_80px] gap-4 px-4 py-4 items-center transition-colors',
          playlist.tracks && playlist.tracks.length > 0 ? 'cursor-pointer' : '',
          playlist.isExpanded ? 'bg-[#f8f8fc]' : 'hover:bg-ditto-light-grey rounded-2xl'
        ]"
      >
        <!-- Rank -->
        <div class="text-lg text-ditto-text">{{ playlist.rank }}</div>
        
        <!-- Details -->
        <div class="flex items-center gap-4">
          <img 
            :src="playlist.artwork" 
            :alt="playlist.name"
            class="w-16 h-16 rounded-lg object-cover"
          />
          <div class="flex items-center gap-2">
            <img src="/img/spotify-icon.svg" alt="Spotify" class="w-5 h-5 flex-shrink-0" />
            <div>
              <p class="text-base font-medium text-ditto-text truncate max-w-[220px]">{{ playlist.name }}</p>
              <p class="text-xs text-ditto-purple">{{ playlist.trackCount }} Tracks</p>
            </div>
          </div>
        </div>
        
        <!-- Streams -->
        <div class="text-center text-base font-medium text-ditto-text">
          {{ playlist.streams.toLocaleString() }}
        </div>
        
        <!-- Followers -->
        <div class="text-center text-base text-ditto-text">
          {{ playlist.followers ? playlist.followers.toLocaleString() : '-' }}
        </div>
        
        <!-- Curator -->
        <div class="text-center text-sm text-ditto-subtext">
          {{ playlist.curator }}
        </div>
        
        <!-- Skip Rate with Chevron -->
        <div class="flex items-center justify-end gap-3 text-base text-ditto-text">
          <span>{{ playlist.skipRate }}%</span>
          <template v-if="playlist.tracks && playlist.tracks.length > 0">
            <IconChevronUp v-if="playlist.isExpanded" class="w-4 h-4 text-ditto-subtext" />
            <IconChevronDown v-else class="w-4 h-4 text-ditto-subtext" />
          </template>
        </div>
      </div>
      
      <!-- Expanded Tracks Section -->
      <div 
        v-if="playlist.isExpanded && playlist.tracks && playlist.tracks.length > 0"
        class="bg-[#f8f8fc] px-8 pb-4 -mt-1"
      >
        <!-- Sub-table Header - Purple background -->
        <div class="grid grid-cols-[1fr_140px_100px_160px_80px] gap-4 py-2.5 text-xs font-medium text-ditto-purple bg-ditto-purple/10 rounded-lg px-4 mb-1">
          <div>Name</div>
          <div class="text-center">Artist</div>
          <div class="text-center">Streams</div>
          <div class="text-center">Add Date</div>
          <div class="text-center">Skip Rate</div>
        </div>
        
        <!-- Sub-table Rows -->
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
            <div v-if="track.streamsSince" class="text-xs text-ditto-purple">
              streams since: {{ track.streamsSince.toLocaleString() }}
            </div>
          </div>
          <div class="text-center text-ditto-text">{{ track.skipRate }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Playlist } from '../types'
import { IconChevronDown, IconChevronUp } from '../components/icons'

const props = defineProps<{
  playlists: Playlist[]
}>()

const localPlaylists = ref<Playlist[]>([])

watch(() => props.playlists, (newVal) => {
  localPlaylists.value = newVal.map(p => ({ ...p, isExpanded: false }))
}, { immediate: true })

const toggleExpand = (id: string) => {
  const playlist = localPlaylists.value.find(p => p.id === id)
  if (playlist && playlist.tracks && playlist.tracks.length > 0) {
    playlist.isExpanded = !playlist.isExpanded
  }
}
</script>
