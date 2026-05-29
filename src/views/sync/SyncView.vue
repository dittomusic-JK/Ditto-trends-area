<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6 lg:px-16 lg:py-8 w-full max-w-full box-border">
    <!-- Header -->
    <h1 class="font-satoshi font-black text-xl sm:text-3xl lg:text-[42px] tracking-[-0.03em] text-ditto-text mb-2">
      Apply for Sync <span>🎬</span>
    </h1>
    <p class="text-base text-ditto-subtext max-w-2xl mb-6">
      Pitch your music for film, TV, advertising and games. Browse live briefs from music supervisors and submit your tracks directly.
    </p>

    <!-- Hero banner -->
    <div class="rounded-2xl p-6 lg:p-8 mb-8 relative overflow-hidden text-white" style="background: linear-gradient(120deg, #5f1fff 0%, #8640f4 55%, #a855f7 100%)">
      <div class="absolute -right-8 -top-10 w-44 h-44 rounded-full bg-white/10"></div>
      <div class="absolute right-24 -bottom-20 w-48 h-48 rounded-full bg-white/10"></div>
      <div class="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p class="text-lg sm:text-2xl font-satoshi font-black tracking-[-0.03em] mb-1.5">Get your music on screen</p>
          <p class="text-sm sm:text-base text-white/85 max-w-xl">Sync placements can earn upfront fees plus ongoing royalties. New briefs are added every week — submit early to stand out.</p>
        </div>
        <button class="flex-shrink-0 px-5 py-2.5 bg-white text-ditto-purple text-sm font-semibold rounded-full hover:bg-white/90 transition-colors">
          How sync works
        </button>
      </div>
    </div>

    <!-- Directory toolbar -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-2">
      <h2 class="font-satoshi font-black tracking-[-0.03em] text-xl sm:text-2xl text-ditto-text">Brief Directory</h2>
      <div class="relative w-full lg:w-80">
        <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Search briefs or genres..."
          class="w-full pl-10 pr-3 py-2.5 text-sm rounded-full border border-gray-200 bg-white text-ditto-text placeholder:text-ditto-subtext focus:border-ditto-purple/50 transition-colors"
        />
      </div>
    </div>

    <!-- Category filters -->
    <div class="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 py-3 mb-3">
      <button
        v-for="cat in categories" :key="cat"
        @click="activeCategory = cat"
        :class="['px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors', activeCategory === cat ? 'bg-ditto-text text-white' : 'bg-ditto-light-grey text-ditto-text hover:bg-ditto-light-grey/70']"
      >{{ cat }}</button>
    </div>

    <!-- Directory grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      <button
        v-for="opp in filtered" :key="opp.id"
        @click="open(opp.id)"
        class="group text-left bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
      >
        <!-- Cover image -->
        <div class="relative h-32 overflow-hidden">
          <img :src="opp.cover" alt="" class="absolute inset-0 w-full h-full object-cover" />
          <div class="absolute inset-0 opacity-60 mix-blend-multiply" :style="{ background: categoryGradient(opp.category) }"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          <span class="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/90 text-ditto-text">{{ opp.category }}</span>
          <span :class="['absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1', opp.urgent ? 'bg-error text-white' : 'bg-white/90 text-ditto-text']">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" stroke-linecap="round"/></svg>
            {{ opp.daysLeft }}d
          </span>
        </div>

        <!-- Body -->
        <div class="px-5 pb-5 pt-7 relative">
          <!-- Overlapping icon -->
          <div class="absolute -top-7 left-5 w-14 h-14 rounded-2xl bg-white shadow-md ring-1 ring-gray-100 flex items-center justify-center text-2xl">
            {{ categoryEmoji(opp.category) }}
          </div>
          <h3 class="font-satoshi font-bold tracking-[-0.02em] text-lg text-ditto-text leading-snug mb-1.5 group-hover:text-ditto-purple transition-colors">{{ opp.title }}</h3>
          <p class="text-sm text-ditto-subtext line-clamp-2 mb-4">{{ opp.description }}</p>
          <div class="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <p class="text-[11px] text-ditto-subtext">Budget</p>
              <p class="text-sm font-bold text-ditto-text">{{ opp.budget }}</p>
            </div>
            <div class="flex items-center gap-1.5">
              <span v-for="tag in opp.tags.slice(0, 2)" :key="tag" class="text-[11px] px-2.5 py-1 rounded-full bg-ditto-light-grey text-ditto-subtext">{{ tag }}</span>
            </div>
          </div>
        </div>
      </button>
    </div>

    <div v-if="filtered.length === 0" class="text-center py-16 text-base text-ditto-subtext">
      No briefs match your filters.
    </div>

    <!-- Detail modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showDetail && selected" class="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center sm:p-4" @click.self="showDetail = false">
          <div class="bg-white w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto scrollbar-hide rounded-t-3xl sm:rounded-2xl relative">
            <button @click="showDetail = false" class="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 text-ditto-text hover:bg-white shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <SyncDetail :opp="selected" @apply="showApply = true" />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Apply modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showApply && selected" class="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" @click.self="closeApply">
          <div class="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <!-- Header -->
            <div class="p-5 border-b border-gray-200">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-xs text-ditto-subtext mb-0.5">Submit to</p>
                  <h2 class="font-satoshi font-black tracking-[-0.03em] text-lg text-ditto-text leading-snug">{{ selected.title }}</h2>
                </div>
                <button @click="closeApply" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-ditto-light-grey text-ditto-subtext flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>

            <!-- Body -->
            <div v-if="!submitted" class="p-5 overflow-y-auto scrollbar-hide">
              <p class="text-sm font-semibold text-ditto-text mb-3">Choose a track to pitch</p>
              <div class="space-y-2">
                <label
                  v-for="track in myTracks" :key="track.id"
                  :class="['flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors', chosenTrack === track.id ? 'border-ditto-purple bg-ditto-purple/5' : 'border-gray-200 hover:border-ditto-purple/40']"
                >
                  <input type="radio" name="track" :value="track.id" v-model="chosenTrack" class="sr-only" />
                  <span :class="['w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center', chosenTrack === track.id ? 'border-ditto-purple' : 'border-gray-300']">
                    <span v-if="chosenTrack === track.id" class="w-2 h-2 rounded-full bg-ditto-purple"></span>
                  </span>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-ditto-text truncate">{{ track.title }}</p>
                    <p class="text-xs text-ditto-subtext truncate">{{ track.artist }}</p>
                  </div>
                </label>
              </div>
              <p class="text-[11px] text-ditto-subtext mt-3 italic">We do not accept AI-generated music for sync opportunities.</p>
            </div>

            <!-- Success state -->
            <div v-else class="p-8 text-center">
              <div class="w-14 h-14 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
                <svg class="w-7 h-7 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <p class="font-satoshi font-black tracking-[-0.03em] text-lg text-ditto-text mb-1">Track submitted!</p>
              <p class="text-sm text-ditto-subtext">We'll let you know if the supervisor shortlists your track.</p>
            </div>

            <!-- Footer -->
            <div v-if="!submitted" class="p-5 border-t border-gray-200 flex items-center gap-3">
              <button @click="closeApply" class="flex-1 px-4 py-2.5 text-sm font-medium text-ditto-text rounded-full border border-gray-200 hover:bg-ditto-light-grey transition-colors">Cancel</button>
              <button
                @click="submit"
                :disabled="chosenTrack === null"
                class="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-full bg-ditto-purple hover:bg-ditto-purple/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >Submit Track</button>
            </div>
            <div v-else class="p-5 border-t border-gray-200">
              <button @click="closeApply" class="w-full px-4 py-2.5 text-sm font-semibold text-white rounded-full bg-ditto-purple hover:bg-ditto-purple/90 transition-colors">Done</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SyncDetail from './SyncDetail.vue'
import { categoryGradient, categoryEmoji, type SyncOpp } from './syncTypes'

const categories = ['All', 'Advertising', 'Film', 'TV Series', 'Gaming', 'Trailer']
const activeCategory = ref('All')
const search = ref('')

const opportunities: SyncOpp[] = [
  { id: 1, title: 'Upbeat Instrumentals for Football Campaign', description: 'Upbeat, dynamic tracks to support a lighthearted football campaign focused on ease and energy. Open to genre as long as it feels fresh and engaging rather than overly polished.', category: 'Advertising', deadline: 'April 24, 2026', daysLeft: 3, urgent: true, reference: 'Phoenix — Lisztomania', budget: '£3k–5k', usage: 'TV + Online · 6 months · UK', tags: ['football', 'upbeat', 'energetic'], cover: '/img/sync-pop.jpg' },
  { id: 2, title: 'Recognisable Anthem Tracks for Reimagined Campaign', description: 'A recognisable track to be re-recorded and reimagined for a campaign film. The music needs to feel bold, iconic and emotionally resonant.', category: 'Advertising', deadline: 'April 28, 2026', daysLeft: 7, urgent: true, reference: null, budget: '£8k–12k', usage: 'All media · 12 months · Worldwide', tags: ['recognisable', 'anthem', 'classic'], cover: '/img/sync-live.jpg' },
  { id: 3, title: 'Bold UK Electronic & House for Women\'s Sport Film', description: 'Modern UK electronic or house tracks to drive a long-form film celebrating women\'s sport. Must feel empowering, bold and cinematic.', category: 'Film', deadline: 'April 28, 2026', daysLeft: 7, urgent: true, reference: null, budget: '£5k–7k', usage: 'Festival + Online · Perpetual · Worldwide', tags: ['electronic', 'house', 'empowering'], cover: '/img/sync-cinematic.jpg' },
  { id: 4, title: 'Netflix Drama Series — Urban / Afrobeats', description: 'High-energy Afrobeats and urban tracks for a new Netflix original drama series. Must be upbeat with strong hooks and authentic production.', category: 'TV Series', deadline: 'May 15, 2026', daysLeft: 24, urgent: false, reference: 'Burna Boy — Last Last', budget: '£10k–15k', usage: 'Streaming · 5 years · Worldwide', tags: ['afrobeats', 'urban', 'drama'], cover: '/img/sync-live.jpg' },
  { id: 5, title: 'Sports Brand Campaign — Motivational', description: 'Major sports brand seeking motivational tracks with driving energy for their summer campaign. Instrumental or vocal accepted.', category: 'Advertising', deadline: 'May 20, 2026', daysLeft: 29, urgent: false, reference: null, budget: '£6k–9k', usage: 'TV + Social · 12 months · EU', tags: ['motivational', 'sports', 'energy'], cover: '/img/sync-pop.jpg' },
  { id: 6, title: 'Indie Film Soundtrack — Emotional R&B', description: 'Independent film production looking for soulful R&B and emotional tracks for key scenes. Stripped-back production preferred with strong vocal performance.', category: 'Film', deadline: 'June 1, 2026', daysLeft: 41, urgent: false, reference: 'SZA — Kill Bill', budget: '£2k–4k', usage: 'Festival + VOD · Perpetual · Worldwide', tags: ['R&B', 'emotional', 'indie'], cover: '/img/sync-cinematic.jpg' },
  { id: 7, title: 'AAA Racing Game — High-Tempo Electronic', description: 'Console racing title needs high-tempo electronic and drum & bass cuts for race sequences and menus. Loop-friendly arrangements a plus.', category: 'Gaming', deadline: 'June 10, 2026', daysLeft: 50, urgent: false, reference: 'The Prodigy — Spitfire', budget: '£4k–6k', usage: 'In-game · Perpetual · Worldwide', tags: ['DnB', 'electronic', 'high-tempo'], cover: '/img/sync-live.jpg' },
  { id: 8, title: 'Cinema Trailer — Epic Hybrid Orchestral', description: 'Trailer house seeking epic hybrid orchestral builds with big percussion and tension risers for a major theatrical trailer.', category: 'Trailer', deadline: 'May 5, 2026', daysLeft: 14, urgent: false, reference: null, budget: '£7k–10k', usage: 'Theatrical + Online · 6 months · Worldwide', tags: ['orchestral', 'epic', 'cinematic'], cover: '/img/sync-cinematic.jpg' },
]

const myTracks = [
  { id: 1, title: 'Solar', artist: 'Darkoo & Ruger' },
  { id: 2, title: 'Like Dat', artist: 'Darkoo' },
  { id: 3, title: 'Focus On Me', artist: 'Darkoo' },
  { id: 4, title: 'Right Now', artist: 'Darkoo, Davido & Rvssian' },
]

const filtered = computed(() =>
  opportunities.filter(o => {
    const matchCat = activeCategory.value === 'All' || o.category === activeCategory.value
    const q = search.value.trim().toLowerCase()
    const matchSearch = q === '' || o.title.toLowerCase().includes(q) || o.tags.some(t => t.toLowerCase().includes(q))
    return matchCat && matchSearch
  })
)

const selectedId = ref<number | null>(null)
const selected = computed(() => opportunities.find(o => o.id === selectedId.value) ?? null)
const showDetail = ref(false)

const open = (id: number) => {
  selectedId.value = id
  showDetail.value = true
}

// Apply flow
const showApply = ref(false)
const chosenTrack = ref<number | null>(null)
const submitted = ref(false)

const submit = () => { submitted.value = true }
const closeApply = () => {
  showApply.value = false
  setTimeout(() => { submitted.value = false; chosenTrack.value = null }, 200)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-enter-active > div, .fade-leave-active > div { transition: transform 0.25s ease; }
.fade-enter-from > div, .fade-leave-to > div { transform: translateY(12px); }
</style>
