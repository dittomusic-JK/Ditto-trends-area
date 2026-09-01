<template>
  <div class="min-h-screen bg-white">
      <!-- Step Navigation Bar -->
      <div class="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div class="px-4 sm:px-6 lg:px-16">
          <div class="flex items-center justify-between py-3">
            <button @click="$emit('back')" class="flex items-center gap-1.5 text-sm text-ditto-subtext hover:text-ditto-text transition-colors">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Back to Music
            </button>
            <p class="text-sm font-medium text-ditto-text truncate max-w-[200px] sm:max-w-none">{{ formData.title || 'Untitled Release' }}</p>
          </div>
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
                <span class="hidden sm:inline">{{ step.label }}</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Step Content -->
      <div class="px-4 sm:px-8 lg:px-16 py-10 lg:py-14 max-w-6xl mx-auto">
        <UploadMusicStep v-if="currentStep === 0" :form="formData" />
        <ArtworkStep v-else-if="currentStep === 1" :form="formData" />
        <ReleaseDetailsStep v-else-if="currentStep === 2" :form="formData" :visited="visitedSteps.has(2)" />
        <PlanMusicReleaseStep v-else-if="currentStep === 3" :form="formData" />
        <SelectMusicStoresStep v-else-if="currentStep === 4" :form="formData" />
        <ReviewMusicReleaseStep
          v-else-if="currentStep === 5"
          :form="formData"
          :step-errors="reviewStepErrors"
          @go-to-step="navigateToStep"
          @complete="handleComplete"
        />
      </div>

      <!-- Bottom Navigation -->
      <div class="sticky bottom-0 z-20 bg-white border-t border-gray-200 px-4 sm:px-6 lg:px-16 py-4">
        <div class="max-w-6xl mx-auto flex items-center justify-center gap-4">
          <button
            v-if="currentStep > 0"
            @click="handleBack"
            class="px-8 py-2.5 text-sm font-medium rounded-full border border-gray-200 text-ditto-text hover:bg-ditto-light-grey transition-colors"
          >Back</button>
          <button
            v-if="currentStep < 5"
            @click="handleNext"
            class="px-8 py-2.5 bg-ditto-purple btn-pop-purple text-white text-sm font-medium rounded-full hover:opacity-95 transition-opacity"
          >Next</button>
          <button
            v-if="currentStep === 5"
            @click="handleComplete"
            :disabled="hasAnyErrors"
            :class="[
              'px-8 py-2.5 text-sm font-medium rounded-full transition-all flex items-center gap-2',
              !hasAnyErrors
                ? 'bg-ditto-purple btn-pop-purple text-white hover:opacity-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            ]"
          >
            <svg v-if="hasAnyErrors" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Complete Release
          </button>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { isTrackMetadataComplete, computeReleaseType, chartRegions } from '../../../data/releaseBuilderMockData'
import type { BuilderTrack, ArtistEntry } from '../../../data/releaseBuilderMockData'
import { useBasketStore } from '../../../composables/useBasketStore'
import type { BasketItem, BasketService } from '../../../basketTypes'

import UploadMusicStep from './steps/UploadMusicStep.vue'
import ArtworkStep from './steps/ArtworkStep.vue'
import ReleaseDetailsStep from './steps/ReleaseDetailsStep.vue'
import PlanMusicReleaseStep from './steps/PlanMusicReleaseStep.vue'
import SelectMusicStoresStep from './steps/SelectMusicStoresStep.vue'
import ReviewMusicReleaseStep from './steps/ReviewMusicReleaseStep.vue'

const steps = [
  { id: 'upload', label: 'Upload' },
  { id: 'artwork', label: 'Artwork' },
  { id: 'details', label: 'Details' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'stores', label: 'Stores' },
  { id: 'review', label: 'Review' },
]

export interface ReleaseBuilderForm {
  // Upload
  tracks: BuilderTrack[]
  /** Spotify/Apple AI disclosure: '' until declared (per-track tags live on BuilderTrack.aiTags) */
  aiDisclosure: '' | 'none' | 'partial' | 'full'
  artwork: string | null
  artworkFileName: string
  artworkConfirmed: boolean
  // Details
  title: string
  copyrightHolder: string
  copyrightYear: number
  pCopyrightHolder: string
  productionYear: number
  recordLabel: string
  primaryGenre: string
  secondaryGenre: string
  language: string
  artistType: 'artist' | 'compilation'
  primaryArtists: ArtistEntry[]
  featuredArtists: ArtistEntry[]
  remixerArtists: ArtistEntry[]
  showFeatured: boolean
  showRemixer: boolean
  // Schedule
  releaseDate: Date | null
  distributionType: '' | 'priority' | 'standard'
  timedRelease: boolean
  releaseTime: { hour: string; minute: string; zone: string }
  countryRestrictions: boolean
  restrictedCountries: string[]
  releasedBefore: boolean
  originalReleaseDate: Date | null
  chartRegions: string[]
  preReleaseDownloads: boolean
  preReleaseDate: Date | null
  autoReleaseNewPlatforms: boolean
  releaseProtection: boolean
  // Stores
  selectedStores: string[]
  advancedStores: string[]
  /** Individually toggled AI / fingerprint platforms */
  advancedSubPlatforms: string[]
  beatportLabel: string
  beatportPrimaryGenre: string
  beatportSecondaryGenre: string
  priceBand: 'budget' | 'mid' | 'premium'
}

// Named in the "Create a New Music Release" modal before the wizard opens
const props = defineProps<{ initialTitle?: string }>()

const formData = reactive<ReleaseBuilderForm>({
  tracks: [],
  aiDisclosure: '',
  artwork: null,
  artworkFileName: '',
  artworkConfirmed: false,
  title: props.initialTitle ?? '',
  copyrightHolder: '',
  copyrightYear: 2026,
  pCopyrightHolder: '',
  productionYear: 2026,
  recordLabel: 'Independent',
  primaryGenre: '',
  secondaryGenre: '',
  language: 'English',
  artistType: 'artist',
  primaryArtists: [],
  featuredArtists: [],
  remixerArtists: [],
  showFeatured: false,
  showRemixer: false,
  releaseDate: null,
  distributionType: '',
  timedRelease: false,
  releaseTime: { hour: '', minute: '', zone: '' },
  countryRestrictions: false,
  restrictedCountries: [],
  releasedBefore: false,
  originalReleaseDate: null,
  chartRegions: [],
  preReleaseDownloads: false,
  preReleaseDate: null,
  autoReleaseNewPlatforms: false,
  releaseProtection: false,
  selectedStores: [],
  advancedStores: [],
  advancedSubPlatforms: [],
  beatportLabel: '',
  beatportPrimaryGenre: '',
  beatportSecondaryGenre: '',
  priceBand: 'mid',
})

const currentStep = ref(0)
const visitedSteps = reactive(new Set<number>([0]))

const validateStep = (stepIndex: number): boolean => {
  switch (stepIndex) {
    case 0:
      return formData.tracks.length > 0
    case 1:
      return formData.artwork !== null && formData.artworkConfirmed
    case 2:
      return formData.title.trim().length > 0 &&
        formData.copyrightHolder.trim().length >= 2 &&
        formData.pCopyrightHolder.trim().length >= 2 &&
        formData.primaryGenre.length > 0 &&
        formData.primaryArtists.length > 0 &&
        formData.tracks.every(isTrackMetadataComplete) &&
        // AI disclosure is declared in Details; tagging itself stays optional
        // (user's responsibility — supplementary data, not enforced)
        formData.aiDisclosure !== ''
    case 3:
      return formData.releaseDate !== null && formData.distributionType !== ''
    case 4:
      return formData.selectedStores.length > 0
    default:
      return true
  }
}

// A step shows an error once it's been visited and left incomplete.
const stepErrors = computed(() =>
  steps.map((_, i) => {
    if (i === currentStep.value) return false
    if (!visitedSteps.has(i)) return false
    return !validateStep(i)
  })
)

// The review step reports errors for every incomplete stage regardless of visits.
const reviewStepErrors = computed(() => steps.map((_, i) => !validateStep(i)))

const hasAnyErrors = computed(() => [0, 1, 2, 3, 4].some(i => !validateStep(i)))

const isStepComplete = (index: number): boolean => validateStep(index)

const getStepClasses = (index: number): string => {
  if (index === currentStep.value) return 'border-ditto-purple text-ditto-text'
  if (stepErrors.value[index]) return 'border-warning text-warning'
  if (visitedSteps.has(index) && isStepComplete(index)) return 'border-ditto-text text-ditto-text'
  return 'border-transparent text-ditto-subtext'
}

const getStepNumberClasses = (index: number): string => {
  if (index === currentStep.value) return 'text-ditto-purple'
  if (stepErrors.value[index]) return 'text-warning'
  if (visitedSteps.has(index) && isStepComplete(index)) return 'text-ditto-text'
  return 'text-ditto-subtext/60'
}

const navigateToStep = (index: number) => {
  // Per the navigation spec: validate the stage being left AND all previous
  // stages — so jumping ahead flags anything incomplete behind you.
  visitedSteps.add(currentStep.value)
  for (let i = 0; i < index; i++) visitedSteps.add(i)
  visitedSteps.add(index)
  currentStep.value = index
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleBack = () => {
  if (currentStep.value > 0) navigateToStep(currentStep.value - 1)
}

const handleNext = () => {
  if (currentStep.value < 4) navigateToStep(currentStep.value + 1)
}

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'navigate', section: string): void
}>()

// Per the Stage 5 spec, completing adds the release to the basket (in the
// paid-basket style: release header + its chargeable services) and lands the
// user on the basket page for checkout.
const { addRelease } = useBasketStore()

const ordinal = (n: number) => {
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`
  return `${n}${['th', 'st', 'nd', 'rd'][Math.min(n % 10, 4)] ?? 'th'}`
}
const basketDate = (d: Date) =>
  `${d.toLocaleDateString('en-GB', { month: 'long' })} ${ordinal(d.getDate())}, ${d.getFullYear()}`

const handleComplete = () => {
  if (hasAnyErrors.value) return

  const releaseId = 'rel-builder-1'
  const services: BasketService[] = []
  let svc = 0
  const pushService = (name: string, price: number, detail?: string) => {
    services.push({ id: `bsvc-${++svc}`, releaseId, name, price, quantity: 1, detail })
  }

  if (formData.distributionType === 'priority') pushService('Priority Distro', 40)
  for (const id of formData.chartRegions) {
    const region = chartRegions.find(r => r.id === id)
    if (region) pushService(`Charts Registration ${region.label}`, region.price)
  }
  if (formData.preReleaseDownloads) pushService('Pre-release Downloads', 40)
  if (formData.advancedStores.includes('beatport')) pushService('Beatport Label Setup', 65)

  const item: BasketItem = {
    release: {
      id: releaseId,
      title: formData.title || 'Untitled Release',
      releaseType: computeReleaseType(formData.tracks),
      releaseDate: formData.releaseDate ? basketDate(formData.releaseDate) : 'TBC',
      artwork: formData.artwork ?? undefined,
      isFree: true,
    },
    services,
  }

  addRelease(item)
  emit('navigate', 'basket')
}
</script>
