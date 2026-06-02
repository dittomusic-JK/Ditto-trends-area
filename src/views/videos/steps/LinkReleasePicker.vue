<template>
  <div>
    <div class="flex items-center gap-2 mb-1">
      <h2 class="font-satoshi font-black tracking-[-0.03em] text-xl lg:text-2xl text-ditto-text">Link to a music release</h2>
      <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-ditto-light-grey text-ditto-subtext uppercase tracking-wide">Optional</span>
    </div>
    <p class="text-sm text-ditto-subtext mb-4">
      Already released this track? Link it to copy over your artists, genre, copyrights and label automatically. You can still edit everything below.
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
              Metadata copied from this track
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

        <div v-else class="rounded-xl border border-ditto-purple/20 bg-ditto-purple/5 p-5">
          <p class="text-xs text-ditto-subtext mb-4">Select a release, then choose the track you're making a video for.</p>

          <!-- Release Cards -->
          <div class="space-y-2">
            <button
              v-for="release in releases"
              :key="release.id"
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
          </div>

          <!-- Track List -->
          <div v-if="selectedRelease" class="border-t border-ditto-purple/10 mt-4 pt-4">
            <p class="text-xs font-medium text-ditto-subtext uppercase tracking-wide mb-2">Select Track</p>
            <div class="space-y-1.5">
              <button
                v-for="track in selectedRelease.tracks"
                :key="track.id"
                @click="selectTrack(track.id)"
                class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left hover:bg-white/70 border border-transparent"
              >
                <span class="text-xs text-ditto-subtext w-5 text-center flex-shrink-0">{{ track.trackNumber }}</span>
                <p class="text-sm text-ditto-text flex-1">{{ track.title }}</p>
                <div v-if="track.featuredArtists.length > 0" class="text-xs text-ditto-subtext">
                  feat. {{ track.featuredArtists.map(a => a.name).join(', ') }}
                </div>
              </button>
            </div>
          </div>

          <button @click="open = false" class="mt-4 text-xs text-ditto-subtext hover:text-ditto-text">Cancel</button>
        </div>
      </template>

      <p class="text-[11px] text-ditto-subtext mt-3 italic">Your video gets its own ISRC &mdash; we won't copy the audio track's code.</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { spotifyMusicReleases } from '../../../data/videoMockData'
import type { SpotifyTrack } from '../../../data/videoMockData'

const props = defineProps<{
  releaseId: string | null
  trackId: string | null
}>()

const emit = defineEmits<{
  (e: 'update:releaseId', v: string | null): void
  (e: 'update:trackId', v: string | null): void
  (e: 'copyMetadata', track: SpotifyTrack): void
}>()

const releases = spotifyMusicReleases
const open = ref(false)

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

const formatReleaseDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
