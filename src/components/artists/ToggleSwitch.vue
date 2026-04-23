<template>
  <button 
    type="button"
    @click="$emit('update:modelValue', !modelValue)"
    :class="[
      'relative w-12 h-7 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ditto-purple',
      modelValue ? 'bg-success' : 'bg-gray-300'
    ]"
  >
    <span 
      :class="[
        'absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200',
        modelValue ? 'translate-x-5' : 'translate-x-0'
      ]"
    />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>
