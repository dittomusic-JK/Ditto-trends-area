<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6 lg:px-16 lg:py-8 w-full max-w-full box-border">
    <!-- Header -->
    <h1 class="font-satoshi font-black text-xl sm:text-3xl lg:text-[42px] tracking-[-0.03em] text-ditto-text mb-6">
      Publishing <span>📝</span>
    </h1>

    <!-- Sub Nav -->
    <div class="flex items-center gap-2 mb-6">
      <button
        v-for="tab in tabs" :key="tab.id"
        @click="activeTab = tab.id"
        :class="['px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap', activeTab === tab.id ? 'bg-ditto-text text-white' : 'bg-ditto-light-grey text-ditto-text hover:bg-ditto-light-grey/80']"
      >{{ tab.label }}</button>
    </div>

    <!-- Overview -->
    <div v-if="activeTab === 'overview'" class="space-y-6">
      <!-- Upgrade Banner -->
      <div class="rounded-2xl p-5 lg:p-6 border border-ditto-purple/20 bg-gradient-to-r from-ditto-purple/5 to-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p class="text-sm font-semibold text-ditto-text mb-1">Claim up to 20% more royalties</p>
          <p class="text-xs text-ditto-subtext">Register tracks from your release library to claim publishing royalties. Access exclusive sync opportunities to get your music on TV, movies and more.</p>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <button class="px-4 py-2 bg-ditto-purple text-white text-sm font-medium rounded-full hover:bg-ditto-purple/90 transition-colors">Pick a Plan</button>
          <button class="px-4 py-2 text-sm font-medium text-ditto-purple hover:underline">Find out more</button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-white rounded-2xl border border-gray-200 p-5 relative overflow-hidden">
          <img src="/img/pub-works-approved.svg" alt="" class="absolute top-4 right-4 w-12 h-12" />
          <p class="text-xs text-ditto-subtext mb-1">Works Approved</p>
          <p class="text-3xl font-bold text-ditto-text">0</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-200 p-5 relative overflow-hidden">
          <img src="/img/pub-catalog-registered.svg" alt="" class="absolute top-4 right-4 w-12 h-12" />
          <p class="text-xs text-ditto-subtext mb-1">Catalog Registered</p>
          <p class="text-3xl font-bold text-ditto-text">0 <span class="text-lg font-normal text-ditto-subtext">/ 41</span></p>
        </div>
      </div>

      <!-- Action Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- Register New Work -->
        <div class="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group">
          <img src="/img/pub-registernewwork.svg" alt="" class="w-12 h-12 mb-4" />
          <h3 class="font-satoshi font-black tracking-[-0.03em] text-base text-ditto-text mb-1">Register a new<br/><span class="text-ditto-purple">Musical Work.</span></h3>
          <p class="text-xs text-ditto-subtext mb-4">Add & register tracks from your release library to claim publishing royalties.</p>
          <span class="text-sm font-medium text-ditto-purple group-hover:underline">Register Song →</span>
        </div>

        <!-- Sync Opportunities -->
        <div class="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group" @click="emit('navigate', 'sync')">
          <img src="/img/pub-syncopportunity.svg" alt="" class="w-12 h-12 mb-4" />
          <h3 class="font-satoshi font-black tracking-[-0.03em] text-base text-ditto-text mb-1">Sync Opportunities</h3>
          <p class="text-xs text-ditto-subtext mb-4">Submit your tracks for the chance to be featured in movies, TV shows, ads, games and more.</p>
          <span class="text-sm font-medium text-ditto-purple group-hover:underline">Apply Now →</span>
        </div>

        <!-- View/Amend Works -->
        <div class="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group" @click="activeTab = 'works'">
          <img src="/img/pub-viewamendworks.svg" alt="" class="w-12 h-12 mb-4" />
          <h3 class="font-satoshi font-black tracking-[-0.03em] text-base text-ditto-text mb-1">View/amend Your Works</h3>
          <p class="text-xs text-ditto-subtext mb-4">See the works you've already registered and the details that have been submitted.</p>
          <span class="text-sm font-medium text-ditto-purple group-hover:underline">View Works →</span>
        </div>
      </div>

      <!-- Learn More -->
      <div>
        <h3 class="font-satoshi font-black tracking-[-0.03em] text-lg text-ditto-text mb-4">Learn more about Music Publishing</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a href="#" class="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow group">
            <p class="text-sm font-semibold text-ditto-text group-hover:text-ditto-purple transition-colors">What is Sync Licensing? Get Your Music in Movies, TV & More</p>
            <p class="text-xs text-ditto-subtext mt-2">Get Your Music in Movies, TV & More with Sync Licensing.</p>
          </a>
          <a href="#" class="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow group">
            <p class="text-sm font-semibold text-ditto-text group-hover:text-ditto-purple transition-colors">What Are Mechanical Royalties? Explained for Musicians</p>
            <p class="text-xs text-ditto-subtext mt-2">Are you claiming all the mechanical royalties you're owed?</p>
          </a>
          <a href="#" class="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow group">
            <p class="text-sm font-semibold text-ditto-text group-hover:text-ditto-purple transition-colors">Music Publishing Explained for Musicians</p>
            <p class="text-xs text-ditto-subtext mt-2">Just what exactly is music publishing? The collection and payment of royalties whenever a song is “used”.</p>
          </a>
        </div>
      </div>
    </div>

    <!-- My Works -->
    <div v-else-if="activeTab === 'works'" class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="font-satoshi font-black tracking-[-0.03em] text-xl text-ditto-text">My Works</h2>
        <button class="px-5 py-2.5 bg-ditto-purple text-white text-sm font-medium rounded-full hover:bg-ditto-purple/90 transition-colors">
          + Register New Work
        </button>
      </div>

      <!-- Works Table -->
      <div class="bg-white rounded-2xl border border-gray-200">
        <div class="hidden lg:grid grid-cols-[1fr_140px_120px_100px_100px] gap-4 px-6 py-3 text-xs text-ditto-subtext border-b border-gray-200">
          <div>Track / Work Title</div>
          <div>Artist</div>
          <div>ISRC</div>
          <div class="text-center">Writers</div>
          <div class="text-center">Status</div>
        </div>
        <div v-for="work in works" :key="work.id" class="flex items-center gap-4 px-6 py-4 hover:bg-ditto-light-grey transition-colors cursor-pointer lg:grid lg:grid-cols-[1fr_140px_120px_100px_100px]">
          <div class="flex-1 min-w-0 lg:flex-none">
            <p class="text-sm font-medium text-ditto-text truncate">{{ work.title }}</p>
            <p class="text-xs text-ditto-subtext lg:hidden">{{ work.artist }}</p>
          </div>
          <div class="text-sm text-ditto-subtext hidden lg:block truncate">{{ work.artist }}</div>
          <div class="text-xs text-ditto-subtext hidden lg:block font-mono">{{ work.isrc }}</div>
          <div class="text-sm text-ditto-text text-center hidden lg:block">{{ work.writers }}</div>
          <div class="text-center flex-shrink-0">
            <span :class="['text-[10px] font-semibold px-2 py-0.5 rounded-full', work.status === 'Approved' ? 'bg-success/15 text-success' : work.status === 'Pending' ? 'bg-warning/15 text-warning' : 'bg-info/15 text-info']">{{ work.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { AppSection } from '../../types'

const emit = defineEmits<{
  (e: 'navigate', section: AppSection): void
}>()

const activeTab = ref('overview')
const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'works', label: 'My Works' },
]

const works = [
  { id: 1, title: 'Solar', artist: 'Darkoo & Ruger', isrc: 'GBDHC2600012', writers: 2, status: 'Approved' },
  { id: 2, title: 'My Baby (Obimo)', artist: 'Almost Joey', isrc: 'GBDHC2600045', writers: 1, status: 'Approved' },
  { id: 3, title: 'Favourite Girl', artist: 'Darkoo & Dess Dior', isrc: 'GBDHC2400187', writers: 3, status: 'Approved' },
  { id: 4, title: 'RHUDE GYAL!', artist: 'Darkoo & JELEEL!', isrc: 'GBDHC2500092', writers: 2, status: 'Pending' },
  { id: 5, title: 'Like Dat', artist: 'Darkoo', isrc: 'GBDHC2500041', writers: 1, status: 'Approved' },
  { id: 6, title: 'Your Number', artist: 'Darkoo', isrc: 'GBDHC2500118', writers: 2, status: 'Processing' },
  { id: 7, title: 'Focus On Me', artist: 'Darkoo', isrc: 'GBDHC2500073', writers: 1, status: 'Approved' },
  { id: 8, title: 'Right Now', artist: 'Darkoo, Davido & Rvssian', isrc: 'GBDHC2400203', writers: 4, status: 'Approved' },
]
</script>
