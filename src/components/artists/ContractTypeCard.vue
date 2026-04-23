<template>
  <button 
    @click="$emit('select', contract)"
    :class="[
      'group relative flex flex-col items-start p-4 rounded-xl border transition-all duration-200 text-left hover:shadow-md',
      isDarkMode 
        ? 'bg-[#141414] border-gray-700/50 hover:border-ditto-purple' 
        : 'bg-white border-gray-200 hover:border-ditto-purple shadow-sm'
    ]"
  >
    <!-- Icon -->
    <div class="w-12 h-12 mb-3">
      <img :src="contract.icon" :alt="contract.title" class="w-full h-full" />
    </div>
    
    <!-- Title -->
    <h3 :class="['font-semibold mb-2', isDarkMode ? 'text-white' : 'text-gray-900']">{{ contract.title }}</h3>
    
    <!-- Description -->
    <p :class="['text-sm line-clamp-2 mb-3', isDarkMode ? 'text-gray-400' : 'text-gray-500']">{{ contract.description }}</p>
    
    <!-- Price -->
    <div class="mt-auto pt-2">
      <span :class="['text-lg font-bold', isDarkMode ? 'text-white' : 'text-gray-900']">£{{ contract.price }}</span>
      <span :class="['text-sm ml-1', isDarkMode ? 'text-gray-500' : 'text-gray-400']">per contract</span>
    </div>
    
    <!-- Click to purchase tooltip -->
    <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <span class="inline-flex items-center gap-1 px-2 py-1 bg-ditto-purple text-white text-xs rounded-full">
        Click to purchase
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </div>
  </button>
</template>

<script setup lang="ts">
import type { AvailableContract } from '../../views/artists/artistTypes'

defineProps<{
  contract: AvailableContract
  isDarkMode?: boolean
}>()

defineEmits<{
  (e: 'select', contract: AvailableContract): void
}>()
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
