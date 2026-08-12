<template>
  <!-- Slim home-hub entry point for the referral programme: link in hand,
       one line of progress, click-through to the full page -->
  <section class="mb-12">
    <div
      class="relative overflow-hidden rounded-2xl refer-strip text-white px-5 py-4 sm:px-7 sm:py-5 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer"
      @click="emit('navigate', 'refer')"
    >
      <span class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/15 pointer-events-none"></span>

      <div class="relative flex items-center gap-4 flex-1 min-w-0">
        <img src="/img/suite/Royalties.svg" alt="" class="w-11 h-11 flex-shrink-0" />
        <div class="min-w-0">
          <p class="font-satoshi font-black tracking-[-0.02em] text-lg leading-tight">
            Refer a friend, earn ${{ REWARD_PER_REFERRAL }}
          </p>
          <p class="text-sm text-white/70 truncate">
            {{ profile.successful }} of {{ REFERRAL_CAP }} friends joined · ${{ CAP_AMOUNT - profile.totalEarned }} still to earn
          </p>
        </div>
      </div>

      <div class="relative flex items-center gap-2 flex-shrink-0" @click.stop>
        <span class="hidden lg:block text-sm font-medium bg-white/12 rounded-full px-4 py-2 select-all">{{ profile.link }}</span>
        <button
          @click="copyLink"
          class="px-4 py-2 text-sm font-semibold rounded-full bg-[#E6FF3A] text-[#0a0a0a] hover:opacity-90 transition-opacity flex items-center gap-1.5"
        >
          <svg v-if="!justCopied" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ justCopied ? 'Copied' : 'Copy link' }}
        </button>
        <button
          @click="emit('navigate', 'refer')"
          aria-label="Open Refer a Friend"
          class="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center flex-shrink-0"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  referDemoStates,
  REWARD_PER_REFERRAL,
  REFERRAL_CAP,
  CAP_AMOUNT,
} from '../../data/referMockData'

const emit = defineEmits<{
  (e: 'navigate', section: string): void
}>()

// The hub always shows the mid-programme demo profile
const profile = referDemoStates.progress

const justCopied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | undefined

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(`https://${profile.link}`)
  } catch {
    /* clipboard unavailable in some embedded contexts — demo continues */
  }
  justCopied.value = true
  clearTimeout(copyTimer)
  copyTimer = setTimeout(() => { justCopied.value = false }, 2000)
}
</script>

<style scoped>
/* Compact cut of the referral hero mesh so the strip reads as the same money
   surface family without dominating the hub */
.refer-strip {
  background:
    radial-gradient(70% 120% at 0% 0%, #2a0a8c 0%, rgba(42, 10, 140, 0) 60%),
    radial-gradient(55% 110% at 100% 100%, #a879ff 0%, rgba(168, 121, 255, 0) 60%),
    linear-gradient(120deg, #3a12a8 0%, #5f1fff 55%, #8b55ff 100%);
}
</style>
