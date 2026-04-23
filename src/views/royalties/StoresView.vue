<template>
  <div class="space-y-6">
    <!-- Donut + Top Stores -->
    <div class="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
      <!-- Donut Chart Card -->
      <div class="bg-[#f9f9ff] rounded-2xl p-6 flex flex-col items-center justify-center">
        <div class="relative w-[220px] h-[220px]">
          <Doughnut :data="donutData" :options="donutOptions" />
          <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span class="text-2xl font-bold text-ditto-text">{{ formatCurrency(totalEarnings) }}</span>
            <span class="text-xs text-ditto-subtext">Total earnings</span>
          </div>
        </div>
        <!-- Compact legend for top 5 -->
        <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mt-5">
          <span v-for="store in stores.slice(0, 5)" :key="store.id" class="flex items-center gap-1.5 text-xs text-ditto-subtext">
            <span class="w-2 h-2 rounded-full flex-shrink-0" :style="{ backgroundColor: store.color }"></span>
            {{ store.name }}
          </span>
        </div>
      </div>

      <!-- Top Stores List -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 class="font-poppins font-bold text-xl text-ditto-text mb-5">Top Performing Stores</h3>
        <div class="space-y-4">
          <div v-for="store in stores.slice(0, 5)" :key="store.id" class="flex items-center gap-4">
            <img :src="getStoreIcon(store.icon)" :alt="store.name" class="w-10 h-10 rounded-xl flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-sm font-medium text-ditto-text">{{ store.name }}</span>
                <span class="text-sm font-bold text-ditto-text">{{ formatCurrency(store.earnings) }}</span>
              </div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-1000 ease-out"
                  :style="{ width: `${(store.earnings / stores[0].earnings) * 100}%`, backgroundColor: store.color }"
                ></div>
              </div>
            </div>
            <span class="text-xs text-ditto-subtext w-12 text-right flex-shrink-0">{{ store.proportion }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- All Stores Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="font-poppins font-bold text-lg text-ditto-text">All Stores</h3>
        <p class="text-xs text-ditto-subtext mt-0.5">{{ stores.length }} stores reporting earnings</p>
      </div>

      <!-- Header -->
      <div class="hidden lg:grid grid-cols-[40px_1fr_120px_80px_120px] gap-4 px-6 py-3 text-xs text-ditto-subtext">
        <div>#</div>
        <div>Store</div>
        <div class="text-right">Earnings</div>
        <div class="text-right">Share</div>
        <div></div>
      </div>

      <!-- Rows -->
      <div class="divide-y divide-gray-50">
        <div
          v-for="(store, idx) in stores"
          :key="store.id"
          class="flex items-center gap-4 px-6 py-3.5 hover:bg-ditto-light-grey transition-colors lg:grid lg:grid-cols-[40px_1fr_120px_80px_120px]"
        >
          <!-- Rank -->
          <span class="text-sm text-ditto-subtext w-6 lg:w-auto">{{ idx + 1 }}</span>

          <!-- Store -->
          <div class="flex items-center gap-3 flex-1 min-w-0 lg:flex-none">
            <img :src="getStoreIcon(store.icon)" :alt="store.name" class="w-8 h-8 rounded-lg flex-shrink-0" />
            <span class="text-sm font-medium text-ditto-text truncate">{{ store.name }}</span>
          </div>

          <!-- Earnings -->
          <span class="text-sm font-semibold text-ditto-text text-right hidden lg:block">
            {{ store.earnings >= 1 ? formatCurrency(store.earnings) : `£${store.earnings.toFixed(2)}` }}
          </span>

          <!-- Share -->
          <span class="text-xs text-ditto-subtext text-right hidden lg:block">{{ store.proportion < 0.01 ? '<0.01' : store.proportion }}%</span>

          <!-- Mini bar -->
          <div class="hidden lg:block">
            <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full"
                :style="{ width: `${Math.max((store.earnings / stores[0].earnings) * 100, 1)}%`, backgroundColor: store.color }"
              ></div>
            </div>
          </div>

          <!-- Mobile amount -->
          <span class="text-sm font-semibold text-ditto-text flex-shrink-0 lg:hidden">
            {{ store.earnings >= 1 ? formatCurrency(store.earnings) : `£${store.earnings.toFixed(2)}` }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import type { StoreEarnings } from '../../types'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
  stores: StoreEarnings[]
}>()

const totalEarnings = computed(() => props.stores.reduce((sum, s) => sum + s.earnings, 0))

// Show top 7 in donut, group rest as "Other"
const donutStores = computed(() => {
  const top = props.stores.slice(0, 7)
  const rest = props.stores.slice(7)
  const otherTotal = rest.reduce((sum, s) => sum + s.earnings, 0)
  if (otherTotal > 0) {
    return [...top, { id: 'other', name: 'Other', icon: '', earnings: otherTotal, proportion: 0, color: '#d4d4d8' }]
  }
  return top
})

const donutData = computed(() => ({
  labels: donutStores.value.map(s => s.name),
  datasets: [{
    data: donutStores.value.map(s => s.earnings),
    backgroundColor: donutStores.value.map(s => s.color),
    hoverBackgroundColor: donutStores.value.map(s => s.color + 'CC'),
    borderWidth: 2,
    borderColor: '#f9f9ff',
    cutout: '72%',
    borderRadius: 4,
    spacing: 2,
  }]
}))

const donutOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#fff',
      titleColor: '#101f3c',
      bodyColor: '#101f3c',
      borderColor: '#e5e5e5',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 8,
      titleFont: { size: 12, weight: 'bold' as const, family: 'Satoshi, sans-serif' },
      bodyFont: { size: 11, family: 'Satoshi, sans-serif' },
      callbacks: {
        label: (ctx: any) => ` £${ctx.parsed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      }
    }
  },
  animation: {
    animateRotate: true,
    duration: 1000,
  }
}

const formatCurrency = (val: number): string => {
  if (val >= 1000000) return `£${(val / 1000000).toFixed(1)}M`
  if (val >= 1000) return `£${(val / 1000).toFixed(1)}K`
  return `£${val.toFixed(2)}`
}

const storeIconMap: Record<string, string> = {
  'spotify': '/img/spotify-icon.svg',
  'apple-music': '/img/apple-music-icon.svg',
  'youtube': '/img/youtube-icon.svg',
  'amazon-music': '/img/amazonmusic-icon.svg',
  'deezer': '/img/deezer-icon.svg',
  'tiktok': '/img/tiktok-icon.svg',
  'soundcloud': '/img/soundcloud_icon.svg',
  'tidal': '/img/tidal-icon.svg',
  'boomplay': '/img/boomplay-icon.svg',
}

const getStoreIcon = (icon: string): string => storeIconMap[icon] || '/img/soundcloud_icon.svg'
</script>
