<template>
  <div class="space-y-6">
    <!-- Heading + demo plan switcher -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="font-satoshi font-black tracking-[-0.03em] text-xl text-ditto-text">Register Live Performances</h2>
        <p class="text-sm text-ditto-subtext mt-1">Every gig you play earns publishing royalties on your own songs. Register them here to claim them.</p>
      </div>
      <!-- Prototype-only plan toggle -->
      <div class="flex items-center gap-1.5 text-xs text-ditto-subtext flex-shrink-0">
        <span class="mr-1">Demo:</span>
        <button
          v-for="p in (['Pro', 'Starter'] as const)" :key="p"
          @click="plan = p"
          :class="['px-3 py-1 rounded-full transition-colors', plan === p ? 'bg-ditto-purple text-white' : 'bg-ditto-light-grey text-ditto-subtext hover:text-ditto-text']"
        >{{ p }}</button>
      </div>
    </div>

    <!-- ===== Starter: upgrade panel ===== -->
    <div v-if="plan === 'Starter'" class="rounded-2xl border border-ditto-purple/20 bg-gradient-to-r from-ditto-purple/5 to-white p-8 sm:p-10 text-center">
      <div class="w-14 h-14 rounded-full bg-ditto-purple/10 flex items-center justify-center mx-auto mb-4">
        <svg class="w-6 h-6 text-ditto-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>
      <h3 class="font-satoshi font-black tracking-[-0.03em] text-lg text-ditto-text mb-2">Live Performance registration is included with Pro and Label</h3>
      <p class="text-sm text-ditto-subtext max-w-md mx-auto mb-6">
        Upgrade your music subscription to register live performances and claim the publishing royalties you're owed every time you play your songs live.
      </p>
      <button class="px-6 py-2.5 bg-ditto-purple btn-pop-purple text-white text-sm font-medium rounded-full hover:opacity-95 transition-all">
        Upgrade Plan
      </button>
    </div>

    <!-- ===== Pro / Label ===== -->
    <template v-else>
      <!-- At-a-glance strip: the page used to open straight onto a blank form -->
      <div class="grid grid-cols-3 bg-white rounded-2xl border border-gray-200 divide-x divide-gray-100">
        <div class="px-4 py-3.5 sm:px-5">
          <p class="text-[11px] uppercase tracking-wide text-ditto-subtext">Performances</p>
          <p class="font-satoshi font-black text-2xl text-ditto-text tabular-nums mt-0.5">{{ performances.length }}</p>
          <p class="text-[11px] text-ditto-subtext">since {{ formatDate(subscriptionStart) }}</p>
        </div>
        <div class="px-4 py-3.5 sm:px-5">
          <p class="text-[11px] uppercase tracking-wide text-ditto-subtext">Works played</p>
          <p class="font-satoshi font-black text-2xl text-ditto-text tabular-nums mt-0.5">{{ worksPlayed }}</p>
          <p class="text-[11px] text-ditto-subtext">of {{ eligibleWorks.length }} eligible</p>
        </div>
        <div class="px-4 py-3.5 sm:px-5">
          <p class="text-[11px] uppercase tracking-wide text-ditto-subtext">Awaiting PRS</p>
          <p class="font-satoshi font-black text-2xl text-ditto-text tabular-nums mt-0.5">{{ submittedCount }}</p>
          <p class="text-[11px] text-ditto-subtext">{{ submittedCount === 1 ? 'submission' : 'submissions' }} in review</p>
        </div>
      </div>

      <!-- Registration card -->
      <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div class="flex items-center gap-3 px-5 sm:px-6 lg:px-8 py-4 border-b border-gray-100 bg-gradient-to-r from-[#f6f3ff] to-transparent">
          <div class="w-9 h-9 rounded-xl bg-white border border-ditto-purple/20 flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4 text-ditto-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>
            </svg>
          </div>
          <h3 class="font-satoshi font-black tracking-[-0.02em] text-base text-ditto-text">Add a performance</h3>
        </div>
        <div class="p-5 sm:p-6 lg:p-8">
          <PerformanceForm
            :venues="venues"
            :venues-loaded="venuesLoaded"
            :eligible-works="eligibleWorks"
            :subscription-start="subscriptionStart"
            :today="today"
            submit-label="Register"
            @submit="register"
          />
        </div>
      </div>

      <!-- ===== Registered performances ===== -->
      <div>
        <h3 class="font-satoshi font-black tracking-[-0.03em] text-lg text-ditto-text mb-4">Registered performances</h3>

        <!-- Empty state -->
        <div v-if="performances.length === 0" class="bg-white rounded-2xl border-2 border-dashed border-gray-200 px-6 py-12 text-center">
          <div class="w-12 h-12 rounded-full bg-ditto-purple/10 flex items-center justify-center mx-auto mb-4">
            <svg class="w-5 h-5 text-ditto-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>
            </svg>
          </div>
          <p class="text-sm font-semibold text-ditto-text mb-1">No live performances registered yet</p>
          <p class="text-xs text-ditto-subtext max-w-xs mx-auto">Register your first live performance to start claiming publishing royalties.</p>
        </div>

        <!-- List -->
        <div v-else class="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
          <div v-for="perf in performances" :key="perf.id" :class="editingId === perf.id ? 'bg-[#faf9ff]' : ''">
            <div class="flex items-start gap-4 px-5 py-4">
              <!-- Calendar tile -->
              <div class="w-12 rounded-xl border border-gray-200 bg-white overflow-hidden text-center flex-shrink-0">
                <p class="text-[9px] font-bold uppercase tracking-wide text-white bg-ditto-purple py-0.5">{{ monthOf(perf.date) }}</p>
                <p class="text-lg font-bold text-ditto-text leading-none py-1.5">{{ dayOf(perf.date) }}</p>
              </div>

              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-ditto-text flex items-center gap-1.5 flex-wrap">
                  {{ perf.venue.name }}
                  <span class="font-normal text-ditto-subtext inline-flex items-center gap-1">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {{ perf.venue.city }}
                  </span>
                </p>
                <div class="flex flex-wrap gap-1.5 mt-1.5">
                  <span v-for="id in perf.workIds" :key="id" class="px-2 py-0.5 rounded-full bg-ditto-light-grey text-xs text-ditto-text">
                    {{ workById(id)?.title }}
                  </span>
                </div>
              </div>

              <div class="flex items-center gap-2 flex-shrink-0">
                <StatusPill :variant="perf.status === 'Registered' ? 'success' : 'warning'" :label="perf.status" />
                <div class="relative group">
                  <button
                    @click="toggleEdit(perf.id)"
                    :class="['p-1.5 rounded-lg transition-colors', editingId === perf.id ? 'bg-[#efe9ff] text-ditto-purple' : 'text-ditto-subtext hover:text-ditto-purple']"
                    :aria-expanded="editingId === perf.id"
                    aria-label="Edit performance"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-ditto-text text-white text-[10px] rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">{{ editingId === perf.id ? 'Close' : 'Edit' }}</div>
                </div>
                <div class="relative group">
                  <button @click="deletePerformance(perf.id)" class="p-1.5 text-error/70 hover:text-error transition-colors" aria-label="Delete performance">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-ditto-text text-white text-[10px] rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">Delete</div>
                </div>
              </div>
            </div>

            <!-- Inline edit panel: opens under the row, leaves the form above untouched -->
            <div v-if="editingId === perf.id" class="px-5 pb-5 pt-1">
              <div class="border-t border-dashed border-gray-200 pt-5">
                <PerformanceForm
                  :key="perf.id"
                  :venues="venues"
                  :venues-loaded="venuesLoaded"
                  :eligible-works="eligibleWorks"
                  :subscription-start="subscriptionStart"
                  :today="today"
                  :initial="{ date: perf.date, venue: perf.venue, workIds: perf.workIds }"
                  submit-label="Save changes"
                  cancellable
                  compact
                  @submit="saveEdit(perf.id, $event)"
                  :note="perf.status === 'Registered' ? 'Saving sends this performance back to PRS for review.' : ''"
                  @cancel="editingId = null"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Toast -->
    <transition
      enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-y-2" enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0 translate-y-2"
    >
      <div v-if="toast" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-ditto-text text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
        <svg class="w-4 h-4 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12" stroke-linecap="round" stroke-linejoin="round"/></svg>
        {{ toast }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import StatusPill from '../../components/common/StatusPill.vue'
import PerformanceForm from './PerformanceForm.vue'
import type { Venue, Work, Performance, PerformanceDraft } from './livePerformanceTypes'

// ---- Demo plan (prototype-only switcher) ----
const plan = ref<'Pro' | 'Starter'>('Pro')

// ---- Eligibility window ----
const subscriptionStart = '2026-01-10'
const today = new Date().toISOString().slice(0, 10)

// ---- Venues: UK-wide registry (5.2k venues, lazily fetched) ----
const venues = ref<Venue[]>([])
const venuesLoaded = ref(false)

onMounted(async () => {
  try {
    const res = await fetch('/data/uk_venues.json')
    venues.value = await res.json()
  } catch {
    venues.value = []
  } finally {
    venuesLoaded.value = true
  }
})

// ---- Works: registered publishing works with a valid PRS Tunecode ----
// Sized like a working label catalog so the picker proves out at scale.
const eligibleWorks: Work[] = [
  { id: 'w1', title: 'Solar', artist: 'Darkoo & Ruger', tunecode: '203481KV' },
  { id: 'w2', title: 'My Baby (Obimo)', artist: 'Almost Joey', tunecode: '198237DM' },
  { id: 'w3', title: 'Favourite Girl', artist: 'Darkoo & Dess Dior', tunecode: '175920QT' },
  { id: 'w4', title: 'Like Dat', artist: 'Darkoo', tunecode: '188463PL' },
  { id: 'w5', title: 'Focus On Me', artist: 'Darkoo', tunecode: '191058WC' },
  { id: 'w6', title: 'Right Now', artist: 'Darkoo, Davido & Rvssian', tunecode: '179311BH' },
  { id: 'w7', title: 'Gangsta', artist: 'Darkoo', tunecode: '184220RC' },
  { id: 'w8', title: 'Juicy', artist: 'Darkoo & One Acen', tunecode: '169884TN' },
  { id: 'w9', title: 'Always', artist: 'Darkoo', tunecode: '205117FB' },
  { id: 'w10', title: 'Slow Down', artist: 'Almost Joey', tunecode: '197430ZX' },
  { id: 'w11', title: 'Wave After Wave', artist: 'Almost Joey', tunecode: '201559KD' },
  { id: 'w12', title: 'Midnight Prayers', artist: 'Almost Joey', tunecode: '206612AE' },
  { id: 'w13', title: 'No Sleep in the City', artist: 'Goldenboy Collective', tunecode: '178204HM' },
  { id: 'w14', title: 'Paper Planes over Peckham', artist: 'Goldenboy Collective', tunecode: '182991VS' },
  { id: 'w15', title: 'Colder in July', artist: 'Goldenboy Collective', tunecode: '190476NW' },
  { id: 'w16', title: 'Golden Hour', artist: 'Nia Sterling', tunecode: '186532JP' },
  { id: 'w17', title: 'Static Love', artist: 'Nia Sterling', tunecode: '192847LQ' },
  { id: 'w18', title: 'Velvet Sky', artist: 'Nia Sterling', tunecode: '199205GB' },
  { id: 'w19', title: 'Neon Rain', artist: 'Nia Sterling', tunecode: '203914DU' },
  { id: 'w20', title: 'Runaway Summer', artist: 'The Marlowe Band', tunecode: '175066YT' },
  { id: 'w21', title: 'Sugar Rush', artist: 'The Marlowe Band', tunecode: '181723CS' },
  { id: 'w22', title: 'Kites', artist: 'The Marlowe Band', tunecode: '188390EO' },
  { id: 'w23', title: 'Long Way Home', artist: 'The Marlowe Band', tunecode: '194058WA' },
  { id: 'w24', title: 'Roses in December', artist: 'Elif & The Echoes', tunecode: '179912MG' },
  { id: 'w25', title: 'Glasshouse', artist: 'Elif & The Echoes', tunecode: '185540PK' },
  { id: 'w26', title: 'Signal Fire', artist: 'Elif & The Echoes', tunecode: '191168QC' },
  { id: 'w27', title: 'Undertow', artist: 'Elif & The Echoes', tunecode: '196796RB' },
  { id: 'w28', title: 'Bloom', artist: 'Kofi Waves', tunecode: '202424SN' },
  { id: 'w29', title: 'Highlife Nights', artist: 'Kofi Waves', tunecode: '208052TF' },
  { id: 'w30', title: 'Accra to London', artist: 'Kofi Waves', tunecode: '213680UM' },
  { id: 'w31', title: 'Dance Like Nobody', artist: 'Kofi Waves', tunecode: '219308VD' },
  { id: 'w32', title: 'Lanterns', artist: 'Hana & the Tides', tunecode: '224936WV' },
  { id: 'w33', title: 'Paper Moon', artist: 'Hana & the Tides', tunecode: '230564XK' },
  { id: 'w34', title: 'Silver Thread', artist: 'Hana & the Tides', tunecode: '236192YJ' },
  { id: 'w35', title: 'Wildflower Motorway', artist: 'Hana & the Tides', tunecode: '241820ZH' },
  { id: 'w36', title: 'Concrete Garden', artist: 'Vies & Moreau', tunecode: '247448AG' },
  { id: 'w37', title: 'Après Minuit', artist: 'Vies & Moreau', tunecode: '253076BF' },
  { id: 'w38', title: 'Coastline', artist: 'Vies & Moreau', tunecode: '258704CE' },
  { id: 'w39', title: 'Statues', artist: 'Vies & Moreau', tunecode: '264332DD' },
  { id: 'w40', title: 'Last Train North', artist: 'Vies & Moreau', tunecode: '269960EC' },
]

const workById = (id: string) => eligibleWorks.find(w => w.id === id)

// ---- Registered performances ----
let nextId = 100
const performances = ref<Performance[]>([
  { id: 1, date: '2026-07-18', venue: { name: 'Village Underground', city: 'London' }, workIds: ['w1', 'w4', 'w5'], status: 'Registered' },
  { id: 2, date: '2026-06-27', venue: { name: 'Band on the Wall', city: 'Manchester' }, workIds: ['w3', 'w6'], status: 'Submitted' },
])

const worksPlayed = computed(() => new Set(performances.value.flatMap(p => p.workIds)).size)
const submittedCount = computed(() => performances.value.filter(p => p.status === 'Submitted').length)

const register = (draft: PerformanceDraft) => {
  if (!draft.venue) return
  performances.value.unshift({
    id: nextId++,
    date: draft.date,
    venue: draft.venue,
    workIds: [...draft.workIds],
    status: 'Submitted',
  })
  showToast('Live performance registered')
}

// Edit opens in place under the row. The registration form above keeps
// whatever is half-typed in it (Deepthi's concern from the review thread).
const editingId = ref<number | null>(null)
const toggleEdit = (id: number) => { editingId.value = editingId.value === id ? null : id }

const saveEdit = (id: number, draft: PerformanceDraft) => {
  const perf = performances.value.find(p => p.id === id)
  if (!perf || !draft.venue) return
  const changed = perf.date !== draft.date || perf.venue.name !== draft.venue.name
    || perf.workIds.length !== draft.workIds.length || perf.workIds.some(w => !draft.workIds.includes(w))
  perf.date = draft.date
  perf.venue = draft.venue
  perf.workIds = [...draft.workIds]
  if (changed) perf.status = 'Submitted'
  editingId.value = null
  showToast(changed ? 'Performance updated' : 'No changes made')
}

const deletePerformance = (id: number) => {
  if (editingId.value === id) editingId.value = null
  performances.value = performances.value.filter(p => p.id !== id)
  showToast('Performance removed')
}

// ---- Formatting ----
const formatDate = (iso: string) => new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const dayOf = (iso: string) => new Date(iso + 'T00:00:00').getDate()
const monthOf = (iso: string) => new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { month: 'short' })

// ---- Toast ----
const toast = ref('')
let toastTimer: ReturnType<typeof setTimeout> | undefined
const showToast = (msg: string) => {
  toast.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 3200)
}
</script>
