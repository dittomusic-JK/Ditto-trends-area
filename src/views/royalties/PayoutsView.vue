<template>
  <div class="space-y-8">
    <!-- Balance Section -->
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
      <!-- Main Balance Card (credit-card treatment) -->
      <!-- Mesh gradient: deep purple anchors the left where the figure and CTA
           sit, lifting to lavender across the right so the card stays airy -->
      <div class="relative overflow-hidden rounded-3xl p-8 flex flex-col text-white shadow-[0_10px_30px_rgba(58,18,168,0.25)] balance-card">
        <!-- Soft card sheen + edge highlight -->
        <span class="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none"></span>
        <span class="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/15 pointer-events-none"></span>

        <!-- Chip + wordmark row -->
        <div class="relative flex items-start justify-between mb-7">
          <span class="relative block w-11 h-8 rounded-md overflow-hidden" style="background: linear-gradient(135deg, #E6FF3A, #b8cc2e)">
            <span class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-black/20"></span>
            <span class="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-black/20"></span>
          </span>
          <img src="/img/logo-2048-black.svg" alt="Ditto" class="h-5 invert opacity-75 select-none" />
        </div>

        <p class="relative text-sm text-white/65 mb-2">Your balance</p>
        <p class="relative text-5xl font-satoshi font-black tracking-[-0.03em] mb-6 text-white">£168,247.18</p>

        <!-- Segmented Balance Bar -->
        <div class="relative flex h-3 rounded-full bg-white/15 mb-3">
          <div
            class="rounded-l-full transition-all duration-1000 ease-out bg-[#E6FF3A]"
            :style="{ width: animated ? '68%' : '0%' }"
          ></div>
          <div class="w-1 flex-shrink-0"></div>
          <div
            class="bg-white/35 rounded-r-full transition-all duration-1000 ease-out delay-200"
            :style="{ width: animated ? '32%' : '0%' }"
          ></div>
        </div>

        <!-- Dot Legend -->
        <div class="relative flex items-center gap-5 flex-wrap">
          <span class="flex items-center gap-1.5 text-sm text-white">
            <span class="w-2.5 h-2.5 rounded-full bg-[#E6FF3A]"></span>
            £114,409.68 available
          </span>
          <span class="flex items-center gap-1.5 text-sm text-white/65">
            <span class="w-2.5 h-2.5 rounded-full bg-white/35"></span>
            £53,837.50 pending
          </span>
        </div>

        <div class="relative mt-auto pt-6">
          <button class="px-8 py-3.5 bg-[#E6FF3A] text-[#101f3c] text-base font-semibold rounded-full hover:opacity-90 transition-opacity">
            Withdraw
          </button>
        </div>
      </div>

      <!-- Right Column -->
      <div class="flex flex-col gap-4">
        <!-- Total Paid Out -->
        <div class="bg-white rounded-2xl p-6 border border-gray-200 flex-1 flex flex-col justify-center">
          <p class="text-sm text-ditto-subtext mb-1">Total paid out</p>
          <p class="text-3xl font-bold text-ditto-text">£135,762.48</p>
          <p class="text-xs text-ditto-subtext mt-1">across 7 payouts</p>
        </div>

        <!-- Payout Method -->
        <div class="bg-white rounded-2xl p-6 border border-gray-200">
          <p class="text-xs text-ditto-subtext mb-3">Payout method</p>
          <div class="bg-ditto-light-grey/50 rounded-xl p-4 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg class="w-5 h-5 text-ditto-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-ditto-text">Bank Transfer</p>
              <p class="text-xs text-ditto-subtext">Current account ····4821</p>
            </div>
            <button class="flex items-center gap-1.5 text-xs font-medium text-ditto-purple hover:text-ditto-purple/80 transition-colors px-3 py-1.5 rounded-full border border-ditto-purple/20 hover:border-ditto-purple/40">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Update
            </button>
          </div>
          <p class="text-xs text-ditto-subtext mt-3">Minimum payout: £25.00</p>
        </div>
      </div>
    </div>

    <!-- Activity -->
    <div>
      <h3 class="font-satoshi font-black tracking-[-0.03em] text-lg text-ditto-text mb-1">Activity</h3>
      <p class="text-sm text-ditto-subtext mb-4">Recent payouts</p>

      <!-- Rows (canonical list spec: rounded hover rows, no dividers) -->
      <div class="space-y-1">
        <div
          v-for="payout in payouts"
          :key="payout.id"
          class="flex items-center gap-4 px-4 py-4 hover:bg-ditto-light-grey rounded-2xl transition-colors cursor-pointer"
        >
          <!-- Icon -->
          <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" :class="payout.type === 'Bank Transfer' ? 'bg-ditto-purple/10' : 'bg-info/15'">
            <svg v-if="payout.type === 'Bank Transfer'" class="w-5 h-5 text-ditto-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else class="w-5 h-5 text-info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

          <!-- Details -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-ditto-text">{{ payout.type }}</p>
            <p class="text-xs text-ditto-subtext">{{ payout.date }} · Payout</p>
          </div>

          <!-- Amount -->
          <p class="text-base font-semibold text-ditto-text flex-shrink-0">-{{ payout.amount }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const animated = ref(false)
onMounted(() => {
  setTimeout(() => { animated.value = true }, 100)
})

const payouts = [
  { id: 1, amount: '£1,400.00', type: 'Bank Transfer', date: '4 Apr 2026', status: 'Paid' },
  { id: 2, amount: '£4,100.00', type: 'Bank Transfer', date: '14 Dec 2025', status: 'Paid' },
  { id: 3, amount: '£8,283.55', type: 'Bank Transfer', date: '29 Jun 2025', status: 'Paid' },
  { id: 4, amount: '£10,000.00', type: 'Bank Transfer', date: '2 Jun 2025', status: 'Paid' },
  { id: 5, amount: '£96,279.39', type: 'Bank Transfer', date: '26 May 2025', status: 'Paid' },
  { id: 6, amount: '£6,000.00', type: 'Manual', date: '11 Dec 2024', status: 'Paid' },
  { id: 7, amount: '£9,650.54', type: 'Manual', date: '15 Aug 2024', status: 'Paid' },
]
</script>

<style scoped>
/* Monzo-style mesh: overlapping soft radials over a diagonal base. Deeper
   tones sit left/top where the balance and Withdraw button live so the lime
   keeps its contrast; the right side lifts to lavender to stay light. */
.balance-card {
  background:
    /* deep anchor behind the figure */
    radial-gradient(75% 95% at 0% 0%, #2a0a8c 0%, rgba(42, 10, 140, 0) 62%),
    /* pale corner that gives the card its air */
    radial-gradient(65% 80% at 104% 96%, #d6bcff 0%, rgba(214, 188, 255, 0) 58%),
    /* violet bloom up the right edge */
    radial-gradient(60% 70% at 96% 18%, #a879ff 0%, rgba(168, 121, 255, 0) 55%),
    /* warm accent stops it reading as one flat purple */
    radial-gradient(55% 60% at 62% 78%, #7d3bff 0%, rgba(125, 59, 255, 0) 58%),
    /* keeps the Withdraw corner dark enough for the lime */
    radial-gradient(55% 65% at 6% 108%, #35109f 0%, rgba(53, 16, 159, 0) 60%),
    linear-gradient(120deg, #3a12a8 0%, #5f1fff 52%, #9c6dff 100%);
}
</style>
