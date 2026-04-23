<template>
  <div class="relative flex-1">
    <IconSearch :class="['absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5', isDarkMode ? 'text-gray-400' : 'text-gray-400']" />
    <input 
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      type="text"
      :placeholder="placeholder"
      :class="[
        'w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-ditto-purple focus:border-transparent focus:outline-none transition-all',
        isDarkMode 
          ? 'bg-[#141414] border-gray-700/50 text-white placeholder-gray-500' 
          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 shadow-sm'
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { IconSearch } from '../icons/artistIcons'

defineProps<{
  modelValue: string
  placeholder?: string
  isDarkMode?: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>
