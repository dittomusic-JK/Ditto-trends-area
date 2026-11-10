<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl">
      <!-- Header -->
      <div class="px-6 pt-6 pb-4 border-b border-gray-100">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="font-satoshi font-black text-lg tracking-[-0.02em] text-ditto-text">Country restrictions</h3>
            <p class="text-xs text-ditto-subtext mt-1">Every country is selected by default. Untick the continents or countries you <span class="font-semibold text-ditto-text">don't</span> want this release distributed to.</p>
            <!-- One total, at the top: no per-continent counts -->
            <p class="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" :class="selected.length ? 'bg-[#efe9ff] text-ditto-purple' : 'bg-ditto-light-grey text-ditto-text'">
              {{ includedCount }} of {{ total }} countries selected
            </p>
          </div>
          <button @click="$emit('close')" class="w-8 h-8 -mt-1 -mr-1 rounded-full hover:bg-ditto-light-grey flex items-center justify-center transition-colors flex-shrink-0" aria-label="Close">
            <svg class="w-4 h-4 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- Continents: tick one to select every country in it -->
        <p class="text-[11px] font-semibold uppercase tracking-wide text-ditto-subtext mt-4 mb-2">Continents</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="continent in continents"
            :key="continent"
            type="button"
            :disabled="!countriesIn(continent).length"
            :title="!countriesIn(continent).length ? 'No stores deliver here' : ''"
            :aria-pressed="state(continent) === 'all'"
            @click="toggleContinent(continent)"
            :class="[
              'flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
              state(continent) === 'all' ? 'border-ditto-purple bg-ditto-purple text-white'
                : state(continent) === 'some' ? 'border-ditto-purple/60 bg-ditto-purple/5 text-ditto-text'
                : 'border-gray-200 text-ditto-text hover:border-ditto-purple/60'
            ]"
          >
            <span :class="['w-4 h-4 rounded border flex items-center justify-center flex-shrink-0', state(continent) === 'all' ? 'border-white/70 bg-white/20' : state(continent) === 'some' ? 'border-ditto-purple bg-ditto-purple' : 'border-gray-300 bg-white']">
              <svg v-if="state(continent) === 'all'" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span v-else-if="state(continent) === 'some'" class="w-2 h-0.5 bg-white rounded"></span>
            </span>
            {{ continent }}
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

      <!-- Countries, grouped by continent -->
      <div class="flex-1 overflow-y-auto px-3 py-2">
        <p v-if="!groups.length" class="text-sm text-ditto-subtext text-center py-8">No countries match &ldquo;{{ query }}&rdquo;</p>
        <div v-for="group in groups" :key="group.continent" class="mb-1">
          <button
            type="button"
            @click="toggleOpen(group.continent)"
            class="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-ditto-light-grey transition-colors text-left"
          >
            <svg :class="['w-3.5 h-3.5 text-ditto-subtext transition-transform', isOpen(group.continent) ? 'rotate-90' : '']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            <span class="text-xs font-semibold text-ditto-text">{{ group.continent }}</span>
          </button>
          <div v-if="isOpen(group.continent)" class="pl-5">
            <label
              v-for="country in group.countries"
              :key="country.code"
              class="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-ditto-light-grey transition-colors select-none"
            >
              <input type="checkbox" class="sr-only" :checked="isIncluded(country.name)" @change="toggle(country.name)" />
              <span :class="['w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0', isIncluded(country.name) ? 'border-ditto-purple bg-ditto-purple' : 'border-gray-300 bg-white']">
                <svg v-if="isIncluded(country.name)" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span class="text-base leading-none">{{ country.flag }}</span>
              <span class="text-sm text-ditto-text">{{ country.name }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <button v-if="selected.length" @click="$emit('update:selected', [])" class="text-xs text-ditto-purple font-medium hover:underline">Select all</button>
          <p v-if="includedCount === 0" class="text-xs text-error">Select at least one country.</p>
        </div>
        <button @click="$emit('close')" :disabled="includedCount === 0" class="px-7 py-2.5 bg-ditto-purple text-white text-sm font-medium rounded-full hover:bg-ditto-purple/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Done</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { continents, countriesIn, restrictableCountries } from '../../../data/countryRestrictions'
import type { Continent } from '../../../data/countryRestrictions'

// Shared between the video and music builders. Matches the live web and mobile
// release builders: a tick means "distribute here" and everything starts ticked.
// The stored value is still the flat list of EXCLUDED country names (`selected`),
// so nothing downstream changes; ticks are derived as "not in that list".
const props = defineProps<{ selected: string[] }>()

const emit = defineEmits<{
  (e: 'update:selected', countries: string[]): void
  (e: 'close'): void
}>()

const query = ref('')
const searchRef = ref<HTMLInputElement | null>(null)
onMounted(() => searchRef.value?.focus())

const total = restrictableCountries.length
const includedCount = computed(() => total - props.selected.length)
const isIncluded = (name: string) => !props.selected.includes(name)
// Continent tick state, in terms of INCLUDED countries
const state = (c: Continent): 'none' | 'some' | 'all' => {
  const names = countriesIn(c).map(x => x.name)
  if (!names.length) return 'none'
  const inc = names.filter(isIncluded).length
  return inc === names.length ? 'all' : inc === 0 ? 'none' : 'some'
}

// Groups follow the search: a query shows only matching countries and opens their groups
const groups = computed(() => {
  const q = query.value.trim().toLowerCase()
  return continents
    .map(continent => ({
      continent,
      countries: countriesIn(continent).filter(c => !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q),
    }))
    .filter(g => g.countries.length)
})

// Collapsed by default; groups with an exclusion start open, search opens every match
const open = reactive(new Set<Continent>(continents.filter(c => countriesIn(c).length && state(c) !== 'all')))
const isOpen = (c: Continent) => !!query.value.trim() || open.has(c)
const toggleOpen = (c: Continent) => { open.has(c) ? open.delete(c) : open.add(c) }

const toggle = (name: string) => {
  if (props.selected.includes(name)) emit('update:selected', props.selected.filter(c => c !== name))
  else emit('update:selected', [...props.selected, name])
}

// Fully ticked continent: untick excludes every country in it. Partial or empty: tick includes them all.
const toggleContinent = (c: Continent) => {
  const names = countriesIn(c).map(x => x.name)
  if (!names.length) return
  if (state(c) === 'all') {
    const merged = [...props.selected]
    for (const n of names) if (!merged.includes(n)) merged.push(n)
    // keep the list in catalogue order so chips and groups read consistently
    emit('update:selected', restrictableCountries.map(x => x.name).filter(n => merged.includes(n)))
    open.add(c)
  } else {
    emit('update:selected', props.selected.filter(n => !names.includes(n)))
  }
}
</script>
