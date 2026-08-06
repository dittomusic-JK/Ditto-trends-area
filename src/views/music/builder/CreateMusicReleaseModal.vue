<template>
  <!-- Every release is named before the wizard starts, so the draft is logged
       from the first step (mirrors the live dashboard). -->
  <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg px-10 py-9 relative">
      <button
        @click="$emit('close')"
        aria-label="Close"
        class="absolute top-7 right-7 w-8 h-8 flex items-center justify-center rounded-full text-ditto-text hover:bg-ditto-light-grey transition-colors"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl text-ditto-text text-center pr-8 mb-9">
        Create a New Music Release
      </h2>

      <input
        ref="inputRef"
        v-model="title"
        type="text"
        maxlength="255"
        placeholder="Release Title"
        class="w-full px-0 py-2.5 border-0 border-b border-gray-300 text-base text-ditto-text bg-transparent placeholder:text-ditto-subtext focus:outline-none focus:border-ditto-purple transition-colors"
        @keydown.enter="submit"
      />

      <div class="flex items-center justify-center gap-4 mt-9">
        <button
          @click="$emit('close')"
          class="px-10 py-3 rounded-full bg-ditto-light-grey text-sm font-semibold text-ditto-text hover:bg-gray-200 transition-colors"
        >Cancel</button>
        <button
          @click="submit"
          :disabled="!canSubmit"
          :class="[
            'px-10 py-3 rounded-full text-sm font-semibold transition-all',
            canSubmit
              ? 'bg-ditto-purple btn-pop-purple text-white hover:opacity-95'
              : 'bg-ditto-light-grey text-ditto-subtext/50 cursor-not-allowed'
          ]"
        >Get Started</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'create', title: string): void
}>()

const title = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const canSubmit = computed(() => title.value.trim().length > 0)

const submit = () => {
  if (canSubmit.value) emit('create', title.value.trim())
}

onMounted(() => inputRef.value?.focus())
</script>
