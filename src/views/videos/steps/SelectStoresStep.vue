<template>
  <div>
    <h2 class="font-poppins font-bold text-xl lg:text-2xl text-ditto-text mb-2">Select Your Stores</h2>
    <p class="text-sm text-ditto-subtext mb-6">Choose which stores and platforms you want to distribute your video to.</p>

    <!-- Store Tiles -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
      <div
        v-for="store in storeList"
        :key="store.id"
        :class="[
          'rounded-xl transition-all overflow-hidden',
          isStoreDisabled(store.id)
            ? 'bg-gray-50 opacity-50'
            : isSelected(store.id)
              ? 'bg-ditto-light-grey'
              : 'bg-ditto-light-grey/50 hover:bg-ditto-light-grey'
        ]"
      >
        <!-- Main row -->
        <button
          @click="handleStoreClick(store.id)"
          :disabled="isStoreDisabled(store.id)"
          class="w-full flex items-center gap-4 p-4 text-left"
          :class="isStoreDisabled(store.id) ? 'cursor-not-allowed' : ''"
        >
          <!-- Store Icon -->
          <img :src="store.logo" :alt="store.name" class="w-10 h-10 object-contain flex-shrink-0" />

          <!-- Name + More Info -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-ditto-text">{{ store.name }}</p>
            <p v-if="isStoreDisabled(store.id)" class="text-xs text-ditto-subtext">Requires a music release on Spotify</p>
            <span
              v-else
              @click.stop="toggleInfo(store.id)"
              class="text-xs text-ditto-purple hover:underline cursor-pointer"
            >{{ expandedInfo === store.id ? 'Hide info' : 'More info' }}</span>
          </div>

          <!-- Checkbox / Lock -->
          <div class="flex-shrink-0">
            <div v-if="isStoreDisabled(store.id)" class="w-6 h-6 flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
            </div>
            <div v-else :class="[
              'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
              isSelected(store.id) ? 'bg-ditto-purple border-ditto-purple' : 'border-gray-300 bg-white'
            ]">
              <svg v-if="isSelected(store.id)" class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20,6 9,17 4,12" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </button>

        <!-- Expanded info -->
        <div v-if="expandedInfo === store.id && !isStoreDisabled(store.id)" class="px-4 pb-4 -mt-1">
          <p class="text-xs text-ditto-subtext leading-relaxed pl-14">{{ store.info }}</p>
        </div>
      </div>
    </div>

    <!-- Spotify Music Release Picker -->
    <div v-if="isSelected('spotify')" class="mb-8 rounded-xl border border-ditto-purple/20 bg-ditto-purple/5 overflow-hidden">
      <div class="p-5">
        <div class="flex items-center gap-2 mb-1">
          <img src="/img/spotify-icon.svg" alt="Spotify" class="w-5 h-5 object-contain" />
          <h3 class="text-sm font-semibold text-ditto-text">Link to Music Release</h3>
        </div>
        <p class="text-xs text-ditto-subtext mb-4">
          Select a music release on Spotify to link this video to. Track metadata (artists, genre, copyrights, label) will be copied automatically.
        </p>

        <!-- Release Cards -->
        <div class="space-y-2">
          <button
            v-for="release in spotifyReleases"
            :key="release.id"
            @click="selectRelease(release.id)"
            :class="[
              'w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left',
              stores.spotifyReleaseId === release.id
                ? 'border-ditto-purple bg-white shadow-sm'
                : 'border-gray-200 bg-white/50 hover:border-gray-300'
            ]"
          >
            <img
              :src="release.artwork"
              :alt="release.title"
              class="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-ditto-text truncate">{{ release.title }}</p>
              <p class="text-xs text-ditto-subtext">{{ release.artist }} &middot; {{ formatReleaseDate(release.releaseDate) }}</p>
            </div>
            <div :class="[
              'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
              stores.spotifyReleaseId === release.id ? 'border-ditto-purple bg-ditto-purple' : 'border-gray-300'
            ]">
              <div v-if="stores.spotifyReleaseId === release.id" class="w-2 h-2 rounded-full bg-white"></div>
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
              :class="[
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left',
                stores.spotifyTrackId === track.id
                  ? 'bg-ditto-purple/10 border border-ditto-purple/20'
                  : 'hover:bg-white/70 border border-transparent'
              ]"
            >
              <span class="text-xs text-ditto-subtext w-5 text-center flex-shrink-0">{{ track.trackNumber }}</span>
              <p class="text-sm text-ditto-text flex-1">{{ track.title }}</p>
              <div v-if="track.featuredArtists.length > 0" class="text-xs text-ditto-subtext">
                feat. {{ track.featuredArtists.map(a => a.name).join(', ') }}
              </div>
              <svg v-if="stores.spotifyTrackId === track.id" class="w-4 h-4 text-ditto-purple flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20,6 9,17 4,12" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <!-- Metadata Copy Confirmation -->
          <div v-if="selectedTrack" class="mt-4 p-3 rounded-lg bg-white border border-ditto-purple/10">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-4 h-4 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="22,4 12,14.01 9,11.01" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <p class="text-xs font-medium text-success">Metadata will be copied from this track</p>
            </div>
            <div class="grid grid-cols-2 gap-x-4 gap-y-1">
              <p class="text-[10px] text-ditto-subtext"><span class="font-medium">Artists:</span> {{ selectedTrack.primaryArtists.map(a => a.name).join(', ') }}{{ selectedTrack.featuredArtists.length ? ' feat. ' + selectedTrack.featuredArtists.map(a => a.name).join(', ') : '' }}</p>
              <p class="text-[10px] text-ditto-subtext"><span class="font-medium">Genre:</span> {{ selectedTrack.primaryGenre }}{{ selectedTrack.secondaryGenre ? ' / ' + selectedTrack.secondaryGenre : '' }}</p>
              <p class="text-[10px] text-ditto-subtext"><span class="font-medium">&copy; Copyright:</span> {{ selectedTrack.copyrightHolder }}</p>
              <p class="text-[10px] text-ditto-subtext"><span class="font-medium">Label:</span> {{ selectedTrack.recordLabel }}</p>
              <p class="text-[10px] text-ditto-subtext"><span class="font-medium">Language:</span> {{ selectedTrack.language }}</p>
              <p class="text-[10px] text-ditto-subtext"><span class="font-medium">ISRC:</span> {{ selectedTrack.isrc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- VEVO Channel Setup -->
    <div v-if="isSelected('vevo')" class="mb-8 rounded-xl border border-ditto-purple/20 bg-ditto-purple/5 overflow-hidden">
      <div class="p-5">
        <div class="flex items-center gap-2 mb-1">
          <img src="/img/vevo-icon.svg" alt="VEVO" class="w-5 h-5 object-contain" />
          <h3 class="text-sm font-semibold text-ditto-text">VEVO Channel Setup</h3>
        </div>
        <p class="text-xs text-ditto-subtext mb-4">Create or link an existing VEVO channel.</p>

        <!-- 10-day notice -->
        <div class="mb-5 p-3 rounded-lg bg-warning/10 border border-warning/20 flex items-start gap-2">
          <svg class="w-4 h-4 text-warning flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <p class="text-xs text-warning leading-relaxed"><strong>Please note that your VEVO channel will take a minimum of 10 days to be setup.</strong> It may take even longer depending on VEVO current timescales.</p>
        </div>

        <!-- Has existing channel? -->
        <div class="mb-5">
          <p class="text-sm font-medium text-ditto-text mb-3">Do you have an existing VEVO channel?</p>
          <div class="space-y-2">
            <label :class="[
              'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all',
              stores.vevoHasChannel === false ? 'border-ditto-purple bg-white' : 'border-gray-200 bg-white/50 hover:border-gray-300'
            ]">
              <input type="radio" name="vevoHasChannel" :checked="stores.vevoHasChannel === false" @change="updateField('vevoHasChannel', false)" class="mt-0.5 accent-ditto-purple" />
              <div>
                <p class="text-sm text-ditto-text">No - There is no existing VEVO channel.</p>
                <p class="text-xs text-ditto-subtext mt-0.5">A channel name will be generated for you.</p>
              </div>
            </label>
            <label :class="[
              'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all',
              stores.vevoHasChannel === true ? 'border-ditto-purple bg-white' : 'border-gray-200 bg-white/50 hover:border-gray-300'
            ]">
              <input type="radio" name="vevoHasChannel" :checked="stores.vevoHasChannel === true" @change="updateField('vevoHasChannel', true)" class="mt-0.5 accent-ditto-purple" />
              <div>
                <p class="text-sm text-ditto-text">Yes - There is an existing VEVO channel</p>
              </div>
            </label>
          </div>
        </div>

        <!-- Existing channel name input -->
        <div v-if="stores.vevoHasChannel === true" class="mb-5">
          <label class="block text-xs font-medium text-ditto-subtext mb-1">My VEVO channel name is:</label>
          <input
            :value="stores.vevoChannelName"
            @input="updateField('vevoChannelName', ($event.target as HTMLInputElement).value)"
            type="text"
            placeholder="e.g. ArtistNameVEVO"
            class="w-full px-0 py-2.5 border-0 border-b border-gray-300 text-sm text-ditto-text bg-transparent focus:outline-none focus:border-ditto-purple transition-colors"
          />
          <div class="mt-3 space-y-2">
            <div class="flex items-start gap-2">
              <svg class="w-3.5 h-3.5 text-warning flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <p class="text-[11px] text-ditto-subtext leading-relaxed">Please enter VEVO channel names only (VEVO handles or Official Artist Channels are not accepted).</p>
            </div>
            <div class="flex items-start gap-2">
              <svg class="w-3.5 h-3.5 text-warning flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <p class="text-[11px] text-ditto-subtext leading-relaxed">Incorrect channel names can lead to your video being rejected or placed onto someone else's channel.</p>
            </div>
          </div>
        </div>

        <!-- Channel Details (only for NEW channel creation) -->
        <div v-if="stores.vevoHasChannel === false" class="border-t border-ditto-purple/10 pt-5 space-y-4">
          <h4 class="text-sm font-semibold text-ditto-text">Channel Details</h4>

          <!-- Artist Name -->
          <div>
            <label class="block text-xs font-medium text-ditto-subtext mb-1">Artist Name</label>
            <input
              :value="stores.vevoArtistName"
              @input="updateField('vevoArtistName', ($event.target as HTMLInputElement).value)"
              type="text"
              placeholder="Artist or band name"
              class="w-full px-0 py-2.5 border-0 border-b border-gray-300 text-sm text-ditto-text bg-transparent focus:outline-none focus:border-ditto-purple transition-colors"
            />
          </div>

          <!-- Channel Name (auto generated preview) -->
          <div>
            <label class="block text-xs font-medium text-ditto-subtext mb-1">Channel Name</label>
            <div class="flex items-center gap-2 py-2.5 border-b border-gray-200">
              <span class="text-sm text-ditto-subtext">{{ stores.vevoArtistName ? stores.vevoArtistName.replace(/\s+/g, '') + 'VEVO' : 'Will be auto-generated' }}</span>
              <span v-if="stores.vevoArtistName" class="text-[10px] text-ditto-purple bg-ditto-purple/10 px-1.5 py-0.5 rounded">Auto</span>
            </div>
          </div>

          <!-- Biography -->
          <div>
            <label class="block text-xs font-medium text-ditto-subtext mb-1">Biography</label>
            <textarea
              :value="stores.vevoBiography"
              @input="updateField('vevoBiography', ($event.target as HTMLTextAreaElement).value)"
              rows="3"
              placeholder="Tell viewers about the artist..."
              class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-ditto-text bg-white focus:outline-none focus:border-ditto-purple transition-colors resize-none"
            ></textarea>
          </div>

          <!-- Artist Image Upload -->
          <div>
            <label class="block text-xs font-medium text-ditto-subtext mb-1">Channel Artist Image</label>
            <div
              :class="[
                'relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer',
                stores.vevoArtistImage ? 'border-ditto-purple bg-ditto-purple/5' : 'border-gray-300 hover:border-gray-400 bg-white'
              ]"
              @click="triggerFileInput('artistImage')"
            >
              <div v-if="!stores.vevoArtistImage">
                <svg class="w-8 h-8 text-ditto-subtext mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/>
                </svg>
                <p class="text-sm text-ditto-text font-medium mb-1">Upload artist image</p>
                <p class="text-[11px] text-ditto-subtext">JPEG only &middot; Min 5000 &times; 5000px &middot; Max 15MB</p>
              </div>
              <div v-else class="flex items-center gap-3">
                <div class="w-14 h-14 rounded-lg bg-ditto-light-grey flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img :src="getFilePreview(stores.vevoArtistImage)" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 text-left min-w-0">
                  <p class="text-sm text-ditto-text font-medium truncate">{{ stores.vevoArtistImage.name }}</p>
                  <p class="text-[11px] text-ditto-subtext">{{ formatFileSize(stores.vevoArtistImage.size) }}</p>
                </div>
                <button @click.stop="updateField('vevoArtistImage', null)" class="text-ditto-subtext hover:text-error p-1">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
            <input ref="artistImageInput" type="file" accept=".jpg,.jpeg" class="hidden" @change="handleVevoFileUpload('vevoArtistImage', $event)" />
            <div class="mt-2 space-y-1">
              <p class="text-[10px] text-ditto-subtext">&bull; Press picture of the artist(s), <strong>no text or logos</strong></p>
              <p class="text-[10px] text-ditto-subtext">&bull; Artist(s) should be centred &bull; Background should not be pure white</p>
            </div>
            <!-- Artist image error -->
            <div v-if="vevoFileError && vevoFileErrorField === 'vevoArtistImage'" class="mt-2 p-2.5 rounded-lg bg-error/10 border border-error/20 flex items-center gap-2">
              <svg class="w-3.5 h-3.5 text-error flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <p class="text-xs text-error">{{ vevoFileError }}</p>
            </div>
          </div>

          <!-- Channel Art / YouTube Banner -->
          <div>
            <label class="block text-xs font-medium text-ditto-subtext mb-1">Channel Art / YouTube Banner</label>
            <div
              :class="[
                'relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer',
                stores.vevoBanner ? 'border-ditto-purple bg-ditto-purple/5' : 'border-gray-300 hover:border-gray-400 bg-white'
              ]"
              @click="triggerFileInput('banner')"
            >
              <div v-if="!stores.vevoBanner">
                <svg class="w-8 h-8 text-ditto-subtext mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="2" y="6" width="20" height="12" rx="2" ry="2"/><path d="M12 6v12M7 6v12M17 6v12" stroke-dasharray="2 2"/>
                </svg>
                <p class="text-sm text-ditto-text font-medium mb-1">Upload channel art / YouTube banner</p>
                <p class="text-[11px] text-ditto-subtext">PNG only &middot; Min 2560 &times; 1440px &middot; Max 4MB</p>
              </div>
              <div v-else class="flex items-center gap-3">
                <div class="w-20 h-11 rounded-lg bg-ditto-light-grey flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img :src="getFilePreview(stores.vevoBanner)" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 text-left min-w-0">
                  <p class="text-sm text-ditto-text font-medium truncate">{{ stores.vevoBanner.name }}</p>
                  <p class="text-[11px] text-ditto-subtext">{{ formatFileSize(stores.vevoBanner.size) }}</p>
                </div>
                <button @click.stop="updateField('vevoBanner', null)" class="text-ditto-subtext hover:text-error p-1">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
            <input ref="bannerInput" type="file" accept=".png" class="hidden" @change="handleVevoFileUpload('vevoBanner', $event)" />
            <p class="mt-2 text-[10px] text-ditto-subtext">Can contain text &mdash; great for making your VEVO and YouTube channels look more official.</p>
            <!-- Banner error -->
            <div v-if="vevoFileError && vevoFileErrorField === 'vevoBanner'" class="mt-2 p-2.5 rounded-lg bg-error/10 border border-error/20 flex items-center gap-2">
              <svg class="w-3.5 h-3.5 text-error flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <p class="text-xs text-error">{{ vevoFileError }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Price Band -->
    <div class="mb-6">
      <h3 class="text-sm font-semibold text-ditto-text mb-2">How much would you like to charge?</h3>
      <p class="text-xs text-ditto-subtext mb-3">Select a price band for your video on stores that support paid content.</p>

      <div class="flex items-center gap-3">
        <label
          v-for="option in priceBands"
          :key="option.id"
          :class="[
            'flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer',
            stores.priceBand === option.id
              ? 'bg-ditto-purple text-white'
              : 'bg-ditto-light-grey text-ditto-text hover:bg-gray-200'
          ]"
        >
          <input
            type="radio"
            name="priceBand"
            :value="option.id"
            :checked="stores.priceBand === option.id"
            @change="updateField('priceBand', option.id)"
            class="hidden"
          />
          {{ option.label }}
        </label>
      </div>
    </div>

    <!-- Validation message -->
    <div v-if="stores.selected.length === 0" class="p-3 rounded-xl bg-warning/10 border border-warning/20 flex items-center gap-2">
      <svg class="w-4 h-4 text-warning flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
      <p class="text-xs text-warning">Please select at least one store to continue.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { videoStores, spotifyMusicReleases, userHasSpotifyReleases } from '../../../data/videoMockData'
import type { SpotifyTrack } from '../../../data/videoMockData'

interface StoresData {
  selected: string[]
  vevoHasChannel: boolean | null
  vevoChannelName: string
  vevoArtistName: string
  vevoBiography: string
  vevoArtistImage: File | null
  vevoBanner: File | null
  priceBand: 'budget' | 'mid' | 'premium'
  spotifyReleaseId: string | null
  spotifyTrackId: string | null
}

const props = defineProps<{
  stores: StoresData
}>()

const emit = defineEmits<{
  (e: 'update:stores', stores: StoresData): void
  (e: 'copyMetadata', track: SpotifyTrack): void
}>()

const storeList = videoStores
const spotifyReleases = spotifyMusicReleases
const hasSpotifyReleases = userHasSpotifyReleases
const expandedInfo = ref<string | null>(null)

const toggleInfo = (id: string) => {
  expandedInfo.value = expandedInfo.value === id ? null : id
}

const priceBands = [
  { id: 'budget', label: 'Budget' },
  { id: 'mid', label: 'Mid' },
  { id: 'premium', label: 'Premium' },
]

const isSelected = (id: string) => props.stores.selected.includes(id)

const isStoreDisabled = (id: string) => {
  if (id === 'spotify' && !hasSpotifyReleases) return true
  return false
}

const handleStoreClick = (id: string) => {
  if (isStoreDisabled(id)) return
  toggleStore(id)
}

const toggleStore = (id: string) => {
  const updated = { ...props.stores }
  if (isSelected(id)) {
    updated.selected = updated.selected.filter(s => s !== id)
    if (id === 'spotify') {
      updated.spotifyReleaseId = null
      updated.spotifyTrackId = null
    }
  } else {
    updated.selected = [...updated.selected, id]
  }
  emit('update:stores', updated)
}

const selectedRelease = computed(() =>
  spotifyMusicReleases.find(r => r.id === props.stores.spotifyReleaseId) || null
)

const selectedTrack = computed(() =>
  selectedRelease.value?.tracks.find(t => t.id === props.stores.spotifyTrackId) || null
)

const selectRelease = (id: string) => {
  emit('update:stores', { ...props.stores, spotifyReleaseId: id, spotifyTrackId: null })
}

const selectTrack = (id: string) => {
  const track = selectedRelease.value?.tracks.find(t => t.id === id)
  if (track) {
    emit('update:stores', { ...props.stores, spotifyTrackId: id })
    emit('copyMetadata', track)
  }
}

const updateField = (key: keyof StoresData, value: any) => {
  emit('update:stores', { ...props.stores, [key]: value })
}

const formatReleaseDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// VEVO file upload handling
const artistImageInput = ref<HTMLInputElement | null>(null)
const bannerInput = ref<HTMLInputElement | null>(null)

const triggerFileInput = (type: 'artistImage' | 'banner') => {
  if (type === 'artistImage') artistImageInput.value?.click()
  else bannerInput.value?.click()
}

const vevoFileError = ref('')
const vevoFileErrorField = ref<'vevoArtistImage' | 'vevoBanner' | ''>('')

const handleVevoFileUpload = (field: 'vevoArtistImage' | 'vevoBanner', event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || !input.files[0]) return
  const file = input.files[0]
  vevoFileError.value = ''
  vevoFileErrorField.value = ''

  const maxSize = field === 'vevoArtistImage' ? 15 * 1024 * 1024 : 4 * 1024 * 1024
  const maxLabel = field === 'vevoArtistImage' ? '15MB' : '4MB'
  const minW = field === 'vevoArtistImage' ? 5000 : 2560
  const minH = field === 'vevoArtistImage' ? 5000 : 1440
  const label = field === 'vevoArtistImage' ? 'Artist image' : 'Banner image'

  if (file.size > maxSize) {
    vevoFileError.value = `${label} must be under ${maxLabel}.`
    vevoFileErrorField.value = field
    input.value = ''
    return
  }

  const img = new Image()
  img.onload = () => {
    URL.revokeObjectURL(img.src)
    if (img.width < minW || img.height < minH) {
      vevoFileError.value = `${label} is ${img.width}×${img.height}px — it needs to be at least ${minW}×${minH}px.`
      vevoFileErrorField.value = field
      input.value = ''
      return
    }
    vevoFileError.value = ''
    vevoFileErrorField.value = ''
    updateField(field, file)
  }
  img.onerror = () => {
    URL.revokeObjectURL(img.src)
    vevoFileError.value = 'Could not read this image. Please try another file.'
    vevoFileErrorField.value = field
    input.value = ''
  }
  img.src = URL.createObjectURL(file)
}

const getFilePreview = (file: File): string => {
  return URL.createObjectURL(file)
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}
</script>
