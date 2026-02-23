<template>
  <div class="date-range-picker">
    <!-- Trigger Button -->
    <button
      @click="openPicker"
      class="trigger-btn"
    >
      <IconCalendar class="trigger-btn__icon" />
      <span>{{ formatDateShort(selectedRange.start) }}</span>
      <span class="trigger-btn__separator">-</span>
      <span>{{ formatDateShort(selectedRange.end) }}</span>
    </button>

    <!-- Desktop Dropdown -->
    <div
      v-if="isOpen"
      class="desktop-dropdown"
    >
      <!-- Presets -->
      <div class="desktop-presets">
        <button
          v-for="preset in presets"
          :key="preset.id"
          @click="applyPreset(preset)"
          :class="[
            'desktop-presets__item',
            activePreset === preset.id
              ? 'desktop-presets__item--active'
              : 'desktop-presets__item--inactive'
          ]"
        >
          {{ preset.label }}
        </button>
      </div>

      <!-- Calendars -->
      <div class="desktop-calendars">
        <!-- Left Calendar (Previous Month) -->
        <div class="calendar-panel">
          <div class="calendar-panel__header">
            <button @click="prevMonth" class="calendar-nav-btn">
              <IconChevronLeft class="calendar-nav-btn__icon" />
            </button>
            <span class="calendar-panel__title">{{ monthNames[leftMonth.month] }} {{ leftMonth.year }}</span>
            <div class="calendar-nav-btn__spacer"></div>
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
        <div class="calendar-panel">
          <div class="calendar-panel__header">
            <div class="calendar-nav-btn__spacer"></div>
            <span class="calendar-panel__title">{{ monthNames[rightMonth.month] }} {{ rightMonth.year }}</span>
            <button @click="nextMonth" class="calendar-nav-btn">
              <IconChevronRight class="calendar-nav-btn__icon" />
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
        <div v-if="isOpen" class="mobile-sheet-overlay">
          <!-- Backdrop -->
          <div class="mobile-sheet-overlay__backdrop" @click="cancelMobile"></div>

          <!-- Sheet -->
          <div class="mobile-sheet">
            <!-- Drag handle -->
            <div class="mobile-sheet__handle-wrapper">
              <div class="mobile-sheet__handle"></div>
            </div>

            <!-- Header -->
            <div class="mobile-sheet__header">
              <h3 class="mobile-sheet__title">Select Date Range</h3>
              <button @click="cancelMobile" class="mobile-sheet__close-btn">
                <IconClose class="mobile-sheet__close-icon" />
              </button>
            </div>

            <!-- Presets -->
            <div class="mobile-presets scrollbar-hide">
              <button
                v-for="preset in presets"
                :key="preset.id"
                @click="applyPresetMobile(preset)"
                :class="[
                  'mobile-presets__item',
                  activePreset === preset.id
                    ? 'mobile-presets__item--active'
                    : 'mobile-presets__item--inactive'
                ]"
              >
                {{ preset.label }}
              </button>
            </div>

            <!-- Selected range display -->
            <div class="mobile-range-display">
              <div class="mobile-range-display__date-box">
                <p class="mobile-range-display__label">From</p>
                <p class="mobile-range-display__value">{{ tempStart ? formatDateShort(tempStart) : '–' }}</p>
              </div>
              <span class="mobile-range-display__arrow">→</span>
              <div class="mobile-range-display__date-box">
                <p class="mobile-range-display__label">To</p>
                <p class="mobile-range-display__value">{{ tempEnd ? formatDateShort(tempEnd) : '–' }}</p>
              </div>
            </div>

            <!-- Single Calendar -->
            <div class="mobile-calendar">
              <div class="mobile-calendar__header">
                <button @click="prevMobileMonth" class="mobile-calendar__nav-btn">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="mobile-calendar__nav-icon">
                    <path d="M12 15L7 10L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <span class="mobile-calendar__title">{{ monthNames[mobileMonth.month] }} {{ mobileMonth.year }}</span>
                <button @click="nextMobileMonth" class="mobile-calendar__nav-btn">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="mobile-calendar__nav-icon">
                    <path d="M8 5L13 10L8 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
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
            <div class="mobile-sheet__footer">
              <button
                @click="cancelMobile"
                class="mobile-sheet__cancel-btn"
              >
                Cancel
              </button>
              <button
                @click="applyMobile"
                :disabled="!tempStart || !tempEnd"
                :class="[
                  'mobile-sheet__apply-btn',
                  tempStart && tempEnd
                    ? 'mobile-sheet__apply-btn--enabled'
                    : 'mobile-sheet__apply-btn--disabled'
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
      class="desktop-backdrop"
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

<style lang="scss" scoped>
// ─── Transition (preserved from original) ───
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

// ─── Root ───
.date-range-picker {
  position: relative;
  flex: 1;

  @include lg {
    flex: none;
  }
}

// ─── Trigger Button ───
.trigger-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px; // 1.5 * 4
  padding: 8px 12px; // py-2 px-3
  border: 1px solid var(--brand-border);
  border-radius: 8px; // rounded-lg
  font-size: 12px; // text-xs
  color: var(--blue);
  background-color: white;
  transition-property: color, background-color, border-color;
  transition-timing-function: ease;
  transition-duration: 150ms;
  cursor: pointer;

  &:hover {
    background-color: var(--lighter-grey);
  }

  @include lg {
    width: auto;
    gap: 8px; // lg:gap-2
    padding: 8px 16px; // lg:px-4 py-2
    font-size: 14px; // lg:text-sm
  }

  &__icon {
    width: 16px;
    height: 16px;
    color: var(--ditto-grey);
  }

  &__separator {
    color: var(--ditto-grey);
  }
}

// ─── Desktop Dropdown ───
.desktop-dropdown {
  display: none;

  @include lg {
    display: flex;
    flex-direction: row;
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    background-color: white;
    border-radius: 16px; // rounded-2xl
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
                0 8px 10px -6px rgba(0, 0, 0, 0.1); // shadow-xl
    border: 1px solid var(--brand-border);
    z-index: 50;
  }
}

// ─── Desktop Presets ───
.desktop-presets {
  display: flex;
  flex-direction: column;
  width: 112px; // w-28
  border-right: 1px solid var(--brand-border);
  padding: 12px 8px; // py-3 px-2
  gap: 4px;

  &__item {
    display: block;
    width: 100%;
    text-align: left;
    padding: 6px 8px; // px-2 py-1.5
    font-size: 12px; // text-xs
    border-radius: 8px; // rounded-lg
    transition-property: color, background-color;
    transition-timing-function: ease;
    transition-duration: 150ms;
    white-space: nowrap;
    cursor: pointer;
    border: none;
    background: none;

    &--active {
      color: var(--brand-primary);
      font-weight: 500;
      background-color: rgba(95, 31, 255, 0.1);
    }

    &--inactive {
      color: var(--blue);

      &:hover {
        background-color: var(--lighter-grey);
      }
    }
  }
}

// ─── Desktop Calendars ───
.desktop-calendars {
  display: flex;
  flex-direction: row;
  padding: 12px;
  gap: 12px;
}

// ─── Calendar Panel (shared between left/right desktop calendars) ───
.calendar-panel {
  width: 192px; // w-48

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  &__title {
    font-weight: 600;
    color: var(--blue);
    font-size: 14px; // text-sm
  }
}

// ─── Calendar Nav Button ───
.calendar-nav-btn {
  padding: 2px; // p-0.5
  border-radius: 4px;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: var(--lighter-grey);
  }

  &__icon {
    width: 16px;
    height: 16px;
    color: var(--blue);
  }

  &__spacer {
    width: 16px;
  }
}

// ─── Mobile Bottom Sheet Overlay ───
.mobile-sheet-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;

  @include lg {
    display: none;
  }

  &__backdrop {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }
}

// ─── Mobile Sheet ───
.mobile-sheet {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-radius: 16px 16px 0 0; // rounded-t-2xl
  max-height: 85vh;
  display: flex;
  flex-direction: column;

  &__handle-wrapper {
    display: flex;
    justify-content: center;
    padding-top: 12px;
    padding-bottom: 4px;
  }

  &__handle {
    width: 40px; // w-10
    height: 4px;
    border-radius: 9999px;
    background-color: #d1d5db; // gray-300
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px 12px; // px-4 pb-3
  }

  &__title {
    font-size: 16px; // text-base
    font-weight: 600;
    color: var(--blue);
    margin: 0;
  }

  &__close-btn {
    padding: 4px;
    border-radius: 8px;
    background: none;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: var(--lighter-grey);
    }
  }

  &__close-icon {
    width: 20px;
    height: 20px;
    color: var(--ditto-grey);
  }

  &__footer {
    display: flex;
    gap: 12px;
    padding: 12px 16px; // px-4 py-3
    border-top: 1px solid var(--brand-border);
  }

  &__cancel-btn {
    flex: 1;
    padding: 10px 0; // py-2.5
    font-size: 14px;
    font-weight: 500;
    color: var(--blue);
    border: 1px solid var(--brand-border);
    border-radius: 12px; // rounded-xl
    background: none;
    cursor: pointer;
    transition-property: background-color;
    transition-timing-function: ease;
    transition-duration: 150ms;

    &:hover {
      background-color: var(--lighter-grey);
    }
  }

  &__apply-btn {
    flex: 1;
    padding: 10px 0; // py-2.5
    font-size: 14px;
    font-weight: 500;
    border-radius: 12px; // rounded-xl
    border: none;
    cursor: pointer;
    transition-property: color, background-color;
    transition-timing-function: ease;
    transition-duration: 150ms;

    &--enabled {
      background-color: var(--brand-primary);
      color: white;

      &:hover {
        background-color: rgba(95, 31, 255, 0.9);
      }
    }

    &--disabled {
      background-color: #e5e7eb; // gray-200
      color: #9ca3af; // gray-400
      cursor: not-allowed;
    }
  }
}

// ─── Mobile Presets ───
.mobile-presets {
  display: flex;
  gap: 6px;
  padding: 0 16px 12px; // px-4 pb-3
  overflow-x: auto;

  &__item {
    padding: 6px 12px; // px-3 py-1.5
    font-size: 12px;
    border-radius: 9999px; // rounded-full
    transition-property: color, background-color, border-color;
    transition-timing-function: ease;
    transition-duration: 150ms;
    white-space: nowrap;
    flex-shrink: 0;
    cursor: pointer;
    background: none;

    &--active {
      color: var(--brand-primary);
      font-weight: 500;
      background-color: rgba(95, 31, 255, 0.1);
      border: 1px solid rgba(95, 31, 255, 0.3);
    }

    &--inactive {
      color: var(--blue);
      border: 1px solid var(--brand-border);

      &:hover {
        background-color: var(--lighter-grey);
      }
    }
  }
}

// ─── Mobile Range Display ───
.mobile-range-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 0 16px 12px; // px-4 pb-3

  &__date-box {
    flex: 1;
    text-align: center;
    padding: 8px 0; // py-2
    border-radius: 8px;
    background-color: var(--lighter-grey);
  }

  &__label {
    font-size: 10px;
    color: var(--ditto-grey);
    margin: 0;
  }

  &__value {
    font-size: 14px;
    font-weight: 500;
    color: var(--blue);
    margin: 0;
  }

  &__arrow {
    color: var(--ditto-grey);
    font-size: 14px;
  }
}

// ─── Mobile Calendar ───
.mobile-calendar {
  padding: 0 24px 12px; // px-6 pb-3

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  &__title {
    font-weight: 600;
    color: var(--blue);
    font-size: 16px; // text-base
  }

  &__nav-btn {
    padding: 6px; // p-1.5
    border-radius: 8px;
    background: none;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: var(--lighter-grey);
    }
  }

  &__nav-icon {
    width: 20px;
    height: 20px;
    color: var(--blue);
  }
}

// ─── Desktop Backdrop ───
.desktop-backdrop {
  display: none;

  @include lg {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 40;
  }
}
</style>
