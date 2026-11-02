<template>
  <!-- Shared by the "register" card and the inline edit panel under a row.
       Owns its own draft, so editing one performance never touches a
       half-filled registration above it. -->
  <div>
    <div :class="['grid grid-cols-1 gap-6', compact ? 'lg:grid-cols-[minmax(240px,300px)_minmax(0,1fr)] lg:gap-8' : 'lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:gap-10']">
      <!-- Left column: when & where -->
      <div class="space-y-5">
        <!-- Date of performance -->
        <div>
          <label class="flex items-center gap-2 text-xs font-medium text-ditto-subtext mb-1.5">
            <span class="step-num">1</span> Date of performance
          </label>
          <input
            v-model="draft.date"
            type="date"
            :min="subscriptionStart"
            :max="today"
            class="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-ditto-text bg-white focus:outline-none focus:border-ditto-purple"
          />
          <p class="text-[11px] text-ditto-subtext mt-1.5">From the start of your subscription ({{ formatDate(subscriptionStart) }}) up to today.</p>
        </div>

        <!-- Venue (searchable) -->
        <div class="relative" ref="venueRef">
          <label class="flex items-center gap-2 text-xs font-medium text-ditto-subtext mb-1.5">
            <span class="step-num">2</span> Venue
          </label>
          <div class="relative">
            <svg class="w-4 h-4 text-ditto-subtext absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              v-model="venueQuery"
              @focus="venueOpen = true"
              @input="venueOpen = true; draft.venue = null"
              type="text"
              placeholder="Search for a venue"
              class="w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm text-ditto-text bg-white focus:outline-none focus:border-ditto-purple"
            />
            <button v-if="draft.venue" @click="clearVenue" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-ditto-subtext hover:text-ditto-text" aria-label="Clear venue">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/></svg>
            </button>
          </div>

          <!-- Dropdown -->
          <div v-if="venueOpen && venueQuery.trim() && !draft.venue" class="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl z-30 py-1.5 max-h-56 overflow-y-auto">
            <template v-if="filteredVenues.length > 0">
              <button
                v-for="venue in filteredVenues" :key="venue.id ?? `${venue.name}-${venue.city}`"
                @click="selectVenue(venue)"
                class="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-ditto-light-grey transition-colors"
              >
                <svg class="w-3.5 h-3.5 text-ditto-subtext flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span class="text-sm text-ditto-text truncate">{{ venue.name }}</span>
                <span class="text-xs text-ditto-subtext ml-auto flex-shrink-0">{{ venue.city || venue.category }}</span>
              </button>
            </template>
            <p v-else-if="!venuesLoaded" class="px-3.5 py-3 text-xs text-ditto-subtext">Loading venues…</p>
            <p v-else class="px-3.5 py-3 text-xs text-error">We couldn't find that venue. Please try another venue.</p>
          </div>
          <p v-if="draft.venue" class="text-[11px] text-success mt-1.5 flex items-center gap-1">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12" stroke-linecap="round" stroke-linejoin="round"/></svg>
            {{ draft.venue.name }}{{ draft.venue.city ? `, ${draft.venue.city}` : '' }}
          </p>
        </div>
      </div>

      <!-- Right column: works performed (searchable listbox) -->
      <div>
        <div class="flex items-baseline justify-between gap-3 mb-1.5">
          <label class="flex items-center gap-2 text-xs font-medium text-ditto-subtext">
            <span class="step-num">3</span> Works performed
          </label>
          <span class="text-[11px] text-ditto-subtext tabular-nums">
            {{ draft.workIds.length > 0 ? `${draft.workIds.length} of ${eligibleWorks.length} selected` : `${eligibleWorks.length} eligible works` }}
          </span>
        </div>

        <div :class="['rounded-xl border overflow-hidden transition-colors', draft.venue ? 'border-gray-200 bg-white' : 'border-gray-100 bg-ditto-light-grey/30']">
          <!-- Search -->
          <div class="relative border-b border-gray-100">
            <svg class="w-4 h-4 text-ditto-subtext absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              v-model="worksQuery"
              :disabled="!draft.venue"
              type="text"
              placeholder="Search your works by title, artist or Tunecode"
              class="w-full pl-10 pr-3.5 py-2.5 text-sm text-ditto-text bg-transparent focus:outline-none placeholder:text-ditto-subtext/70 disabled:cursor-not-allowed"
            />
          </div>

          <!-- List -->
          <div :class="['overflow-y-auto', compact ? 'max-h-[200px]' : 'max-h-[264px]']">
            <div v-if="!draft.venue" class="px-4 py-9 text-center">
              <div class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto mb-2.5">
                <svg class="w-4 h-4 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
              </div>
              <p class="text-xs font-medium text-ditto-text">Your setlist goes here</p>
              <p class="text-[11px] text-ditto-subtext mt-0.5">Pick a venue first, then tick the works you performed.</p>
            </div>
            <template v-else>
              <button
                v-for="work in filteredWorks" :key="work.id"
                @click="toggleWork(work.id)"
                class="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-ditto-light-grey transition-colors"
              >
                <span :class="['w-[18px] h-[18px] rounded border-2 flex items-center justify-center flex-shrink-0 transition-all', draft.workIds.includes(work.id) ? 'bg-ditto-purple border-ditto-purple' : 'border-gray-300 bg-white']">
                  <svg v-if="draft.workIds.includes(work.id)" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20,6 9,17 4,12" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
                <span class="flex-1 min-w-0">
                  <span class="block text-sm text-ditto-text truncate">{{ work.title }}</span>
                  <span class="block text-xs text-ditto-subtext truncate">{{ work.artist }}</span>
                </span>
                <span class="text-[10px] text-ditto-subtext font-mono flex-shrink-0">{{ work.tunecode }}</span>
              </button>
              <p v-if="filteredWorks.length === 0" class="px-4 py-8 text-center text-xs text-ditto-subtext">
                No works match "{{ worksQuery }}". Only registered works with a PRS Tunecode can be added.
              </p>
            </template>
          </div>

          <!-- Footer actions -->
          <div v-if="draft.venue" class="flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-ditto-light-grey/30">
            <button
              v-if="worksQuery.trim() && filteredWorks.length > 0"
              @click="addAllShown"
              class="text-[11px] font-medium text-ditto-purple hover:underline"
            >Add all {{ filteredWorks.length }} shown</button>
            <span v-else class="text-[11px] text-ditto-subtext">Registered works with a PRS Tunecode</span>
            <button
              v-if="draft.workIds.length > 0"
              @click="draft.workIds = []"
              class="text-[11px] font-medium text-ditto-subtext hover:text-ditto-text"
            >Clear selection</button>
          </div>
        </div>

        <!-- Selected chips -->
        <div v-if="draft.workIds.length > 0" class="flex flex-wrap gap-1.5 mt-2.5">
          <span
            v-for="id in draft.workIds" :key="id"
            class="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full bg-[#efe9ff] text-ditto-purple text-xs font-medium"
          >
            {{ workById(id)?.title }}
            <button @click="toggleWork(id)" class="hover:bg-ditto-purple/15 rounded-full p-0.5" aria-label="Remove work">
              <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/></svg>
            </button>
          </span>
        </div>
      </div>
    </div>

    <!-- Footer: live summary + actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5 pt-5 border-t border-gray-100">
      <p class="text-xs text-ditto-subtext min-h-[1rem]">
        <template v-if="summary">{{ summary }}</template>
        <template v-else>Add a date, a venue and at least one work to {{ cancellable ? 'save' : 'register' }}.</template>
      </p>
      <div class="flex items-center gap-2 sm:justify-end">
        <button
          v-if="cancellable"
          @click="emit('cancel')"
          class="px-4 py-2.5 text-sm font-medium rounded-full text-ditto-subtext hover:text-ditto-text hover:bg-ditto-light-grey transition-colors"
        >Cancel</button>
        <button
          @click="submit"
          :disabled="!canSubmit"
          :class="[
            'px-6 py-2.5 text-sm font-medium rounded-full transition-all',
            canSubmit ? 'bg-ditto-purple btn-pop-purple text-white hover:opacity-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          ]"
        >{{ submitLabel }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import type { Venue, Work, PerformanceDraft } from './livePerformanceTypes'

const props = withDefaults(defineProps<{
  venues: Venue[]
  venuesLoaded: boolean
  eligibleWorks: Work[]
  subscriptionStart: string
  today: string
  initial?: PerformanceDraft
  submitLabel?: string
  cancellable?: boolean
  compact?: boolean
}>(), {
  submitLabel: 'Register',
  cancellable: false,
  compact: false,
})

const emit = defineEmits<{
  (e: 'submit', draft: PerformanceDraft): void
  (e: 'cancel'): void
}>()

const draft = reactive<PerformanceDraft>({
  date: props.initial?.date ?? '',
  venue: props.initial?.venue ?? null,
  workIds: [...(props.initial?.workIds ?? [])],
})

const venueQuery = ref(props.initial?.venue?.name ?? '')
const venueOpen = ref(false)
const worksQuery = ref('')
const venueRef = ref<HTMLElement | null>(null)

const workById = (id: string) => props.eligibleWorks.find(w => w.id === id)

// Ranked search over the full registry: name prefix > word prefix > name
// contains > city/address matches. Accent-insensitive.
const fold = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

const filteredVenues = computed(() => {
  const q = fold(venueQuery.value.trim())
  if (!q) return []
  const starts: Venue[] = []
  const wordStarts: Venue[] = []
  const contains: Venue[] = []
  const place: Venue[] = []
  for (const v of props.venues) {
    const name = fold(v.name)
    if (name.startsWith(q)) starts.push(v)
    else if (name.includes(' ' + q)) wordStarts.push(v)
    else if (name.includes(q)) contains.push(v)
    else if (fold(v.city).startsWith(q) || (v.address && fold(v.address).includes(q))) place.push(v)
    if (starts.length >= 8) break
  }
  return [...starts, ...wordStarts, ...contains, ...place].slice(0, 8)
})

const selectVenue = (venue: Venue) => {
  draft.venue = venue
  venueQuery.value = venue.name
  venueOpen.value = false
}

const clearVenue = () => {
  draft.venue = null
  venueQuery.value = ''
  draft.workIds = []
  worksQuery.value = ''
}

const toggleWork = (id: string) => {
  const idx = draft.workIds.indexOf(id)
  idx > -1 ? draft.workIds.splice(idx, 1) : draft.workIds.push(id)
}

const filteredWorks = computed(() => {
  const q = fold(worksQuery.value.trim())
  if (!q) return props.eligibleWorks
  return props.eligibleWorks.filter(w =>
    fold(w.title).includes(q) || fold(w.artist).includes(q) || fold(w.tunecode).includes(q)
  )
})

const addAllShown = () => {
  for (const w of filteredWorks.value) {
    if (!draft.workIds.includes(w.id)) draft.workIds.push(w.id)
  }
}

const dateValid = computed(() => !!draft.date && draft.date >= props.subscriptionStart && draft.date <= props.today)
const canSubmit = computed(() => dateValid.value && !!draft.venue && draft.workIds.length > 0)

const formatDate = (iso: string) => new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

// What will be registered, in one line, so the button never feels blind
const summary = computed(() => {
  const parts: string[] = []
  if (dateValid.value) parts.push(formatDate(draft.date))
  if (draft.venue) parts.push(draft.venue.city ? `${draft.venue.name}, ${draft.venue.city}` : draft.venue.name)
  if (draft.workIds.length) parts.push(`${draft.workIds.length} ${draft.workIds.length === 1 ? 'work' : 'works'}`)
  return parts.join(' · ')
})

const submit = () => {
  if (!canSubmit.value || !draft.venue) return
  emit('submit', { date: draft.date, venue: draft.venue, workIds: [...draft.workIds] })
  if (!props.cancellable) {
    draft.date = ''
    clearVenue()
  }
}

const handleClickOutside = (e: MouseEvent) => {
  const t = e.target as Node
  if (venueRef.value && !venueRef.value.contains(t)) venueOpen.value = false
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 9999px;
  background: #efe9ff;
  color: var(--ditto-purple);
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
}
</style>
