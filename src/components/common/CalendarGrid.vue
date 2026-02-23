<template>
  <div>
    <!-- Day Headers -->
    <div class="day-headers">
      <div
        v-for="day in dayNames"
        :key="day"
        class="day-header"
      >
        {{ day }}
      </div>
    </div>

    <!-- Calendar Days -->
    <div class="day-grid">
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        @click="day.date && $emit('select', day.date)"
        @mouseenter="day.date && $emit('hover', day.date)"
        @mouseleave="$emit('hover', null)"
        :class="['day-cell', getDayClasses(day)]"
      >
        <span :class="{ 'day-span--other-month': !day.isCurrentMonth }">
          {{ day.dayNumber }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  month: number
  year: number
  selectedStart: Date | null
  selectedEnd: Date | null
  hoverDate: Date | null
}>()

defineEmits<{
  (e: 'select', date: Date): void
  (e: 'hover', date: Date | null): void
}>()

const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

interface CalendarDay {
  dayNumber: number
  date: Date | null
  isCurrentMonth: boolean
}

const calendarDays = computed<CalendarDay[]>(() => {
  const days: CalendarDay[] = []

  // First day of the month
  const firstDay = new Date(props.year, props.month, 1)
  // Last day of the month
  const lastDay = new Date(props.year, props.month + 1, 0)

  // Day of week for first day (0 = Sunday, we want Monday = 0)
  let startDayOfWeek = firstDay.getDay() - 1
  if (startDayOfWeek < 0) startDayOfWeek = 6

  // Previous month days
  const prevMonthLastDay = new Date(props.year, props.month, 0).getDate()
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i
    days.push({
      dayNumber: dayNum,
      date: new Date(props.year, props.month - 1, dayNum),
      isCurrentMonth: false
    })
  }

  // Current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({
      dayNumber: i,
      date: new Date(props.year, props.month, i),
      isCurrentMonth: true
    })
  }

  // Next month days to fill grid
  const remainingDays = 42 - days.length // 6 rows x 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      dayNumber: i,
      date: new Date(props.year, props.month + 1, i),
      isCurrentMonth: false
    })
  }

  return days
})

const isSameDay = (d1: Date | null, d2: Date | null): boolean => {
  if (!d1 || !d2) return false
  return d1.getDate() === d2.getDate() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getFullYear() === d2.getFullYear()
}

const isInRange = (date: Date | null): boolean => {
  if (!date || !props.selectedStart) return false

  const end = props.selectedEnd || props.hoverDate
  if (!end) return false

  const start = props.selectedStart < end ? props.selectedStart : end
  const endDate = props.selectedStart < end ? end : props.selectedStart

  return date > start && date < endDate
}

const isRangeStart = (date: Date | null): boolean => {
  if (!date || !props.selectedStart) return false
  const end = props.selectedEnd || props.hoverDate
  if (!end) return isSameDay(date, props.selectedStart)

  const start = props.selectedStart < end ? props.selectedStart : end
  return isSameDay(date, start)
}

const isRangeEnd = (date: Date | null): boolean => {
  if (!date) return false
  const end = props.selectedEnd || props.hoverDate
  if (!end || !props.selectedStart) return false

  const endDate = props.selectedStart < end ? end : props.selectedStart
  return isSameDay(date, endDate)
}

const getDayClasses = (day: CalendarDay): string => {
  const classes: string[] = []

  if (!day.date || !day.isCurrentMonth) {
    return 'day--outside'
  }

  const isStart = isRangeStart(day.date)
  const isEnd = isRangeEnd(day.date)
  const inRange = isInRange(day.date)

  if (isStart || isEnd) {
    classes.push('day--selected')
  } else if (inRange) {
    classes.push('day--in-range')
  } else {
    classes.push('day--default')
  }

  // Range shape: connected band with rounded caps
  if (isStart && isEnd) {
    classes.push('day--round')
  } else if (isStart) {
    classes.push('day--range-start')
  } else if (isEnd) {
    classes.push('day--range-end')
  }
  // inRange cells get no rounding (rectangular) to form a continuous band

  return classes.join(' ')
}
</script>

<style lang="scss" scoped>
.day-headers {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.day-header {
  text-align: center;
  font-size: 10px;
  font-weight: 500;
  color: var(--ditto-grey);
  padding: 0.25rem 0;
}

.day-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.day-cell {
  position: relative;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  line-height: 1rem;
  transition: all 150ms ease;
  cursor: pointer;
}

.day-span--other-month {
  opacity: 0.5;
  color: var(--ditto-grey);
}

// Day state variants
.day--outside {
  border-radius: 9999px;
  color: var(--ditto-grey);
  opacity: 0.3;
}

.day--selected {
  background-color: var(--brand-primary);
  color: #ffffff;
  font-weight: 500;
  z-index: 10;
}

.day--in-range {
  background-color: rgba(134, 64, 244, 0.15);
  color: var(--blue);
}

.day--default {
  border-radius: 9999px;
  color: var(--blue);

  &:hover {
    background-color: var(--lighter-grey);
  }
}

// Range shape modifiers
.day--round {
  border-radius: 9999px;
}

.day--range-start {
  border-radius: 9999px 0 0 9999px;
}

.day--range-end {
  border-radius: 0 9999px 9999px 0;
}
</style>
