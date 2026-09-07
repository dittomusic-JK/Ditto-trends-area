<template>
  <div>
    <h2 class="font-satoshi font-black tracking-[-0.03em] text-xl lg:text-2xl text-ditto-text mb-2">Plan your release</h2>
    <p class="text-sm text-ditto-subtext mb-6">Choose when and how you want to release your video.</p>

    <!-- Date picker: same anatomy as the music builder — underline trigger,
         calendar dropdown on click. Required error only after leaving the step. -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-ditto-text mb-3">Release Date</label>
      <div class="relative max-w-xs" ref="calendarWrap">
        <button
          @click="showCalendar = !showCalendar"
          :class="[
            'w-full flex items-center gap-2.5 border-0 border-b px-0 py-2.5 text-sm bg-transparent transition-colors focus:outline-none',
            schedule.releaseDate || !visited ? 'border-gray-300 hover:border-ditto-purple' : 'border-error'
          ]"
        >
          <svg class="w-4 h-4 flex-shrink-0" :class="schedule.releaseDate || !visited ? 'text-ditto-purple' : 'text-error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span :class="schedule.releaseDate ? 'text-ditto-text font-medium' : 'text-ditto-subtext'">{{ schedule.releaseDate ? formatDate(schedule.releaseDate) : 'Select date' }}</span>
          <svg class="w-3.5 h-3.5 text-ditto-subtext ml-auto transition-transform" :class="showCalendar ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>

        <!-- Calendar dropdown -->
        <div v-if="showCalendar" class="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 z-30">
          <div class="flex items-center justify-between mb-3">
            <button @click="prevMonth" class="w-7 h-7 flex items-center justify-center rounded-lg text-ditto-subtext hover:bg-ditto-light-grey transition-colors">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <p class="text-sm font-bold text-ditto-text">{{ monthLabel }}</p>
            <button @click="nextMonth" class="w-7 h-7 flex items-center justify-center rounded-lg text-ditto-subtext hover:bg-ditto-light-grey transition-colors">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
          <div class="grid grid-cols-7 gap-y-1 text-center text-xs">
            <span v-for="d in ['Mo','Tu','We','Th','Fr','Sa','Su']" :key="d" class="font-semibold text-ditto-subtext py-1">{{ d }}</span>
            <button
              v-for="cell in calendarCells"
              :key="cell.key"
              :disabled="cell.disabled || !cell.inMonth"
              @click="selectDate(cell.date)"
              :class="[
                'relative h-8 rounded-lg text-[13px] transition-colors',
                !cell.inMonth ? 'text-gray-300' :
                isSelectedDate(cell.date) ? 'bg-ditto-purple text-white font-bold' :
                cell.isToday ? 'text-ditto-purple font-bold ring-1 ring-inset ring-ditto-purple/40' :
                cell.disabled ? 'text-gray-300 cursor-not-allowed' :
                'text-ditto-text hover:bg-ditto-light-grey'
              ]"
            >
              {{ cell.day }}
            </button>
          </div>
        </div>
      </div>
      <p v-if="visited && !schedule.releaseDate" class="text-xs text-error mt-2">Release date is required.</p>
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

    <!-- Release Time (no top rule — it would double up with the date field's underline) -->
    <div class="mb-6 pt-2">
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
      <!-- Hour / minute / timezone — custom dropdowns in the release-date trigger's format -->
      <div v-if="schedule.timedRelease" class="flex items-center gap-3 max-w-md">
        <UnderlineSelect class="w-20" :model-value="schedule.releaseTime.hour" :options="hourOptions" placeholder="HH" @update:model-value="updateTime('hour', $event)" />
        <UnderlineSelect class="w-20" :model-value="schedule.releaseTime.minute" :options="minuteOptions" placeholder="MM" @update:model-value="updateTime('minute', $event)" />
        <UnderlineSelect class="flex-1" :model-value="schedule.releaseTime.zone" :options="zoneOptions" placeholder="Timezone" @update:model-value="updateTime('zone', $event)" />
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import CountryRestrictionsModal from './CountryRestrictionsModal.vue'
import UnderlineSelect from './UnderlineSelect.vue'

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
  /** True once the user has left this step — required errors only show from then on */
  visited?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:schedule', schedule: Schedule): void
}>()

const today = new Date()
today.setHours(0, 0, 0, 0)

// Calendar dropdown (music-builder picker anatomy)
const showCalendar = ref(false)
const calendarWrap = ref<HTMLElement | null>(null)
const viewMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))

const monthLabel = computed(() =>
  viewMonth.value.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
)

const showCountryModal = ref(false)

// Release-time options
const hourOptions = Array.from({ length: 24 }, (_, h) => String(h).padStart(2, '0'))
const minuteOptions = ['00', '15', '30', '45']
const zoneOptions = ['Local to each store', 'UTC', 'BST (UK)', 'EST (US)']

const dayMs = 86400000
const daysFromToday = (d: Date) => Math.round((d.getTime() - today.getTime()) / dayMs)

const calendarCells = computed(() => {
  const first = viewMonth.value
  const startOffset = (first.getDay() + 6) % 7 // Monday-first
  const cells = []
  for (let i = 0; i < 42; i++) {
    const date = new Date(first.getFullYear(), first.getMonth(), 1 - startOffset + i)
    const diff = daysFromToday(date)
    cells.push({
      key: date.toISOString(),
      date,
      day: date.getDate(),
      inMonth: date.getMonth() === first.getMonth(),
      isToday: diff === 0,
      disabled: diff <= 0,
    })
  }
  return cells
})

// Check if selected date is within 3 days (show processing notice)
const isWithin3Days = computed(() => {
  if (!props.schedule.releaseDate) return false
  const diff = Math.ceil((props.schedule.releaseDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff > 0 && diff <= 3
})


const prevMonth = () => { viewMonth.value = new Date(viewMonth.value.getFullYear(), viewMonth.value.getMonth() - 1, 1) }
const nextMonth = () => { viewMonth.value = new Date(viewMonth.value.getFullYear(), viewMonth.value.getMonth() + 1, 1) }

const selectDate = (date: Date) => {
  emit('update:schedule', { ...props.schedule, releaseDate: date })
  showCalendar.value = false
}

const handleClickOutside = (e: MouseEvent) => {
  if (showCalendar.value && calendarWrap.value && !calendarWrap.value.contains(e.target as Node)) {
    showCalendar.value = false
  }
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

const isSelectedDate = (date: Date | null) => {
  if (!date || !props.schedule.releaseDate) return false
  return date.getTime() === props.schedule.releaseDate.getTime()
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
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

