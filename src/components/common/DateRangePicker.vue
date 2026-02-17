<template>
  <div class="relative flex-1 lg:flex-none">
    <!-- Trigger Button -->
    <button 
      @click="openPicker"
      class="w-full flex items-center justify-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 border border-ditto-border-grey rounded-lg text-xs lg:text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors bg-white lg:w-auto"
    >
      <IconCalendar class="w-4 h-4 text-ditto-subtext" />
      <span>{{ formatDateShort(selectedRange.start) }}</span>
      <span class="text-ditto-subtext">-</span>
      <span>{{ formatDateShort(selectedRange.end) }}</span>
    </button>
    
    <!-- Desktop Dropdown -->
    <div 
      v-if="isOpen"
      class="hidden lg:flex absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-xl border border-ditto-border-grey z-50 flex-row"
    >
      <!-- Presets -->
      <div class="flex flex-col w-28 border-r border-ditto-border-grey py-3 px-2 gap-1">
        <button
          v-for="preset in presets"
          :key="preset.id"
          @click="applyPreset(preset)"
          :class="[
            'block w-full text-left px-2 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap',
            activePreset === preset.id 
              ? 'text-ditto-purple font-medium bg-ditto-purple/10' 
              : 'text-ditto-text hover:bg-ditto-light-grey'
          ]"
        >
          {{ preset.label }}
        </button>
      </div>
      
      <!-- Calendars -->
      <div class="flex flex-row p-3 gap-3">
        <!-- Left Calendar (Previous Month) -->
        <div class="w-48">
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
        <div class="w-48">
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
    
    <!-- Mobile Bottom Sheet -->
    <Teleport to="body">
      <transition name="sheet">
        <div v-if="isOpen" class="lg:hidden fixed inset-0 z-50">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/30" @click="cancelMobile"></div>
          
          <!-- Sheet -->
          <div class="absolute bottom-0 inset-x-0 bg-white rounded-t-2xl max-h-[85vh] flex flex-col">
            <!-- Drag handle -->
            <div class="flex justify-center pt-3 pb-1">
              <div class="w-10 h-1 rounded-full bg-gray-300"></div>
            </div>
            
            <!-- Header -->
            <div class="flex items-center justify-between px-4 pb-3">
              <h3 class="text-base font-semibold text-ditto-text">Select Date Range</h3>
              <button @click="cancelMobile" class="p-1 hover:bg-ditto-light-grey rounded-lg">
                <IconClose class="w-5 h-5 text-ditto-subtext" />
              </button>
            </div>
            
            <!-- Presets -->
            <div class="flex gap-1.5 px-4 pb-3 overflow-x-auto">
              <button
                v-for="preset in presets"
                :key="preset.id"
                @click="applyPresetMobile(preset)"
                :class="[
                  'px-3 py-1.5 text-xs rounded-full transition-colors whitespace-nowrap flex-shrink-0 border',
                  activePreset === preset.id 
                    ? 'text-ditto-purple font-medium bg-ditto-purple/10 border-ditto-purple/30' 
                    : 'text-ditto-text border-ditto-border-grey hover:bg-ditto-light-grey'
                ]"
              >
                {{ preset.label }}
              </button>
            </div>
            
            <!-- Selected range display -->
            <div class="flex items-center justify-center gap-3 px-4 pb-3">
              <div class="flex-1 text-center py-2 rounded-lg bg-ditto-light-grey">
                <p class="text-[10px] text-ditto-subtext">From</p>
                <p class="text-sm font-medium text-ditto-text">{{ tempStart ? formatDateShort(tempStart) : '–' }}</p>
              </div>
              <span class="text-ditto-subtext text-sm">→</span>
              <div class="flex-1 text-center py-2 rounded-lg bg-ditto-light-grey">
                <p class="text-[10px] text-ditto-subtext">To</p>
                <p class="text-sm font-medium text-ditto-text">{{ tempEnd ? formatDateShort(tempEnd) : '–' }}</p>
              </div>
            </div>
            
            <!-- Single Calendar -->
            <div class="px-6 pb-3">
              <div class="flex items-center justify-between mb-3">
                <button @click="prevMobileMonth" class="p-1.5 hover:bg-ditto-light-grey rounded-lg">
                  <IconChevronLeft class="w-5 h-5 text-ditto-text" />
                </button>
                <span class="font-semibold text-ditto-text text-base">{{ monthNames[mobileMonth.month] }} {{ mobileMonth.year }}</span>
                <button @click="nextMobileMonth" class="p-1.5 hover:bg-ditto-light-grey rounded-lg">
                  <IconChevronRight class="w-5 h-5 text-ditto-text" />
                </button>
              </div>
              <CalendarGrid 
                :month="mobileMonth.month" 
                :year="mobileMonth.year"
                :selected-start="tempStart"
                :selected-end="tempEnd"
                :hover-date="null"
                @select="handleMobileDateSelect"
                @hover="() => {}"
              />
            </div>
            
            <!-- Footer buttons -->
            <div class="flex gap-3 px-4 py-3 border-t border-ditto-border-grey">
              <button 
                @click="cancelMobile"
                class="flex-1 py-2.5 text-sm font-medium text-ditto-text border border-ditto-border-grey rounded-xl hover:bg-ditto-light-grey transition-colors"
              >
                Cancel
              </button>
              <button 
                @click="applyMobile"
                :disabled="!tempStart || !tempEnd"
                :class="[
                  'flex-1 py-2.5 text-sm font-medium rounded-xl transition-colors',
                  tempStart && tempEnd 
                    ? 'bg-ditto-purple text-white hover:bg-ditto-purple/90'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                ]"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
    
    <!-- Desktop Backdrop -->
    <div 
      v-if="isOpen" 
      class="hidden lg:block fixed inset-0 z-40" 
      @click="closePicker"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconCalendar, IconClose } from '../icons'
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

// Mobile single calendar month
const mobileMonth = ref({ month: today.getMonth(), year: today.getFullYear() })

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

// --- Open / close ---

const openPicker = () => {
  tempStart.value = selectedRange.value.start
  tempEnd.value = selectedRange.value.end
  mobileMonth.value = { month: selectedRange.value.end.getMonth(), year: selectedRange.value.end.getFullYear() }
  isOpen.value = true
}

const closePicker = () => {
  isOpen.value = false
}

// --- Desktop behaviour (unchanged — auto-apply on second click) ---

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
    tempStart.value = date
    tempEnd.value = null
  } else {
    if (date < tempStart.value) {
      tempEnd.value = tempStart.value
      tempStart.value = date
    } else {
      tempEnd.value = date
    }
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

// --- Mobile behaviour (explicit Apply / Cancel) ---

const prevMobileMonth = () => {
  if (mobileMonth.value.month === 0) {
    mobileMonth.value = { month: 11, year: mobileMonth.value.year - 1 }
  } else {
    mobileMonth.value = { month: mobileMonth.value.month - 1, year: mobileMonth.value.year }
  }
}

const nextMobileMonth = () => {
  if (mobileMonth.value.month === 11) {
    mobileMonth.value = { month: 0, year: mobileMonth.value.year + 1 }
  } else {
    mobileMonth.value = { month: mobileMonth.value.month + 1, year: mobileMonth.value.year }
  }
}

const handleMobileDateSelect = (date: Date) => {
  if (!tempStart.value || (tempStart.value && tempEnd.value)) {
    tempStart.value = date
    tempEnd.value = null
    activePreset.value = null
  } else {
    if (date < tempStart.value) {
      tempEnd.value = tempStart.value
      tempStart.value = date
    } else {
      tempEnd.value = date
    }
    activePreset.value = null
  }
}

const applyPresetMobile = (preset: typeof presets[0]) => {
  const { start, end } = preset.getDates()
  tempStart.value = start
  tempEnd.value = end
  activePreset.value = preset.id
  // Navigate calendar to show the end date month
  mobileMonth.value = { month: end.getMonth(), year: end.getFullYear() }
}

const applyMobile = () => {
  if (tempStart.value && tempEnd.value) {
    selectedRange.value = { start: tempStart.value, end: tempEnd.value }
    emit('update:modelValue', {
      start: formatDate(tempStart.value),
      end: formatDate(tempEnd.value)
    })
    isOpen.value = false
  }
}

const cancelMobile = () => {
  tempStart.value = selectedRange.value.start
  tempEnd.value = selectedRange.value.end
  isOpen.value = false
}
</script>

<style scoped>
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s ease;
}
.sheet-enter-active > div:last-child,
.sheet-leave-active > div:last-child {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
.sheet-enter-from > div:last-child,
.sheet-leave-to > div:last-child {
  transform: translateY(100%);
}
</style>
