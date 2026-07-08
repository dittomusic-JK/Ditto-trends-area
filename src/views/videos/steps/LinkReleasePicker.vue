<template>
  <div>
    <h2 class="font-satoshi font-black tracking-[-0.03em] text-xl lg:text-2xl text-ditto-text mb-1">Link to a music release</h2>
    <p class="text-sm text-ditto-subtext mb-4">
      Already released this track? Link it to copy over your artists, credits, genre, copyrights and label automatically — you can still edit everything below. <span class="font-medium text-ditto-text">Linking a release is required to distribute your video to Spotify.</span>
    </p>

    <!-- No releases available -->
    <div v-if="releases.length === 0" class="p-4 rounded-xl bg-ditto-light-grey/60 text-sm text-ditto-subtext">
      You don't have any music releases to link yet. Fill in your details manually below.
    </div>

    <template v-else>
      <!-- Linked summary -->
      <div v-if="selectedTrack" class="rounded-xl border border-ditto-purple/20 bg-ditto-purple/5 p-4">
        <div class="flex items-center gap-3">
          <img :src="selectedRelease!.artwork" :alt="selectedRelease!.title" class="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-ditto-text truncate">{{ selectedRelease!.title }} &middot; {{ selectedTrack.title }}</p>
            <p class="text-xs text-success flex items-center gap-1 mt-0.5">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="22,4 12,14.01 9,11.01" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Metadata &amp; credits copied from this track
            </p>
          </div>
          <button @click="unlink" class="text-xs text-ditto-purple hover:underline flex-shrink-0">Unlink</button>
        </div>
      </div>

      <!-- Picker -->
      <template v-else>
        <button
          v-if="!open"
          @click="open = true"
          class="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-ditto-text hover:border-ditto-purple/40 hover:text-ditto-purple transition-colors"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Link a release
        </button>

        <div v-else class="relative rounded-xl border border-ditto-purple/20 bg-ditto-purple/5 p-5">
          <button
            @click="cancel"
            aria-label="Cancel"
            class="absolute top-4 right-4 w-7 h-7 rounded-full hover:bg-ditto-purple/10 flex items-center justify-center text-ditto-subtext hover:text-ditto-text transition-colors"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <p class="text-xs text-ditto-subtext mb-4 pr-8">Select a release, then choose the track you're making a video for.</p>

          <!-- Search -->
          <div class="relative mb-3">
            <svg class="w-4 h-4 text-ditto-subtext absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35" stroke-linecap="round"/>
            </svg>
            <input
              v-model="query"
              type="text"
              placeholder="Search by track, release or artist"
              class="w-full pl-9 pr-9 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-ditto-text placeholder:text-ditto-subtext focus:outline-none focus:border-ditto-purple transition-colors"
            />
            <button
              v-if="query"
              @click="query = ''"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-ditto-subtext hover:text-ditto-text"
              aria-label="Clear search"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <!-- No matches -->
          <p v-if="filteredReleases.length === 0" class="text-sm text-ditto-subtext py-4 text-center">
            No releases match &ldquo;{{ query }}&rdquo;.
          </p>

          <!-- Release Cards (track list folds out under the selected one) -->
          <div v-else class="space-y-2 max-h-[360px] overflow-y-auto pr-1 -mr-1">
            <div v-for="release in filteredReleases" :key="release.id">
              <button
                @click="selectRelease(release.id)"
                :class="[
                  'w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left',
                  releaseId === release.id ? 'border-ditto-purple bg-white shadow-sm' : 'border-gray-200 bg-white/50 hover:border-gray-300'
                ]"
              >
                <img :src="release.artwork" :alt="release.title" class="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-ditto-text truncate">{{ release.title }}</p>
                  <p class="text-xs text-ditto-subtext">{{ release.artist }} &middot; {{ formatReleaseDate(release.releaseDate) }}</p>
                </div>
                <div :class="[
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                  releaseId === release.id ? 'border-ditto-purple bg-ditto-purple' : 'border-gray-300'
                ]">
                  <div v-if="releaseId === release.id" class="w-2 h-2 rounded-full bg-white"></div>
                </div>
              </button>

              <!-- Inline track list for the selected release -->
              <div v-if="releaseId === release.id" class="mt-2 ml-4 pl-4 border-l-2 border-ditto-purple/20">
                <p class="text-xs font-medium text-ditto-subtext uppercase tracking-wide mb-2">Select Track</p>
                <div class="space-y-1.5">
                  <button
                    v-for="track in release.tracks"
                    :key="track.id"
                    @click="selectTrack(track.id)"
                    class="group/track w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left bg-white/40 border border-transparent hover:bg-white hover:border-ditto-purple/40 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <span class="text-xs text-ditto-subtext w-5 text-center flex-shrink-0 group-hover/track:text-ditto-purple transition-colors">{{ track.trackNumber }}</span>
                    <p class="text-sm text-ditto-text flex-1 group-hover/track:text-ditto-purple group-hover/track:font-medium transition-colors">{{ track.title }}</p>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </template>

      <p class="text-[11px] text-ditto-subtext mt-3 italic">Your video gets its own ISRC &mdash; we won't copy the audio track's code.</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { spotifyMusicReleases } from '../../../data/videoMockData'
import type { SpotifyTrack } from '../../../data/videoMockData'

const props = defineProps<{
  releaseId: string | null
  trackId: string | null
  autoOpen?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:releaseId', v: string | null): void
  (e: 'update:trackId', v: string | null): void
  (e: 'copyMetadata', track: SpotifyTrack): void
  (e: 'autoOpenConsumed'): void
}>()

const releases = spotifyMusicReleases
const open = ref(false)
const query = ref('')

// Opened automatically when the user is sent here to link a release (e.g. from Stores).
watch(() => props.autoOpen, (v) => {
  if (v) {
    open.value = true
    emit('autoOpenConsumed')
  }
}, { immediate: true })

const filteredReleases = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return releases
  return releases.filter(r =>
    r.title.toLowerCase().includes(q) ||
    r.artist.toLowerCase().includes(q) ||
    r.tracks.some(t => t.title.toLowerCase().includes(q))
  )
})

const selectedRelease = computed(() =>
  spotifyMusicReleases.find(r => r.id === props.releaseId) || null
)

const selectedTrack = computed(() =>
  selectedRelease.value?.tracks.find(t => t.id === props.trackId) || null
)

const selectRelease = (id: string) => {
  emit('update:releaseId', id)
  emit('update:trackId', null)
}

const selectTrack = (id: string) => {
  const track = selectedRelease.value?.tracks.find(t => t.id === id)
  if (track) {
    emit('update:trackId', id)
    emit('copyMetadata', track)
    open.value = false
  }
}

const unlink = () => {
  emit('update:releaseId', null)
  emit('update:trackId', null)
}

// Cancel the linking process — close the panel and clear any in-progress selection.
const cancel = () => {
  open.value = false
  emit('update:releaseId', null)
  emit('update:trackId', null)
}

const formatReleaseDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
