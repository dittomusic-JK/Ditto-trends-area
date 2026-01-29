<template>
  <div>
    <h3 class="font-poppins font-bold text-lg sm:text-xl text-ditto-text mb-3 sm:mb-4">Stores</h3>
    
    <table class="w-full">
      <thead class="hidden sm:table-header-group">
        <tr class="text-xs text-ditto-subtext">
          <th class="text-left font-normal pb-3 pl-4">Platform</th>
          <th class="text-center font-normal pb-3">Proportion</th>
          <th class="text-right font-normal pb-3 pr-4">Streams</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="store in stores" 
          :key="store.id"
          @click="handleClick(store.icon)"
          :class="[
            'border-t border-ditto-border-grey/50 cursor-pointer transition-colors',
            selectedStore === store.icon ? 'bg-ditto-purple/5' : 'hover:bg-ditto-light-grey'
          ]"
        >
          <td class="py-3 sm:py-4 px-2 sm:pl-4">
            <div class="flex items-center gap-2 sm:gap-3">
              <StoreIcon :store="store.icon" />
              <span :class="['text-sm', selectedStore === store.icon ? 'text-ditto-purple font-medium' : 'text-ditto-text']">{{ store.name }}</span>
            </div>
          </td>
          <td class="text-center py-3 sm:py-4 hidden sm:table-cell">
            <span class="text-sm font-medium text-ditto-purple">{{ store.proportion }}%</span>
          </td>
          <td class="text-right py-3 sm:py-4 pr-2 sm:pr-4">
            <div class="flex items-center justify-end gap-2">
              <span class="text-xs text-ditto-purple font-medium sm:hidden">{{ store.proportion }}%</span>
              <span class="text-xs sm:text-sm text-ditto-subtext sm:text-ditto-text">{{ formatStreams(store.streams) }}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Store } from '../../types'
import StoreIcon from './StoreIcon.vue'

// Format streams to abbreviated form on mobile
const formatStreams = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return num.toLocaleString()
}

const props = defineProps<{
  stores: Store[]
  selectedStore: string | null
}>()

const emit = defineEmits<{
  (e: 'select', store: string | null): void
}>()

// Toggle selection - click again to deselect
const handleClick = (storeIcon: string) => {
  if (props.selectedStore === storeIcon) {
    emit('select', null) // Deselect, return to all stores
  } else {
    emit('select', storeIcon) // Select this store
  }
}
</script>
