<template>
  <div>
    <h2 class="font-satoshi font-black tracking-[-0.03em] text-xl lg:text-2xl text-ditto-text mb-2">Plan your release</h2>
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
                'text-ditto-text hover:bg-ditto-light-grey',
                !day.isCurrentMonth && day.date ? 'text-gray-400' : ''
              ]"
            >
              {{ day.dayNumber }}
            </button>
          </div>
        </div>
      </div>

      <!-- Right: Selected date -->
      <div class="flex flex-col">
        <div v-if="schedule.releaseDate" class="flex items-center gap-3 text-ditto-text mb-4 p-4 rounded-xl bg-ditto-light-grey/60">
          <svg class="w-6 h-6 text-ditto-purple flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span class="text-lg lg:text-xl font-semibold">{{ formatDate(schedule.releaseDate) }}</span>
        </div>
        <div v-else class="flex items-center gap-2 text-sm text-warning mb-4 p-3 rounded-xl bg-warning/5 border border-dashed border-warning/30">
          <svg class="w-4 h-4 text-warning flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <span>Release date is required</span>
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
      <!-- Same time controls as the music builder: hour / minute / timezone -->
      <div v-if="schedule.timedRelease" class="flex items-center gap-2 max-w-md">
        <select :value="schedule.releaseTime.hour" @change="updateTime('hour', ($event.target as HTMLSelectElement).value)" class="builder-select w-20"><option value="" disabled></option><option v-for="hh in 24" :key="hh" :value="String(hh - 1).padStart(2, '0')">{{ String(hh - 1).padStart(2, '0') }}</option></select>
        <select :value="schedule.releaseTime.minute" @change="updateTime('minute', ($event.target as HTMLSelectElement).value)" class="builder-select w-20"><option value="" disabled></option><option value="00">00</option><option value="15">15</option><option value="30">30</option><option value="45">45</option></select>
        <select :value="schedule.releaseTime.zone" @change="updateTime('zone', ($event.target as HTMLSelectElement).value)" class="builder-select flex-1"><option value="" disabled></option><option>Local to each store</option><option>UTC</option><option>BST (UK)</option><option>EST (US)</option></select>
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
      <!-- Same country popup as the music builder -->
      <div v-if="schedule.countryRestrictions" class="space-y-3">
        <p class="text-xs text-ditto-subtext">Your video will not be available in the selected countries.</p>
        <div class="flex flex-wrap items-center gap-2">
          <span
            v-for="country in schedule.restrictedCountries"
            :key="country"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-error/10 text-error"
          >
            {{ country }}
            <button @click="removeCountry(country)" class="hover:opacity-70" :aria-label="'Remove ' + country">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </span>
          <button
            @click="showCountryModal = true"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border border-gray-200 text-ditto-text hover:border-ditto-purple hover:text-ditto-purple transition-colors"
          >
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            {{ schedule.restrictedCountries.length ? 'Edit countries' : 'Select countries' }}
          </button>
        </div>
      </div>
    </div>

    <CountryRestrictionsModal
      v-if="showCountryModal"
      :selected="schedule.restrictedCountries"
      @update:selected="updateField('restrictedCountries', $event)"
      @close="showCountryModal = false"
    />

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
import CountryRestrictionsModal from './CountryRestrictionsModal.vue'

interface Schedule {
  releaseDate: Date | null
  timedRelease: boolean
  releaseTime: { hour: string; minute: string; zone: string }
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

const showCountryModal = ref(false)

interface CalendarDay {
  dayNumber: number
  date: Date | null
  isCurrentMonth: boolean
  disabled: boolean
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
  emit('update:schedule', { ...props.schedule, releaseDate: date })
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

const removeCountry = (country: string) => {
  updateField('restrictedCountries', props.schedule.restrictedCountries.filter(c => c !== country))
}

const updateTime = (key: 'hour' | 'minute' | 'zone', value: string) => {
  emit('update:schedule', { ...props.schedule, releaseTime: { ...props.schedule.releaseTime, [key]: value } })
}

const handleOriginalDateChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.value) {
    updateField('originalReleaseDate', new Date(input.value))
  }
}
</script>

<style scoped>
/* Underline select matching the builder field idiom (same as the music builder) */
.builder-select {
  border: 0;
  border-bottom: 1px solid #d1d5db;
  border-radius: 0;
  padding: 0.625rem 0;
  font-size: 0.875rem;
  color: var(--ditto-colors-light-dark-ditto-text-fill);
  background: transparent;
  transition: border-color 0.15s ease;
}
.builder-select:focus {
  outline: none;
  border-bottom-color: var(--ditto-purple);
}
</style>
