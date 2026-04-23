<template>
  <div class="p-6 lg:p-8">
    <!-- Header -->
    <div class="mb-6">
      <h1 :class="['text-2xl lg:text-3xl font-bold mb-2', isDarkMode ? 'text-white' : 'text-gray-900']">Integrations</h1>
      <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Link up your Ditto Artist with various platform profiles.</p>
    </div>
    
    <!-- Integration Cards Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <IntegrationCard 
        v-for="integration in integrations" 
        :key="integration.id"
        :integration="integration"
        :is-dark-mode="isDarkMode"
        @action="handleAction"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Integration } from './artistTypes'
import IntegrationCard from '../../components/artists/IntegrationCard.vue'

defineProps<{
  integrations: Integration[]
  isDarkMode?: boolean
}>()

const handleAction = (integration: Integration) => {
  console.log('Integration action:', integration.id)
  // Handle the integration action (e.g., open OAuth flow, modal, etc.)
}
</script>
