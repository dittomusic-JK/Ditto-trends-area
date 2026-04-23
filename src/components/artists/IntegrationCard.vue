<template>
  <div :class="[
    'flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 hover:shadow-md',
    isDarkMode 
      ? 'bg-[#141414] border-gray-700/50 hover:border-gray-600' 
      : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
  ]">
    <!-- Icon -->
    <div :class="[
      'w-12 h-12 flex items-center justify-center rounded-lg flex-shrink-0',
      isDarkMode ? 'bg-[#0F0E0E]' : 'bg-gray-100'
    ]">
      <img :src="integration.icon" :alt="integration.name" class="w-8 h-8" />
    </div>
    
    <!-- Content -->
    <div class="flex-1">
      <h3 :class="['font-semibold mb-1', isDarkMode ? 'text-white' : 'text-gray-900']">{{ integration.name }}</h3>
      <p :class="['text-sm mb-3', isDarkMode ? 'text-gray-400' : 'text-gray-500']">{{ integration.description }}</p>
      
      <button 
        @click="$emit('action', integration)"
        class="px-4 py-2 bg-ditto-purple text-white text-sm font-medium rounded-full hover:opacity-90 transition-opacity shadow-md shadow-ditto-purple/25"
      >
        {{ integration.buttonText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Integration } from '../../views/artists/artistTypes'

defineProps<{
  integration: Integration
  isDarkMode?: boolean
}>()

defineEmits<{
  (e: 'action', integration: Integration): void
}>()
</script>
