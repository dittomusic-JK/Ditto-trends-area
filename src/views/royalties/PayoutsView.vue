<template>
  <div class="space-y-8">
    <!-- Balance Section -->
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
      <!-- Main Balance Card -->
      <div class="bg-white rounded-2xl p-8 border border-gray-200 flex flex-col">
        <p class="text-sm text-ditto-subtext mb-2">Your balance</p>
        <p class="text-5xl font-bold text-ditto-text tracking-tight mb-6">£168,247.18</p>

        <!-- Segmented Balance Bar -->
        <div class="flex h-3 rounded-full bg-gray-100 mb-3">
          <div 
            class="bg-ditto-purple rounded-l-full transition-all duration-1000 ease-out" 
            :style="{ width: animated ? '68%' : '0%' }"
          ></div>
          <div class="w-1 bg-white flex-shrink-0"></div>
          <div 
            class="bg-[#F87171]/40 rounded-r-full transition-all duration-1000 ease-out delay-200" 
            :style="{ width: animated ? '32%' : '0%' }"
          ></div>
        </div>

        <!-- Dot Legend -->
        <div class="flex items-center gap-5 flex-wrap">
          <span class="flex items-center gap-1.5 text-sm text-ditto-text">
            <span class="w-2.5 h-2.5 rounded-full bg-ditto-purple"></span>
            £114,409.68 available
          </span>
          <span class="flex items-center gap-1.5 text-sm text-ditto-subtext">
            <span class="w-2.5 h-2.5 rounded-full bg-[#F87171]/40"></span>
            £53,837.50 pending
          </span>
        </div>

        <div class="mt-auto pt-6">
          <button class="px-8 py-3.5 bg-ditto-purple text-white text-base font-semibold rounded-full hover:bg-ditto-purple/90 transition-colors">
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
      <h3 class="font-poppins font-bold text-lg text-ditto-text mb-1">Activity</h3>
      <p class="text-sm text-ditto-subtext mb-4">Recent payouts</p>

      <!-- Clean rows with dividers -->
      <div class="divide-y divide-gray-100">
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
