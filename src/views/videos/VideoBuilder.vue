<template>
  <div class="min-h-screen bg-white">
    <!-- Step Navigation Bar -->
    <div class="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div class="px-4 sm:px-6 lg:px-20">
        <!-- Top bar: back + title -->
        <div class="flex items-center justify-between py-3">
          <button @click="$emit('back')" class="flex items-center gap-1.5 text-sm text-ditto-subtext hover:text-ditto-text transition-colors">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Back to Videos
          </button>
          <p class="text-sm font-medium text-ditto-text truncate max-w-[200px] sm:max-w-none">{{ initialTitle || 'Untitled Video' }}</p>
        </div>
        <!-- Step tabs (Figma-matched flat style) -->
        <div class="flex items-stretch">
          <button
            v-for="(step, index) in steps"
            :key="step.id"
            @click="navigateToStep(index)"
            :class="[
              'flex-1 flex flex-col items-center gap-0.5 pb-3 pt-1 text-sm font-medium transition-all border-b-[3px] whitespace-nowrap',
              getStepClasses(index)
            ]"
          >
            <span class="flex items-center gap-1.5">
              <span :class="['text-lg font-bold leading-none', getStepNumberClasses(index)]">{{ index + 1 }}</span>
              <svg v-if="stepErrors[index]" class="w-3.5 h-3.5 text-warning -ml-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <span>{{ step.label }}</span>
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Step Content -->
    <div class="px-4 sm:px-6 lg:px-20 py-8 lg:py-10 max-w-5xl mx-auto">
      <!-- Step 1: Upload (video + thumbnail) -->
      <div v-if="currentStep === 0" class="space-y-10">
        <UploadVideoStep v-model:videoFile="formData.videoFile" />
        <div class="border-t border-gray-200"></div>
        <UploadThumbnailStep
          v-model:thumbnailFile="formData.thumbnailFile"
          :video-file="formData.videoFile"
        />
      </div>

      <!-- Step 2: Details (link release + metadata + artists + credits) -->
      <div v-else-if="currentStep === 1" class="space-y-10">
        <LinkReleasePicker
          :release-id="formData.stores.spotifyReleaseId"
          :track-id="formData.stores.spotifyTrackId"
          @update:release-id="formData.stores.spotifyReleaseId = $event"
          @update:track-id="formData.stores.spotifyTrackId = $event"
          @copy-metadata="handleCopyMetadata"
        />
        <div class="border-t border-gray-200"></div>
        <VideoMetadataStep v-model:metadata="formData.metadata" />
        <div class="border-t border-gray-200"></div>
        <VideoArtistsStep v-model:artists="formData.artists" />
        <div class="border-t border-gray-200"></div>
        <VideoCreditsStep v-model:credits="formData.credits" />
      </div>

      <!-- Step 3: Stores -->
      <SelectStoresStep
        v-else-if="currentStep === 2"
        v-model:stores="formData.stores"
        :is-lyric-video="formData.metadata.isLyricVideo"
      />

      <!-- Step 4: Schedule -->
      <PlanReleaseStep
        v-else-if="currentStep === 3"
        v-model:schedule="formData.schedule"
      />

      <!-- Step 5: Content Check -->
      <CheckContentStep
        v-else-if="currentStep === 4"
        v-model:checks="formData.contentChecks"
        v-model:assetSource="formData.assetSource"
        :is-lyric-video="formData.metadata.isLyricVideo"
      />

      <!-- Step 6: Review -->
      <ReviewStep
        v-else-if="currentStep === 5"
        :form-data="formData"
        :step-errors="stepErrors"
        @go-to-step="navigateToStep"
        @complete="handleComplete"
      />
    </div>

    <!-- Bottom Navigation -->
    <div class="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 lg:px-20 py-4">
      <div class="max-w-5xl mx-auto flex items-center justify-center gap-4">
        <button
          v-if="canGoBack"
          @click="handleBack"
          class="px-8 py-2.5 text-sm font-medium rounded-full border border-gray-200 text-ditto-text hover:bg-ditto-light-grey transition-colors"
        >Back</button>
        <button
          v-if="currentStep < 5"
          @click="handleNext"
          class="px-8 py-2.5 bg-ditto-purple text-white text-sm font-medium rounded-full hover:bg-ditto-purple/90 transition-colors"
        >Next</button>
        <button
          v-if="currentStep === 5"
          @click="handleComplete"
          :disabled="hasAnyErrors"
          :class="[
            'px-8 py-2.5 text-sm font-medium rounded-full transition-all',
            !hasAnyErrors
              ? 'bg-ditto-purple text-white hover:bg-ditto-purple/90'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          ]"
        >Complete Release</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { SpotifyTrack, CreditCategory } from '../../data/videoMockData'

import UploadVideoStep from './steps/UploadVideoStep.vue'
import UploadThumbnailStep from './steps/UploadThumbnailStep.vue'
import LinkReleasePicker from './steps/LinkReleasePicker.vue'
import CheckContentStep from './steps/CheckContentStep.vue'
import VideoMetadataStep from './steps/VideoMetadataStep.vue'
import VideoArtistsStep from './steps/VideoArtistsStep.vue'
import VideoCreditsStep from './steps/VideoCreditsStep.vue'
import PlanReleaseStep from './steps/PlanReleaseStep.vue'
import SelectStoresStep from './steps/SelectStoresStep.vue'
import ReviewStep from './steps/ReviewStep.vue'

const props = defineProps<{
  initialTitle: string
}>()

defineEmits<{
  (e: 'back'): void
}>()

const currentStep = ref(0)

const steps = [
  { id: 'upload', label: 'Upload' },
  { id: 'details', label: 'Details' },
  { id: 'stores', label: 'Stores' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'content', label: 'Content Check' },
  { id: 'review', label: 'Review' },
]

const currentYear = new Date().getFullYear()

const formData = reactive({
  videoFile: null as File | null,
  thumbnailFile: null as File | null,
  contentChecks: {
    video: false,
    thumbnail: false,
    noLyrics: false,
  },
  assetSource: {
    type: '' as '' | 'original' | 'licensed' | 'previously-distributed' | 'commissioned',
    // Original
    ownershipConfirmed: false,
    // Licensed
    licenseHolder: '',
    licenseType: '' as '' | 'exclusive' | 'non-exclusive',
    licenseValidUntil: '',
    licenseTerritory: 'global' as 'global' | 'selected',
    licenseReference: '',
    licenseConfirmed: false,
    // Previously Distributed
    previousDistributor: '',
    takedownConfirmed: false,
    // Commissioned
    commissionedBy: '',
    commissionAgreement: false,
  },
  metadata: {
    title: props.initialTitle || '',
    copyrightHolder: '',
    copyrightYear: currentYear,
    pCopyrightHolder: '',
    productionYear: currentYear,
    recordLabel: 'Independent',
    primaryGenre: '',
    secondaryGenre: '',
    language: 'English',
    isrc: '',
    artistType: 'artist' as 'artist' | 'compilation',
    isLyricVideo: false,
    isExplicit: false,
    is18Plus: false,
    videoType: 'official' as 'official' | 'live',
    description: '',
    aiTransparency: false,
  },
  artists: {
    primary: [] as { id: string; name: string; initials: string }[],
    featured: [] as { id: string; name: string; initials: string }[],
    remixer: [] as { id: string; name: string; initials: string }[],
    showFeatured: false,
    showRemixer: false,
  },
  credits: [
    { id: 'c1', category: 'composer', name: '', role: 'Composer' },
    { id: 'c2', category: 'songwriter', name: '', role: '' },
    { id: 'c3', category: 'production', name: '', role: '' },
    { id: 'c4', category: 'performer', name: '', role: '' },
  ] as { id: string; category: CreditCategory; name: string; role: string }[],
  schedule: {
    releaseDate: null as Date | null,
    distributionType: '' as '' | 'priority' | 'standard',
    timedRelease: false,
    releaseTime: '00:00',
    countryRestrictions: false,
    restrictedCountries: [] as string[],
    hasOriginalDate: false,
    originalReleaseDate: null as Date | null,
  },
  stores: {
    selected: [] as string[],
    vevoHasChannel: null as boolean | null,
    vevoChannelName: '',
    vevoArtistName: '',
    vevoBiography: '',
    vevoArtistImage: null as File | null,
    vevoBanner: null as File | null,
    priceBand: 'mid' as 'budget' | 'mid' | 'premium',
    spotifyReleaseId: null as string | null,
    spotifyTrackId: null as string | null,
  },
})

// Step validation
const validateStep = (stepIndex: number): boolean => {
  switch (stepIndex) {
    case 0:
      return formData.videoFile !== null &&
        formData.thumbnailFile !== null
    case 1:
      return formData.metadata.title.length > 0 &&
        formData.metadata.copyrightHolder.length >= 2 &&
        formData.metadata.pCopyrightHolder.length >= 2 &&
        formData.metadata.primaryGenre.length > 0 &&
        formData.artists.primary.length > 0 &&
        formData.credits.slice(0, 4).every(c => c.name.trim() !== '' && (c.category === 'composer' || c.role !== ''))
    case 2:
      return formData.stores.selected.length > 0
    case 3:
      return formData.schedule.releaseDate !== null &&
        formData.schedule.distributionType !== ''
    case 4:
      return formData.contentChecks.video &&
        formData.contentChecks.thumbnail &&
        (!formData.metadata.isLyricVideo || formData.contentChecks.noLyrics) &&
        formData.assetSource.type !== ''
    case 5:
      return !hasAnyErrors.value
    default:
      return false
  }
}

const stepErrors = computed(() => {
  return steps.map((_, i) => {
    if (i === currentStep.value) return false
    // Only show errors for steps that have been visited or are before current
    if (i >= currentStep.value) return false
    return !validateStep(i)
  })
})

const isStepComplete = (index: number): boolean => {
  return validateStep(index)
}

const hasAnyErrors = computed(() => {
  return [0, 1, 2, 3, 4].some(i => !validateStep(i))
})

const getStepClasses = (index: number): string => {
  if (index === currentStep.value) return 'border-ditto-purple text-ditto-text'
  if (stepErrors.value[index]) return 'border-warning text-warning'
  if (isStepComplete(index)) return 'border-ditto-purple text-ditto-text'
  return 'border-transparent text-ditto-subtext'
}

const getStepNumberClasses = (index: number): string => {
  if (index === currentStep.value) return 'text-ditto-purple'
  if (stepErrors.value[index]) return 'text-warning'
  if (isStepComplete(index)) return 'text-ditto-purple'
  return 'text-ditto-subtext/60'
}

const canGoBack = computed(() => currentStep.value > 0)

const navigateToStep = (index: number) => {
  currentStep.value = index
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleBack = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleNext = () => {
  if (currentStep.value < 5) {
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleCopyMetadata = (track: SpotifyTrack) => {
  // Copy metadata from selected Spotify track
  formData.metadata.copyrightHolder = track.copyrightHolder
  formData.metadata.copyrightYear = track.copyrightYear
  formData.metadata.pCopyrightHolder = track.pCopyrightHolder
  formData.metadata.productionYear = track.productionYear
  formData.metadata.primaryGenre = track.primaryGenre
  formData.metadata.secondaryGenre = track.secondaryGenre
  formData.metadata.language = track.language
  formData.metadata.recordLabel = track.recordLabel
  // ISRC intentionally NOT copied — the video needs its own unique code

  // Copy artists
  formData.artists.primary = track.primaryArtists.map(a => ({ ...a }))
  formData.artists.featured = track.featuredArtists.map(a => ({ ...a }))
  if (track.featuredArtists.length > 0) {
    formData.artists.showFeatured = true
  }

  // Copy track credits — these live on the release metadata too
  const c = track.credits
  formData.credits = [
    { id: 'c1', category: 'composer' as CreditCategory, name: c.composer, role: 'Composer' },
    { id: 'c2', category: 'songwriter' as CreditCategory, name: c.songwriter.name, role: c.songwriter.role },
    { id: 'c3', category: 'production' as CreditCategory, name: c.production.name, role: c.production.role },
    { id: 'c4', category: 'performer' as CreditCategory, name: c.performer.name, role: c.performer.role },
    ...(c.additional ?? []).map((a, i) => ({
      id: `c${5 + i}`, category: 'additional' as CreditCategory, name: a.name, role: a.role,
    })),
  ]
}

const handleComplete = () => {
  if (!hasAnyErrors.value) {
    alert('Video release submitted successfully! (prototype)')
  }
}
</script>
