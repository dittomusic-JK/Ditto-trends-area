<template>
  <div class="audience">
    <!-- Top Row: Gender + Age Range -->
    <div class="audience__top-row">
      <!-- Gender Section -->
      <div class="audience__card">
        <h3 class="audience__card-title">Gender</h3>
        <div class="audience__gender-content">
          <!-- Donut Chart -->
          <div class="audience__donut-wrapper">
            <Doughnut :data="genderChartData" :options="donutOptions" />
            <div class="audience__donut-center">
              <span class="audience__donut-value">{{ totalListeners }}</span>
              <span class="audience__donut-label">listeners</span>
            </div>
          </div>

          <!-- Legend Below -->
          <div class="audience__gender-legend">
            <div class="audience__gender-legend-item">
              <span class="audience__legend-swatch audience__legend-swatch--purple"></span>
              <div>
                <span class="audience__legend-label">Male</span>
                <span class="audience__legend-value">{{ data.gender.male }}%</span>
              </div>
            </div>
            <div class="audience__gender-legend-item">
              <span class="audience__legend-swatch audience__legend-swatch--coral"></span>
              <div>
                <span class="audience__legend-label">Female</span>
                <span class="audience__legend-value">{{ data.gender.female }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Age Range Section -->
      <div class="audience__card">
        <h3 class="audience__card-title audience__card-title--age">Age Range</h3>
        <div class="audience__age-bars">
          <div
            v-for="(ageRange, index) in data.ageRanges"
            :key="ageRange.range"
            class="audience__age-group"
          >
            <div class="audience__age-header">
              <span class="audience__age-range">{{ ageRange.range }}</span>
              <span class="audience__age-total">{{ ageRange.total }}%</span>
            </div>
            <div class="audience__age-track">
              <!-- Male portion -->
              <div
                class="audience__age-bar audience__age-bar--male"
                :style="{
                  width: animatedBars ? `${(ageRange.male / Math.max(...data.ageRanges.map(a => a.total))) * 100}%` : '0%',
                  transitionDelay: `${index * 100}ms`
                }"
              ></div>
              <!-- Female portion -->
              <div
                class="audience__age-bar audience__age-bar--female"
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
        <div class="audience__age-legend">
          <div class="audience__age-legend-item">
            <span class="audience__age-legend-dot audience__age-legend-dot--male"></span>
            <span class="audience__age-legend-label">Male</span>
          </div>
          <div class="audience__age-legend-item">
            <span class="audience__age-legend-dot audience__age-legend-dot--female"></span>
            <span class="audience__age-legend-label">Female</span>
          </div>
        </div>
      </div>
    </div>

    <!-- World Map Section (hidden on mobile - not touch-friendly) -->
    <div class="audience__card audience__card--map">
      <div class="audience__map-header">
        <h3 class="audience__card-title audience__card-title--no-margin">Geographic Distribution</h3>
        <div class="audience__map-legend">
          <div class="audience__map-legend-item">
            <span class="audience__map-legend-swatch audience__map-legend-swatch--low"></span>
            <span>Low</span>
          </div>
          <div class="audience__map-legend-item">
            <span class="audience__map-legend-swatch audience__map-legend-swatch--medium"></span>
            <span>Medium</span>
          </div>
          <div class="audience__map-legend-item">
            <span class="audience__map-legend-swatch audience__map-legend-swatch--high"></span>
            <span>High</span>
          </div>
        </div>
      </div>

      <div class="audience__map-container">
        <!-- SVG World Map -->
        <svg
          ref="mapSvg"
          viewBox="0 0 1000 500"
          class="audience__map-svg"
          @mousemove="handleMapHover"
          @mouseleave="hoveredCountry = null"
        >
          <g ref="mapGroup"></g>
        </svg>

        <!-- Tooltip -->
        <div
          v-if="hoveredCountry"
          class="audience__map-tooltip"
          :style="{ left: `${tooltipX}px`, top: `${tooltipY}px`, transform: 'translate(-50%, -100%)' }"
        >
          <div class="audience__map-tooltip-name">{{ hoveredCountry.country }}</div>
          <div class="audience__map-tooltip-streams">{{ hoveredCountry.streams.toLocaleString() }} streams</div>
          <div class="audience__map-tooltip-ratio">{{ hoveredCountry.ratio }}% of total</div>
        </div>
      </div>
    </div>

    <!-- Bottom Row: Countries + Cities -->
    <div class="audience__bottom-row">
      <!-- Country Ranking -->
      <div class="audience__card">
        <div class="audience__ranking-header">
          <h3 class="audience__card-title audience__card-title--no-margin">Top Countries</h3>
          <button
            @click="showAllLocations = !showAllLocations"
            class="audience__see-all-btn"
          >
            {{ showAllLocations ? 'Show Less' : 'See All' }}
          </button>
        </div>
        <div class="audience__ranking-list">
          <div
            v-for="country in data.countries.slice(0, showAllLocations ? 15 : 5)"
            :key="country.rank"
            class="audience__ranking-row"
            @mouseenter="highlightCountry(country)"
            @mouseleave="highlightedCountry = null"
          >
            <!-- Rank -->
            <span class="audience__rank-number">{{ country.rank }}</span>

            <!-- Round Flag -->
            <div class="audience__flag-wrapper">
              <img
                :src="getFlagUrl(country.code)"
                :alt="country.country"
                class="audience__flag-img"
                @error="handleFlagError"
              />
            </div>

            <!-- Country Name -->
            <span class="audience__ranking-name">{{ country.country }}</span>

            <!-- Streams -->
            <span class="audience__ranking-streams">{{ formatShort(country.streams) }}</span>
          </div>
        </div>
      </div>

      <!-- City Ranking -->
      <div class="audience__card">
        <div class="audience__ranking-header">
          <h3 class="audience__card-title audience__card-title--no-margin">Top Cities</h3>
          <button
            @click="showAllLocations = !showAllLocations"
            class="audience__see-all-btn"
          >
            {{ showAllLocations ? 'Show Less' : 'See All' }}
          </button>
        </div>
        <div class="audience__ranking-list">
          <div
            v-for="city in data.cities.slice(0, showAllLocations ? 15 : 5)"
            :key="city.rank"
            class="audience__ranking-row"
          >
            <!-- Rank -->
            <span class="audience__rank-number">{{ city.rank }}</span>

            <!-- City + Country -->
            <div class="audience__city-info">
              <div class="audience__city-name">{{ city.city }}</div>
              <div v-if="city.country" class="audience__city-country">{{ city.country }}</div>
            </div>

            <!-- Streams -->
            <span class="audience__ranking-streams">{{ formatShort(city.streams) }}</span>
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

const formatShort = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return num.toLocaleString()
}

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

<style lang="scss" scoped>
.audience {
  > * + * {
    margin-top: 1rem;
  }

  @include lg {
    > * + * {
      margin-top: 2rem;
    }
  }
}

// ── Shared card style ──
.audience__card {
  background-color: #fff;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid #f3f4f6;

  @include lg {
    padding: 1.5rem;
  }
}

.audience__card-title {
  font-family: $font-poppins;
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--blue);
  margin-bottom: 1rem;

  @include lg {
    font-size: 1.25rem;
  }

  &--age {
    @include lg {
      margin-bottom: 1.5rem;
    }
  }

  &--no-margin {
    margin-bottom: 0;
  }
}

// ── Layout grids ──
.audience__top-row,
.audience__bottom-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @include lg {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
}

// ── Gender section ──
.audience__gender-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.audience__donut-wrapper {
  position: relative;
  width: 160px;
  height: 160px;

  @include lg {
    width: 200px;
    height: 200px;
  }
}

.audience__donut-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.audience__donut-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--blue);

  @include lg {
    font-size: 1.875rem;
  }
}

.audience__donut-label {
  font-size: $text-xs;
  color: var(--ditto-grey);

  @include lg {
    font-size: $text-sm;
  }
}

.audience__gender-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
  width: 100%;

  @include lg {
    gap: 2rem;
    margin-top: 1.5rem;
  }
}

.audience__gender-legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @include lg {
    gap: 0.75rem;
  }
}

.audience__legend-swatch {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 2px;

  @include lg {
    width: 1rem;
    height: 1rem;
  }

  &--purple {
    background: linear-gradient(to bottom right, var(--brand-primary), #6B2FD9);
  }

  &--coral {
    background: linear-gradient(to bottom right, $chart-coral, #DC2626);
  }
}

.audience__legend-label {
  font-size: $text-xs;
  color: var(--ditto-grey);

  @include lg {
    font-size: $text-sm;
  }
}

.audience__legend-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--blue);
  margin-left: 0.375rem;

  @include lg {
    font-size: 1.125rem;
    margin-left: 0.5rem;
  }
}

// ── Age Range section ──
.audience__age-bars {
  > * + * {
    margin-top: 1rem;
  }
}

.audience__age-group {
  // individual group wrapper
}

.audience__age-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.375rem;
}

.audience__age-range {
  font-size: $text-sm;
  font-weight: 500;
  color: var(--blue);
}

.audience__age-total {
  font-size: $text-sm;
  font-weight: 600;
  color: var(--brand-primary);
}

.audience__age-track {
  position: relative;
  height: 0.625rem;
  background-color: #f3f4f6;
  border-radius: 9999px;
  overflow: hidden;
}

.audience__age-bar {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 700ms ease-out;

  &--male {
    left: 0;
    background-color: var(--brand-primary);
    border-radius: 9999px 0 0 9999px;
  }

  &--female {
    background-color: $chart-coral;
    border-radius: 0 9999px 9999px 0;
  }
}

.audience__age-legend {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.audience__age-legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.audience__age-legend-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 9999px;

  &--male {
    background-color: var(--brand-primary);
  }

  &--female {
    background-color: $chart-coral;
  }
}

.audience__age-legend-label {
  font-size: $text-xs;
  color: var(--ditto-grey);
}

// ── Map section ──
.audience__card--map {
  display: none;

  @include lg {
    display: block;
    padding: 1.5rem;
  }
}

.audience__map-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.audience__map-legend {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: $text-xs;
  color: var(--ditto-grey);
}

.audience__map-legend-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.audience__map-legend-swatch {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 0.25rem;

  &--low {
    background-color: rgba(134, 64, 244, 0.2);
  }

  &--medium {
    background-color: rgba(134, 64, 244, 0.5);
  }

  &--high {
    background-color: rgba(134, 64, 244, 1);
  }
}

.audience__map-container {
  position: relative;
}

.audience__map-svg {
  width: 100%;
  height: 300px;
}

.audience__map-tooltip {
  position: absolute;
  pointer-events: none;
  background-color: var(--blue);
  color: #fff;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: $text-sm;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.audience__map-tooltip-name {
  font-weight: 600;
}

.audience__map-tooltip-streams {
  color: rgba(255, 255, 255, 0.8);
}

.audience__map-tooltip-ratio {
  color: rgba(255, 255, 255, 0.6);
  font-size: $text-xs;
}

// ── Ranking sections (Countries & Cities) ──
.audience__ranking-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.audience__see-all-btn {
  font-size: $text-sm;
  font-weight: 500;
  color: var(--brand-primary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.8;
  }
}

.audience__ranking-list {
  > * + * {
    // space-y-1 equivalent (0.25rem) — but the rows have their own vertical padding,
    // so we rely on border-bottom spacing instead
  }
}

.audience__ranking-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  margin-left: -0.5rem;
  margin-right: -0.5rem;
  border-bottom: 1px solid #f3f4f6;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f9fafb;
  }
}

.audience__rank-number {
  font-size: 1.25rem;
  font-weight: 300;
  color: var(--ditto-grey);
  width: 1.5rem;
}

.audience__flag-wrapper {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid #f3f4f6;
}

.audience__flag-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.audience__ranking-name {
  flex: 1;
  font-size: $text-sm;
  font-weight: 500;
  color: var(--blue);
}

.audience__ranking-streams {
  font-size: $text-sm;
  font-weight: 500;
  color: var(--blue);
}

// ── City-specific ──
.audience__city-info {
  flex: 1;
  min-width: 0;
}

.audience__city-name {
  font-size: $text-sm;
  font-weight: 500;
  color: var(--blue);
}

.audience__city-country {
  font-size: $text-xs;
  color: var(--ditto-grey);
}

// ── Legacy preserved class ──
.chart-coral {
  background-color: #F87171;
}
</style>
