<template>
  <div class="relative flex-1 sm:flex-none">
    <!-- Trigger Button -->
    <button 
      @click="isOpen = !isOpen"
      class="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 border border-ditto-border-grey rounded-lg text-xs sm:text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors bg-white flex-1 sm:flex-none"
    >
      <IconCalendar class="w-4 h-4 text-ditto-subtext" />
      <span>{{ formatDateShort(selectedRange.start) }}</span>
      <span class="text-ditto-subtext">-</span>
      <span>{{ formatDateShort(selectedRange.end) }}</span>
    </button>
    
    <!-- Dropdown -->
    <div 
      v-if="isOpen"
      class="fixed sm:absolute inset-x-4 sm:inset-x-auto top-20 sm:top-full sm:right-0 sm:mt-2 bg-white rounded-2xl shadow-xl border border-ditto-border-grey z-50 flex flex-col sm:flex-row max-h-[80vh] overflow-auto"
    >
      <!-- Presets -->
      <div class="flex sm:flex-col sm:w-28 border-b sm:border-b-0 sm:border-r border-ditto-border-grey py-2 sm:py-3 px-2 gap-1 overflow-x-auto sm:overflow-visible">
        <button
          v-for="preset in presets"
          :key="preset.id"
          @click="applyPreset(preset)"
          :class="[
            'sm:block sm:w-full text-left px-3 sm:px-2 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap flex-shrink-0',
            activePreset === preset.id 
              ? 'text-ditto-purple font-medium bg-ditto-purple/10' 
              : 'text-ditto-text hover:bg-ditto-light-grey'
          ]"
        >
          {{ preset.label }}
        </button>
      </div>
      
      <!-- Calendars -->
      <div class="flex flex-col sm:flex-row p-3 gap-3">
        <!-- Left Calendar (Previous Month) -->
        <div class="w-full sm:w-48">
          <div class="flex items-center justify-between mb-2">
            <button @click="prevMonth" class="p-0.5 hover:bg-ditto-light-grey rounded">
              <IconChevronLeft class="w-4 h-4 text-ditto-text" />
            </button>
            <span class="font-semibold text-ditto-text text-sm">{{ monthNames[leftMonth.month] }} {{ leftMonth.year }}</span>
            <div class="w-4"></div>
          </div>
          <CalendarGrid 
            :month="leftMonth.month" 
            :year="leftMonth.year"
            :selected-start="tempStart"
            :selected-end="tempEnd"
            :hover-date="hoverDate"
            @select="handleDateSelect"
            @hover="hoverDate = $event"
          />
        </div>
        
        <!-- Right Calendar (Current Month) -->
        <div class="w-full sm:w-48">
          <div class="flex items-center justify-between mb-2">
            <div class="w-4"></div>
            <span class="font-semibold text-ditto-text text-sm">{{ monthNames[rightMonth.month] }} {{ rightMonth.year }}</span>
            <button @click="nextMonth" class="p-0.5 hover:bg-ditto-light-grey rounded">
              <IconChevronRight class="w-4 h-4 text-ditto-text" />
            </button>
          </div>
          <CalendarGrid 
            :month="rightMonth.month" 
            :year="rightMonth.year"
            :selected-start="tempStart"
            :selected-end="tempEnd"
            :hover-date="hoverDate"
            @select="handleDateSelect"
            @hover="hoverDate = $event"
          />
        </div>
      </div>
    </div>
    
    <!-- Backdrop -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-40 bg-black/20 sm:bg-transparent" 
      @click="closePicker"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconCalendar } from '../icons'
import CalendarGrid from './CalendarGrid.vue'

// Custom chevron icons for calendar nav
const IconChevronLeft = {
  template: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15L7 10L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
}

const IconChevronRight = {
  template: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5L13 10L8 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
}

interface DateRange {
  start: Date
  end: Date
}

const props = defineProps<{
  modelValue: { start: string; end: string }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: { start: string; end: string }): void
}>()

const isOpen = ref(false)
const activePreset = ref<string | null>(null)
const hoverDate = ref<Date | null>(null)

// Parse initial dates
const parseDate = (str: string): Date => {
  const [day, month, year] = str.split('/')
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
}

const selectedRange = ref<DateRange>({
  start: parseDate(props.modelValue.start),
  end: parseDate(props.modelValue.end)
})

const tempStart = ref<Date | null>(selectedRange.value.start)
const tempEnd = ref<Date | null>(selectedRange.value.end)

// Calendar months
const today = new Date()
const leftMonth = ref({ month: today.getMonth() - 1 < 0 ? 11 : today.getMonth() - 1, year: today.getMonth() - 1 < 0 ? today.getFullYear() - 1 : today.getFullYear() })
const rightMonth = ref({ month: today.getMonth(), year: today.getFullYear() })

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

// Analytics data has a 3-day delay (including current date)
const latestDataDate = new Date(today)
latestDataDate.setDate(today.getDate() - 3)

const presets = [
  { id: 'last7days', label: 'Last 7 Days', getDates: () => {
    const end = new Date(latestDataDate)
    const start = new Date(latestDataDate)
    start.setDate(latestDataDate.getDate() - 6)
    return { start, end }
  }},
  { id: 'last28days', label: 'Last 28 Days', getDates: () => {
    const end = new Date(latestDataDate)
    const start = new Date(latestDataDate)
    start.setDate(latestDataDate.getDate() - 27)
    return { start, end }
  }},
  { id: 'lastMonth', label: 'Last Month', getDates: () => {
    const start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const end = new Date(today.getFullYear(), today.getMonth(), 0)
    return { start, end }
  }},
  { id: 'thisMonth', label: 'This Month', getDates: () => {
    const start = new Date(today.getFullYear(), today.getMonth(), 1)
    const end = new Date(latestDataDate)
    return { start, end }
  }},
  { id: 'last3months', label: 'Last 3 Months', getDates: () => {
    const end = new Date(latestDataDate)
    const start = new Date(latestDataDate)
    start.setMonth(latestDataDate.getMonth() - 3)
    return { start, end }
  }},
  { id: 'last12months', label: 'Last 12 Months', getDates: () => {
    const end = new Date(latestDataDate)
    const start = new Date(latestDataDate)
    start.setFullYear(latestDataDate.getFullYear() - 1)
    return { start, end }
  }},
]

const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const formatDateShort = (date: Date): string => {
  const day = date.getDate()
  const month = monthNames[date.getMonth()]
  return `${day} ${month}`
}

const prevMonth = () => {
  if (leftMonth.value.month === 0) {
    leftMonth.value = { month: 11, year: leftMonth.value.year - 1 }
  } else {
    leftMonth.value = { month: leftMonth.value.month - 1, year: leftMonth.value.year }
  }
  if (rightMonth.value.month === 0) {
    rightMonth.value = { month: 11, year: rightMonth.value.year - 1 }
  } else {
    rightMonth.value = { month: rightMonth.value.month - 1, year: rightMonth.value.year }
  }
}

const nextMonth = () => {
  if (leftMonth.value.month === 11) {
    leftMonth.value = { month: 0, year: leftMonth.value.year + 1 }
  } else {
    leftMonth.value = { month: leftMonth.value.month + 1, year: leftMonth.value.year }
  }
  if (rightMonth.value.month === 11) {
    rightMonth.value = { month: 0, year: rightMonth.value.year + 1 }
  } else {
    rightMonth.value = { month: rightMonth.value.month + 1, year: rightMonth.value.year }
  }
}

const handleDateSelect = (date: Date) => {
  if (!tempStart.value || (tempStart.value && tempEnd.value)) {
    // Start new selection
    tempStart.value = date
    tempEnd.value = null
  } else {
    // Complete selection
    if (date < tempStart.value) {
      tempEnd.value = tempStart.value
      tempStart.value = date
    } else {
      tempEnd.value = date
    }
    // Apply selection
    selectedRange.value = { start: tempStart.value, end: tempEnd.value }
    emit('update:modelValue', {
      start: formatDate(tempStart.value),
      end: formatDate(tempEnd.value)
    })
    activePreset.value = null
  }
}

const applyPreset = (preset: typeof presets[0]) => {
  const { start, end } = preset.getDates()
  tempStart.value = start
  tempEnd.value = end
  selectedRange.value = { start, end }
  activePreset.value = preset.id
  emit('update:modelValue', {
    start: formatDate(start),
    end: formatDate(end)
  })
}

const closePicker = () => {
  isOpen.value = false
}
</script>
