<template>
  <div>
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <StatsCard v-for="stat in displayStats" :key="stat.id" :stat="stat" />
    </div>
    
    <!-- Performance Chart -->
    <div class="mb-8">
      <PerformanceChart :data="filteredPerformance" />
    </div>
    
    <!-- Stores Table -->
    <StoresTable 
      :stores="data.stores" 
      :selected-store="selectedStore"
      @select="selectedStore = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MetricsData, PerformanceDataPoint } from '../types'
import StatsCard from '../components/common/StatsCard.vue'
import PerformanceChart from '../components/common/PerformanceChart.vue'
import StoresTable from '../components/common/StoresTable.vue'

const props = defineProps<{
  data: MetricsData
  showDropdown?: boolean
}>()

const selectedStore = ref<string | null>(null)

// Get the selected store data
const selectedStoreData = computed(() => {
  if (!selectedStore.value) return null
  return props.data.stores.find(s => s.icon === selectedStore.value) || null
})

// Filter performance data based on selected store
const filteredPerformance = computed<PerformanceDataPoint[]>(() => {
  if (!selectedStore.value || !selectedStoreData.value) {
    return props.data.performance
  }
  
  const store = selectedStoreData.value
  
  // Scale the performance data based on the store's proportion
  const proportion = store.proportion / 100
  return props.data.performance.map(point => ({
    day: point.day,
    current: Math.round(point.current * proportion),
    previous: Math.round(point.previous * proportion)
  }))
})

// Update stats based on selected store
const displayStats = computed(() => {
  if (!selectedStore.value || !selectedStoreData.value) {
    return props.data.stats
  }
  
  const store = selectedStoreData.value
  const proportion = store.proportion / 100
  
  return props.data.stats.map(stat => {
    if (stat.iconType === 'broadcast') {
      // Total streams for this store
      return {
        ...stat,
        value: store.streams.toLocaleString()
      }
    } else if (stat.iconType === 'clock') {
      // Daily average scaled by proportion
      const originalValue = parseInt(String(stat.value).replace(/,/g, ''))
      const scaledValue = Math.round(originalValue * proportion)
      return {
        ...stat,
        value: scaledValue.toLocaleString()
      }
    } else if (stat.iconType === 'store') {
      // Show selected store
      return {
        ...stat,
        value: store.name,
        storeIcon: store.icon,
        storeName: store.name
      }
    }
    return stat
  })
})
</script>
