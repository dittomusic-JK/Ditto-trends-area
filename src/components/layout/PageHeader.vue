<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6 w-full max-w-full">
    <h1 class="font-poppins font-bold text-xl sm:text-3xl lg:text-[42px] tracking-tight text-ditto-text text-center sm:text-left">
      Analytics & Trends <span>📈</span>
    </h1>
    
    <div class="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
      <!-- Date Range Picker -->
      <DateRangePicker 
        :model-value="dateRange" 
        @update:model-value="$emit('update:dateRange', $event)"
      />
      
      <!-- Type Dropdown - hidden on mobile, shown in filters instead -->
      <div class="relative hidden sm:block">
        <button 
          @click="showTypeDropdown = !showTypeDropdown"
          class="flex items-center gap-2 px-4 border border-ditto-border-grey rounded-lg text-sm hover:bg-ditto-light-grey transition-colors h-10"
        >
          <span class="text-ditto-subtext">Type:</span>
          <span class="font-medium text-ditto-text">{{ typeLabels[trendsType] }}</span>
          <IconChevronDown class="w-4 h-4 text-ditto-subtext" />
        </button>
        
        <!-- Dropdown Menu -->
        <div 
          v-if="showTypeDropdown"
          class="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-ditto-border-grey py-1 z-50"
        >
          <button
            v-for="(label, type) in typeLabels"
            :key="type"
            @click="selectType(type as TrendsType)"
            :class="[
              'w-full px-4 py-2 text-left text-sm transition-colors',
              trendsType === type 
                ? 'bg-ditto-light-grey text-ditto-purple font-medium' 
                : 'text-ditto-text hover:bg-ditto-light-grey'
            ]"
          >
            {{ label }}
          </button>
        </div>
      </div>
      
      <!-- Filters Button -->
      <button 
        @click="$emit('openFilters')"
        class="flex items-center gap-2 px-3 py-2 sm:px-4 border border-ditto-border-grey rounded-lg text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors"
      >
        <IconFilter class="w-4 h-4" />
        <span class="hidden sm:inline">Filters</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconFilter, IconChevronDown } from '../icons'
import DateRangePicker from '../common/DateRangePicker.vue'
import type { DateRange, TrendsType } from '../../types'

defineProps<{
  dateRange: DateRange
  trendsType: TrendsType
  showStreamsDropdown?: boolean
}>()

const emit = defineEmits<{
  (e: 'openFilters'): void
  (e: 'update:dateRange', value: DateRange): void
  (e: 'update:trendsType', value: TrendsType): void
}>()

const showTypeDropdown = ref(false)

const typeLabels: Record<TrendsType, string> = {
  streaming: 'Streaming',
  download: 'Download',
  fingerprint: 'Fingerprint',
  content: 'Content Production',
  preorder: 'Pre-order'
}

const selectType = (type: TrendsType) => {
  emit('update:trendsType', type)
  showTypeDropdown.value = false
}
</script>
