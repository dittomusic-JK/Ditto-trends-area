<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl">
      <!-- Header -->
      <div class="px-6 pt-6 pb-4 border-b border-gray-100">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="font-satoshi font-black text-lg tracking-[-0.02em] text-ditto-text">Country restrictions</h3>
            <p class="text-xs text-ditto-subtext mt-1">Select the countries where this release should <span class="font-semibold text-ditto-text">not</span> be available.</p>
          </div>
          <button @click="$emit('close')" class="w-8 h-8 -mt-1 -mr-1 rounded-full hover:bg-ditto-light-grey flex items-center justify-center transition-colors flex-shrink-0" aria-label="Close">
            <svg class="w-4 h-4 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- Search -->
        <div class="relative mt-4">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            ref="searchRef"
            v-model="query"
            type="text"
            placeholder="Search countries…"
            class="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 text-sm text-ditto-text placeholder:text-ditto-subtext focus:outline-none focus:border-ditto-purple transition-colors"
          />
        </div>
      </div>

      <!-- List -->
      <div class="flex-1 overflow-y-auto px-3 py-2">
        <p v-if="!filteredCountries.length" class="text-sm text-ditto-subtext text-center py-8">No countries match &ldquo;{{ query }}&rdquo;</p>
        <label
          v-for="country in filteredCountries"
          :key="country.code"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-ditto-light-grey transition-colors select-none"
        >
          <input type="checkbox" class="sr-only" :checked="selected.includes(country.name)" @change="toggle(country.name)" />
          <span :class="['w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0', selected.includes(country.name) ? 'border-ditto-purple bg-ditto-purple' : 'border-gray-300 bg-white']">
            <svg v-if="selected.includes(country.name)" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
          <span class="text-base leading-none">{{ country.flag }}</span>
          <span class="text-sm text-ditto-text">{{ country.name }}</span>
        </label>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <p class="text-xs text-ditto-subtext"><span class="font-semibold text-ditto-text">{{ selected.length }}</span> {{ selected.length === 1 ? 'country' : 'countries' }} restricted</p>
          <button v-if="selected.length" @click="$emit('update:selected', [])" class="text-xs text-ditto-purple font-medium hover:underline">Clear all</button>
        </div>
        <button @click="$emit('close')" class="px-7 py-2.5 bg-ditto-purple text-white text-sm font-medium rounded-full hover:bg-ditto-purple/90 transition-colors">Done</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

// Shared between the video and music builders — one country popup for both.
const props = defineProps<{ selected: string[] }>()

const emit = defineEmits<{
  (e: 'update:selected', countries: string[]): void
  (e: 'close'): void
}>()

const query = ref('')
const searchRef = ref<HTMLInputElement | null>(null)
onMounted(() => searchRef.value?.focus())

const countries = [
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'CZ', name: 'Czechia', flag: '🇨🇿' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'TR', name: 'Türkiye', flag: '🇹🇷' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
]

const filteredCountries = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return countries
  return countries.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q)
})

const toggle = (name: string) => {
  if (props.selected.includes(name)) {
    emit('update:selected', props.selected.filter(c => c !== name))
  } else {
    emit('update:selected', [...props.selected, name])
  }
}
</script>
