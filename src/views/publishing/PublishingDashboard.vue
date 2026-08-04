<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6 lg:px-16 lg:py-8 w-full max-w-full box-border">
    <!-- Header -->
    <h1 class="font-satoshi font-black text-xl sm:text-3xl lg:text-[42px] tracking-[-0.03em] text-ditto-text mb-6">
      Publishing <span>📝</span>
    </h1>

    <!-- Sub Nav -->
    <div class="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
      <LiquidTabs :tabs="tabs" :active="activeTab" @select="activeTab = $event" />
    </div>

    <!-- ===================== Overview ===================== -->
    <div v-if="activeTab === 'overview'" class="space-y-10">
      <!-- Hero + stats -->
      <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-4">
        <!-- Hero -->
        <div class="rounded-2xl bg-[#0d1230] text-white overflow-hidden flex flex-col sm:flex-row items-center">
          <img src="/img/pub-hero-royalties.png" alt="" class="w-full sm:w-[45%] max-w-[380px] p-6 sm:p-8 select-none pointer-events-none" />
          <!-- Lime-only card: highlight word + conversion CTA (never pair lime with purple in one card) -->
          <div class="flex-1 px-6 pb-8 sm:py-10 sm:pr-10 text-center sm:text-left">
            <h2 class="font-satoshi text-2xl tracking-[-0.02em]">
              <span class="font-normal">Register a new</span> <span class="font-black">Musical Work.</span>
            </h2>
            <p class="text-sm text-white/70 mt-2 max-w-xs mx-auto sm:mx-0">
              Add &amp; register tracks from your release library to claim publishing royalties.
            </p>
            <button @click="startAddWork" class="mt-5 px-6 py-2.5 bg-[#E6FF3A] text-[#0a0a0a] text-sm font-bold rounded-full hover:-translate-y-0.5 transition-transform">
              Register Song
            </button>
          </div>
        </div>

        <!-- Stat pills: ink cards with lime lead stats (brand: "lead stats… on dark backgrounds") -->
        <div class="flex flex-col gap-4">
          <div class="flex-1 bg-[#141414] rounded-2xl px-5 flex items-center gap-4 py-5">
            <span class="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <img src="/img/pub-works-approved.svg" alt="" class="w-7 h-7" />
            </span>
            <div>
              <p class="text-xs text-white/60">Works Approved</p>
              <p class="text-3xl font-bold text-[#E6FF3A] leading-tight">24</p>
              <p class="text-[11px] text-white/50 mt-0.5">Across all territories</p>
            </div>
          </div>
          <div class="flex-1 bg-[#141414] rounded-2xl px-5 flex items-center gap-4 py-5">
            <span class="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <img src="/img/pub-catalog-registered.svg" alt="" class="w-7 h-7" />
            </span>
            <div class="flex-1 min-w-0">
              <p class="text-xs text-white/60">Catalog Registered</p>
              <p class="text-3xl font-bold text-[#E6FF3A] leading-tight">33 <span class="text-base font-normal text-white/50">/ 64</span></p>
              <div class="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div class="h-full rounded-full bg-[#E6FF3A]" :style="{ width: `${Math.round((33 / 64) * 100)}%` }"></div>
              </div>
              <p class="text-[11px] text-white/50 mt-1.5">{{ Math.round((33 / 64) * 100) }}% of your catalog registered</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action cards -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          v-for="card in actionCards" :key="card.title"
          class="relative bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group"
          @click="card.go()"
        >
          <span v-if="card.tag" class="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-[#0a0a0a] text-white text-[11px] font-bold uppercase tracking-[1.8px]">{{ card.tag }}</span>
          <span class="w-24 h-24 rounded-xl bg-ditto-light-grey flex items-center justify-center flex-shrink-0">
            <img v-if="card.image" :src="card.image" alt="" class="w-12 h-12" />
            <svg v-else class="w-10 h-10 text-ditto-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>
            </svg>
          </span>
          <div class="min-w-0">
            <h3 class="font-satoshi font-bold tracking-[-0.03em] text-base text-ditto-text mb-1">
              <span v-html="card.heading"></span>
            </h3>
            <p class="text-xs text-ditto-subtext mb-3">{{ card.blurb }}</p>
            <span class="inline-block px-5 py-2 bg-ditto-purple text-white text-sm font-medium rounded-full group-hover:opacity-95 transition-opacity">{{ card.cta }}</span>
          </div>
        </div>
      </div>

      <!-- Upgrade banner -->
      <!-- Brand: dark surface + lime accent (lime never pairs with purple in one card) -->
      <div class="rounded-2xl p-5 lg:p-6 bg-gradient-to-br from-[#4a4a56] via-[#1c1c24] to-[#0a0a0a] text-white flex flex-col sm:flex-row sm:items-center gap-4 shadow-lg shadow-black/25">
        <span class="w-12 h-12 rounded-full bg-[#E6FF3A]/15 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-[#E6FF3A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
        </span>
        <div class="flex-1">
          <p class="text-sm font-bold mb-1">Claim up to <span class="text-[#E6FF3A]">20% more royalties</span></p>
          <p class="text-xs text-white/70">Register tracks from your release library to claim publishing royalties. Access exclusive sync opportunities to get your music on TV, movies and more.</p>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <button class="px-5 py-2 bg-[#E6FF3A] text-[#0a0a0a] text-sm font-bold rounded-full hover:-translate-y-0.5 transition-transform">Pick a Plan</button>
          <button class="px-4 py-2 text-sm font-medium text-white/85 hover:text-white hover:underline">Find out more</button>
        </div>
      </div>

      <!-- Learn more (editorial) -->
      <div>
        <h3 class="font-satoshi text-2xl tracking-[-0.02em] text-ditto-text mb-5">
          <span class="font-normal">Learn more about</span> <span class="font-black text-[#4A00FF]">Music Publishing</span>
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            v-for="article in articles" :key="article.title"
            href="#"
            class="group rounded-2xl overflow-hidden bg-white border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div class="aspect-[16/9] overflow-hidden">
              <img :src="article.image" alt="" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
            </div>
            <div class="p-5">
              <p class="text-sm font-bold text-ditto-text group-hover:text-ditto-purple transition-colors">{{ article.title }}</p>
              <p class="text-xs text-ditto-subtext mt-1.5">{{ article.excerpt }}</p>
            </div>
          </a>
        </div>
      </div>
    </div>

    <!-- ===================== Add a new work ===================== -->
    <div v-else-if="activeTab === 'works' && addingWork" class="space-y-5">
      <div class="flex items-center justify-between gap-3">
        <h2 class="font-satoshi text-xl tracking-[-0.02em] text-ditto-text">
          <span class="font-normal">Register a new</span> <span class="font-black">Musical Work</span>
        </h2>
        <button @click="addingWork = false" class="flex items-center gap-1.5 text-sm text-ditto-purple hover:text-ditto-purple/80 transition-colors">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Back to My Works
        </button>
      </div>
      <AddWorkView @registered="handleWorkRegistered" />
    </div>

    <!-- ===================== My Works ===================== -->
    <div v-else-if="activeTab === 'works'" class="space-y-5">
      <div class="flex items-center justify-between gap-3">
        <h2 class="font-satoshi font-black tracking-[-0.03em] text-xl text-ditto-text">
          My Works <span class="font-normal text-ditto-subtext text-base">({{ works.length }})</span>
        </h2>
        <button @click="addingWork = true" class="px-5 py-2.5 bg-ditto-purple btn-pop-purple text-white text-sm font-medium rounded-full hover:opacity-95 transition-all">
          + Add a new work
        </button>
      </div>

      <!-- Search + status filter (canonical LiquidTabs, as on Music → Your Releases) -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <LiquidTabs
          :tabs="workFilters.map(f => ({ id: f, label: f }))"
          :active="workFilter"
          @select="workFilter = $event as typeof workFilters[number]"
        />
        <SearchInput v-model="worksSearch" placeholder="Search for a work" />
      </div>

      <!-- Works list -->
      <div class="space-y-1">
        <!-- Column headers (desktop) -->
        <div class="hidden lg:grid grid-cols-[minmax(0,1fr)_90px_90px_150px_130px] gap-4 px-4 py-3 text-xs text-ditto-subtext">
          <span>Title</span>
          <span class="text-center">Writers</span>
          <span class="text-center">Duration</span>
          <span>Status</span>
          <span></span>
        </div>

        <div
          v-for="work in filteredWorks" :key="work.id"
          :class="[
            'rounded-2xl transition-colors',
            expandedWorks.has(work.id) ? 'bg-ditto-light-grey' : 'hover:bg-ditto-light-grey'
          ]"
        >
          <!-- Row -->
          <button class="w-full grid grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1fr)_90px_90px_150px_130px] items-center gap-4 px-4 py-4 text-left" @click="toggleExpanded(work.id)">
            <span class="min-w-0">
              <span class="block text-sm font-semibold text-ditto-text truncate">{{ work.title }}</span>
              <span class="block text-xs text-ditto-subtext lg:hidden">{{ work.writers.length }} writer{{ work.writers.length === 1 ? '' : 's' }} · {{ work.duration }}</span>
            </span>
            <span class="hidden lg:block text-sm text-ditto-purple text-center">{{ work.writers.length }}</span>
            <span class="hidden lg:block text-sm text-ditto-subtext text-center tabular-nums">{{ work.duration }}</span>
            <span class="hidden lg:block">
              <StatusPill :variant="statusVariant(work.status)" :label="work.status" />
            </span>
            <span class="justify-self-end">
              <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-ditto-purple/40 text-xs font-medium text-ditto-purple bg-white">
                {{ expandedWorks.has(work.id) ? 'Less details' : 'More details' }}
                <svg :class="['w-3 h-3 transition-transform', expandedWorks.has(work.id) ? 'rotate-180' : '']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6,9 12,15 18,9" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
            </span>
          </button>

          <!-- Expanded details -->
          <div v-if="expandedWorks.has(work.id)" class="px-4 pb-5 space-y-5">
            <div class="border-t border-ditto-text/10 pt-4">
              <p class="text-xs font-semibold text-ditto-text mb-2.5">Writer(s) / Composer(s)</p>
              <div class="overflow-x-auto">
                <table class="w-full text-left min-w-[640px] border-separate [border-spacing:0_4px]">
                  <thead>
                    <tr class="text-[10px] uppercase tracking-wider text-ditto-subtext">
                      <th class="font-medium pb-2 pr-4">Legal name</th>
                      <th class="font-medium pb-2 pr-4">Email</th>
                      <th class="font-medium pb-2 pr-4">Writer role</th>
                      <th class="font-medium pb-2 pr-4">Controlled</th>
                      <th class="font-medium pb-2 pr-4">IPI/CAE</th>
                      <th class="font-medium pb-2 pr-4 text-right">Share</th>
                      <th class="font-medium pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="w in work.writers" :key="w.email" class="bg-white">
                      <td class="text-sm font-medium text-ditto-text py-2.5 px-4 rounded-l-xl">{{ w.legalName }}</td>
                      <td class="text-xs text-ditto-subtext py-2.5 pr-4">{{ w.email }}</td>
                      <td class="text-xs text-ditto-text py-2.5 pr-4">{{ w.role }}</td>
                      <td class="text-xs text-ditto-text py-2.5 pr-4">{{ w.controlled ? 'Yes' : 'No' }}</td>
                      <td class="text-xs text-ditto-subtext font-mono py-2.5 pr-4">{{ w.ipi }}</td>
                      <td class="text-sm font-bold text-ditto-text py-2.5 pr-4 text-right tabular-nums">{{ w.share }}%</td>
                      <td class="py-2.5 pr-4 rounded-r-xl">
                        <StatusPill :variant="w.status === 'Accepted' ? 'success' : 'warning'" :label="w.status" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <p class="text-xs font-semibold text-ditto-text mb-2.5">Society work codes</p>
              <div v-if="work.societyCodes.length > 0" class="overflow-x-auto">
                <table class="w-full text-left min-w-[520px] border-separate [border-spacing:0_4px]">
                  <thead>
                    <tr class="text-[10px] uppercase tracking-wider text-ditto-subtext">
                      <th class="font-medium pb-2 pr-4">Society</th>
                      <th class="font-medium pb-2 pr-4">Work code</th>
                      <th class="font-medium pb-2 pr-4">Status</th>
                      <th class="font-medium pb-2">Registration date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="c in work.societyCodes" :key="c.society + c.code" class="bg-white">
                      <td class="text-sm font-medium text-ditto-text py-2.5 px-4 rounded-l-xl">{{ c.society }}</td>
                      <td class="text-xs text-ditto-subtext font-mono py-2.5 pr-4">{{ c.code }}</td>
                      <td class="py-2.5 pr-4"><StatusPill variant="success" :label="c.status" /></td>
                      <td class="text-xs text-ditto-subtext py-2.5 pr-4 rounded-r-xl">{{ c.date }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p v-else class="text-xs text-ditto-subtext">No society registrations yet — codes appear here once societies accept the work.</p>
            </div>
          </div>
        </div>

        <p v-if="filteredWorks.length === 0" class="text-center text-sm text-ditto-subtext py-10">
          {{ worksSearch ? `No works match "${worksSearch}".` : `No ${workFilter.toLowerCase()} works.` }}
        </p>
      </div>
    </div>

    <!-- ===================== Co-writers ===================== -->
    <div v-else-if="activeTab === 'cowriters'" class="space-y-6">
      <div class="flex items-center justify-between gap-3">
        <h2 class="font-satoshi font-black tracking-[-0.03em] text-xl text-ditto-text">Co-writers</h2>
      </div>

      <!-- Writer identity card -->
      <div class="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col sm:flex-row sm:items-center gap-5">
        <span class="w-14 h-14 rounded-full bg-success/15 flex items-center justify-center flex-shrink-0">
          <svg class="w-7 h-7 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        <div class="flex-1">
          <h3 class="font-satoshi font-black tracking-[-0.03em] text-lg text-ditto-text">Your co-writer account is set up</h3>
          <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 mt-1.5">
            <p class="text-sm text-ditto-subtext">Registered as <span class="font-semibold text-ditto-text">Amara Okoye</span></p>
            <p class="text-sm text-ditto-subtext">IPI/CAE <span class="font-mono text-ditto-text">00844299503</span></p>
          </div>
        </div>
        <button class="px-5 py-2.5 border border-ditto-purple/40 text-ditto-purple text-sm font-medium rounded-full hover:bg-ditto-purple/5 transition-colors flex-shrink-0">
          Invite a co-writer
        </button>
      </div>

      <!-- Musical works with your share -->
      <div>
        <h3 class="font-satoshi text-lg tracking-[-0.02em] text-ditto-text mb-4">
          <span class="font-normal">Your</span> <span class="font-black">Musical Works</span>
        </h3>
        <div class="space-y-1">
          <div class="hidden lg:grid grid-cols-[minmax(0,1fr)_130px_140px_70px_80px_110px_minmax(0,1fr)] gap-4 px-4 py-3 text-xs text-ditto-subtext">
            <span>Musical work</span>
            <span>ISRC</span>
            <span>Artist</span>
            <span class="text-center">Writers</span>
            <span class="text-right">Your share</span>
            <span>Status</span>
            <span>Work codes</span>
          </div>
          <div
            v-for="work in works" :key="'cw-' + work.id"
            class="rounded-2xl hover:bg-ditto-light-grey transition-colors grid grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1fr)_130px_140px_70px_80px_110px_minmax(0,1fr)] items-center gap-4 px-4 py-4"
          >
            <span class="min-w-0">
              <span class="block text-sm font-semibold text-ditto-text truncate">{{ work.title }}</span>
              <span class="block text-xs text-ditto-subtext lg:hidden">{{ work.artist }} · {{ yourShare(work) }}% share</span>
            </span>
            <span class="hidden lg:block text-xs text-ditto-subtext font-mono">{{ work.isrc }}</span>
            <span class="hidden lg:block text-sm text-ditto-subtext truncate">{{ work.artist }}</span>
            <span class="hidden lg:block text-sm text-ditto-purple text-center">{{ work.writers.length }}</span>
            <span class="hidden lg:block text-sm font-bold text-ditto-text text-right tabular-nums">{{ yourShare(work) }}%</span>
            <span class="hidden lg:block">
              <StatusPill :variant="statusVariant(work.status)" :label="work.status === 'Accepted' ? 'Registered' : work.status" />
            </span>
            <span class="hidden lg:flex flex-wrap gap-1">
              <span
                v-for="c in work.societyCodes" :key="'chip-' + work.id + c.society"
                class="px-2 py-0.5 rounded-full bg-white text-[10px] font-semibold text-ditto-purple"
              >{{ c.society }}</span>
              <span v-if="work.societyCodes.length === 0" class="text-xs text-ditto-subtext">—</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ===================== Register Live Performances ===================== -->
    <LivePerformancesView v-else-if="activeTab === 'live'" />

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
import { ref, computed, watch } from 'vue'
import type { AppSection } from '../../types'
import LiquidTabs from '../../components/common/LiquidTabs.vue'
import SearchInput from '../../components/common/SearchInput.vue'
import StatusPill from '../../components/common/StatusPill.vue'
import LivePerformancesView from './LivePerformancesView.vue'
import AddWorkView, { type NewWorkPayload } from './AddWorkView.vue'

const props = defineProps<{
  openLive?: boolean
}>()

const emit = defineEmits<{
  (e: 'navigate', section: AppSection): void
  (e: 'live-consumed'): void
}>()

const activeTab = ref('overview')

// Open the live-performances tab when requested from the global nav.
watch(() => props.openLive, (requested) => {
  if (requested) {
    activeTab.value = 'live'
    emit('live-consumed')
  }
}, { immediate: true })

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'works', label: 'My Works' },
  { id: 'cowriters', label: 'Co-writers' },
  { id: 'live', label: 'Register Live Performances' },
]

// ---- Works: composer/writer-centric (unlike the artist-centric music catalog) ----
interface WorkWriter { legalName: string; email: string; role: string; controlled: boolean; ipi: string; share: number; status: 'Accepted' | 'Pending' }
interface SocietyCode { society: string; code: string; status: string; date: string }
interface Work {
  id: number
  title: string
  isrc: string
  artist: string
  duration: string
  status: 'Accepted' | 'Submitted' | 'Rejected'
  writers: WorkWriter[]
  societyCodes: SocietyCode[]
}

// The logged-in user's writer identity (shown on Co-writers)
const ME = 'amara.okoye@example.com'

const works = ref<Work[]>([
  {
    id: 1, title: 'Solar', isrc: 'GBDHC2600012', artist: 'Darkoo & Ruger', duration: '02:43', status: 'Accepted',
    writers: [
      { legalName: 'Amara Okoye', email: ME, role: 'Composer/Author', controlled: true, ipi: '00844299503', share: 60, status: 'Accepted' },
      { legalName: 'Ruben Adeyemi', email: 'ruben.adeyemi@example.com', role: 'Composer', controlled: false, ipi: '00791122834', share: 40, status: 'Accepted' },
    ],
    societyCodes: [
      { society: 'PRS/MCPS', code: '203481KV', status: 'Accepted', date: '21 June 2026' },
      { society: 'ASCAP', code: '911763772', status: 'Accepted', date: '28 June 2026' },
      { society: 'ICE', code: 'IC88231945', status: 'Accepted', date: '2 July 2026' },
    ],
  },
  {
    id: 2, title: 'My Baby (Obimo)', isrc: 'GBDHC2600045', artist: 'Almost Joey', duration: '03:12', status: 'Accepted',
    writers: [
      { legalName: 'Amara Okoye', email: ME, role: 'Author (Lyrics only)', controlled: true, ipi: '00844299503', share: 100, status: 'Accepted' },
    ],
    societyCodes: [
      { society: 'PRS/MCPS', code: '198237DM', status: 'Accepted', date: '3 May 2026' },
      { society: 'BMI', code: '67281944', status: 'Accepted', date: '12 May 2026' },
    ],
  },
  {
    id: 3, title: 'Favourite Girl', isrc: 'GBDHC2400187', artist: 'Darkoo & Dess Dior', duration: '02:58', status: 'Accepted',
    writers: [
      { legalName: 'Amara Okoye', email: ME, role: 'Composer/Author', controlled: true, ipi: '00844299503', share: 34, status: 'Accepted' },
      { legalName: 'Desiree Diallo', email: 'dess.diallo@example.com', role: 'Author', controlled: false, ipi: '00822547719', share: 33, status: 'Accepted' },
      { legalName: 'Theo Marchant', email: 'theo.marchant@example.com', role: 'Composer', controlled: false, ipi: '00815563308', share: 33, status: 'Accepted' },
    ],
    societyCodes: [
      { society: 'PRS/MCPS', code: '175920QT', status: 'Accepted', date: '19 Feb 2026' },
      { society: 'APRA/AMCOS', code: 'GW44192053', status: 'Accepted', date: '1 Mar 2026' },
    ],
  },
  {
    id: 4, title: 'RHUDE GYAL!', isrc: 'GBDHC2500092', artist: 'Darkoo & JELEEL!', duration: '02:21', status: 'Submitted',
    writers: [
      { legalName: 'Amara Okoye', email: ME, role: 'Composer/Author', controlled: true, ipi: '00844299503', share: 50, status: 'Accepted' },
      { legalName: 'Jamal Eleel', email: 'jamal.eleel@example.com', role: 'Author', controlled: false, ipi: '00873310296', share: 50, status: 'Pending' },
    ],
    societyCodes: [],
  },
  {
    id: 5, title: 'Like Dat', isrc: 'GBDHC2500041', artist: 'Darkoo', duration: '02:36', status: 'Accepted',
    writers: [
      { legalName: 'Amara Okoye', email: ME, role: 'Composer/Author', controlled: true, ipi: '00844299503', share: 100, status: 'Accepted' },
    ],
    societyCodes: [
      { society: 'PRS/MCPS', code: '188463PL', status: 'Accepted', date: '30 Apr 2026' },
      { society: 'MLC', code: 'ML5522871', status: 'Accepted', date: '8 May 2026' },
    ],
  },
  {
    id: 6, title: 'Your Number', isrc: 'GBDHC2500118', artist: 'Darkoo', duration: '02:49', status: 'Submitted',
    writers: [
      { legalName: 'Amara Okoye', email: ME, role: 'Composer', controlled: true, ipi: '00844299503', share: 70, status: 'Accepted' },
      { legalName: 'Ruben Adeyemi', email: 'ruben.adeyemi@example.com', role: 'Author', controlled: false, ipi: '00791122834', share: 30, status: 'Pending' },
    ],
    societyCodes: [],
  },
  {
    id: 7, title: 'Focus On Me', isrc: 'GBDHC2500073', artist: 'Darkoo', duration: '03:05', status: 'Accepted',
    writers: [
      { legalName: 'Amara Okoye', email: ME, role: 'Composer/Author', controlled: true, ipi: '00844299503', share: 100, status: 'Accepted' },
    ],
    societyCodes: [
      { society: 'PRS/MCPS', code: '191058WC', status: 'Accepted', date: '11 Jun 2026' },
      { society: 'ASCAP', code: '911804215', status: 'Accepted', date: '19 Jun 2026' },
      { society: 'ICE', code: 'IC88294410', status: 'Accepted', date: '25 Jun 2026' },
    ],
  },
  {
    id: 8, title: 'Right Now', isrc: 'GBDHC2400203', artist: 'Darkoo, Davido & Rvssian', duration: '03:18', status: 'Rejected',
    writers: [
      { legalName: 'Amara Okoye', email: ME, role: 'Composer/Author', controlled: true, ipi: '00844299503', share: 25, status: 'Accepted' },
      { legalName: 'David Adeleke', email: 'd.adeleke@example.com', role: 'Author', controlled: false, ipi: '00752209183', share: 25, status: 'Pending' },
      { legalName: 'Tarik Johnston', email: 't.johnston@example.com', role: 'Composer', controlled: false, ipi: '00768834521', share: 25, status: 'Pending' },
      { legalName: 'Ruben Adeyemi', email: 'ruben.adeyemi@example.com', role: 'Composer', controlled: false, ipi: '00791122834', share: 25, status: 'Pending' },
    ],
    societyCodes: [],
  },
])

// ---- Add a new work ----
const addingWork = ref(false)
const startAddWork = () => {
  activeTab.value = 'works'
  addingWork.value = true
}

const handleWorkRegistered = (payload: NewWorkPayload) => {
  works.value.unshift({
    id: works.value.length + 100,
    title: payload.title,
    isrc: payload.track.isrc,
    artist: payload.release.artist,
    duration: payload.duration,
    status: 'Submitted',
    writers: payload.writers.map(w => ({
      legalName: w.legalName,
      email: w.email,
      role: w.role,
      controlled: w.email === ME,
      ipi: w.email === ME ? '00844299503' : '',
      share: w.share,
      status: w.email === ME ? 'Accepted' as const : 'Pending' as const,
    })),
    societyCodes: [],
  })
  showToast(`"${payload.title}" submitted for registration`)
}

// ---- Toast ----
const toast = ref('')
let toastTimer: ReturnType<typeof setTimeout> | undefined
const showToast = (msg: string) => {
  toast.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 3200)
}

// ---- My Works: filters + expanders ----
const workFilters = ['All', 'Approved', 'Pending', 'Rejected'] as const
const workFilter = ref<(typeof workFilters)[number]>('All')
const worksSearch = ref('')

const fold = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

const filteredWorks = computed(() => {
  let list = works.value
  if (workFilter.value === 'Approved') list = list.filter(w => w.status === 'Accepted')
  else if (workFilter.value === 'Pending') list = list.filter(w => w.status === 'Submitted')
  else if (workFilter.value === 'Rejected') list = list.filter(w => w.status === 'Rejected')

  const q = fold(worksSearch.value.trim())
  if (!q) return list
  // Writer-centric search: title, writer names/emails, ISRC and society work codes
  return list.filter(w =>
    fold(w.title).includes(q) ||
    fold(w.isrc).includes(q) ||
    w.writers.some(x => fold(x.legalName).includes(q) || fold(x.email).includes(q) || x.ipi.includes(q)) ||
    w.societyCodes.some(c => fold(c.society).includes(q) || fold(c.code).includes(q))
  )
})

const expandedWorks = ref(new Set<number>())
const toggleExpanded = (id: number) => {
  const next = new Set(expandedWorks.value)
  next.has(id) ? next.delete(id) : next.add(id)
  expandedWorks.value = next
}

// Canonical mapping: accepted/registered = success, submitted/pending = warning
// (matches the Neighbouring Rights pills), rejected = danger.
const statusVariant = (s: Work['status']) =>
  s === 'Accepted' ? 'success' : s === 'Submitted' ? 'warning' : 'danger'

// ---- Co-writers ----
const yourShare = (w: Work) => w.writers.find(x => x.email === ME)?.share ?? 0

// ---- Overview action cards (imagery is placeholder — final art TBD) ----
const actionCards = [
  {
    title: 'sync',
    image: '/img/pub-syncopportunity.svg',
    heading: 'Apply for the latest <span class="text-ditto-purple">Sync Opportunities</span>',
    blurb: 'Submit your tracks for the chance to be featured in movies, TV shows, ads, games and more.',
    cta: 'Apply Now',
    tag: '',
    go: () => emit('navigate', 'sync'),
  },
  {
    title: 'works',
    image: '/img/pub-viewamendworks.svg',
    heading: 'View/amend <span class="text-ditto-purple">Your Works</span>',
    blurb: "See the works you've already registered and the details that have been submitted.",
    cta: 'My Works',
    tag: '',
    go: () => { activeTab.value = 'works' },
  },
  {
    title: 'live',
    image: '',
    heading: 'Register <span class="text-ditto-purple">Live Performances</span>',
    blurb: 'Register your live performances to claim publishing royalties.',
    cta: 'Register Live',
    tag: 'New',
    go: () => { activeTab.value = 'live' },
  },
]

// ---- Overview editorial ----
const articles = [
  {
    title: 'What is Sync Licensing? Get Your Music in Movies, TV & More',
    excerpt: 'Get your music in movies, TV & more with sync licensing.',
    image: '/img/pub-learn-sync.webp',
  },
  {
    title: 'What Are Mechanical Royalties? Explained for Musicians',
    excerpt: "Are you claiming all the mechanical royalties you're owed?",
    image: '/img/pub-learn-mechanical.webp',
  },
  {
    title: 'Music Publishing Explained for Musicians',
    excerpt: 'The collection and payment of royalties whenever a song is "used".',
    image: '/img/pub-learn-publishing.webp',
  },
]
</script>
