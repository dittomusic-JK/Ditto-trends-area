<template>
  <div class="space-y-6 animate-pulse">
    <!-- Stats row -->
    <div v-if="type === 'stats' || type === 'full'" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div v-for="i in 3" :key="i" class="bg-white rounded-2xl border border-gray-200 p-5">
        <div class="h-3 w-20 bg-gray-200 rounded mb-3"></div>
        <div class="h-7 w-32 bg-gray-200 rounded mb-2"></div>
        <div class="h-3 w-16 bg-gray-100 rounded"></div>
      </div>
    </div>

    <!-- Chart -->
    <div v-if="type === 'chart' || type === 'full'" class="bg-gray-100 rounded-2xl p-6">
      <div class="h-5 w-40 bg-gray-200 rounded mb-4"></div>
      <div class="h-[280px] bg-gray-200/50 rounded-xl"></div>
    </div>

    <!-- Table rows -->
    <div v-if="type === 'table' || type === 'full'" class="space-y-2">
      <div v-for="i in rows" :key="i" class="flex items-center gap-4 px-4 py-4">
        <div class="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0"></div>
        <div class="flex-1">
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-gray-100 rounded w-1/2"></div>
        </div>
        <div class="h-4 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>

    <!-- Card grid -->
    <div v-if="type === 'cards'" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="i in 8" :key="i">
        <div class="aspect-square bg-gray-200 rounded-2xl mb-3"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-3 bg-gray-100 rounded w-1/2"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type?: 'stats' | 'chart' | 'table' | 'cards' | 'full'
  rows?: number
}>()
</script>
