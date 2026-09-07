<template>
  <!-- The builder's date field: underline trigger opening a floating calendar
       (music-builder picker anatomy). mode="future" for release dates,
       mode="past" for dates that must already have happened (re-releases). -->
  <div class="relative" ref="wrap">
    <button
      @click="toggleOpen"
      :class="[
        'w-full flex items-center gap-2.5 border-0 border-b px-0 py-2.5 text-sm bg-transparent transition-colors focus:outline-none',
        error ? 'border-error' : 'border-gray-300 hover:border-ditto-purple'
      ]"
    >
      <svg class="w-4 h-4 flex-shrink-0" :class="error ? 'text-error' : 'text-ditto-purple'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      <span :class="modelValue ? 'text-ditto-text font-medium' : 'text-ditto-subtext'">{{ modelValue ? formatDate(modelValue) : placeholder }}</span>
      <svg class="w-3.5 h-3.5 text-ditto-subtext ml-auto transition-transform" :class="open ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>

    <!-- Calendar dropdown -->
    <div v-if="open" class="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 z-30">
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
            isSelected(cell.date) ? 'bg-ditto-purple text-white font-bold' :
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: Date | null
  placeholder?: string
  /** Red trigger state (e.g. required + step left without a value) */
  error?: boolean
  /** 'future': only days after today pickable. 'past': only days before today. */
  mode?: 'future' | 'past'
}>(), {
  placeholder: 'Select date',
  error: false,
  mode: 'future',
})

const emit = defineEmits<{
  (e: 'update:modelValue', date: Date): void
}>()

const today = new Date()
today.setHours(0, 0, 0, 0)

const open = ref(false)
const wrap = ref<HTMLElement | null>(null)
const viewMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))

const toggleOpen = () => {
  if (!open.value && props.modelValue) {
    viewMonth.value = new Date(props.modelValue.getFullYear(), props.modelValue.getMonth(), 1)
  }
  open.value = !open.value
}

const monthLabel = computed(() =>
  viewMonth.value.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
)

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
      disabled: props.mode === 'past' ? diff >= 0 : diff <= 0,
    })
  }
  return cells
})

const prevMonth = () => { viewMonth.value = new Date(viewMonth.value.getFullYear(), viewMonth.value.getMonth() - 1, 1) }
const nextMonth = () => { viewMonth.value = new Date(viewMonth.value.getFullYear(), viewMonth.value.getMonth() + 1, 1) }

const isSelected = (d: Date) =>
  props.modelValue !== null && d.getTime() === props.modelValue.getTime()

const selectDate = (d: Date) => {
  emit('update:modelValue', d)
  open.value = false
}

const formatDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

const handleClickOutside = (e: MouseEvent) => {
  if (open.value && wrap.value && !wrap.value.contains(e.target as Node)) {
    open.value = false
  }
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>
