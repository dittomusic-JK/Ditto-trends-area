<template>
  <div class="space-y-8">
    <!-- Top Row: Gender + Age Range -->
    <div class="grid grid-cols-2 gap-8">
      <!-- Gender Section -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 class="font-poppins font-bold text-xl text-ditto-text mb-4">Gender</h3>
        <div class="flex flex-col items-center">
          <!-- Donut Chart -->
          <div class="relative w-[200px] h-[200px]">
            <Doughnut :data="genderChartData" :options="donutOptions" />
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-3xl font-bold text-ditto-text">{{ totalListeners }}</span>
              <span class="text-sm text-ditto-subtext">listeners</span>
            </div>
          </div>
          
          <!-- Legend Below -->
          <div class="flex items-center justify-center gap-8 mt-6 w-full">
            <div class="flex items-center gap-3">
              <span class="w-4 h-4 rounded-sm bg-gradient-to-br from-ditto-purple to-[#6B2FD9]"></span>
              <div>
                <span class="text-sm text-ditto-subtext">Male</span>
                <span class="text-lg font-semibold text-ditto-text ml-2">{{ data.gender.male }}%</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="w-4 h-4 rounded-sm bg-gradient-to-br from-chart-coral to-[#DC2626]"></span>
              <div>
                <span class="text-sm text-ditto-subtext">Female</span>
                <span class="text-lg font-semibold text-ditto-text ml-2">{{ data.gender.female }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Age Range Section -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 class="font-poppins font-bold text-xl text-ditto-text mb-6">Age Range</h3>
        <div class="space-y-4">
          <div 
            v-for="(ageRange, index) in data.ageRanges" 
            :key="ageRange.range"
            class="group"
          >
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-sm font-medium text-ditto-text">{{ ageRange.range }}</span>
              <span class="text-sm font-semibold text-ditto-purple">{{ ageRange.total }}%</span>
            </div>
            <div class="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <!-- Male portion -->
              <div 
                class="absolute left-0 top-0 h-full bg-ditto-purple rounded-l-full transition-all duration-700 ease-out"
                :style="{ 
                  width: animatedBars ? `${(ageRange.male / Math.max(...data.ageRanges.map(a => a.total))) * 100}%` : '0%',
                  transitionDelay: `${index * 100}ms`
                }"
              ></div>
              <!-- Female portion -->
              <div 
                class="absolute top-0 h-full bg-chart-coral rounded-r-full transition-all duration-700 ease-out"
                :style="{ 
                  left: animatedBars ? `${(ageRange.male / Math.max(...data.ageRanges.map(a => a.total))) * 100}%` : '0%',
                  width: animatedBars ? `${(ageRange.female / Math.max(...data.ageRanges.map(a => a.total))) * 100}%` : '0%',
                  transitionDelay: `${index * 100}ms`
                }"
              ></div>
            </div>
          </div>
        </div>
        <!-- Age Legend -->
        <div class="flex items-center gap-6 mt-6 pt-4 border-t border-gray-100">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-ditto-purple"></span>
            <span class="text-xs text-ditto-subtext">Male</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-chart-coral"></span>
            <span class="text-xs text-ditto-subtext">Female</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- World Map Section -->
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div class="flex items-center justify-between mb-6">
        <h3 class="font-poppins font-bold text-xl text-ditto-text">Geographic Distribution</h3>
        <div class="flex items-center gap-3 text-xs text-ditto-subtext">
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded" style="background-color: rgba(134, 64, 244, 0.2)"></span>
            <span>Low</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded" style="background-color: rgba(134, 64, 244, 0.5)"></span>
            <span>Medium</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded" style="background-color: rgba(134, 64, 244, 1)"></span>
            <span>High</span>
          </div>
        </div>
      </div>
      
      <div class="relative">
        <!-- SVG World Map -->
        <svg 
          ref="mapSvg"
          viewBox="0 0 1000 500" 
          class="w-full h-[300px]"
          @mousemove="handleMapHover"
          @mouseleave="hoveredCountry = null"
        >
          <g ref="mapGroup"></g>
        </svg>
        
        <!-- Tooltip -->
        <div 
          v-if="hoveredCountry"
          class="absolute pointer-events-none bg-ditto-text text-white px-3 py-2 rounded-lg text-sm shadow-lg z-10"
          :style="{ left: `${tooltipX}px`, top: `${tooltipY}px`, transform: 'translate(-50%, -100%)' }"
        >
          <div class="font-semibold">{{ hoveredCountry.country }}</div>
          <div class="text-white/80">{{ hoveredCountry.streams.toLocaleString() }} streams</div>
          <div class="text-white/60 text-xs">{{ hoveredCountry.ratio }}% of total</div>
        </div>
      </div>
    </div>
    
    <!-- Bottom Row: Countries + Cities -->
    <div class="grid grid-cols-2 gap-8">
      <!-- Country Ranking -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-poppins font-bold text-xl text-ditto-text">Top Countries</h3>
          <button 
            @click="showAllLocations = !showAllLocations"
            class="text-sm font-medium text-ditto-purple hover:text-ditto-purple/80 transition-colors"
          >
            {{ showAllLocations ? 'Show Less' : 'See All' }}
          </button>
        </div>
        <div class="space-y-1">
          <div 
            v-for="country in data.countries.slice(0, showAllLocations ? 15 : 5)"
            :key="country.rank"
            class="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0 group cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
            @mouseenter="highlightCountry(country)"
            @mouseleave="highlightedCountry = null"
          >
            <!-- Rank -->
            <span class="text-xl font-light text-ditto-subtext w-6">{{ country.rank }}</span>
            
            <!-- Round Flag -->
            <div class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 shadow-sm border border-gray-100">
              <img 
                :src="getFlagUrl(country.code)" 
                :alt="country.country"
                class="w-full h-full object-cover"
                @error="handleFlagError"
              />
            </div>
            
            <!-- Country Name -->
            <span class="flex-1 text-sm font-medium text-ditto-text">{{ country.country }}</span>
            
            <!-- Streams -->
            <span class="text-sm font-medium text-ditto-text">{{ country.streams.toLocaleString() }}</span>
          </div>
        </div>
      </div>
      
      <!-- City Ranking -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-poppins font-bold text-xl text-ditto-text">Top Cities</h3>
          <button 
            @click="showAllLocations = !showAllLocations"
            class="text-sm font-medium text-ditto-purple hover:text-ditto-purple/80 transition-colors"
          >
            {{ showAllLocations ? 'Show Less' : 'See All' }}
          </button>
        </div>
        <div class="space-y-1">
          <div 
            v-for="city in data.cities.slice(0, showAllLocations ? 15 : 5)"
            :key="city.rank"
            class="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
          >
            <!-- Rank -->
            <span class="text-xl font-light text-ditto-subtext w-6">{{ city.rank }}</span>
            
            <!-- City + Country -->
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-ditto-text">{{ city.city }}</div>
              <div v-if="city.country" class="text-xs text-ditto-subtext">{{ city.country }}</div>
            </div>
            
            <!-- Streams -->
            <span class="text-sm font-medium text-ditto-text">{{ city.streams.toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { feature } from 'topojson-client'
import { geoNaturalEarth1, geoPath } from 'd3-geo'
import type { AudienceData, CountryData } from '../types'

ChartJS.register(ArcElement, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler)

const props = defineProps<{
  data: AudienceData
}>()

const animatedBars = ref(false)
const mapSvg = ref<SVGSVGElement | null>(null)
const mapGroup = ref<SVGGElement | null>(null)
const hoveredCountry = ref<CountryData | null>(null)
const highlightedCountry = ref<CountryData | null>(null)
const tooltipX = ref(0)
const tooltipY = ref(0)
const showAllLocations = ref(false)

// Get circular flag image URL
const getFlagUrl = (code?: string) => {
  if (!code) return ''
  return `https://flagcdn.com/w80/${code.toLowerCase()}.png`
}

// Handle flag image load error - fallback to emoji
const handleFlagError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

// Build country data map
const countryDataMap = computed(() => {
  const map = new Map<string, CountryData>()
  props.data.countries.forEach(c => {
    if (c.code) map.set(c.code, c)
  })
  return map
})

// Total listeners calculation
const totalListeners = computed(() => {
  if (props.data.genderTrend) {
    const total = props.data.genderTrend.reduce((sum, d) => sum + d.male + d.female, 0)
    return total >= 1000 ? `${(total / 1000).toFixed(0)}K` : total.toLocaleString()
  }
  return '141K'
})

// Gender donut chart with gradient-like colors
const genderChartData = computed(() => ({
  labels: ['Male', 'Female'],
  datasets: [{
    data: [props.data.gender.male, props.data.gender.female],
    backgroundColor: [
      '#7C3AED', // Purple (male)
      '#F87171'  // Coral (female)
    ],
    hoverBackgroundColor: [
      '#6D28D9',
      '#EF4444'
    ],
    borderWidth: 0,
    cutout: '70%'
  }]
}))

const donutOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false }
  },
  animation: {
    animateRotate: true,
    duration: 1000
  }
}

// Map rendering
const renderMap = async () => {
  if (!mapGroup.value) return
  
  try {
    // Fetch world topology
    const response = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    const world = await response.json()
    
    // Convert to GeoJSON
    const countries = feature(world, world.objects.countries) as any
    
    // Create projection and path generator
    const projection = geoNaturalEarth1()
      .scale(180)
      .translate([500, 280])
    
    const pathGenerator = geoPath().projection(projection)
    
    // Clear existing paths
    mapGroup.value.innerHTML = ''
    
    // Country name mapping (numeric id -> ISO code)
    const idToCode: Record<string, string> = {
      '404': 'KE', '840': 'US', '826': 'GB', '36': 'AU', '124': 'CA',
      '276': 'DE', '834': 'TZ', '800': 'UG', '784': 'AE', '528': 'NL',
      '634': 'QA', '250': 'FR', '566': 'NG', '710': 'ZA', '682': 'SA'
    }
    
    // Draw each country
    countries.features.forEach((country: any) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      const d = pathGenerator(country)
      if (d) {
        path.setAttribute('d', d)
        
        const code = idToCode[country.id]
        const countryData = code ? countryDataMap.value.get(code) : null
        
        // Color based on stream intensity
        let fill = '#E5E7EB' // Default gray
        if (countryData) {
          const intensity = Math.min(countryData.ratio / 30, 1) // Normalize to 0-1
          const alpha = 0.2 + intensity * 0.8
          fill = `rgba(134, 64, 244, ${alpha})`
        }
        
        path.setAttribute('fill', fill)
        path.setAttribute('stroke', '#fff')
        path.setAttribute('stroke-width', '0.5')
        path.setAttribute('data-code', code || '')
        path.style.transition = 'fill 0.2s ease'
        
        // Hover effects
        path.addEventListener('mouseenter', () => {
          if (countryData) {
            path.setAttribute('fill', '#8640f4')
          } else {
            path.setAttribute('fill', '#D1D5DB')
          }
        })
        
        path.addEventListener('mouseleave', () => {
          path.setAttribute('fill', fill)
        })
        
        mapGroup.value?.appendChild(path)
      }
    })
  } catch (error) {
    console.error('Failed to load map:', error)
  }
}

const handleMapHover = (event: MouseEvent) => {
  const target = event.target as SVGPathElement
  const code = target.getAttribute('data-code')
  
  if (code && countryDataMap.value.has(code)) {
    hoveredCountry.value = countryDataMap.value.get(code) || null
    
    const rect = mapSvg.value?.getBoundingClientRect()
    if (rect) {
      tooltipX.value = event.clientX - rect.left
      tooltipY.value = event.clientY - rect.top - 10
    }
  } else {
    hoveredCountry.value = null
  }
}

const highlightCountry = (country: CountryData) => {
  highlightedCountry.value = country
  
  // Find and highlight the map path
  if (mapGroup.value && country.code) {
    const paths = mapGroup.value.querySelectorAll('path')
    paths.forEach(path => {
      if (path.getAttribute('data-code') === country.code) {
        path.setAttribute('fill', '#8640f4')
        path.style.filter = 'drop-shadow(0 0 8px rgba(134, 64, 244, 0.5))'
      }
    })
  }
}

// Trigger animations on mount
onMounted(() => {
  setTimeout(() => {
    animatedBars.value = true
  }, 100)
  
  nextTick(() => {
    renderMap()
  })
})

// Re-render map if data changes
watch(() => props.data.countries, () => {
  renderMap()
}, { deep: true })
</script>

<style scoped>
.chart-coral {
  background-color: #F87171;
}
</style>
