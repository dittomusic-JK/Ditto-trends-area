<template>
  <div class="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
    <h3 class="font-poppins font-bold text-lg lg:text-xl text-ditto-text mb-4">Earnings by Country</h3>
    <div class="space-y-1">
      <div
        v-for="country in countries"
        :key="country.rank"
        class="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
      >
        <span class="text-xl font-light text-ditto-subtext w-8">{{ country.rank }}</span>
        <div class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 shadow-sm border border-gray-100">
          <img
            :src="`https://flagcdn.com/w80/${country.code}.png`"
            :alt="country.country"
            class="w-full h-full object-cover"
          />
        </div>
        <span class="flex-1 text-sm font-medium text-ditto-text">{{ country.country }}</span>
        <div class="w-32 h-2 bg-gray-100 rounded-full overflow-hidden hidden lg:block">
          <div
            class="h-full bg-ditto-purple rounded-full"
            :style="{ width: `${country.proportion}%` }"
          ></div>
        </div>
        <span class="text-sm text-ditto-subtext w-12 text-right">{{ country.proportion }}%</span>
        <span class="text-sm font-semibold text-ditto-text w-24 text-right">{{ formatCurrency(country.earnings) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CountryEarnings } from '../../types'

defineProps<{
  countries: CountryEarnings[]
}>()

const formatCurrency = (val: number): string => {
  if (val >= 1000000) return `£${(val / 1000000).toFixed(1)}M`
  if (val >= 1000) return `£${(val / 1000).toFixed(1)}K`
  return `£${val.toFixed(2)}`
}
</script>
