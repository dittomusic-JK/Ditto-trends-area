<template>
  <!-- Canonical dashboard search field (matches Music → Your Releases). Use this
       everywhere a plain text search appears so the element stays identical. -->
  <div class="relative">
    <svg class="w-4 h-4 text-ditto-subtext absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      type="text"
      :placeholder="placeholder"
      :class="['pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-ditto-text bg-white focus:outline-none focus:border-ditto-purple', widthClass]"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  widthClass?: string
}>(), {
  placeholder: 'Search',
  widthClass: 'w-full sm:w-64',
})

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>
