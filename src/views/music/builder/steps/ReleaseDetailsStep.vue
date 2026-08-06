<template>
  <div class="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-12 items-start">
    <!-- ── Form column ── -->
    <div>
      <h1 class="font-satoshi font-black text-2xl lg:text-[32px] tracking-[-0.03em] text-ditto-text mb-10">Release Details</h1>

      <div class="space-y-7">
        <!-- Release title -->
        <div>
          <div class="flex items-center gap-1.5 mb-1.5">
            <label class="text-sm font-medium text-ditto-text">Release Title</label>
            <span class="text-error text-xs">*</span>
            <FieldTip text="Enter the name of your release. Do not include any additional text here, like mix version, producer, release year etc." />
          </div>
          <input
            v-model="form.title"
            @blur="touched.title = true"
            type="text"
            maxlength="255"
            placeholder="Release title"
            :class="fieldClass(touched.title && !form.title.trim())"
          />
          <div class="flex items-center justify-between mt-1">
            <p v-if="touched.title && !form.title.trim()" class="text-xs text-error">Please enter a release title.</p>
            <span v-else></span>
            <p class="text-xs text-ditto-subtext">{{ form.title.length }} / 255</p>
          </div>
        </div>

        <!-- © holder / year -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-7">
          <div>
            <div class="flex items-center gap-1.5 mb-1.5">
              <label class="text-sm font-medium text-ditto-text">&copy; Copyright Holder</label>
              <span class="text-error text-xs">*</span>
              <FieldTip text="Enter the name of whoever controls the copyright of this release's lyrics and melodies." />
            </div>
            <input
              v-model="form.copyrightHolder"
              @blur="touched.copyrightHolder = true"
              type="text"
              maxlength="255"
              placeholder="Name"
              :class="fieldClass(touched.copyrightHolder && form.copyrightHolder.trim().length < 2)"
            />
            <p v-if="touched.copyrightHolder && !form.copyrightHolder" class="text-xs text-error mt-1">Please enter &copy; copyright holder.</p>
            <p v-else-if="touched.copyrightHolder && form.copyrightHolder.trim().length < 2" class="text-xs text-error mt-1">Name must be at least 2 characters.</p>
          </div>
          <div>
            <div class="flex items-center gap-1.5 mb-1.5">
              <label class="text-sm font-medium text-ditto-text">Copyright Year</label>
              <FieldTip text="The year this release was copyrighted." />
            </div>
            <select v-model.number="form.copyrightYear" :class="fieldClass(false)">
              <option v-for="y in copyrightYears" :key="y" :value="y">{{ y }}</option>
            </select>
          </div>
        </div>

        <!-- ℗ holder / production year -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-7">
          <div>
            <div class="flex items-center gap-1.5 mb-1.5">
              <label class="text-sm font-medium text-ditto-text"><span class="text-[17px] leading-none align-[-1px]">&#8471;</span> Copyright Holder</label>
              <span class="text-error text-xs">*</span>
              <FieldTip text="Enter the name of whoever controls the copyright of the sound recordings on this release." />
            </div>
            <input
              v-model="form.pCopyrightHolder"
              @blur="touched.pCopyrightHolder = true"
              type="text"
              maxlength="255"
              placeholder="Name"
              :class="fieldClass(touched.pCopyrightHolder && form.pCopyrightHolder.trim().length < 2)"
            />
            <p v-if="touched.pCopyrightHolder && !form.pCopyrightHolder" class="text-xs text-error mt-1">Please enter &#8471; Copyright Holder.</p>
            <p v-else-if="touched.pCopyrightHolder && form.pCopyrightHolder.trim().length < 2" class="text-xs text-error mt-1">Name must be at least 2 characters.</p>
          </div>
          <div>
            <div class="flex items-center gap-1.5 mb-1.5">
              <label class="text-sm font-medium text-ditto-text">Production Year</label>
            </div>
            <select v-model.number="form.productionYear" :class="fieldClass(false)">
              <option v-for="y in copyrightYears" :key="y" :value="y">{{ y }}</option>
            </select>
          </div>
        </div>

        <!-- Record label -->
        <div>
          <div class="flex items-center gap-1.5 mb-1.5">
            <label class="text-sm font-medium text-ditto-text">Record Label</label>
            <FieldTip text="If you are releasing with a record label, add the label name here. If you are not releasing with a label, please select 'Independent'." />
          </div>
          <div class="flex items-end gap-4">
            <SearchableSelect
              class="flex-1 min-w-0"
              :model-value="form.recordLabel"
              :options="labelOptions"
              :searchable="false"
              @update:model-value="form.recordLabel = $event"
            />
            <button
              type="button"
              class="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 rounded-full text-ditto-text hover:border-ditto-purple hover:text-ditto-purple transition-colors flex-shrink-0"
            >
              <span class="w-4 h-4 rounded-full bg-ditto-text flex items-center justify-center">
                <svg class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </span>
              Add New Label
            </button>
          </div>
        </div>

        <!-- Genres -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-7">
          <div>
            <div class="flex items-center gap-1.5 mb-1.5">
              <label class="text-sm font-medium text-ditto-text">Primary Genre</label>
              <span class="text-error text-xs">*</span>
            </div>
            <SearchableSelect
              :model-value="form.primaryGenre"
              :options="primaryGenres"
              placeholder="Select a genre"
              @update:model-value="form.primaryGenre = $event; touched.primaryGenre = true"
            />
            <p v-if="touched.primaryGenre && !form.primaryGenre" class="text-xs text-error mt-1">Please select a primary genre.</p>
          </div>
          <div>
            <div class="flex items-center gap-1.5 mb-1.5">
              <label class="text-sm font-medium text-ditto-text">Secondary Genre</label>
            </div>
            <SearchableSelect
              :model-value="form.secondaryGenre"
              :options="primaryGenres"
              placeholder="Optional"
              @update:model-value="form.secondaryGenre = $event"
            />
          </div>
        </div>

        <!-- Language -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-7">
          <div>
            <div class="flex items-center gap-1.5 mb-1.5">
              <label class="text-sm font-medium text-ditto-text">Language</label>
              <FieldTip text="The main language used in this release's metadata." />
            </div>
            <select v-model="form.language" :class="fieldClass(false)">
              <option v-for="l in releaseLanguages" :key="l" :value="l">{{ l }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Artist type -->
      <div class="mt-8">
        <p class="text-sm font-medium text-ditto-text mb-3">Artist Type</p>
        <div class="flex items-center gap-6">
          <label v-for="opt in artistTypeOptions" :key="opt.id" class="flex items-center gap-2.5 cursor-pointer">
            <span :class="['w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors', form.artistType === opt.id ? 'border-ditto-purple bg-ditto-purple' : 'border-gray-300']">
              <svg v-if="form.artistType === opt.id" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <input type="radio" :value="opt.id" v-model="form.artistType" class="sr-only" />
            <span class="text-sm font-semibold text-ditto-text">{{ opt.label }}</span>
          </label>
        </div>
      </div>

      <!-- Artists (shared with the video builder — same modal and chips) -->
      <div class="mt-12 border-t border-gray-200 pt-10">
        <VideoArtistsStep :artists="artistsSlice" context="music" @update:artists="applyArtists" />
        <p v-if="visited && form.primaryArtists.length === 0" class="text-xs text-error mt-2">Please select at least one Plan Artist.</p>
      </div>

      <!-- Tracklist -->
      <div class="mt-12 border-t border-gray-200 pt-10">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-baseline gap-3">
            <h2 class="font-satoshi font-black text-xl lg:text-2xl tracking-[-0.03em] text-ditto-text">Tracklist</h2>
            <span class="text-sm text-ditto-subtext">{{ form.tracks.length }} {{ form.tracks.length === 1 ? 'Track' : 'Tracks' }} · {{ totalDuration }}</span>
          </div>
          <button class="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 rounded-full text-ditto-text hover:border-ditto-purple hover:text-ditto-purple transition-colors">
            <span class="w-4 h-4 rounded-full bg-ditto-text flex items-center justify-center">
              <svg class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </span>
            Add Tracks
          </button>
        </div>

        <div class="space-y-3">
          <div
            v-for="(track, i) in form.tracks"
            :key="track.id"
            :class="[
              'border rounded-2xl overflow-hidden transition-colors',
              track.metadataTouched && !trackComplete(track) ? 'border-error' : 'border-gray-200'
            ]"
          >
            <div class="flex items-center gap-5 px-5 py-4">
              <svg class="w-4 h-4 text-gray-300 flex-shrink-0 cursor-grab" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/></svg>
              <span class="text-sm text-ditto-subtext w-4 text-center flex-shrink-0">{{ i + 1 }}</span>
              <button class="w-8 h-8 rounded-full bg-ditto-light-grey flex items-center justify-center flex-shrink-0 hover:bg-ditto-purple/10 transition-colors">
                <svg class="w-3.5 h-3.5 text-ditto-purple ml-0.5" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21"/></svg>
              </button>
              <div class="min-w-0 flex-1">
                <p :class="['text-sm font-semibold truncate', track.metadataTouched && !trackComplete(track) ? 'text-error' : 'text-ditto-text']">{{ track.title }}<span v-if="track.version" class="font-normal text-ditto-subtext"> ({{ track.version }})</span></p>
                <p class="text-xs text-ditto-subtext">{{ track.duration }}</p>
              </div>
              <span v-if="trackComplete(track)" class="inline-flex items-center gap-1.5 text-xs font-medium text-[#006633] flex-shrink-0">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Complete
              </span>
              <button
                @click="editingTrack = editingTrack === track.id ? null : track.id"
                class="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-full border border-gray-200 text-ditto-text hover:border-ditto-purple hover:text-ditto-purple transition-colors flex-shrink-0"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>
                {{ editingTrack === track.id ? 'Close Metadata' : 'Edit Metadata' }}
              </button>
              <button @click="removeTrack(track.id)" class="w-8 h-8 flex items-center justify-center text-error/70 hover:text-error transition-colors flex-shrink-0" aria-label="Remove track">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
              <span v-if="track.metadataTouched && !trackComplete(track)" class="w-5 h-5 rounded-full bg-error text-white flex items-center justify-center flex-shrink-0" aria-label="Metadata incomplete">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              </span>
            </div>
            <!-- Full track metadata panel -->
            <TrackMetadataPanel v-if="editingTrack === track.id" :track="track" @close="editingTrack = null" />
          </div>
        </div>
      </div>
    </div>

    <!-- ── Preview column ── -->
    <aside class="lg:sticky lg:top-32 border border-gray-200 rounded-2xl p-5 bg-ditto-light-grey/40">
      <p class="text-sm font-semibold text-ditto-text mb-4">Your Preview:</p>
      <div class="rounded-xl overflow-hidden bg-gray-200 aspect-square mb-4">
        <img v-if="form.artwork" :src="form.artwork" alt="" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center">
          <svg class="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </div>
      </div>
      <p class="font-satoshi font-black text-lg tracking-[-0.02em] text-ditto-text truncate">{{ form.title || 'Untitled' }}</p>
      <p class="text-sm text-ditto-subtext truncate mt-0.5">
        <template v-if="form.primaryArtists.length">{{ form.primaryArtists.map(a => a.name).join(', ') }}</template>
        <span v-else class="inline-block w-24 h-3 rounded bg-gray-200 align-middle"></span>
      </p>
      <p class="text-xs text-ditto-subtext mt-2">
        {{ releaseType }} · {{ form.tracks.length }} {{ form.tracks.length === 1 ? 'Song' : 'Songs' }}, {{ totalDurationLong }}
      </p>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, defineComponent, h, onMounted, watch } from 'vue'
import { primaryGenres, releaseLanguages, copyrightYears, isTrackMetadataComplete, computeReleaseType } from '../../../../data/releaseBuilderMockData'
import type { BuilderTrack } from '../../../../data/releaseBuilderMockData'
import type { ReleaseBuilderForm } from '../ReleaseBuilderView.vue'
import VideoArtistsStep from '../../../videos/steps/VideoArtistsStep.vue'
import SearchableSelect from '../../../videos/steps/SearchableSelect.vue'
import TrackMetadataPanel from './TrackMetadataPanel.vue'

const props = defineProps<{
  form: ReleaseBuilderForm
  visited: boolean
}>()

// Canonical builder field: underline input matching the video builder
const fieldClass = (hasError: boolean) =>
  [
    'w-full px-0 py-2.5 border-0 border-b text-sm text-ditto-text bg-transparent focus:outline-none transition-colors',
    hasError ? 'border-error focus:border-error' : 'border-gray-300 focus:border-ditto-purple',
  ].join(' ')

// Hover tooltip identical to the video builder's info bubbles
const FieldTip = defineComponent({
  props: { text: { type: String, required: true } },
  setup(p) {
    return () => h('div', { class: 'relative group' }, [
      h('svg', {
        class: 'w-3.5 h-3.5 text-ditto-subtext cursor-help',
        viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2',
        innerHTML: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
      }),
      h('div', {
        class: 'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-ditto-text text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10',
      }, p.text),
    ])
  },
})

const touched = reactive({
  title: false,
  copyrightHolder: false,
  pCopyrightHolder: false,
  primaryGenre: false,
})

const labelOptions = ['Independent', 'Goldenboy Entertainment']

const artistTypeOptions = [
  { id: 'artist', label: 'Artist/Band' },
  { id: 'compilation', label: 'Compilation/Various Artists' },
] as const

// Bridge the shared artists step onto the release form
const artistsSlice = computed(() => ({
  primary: props.form.primaryArtists,
  featured: props.form.featuredArtists,
  remixer: props.form.remixerArtists,
  showFeatured: props.form.showFeatured,
  showRemixer: props.form.showRemixer,
}))

const applyArtists = (artists: typeof artistsSlice.value) => {
  props.form.primaryArtists = artists.primary
  props.form.featuredArtists = artists.featured
  props.form.remixerArtists = artists.remixer
  props.form.showFeatured = artists.showFeatured
  props.form.showRemixer = artists.showRemixer
}

const editingTrack = ref<string | null>(null)
const trackComplete = (t: BuilderTrack) => isTrackMetadataComplete(t)

// Credits are mandatory, so the first incomplete track opens ready to fill in.
onMounted(() => {
  const firstIncomplete = props.form.tracks.find(t => !isTrackMetadataComplete(t))
  if (firstIncomplete) editingTrack.value = firstIncomplete.id
})

// Release-level artists cascade down as each track's default line-up.
// A track stops inheriting once its artists are edited directly.
watch(
  () => [props.form.primaryArtists, props.form.featuredArtists, props.form.remixerArtists, props.form.showFeatured, props.form.showRemixer, props.form.tracks.length],
  () => {
    for (const track of props.form.tracks) {
      if (track.artistsCustomized) continue
      track.artists.primary = props.form.primaryArtists.map(a => ({ ...a }))
      track.artists.featured = props.form.featuredArtists.map(a => ({ ...a }))
      track.artists.remixer = props.form.remixerArtists.map(a => ({ ...a }))
      track.artists.showFeatured = props.form.showFeatured
      track.artists.showRemixer = props.form.showRemixer
    }
  },
  { deep: true, immediate: true }
)

const removeTrack = (id: string) => {
  const idx = props.form.tracks.findIndex(t => t.id === id)
  if (idx >= 0) props.form.tracks.splice(idx, 1)
}

const totalSeconds = computed(() => props.form.tracks.reduce((s, t) => s + t.durationSec, 0))
const totalDuration = computed(() => {
  const m = Math.floor(totalSeconds.value / 60)
  const s = totalSeconds.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})
const totalDurationLong = computed(() => {
  const m = Math.floor(totalSeconds.value / 60)
  const s = totalSeconds.value % 60
  return `${m} min ${s} sec`
})

const releaseType = computed(() => computeReleaseType(props.form.tracks))
</script>
