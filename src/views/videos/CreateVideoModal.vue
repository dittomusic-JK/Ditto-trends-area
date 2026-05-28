<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-md p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-poppins font-bold text-lg text-ditto-text">Create a new video release</h2>
        <button @click="$emit('close')" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-ditto-light-grey transition-colors">
          <svg class="w-4 h-4 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Title Input -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-ditto-text mb-1.5">Release Title</label>
        <input
          v-model="title"
          type="text"
          maxlength="255"
          placeholder="Release Title"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-ditto-text bg-white focus:outline-none focus:border-ditto-purple transition-colors"
        />
        <p class="text-xs text-ditto-subtext mt-1 text-right">{{ title.length }} / 255</p>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end gap-3">
        <button
          @click="$emit('close')"
          class="px-5 py-2.5 text-sm font-medium text-ditto-text hover:bg-ditto-light-grey rounded-full transition-colors"
        >Cancel</button>
        <button
          @click="handleSubmit"
          :disabled="title.trim().length === 0"
          :class="[
            'px-5 py-2.5 text-sm font-medium rounded-full transition-all',
            title.trim().length > 0
              ? 'bg-ditto-purple text-white hover:bg-ditto-purple/90'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          ]"
        >Get Started</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'create', title: string): void
}>()

const title = ref('')

const handleSubmit = () => {
  if (title.value.trim().length > 0) {
    emit('create', title.value.trim())
  }
}
</script>
