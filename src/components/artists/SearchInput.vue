<template>
  <!-- Same anatomy as components/common/SearchInput.vue, plus dark-mode support
       for the artists area. Keep the two visually in lockstep. -->
  <div class="relative flex-1">
    <IconSearch class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ditto-subtext" />
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      type="text"
      :placeholder="placeholder"
      :class="[
        'w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-ditto-purple',
        isDarkMode
          ? 'bg-[#141414] border-gray-700/50 text-white placeholder-gray-500'
          : 'bg-white border-gray-200 text-ditto-text placeholder-gray-400'
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
