<template>
  <div>
    <!-- Cover image -->
    <div class="relative h-40 sm:h-48 overflow-hidden">
      <img :src="opp.cover" alt="" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 opacity-60 mix-blend-multiply" :style="{ background: categoryGradient(opp.category) }"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      <div class="absolute top-4 left-4 flex items-center gap-2">
        <span class="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/90 text-ditto-text">{{ opp.category }}</span>
        <span :class="['text-[11px] font-semibold px-2.5 py-1 rounded-full', opp.urgent ? 'bg-error text-white' : 'bg-white/90 text-ditto-text']">
          {{ opp.urgent ? 'Closing Soon' : 'Open' }}
        </span>
      </div>
    </div>

    <div class="px-6 sm:px-8 pb-8 relative">
      <!-- Overlapping icon -->
      <div class="absolute -top-8 left-6 sm:left-8 w-16 h-16 rounded-2xl bg-white shadow-md ring-1 ring-gray-100 flex items-center justify-center text-3xl">
        {{ categoryEmoji(opp.category) }}
      </div>

      <div class="flex items-center gap-1.5 text-xs text-ditto-subtext pt-3 mb-2 justify-end">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" stroke-linecap="round"/></svg>
        Closes {{ opp.deadline }}
      </div>

      <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl sm:text-3xl text-ditto-text mb-5 leading-tight">{{ opp.title }}</h2>

      <!-- Meta grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div class="rounded-xl bg-ditto-light-grey p-3.5">
          <p class="text-[11px] text-ditto-subtext mb-0.5">Budget</p>
          <p class="text-base font-bold text-ditto-text">{{ opp.budget }}</p>
        </div>
        <div class="rounded-xl bg-ditto-light-grey p-3.5">
          <p class="text-[11px] text-ditto-subtext mb-0.5">Deadline</p>
          <p class="text-base font-bold text-ditto-text">{{ opp.daysLeft }} days left</p>
        </div>
        <div class="rounded-xl bg-ditto-light-grey p-3.5">
          <p class="text-[11px] text-ditto-subtext mb-0.5">Usage</p>
          <p class="text-sm font-semibold text-ditto-text leading-snug">{{ opp.usage }}</p>
        </div>
      </div>

      <!-- Brief -->
      <div class="mb-6">
        <h3 class="text-base font-semibold text-ditto-text mb-2">The brief</h3>
        <p class="text-sm text-ditto-subtext leading-relaxed">{{ opp.description }}</p>
        <p class="text-xs text-ditto-subtext mt-2 italic">We do not accept AI-generated music for sync opportunities.</p>
      </div>

      <!-- Reference -->
      <div v-if="opp.reference" class="mb-6">
        <h3 class="text-base font-semibold text-ditto-text mb-2">Reference track</h3>
        <div class="flex items-center gap-3 p-3 rounded-xl border border-gray-200">
          <span class="w-10 h-10 rounded-full bg-ditto-purple/10 flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4 text-ditto-purple" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </span>
          <p class="text-sm text-ditto-text font-medium">{{ opp.reference }}</p>
        </div>
      </div>

      <!-- Tags -->
      <div class="flex items-center gap-2 flex-wrap mb-8">
        <span v-for="tag in opp.tags" :key="tag" class="text-xs px-3 py-1.5 rounded-full bg-ditto-light-grey text-ditto-text">{{ tag }}</span>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <button
          @click="$emit('apply')"
          class="px-6 py-3 bg-ditto-purple text-white text-sm font-semibold rounded-full hover:bg-ditto-purple/90 transition-colors"
        >Submit a Track</button>
        <button class="w-11 h-11 flex items-center justify-center rounded-full border border-gray-200 text-ditto-subtext hover:border-ditto-purple/40 hover:text-ditto-purple transition-colors" aria-label="Save brief">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { categoryGradient, categoryEmoji, type SyncOpp } from './syncTypes'

defineProps<{ opp: SyncOpp }>()
defineEmits<{ apply: [] }>()
</script>
