<template>
  <!-- Stage 5 (BA-172). Structure and classes mirror the music builder's
       ReviewMusicReleaseStep: error banner, hero card, schedule tiles, details
       grid, section cards and the summary rail with Complete Release. -->
  <div>
    <!-- Error banner: names every stage with validation errors -->
    <div v-if="errorStages.length" class="rounded-xl border border-[#f5c451]/70 bg-[#fdf1cc] text-ditto-text text-sm font-semibold text-center px-6 py-3.5 mb-8">
      There are errors on {{ errorStagesLabel }} of the release builder.
      <button class="underline underline-offset-2 hover:opacity-80" @click="$emit('goToStep', errorStages[0])">Repair</button> to complete your release.
    </div>

    <div class="mb-8">
      <h1 class="font-satoshi font-black text-2xl lg:text-[32px] tracking-[-0.03em] text-ditto-text">Review Your Release</h1>
      <p class="text-sm text-ditto-subtext mt-1.5">Check everything over before it goes to stores. You can still edit any stage.</p>
    </div>

    <div class="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6 lg:gap-8 items-start">
      <!-- ── Main column ── -->
      <div class="space-y-6 min-w-0">

        <!-- Release hero: thumbnail, identity, schedule and details -->
        <section class="rounded-2xl border border-gray-200 p-6 lg:p-7">
          <div class="flex flex-col sm:flex-row gap-6 lg:gap-8">
            <div class="flex-shrink-0 w-full sm:w-[240px] lg:w-[260px]">
              <div class="rounded-xl overflow-hidden bg-gray-100 aspect-video shadow-[0_10px_28px_rgba(16,31,60,0.14)]">
                <img v-if="thumbnailUrl" :src="thumbnailUrl" alt="Video thumbnail" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex flex-col items-center justify-center gap-2 text-ditto-subtext">
                  <svg class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span class="text-xs font-medium">No thumbnail uploaded</span>
                </div>
              </div>
            </div>

            <div class="flex-1 min-w-0 flex flex-col justify-center">
              <h2 :class="['font-satoshi font-black text-2xl lg:text-[28px] tracking-[-0.03em] leading-tight flex items-center gap-2', formData.metadata.title ? 'text-ditto-text' : 'text-ditto-subtext']">
                {{ formData.metadata.title || '[Untitled]' }}
                <WarnDot v-if="!formData.metadata.title" tip="Video title not set" />
              </h2>
              <p :class="['mt-1 text-sm font-medium flex items-center gap-1.5', artistNames ? 'text-ditto-purple' : 'text-ditto-subtext']">
                {{ artistNames || '[Untitled]' }}
                <WarnDot v-if="!artistNames" tip="Video artists not set" />
              </p>
            </div>
          </div>

          <!-- Release schedule -->
          <div class="mt-6 grid sm:grid-cols-3 gap-3">
            <div class="rounded-xl px-4 py-3 bg-ditto-light-grey">
              <p class="text-[11px] font-semibold uppercase tracking-wide text-ditto-subtext mb-1">Release date</p>
              <p v-if="formData.schedule.releaseDate" class="text-sm font-bold text-ditto-text">{{ longDate(formData.schedule.releaseDate) }}</p>
              <p v-else class="text-sm text-ditto-subtext flex items-center gap-1.5">Not set <WarnDot tip="Date not set" /></p>
            </div>
            <div class="rounded-xl px-4 py-3 bg-ditto-light-grey">
              <p class="text-[11px] font-semibold uppercase tracking-wide text-ditto-subtext mb-1">Original release date</p>
              <p :class="['text-sm', originalDateLabel === 'N/A' ? 'text-ditto-subtext' : 'font-bold text-ditto-text']">{{ originalDateLabel }}</p>
            </div>
            <div class="rounded-xl px-4 py-3 bg-ditto-light-grey">
              <p class="text-[11px] font-semibold uppercase tracking-wide text-ditto-subtext mb-1">Timed release</p>
              <p :class="['text-sm', formData.schedule.timedRelease ? 'font-bold text-ditto-text' : 'text-ditto-subtext']">{{ formData.schedule.timedRelease ? formatReleaseTime(formData.schedule.releaseTime) : 'N/A' }}</p>
            </div>
          </div>

          <!-- Release details -->
          <dl class="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
            <div v-for="item in metaItems" :key="item.label" class="min-w-0">
              <dt class="text-[11px] font-semibold uppercase tracking-wide text-ditto-subtext">{{ item.label }}</dt>
              <dd class="mt-0.5 text-sm font-medium text-ditto-text flex items-center gap-1.5 min-w-0">
                <span v-if="item.value" class="truncate" :title="item.value">{{ item.value }}</span>
                <span v-else-if="!item.tip" class="text-ditto-subtext font-normal">N/A</span>
                <template v-if="item.tip">
                  <span v-if="!item.value" class="text-ditto-subtext font-normal">Not set</span>
                  <WarnDot :tip="item.tip" />
                </template>
              </dd>
            </div>
          </dl>
        </section>

        <!-- Stores -->
        <section class="rounded-2xl border border-gray-200 p-6">
          <div class="flex items-baseline gap-3 mb-4">
            <h3 class="font-satoshi font-black text-lg tracking-[-0.02em] text-ditto-text">Stores</h3>
            <span class="text-sm text-ditto-subtext">{{ formData.stores.selected.length }} selected</span>
            <WarnDot v-if="!formData.stores.selected.length" tip="No stores selected" />
          </div>
          <div v-if="formData.stores.selected.length" class="flex items-center flex-wrap gap-2">
            <span
              v-for="storeId in formData.stores.selected"
              :key="storeId"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-ditto-light-grey text-ditto-text"
            >
              <img :src="getStoreLogo(storeId)" :alt="getStoreName(storeId)" class="w-4 h-4 object-contain" />
              {{ getStoreName(storeId) }}
            </span>
          </div>
          <p v-else class="text-sm text-[#92400e]">No stores selected</p>

          <!-- Linked release: shown when Spotify is selected -->
          <div v-if="formData.stores.selected.includes('spotify')" class="mt-5 pt-5 border-t border-gray-100">
            <p class="text-[11px] font-semibold uppercase tracking-wide text-ditto-subtext mb-2">Linked release</p>
            <div v-if="linkedSpotifyRelease" class="flex items-center gap-3">
              <img :src="linkedSpotifyRelease.artwork" :alt="linkedSpotifyRelease.title" class="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              <div class="min-w-0">
                <p class="text-xs text-ditto-subtext">Linked on Spotify to:</p>
                <p class="text-sm font-semibold text-ditto-text truncate">{{ linkedSpotifyRelease.title }} - {{ linkedSpotifyTrackTitle }}</p>
                <p class="text-xs text-ditto-purple truncate">{{ linkedSpotifyRelease.artist }}</p>
              </div>
            </div>
            <p v-else class="text-sm text-[#92400e] flex items-center gap-1.5">Music release is not linked for Spotify <WarnDot tip="Music release is not linked for Spotify" /></p>
          </div>

          <!-- VEVO channel: shown when VEVO is selected -->
          <div v-if="formData.stores.selected.includes('vevo')" class="mt-5 pt-5 border-t border-gray-100">
            <p class="text-[11px] font-semibold uppercase tracking-wide text-ditto-subtext mb-2">VEVO channel</p>
            <div v-if="vevoChannel" class="flex items-center gap-3">
              <span class="w-12 h-12 rounded-lg bg-ditto-light-grey flex items-center justify-center flex-shrink-0">
                <img src="/img/vevo-icon.svg" alt="" class="w-6 h-6 object-contain" />
              </span>
              <p class="text-sm font-semibold text-ditto-text truncate">{{ vevoChannel.name }}</p>
              <StatusPill :variant="vevoChannel.status === 'Live' ? 'success' : vevoChannel.status === 'Rejected' ? 'danger' : 'warning'" :label="vevoStatusLabel[vevoChannel.status]" />
            </div>
            <p v-else class="text-sm text-[#92400e] flex items-center gap-1.5">VEVO channel not set <WarnDot tip="VEVO channel not set" /></p>
          </div>
        </section>
      </div>

      <!-- ── Summary rail ── -->
      <aside class="lg:sticky lg:top-24 rounded-2xl border border-gray-200 p-6">
        <h3 class="font-satoshi font-black text-lg tracking-[-0.02em] text-ditto-text">Summary</h3>
        <p class="text-xs text-ditto-subtext mt-0.5">{{ videoTypeLabel }} · {{ formData.stores.selected.length }} {{ formData.stores.selected.length === 1 ? 'store' : 'stores' }}</p>

        <ul class="mt-5 -mx-2 space-y-0.5">
          <li v-for="stage in stages" :key="stage.index">
            <button class="w-full flex items-center justify-between gap-3 px-2 py-2 rounded-lg hover:bg-ditto-light-grey text-left transition-colors group" @click="$emit('goToStep', stage.index)">
              <span class="flex items-center gap-2.5 text-sm">
                <span v-if="stage.error" class="w-5 h-5 rounded-full bg-warning text-white flex items-center justify-center flex-shrink-0">
                  <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                </span>
                <span v-else class="w-5 h-5 rounded-full bg-[#e6fbf1] text-[#0f8a4f] flex items-center justify-center flex-shrink-0">
                  <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <span :class="stage.error ? 'font-semibold text-ditto-text' : 'text-ditto-text'">{{ stage.label }}</span>
              </span>
              <span :class="['text-xs', stage.error ? 'font-semibold text-[#92400e]' : 'text-ditto-subtext opacity-0 group-hover:opacity-100 transition-opacity']">{{ stage.error ? 'Needs attention' : 'Edit' }}</span>
            </button>
          </li>
        </ul>

        <button
          @click="$emit('complete')"
          :disabled="hasErrors"
          :class="[
            'mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-full transition-all',
            hasErrors ? 'bg-[#aaaacc]/40 text-white cursor-not-allowed' : 'bg-ditto-purple btn-pop-purple text-white hover:opacity-95'
          ]"
        >
          <svg v-if="hasErrors" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Complete Release
        </button>
        <p class="text-[11px] text-ditto-subtext text-center mt-3 leading-relaxed">
          {{ hasErrors ? 'Fix the stages marked above to complete your release.' : 'Completing adds this release to your basket.' }}
        </p>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onUnmounted, watch, ref } from 'vue'
import { videoStores, spotifyMusicReleases, existingVevoChannels, vevoStatusLabel } from '../../../data/videoMockData'
import type { VevoChannel } from '../../../data/videoMockData'
import StatusPill from '../../../components/common/StatusPill.vue'

interface FormData {
  videoFile: File | null
  thumbnailFile: File | null
  artworkFile: File | null
  contentChecks: Record<string, boolean>
  assetSource: {
    type: '' | 'original' | 'licensed'
    ownershipConfirmed: boolean
    licenseHolder: string
    licenseValidUntil: string
    licenseTerritory: 'global' | 'selected'
    licenseDocuments: File[]
    licenseConfirmed: boolean
  }
  metadata: {
    title: string
    copyrightHolder: string
    copyrightYear: number
    pCopyrightHolder: string
    productionYear: number
    recordLabel: string
    primaryGenre: string
    secondaryGenre: string
    language: string
    isrc: string
    isLyricVideo: boolean
    isExplicit: boolean
    is18Plus: boolean
    videoType: 'official' | 'live'
    description: string
    aiTransparency: boolean
  }
  artists: {
    primary: { id: string; name: string; initials: string }[]
    featured: { id: string; name: string; initials: string }[]
    remixer: { id: string; name: string; initials: string }[]
    showFeatured: boolean
    showRemixer: boolean
  }
  credits: { id: string; category: string; name: string; role: string }[]
  schedule: {
    releaseDate: Date | null
    timedRelease: boolean
    releaseTime: { hour: string; minute: string; zone: string }
    countryRestrictions: boolean
    restrictedCountries: string[]
    hasOriginalDate: boolean
    originalReleaseDate: Date | null
  }
  stores: {
    selected: string[]
    vevoHasChannel: boolean | null
    vevoChannelName: string
    vevoBiography: string
    vevoArtistImage: File | null
    vevoBanner: File | null
    priceBand: 'budget' | 'mid' | 'premium'
    spotifyReleaseId: string | null
    spotifyTrackId: string | null
  }
}

const props = defineProps<{
  formData: FormData
  stepErrors: boolean[]
}>()

defineEmits<{
  (e: 'goToStep', index: number): void
  (e: 'complete'): void
}>()

// Same warning dot as the music builder's Review (hover shows the reason)
const WarnDot = defineComponent({
  props: { tip: { type: String, default: 'Missing' } },
  setup(p) {
    return () => h('span', { class: 'inline-flex w-4 h-4 rounded-full bg-warning text-white items-center justify-center flex-shrink-0 cursor-help', title: p.tip, 'aria-label': p.tip }, [
      h('svg', { class: 'w-2.5 h-2.5', viewBox: '0 0 24 24', fill: 'currentColor', innerHTML: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>' }),
    ])
  },
})

// Stages 1-4 with validation errors (mirrors the step bar)
const errorStages = computed(() =>
  props.stepErrors.map((err, i) => (err && i < 4 ? i : -1)).filter(i => i !== -1)
)
const hasErrors = computed(() => errorStages.value.length > 0)

// "Stage 2" / "Stage 1, 2, 3 and 4" (wording per BA-172)
const errorStagesLabel = computed(() => {
  const nums = errorStages.value.map(i => i + 1)
  if (nums.length === 1) return `Stage ${nums[0]}`
  return `Stage ${nums.slice(0, -1).join(', ')} and ${nums[nums.length - 1]}`
})

const stageLabels = ['Upload', 'Details', 'Stores', 'Schedule']
const stages = computed(() => stageLabels.map((label, index) => ({ label, index, error: !!props.stepErrors[index] })))

// Thumbnail preview from the uploaded file
const thumbnailUrl = ref('')
watch(() => props.formData.thumbnailFile, (file) => {
  if (thumbnailUrl.value) URL.revokeObjectURL(thumbnailUrl.value)
  thumbnailUrl.value = file ? URL.createObjectURL(file) : ''
}, { immediate: true })
onUnmounted(() => { if (thumbnailUrl.value) URL.revokeObjectURL(thumbnailUrl.value) })

const videoTypeLabel = computed(() => props.formData.metadata.videoType === 'live' ? 'Live Performance' : 'Official Video')

const longDate = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
const originalDateLabel = computed(() =>
  props.formData.schedule.hasOriginalDate && props.formData.schedule.originalReleaseDate
    ? formatDate(props.formData.schedule.originalReleaseDate)
    : 'N/A'
)

// Source: label, or the reason it is incomplete
const sourceItem = computed(() => {
  const src = props.formData.assetSource
  if (!src.type) return { value: '', tip: 'Video source not selected' }
  if (src.type === 'licensed' && !src.licenseDocuments.length) return { value: 'Licensed', tip: 'License document not uploaded' }
  return { value: src.type === 'licensed' ? 'Licensed' : 'Original', tip: '' }
})

// Details grid. `tip` set = show the warning dot; no value and no tip = N/A
const metaItems = computed(() => {
  const m = props.formData.metadata
  const band = props.formData.stores.priceBand
  return [
    { label: 'Video Type', value: videoTypeLabel.value, tip: '' },
    { label: 'Primary Genre', value: m.primaryGenre, tip: m.primaryGenre ? '' : 'Primary Genre not set' },
    { label: 'Secondary Genre', value: m.secondaryGenre, tip: '' },
    { label: 'Language', value: m.language, tip: '' },
    { label: '© Copyright Holder', value: m.copyrightHolder ? `${m.copyrightYear} ${m.copyrightHolder}` : '', tip: m.copyrightHolder ? '' : '© Copyright Holder not set' },
    { label: '℗ Copyright Holder', value: m.pCopyrightHolder ? `${m.productionYear} ${m.pCopyrightHolder}` : '', tip: m.pCopyrightHolder ? '' : '℗ Copyright Holder not set' },
    { label: 'Price Band', value: band.charAt(0).toUpperCase() + band.slice(1), tip: '' },
    { label: 'Label', value: m.recordLabel, tip: '' },
    { label: 'Source', value: sourceItem.value.value, tip: sourceItem.value.tip },
  ]
})

// VEVO channel: name plus status. An existing Ditto channel carries its own
// status. A new one, or one from outside Ditto, still has to be set up in
// Ditto, so both start as Pending set-up.
const vevoChannel = computed<{ name: string; status: VevoChannel['status'] } | null>(() => {
  const st = props.formData.stores
  const name = st.vevoChannelName.trim()
  if (st.vevoHasChannel === null || !name) return null
  if (st.vevoHasChannel === false) return { name: name.replace(/vevo$/i, '') + 'VEVO', status: 'Pending' }
  const known = existingVevoChannels.find(c => c.name === name)
  return { name, status: known ? known.status : 'Pending' }
})

const artistNames = computed(() => {
  const all = [
    ...props.formData.artists.primary.map(a => a.name),
    ...props.formData.artists.featured.map(a => a.name),
  ]
  return all.join(', ')
})

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const formatReleaseTime = (t: { hour: string; minute: string; zone: string }) => {
  if (!t.hour || !t.minute) return 'Time not set'
  return `${t.hour}:${t.minute}${t.zone ? ' ' + t.zone : ''}`
}

const getStoreName = (id: string) => {
  return videoStores.find(s => s.id === id)?.name || id
}

const getStoreLogo = (id: string) => {
  return videoStores.find(s => s.id === id)?.logo || ''
}

const linkedSpotifyRelease = computed(() => {
  if (!props.formData.stores.spotifyReleaseId) return null
  return spotifyMusicReleases.find(r => r.id === props.formData.stores.spotifyReleaseId) || null
})

const linkedSpotifyTrackTitle = computed(() => {
  if (!linkedSpotifyRelease.value || !props.formData.stores.spotifyTrackId) return ''
  return linkedSpotifyRelease.value.tracks.find(t => t.id === props.formData.stores.spotifyTrackId)?.title || ''
})
</script>
