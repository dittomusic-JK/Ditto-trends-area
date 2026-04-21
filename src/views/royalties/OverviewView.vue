<template>
  <div class="space-y-6">
    <!-- Monthly Report Hero + KPI Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr] gap-3 sm:gap-4">
      <!-- Monthly Report - Hero Card -->
      <div class="lg:row-span-1 px-6 py-5 border border-ditto-purple/20 rounded-xl bg-gradient-to-br from-ditto-purple/5 to-white">
        <p class="text-xs text-ditto-subtext mb-1">This Month's Earnings</p>
        <div class="flex items-baseline gap-3">
          <span class="text-3xl lg:text-4xl font-bold text-ditto-text">£{{ thisMonth.toLocaleString() }}</span>
          <span v-if="monthChange > 0" class="text-xs font-medium px-1.5 py-0.5 rounded-full bg-success/20 text-success">+{{ monthChange }}%</span>
          <span v-else-if="monthChange < 0" class="text-xs font-medium px-1.5 py-0.5 rounded-full bg-error/20 text-error">{{ monthChange }}%</span>
        </div>
        <p class="text-xs text-ditto-subtext mt-1">vs £{{ lastMonth.toLocaleString() }} last month</p>
      </div>
      <StatsCard v-for="stat in stats.filter(s => s.id !== 'monthly-average')" :key="stat.id" :stat="stat" />
    </div>

    <!-- Earnings Performance Chart -->
    <div class="bg-[#f9f9ff] rounded-2xl p-4 lg:p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-poppins font-bold text-lg lg:text-xl text-ditto-text">Earnings Over Time</h3>
        <div class="flex items-center gap-1 bg-white rounded-lg p-1 border border-gray-100">
          <button
            v-for="tab in chartTabs"
            :key="tab.key"
            @click="activeChartTab = tab.key"
            :class="[
              'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
              activeChartTab === tab.key 
                ? 'bg-ditto-purple text-white shadow-sm' 
                : 'text-ditto-subtext hover:text-ditto-text'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
      <div class="h-[300px]">
        <Line :data="chartData" :options="chartOptions" :plugins="[crosshairPlugin]" />
      </div>
      <!-- Legend -->
      <div class="flex items-center justify-center gap-6 mt-4">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: activeColor }"></span>
          <span class="text-sm font-medium text-ditto-text">{{ activeLabel }}</span>
        </div>
      </div>

      <!-- Data Delay Notice -->
      <div class="flex items-center justify-center mt-3">
        <div class="relative group">
          <button class="flex items-center gap-1.5 text-xs text-ditto-subtext hover:text-ditto-purple transition-colors">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Why am I only seeing up to January?
          </button>
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-ditto-text text-white text-xs leading-relaxed rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
            <p class="font-medium mb-1">Store reporting delay</p>
            <p class="text-white/80">Stores like Spotify, Apple Music and others report royalty data with a 2–3 month delay. Your most recent earnings will appear once the stores have processed and sent us the data.</p>
            <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-ditto-text"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stores + Countries Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      <!-- Top Stores -->
      <div class="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
        <h3 class="font-poppins font-bold text-lg lg:text-xl text-ditto-text mb-4">Top Stores</h3>
        <div class="space-y-3">
          <div v-for="store in stores.slice(0, 10)" :key="store.id" class="flex items-center gap-3">
            <img :src="getStoreIcon(store.icon)" :alt="store.name" class="w-8 h-8 rounded-lg flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-ditto-text truncate">{{ store.name }}</span>
                <span class="text-sm font-semibold text-ditto-text flex-shrink-0 ml-2">{{ formatCurrency(store.earnings) }}</span>
              </div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700"
                  :style="{ width: `${store.proportion}%`, backgroundColor: store.color }"
                ></div>
              </div>
              <span class="text-xs text-ditto-subtext mt-0.5">{{ store.proportion }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Countries -->
      <div class="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
        <h3 class="font-poppins font-bold text-lg lg:text-xl text-ditto-text mb-4">Top Countries</h3>
        <div class="space-y-1">
          <div
            v-for="country in countries.slice(0, 10)"
            :key="country.rank"
            class="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
          >
            <span class="text-xl font-light text-ditto-subtext w-6">{{ country.rank }}</span>
            <div class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 shadow-sm border border-gray-100">
              <img
                :src="`https://flagcdn.com/w80/${country.code}.png`"
                :alt="country.country"
                class="w-full h-full object-cover"
              />
            </div>
            <span class="flex-1 text-sm font-medium text-ditto-text">{{ country.country }}</span>
            <span class="text-sm font-medium text-ditto-text">{{ formatCurrency(country.earnings) }}</span>
          </div>
        </div>
        <button
          @click="$emit('navigateToCountries')"
          class="w-full mt-3 py-2 text-sm font-medium text-ditto-purple hover:text-ditto-purple/80 transition-colors text-center"
        >
          See more countries →
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import StatsCard from '../../components/common/RoyaltiesStatsCard.vue'
import type { RoyaltiesStatsCard as StatsCardType, EarningsDataPoint, StoreEarnings, CountryEarnings, SalesBreakdown } from '../../types'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler)

const props = defineProps<{
  stats: StatsCardType[]
  earnings: EarningsDataPoint[]
  stores: StoreEarnings[]
  countries: CountryEarnings[]
  breakdown: SalesBreakdown[]
}>()

defineEmits<{
  (e: 'navigateToCountries'): void
}>()

const activeChartTab = ref<'total' | 'streams' | 'downloads'>('total')

// Vertical crosshair line plugin
const crosshairPlugin = {
  id: 'crosshair',
  afterDraw(chart: any) {
    const tooltip = chart.tooltip
    if (!tooltip || !tooltip.getActiveElements().length) return
    const ctx = chart.ctx
    const activePoint = tooltip.getActiveElements()[0]
    const x = activePoint.element.x
    const yAxis = chart.scales.y
    ctx.save()
    ctx.beginPath()
    ctx.setLineDash([4, 4])
    ctx.lineWidth = 1
    ctx.strokeStyle = 'rgba(134, 64, 244, 0.3)'
    ctx.moveTo(x, yAxis.top)
    ctx.lineTo(x, yAxis.bottom)
    ctx.stroke()
    ctx.restore()
  }
}

const thisMonth = computed(() => props.earnings.length > 0 ? props.earnings[props.earnings.length - 1].total : 0)
const lastMonth = computed(() => props.earnings.length > 1 ? props.earnings[props.earnings.length - 2].total : 0)
const monthChange = computed(() => lastMonth.value > 0 ? Math.round(((thisMonth.value - lastMonth.value) / lastMonth.value) * 100) : 0)

const chartTabs = [
  { key: 'total' as const, label: 'Total', color: '#8640f4' },
  { key: 'streams' as const, label: 'Streams', color: '#ff006e' },
  { key: 'downloads' as const, label: 'Downloads', color: '#12c1ae' },
]

const activeColor = computed(() => chartTabs.find(t => t.key === activeChartTab.value)?.color || '#8640f4')
const activeLabel = computed(() => chartTabs.find(t => t.key === activeChartTab.value)?.label || 'Total')

const chartData = computed(() => {
  const color = activeColor.value
  return {
    labels: props.earnings.map(d => d.month),
    datasets: [
      {
        label: activeLabel.value,
        data: props.earnings.map(d => d[activeChartTab.value]),
        borderColor: color,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(0, 0, 0, 300)
          gradient.addColorStop(0, color + '25')
          gradient.addColorStop(1, color + '00')
          return gradient
        },
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        clip: false as any,
        pointRadius: 0,
        pointHoverRadius: 8,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 3,
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: { top: 20, right: 20, left: 10 } },
  interaction: { mode: 'index' as const, intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#fff',
      titleColor: '#101f3c',
      bodyColor: '#101f3c',
      borderColor: '#e5e5e5',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
      usePointStyle: true,
      titleFont: { size: 12, weight: 'bold' as const, family: 'Satoshi, sans-serif' },
      bodyFont: { size: 11, family: 'Satoshi, sans-serif' },
      callbacks: {
        label: (ctx: any) => `  \u00a3${ctx.parsed.y.toLocaleString()}`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      border: { display: false },
      grid: { color: '#efefef', drawTicks: false },
      ticks: {
        callback: (val: any) => `\u00a3${(val / 1000).toFixed(0)}K`,
        font: { size: 10, family: 'Satoshi, sans-serif' },
        color: '#626984',
        padding: 8,
        maxTicksLimit: 5,
      },
    },
    x: {
      border: { display: false },
      grid: { display: false },
      ticks: {
        font: { size: 10, family: 'Satoshi, sans-serif' },
        color: '#626984',
        padding: 4,
        maxRotation: 0,
      },
    }
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
}

const getStoreIcon = (icon: string): string => storeIconMap[icon] || ''
</script>
