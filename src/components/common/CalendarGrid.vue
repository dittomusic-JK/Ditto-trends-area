<template>
  <div>
    <!-- Day Headers -->
    <div class="grid grid-cols-7">
      <div 
        v-for="day in dayNames" 
        :key="day"
        class="text-center text-[10px] font-medium text-ditto-subtext py-1"
      >
        {{ day }}
      </div>
    </div>
    
    <!-- Calendar Days -->
    <div class="grid grid-cols-7">
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        @click="day.date && $emit('select', day.date)"
        @mouseenter="day.date && $emit('hover', day.date)"
        @mouseleave="$emit('hover', null)"
        :class="[
          'relative aspect-square flex items-center justify-center text-xs rounded-full transition-all cursor-pointer',
          getDayClasses(day)
        ]"
      >
        <span :class="day.isCurrentMonth ? '' : 'text-ditto-subtext/50'">
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
    return 'text-ditto-subtext/30'
  }
  
  const isStart = isRangeStart(day.date)
  const isEnd = isRangeEnd(day.date)
  const inRange = isInRange(day.date)
  
  if (isStart || isEnd) {
    classes.push('bg-ditto-purple text-white font-medium z-10')
  } else if (inRange) {
    classes.push('bg-ditto-purple/15 text-ditto-text')
  } else {
    classes.push('text-ditto-text hover:bg-ditto-light-grey')
  }
  
  // Add range background styling
  if (inRange || isStart || isEnd) {
    if (isStart && !isEnd) {
      classes.push('rounded-l-full rounded-r-none')
    } else if (isEnd && !isStart) {
      classes.push('rounded-r-full rounded-l-none')
    } else if (inRange) {
      classes.push('rounded-none')
    }
  }
  
  return classes.join(' ')
}
</script>

<style scoped>
/* Range highlight effect */
</style>
