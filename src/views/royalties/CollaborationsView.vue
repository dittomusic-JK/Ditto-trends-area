<template>
  <div class="space-y-6">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="px-6 py-4 border border-gray-200 rounded-xl bg-white">
        <p class="text-xs text-ditto-subtext mb-0.5">Active Track Shares</p>
        <span class="text-2xl font-semibold text-ditto-text">{{ collaborations.length }}</span>
      </div>
      <div class="px-6 py-4 border border-gray-200 rounded-xl bg-white">
        <p class="text-xs text-ditto-subtext mb-0.5">Total Collaborators</p>
        <span class="text-2xl font-semibold text-ditto-text">{{ totalCollaborators }}</span>
      </div>
      <div class="px-6 py-4 border border-gray-200 rounded-xl bg-white">
        <p class="text-xs text-ditto-subtext mb-0.5">Total Collaboration Earnings</p>
        <span class="text-2xl font-semibold text-ditto-purple">{{ formatCurrency(totalEarnings) }}</span>
      </div>
    </div>

    <!-- Track Shares Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="font-poppins font-bold text-lg text-ditto-text">Track Shares</h3>
        <button class="px-4 py-2 bg-ditto-purple text-white text-sm font-medium rounded-full hover:bg-ditto-purple/90 transition-colors">
          + New Split
        </button>
      </div>

      <!-- Desktop Header -->
      <div class="hidden lg:grid grid-cols-[1fr_140px_80px_80px_100px_100px_100px] gap-4 px-6 py-3 text-xs text-ditto-subtext border-b border-gray-50">
        <div>Track Title</div>
        <div>Artist</div>
        <div class="text-center">Collaborators</div>
        <div class="text-center">Your Share</div>
        <div class="text-center">Earnings</div>
        <div class="text-center">Status</div>
        <div class="text-center">Split Start</div>
      </div>

      <!-- Rows -->
      <div v-for="collab in collaborations" :key="collab.id" class="border-t border-gray-50">
        <!-- Desktop -->
        <div class="hidden lg:grid grid-cols-[1fr_140px_80px_80px_100px_100px_100px] gap-4 px-6 py-4 items-center hover:bg-ditto-light-grey transition-colors">
          <div>
            <p class="text-sm font-medium text-ditto-text truncate" :title="collab.title">{{ collab.title }}</p>
          </div>
          <div class="text-sm text-ditto-subtext truncate" :title="collab.artist">{{ collab.artist }}</div>
          <div class="text-center text-sm text-ditto-text">{{ collab.collaborators }}</div>
          <div class="text-center">
            <span class="text-sm font-semibold text-ditto-purple">{{ collab.share }}%</span>
          </div>
          <div class="text-center text-sm font-medium text-ditto-text">{{ formatCurrency(collab.earnings) }}</div>
          <div class="text-center">
            <span :class="[
              'inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
              collab.status === 'Sent to stores' ? 'bg-success/15 text-success' :
              collab.status === 'Pending' ? 'bg-warning/15 text-warning' : 'bg-gray-100 text-ditto-subtext'
            ]">
              <svg v-if="collab.status === 'Sent to stores'" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20,6 9,17 4,12" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ collab.status }}
            </span>
          </div>
          <div class="text-center text-xs text-ditto-subtext">{{ collab.splitStart }}</div>
        </div>

        <!-- Mobile -->
        <div class="lg:hidden flex items-center gap-3 px-4 py-3">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-ditto-text truncate">{{ collab.title }}</p>
            <p class="text-xs text-ditto-subtext">{{ collab.artist }} · {{ collab.share }}% share</p>
          </div>
          <div class="text-right flex-shrink-0">
            <p class="text-sm font-semibold text-ditto-text">{{ formatCurrency(collab.earnings) }}</p>
            <span :class="[
              'text-[10px] font-medium',
              collab.status === 'Sent to stores' ? 'text-success' : 'text-warning'
            ]">{{ collab.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const collaborations = [
  { id: 1, title: 'Favourite Girl', artist: 'Darkoo & Dess Dior', collaborators: 1, share: 10, earnings: 88676.36, status: 'Sent to stores', releaseDate: '03/05/2024', splitStart: '19/03/2026' },
  { id: 2, title: 'Favourite Girl (with Rema)', artist: 'Darkoo & Rema', collaborators: 1, share: 10, earnings: 38956.47, status: 'Sent to stores', releaseDate: '09/08/2024', splitStart: '19/03/2026' },
  { id: 3, title: 'Favourite Girl', artist: 'Darkoo & Dess Dior', collaborators: 1, share: 10, earnings: 10493.30, status: 'Sent to stores', releaseDate: '09/08/2024', splitStart: '19/03/2026' },
  { id: 4, title: 'Chain Chain', artist: 'Bien & Savara', collaborators: 2, share: 50, earnings: 12340.20, status: 'Sent to stores', releaseDate: '15/01/2025', splitStart: '01/02/2025' },
  { id: 5, title: 'Midnight Remix', artist: 'Nviiri ft. Chris Kaiga', collaborators: 1, share: 60, earnings: 8920.10, status: 'Sent to stores', releaseDate: '22/06/2025', splitStart: '22/06/2025' },
  { id: 6, title: 'New Collab Single', artist: 'Chris Kaiga & Nyashinski', collaborators: 1, share: 50, earnings: 0, status: 'Pending', releaseDate: '—', splitStart: '—' },
]

const totalCollaborators = computed(() => {
  const unique = new Set(collaborations.map(c => c.artist))
  return unique.size
})

const totalEarnings = computed(() => collaborations.reduce((sum, c) => sum + c.earnings, 0))

const formatCurrency = (val: number): string => {
  if (val === 0) return '—'
  if (val >= 1000000) return `£${(val / 1000000).toFixed(1)}M`
  if (val >= 1000) return `£${(val / 1000).toFixed(1)}K`
  return `£${val.toFixed(2)}`
}
</script>
