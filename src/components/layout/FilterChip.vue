<template>
  <div class="inline-flex items-center gap-1.5 px-2 py-1 bg-ditto-mid-grey rounded text-sm">
    <button 
      @click="$emit('remove')"
      class="text-ditto-text hover:text-ditto-purple transition-colors"
    >
      <IconClose class="w-4 h-4" />
    </button>
    <span class="text-ditto-text">
      <span class="font-normal">{{ label }}: </span>
      <span class="font-semibold">{{ value }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { IconClose } from '../icons'

defineProps<{
  label: string
  value: string
}>()

defineEmits<{
  (e: 'remove'): void
}>()
</script>
