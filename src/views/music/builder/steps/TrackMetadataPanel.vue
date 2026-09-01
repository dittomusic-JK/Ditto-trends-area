<template>
  <div class="px-6 pb-6 pt-5 border-t border-gray-200 bg-ditto-light-grey/30">
    <!-- ── Track preview ── -->
    <div>
      <p class="text-sm font-medium text-ditto-text">Track Preview <span class="text-xs text-ditto-purple font-normal">(Available on select stores only)</span></p>
      <div class="flex items-center gap-3 mt-3">
        <button class="w-6 flex items-center justify-center flex-shrink-0 text-ditto-purple hover:opacity-80 transition-opacity" aria-label="Play preview">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21"/></svg>
        </button>
        <div class="flex-1 relative pt-5">
          <!-- segment start / end times track the preview as it drags -->
          <span
            class="absolute top-0 -translate-x-1/2 text-[11px] text-ditto-subtext tabular-nums"
            :style="{ left: segmentStartLabelLeft }"
          >{{ formatTime(track.previewStart) }}</span>
          <span
            class="absolute top-0 -translate-x-1/2 text-[11px] text-ditto-subtext tabular-nums"
            :style="{ left: segmentEndLabelLeft }"
          >{{ formatTime(track.previewStart + PREVIEW_LEN) }}</span>
          <div
            ref="previewBar"
            class="relative h-10 cursor-pointer select-none"
            @pointerdown="onBarPointerDown"
          >
            <!-- Waveform: the preview window lights up the section it covers -->
            <div class="absolute inset-0 flex items-center gap-[2px]">
              <span
                v-for="(bar, i) in waveform"
                :key="i"
                class="flex-1 rounded-full transition-colors duration-75"
                :style="{
                  height: bar + '%',
                  backgroundColor: barActive(i)
                    ? 'var(--ditto-purple)'
                    : 'color-mix(in srgb, var(--ditto-purple) 25%, transparent)'
                }"
              ></span>
            </div>
            <!-- Draggable 30s window -->
            <div
              class="absolute top-0 h-full rounded-lg border-2 border-ditto-purple flex items-end justify-center cursor-grab active:cursor-grabbing"
              :style="{ left: segmentLeft, width: segmentWidth, backgroundColor: 'color-mix(in srgb, var(--ditto-purple) 12%, transparent)' }"
            >
              <span class="translate-y-1/2 px-1.5 py-px rounded bg-ditto-purple text-white text-[10px] font-semibold whitespace-nowrap leading-tight">30 sec</span>
            </div>
          </div>
        </div>
      </div>
      <p class="text-xs text-ditto-purple mt-2 ml-9">Drag the Preview Bar to select the start preview time</p>
    </div>

    <!-- ── Title / file / mix version ── -->
    <div class="grid sm:grid-cols-3 gap-x-8 gap-y-5 mt-8">
      <div>
        <div class="flex items-center gap-1.5 mb-1.5">
          <label class="text-sm font-medium text-ditto-text">Track Title</label>
          <FieldTip text="Track titles are locked once uploaded. Contact support to change one." />
        </div>
        <div class="flex items-center gap-2 border-b border-gray-300 py-2.5">
          <span class="flex-1 text-sm text-ditto-text truncate">{{ track.title }}</span>
          <svg class="w-3.5 h-3.5 text-ditto-subtext flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
      </div>
      <div>
        <div class="flex items-center gap-1.5 mb-1.5">
          <label class="text-sm font-medium text-ditto-text">Audio File</label>
        </div>
        <div class="flex items-center gap-2 border-b border-gray-300 py-2.5">
          <span class="flex-1 text-sm text-ditto-purple truncate">{{ track.audioFile }}</span>
          <button class="flex flex-col items-center text-ditto-purple hover:opacity-80 transition-opacity flex-shrink-0" title="Replace audio file">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span class="text-[9px] leading-tight">replace</span>
          </button>
        </div>
      </div>
      <div>
        <div class="flex items-center gap-1.5 mb-1.5">
          <label class="text-sm font-medium text-ditto-text">Track Mix Version</label>
          <FieldTip text="Only use this if the track is a specific mix, e.g. Radio Edit, Extended Mix." />
        </div>
        <input v-model="track.version" type="text" placeholder="Optional (e.g. Radio Edit)" :class="fieldClass(false)" />
      </div>
    </div>

    <!-- ── Track artists (shared component, compact mode) ── -->
    <div class="mt-9">
      <VideoArtistsStep :artists="track.artists" context="music" compact @update:artists="applyArtists" />
    </div>

    <!-- ── Track copyright ── -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5 mt-8">
      <div>
        <div class="flex items-center gap-1.5 mb-1.5">
          <label class="text-sm font-medium text-ditto-text">&copy; Copyright Holder</label>
          <FieldTip text="Who controls the copyright of this track's lyrics and melodies." />
        </div>
        <input
          v-model="track.copyrightHolder"
          type="text" placeholder="Name"
          :class="fieldClass(track.metadataTouched && track.copyrightHolder.trim().length < 2)"
        />
        <p v-if="track.metadataTouched && track.copyrightHolder.trim().length < 2" class="text-xs text-error mt-1">Please enter &copy; copyright holder.</p>
      </div>
      <div>
        <div class="flex items-center gap-1.5 mb-1.5">
          <label class="text-sm font-medium text-ditto-text">Copyright Year</label>
        </div>
        <select v-model.number="track.copyrightYear" :class="fieldClass(false)">
          <option v-for="y in copyrightYears" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
      <div>
        <div class="flex items-center gap-1.5 mb-1.5">
          <label class="text-sm font-medium text-ditto-text"><span class="text-[17px] leading-none align-[-1px]">&#8471;</span> Copyright Holder</label>
        </div>
        <input
          v-model="track.pCopyrightHolder"
          type="text" placeholder="Name"
          :class="fieldClass(track.metadataTouched && track.pCopyrightHolder.trim().length < 2)"
        />
        <p v-if="track.metadataTouched && track.pCopyrightHolder.trim().length < 2" class="text-xs text-error mt-1">Please enter &#8471; Copyright Holder.</p>
      </div>
      <div>
        <div class="flex items-center gap-1.5 mb-1.5">
          <label class="text-sm font-medium text-ditto-text">Production Year</label>
        </div>
        <select v-model.number="track.productionYear" :class="fieldClass(false)">
          <option v-for="y in copyrightYears" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
    </div>

    <!-- ── Toggle rows ── -->
    <div class="grid sm:grid-cols-2 gap-x-12 gap-y-1 mt-7">
      <div class="flex items-center justify-between gap-4 py-3">
        <span class="text-sm text-ditto-text">We've autogenerated this track's ISRC. Enter your own?</span>
        <IosToggle v-model="track.customIsrc" />
      </div>
      <div class="flex items-center justify-between gap-4 py-3">
        <span class="text-sm text-ditto-text">Add Lyrics?</span>
        <IosToggle v-model="track.addLyrics" />
      </div>
      <div class="flex items-center justify-between gap-4 py-3">
        <span class="flex items-center gap-2 text-sm text-ditto-text flex-wrap">
          Digital audio finger print
          <FieldTip text="Adds this track to fingerprint databases so it can be matched and protected." />
          <span v-if="track.fingerprint" class="inline-flex items-center gap-1.5 text-xs font-medium text-[#92400e]">
            <svg class="w-3.5 h-3.5 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Requires copyright documentation
          </span>
        </span>
        <IosToggle v-model="track.fingerprint" />
      </div>
      <div class="flex items-center justify-between gap-4 py-3">
        <span class="text-sm text-ditto-text">Does it contain explicit lyrics?</span>
        <IosToggle v-model="track.explicit" />
      </div>
    </div>
    <div v-if="track.customIsrc" class="max-w-xs mt-2">
      <label class="block text-sm font-medium text-ditto-text mb-1.5">ISRC</label>
      <input v-model="track.customIsrcValue" type="text" placeholder="e.g. GBAYE2600123" :class="fieldClass(false)" />
    </div>

    <!-- ── Track credits ── -->
    <div class="mt-9">
      <h3 class="font-satoshi font-black text-lg lg:text-xl tracking-[-0.02em] text-ditto-text mb-2">Track Credits</h3>
      <p class="text-sm text-ditto-subtext mb-6">You need to add <strong class="text-ditto-text">at least one name for each category</strong> of credits on this release.</p>

      <div class="space-y-6 max-w-3xl">
        <!-- Composer (name only) -->
        <div class="grid sm:grid-cols-2 gap-x-12">
          <div>
            <label class="block text-xs font-semibold text-ditto-text mb-1.5">Composer</label>
            <input
              v-model="track.credits.composer"
              type="text" placeholder="Name"
              :class="fieldClass(track.metadataTouched && !track.credits.composer.trim())"
            />
            <p v-if="track.metadataTouched && !track.credits.composer.trim()" class="text-xs text-error mt-1">Please enter a Composer name.</p>
          </div>
        </div>

        <!-- Name + role categories -->
        <div v-for="cat in roleCategories" :key="cat.key" class="grid sm:grid-cols-2 gap-x-12 gap-y-5">
          <div>
            <label class="block text-xs font-semibold text-ditto-text mb-1.5">{{ cat.label }}</label>
            <input
              v-model="track.credits[cat.key].name"
              type="text" placeholder="Name"
              :class="fieldClass(track.metadataTouched && !track.credits[cat.key].name.trim())"
            />
            <p v-if="track.metadataTouched && !track.credits[cat.key].name.trim()" class="text-xs text-error mt-1">Please enter a {{ cat.label }} name.</p>
          </div>
          <div>
            <label class="block text-xs font-semibold text-ditto-text mb-1.5">Role</label>
            <SearchableSelect
              :model-value="track.credits[cat.key].role"
              :options="cat.roles"
              :placeholder="cat.rolePlaceholder"
              :error="track.metadataTouched && !track.credits[cat.key].role.trim()"
              @update:model-value="track.credits[cat.key].role = $event"
            />
            <p v-if="track.metadataTouched && !track.credits[cat.key].role.trim()" class="text-xs text-error mt-1">Please select a role for {{ cat.label }}.</p>
          </div>
        </div>

        <!-- Additional credits -->
        <div v-for="(extra, i) in track.credits.additional" :key="'extra-' + i" class="grid sm:grid-cols-2 gap-x-12 gap-y-5 relative">
          <div>
            <label class="block text-xs font-semibold text-ditto-text mb-1.5">Additional Credit</label>
            <input v-model="extra.name" type="text" placeholder="Name" :class="fieldClass(false)" />
          </div>
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-semibold text-ditto-text">Role</label>
              <button @click="track.credits.additional.splice(i, 1)" class="text-xs text-error/70 hover:text-error transition-colors">Remove</button>
            </div>
            <SearchableSelect
              :model-value="extra.role"
              :options="allCreditRoles"
              placeholder="e.g. Mixing Engineer"
              @update:model-value="extra.role = $event"
            />
          </div>
        </div>

        <button
          @click="track.credits.additional.push({ name: '', role: '' })"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 rounded-full text-ditto-text hover:border-ditto-purple hover:text-ditto-purple transition-colors"
        >
          <span class="w-4 h-4 rounded-full bg-ditto-text flex items-center justify-center">
            <svg class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </span>
          Add more
        </button>

        <!-- AI disclosure: on a partially-AI release each track tags what was AI-generated -->
        <div v-if="partialAi" class="border-t border-gray-200 pt-5">
          <p class="text-sm font-semibold text-ditto-text mb-1">What was AI-generated on this track?</p>
          <p class="text-xs text-ditto-subtext mb-3">Pick any that apply or add your own — leave empty if this track has no AI content.</p>
          <div class="flex flex-wrap items-center gap-2">
            <button
              v-for="tag in aiTagSuggestions"
              :key="tag"
              type="button"
              @click="toggleAiTag(tag)"
              :class="[
                'px-3.5 py-2 text-sm font-medium rounded-full border transition-colors select-none',
                track.aiTags.includes(tag)
                  ? 'border-ditto-purple bg-ditto-purple/10 text-ditto-purple'
                  : 'border-gray-200 text-ditto-text hover:border-ditto-purple/50'
              ]"
            >{{ tag }}</button>
            <span
              v-for="tag in customAiTags"
              :key="'custom-' + tag"
              class="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-full border border-ditto-purple bg-ditto-purple/10 text-ditto-purple select-none"
            >
              {{ tag }}
              <button type="button" @click="toggleAiTag(tag)" class="hover:opacity-70" aria-label="Remove tag">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </span>
            <input
              v-model="customAiTagDraft"
              @keydown.enter.prevent="addCustomAiTag"
              @blur="addCustomAiTag"
              placeholder="Add your own…"
              class="px-3.5 py-2 text-sm rounded-full border border-dashed border-gray-300 outline-none focus:border-ditto-purple w-36 bg-transparent"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- ── Save ── -->
    <div class="flex justify-end mt-6">
      <button
        @click="save"
        class="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full border transition-colors"
        :class="complete
          ? 'bg-ditto-purple btn-pop-purple border-transparent text-white hover:opacity-95'
          : 'border-gray-200 text-ditto-purple hover:border-ditto-purple'"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        Save Metadata
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, defineComponent, h, onUnmounted } from 'vue'
import { copyrightYears, isTrackMetadataComplete, songwriterRoles, productionRoles, performerRoles, allCreditRoles, aiTagSuggestions } from '../../../../data/releaseBuilderMockData'
import type { BuilderTrack, TrackArtists } from '../../../../data/releaseBuilderMockData'
import VideoArtistsStep from '../../../videos/steps/VideoArtistsStep.vue'
import SearchableSelect from '../../../videos/steps/SearchableSelect.vue'

const props = defineProps<{ track: BuilderTrack; partialAi?: boolean }>()

// AI disclosure tags for this track (empty list = no AI on this track)
const customAiTagDraft = ref('')
const customAiTags = computed(() => props.track.aiTags.filter(t => !aiTagSuggestions.includes(t)))

const toggleAiTag = (tag: string) => {
  const i = props.track.aiTags.indexOf(tag)
  if (i === -1) props.track.aiTags.push(tag)
  else props.track.aiTags.splice(i, 1)
}

const addCustomAiTag = () => {
  const tag = customAiTagDraft.value.trim()
  if (tag && !props.track.aiTags.includes(tag)) props.track.aiTags.push(tag)
  customAiTagDraft.value = ''
}

const emit = defineEmits<{
  (e: 'close'): void
}>()

// Same underline field idiom as the rest of the builder
const fieldClass = (hasError: boolean) =>
  [
    'w-full px-0 py-2.5 border-0 border-b text-sm text-ditto-text bg-transparent focus:outline-none transition-colors',
    hasError ? 'border-error focus:border-error' : 'border-gray-300 focus:border-ditto-purple',
  ].join(' ')

const FieldTip = defineComponent({
  props: { text: { type: String, required: true } },
  setup(p) {
    return () => h('div', { class: 'relative group inline-flex' }, [
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

// iOS-style green toggle, matching the shared artists step
const IosToggle = defineComponent({
  props: { modelValue: { type: Boolean, required: true } },
  emits: ['update:modelValue'],
  setup(p, { emit: e }) {
    return () => h('button', {
      type: 'button',
      onClick: () => e('update:modelValue', !p.modelValue),
      class: [
        'w-[51px] h-[31px] rounded-full relative transition-colors flex-shrink-0',
        p.modelValue ? 'bg-[#34c759]' : 'bg-[#e9e9eb]',
      ],
      'aria-pressed': p.modelValue,
    }, [
      h('span', {
        class: [
          'absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform',
          p.modelValue ? 'translate-x-[20px]' : 'translate-x-0',
        ],
      }),
    ])
  },
})

const roleCategories = [
  { key: 'songwriter', label: 'Songwriter', rolePlaceholder: 'e.g. Lyricist', roles: songwriterRoles },
  { key: 'production', label: 'Production/Engineer', rolePlaceholder: 'e.g. Producer', roles: productionRoles },
  { key: 'performer', label: 'Performer', rolePlaceholder: 'e.g. Lead Vocals', roles: performerRoles },
] as const

const applyArtists = (artists: TrackArtists) => {
  Object.assign(props.track.artists, artists)
  props.track.artistsCustomized = true
}

const complete = computed(() => isTrackMetadataComplete(props.track))

const save = () => {
  props.track.metadataTouched = true
  if (complete.value) emit('close')
}

// ── Preview bar drag ──
const previewBar = ref<HTMLElement | null>(null)
const PREVIEW_LEN = 30

const segmentLeft = computed(() => `${(props.track.previewStart / props.track.durationSec) * 100}%`)
const segmentWidth = computed(() => `${(PREVIEW_LEN / props.track.durationSec) * 100}%`)

// Labels sit above the segment's edges, clamped so they never leave the bar
const clampPct = (pct: number) => Math.min(97, Math.max(3, pct))
const segmentStartLabelLeft = computed(() =>
  `${clampPct((props.track.previewStart / props.track.durationSec) * 100)}%`
)
const segmentEndLabelLeft = computed(() =>
  `${clampPct(((props.track.previewStart + PREVIEW_LEN) / props.track.durationSec) * 100)}%`
)

const formatTime = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.round(s) % 60).padStart(2, '0')}`

// Deterministic pseudo-waveform, seeded per track so it's stable across renders
const WAVE_BARS = 96
const waveform = computed(() => {
  let seed = 0
  for (const c of props.track.id + props.track.title) seed = (seed * 31 + c.charCodeAt(0)) >>> 0
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 0xffffffff
  }
  const raw = Array.from({ length: WAVE_BARS }, (_, i) => {
    const envelope = 0.55 + 0.45 * Math.sin((i / WAVE_BARS) * Math.PI) // quieter intro/outro
    return (0.25 + 0.75 * rand()) * envelope
  })
  // light smoothing so it reads as audio, not noise
  return raw.map((v, i) => {
    const prev = raw[i - 1] ?? v
    const next = raw[i + 1] ?? v
    return Math.round(((prev + v * 2 + next) / 4) * 100)
  })
})

const barActive = (i: number) => {
  const t = ((i + 0.5) / WAVE_BARS) * props.track.durationSec
  return t >= props.track.previewStart && t <= props.track.previewStart + PREVIEW_LEN
}

let dragging = false

const setFromClientX = (clientX: number) => {
  if (!previewBar.value) return
  const rect = previewBar.value.getBoundingClientRect()
  const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
  const start = ratio * props.track.durationSec - PREVIEW_LEN / 2
  props.track.previewStart = Math.round(Math.min(props.track.durationSec - PREVIEW_LEN, Math.max(0, start)))
}

const onMove = (e: PointerEvent) => { if (dragging) setFromClientX(e.clientX) }
const onUp = () => {
  dragging = false
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
}

const onBarPointerDown = (e: PointerEvent) => {
  dragging = true
  setFromClientX(e.clientX)
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
}

onUnmounted(onUp)
</script>
