<template>
  <div>
    <h2 class="font-satoshi font-black tracking-[-0.03em] text-xl lg:text-2xl text-ditto-text mb-2">Plan your release</h2>
    <p class="text-sm text-ditto-subtext mb-6">Choose when and how you want to release your video.</p>

    <!-- Date picker: shared builder component (music-builder anatomy).
         Required error only after leaving the step. -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-ditto-text mb-3">Release Date</label>
      <DatePickerDropdown
        class="max-w-xs"
        :model-value="schedule.releaseDate"
        :error="visited && !schedule.releaseDate"
        mode="future"
        @update:model-value="updateField('releaseDate', $event)"
      />
      <p v-if="visited && !schedule.releaseDate" class="text-xs text-error mt-2">Release date is required.</p>
    </div>

    <!-- Store Processing Notice (shown when date is within 3 days) -->
    <div v-if="isWithin3Days" class="mb-6 p-4 rounded-xl bg-info/10 border border-info/20 flex items-start gap-3">
      <svg class="w-5 h-5 text-info flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
      <div>
        <p class="text-sm font-medium text-ditto-text mb-0.5">Store processing times</p>
        <p class="text-xs text-ditto-subtext leading-relaxed">
          Your video will go live on most platforms on this date, but some stores can take up to <strong class="text-ditto-text">48 hours</strong> to process new releases.
        </p>
      </div>
    </div>

    <!-- Release Time (no top rule — it would double up with the date field's underline) -->
    <div class="mb-6 pt-2">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm text-ditto-text">Set a specific release time?</span>
        <button
          @click="updateField('timedRelease', !schedule.timedRelease)"
          :class="[
            'w-[51px] h-[31px] rounded-full relative transition-colors flex-shrink-0',
            schedule.timedRelease ? 'bg-[#34c759]' : 'bg-[#e9e9eb]'
          ]"
        >
          <span :class="[
            'absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform',
            schedule.timedRelease ? 'translate-x-[20px]' : 'translate-x-0'
          ]"></span>
        </button>
      </div>
      <!-- Hour / minute / timezone — custom dropdowns in the release-date trigger's format -->
      <div v-if="schedule.timedRelease" class="flex items-center gap-3 max-w-md">
        <UnderlineSelect class="w-20" :model-value="schedule.releaseTime.hour" :options="hourOptions" placeholder="HH" @update:model-value="updateTime('hour', $event)" />
        <UnderlineSelect class="w-20" :model-value="schedule.releaseTime.minute" :options="minuteOptions" placeholder="MM" @update:model-value="updateTime('minute', $event)" />
        <UnderlineSelect class="flex-1" :model-value="schedule.releaseTime.zone" :options="zoneOptions" placeholder="Timezone" @update:model-value="updateTime('zone', $event)" />
      </div>
    </div>

    <!-- Country Restrictions -->
    <div class="mb-6 border-t border-gray-200 pt-5">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm text-ditto-text">Country restrictions?</span>
        <button
          @click="updateField('countryRestrictions', !schedule.countryRestrictions)"
          :class="[
            'w-[51px] h-[31px] rounded-full relative transition-colors flex-shrink-0',
            schedule.countryRestrictions ? 'bg-[#34c759]' : 'bg-[#e9e9eb]'
          ]"
        >
          <span :class="[
            'absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform',
            schedule.countryRestrictions ? 'translate-x-[20px]' : 'translate-x-0'
          ]"></span>
        </button>
      </div>
      <!-- Same country popup as the music builder -->
      <div v-if="schedule.countryRestrictions" class="space-y-3">
        <p class="text-xs text-ditto-subtext">Your video will not be available in the selected countries.</p>
        <div class="flex flex-wrap items-center gap-2">
          <span
            v-for="country in schedule.restrictedCountries"
            :key="country"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-error/10 text-error"
          >
            {{ country }}
            <button @click="removeCountry(country)" class="hover:opacity-70" :aria-label="'Remove ' + country">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </span>
          <button
            @click="showCountryModal = true"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border border-gray-200 text-ditto-text hover:border-ditto-purple hover:text-ditto-purple transition-colors"
          >
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            {{ schedule.restrictedCountries.length ? 'Edit countries' : 'Select countries' }}
          </button>
        </div>
      </div>
    </div>

    <CountryRestrictionsModal
      v-if="showCountryModal"
      :selected="schedule.restrictedCountries"
      @update:selected="updateField('restrictedCountries', $event)"
      @close="showCountryModal = false"
    />

    <!-- Original Release Date -->
    <div class="border-t border-gray-200 pt-5">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm text-ditto-text">Is this a re-release? (Original release date)</span>
        <button
          @click="updateField('hasOriginalDate', !schedule.hasOriginalDate)"
          :class="[
            'w-[51px] h-[31px] rounded-full relative transition-colors flex-shrink-0',
            schedule.hasOriginalDate ? 'bg-[#34c759]' : 'bg-[#e9e9eb]'
          ]"
        >
          <span :class="[
            'absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform',
            schedule.hasOriginalDate ? 'translate-x-[20px]' : 'translate-x-0'
          ]"></span>
        </button>
      </div>
      <div v-if="schedule.hasOriginalDate">
        <DatePickerDropdown
          class="max-w-xs"
          :model-value="schedule.originalReleaseDate"
          mode="past"
          placeholder="Select original date"
          @update:model-value="updateField('originalReleaseDate', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CountryRestrictionsModal from './CountryRestrictionsModal.vue'
import DatePickerDropdown from './DatePickerDropdown.vue'
import UnderlineSelect from './UnderlineSelect.vue'

interface Schedule {
  releaseDate: Date | null
  timedRelease: boolean
  releaseTime: { hour: string; minute: string; zone: string }
  countryRestrictions: boolean
  restrictedCountries: string[]
  hasOriginalDate: boolean
  originalReleaseDate: Date | null
}

const props = defineProps<{
  schedule: Schedule
  /** True once the user has left this step — required errors only show from then on */
  visited?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:schedule', schedule: Schedule): void
}>()

const today = new Date()
today.setHours(0, 0, 0, 0)

const showCountryModal = ref(false)

// Release-time options
const hourOptions = Array.from({ length: 24 }, (_, h) => String(h).padStart(2, '0'))
const minuteOptions = ['00', '15', '30', '45']
const zoneOptions = ['Local to each store', 'UTC', 'BST (UK)', 'EST (US)']

// Check if selected date is within 3 days (show processing notice)
const isWithin3Days = computed(() => {
  if (!props.schedule.releaseDate) return false
  const diff = Math.ceil((props.schedule.releaseDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff > 0 && diff <= 3
})


const updateField = (key: keyof Schedule, value: any) => {
  emit('update:schedule', { ...props.schedule, [key]: value })
}

const removeCountry = (country: string) => {
  updateField('restrictedCountries', props.schedule.restrictedCountries.filter(c => c !== country))
}

const updateTime = (key: 'hour' | 'minute' | 'zone', value: string) => {
  emit('update:schedule', { ...props.schedule, releaseTime: { ...props.schedule.releaseTime, [key]: value } })
}

</script>

