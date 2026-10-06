<template>
  <div>
    <!-- Error banner: names every stage with validation errors -->
    <div v-if="errorStages.length" class="rounded-xl bg-warning/90 text-ditto-text text-sm font-semibold text-center px-6 py-3.5 mb-8">
      There are errors on {{ errorStagesLabel }} of the release builder.
      <button class="underline underline-offset-2 hover:opacity-80" @click="$emit('go-to-step', errorStages[0])">Repair</button> them to complete your release.
    </div>

    <div class="mb-8">
      <h1 class="font-satoshi font-black text-2xl lg:text-[32px] tracking-[-0.03em] text-ditto-text">Review Your Release</h1>
      <p class="text-sm text-ditto-subtext mt-1.5">Check everything over before it goes to stores. You can still edit any stage.</p>
    </div>

    <div class="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6 lg:gap-8 items-start">
      <!-- ── Main column ── -->
      <div class="space-y-6 min-w-0">

        <!-- Release hero: artwork, identity, schedule and details -->
        <section class="rounded-2xl border border-gray-200 p-6 lg:p-7">
          <div class="flex flex-col sm:flex-row gap-6 lg:gap-8">
            <div class="flex-shrink-0 w-full sm:w-[168px] lg:w-[180px]">
              <div class="rounded-xl overflow-hidden bg-gray-100 aspect-square shadow-[0_10px_28px_rgba(16,31,60,0.14)]">
                <img v-if="form.artwork" :src="form.artwork" alt="Release artwork" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex flex-col items-center justify-center gap-2 text-ditto-subtext">
                  <svg class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span class="text-xs font-medium">No artwork uploaded</span>
                </div>
              </div>
              <!-- Motion artwork (Apple Music): both deliverables -->
              <div v-if="form.motionArtwork.enabled && motionFiles.length" class="mt-4">
                <p class="text-[11px] font-semibold uppercase tracking-wide text-ditto-subtext flex items-center gap-1.5 mb-2">
                  Motion artwork
                  <WarnDot v-if="motionFiles.some(f => f.file.status === 'invalid')" tip="Motion artwork doesn't meet Apple's specification — remove or replace it" />
                  <WarnDot v-else-if="motionFiles.length === 1" tip="Apple needs both the 1:1 and the 3:4 version" />
                  <WarnDot v-else-if="!form.selectedStores.includes('apple-music')" tip="Apple Music isn't selected, so this motion artwork won't be delivered" />
                </p>
                <div class="flex gap-2">
                  <div v-for="f in motionFiles" :key="f.label" class="relative w-12 flex-shrink-0 rounded-lg overflow-hidden bg-ditto-light-grey" :class="f.portrait ? 'aspect-[3/4]' : 'aspect-square'" :title="f.file.fileName">
                    <video v-if="f.file.previewUrl && f.file.status === 'valid'" :src="f.file.previewUrl" class="w-full h-full object-cover" autoplay muted loop playsinline></video>
                    <span class="absolute bottom-0.5 left-0.5 px-1 rounded bg-ditto-text/80 text-white text-[9px] font-semibold">{{ f.label }}</span>
                  </div>
                </div>
                <p class="text-[11px] text-ditto-subtext mt-1.5">Apple Music only</p>
              </div>
            </div>

            <div class="flex-1 min-w-0 flex flex-col justify-center">
              <div class="flex items-center flex-wrap gap-x-2 gap-y-1 mb-2.5">
                <span class="px-2.5 py-1 rounded-full bg-ditto-purple/10 text-ditto-purple text-[11px] font-semibold">{{ releaseType }}</span>
                <span class="text-xs text-ditto-subtext">{{ form.tracks.length }} {{ form.tracks.length === 1 ? 'track' : 'tracks' }} · {{ totalDuration }}</span>
                <span v-if="form.primaryGenre" class="text-xs text-ditto-subtext">· {{ form.primaryGenre }}</span>
              </div>
              <h2 class="font-satoshi font-black text-2xl lg:text-[28px] tracking-[-0.03em] text-ditto-text leading-tight">{{ displayTitle }}</h2>
              <p :class="['mt-1 text-sm font-medium flex items-center gap-1.5', artistNames ? 'text-ditto-purple' : 'text-ditto-subtext']">
                {{ artistNames || 'No release artists set' }}
                <WarnDot v-if="!artistNames" tip="Release artists not set" />
              </p>

            </div>
          </div>

              <!-- Release schedule: distribution type, date and time in one place, so Priority Distro is never a surprise -->
              <div class="mt-6 grid sm:grid-cols-3 gap-3">
                <div :class="['relative group rounded-xl px-4 py-3', isPriority ? 'bg-[#fdf1cc]' : 'bg-ditto-light-grey']">
                  <p :class="['text-[11px] font-semibold uppercase tracking-wide mb-1', isPriority ? 'text-[#92400e]/70' : 'text-ditto-subtext']">Distribution</p>
                  <template v-if="isPriority">
                    <p class="flex items-center gap-1.5 text-sm font-bold text-[#92400e]">
                      <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>
                      Priority Distro
                      <span class="inline-flex w-3.5 h-3.5 rounded-full bg-[#92400e]/15 text-[#92400e] items-center justify-center text-[9px] font-bold cursor-help">i</span>
                    </p>
                    <p class="text-xs text-[#92400e]/80 mt-0.5">Release within 10 days · £40</p>
                    <!-- Hover: how to take it off -->
                    <div class="absolute left-0 top-full mt-1.5 z-10 w-64 p-2.5 bg-ditto-text text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all leading-snug">
                      Priority Distro is set by your release date. To remove it, choose a date more than 10 days away on the Schedule step.
                    </div>
                  </template>
                  <template v-else-if="form.distributionType === 'standard'">
                    <p class="text-sm font-bold text-ditto-text">Standard</p>
                    <p class="text-xs text-ditto-subtext mt-0.5">Included with your plan</p>
                  </template>
                  <p v-else class="text-sm text-ditto-subtext flex items-center gap-1.5">Not set <WarnDot tip="Distribution type not set" /></p>
                </div>
                <div class="rounded-xl px-4 py-3 bg-ditto-light-grey">
                  <p class="text-[11px] font-semibold uppercase tracking-wide text-ditto-subtext mb-1">Release date</p>
                  <template v-if="form.releaseDate">
                    <p class="text-sm font-bold text-ditto-text">{{ longDate(form.releaseDate) }}</p>
                    <p class="text-xs text-ditto-subtext mt-0.5">{{ daysAway }}</p>
                  </template>
                  <p v-else class="text-sm text-ditto-subtext flex items-center gap-1.5">Not set <WarnDot tip="Release date not set" /></p>
                </div>
                <div class="rounded-xl px-4 py-3 bg-ditto-light-grey">
                  <p class="text-[11px] font-semibold uppercase tracking-wide text-ditto-subtext mb-1">Release time</p>
                  <p class="text-sm font-bold text-ditto-text">{{ releaseTimeLabel === 'N/A' ? 'Midnight' : releaseTimeLabel }}</p>
                  <p class="text-xs text-ditto-subtext mt-0.5">{{ releaseTimeLabel === 'N/A' ? 'Local to each store' : 'Timed release' }}</p>
                </div>
              </div>

              <!-- Release details -->
              <dl class="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                <div v-for="item in metaItems" :key="item.label" :class="['min-w-0', item.wide ? 'col-span-2' : '']">
                  <dt class="text-[11px] font-semibold uppercase tracking-wide text-ditto-subtext">{{ item.label }}</dt>
                  <dd class="mt-0.5 text-sm font-medium text-ditto-text flex items-center gap-1.5 min-w-0">
                    <span v-if="item.value" :class="item.wide ? '' : 'truncate'" :title="item.value">{{ item.value }}</span>
                    <template v-else>
                      <span class="text-ditto-subtext font-normal">Not set</span>
                      <WarnDot :tip="item.label + ' not set'" />
                    </template>
                  </dd>
                </div>
              </dl>

          <!-- Artwork issues: warn but never block completion -->
          <div v-if="artworkIssues.length" class="mt-6 rounded-xl border border-[#f5c451]/70 bg-[#fdf1cc]/60 px-4 py-3.5 flex gap-3">
            <span class="w-5 h-5 mt-0.5 rounded-full bg-warning text-white flex items-center justify-center flex-shrink-0">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            </span>
            <div class="min-w-0">
              <p class="text-sm font-bold text-ditto-text">{{ artworkIssues.length }} artwork {{ artworkIssues.length === 1 ? 'issue' : 'issues' }} detected</p>
              <ul class="mt-1.5 space-y-1">
                <li v-for="issue in artworkIssues" :key="issue" class="flex items-start gap-2 text-xs text-ditto-text">
                  <span class="w-1 h-1 rounded-full bg-[#92400e] mt-1.5 flex-shrink-0"></span>
                  {{ issue }}
                </li>
              </ul>
              <p class="text-[11px] text-ditto-subtext mt-2 leading-relaxed">Some stores may reject this artwork. You can still complete the release, but we recommend fixing it first.</p>
            </div>
          </div>
        </section>

        <!-- Tracklist -->
        <section class="rounded-2xl border border-gray-200 overflow-hidden">
          <div class="flex items-baseline gap-3 px-6 py-4 border-b border-gray-100">
            <h3 class="font-satoshi font-black text-lg tracking-[-0.02em] text-ditto-text">Tracklist</h3>
            <span class="text-sm text-ditto-subtext">{{ form.tracks.length }} {{ form.tracks.length === 1 ? 'track' : 'tracks' }} · {{ totalDuration }}</span>
          </div>
          <template v-if="form.tracks.length">
            <div class="hidden md:grid grid-cols-[32px_1fr_1fr_72px] gap-4 px-6 py-2.5 text-xs text-ditto-subtext border-b border-gray-50">
              <span>#</span><span>Title</span><span>Artists</span><span class="text-right">Length</span>
            </div>
            <div
              v-for="(track, i) in form.tracks"
              :key="track.id"
              class="grid grid-cols-[32px_1fr_72px] md:grid-cols-[32px_1fr_1fr_72px] gap-4 px-6 py-3.5 items-center border-t border-gray-50 first:border-t-0 hover:bg-ditto-light-grey transition-colors"
            >
              <span class="text-sm font-semibold text-ditto-subtext tabular-nums">{{ i + 1 }}</span>
              <div class="min-w-0 flex items-center gap-2">
                <p class="text-sm font-semibold text-ditto-text truncate">{{ track.title }}<span v-if="track.version" class="font-normal text-ditto-subtext"> ({{ track.version }})</span></p>
                <span v-if="track.explicit" class="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold bg-ditto-text text-white leading-none" title="Explicit">E</span>
                <span v-if="trackAiPill(track)" class="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-ditto-purple/10 text-ditto-purple" :title="aiCreditLabels(track).join(', ')">{{ trackAiPill(track) }}</span>
                <WarnDot v-if="!isTrackMetadataComplete(track)" tip="Track metadata incomplete" />
              </div>
              <p class="hidden md:block text-sm text-ditto-purple truncate">{{ trackArtistNames(track) }}</p>
              <span class="text-sm text-ditto-subtext text-right tabular-nums">{{ track.duration }}</span>
            </div>
          </template>
          <p v-else class="px-6 py-5 text-sm text-ditto-subtext flex items-center gap-2">No uploaded tracks yet <WarnDot tip="Tracks not uploaded" /></p>
        </section>

        <!-- Stores + AI disclosure -->
        <div class="grid md:grid-cols-2 gap-6">
          <section class="rounded-2xl border border-gray-200 p-6">
            <div class="flex items-baseline gap-3 mb-4">
              <h3 class="font-satoshi font-black text-lg tracking-[-0.02em] text-ditto-text">Stores</h3>
              <span class="text-sm text-ditto-subtext">{{ form.selectedStores.length }} selected</span>
              <WarnDot v-if="!form.selectedStores.length" tip="No stores selected" />
            </div>
            <div v-if="selectedStoreDefs.length" class="flex items-center flex-wrap gap-2">
              <span
                v-for="store in selectedStoreDefs"
                :key="store.id"
                class="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center text-[10px] font-bold text-white bg-gray-100 ring-1 ring-gray-100"
                :style="store.letter ? { backgroundColor: store.tileColor } : {}"
                :title="store.name"
              >
                <img v-if="store.icon" :src="store.icon" :alt="store.name" class="w-full h-full object-contain" />
                <template v-else>{{ store.letter }}</template>
              </span>
            </div>
            <p v-else class="text-sm text-ditto-subtext">No stores selected yet.</p>
            <div v-if="advancedStoreLabels.length" class="flex items-center flex-wrap gap-2 mt-4">
              <span v-for="label in advancedStoreLabels" :key="label" class="px-2.5 py-1 rounded-full text-[11px] font-medium border border-gray-200 text-ditto-text">{{ label }}</span>
            </div>
          </section>

          <section class="rounded-2xl border border-gray-200 p-6">
            <div class="flex items-baseline gap-3 mb-4">
              <h3 class="font-satoshi font-black text-lg tracking-[-0.02em] text-ditto-text">AI Disclosure</h3>
              <WarnDot v-if="!form.aiDisclosure" tip="AI disclosure not set" />
            </div>
            <template v-if="form.aiDisclosure === 'none'">
              <span class="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#e6fbf1] text-[#0f8a4f]">No AI used</span>
              <p class="text-sm text-ditto-subtext mt-3">No AI-generated content declared on this release.</p>
            </template>
            <template v-else-if="form.aiDisclosure === 'full'">
              <span class="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold bg-ditto-purple/10 text-ditto-purple">Entirely AI-generated</span>
              <p class="text-sm text-ditto-subtext mt-3">Every credit on this release is declared as AI-generated.</p>
            </template>
            <template v-else-if="form.aiDisclosure === 'partial'">
              <span class="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold bg-ditto-purple/10 text-ditto-purple">Partially AI-generated</span>
              <ul v-if="aiTaggedTracks.length" class="mt-3 space-y-1.5">
                <li v-for="t in aiTaggedTracks" :key="'ait-' + t.id" class="text-sm text-ditto-text">
                  <span class="font-medium">{{ t.title }}</span> <span class="text-ditto-subtext">— {{ aiCreditLabels(t).join(', ') }}</span>
                </li>
              </ul>
              <p v-else class="text-sm text-ditto-subtext mt-3">All credits are set to No AI so far.</p>
            </template>
            <p v-else class="text-sm text-ditto-subtext">Not declared yet.</p>
          </section>
        </div>
      </div>

      <!-- ── Summary rail ── -->
      <aside class="lg:sticky lg:top-24 rounded-2xl border border-gray-200 p-6">
        <h3 class="font-satoshi font-black text-lg tracking-[-0.02em] text-ditto-text">Summary</h3>
        <p class="text-xs text-ditto-subtext mt-0.5">{{ releaseType }} · {{ form.tracks.length }} {{ form.tracks.length === 1 ? 'track' : 'tracks' }} · {{ form.selectedStores.length }} {{ form.selectedStores.length === 1 ? 'store' : 'stores' }}</p>

        <ul class="mt-5 -mx-2 space-y-0.5">
          <li v-for="stage in stages" :key="stage.index">
            <button class="w-full flex items-center justify-between gap-3 px-2 py-2 rounded-lg hover:bg-ditto-light-grey text-left transition-colors group" @click="$emit('go-to-step', stage.index)">
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

        <div class="mt-5 pt-5 border-t border-gray-100">
          <p class="text-[11px] font-semibold uppercase tracking-wide text-ditto-subtext mb-3">Paid extras</p>
          <template v-if="orderLines.length">
            <div class="space-y-2">
              <div v-for="line in orderLines" :key="line.label" class="flex items-center justify-between gap-3 text-sm">
                <span class="text-ditto-subtext flex items-center gap-1.5 min-w-0">
                  <svg v-if="line.label === 'Priority Distro'" class="w-3.5 h-3.5 text-[#92400e] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>
                  <span class="truncate">{{ line.label }}</span>
                </span>
                <span class="font-semibold text-ditto-text tabular-nums">£{{ line.price }}</span>
              </div>
            </div>
            <div class="flex items-center justify-between border-t border-gray-100 pt-3 mt-3">
              <span class="text-sm font-bold text-ditto-text">Total</span>
              <span class="font-satoshi font-black text-xl tracking-[-0.02em] text-ditto-text tabular-nums">£{{ orderTotal }}</span>
            </div>
          </template>
          <p v-else class="text-sm text-ditto-subtext">None — everything here is included with your plan.</p>
        </div>

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
          {{ hasErrors ? 'Fix the stages marked above to complete your release.' : (orderLines.length ? 'Paid extras are added to your basket on completion.' : 'You can come back and edit any stage before completing.') }}
        </p>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue'
import { standardStores, chartRegions, computeReleaseType, isTrackMetadataComplete } from '../../../../data/releaseBuilderMockData'
import type { BuilderTrack } from '../../../../data/releaseBuilderMockData'
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

const isPriority = computed(() => props.form.distributionType === 'priority')
const longDate = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

// Stage checklist for the summary rail (mirrors the step bar's error state)
const stageLabels = ['Upload', 'Artwork', 'Details', 'Schedule', 'Stores']
const stages = computed(() => stageLabels.map((label, index) => ({ label, index, error: !!props.stepErrors[index] })))

const artistNames = computed(() => props.form.primaryArtists.map(a => a.name).join(', '))
const trackArtistNames = (t: BuilderTrack) => {
  const own = t.artists.primary.map(a => a.name).join(', ')
  return own || artistNames.value || '—'
}

// "In 6 days" / "Tomorrow" under the release date
const daysAway = computed(() => {
  const d = props.form.releaseDate
  if (!d) return ''
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000)
  if (diff < 0) return 'In the past'
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  return `In ${diff} days`
})

// Label-above-value details grid. Empty required values show a warning dot.
const metaItems = computed((): { label: string; value: string; wide?: boolean }[] => [
  { label: 'Label', value: props.form.recordLabel },
  { label: '© Copyright', value: props.form.copyrightHolder ? `${props.form.copyrightYear} ${props.form.copyrightHolder}` : '' },
  { label: '℗ Copyright', value: props.form.pCopyrightHolder ? `${props.form.productionYear} ${props.form.pCopyrightHolder}` : '' },
  { label: 'Primary genre', value: props.form.primaryGenre },
  { label: 'Secondary genre', value: props.form.secondaryGenre || 'N/A' },
  { label: 'Language', value: props.form.language },
  { label: 'Original release date', value: props.form.originalReleaseDate ? isoDate(props.form.originalReleaseDate) : 'N/A' },
  { label: 'Price band', value: props.form.priceBand.charAt(0).toUpperCase() + props.form.priceBand.slice(1) },
  { label: 'Various artists', value: props.form.artistType === 'compilation' ? 'Yes' : 'No' },
  { label: 'Extras', value: extrasLabel.value, wide: true },
])

const advancedStoreNames: Record<string, string> = { 'youtube-content-id': 'YouTube Content ID & Shorts', beatport: 'Beatport' }
const advancedStoreLabels = computed(() => props.form.advancedStores.map(id => advancedStoreNames[id] || id))

// Per-track AI pill: the strongest level any credit carries on the track
const trackAiPill = (t: BuilderTrack) => {
  if (props.form.aiDisclosure === 'full') return 'Fully AI'
  if (props.form.aiDisclosure !== 'partial') return ''
  const labels = aiCreditLabels(t)
  if (!labels.length) return ''
  return labels.some(l => l.endsWith('Fully AI')) ? 'Fully AI' : 'Partly AI'
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

// Credits with an AI level set on a track, as review labels ("Songwriter · Partly AI")
const levelLabel = (level: string) => level === 'full' ? 'Fully AI' : level === 'partial' ? 'Partly AI' : ''
const aiCreditLabels = (t: BuilderTrack): string[] => {
  const labels: string[] = []
  if (t.credits.composerAi !== 'none') labels.push(`Composer · ${levelLabel(t.credits.composerAi)}`)
  if (t.credits.songwriter.ai !== 'none') labels.push(`Songwriter · ${levelLabel(t.credits.songwriter.ai)}`)
  if (t.credits.production.ai !== 'none') labels.push(`Production/Engineer · ${levelLabel(t.credits.production.ai)}`)
  if (t.credits.performer.ai !== 'none') labels.push(`Performer · ${levelLabel(t.credits.performer.ai)}`)
  for (const extra of t.credits.additional) {
    if (extra.ai !== 'none') labels.push(`${extra.role || extra.name || 'Additional credit'} · ${levelLabel(extra.ai)}`)
  }
  return labels
}

// Motion artwork files that have been added (either slot)
const motionFiles = computed(() => [
  { label: '1:1', portrait: false, file: props.form.motionArtwork.square },
  { label: '3:4', portrait: true, file: props.form.motionArtwork.portrait },
].filter(f => f.file.status))

const aiTaggedTracks = computed(() => props.form.tracks.filter(t => aiCreditLabels(t).length > 0))

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
