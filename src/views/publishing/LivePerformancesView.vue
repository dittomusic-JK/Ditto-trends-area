<template>
  <div class="space-y-6">
    <!-- Heading + demo plan switcher -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="font-satoshi font-black tracking-[-0.03em] text-xl text-ditto-text">Register Live Performances</h2>
        <p class="text-sm text-ditto-subtext mt-1">Register your live performances to claim publishing royalties.</p>
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

    <!-- ===== Pro / Label: registration form ===== -->
    <template v-else>
      <div class="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 lg:p-8">
        <div class="grid grid-cols-1 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] gap-6 lg:gap-10">
          <!-- Left column: when & where -->
          <div class="space-y-5">
          <!-- Date of performance -->
          <div>
            <label class="block text-xs font-medium text-ditto-subtext mb-1.5">Date of performance</label>
            <input
              v-model="form.date"
              type="date"
              :min="subscriptionStart"
              :max="today"
              class="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-ditto-text bg-white focus:outline-none focus:border-ditto-purple"
            />
            <p class="text-[11px] text-ditto-subtext mt-1.5">From the start of your subscription ({{ formatDate(subscriptionStart) }}) up to today.</p>
          </div>

          <!-- Venue (searchable) -->
          <div class="relative" ref="venueRef">
            <label class="block text-xs font-medium text-ditto-subtext mb-1.5">Venue</label>
            <div class="relative">
              <svg class="w-4 h-4 text-ditto-subtext absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                v-model="venueQuery"
                @focus="venueOpen = true"
                @input="venueOpen = true; form.venue = null"
                type="text"
                placeholder="Search for a venue"
                class="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm text-ditto-text bg-white focus:outline-none focus:border-ditto-purple"
              />
              <button v-if="form.venue" @click="clearVenue" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-ditto-subtext hover:text-ditto-text" aria-label="Clear venue">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/></svg>
              </button>
            </div>

            <!-- Dropdown -->
            <div v-if="venueOpen && venueQuery.trim() && !form.venue" class="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl z-30 py-1.5 max-h-56 overflow-y-auto">
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
            <p v-if="form.venue" class="text-[11px] text-success mt-1.5 flex items-center gap-1">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12" stroke-linecap="round" stroke-linejoin="round"/></svg>
              {{ form.venue.name }}{{ form.venue.city ? `, ${form.venue.city}` : '' }}
            </p>
          </div>
          </div>

          <!-- Right column: works performed (searchable listbox) -->
          <div>
            <div class="flex items-baseline justify-between gap-3 mb-1.5">
              <label class="block text-xs font-medium text-ditto-subtext">Works performed</label>
              <span class="text-[11px] text-ditto-subtext tabular-nums">
                {{ form.workIds.length > 0 ? `${form.workIds.length} of ${eligibleWorks.length} selected` : `${eligibleWorks.length} eligible works` }}
              </span>
            </div>

            <div :class="['rounded-xl border overflow-hidden transition-colors', form.venue ? 'border-gray-200' : 'border-gray-100']">
              <!-- Search -->
              <div :class="['relative border-b', form.venue ? 'border-gray-100' : 'border-gray-100 bg-ditto-light-grey/40']">
                <svg class="w-4 h-4 text-ditto-subtext absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  v-model="worksQuery"
                  :disabled="!form.venue"
                  type="text"
                  placeholder="Search your works by title, artist or Tunecode"
                  class="w-full pl-10 pr-3.5 py-2.5 text-sm text-ditto-text bg-transparent focus:outline-none placeholder:text-ditto-subtext/70 disabled:cursor-not-allowed"
                />
              </div>

              <!-- List -->
              <div class="max-h-[264px] overflow-y-auto">
                <p v-if="!form.venue" class="px-4 py-10 text-center text-xs text-ditto-subtext">
                  Select a venue first — then pick the works you performed.
                </p>
                <template v-else>
                  <button
                    v-for="work in filteredWorks" :key="work.id"
                    @click="toggleWork(work.id)"
                    class="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-ditto-light-grey transition-colors"
                  >
                    <span :class="['w-[18px] h-[18px] rounded border-2 flex items-center justify-center flex-shrink-0 transition-all', form.workIds.includes(work.id) ? 'bg-ditto-purple border-ditto-purple' : 'border-gray-300 bg-white']">
                      <svg v-if="form.workIds.includes(work.id)" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20,6 9,17 4,12" stroke-linecap="round" stroke-linejoin="round"/></svg>
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
              <div v-if="form.venue" class="flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-ditto-light-grey/30">
                <button
                  v-if="worksQuery.trim() && filteredWorks.length > 0"
                  @click="addAllShown"
                  class="text-[11px] font-medium text-ditto-purple hover:underline"
                >Add all {{ filteredWorks.length }} shown</button>
                <span v-else class="text-[11px] text-ditto-subtext">Registered works with a PRS Tunecode</span>
                <button
                  v-if="form.workIds.length > 0"
                  @click="form.workIds = []"
                  class="text-[11px] font-medium text-ditto-subtext hover:text-ditto-text"
                >Clear selection</button>
              </div>
            </div>

            <!-- Selected chips -->
            <div v-if="form.workIds.length > 0" class="flex flex-wrap gap-1.5 mt-2.5">
              <span
                v-for="id in form.workIds" :key="id"
                class="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full bg-ditto-purple/10 text-ditto-purple text-xs font-medium"
              >
                {{ workById(id)?.title }}
                <button @click="toggleWork(id)" class="hover:bg-ditto-purple/15 rounded-full p-0.5" aria-label="Remove work">
                  <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/></svg>
                </button>
              </span>
            </div>
          </div>
        </div>

        <!-- Register -->
        <div class="flex justify-end mt-5 pt-5 border-t border-gray-100">
          <button
            @click="register"
            :disabled="!canRegister"
            :class="[
              'px-6 py-2.5 text-sm font-medium rounded-full transition-all',
              canRegister ? 'bg-ditto-purple btn-pop-purple text-white hover:opacity-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            ]"
          >Register</button>
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
        <div v-else class="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-50">
          <div v-for="perf in performances" :key="perf.id" class="flex items-start gap-4 px-5 py-4">
            <!-- Date block -->
            <div class="w-12 text-center flex-shrink-0 pt-0.5">
              <p class="text-lg font-bold text-ditto-text leading-none">{{ dayOf(perf.date) }}</p>
              <p class="text-[10px] uppercase tracking-wide text-ditto-subtext mt-1">{{ monthOf(perf.date) }} {{ yearOf(perf.date) }}</p>
            </div>

            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-ditto-text">{{ perf.venue.name }} <span class="font-normal text-ditto-subtext">· {{ perf.venue.city }}</span></p>
              <div class="flex flex-wrap gap-1.5 mt-1.5">
                <span v-for="id in perf.workIds" :key="id" class="px-2 py-0.5 rounded-full bg-ditto-light-grey text-xs text-ditto-text">
                  {{ workById(id)?.title }}
                </span>
              </div>
            </div>

            <div class="flex items-center gap-2 flex-shrink-0">
              <StatusPill :variant="perf.status === 'Registered' ? 'success' : 'warning'" :label="perf.status" />
              <div class="relative group">
                <button @click="editPerformance(perf)" class="p-1.5 text-ditto-subtext hover:text-ditto-purple transition-colors" aria-label="Edit performance">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-ditto-text text-white text-[10px] rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">Edit</div>
              </div>
              <div class="relative group">
                <button @click="deletePerformance(perf.id)" class="p-1.5 text-error/70 hover:text-error transition-colors" aria-label="Delete performance">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                </button>
                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-ditto-text text-white text-[10px] rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">Delete</div>
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
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import StatusPill from '../../components/common/StatusPill.vue'

interface Venue { name: string; city: string; id?: string; category?: string; address?: string }
interface Work { id: string; title: string; artist: string; tunecode: string }
interface Performance { id: number; date: string; venue: Venue; workIds: string[]; status: 'Registered' | 'Submitted' }

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

// ---- Form state ----
const form = reactive<{ date: string; venue: Venue | null; workIds: string[] }>({
  date: '',
  venue: null,
  workIds: [],
})

const venueQuery = ref('')
const venueOpen = ref(false)
const worksQuery = ref('')
const venueRef = ref<HTMLElement | null>(null)

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
  for (const v of venues.value) {
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
  form.venue = venue
  venueQuery.value = venue.name
  venueOpen.value = false
}

const clearVenue = () => {
  form.venue = null
  venueQuery.value = ''
  form.workIds = []
  worksQuery.value = ''
}

const toggleWork = (id: string) => {
  const idx = form.workIds.indexOf(id)
  idx > -1 ? form.workIds.splice(idx, 1) : form.workIds.push(id)
}

// Works search: title, artist or tunecode, same accent-insensitive fold
const filteredWorks = computed(() => {
  const q = fold(worksQuery.value.trim())
  if (!q) return eligibleWorks
  return eligibleWorks.filter(w =>
    fold(w.title).includes(q) || fold(w.artist).includes(q) || fold(w.tunecode).includes(q)
  )
})

const addAllShown = () => {
  for (const w of filteredWorks.value) {
    if (!form.workIds.includes(w.id)) form.workIds.push(w.id)
  }
}

const dateValid = computed(() => !!form.date && form.date >= subscriptionStart && form.date <= today)
const canRegister = computed(() => dateValid.value && !!form.venue && form.workIds.length > 0)

// ---- Registered performances ----
let nextId = 100
const performances = ref<Performance[]>([
  { id: 1, date: '2026-07-18', venue: { name: 'Village Underground', city: 'London' }, workIds: ['w1', 'w4', 'w5'], status: 'Registered' },
  { id: 2, date: '2026-06-27', venue: { name: 'Band on the Wall', city: 'Manchester' }, workIds: ['w3', 'w6'], status: 'Submitted' },
])

const register = () => {
  if (!canRegister.value || !form.venue) return
  performances.value.unshift({
    id: nextId++,
    date: form.date,
    venue: form.venue,
    workIds: [...form.workIds],
    status: 'Submitted',
  })
  showToast('Live performance registered')
  form.date = ''
  clearVenue()
}

const editPerformance = (perf: Performance) => {
  form.date = perf.date
  form.venue = perf.venue
  venueQuery.value = perf.venue.name
  form.workIds = [...perf.workIds]
  performances.value = performances.value.filter(p => p.id !== perf.id)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const deletePerformance = (id: number) => {
  performances.value = performances.value.filter(p => p.id !== id)
  showToast('Performance removed')
}

// ---- Formatting ----
const formatDate = (iso: string) => new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const dayOf = (iso: string) => new Date(iso + 'T00:00:00').getDate()
const monthOf = (iso: string) => new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { month: 'short' })
const yearOf = (iso: string) => new Date(iso + 'T00:00:00').getFullYear().toString().slice(-2)

// ---- Toast + click-outside ----
const toast = ref('')
let toastTimer: ReturnType<typeof setTimeout> | undefined
const showToast = (msg: string) => {
  toast.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 3200)
}

const handleClickOutside = (e: MouseEvent) => {
  const t = e.target as Node
  if (venueRef.value && !venueRef.value.contains(t)) venueOpen.value = false
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>
