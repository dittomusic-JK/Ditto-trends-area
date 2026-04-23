<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div class="w-16 h-16 rounded-full bg-ditto-light-grey flex items-center justify-center mb-5">
      <svg v-if="type === 'no-results'" class="w-7 h-7 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
      <svg v-else-if="type === 'no-data'" class="w-7 h-7 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="14,2 14,8 20,8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg v-else class="w-7 h-7 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <p class="text-base font-semibold text-ditto-text mb-1">{{ title }}</p>
    <p class="text-sm text-ditto-subtext max-w-sm mb-5">{{ message }}</p>
    <button v-if="actionLabel" @click="$emit('action')" class="px-5 py-2.5 bg-ditto-purple text-white text-sm font-medium rounded-full hover:bg-ditto-purple/90 transition-colors">
      {{ actionLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type?: 'no-results' | 'no-data' | 'info'
  title: string
  message: string
  actionLabel?: string
}>()

defineEmits<{
  (e: 'action'): void
}>()
</script>
