<template>
  <div>
    <h2 class="font-poppins font-bold text-xl lg:text-2xl text-ditto-text mb-2">Plan your release</h2>
    <p class="text-sm text-ditto-subtext mb-6">Choose when and how you want to release your video.</p>

    <!-- Desktop: side-by-side | Mobile: stacked -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6">
      <!-- Left: Calendar -->
      <div>
        <label class="block text-sm font-medium text-ditto-text mb-3">Release Date</label>
        <div class="rounded-2xl border border-gray-200 p-4">
          <!-- Calendar Header -->
          <div class="flex items-center justify-between mb-3">
            <button @click="prevMonth" class="w-8 h-8 rounded-full hover:bg-ditto-light-grey flex items-center justify-center transition-colors">
              <svg class="w-4 h-4 text-ditto-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <span class="text-sm font-semibold text-ditto-text">{{ monthNames[calendarMonth] }} {{ calendarYear }}</span>
            <button @click="nextMonth" class="w-8 h-8 rounded-full hover:bg-ditto-light-grey flex items-center justify-center transition-colors">
              <svg class="w-4 h-4 text-ditto-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <!-- Day Headers -->
          <div class="grid grid-cols-7 mb-1">
            <div v-for="day in dayNames" :key="day" class="text-center text-[10px] font-medium text-ditto-subtext py-1">
              {{ day }}
            </div>
          </div>

          <!-- Calendar Days -->
          <div class="grid grid-cols-7 gap-y-0.5">
            <button
              v-for="(day, index) in calendarDays"
              :key="index"
              @click="day.date && !day.disabled ? selectDate(day.date) : null"
              :disabled="!day.date || day.disabled"
              :class="[
                'aspect-square flex items-center justify-center text-xs rounded-full relative transition-all',
                !day.date ? 'invisible' :
                day.disabled ? 'text-gray-300 cursor-not-allowed' :
                isSelectedDate(day.date) ? 'bg-ditto-purple text-white font-medium' :
                day.isPriority ? 'text-ditto-text hover:bg-ditto-light-grey' :
                'text-ditto-text hover:bg-ditto-light-grey',
                !day.isCurrentMonth && day.date ? 'text-gray-400' : ''
              ]"
            >
              {{ day.dayNumber }}
              <span v-if="day.isPriority && !day.disabled && !isSelectedDate(day.date)" class="absolute bottom-0.5 w-1 h-1 rounded-full bg-warning"></span>
            </button>
          </div>

          <!-- Legend -->
          <div class="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-warning"></span>
              <span class="text-[10px] text-ditto-subtext">Priority only</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-4 h-4 rounded-full bg-ditto-purple flex items-center justify-center">
                <span class="w-1 h-1 rounded-full bg-white"></span>
              </span>
              <span class="text-[10px] text-ditto-subtext">Selected</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Distribution + Date Info -->
      <div class="flex flex-col">
        <label class="block text-sm font-medium text-ditto-text mb-3">Release Distribution</label>

        <!-- Selected Date Display -->
        <div v-if="schedule.releaseDate" class="flex items-center gap-2 text-sm text-ditto-text mb-4 p-3 rounded-xl bg-ditto-light-grey/60">
          <svg class="w-4 h-4 text-ditto-purple flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>{{ formatDate(schedule.releaseDate) }}</span>
        </div>
        <div v-else class="flex items-center gap-2 text-sm text-warning mb-4 p-3 rounded-xl bg-warning/5 border border-dashed border-warning/30">
          <svg class="w-4 h-4 text-warning flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <span>Release date is required</span>
        </div>

        <!-- Priority-only warning -->
        <div v-if="isPriorityOnly" class="mb-3 p-3 rounded-xl bg-warning/10 border border-warning/20 flex items-start gap-2">
          <svg class="w-4 h-4 text-warning flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <p class="text-xs text-warning">This date is within 10 days. Priority Distribution is required for timely delivery.</p>
        </div>

        <div class="space-y-3 flex-1">
          <!-- Priority Distro -->
          <button
            @click="schedule.releaseDate ? updateField('distributionType', 'priority') : null"
            :disabled="!schedule.releaseDate"
            :class="[
              'relative w-full p-5 rounded-xl text-left transition-all overflow-hidden',
              !schedule.releaseDate ? 'opacity-40 cursor-not-allowed bg-gradient-to-br from-indigo-600 to-purple-600' :
              schedule.distributionType === 'priority'
                ? 'bg-gradient-to-br from-indigo-600 to-purple-600 ring-2 ring-ditto-purple ring-offset-2'
                : 'bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
            ]"
          >
            <svg class="absolute top-3 right-3 w-7 h-7 text-white/30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L3 14h9l-1 10 10-12h-9l1-10z"/>
            </svg>
            <p class="text-white font-bold text-sm mb-0.5">Priority Distro</p>
            <p class="text-white/60 text-[10px] uppercase tracking-wider mb-2">Less than 3 days</p>
            <p class="text-white/90 text-xs leading-relaxed">Skip the queue to get your video out extra fast or give yourself more time to pitch for playlists.</p>
            <p class="text-white font-bold text-sm mt-2">+$40</p>
          </button>

          <!-- Standard Distro -->
          <button
            @click="handleStandardClick"
            :class="[
              'relative w-full p-5 rounded-xl text-left transition-all border-2',
              isPriorityOnly ? 'border-gray-200 opacity-40 cursor-not-allowed bg-gray-50' :
              !schedule.releaseDate ? 'border-gray-200 opacity-40 cursor-not-allowed' :
              schedule.distributionType === 'standard'
                ? 'border-ditto-purple bg-white ring-2 ring-ditto-purple ring-offset-2'
                : 'border-gray-200 bg-white hover:border-gray-300'
            ]"
          >
            <div v-if="schedule.distributionType === 'standard' && !isPriorityOnly" class="absolute top-3 right-3">
              <svg class="w-6 h-6 text-ditto-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="22,4 12,14.01 9,11.01" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <!-- Lock icon when priority only -->
            <div v-if="isPriorityOnly" class="absolute top-3 right-3">
              <svg class="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
            </div>
            <p :class="isPriorityOnly ? 'text-gray-400' : 'text-ditto-text'" class="font-bold text-sm mb-0.5">Standard Distro</p>
            <p :class="isPriorityOnly ? 'text-gray-300' : 'text-ditto-subtext'" class="text-[10px] uppercase tracking-wider mb-2">10 days+</p>
            <p :class="isPriorityOnly ? 'text-gray-400' : 'text-ditto-subtext'" class="text-xs leading-relaxed">We'll let you know when your music has been processed and sent to stores.</p>
            <p :class="isPriorityOnly ? 'text-gray-400' : 'text-success'" class="font-bold text-sm mt-2">{{ isPriorityOnly ? 'Unavailable' : 'Included' }}</p>
          </button>
        </div>
      </div>
    </div>

    <!-- Store Processing Notice (shown when date is within 3 days) -->
    <div v-if="isWithin3Days" class="mb-6 p-4 rounded-xl bg-info/10 border border-info/20 flex items-start gap-3">
      <svg class="w-5 h-5 text-info flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
      <div>
        <p class="text-sm font-medium text-ditto-text mb-0.5">Store processing times</p>
        <p class="text-xs text-ditto-subtext leading-relaxed">
          Your video will go live on most platforms on this date, but some stores can take up to <strong class="text-ditto-text">48 hours</strong> to process new releases.
        </p>
      </div>
    </div>

    <!-- Release Time -->
    <div class="mb-6 border-t border-gray-200 pt-5">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm text-ditto-text">Set a specific release time?</span>
        <button
          @click="updateField('timedRelease', !schedule.timedRelease)"
          :class="[
            'w-[51px] h-[31px] rounded-full relative transition-colors flex-shrink-0',
            schedule.timedRelease ? 'bg-[#34c759]' : 'bg-[#e9e9eb]'
          ]"
        >
          <span :class="[
            'absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform',
            schedule.timedRelease ? 'translate-x-[20px]' : 'translate-x-0'
          ]"></span>
        </button>
      </div>
      <div v-if="schedule.timedRelease">
        <input
          :value="schedule.releaseTime"
          @input="updateField('releaseTime', ($event.target as HTMLInputElement).value)"
          type="time"
          class="px-0 py-2 border-0 border-b border-gray-300 text-sm text-ditto-text bg-transparent focus:outline-none focus:border-ditto-purple transition-colors"
        />
      </div>
    </div>

    <!-- Country Restrictions -->
    <div class="mb-6 border-t border-gray-200 pt-5">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm text-ditto-text">Country restrictions?</span>
        <button
          @click="updateField('countryRestrictions', !schedule.countryRestrictions)"
          :class="[
            'w-[51px] h-[31px] rounded-full relative transition-colors flex-shrink-0',
            schedule.countryRestrictions ? 'bg-[#34c759]' : 'bg-[#e9e9eb]'
          ]"
        >
          <span :class="[
            'absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform',
            schedule.countryRestrictions ? 'translate-x-[20px]' : 'translate-x-0'
          ]"></span>
        </button>
      </div>
      <div v-if="schedule.countryRestrictions" class="space-y-2">
        <p class="text-xs text-ditto-subtext">Select countries where this video should NOT be available.</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="country in sampleCountries"
            :key="country"
            @click="toggleCountry(country)"
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium transition-colors',
              schedule.restrictedCountries.includes(country) ? 'bg-error/15 text-error' : 'bg-ditto-light-grey text-ditto-text hover:bg-gray-200'
            ]"
          >{{ country }}</button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div v-if="toastMessage" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-ditto-text text-white text-sm font-medium shadow-lg flex items-center gap-2">
        <svg class="w-4 h-4 text-warning flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        {{ toastMessage }}
      </div>
    </Transition>

    <!-- Original Release Date -->
    <div class="border-t border-gray-200 pt-5">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm text-ditto-text">Is this a re-release? (Original release date)</span>
        <button
          @click="updateField('hasOriginalDate', !schedule.hasOriginalDate)"
          :class="[
            'w-[51px] h-[31px] rounded-full relative transition-colors flex-shrink-0',
            schedule.hasOriginalDate ? 'bg-[#34c759]' : 'bg-[#e9e9eb]'
          ]"
        >
          <span :class="[
            'absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform',
            schedule.hasOriginalDate ? 'translate-x-[20px]' : 'translate-x-0'
          ]"></span>
        </button>
      </div>
      <div v-if="schedule.hasOriginalDate">
        <input
          type="date"
          :value="schedule.originalReleaseDate ? formatDateInput(schedule.originalReleaseDate) : ''"
          @input="handleOriginalDateChange"
          class="px-0 py-2 border-0 border-b border-gray-300 text-sm text-ditto-text bg-transparent focus:outline-none focus:border-ditto-purple transition-colors"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Schedule {
  releaseDate: Date | null
  distributionType: '' | 'priority' | 'standard'
  timedRelease: boolean
  releaseTime: string
  countryRestrictions: boolean
  restrictedCountries: string[]
  hasOriginalDate: boolean
  originalReleaseDate: Date | null
}

const props = defineProps<{
  schedule: Schedule
}>()

const emit = defineEmits<{
  (e: 'update:schedule', schedule: Schedule): void
}>()

const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const today = new Date()
today.setHours(0, 0, 0, 0)

const calendarMonth = ref(today.getMonth())
const calendarYear = ref(today.getFullYear())

const sampleCountries = ['United Kingdom', 'United States', 'Germany', 'France', 'Japan', 'Australia', 'Brazil', 'Canada', 'India', 'Nigeria']

// Toast
const toastMessage = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null

const showToast = (message: string) => {
  if (toastTimer) clearTimeout(toastTimer)
  toastMessage.value = message
  toastTimer = setTimeout(() => { toastMessage.value = '' }, 3500)
}

const handleStandardClick = () => {
  if (isPriorityOnly.value) {
    showToast('You need to pick a day 10+ days in the future to use Standard Distro')
    return
  }
  if (!props.schedule.releaseDate) return
  updateField('distributionType', 'standard')
}

interface CalendarDay {
  dayNumber: number
  date: Date | null
  isCurrentMonth: boolean
  disabled: boolean
  isPriority: boolean
}

const calendarDays = computed<CalendarDay[]>(() => {
  const days: CalendarDay[] = []
  const firstDay = new Date(calendarYear.value, calendarMonth.value, 1)
  const lastDay = new Date(calendarYear.value, calendarMonth.value + 1, 0)

  let startDayOfWeek = firstDay.getDay() - 1
  if (startDayOfWeek < 0) startDayOfWeek = 6

  // Previous month padding
  const prevMonthLastDay = new Date(calendarYear.value, calendarMonth.value, 0).getDate()
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i
    const date = new Date(calendarYear.value, calendarMonth.value - 1, dayNum)
    days.push({
      dayNumber: dayNum,
      date,
      isCurrentMonth: false,
      disabled: true,
      isPriority: false,
    })
  }

  // Current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(calendarYear.value, calendarMonth.value, i)
    date.setHours(0, 0, 0, 0)
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    days.push({
      dayNumber: i,
      date,
      isCurrentMonth: true,
      disabled: diffDays <= 0,
      isPriority: diffDays > 0 && diffDays <= 10,
    })
  }

  // Next month padding
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({
      dayNumber: i,
      date: new Date(calendarYear.value, calendarMonth.value + 1, i),
      isCurrentMonth: false,
      disabled: true,
      isPriority: false,
    })
  }

  return days
})

// Check if selected date is within 3 days (show processing notice)
const isWithin3Days = computed(() => {
  if (!props.schedule.releaseDate) return false
  const diff = Math.ceil((props.schedule.releaseDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff > 0 && diff <= 3
})

// Check if selected date is priority-only (within 10 days)
const isPriorityOnly = computed(() => {
  if (!props.schedule.releaseDate) return false
  const diff = Math.ceil((props.schedule.releaseDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff > 0 && diff <= 10
})

const prevMonth = () => {
  if (calendarMonth.value === 0) {
    calendarMonth.value = 11
    calendarYear.value--
  } else {
    calendarMonth.value--
  }
}

const nextMonth = () => {
  if (calendarMonth.value === 11) {
    calendarMonth.value = 0
    calendarYear.value++
  } else {
    calendarMonth.value++
  }
}

const selectDate = (date: Date) => {
  const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const updated = { ...props.schedule, releaseDate: date }
  // Auto-select priority if within 10 days
  if (diff > 0 && diff <= 10) {
    updated.distributionType = 'priority'
  }
  // Clear standard selection if switching to priority-only date
  if (diff > 0 && diff <= 10 && updated.distributionType === 'standard') {
    updated.distributionType = 'priority'
  }
  emit('update:schedule', updated)
}

const isSelectedDate = (date: Date | null) => {
  if (!date || !props.schedule.releaseDate) return false
  return date.getTime() === props.schedule.releaseDate.getTime()
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

const formatDateInput = (date: Date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const updateField = (key: keyof Schedule, value: any) => {
  emit('update:schedule', { ...props.schedule, [key]: value })
}

const toggleCountry = (country: string) => {
  const updated = { ...props.schedule }
  const idx = updated.restrictedCountries.indexOf(country)
  if (idx >= 0) {
    updated.restrictedCountries = updated.restrictedCountries.filter(c => c !== country)
  } else {
    updated.restrictedCountries = [...updated.restrictedCountries, country]
  }
  emit('update:schedule', updated)
}

const handleOriginalDateChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.value) {
    updateField('originalReleaseDate', new Date(input.value))
  }
}
</script>
