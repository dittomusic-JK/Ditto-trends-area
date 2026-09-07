<template>
  <!-- Underline dropdown matching the release-date trigger: same field line,
       chevron and floating panel — instead of a bare native select. -->
  <div class="relative" ref="wrap">
    <button
      @click="open = !open"
      class="w-full flex items-center gap-2 border-0 border-b border-gray-300 hover:border-ditto-purple px-0 py-2.5 text-sm bg-transparent transition-colors focus:outline-none"
    >
      <span :class="modelValue ? 'text-ditto-text font-medium' : 'text-ditto-subtext'">{{ modelValue || placeholder }}</span>
      <svg class="w-3.5 h-3.5 text-ditto-subtext ml-auto transition-transform flex-shrink-0" :class="open ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>

    <div v-if="open" class="absolute left-0 top-full mt-2 min-w-full bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-30 max-h-56 overflow-y-auto">
      <button
        v-for="opt in options"
        :key="opt"
        @click="select(opt)"
        :class="[
          'w-full px-3.5 py-2 text-sm text-left whitespace-nowrap transition-colors',
          opt === modelValue ? 'text-ditto-purple bg-ditto-purple/5 font-medium' : 'text-ditto-text hover:bg-ditto-light-grey'
        ]"
      >{{ opt }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineProps<{
  modelValue: string
  options: string[]
  placeholder: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const open = ref(false)
const wrap = ref<HTMLElement | null>(null)

const select = (opt: string) => {
  emit('update:modelValue', opt)
  open.value = false
}

const handleClickOutside = (e: MouseEvent) => {
  if (open.value && wrap.value && !wrap.value.contains(e.target as Node)) {
    open.value = false
  }
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>
