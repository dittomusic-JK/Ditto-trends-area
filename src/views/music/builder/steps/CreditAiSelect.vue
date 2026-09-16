<template>
  <!-- Per-credit AI level (replaces the "Created with AI" checkbox). Locked on entirely-AI releases. -->
  <div ref="wrap" class="relative mt-2 w-fit">
    <span class="sr-only">AI level</span>
    <button
      type="button"
      :disabled="locked"
      @click="open = !open"
      :class="[
        'inline-flex items-center gap-1.5 h-7 pl-2.5 pr-2 rounded-full border text-xs font-medium transition-colors',
        locked
          ? 'border-gray-200 bg-ditto-light-grey text-ditto-subtext cursor-not-allowed'
          : modelValue === 'none'
            ? 'border-gray-200 bg-white text-ditto-text hover:border-ditto-purple/50'
            : 'border-ditto-purple/40 bg-ditto-purple/[0.06] text-ditto-purple hover:border-ditto-purple'
      ]"
    >
      <span class="text-ditto-subtext font-normal">AI:</span>
      {{ currentLabel }}
      <svg v-if="locked" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      <svg v-else :class="['w-3 h-3 transition-transform', open ? 'rotate-180' : '']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
    </button>

    <div v-if="open && !locked" class="absolute left-0 top-full mt-1.5 z-20 min-w-[9.5rem] bg-white border border-gray-200 rounded-xl shadow-lg p-1">
      <button
        v-for="opt in creditAiLevels"
        :key="opt.value"
        type="button"
        @click="select(opt.value)"
        :class="[
          'w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-xs text-left transition-colors',
          opt.value === modelValue ? 'bg-ditto-purple/[0.06] text-ditto-purple font-semibold' : 'text-ditto-text hover:bg-ditto-light-grey'
        ]"
      >
        {{ opt.label }}
        <svg v-if="opt.value === modelValue" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { creditAiLevels, type CreditAiLevel } from '../../../../data/releaseBuilderMockData'

const props = defineProps<{ modelValue: CreditAiLevel; locked?: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: CreditAiLevel): void }>()

const open = ref(false)
const wrap = ref<HTMLElement | null>(null)
const currentLabel = computed(() => props.locked ? 'Fully AI' : (creditAiLevels.find(o => o.value === props.modelValue)?.label ?? 'No AI'))

const select = (value: CreditAiLevel) => {
  emit('update:modelValue', value)
  open.value = false
}
const onDocClick = (e: MouseEvent) => { if (wrap.value && !wrap.value.contains(e.target as Node)) open.value = false }
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>
