<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="font-poppins font-bold text-2xl text-ditto-text mb-1">Royalty Reports</h2>
      <p class="text-sm text-ditto-subtext">Download detailed royalty earnings and sales data in your preferred format.</p>
    </div>

    <!-- Report Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Net Revenue Report -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 relative overflow-hidden">
        <span class="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-ditto-purple/10 text-ditto-purple">Most Used</span>
        <div class="w-12 h-12 rounded-xl bg-ditto-purple/10 flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-ditto-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="14,2 14,8 20,8" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="16" y1="13" x2="8" y2="13" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="16" y1="17" x2="8" y2="17" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3 class="font-poppins font-bold text-lg text-ditto-text mb-1">Net Revenue</h3>
        <p class="text-sm text-ditto-subtext mb-5">Your total royalty earnings, broken down by track and store.</p>
        <button class="px-5 py-2.5 bg-ditto-purple text-white text-sm font-medium rounded-full hover:bg-ditto-purple/90 transition-colors">
          Generate Report
        </button>
      </div>

      <!-- Summary Report -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div class="w-12 h-12 rounded-xl bg-info/15 flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="14,2 14,8 20,8" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="12" y1="18" x2="12" y2="12" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="9" y1="15" x2="15" y2="15" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3 class="font-poppins font-bold text-lg text-ditto-text mb-1">Summary</h3>
        <p class="text-sm text-ditto-subtext mb-5">Your total royalty earnings, broken down by release, track and store.</p>
        <button class="px-5 py-2.5 border border-ditto-purple text-ditto-purple text-sm font-medium rounded-full hover:bg-ditto-purple/5 transition-colors">
          Generate Report
        </button>
      </div>
    </div>

    <!-- Previous Downloads -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="font-poppins font-bold text-lg text-ditto-text">Recent Downloads</h3>
      </div>
      <div v-for="report in recentReports" :key="report.id" class="flex items-center gap-4 px-6 py-4 border-t border-gray-50 first:border-t-0 hover:bg-ditto-light-grey transition-colors">
        <div class="w-10 h-10 rounded-lg bg-ditto-purple/10 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-ditto-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="14,2 14,8 20,8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-ditto-text">{{ report.name }}</p>
          <p class="text-xs text-ditto-subtext">{{ report.period }} · Generated {{ report.date }}</p>
        </div>
        <button class="text-sm font-medium text-ditto-purple hover:text-ditto-purple/80 transition-colors flex items-center gap-1.5">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Download
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const recentReports = [
  { id: 1, name: 'Net Revenue Report', period: 'March 2026', date: '1 Apr 2026' },
  { id: 2, name: 'Summary Report', period: 'Q1 2026', date: '1 Apr 2026' },
  { id: 3, name: 'Net Revenue Report', period: 'February 2026', date: '1 Mar 2026' },
  { id: 4, name: 'Net Revenue Report', period: 'January 2026', date: '1 Feb 2026' },
]
</script>
