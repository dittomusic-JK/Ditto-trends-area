<template>
  <div>
    <!-- Error banner: names every stage with validation errors -->
    <div v-if="errorStages.length" class="rounded-xl bg-warning/90 text-ditto-text text-sm font-semibold text-center px-6 py-3.5 mb-8">
      There are errors on {{ errorStagesLabel }} of the release builder.
      <button class="underline underline-offset-2 hover:opacity-80" @click="$emit('go-to-step', errorStages[0])">Repair</button> them to complete your release.
    </div>

    <div class="flex items-center justify-between gap-4 mb-8">
      <h1 class="font-satoshi font-black text-2xl lg:text-[32px] tracking-[-0.03em] text-ditto-text">Review Your Release</h1>
      <button
        @click="$emit('complete')"
        :disabled="hasErrors"
        :class="[
          'flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-full transition-all flex-shrink-0',
          hasErrors ? 'bg-[#aaaacc]/40 text-white cursor-not-allowed' : 'bg-ditto-purple btn-pop-purple text-white hover:opacity-95'
        ]"
      >
        <svg v-if="hasErrors" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Complete Release
      </button>
    </div>

    <div class="grid lg:grid-cols-[minmax(0,360px)_1fr] gap-8 items-start">
      <!-- Artwork card -->
      <div class="border border-gray-200 rounded-2xl p-5">
        <div class="rounded-xl overflow-hidden bg-gray-100 aspect-square">
          <img v-if="form.artwork" :src="form.artwork" alt="Release artwork" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex flex-col items-center justify-center gap-2 text-ditto-subtext">
            <svg class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span class="text-xs font-medium">No artwork uploaded</span>
          </div>
        </div>
        <!-- Artwork Issues panel: warns but never blocks completion -->
        <div v-if="artworkIssues.length" class="mt-4 rounded-xl border border-warning/40 bg-warning/10 p-4">
          <p class="flex items-center gap-2 text-sm font-bold text-ditto-text">
            <span class="w-5 h-5 rounded-full bg-warning text-white flex items-center justify-center flex-shrink-0">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            </span>
            {{ artworkIssues.length }} {{ artworkIssues.length === 1 ? 'Issue' : 'Issues' }} Detected
          </p>
          <p class="text-xs text-ditto-subtext mt-1.5">Your artwork may be rejected by some stores.</p>
          <ul class="mt-3 space-y-1.5">
            <li v-for="issue in artworkIssues" :key="issue" class="flex items-start gap-2 text-xs text-ditto-text">
              <span class="w-1 h-1 rounded-full bg-[#92400e] mt-1.5 flex-shrink-0"></span>
              {{ issue }}
            </li>
          </ul>
          <p class="text-[11px] text-ditto-subtext mt-3 leading-relaxed">You can still complete this release. However, we recommend fixing these issues to avoid rejection.</p>
        </div>
      </div>

      <!-- Details card -->
      <div class="border border-gray-200 rounded-2xl p-7 lg:p-8">
        <h2 class="font-satoshi font-black text-2xl tracking-[-0.03em] text-ditto-text">{{ displayTitle }}</h2>
        <p v-if="!form.title" class="text-sm font-medium text-ditto-purple mt-1 flex items-center gap-1.5">[Untitled] <WarnDot tip="Release title not set" /></p>

        <div class="grid sm:grid-cols-2 gap-x-10 gap-y-3 mt-6 text-sm">
          <p><span class="font-bold text-ditto-text">Release Type:</span> <span class="text-ditto-subtext">{{ releaseType }}</span></p>
          <p><span class="font-bold text-ditto-text">Price Band:</span> <span class="text-ditto-subtext capitalize">{{ form.priceBand }}</span></p>
          <p class="flex items-center gap-1.5"><span class="font-bold text-ditto-text">Primary Genre:</span> <span v-if="form.primaryGenre" class="text-ditto-subtext">{{ form.primaryGenre }}</span><WarnDot v-else tip="Primary Genre not set" /></p>
          <p class="flex items-center gap-1.5"><span class="font-bold text-ditto-text">Release Date:</span> <span v-if="form.releaseDate" class="text-ditto-subtext">{{ isoDate(form.releaseDate) }}</span><WarnDot v-else tip="Release Date not set" /></p>
          <p><span class="font-bold text-ditto-text">Secondary Genre:</span> <span class="text-ditto-subtext">{{ form.secondaryGenre || 'N/A' }}</span></p>
          <p><span class="font-bold text-ditto-text">Original Release Date:</span> <span class="text-ditto-subtext">{{ form.originalReleaseDate ? isoDate(form.originalReleaseDate) : 'N/A' }}</span></p>
          <p><span class="font-bold text-ditto-text">Language:</span> <span class="text-ditto-subtext">{{ form.language }}</span></p>
          <p><span class="font-bold text-ditto-text">Release Time:</span> <span class="text-ditto-subtext">{{ releaseTimeLabel }}</span></p>
          <p class="flex items-center gap-1.5"><span class="font-bold text-ditto-text">© Copyright Holder:</span> <span v-if="form.copyrightHolder" class="text-ditto-subtext">{{ form.copyrightHolder }}</span><WarnDot v-else tip="© Copyright Holder not set" /></p>
          <p><span class="font-bold text-ditto-text">Label:</span> <span class="text-ditto-subtext">{{ form.recordLabel }}</span></p>
          <p class="flex items-center gap-1.5"><span class="font-bold text-ditto-text">℗ Copyright Holder:</span> <span v-if="form.pCopyrightHolder" class="text-ditto-subtext">{{ form.pCopyrightHolder }}</span><WarnDot v-else tip="℗ Copyright Holder not set" /></p>
          <p><span class="font-bold text-ditto-text">Extras:</span> <span class="text-ditto-subtext">{{ extrasLabel }}</span></p>
          <p><span class="font-bold text-ditto-text">Various Artists:</span> <span class="text-ditto-subtext">{{ form.artistType === 'compilation' ? 'Yes' : 'No' }}</span></p>
          <p class="flex items-center gap-1.5"><span class="font-bold text-ditto-text">Artists:</span>
            <span v-if="form.primaryArtists.length" class="text-ditto-subtext">{{ form.primaryArtists.map(a => a.name).join(', ') }}</span>
            <WarnDot v-else tip="Release artists not set" />
          </p>
        </div>
      </div>
    </div>

    <!-- Tracklist card -->
    <div class="border border-gray-200 rounded-2xl p-7 lg:p-8 mt-8">
      <div class="flex items-baseline gap-3 mb-4">
        <h3 class="font-satoshi font-black text-lg tracking-[-0.02em] text-ditto-text">Tracklist</h3>
        <span class="text-sm text-ditto-subtext">{{ form.tracks.length }} {{ form.tracks.length === 1 ? 'Track' : 'Tracks' }} · {{ totalDuration }}</span>
      </div>
      <div v-if="form.tracks.length" class="space-y-1">
        <div v-for="(track, i) in form.tracks" :key="track.id" class="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-ditto-light-grey transition-colors">
          <span class="text-sm text-ditto-subtext w-4 text-center">{{ i + 1 }}</span>
          <p class="text-sm font-semibold text-ditto-text flex items-center gap-1.5 flex-1 min-w-0 truncate">
            {{ track.title }}
            <WarnDot v-if="!track.hasLicense && false" />
          </p>
          <span class="text-sm text-ditto-subtext">{{ track.duration }}</span>
        </div>
      </div>
      <p v-else class="text-sm text-ditto-subtext flex items-center gap-2">No uploaded tracks yet <WarnDot tip="Tracks not uploaded" /></p>
    </div>

    <!-- AI disclosure summary -->
    <div class="border border-gray-200 rounded-2xl p-7 lg:p-8 mt-8">
      <div class="flex items-baseline gap-3 mb-3">
        <h3 class="font-satoshi font-black text-lg tracking-[-0.02em] text-ditto-text">AI Disclosure</h3>
        <WarnDot v-if="!form.aiDisclosure" tip="AI disclosure not set" />
      </div>
      <div class="flex items-center flex-wrap gap-2">
        <span v-if="form.aiDisclosure === 'none'" class="text-sm text-ditto-text">No AI-generated content declared.</span>
        <span v-else-if="form.aiDisclosure === 'full'" class="px-3 py-1.5 text-xs font-semibold rounded-full bg-ditto-purple/10 text-ditto-purple">Entirely AI-generated</span>
        <template v-else-if="form.aiDisclosure === 'partial'">
          <span class="px-3 py-1.5 text-xs font-semibold rounded-full bg-ditto-purple/10 text-ditto-purple">Partially AI-generated</span>
          <span v-for="t in aiTaggedTracks" :key="'ait-' + t.id" class="px-3 py-1.5 text-xs font-medium rounded-full border border-gray-200 text-ditto-text">"{{ t.title }}"</span>
          <span v-for="a in aiTaggedArtists" :key="'aia-' + a.id" class="px-3 py-1.5 text-xs font-medium rounded-full border border-gray-200 text-ditto-text">{{ a.name }}</span>
          <WarnDot v-if="!aiTaggedTracks.length && !aiTaggedArtists.length" tip="No AI tracks or artists tagged" />
        </template>
        <span v-else class="text-sm text-ditto-subtext">Not declared yet.</span>
      </div>
    </div>

    <!-- Stores summary -->
    <div class="border border-gray-200 rounded-2xl p-7 lg:p-8 mt-8">
      <div class="flex items-baseline gap-3 mb-4">
        <h3 class="font-satoshi font-black text-lg tracking-[-0.02em] text-ditto-text">Stores</h3>
        <span class="text-sm text-ditto-subtext">{{ form.selectedStores.length }} selected</span>
      </div>
      <div class="flex items-center flex-wrap gap-2">
        <span
          v-for="store in selectedStoreDefs"
          :key="store.id"
          class="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center text-[10px] font-bold text-white bg-gray-100"
          :style="store.letter ? { backgroundColor: store.tileColor } : {}"
          :title="store.name"
        >
          <img v-if="store.icon" :src="store.icon" :alt="store.name" class="w-full h-full object-contain" />
          <template v-else>{{ store.letter }}</template>
        </span>
      </div>
    </div>

    <!-- Order summary -->
    <div v-if="orderLines.length" class="border border-gray-200 rounded-2xl p-7 lg:p-8 mt-8">
      <h3 class="font-satoshi font-black text-lg tracking-[-0.02em] text-ditto-text mb-4">Paid extras</h3>
      <div class="space-y-2 max-w-md">
        <div v-for="line in orderLines" :key="line.label" class="flex items-center justify-between text-sm">
          <span class="text-ditto-subtext">{{ line.label }}</span>
          <span class="font-bold text-ditto-text">£{{ line.price }}</span>
        </div>
        <div class="flex items-center justify-between text-sm border-t border-gray-200 pt-2 mt-2">
          <span class="font-bold text-ditto-text">Total</span>
          <span class="font-black text-ditto-purple">£{{ orderTotal }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue'
import { standardStores, chartRegions, computeReleaseType } from '../../../../data/releaseBuilderMockData'
import type { ReleaseBuilderForm } from '../ReleaseBuilderView.vue'

const props = defineProps<{
  form: ReleaseBuilderForm
  stepErrors: boolean[]
}>()

defineEmits<{
  (e: 'go-to-step', index: number): void
  (e: 'complete'): void
}>()

const WarnDot = defineComponent({
  props: { tip: { type: String, default: 'Missing' } },
  setup(p) {
    return () => h('span', { class: 'inline-flex w-4 h-4 rounded-full bg-warning text-white items-center justify-center flex-shrink-0 cursor-help', title: p.tip, 'aria-label': p.tip }, [
      h('svg', { class: 'w-2.5 h-2.5', viewBox: '0 0 24 24', fill: 'currentColor', innerHTML: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>' }),
    ])
  },
})

const errorStages = computed(() =>
  props.stepErrors.map((err, i) => (err && i < 5 ? i : -1)).filter(i => i !== -1)
)
const hasErrors = computed(() => errorStages.value.length > 0)

// "Stage 2" / "Stages 1, 2 and 3"
const errorStagesLabel = computed(() => {
  const nums = errorStages.value.map(i => i + 1)
  if (nums.length === 1) return `Stage ${nums[0]}`
  return `Stages ${nums.slice(0, -1).join(', ')} and ${nums[nums.length - 1]}`
})

const releaseType = computed(() => computeReleaseType(props.form.tracks))

// Single-track releases surface the mix version next to the title
const displayTitle = computed(() => {
  const base = props.form.title || 'Untitled Release'
  const mix = props.form.tracks.length === 1 ? props.form.tracks[0].version.trim() : ''
  return mix ? `${base} (${mix})` : base
})

// Mock artwork scan per the Stage 5 spec — warns but never blocks completion
const artworkIssues = computed(() =>
  props.form.artwork
    ? [
        'Your artwork contains web addresses or URLs.',
        'Your artwork features QR codes.',
      ]
    : []
)

const totalDuration = computed(() => {
  const total = props.form.tracks.reduce((s, t) => s + t.durationSec, 0)
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
})

const isoDate = (d: Date) => {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

const releaseTimeLabel = computed(() => {
  const t = props.form.releaseTime
  return props.form.timedRelease && t.hour && t.minute ? `${t.hour}:${t.minute} ${t.zone}` : 'N/A'
})

// Comma-separated list per the Stage 5 spec's exact extra names
const extrasLabel = computed(() => {
  const extras: string[] = []
  if (props.form.distributionType === 'priority') extras.push('Priority Distro')
  for (const id of props.form.chartRegions) {
    const region = chartRegions.find(r => r.id === id)
    if (region) extras.push(`Charts Registration ${region.label}`)
  }
  if (props.form.preReleaseDownloads) extras.push('Pre-release downloads')
  if (props.form.autoReleaseNewPlatforms) extras.push('Auto-release to new platforms')
  if (props.form.releaseProtection) extras.push('Release protection')
  if (props.form.advancedStores.includes('youtube-content-id')) extras.push('YouTube Content ID & Shorts')
  if (props.form.advancedStores.includes('beatport')) extras.push('Beatport label')
  return extras.length ? extras.join(', ') : 'N/A'
})

const aiTaggedTracks = computed(() => props.form.tracks.filter(t => t.containsAi))
const aiTaggedArtists = computed(() => [
  ...props.form.primaryArtists,
  ...props.form.featuredArtists,
  ...props.form.remixerArtists,
].filter(a => a.isAi))

const selectedStoreDefs = computed(() => standardStores.filter(s => props.form.selectedStores.includes(s.id)))

const orderLines = computed(() => {
  const lines: { label: string; price: number }[] = []
  if (props.form.distributionType === 'priority') lines.push({ label: 'Priority Distro', price: 40 })
  for (const id of props.form.chartRegions) {
    const region = chartRegions.find(r => r.id === id)
    if (region) lines.push({ label: `Chart registration — ${region.label}`, price: region.price })
  }
  if (props.form.preReleaseDownloads) lines.push({ label: 'Pre-release downloads', price: 40 })
  if (props.form.advancedStores.includes('beatport')) lines.push({ label: 'Beatport Distribution & Label Setup', price: 49 })
  return lines
})

const orderTotal = computed(() => orderLines.value.reduce((s, l) => s + l.price, 0))
</script>
