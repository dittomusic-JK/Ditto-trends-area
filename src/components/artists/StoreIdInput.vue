<template>
  <div>
    <div class="flex items-center gap-1 mb-1">
      <label class="text-xs text-gray-500">{{ label }}</label>
      <Tooltip v-if="tooltip" :text="tooltip" position="right">
        <button class="text-gray-400 hover:text-gray-600">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </button>
      </Tooltip>
      <button v-else class="text-gray-400 hover:text-gray-600">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </button>
    </div>
    <div class="relative">
      <input 
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        type="text"
        :placeholder="placeholder"
        class="w-full py-2 pr-8 text-sm text-gray-900 border-b border-gray-200 focus:border-ditto-purple focus:outline-none transition-colors"
      />
      <span v-if="verified" class="absolute right-0 top-1/2 -translate-y-1/2 text-success">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tooltip from './Tooltip.vue'

defineProps<{
  label: string
  modelValue?: string
  placeholder?: string
  verified?: boolean
  tooltip?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>
