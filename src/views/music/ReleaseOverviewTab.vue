<template>
  <div>
    <!-- Release hero -->
    <div class="flex flex-col md:flex-row gap-6 lg:gap-10 mb-10">
      <!-- Artwork -->
      <div class="relative w-full max-w-[320px] aspect-square rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
        <span :class="[
          'absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full text-white z-10',
          release.status === 'Live' ? 'bg-success' :
          release.status === 'Takedown' ? 'bg-error' : 'bg-ditto-subtext'
        ]">{{ release.status }}</span>
        <img :src="release.artwork" :alt="release.title" class="w-full h-full object-cover" />
      </div>

      <!-- Meta -->
      <div class="flex-1 min-w-0">
        <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl lg:text-3xl text-ditto-text">{{ release.title }}</h2>
        <p class="text-ditto-purple font-medium mt-1 mb-6">{{ release.artist }}</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 max-w-2xl">
          <div v-for="item in metaItems" :key="item.label" class="flex gap-2 text-sm">
            <span class="font-semibold text-ditto-text whitespace-nowrap">{{ item.label }}:</span>
            <span class="text-ditto-subtext truncate" :title="item.value">{{ item.value }}</span>
          </div>
        </div>

        <!-- Share -->
        <div class="mt-8">
          <h3 class="font-satoshi font-black tracking-[-0.03em] text-lg text-ditto-text mb-3">Share your music</h3>
          <div class="flex items-center gap-2.5 flex-wrap">
            <button class="flex items-center gap-2 px-5 h-11 bg-ditto-purple btn-pop-purple text-white text-sm font-medium rounded-full hover:opacity-95 transition-all">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.6" y1="10.5" x2="15.4" y2="6.5"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/>
              </svg>
              Get your SmartLink
            </button>
            <button class="w-11 h-11 rounded-full bg-ditto-text text-white flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="Share on X">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </button>
            <button class="w-11 h-11 rounded-full bg-ditto-text text-white flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="Share on Facebook">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tracklist -->
    <div class="bg-white rounded-2xl border border-gray-200 mb-8">
      <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="font-satoshi font-black tracking-[-0.03em] text-lg text-ditto-text">Tracklist</h3>
      </div>

      <!-- Header (desktop) -->
      <div class="hidden md:grid grid-cols-[40px_60px_1fr_1fr_140px_130px] gap-4 px-6 py-3 text-xs text-ditto-subtext border-b border-gray-50">
        <div>#</div>
        <div></div>
        <div>Title</div>
        <div>Artists</div>
        <div>ISRC</div>
        <div class="text-right">Edits</div>
      </div>

      <div v-for="track in release.tracks" :key="track.id" class="border-t border-gray-50 first:border-t-0">
        <!-- Desktop row -->
        <div class="hidden md:grid grid-cols-[40px_60px_1fr_1fr_140px_130px] gap-4 px-6 py-4 items-center hover:bg-ditto-light-grey transition-colors">
          <span class="text-sm font-semibold text-ditto-text">{{ track.number }}</span>
          <div class="flex flex-col items-center gap-0.5">
            <button
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                playingTrack === track.number && isPlaying
                  ? 'bg-ditto-purple text-white'
                  : 'bg-ditto-light-grey text-ditto-text hover:bg-ditto-purple hover:text-white'
              ]"
              :aria-label="playingTrack === track.number && isPlaying ? 'Pause' : 'Play'"
              @click="toggleTrack(track.number)"
            >
              <svg v-if="playingTrack === track.number && isPlaying" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M7 4v16"/><path d="M17 4v16"/></svg>
              <svg v-else class="w-3 h-3 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20"/></svg>
            </button>
            <span class="text-[10px] text-ditto-subtext">{{ track.duration }}</span>
          </div>
          <p class="text-sm font-medium text-ditto-text truncate" :title="track.title">{{ track.title }}</p>
          <p class="text-sm text-ditto-purple truncate" :title="track.artists">{{ track.artists }}</p>
          <p class="text-sm text-ditto-subtext">{{ track.isrc }}</p>
          <div class="flex justify-end">
            <button class="flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-full text-xs font-medium text-ditto-text hover:border-ditto-purple hover:text-ditto-purple transition-colors">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit Metadata
            </button>
          </div>
        </div>

        <!-- Mobile row -->
        <div class="md:hidden flex items-center gap-3 px-4 py-3">
          <button
            :class="[
              'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
              playingTrack === track.number && isPlaying ? 'bg-ditto-purple text-white' : 'bg-ditto-light-grey text-ditto-text'
            ]"
            :aria-label="playingTrack === track.number && isPlaying ? 'Pause' : 'Play'"
            @click="toggleTrack(track.number)"
          >
            <svg v-if="playingTrack === track.number && isPlaying" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M7 4v16"/><path d="M17 4v16"/></svg>
            <svg v-else class="w-3 h-3 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20"/></svg>
          </button>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-ditto-text truncate">{{ track.number }}. {{ track.title }}</p>
            <p class="text-xs text-ditto-subtext truncate">{{ track.artists }} · {{ track.duration }} · {{ track.isrc }}</p>
          </div>
          <button class="text-ditto-subtext hover:text-ditto-purple p-1.5" aria-label="Edit metadata">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Takedown -->
    <div class="flex justify-center pb-4">
      <button class="px-6 py-2.5 border border-gray-200 rounded-full text-sm font-medium text-ditto-subtext hover:border-error hover:text-error transition-colors">
        Request a Takedown
      </button>
    </div>

    <!-- Player bar (ported from ditto-admin) -->
    <div v-if="activeTrack" class="h-20"></div>
    <PlayerBar
      ref="playerRef"
      :track="activeTrack"
      @close="playingTrack = null"
      @playing="isPlaying = $event"
      @previous="stepTrack(-1)"
      @next="stepTrack(1)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PlayerBar from '../../components/common/PlayerBar.vue'
import type { PlayerTrack } from '../../components/common/PlayerBar.vue'
import type { ReleaseDetail } from '../../data/releaseDetailMockData'

const props = defineProps<{ release: ReleaseDetail }>()

// Track preview via the shared PlayerBar
const playingTrack = ref<number | null>(null)
const isPlaying = ref(false)
const playerRef = ref<InstanceType<typeof PlayerBar> | null>(null)

const parseDuration = (d: string): number => {
  const [m, s] = d.split(':').map(Number)
  return (m || 0) * 60 + (s || 0)
}

const activeTrack = computed<PlayerTrack | null>(() => {
  const t = props.release.tracks.find(x => x.number === playingTrack.value)
  if (!t) return null
  return { title: t.title, artist: t.artists, duration: parseDuration(t.duration), artwork: props.release.artwork }
})

const toggleTrack = (num: number) => {
  if (playingTrack.value !== num) {
    playingTrack.value = num
  } else if (isPlaying.value) {
    playerRef.value?.pause()
  } else {
    playerRef.value?.play()
  }
}

const stepTrack = (dir: 1 | -1) => {
  const tracks = props.release.tracks
  const i = tracks.findIndex(t => t.number === playingTrack.value)
  if (i === -1) return
  const next = tracks[(i + dir + tracks.length) % tracks.length]
  playingTrack.value = next.number
}

const formatDate = (iso: string): string => {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const metaItems = computed(() => [
  { label: 'Label', value: props.release.label },
  { label: 'UPC', value: props.release.upc },
  { label: 'Copyright', value: props.release.copyright },
  { label: 'Language', value: props.release.language },
  { label: 'Release Type', value: props.release.type },
  { label: 'Release Date', value: formatDate(props.release.releaseDate) },
  { label: 'Primary Genre', value: props.release.genre },
  { label: 'Production Year', value: props.release.productionYear },
])
</script>
