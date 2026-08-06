<template>
  <div>
    <h1 class="font-satoshi font-black text-2xl lg:text-[32px] tracking-[-0.03em] text-ditto-text mb-10">Select your stores</h1>

    <!-- ── Standard stores ── -->
    <div class="border border-gray-200 rounded-2xl p-6 lg:p-8">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 class="font-satoshi font-black text-xl lg:text-2xl tracking-[-0.03em] text-ditto-text">Standard Stores</h2>
        <div class="flex flex-wrap items-center gap-5">
          <label v-for="mode in filterModes" :key="mode.id" class="flex items-center gap-2 cursor-pointer group">
            <span :class="['w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors', activeFilter === mode.id ? 'border-ditto-purple bg-ditto-purple' : 'border-gray-300 group-hover:border-ditto-purple/50']">
              <svg v-if="activeFilter === mode.id" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <input type="radio" class="sr-only" :value="mode.id" v-model="activeFilter" @change="applyFilter(mode.id)" />
            <span class="text-sm font-semibold text-ditto-text">{{ mode.label }}</span>
          </label>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        <button
          v-for="store in standardStores"
          :key="store.id"
          @click="toggleStore(store.id)"
          :class="[
            'flex items-center gap-3 px-3.5 py-3 rounded-2xl text-left transition-colors border',
            isOn(store.id) ? 'bg-ditto-light-grey/70 border-transparent' : 'bg-white border-gray-200 opacity-60 hover:opacity-100'
          ]"
        >
          <span class="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 text-xs font-bold text-white" :style="store.letter ? { backgroundColor: store.tileColor } : {}">
            <img v-if="store.icon" :src="store.icon" :alt="store.name" class="w-full h-full object-contain" />
            <template v-else>{{ store.letter }}</template>
          </span>
          <span class="min-w-0 flex-1">
            <span class="block text-[13px] font-semibold text-ditto-text leading-tight truncate">{{ store.name }}</span>
            <span class="block text-[11px] text-ditto-purple underline underline-offset-2 mt-0.5">More information</span>
          </span>
          <span :class="['w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors', isOn(store.id) ? 'border-ditto-purple bg-white' : 'border-gray-300']">
            <svg v-if="isOn(store.id)" class="w-3.5 h-3.5 text-ditto-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
        </button>
      </div>
      <p v-if="form.selectedStores.length === 0" class="text-xs text-error mt-4">Select at least one store to continue.</p>
    </div>

    <!-- ── Advanced stores ── -->
    <h2 class="font-satoshi font-black text-xl lg:text-2xl tracking-[-0.03em] text-ditto-text mt-12 mb-6">Advanced Stores</h2>
    <div class="space-y-4">
      <button
        v-for="store in advancedStores"
        :key="store.id"
        @click="toggleAdvanced(store.id)"
        :class="[
          'w-full flex items-center gap-6 px-6 py-6 rounded-2xl text-left border transition-colors',
          isAdvancedOn(store.id) ? 'bg-ditto-light-grey/70 border-transparent' : 'bg-white border-gray-200 hover:bg-ditto-light-grey/40'
        ]"
      >
        <span class="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 text-sm font-bold text-white" :style="store.letter ? { backgroundColor: store.tileColor } : {}">
          <img v-if="store.icon" :src="store.icon" :alt="store.name" class="w-full h-full object-contain" />
          <template v-else>{{ store.letter }}</template>
        </span>
        <span class="flex-1 min-w-0">
          <span class="block text-sm font-bold text-ditto-text">{{ store.name }}</span>
          <span class="block text-[13px] text-ditto-subtext leading-relaxed mt-1">{{ store.description }}</span>
        </span>
        <span v-if="store.price" class="text-sm font-bold text-ditto-purple flex-shrink-0">+£{{ store.price }}</span>
        <span :class="['w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors', isAdvancedOn(store.id) ? 'border-ditto-purple bg-ditto-purple' : 'border-gray-300']">
          <svg v-if="isAdvancedOn(store.id)" class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </span>
      </button>
    </div>

    <!-- ── Price band ── -->
    <div class="mt-12">
      <p class="text-lg font-semibold text-ditto-text mb-5">How much would you like to <span class="font-black">charge for each track?</span></p>
      <div class="flex items-center gap-8">
        <label v-for="band in priceBands" :key="band.id" class="flex items-center gap-2.5 cursor-pointer group">
          <span :class="['w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors', form.priceBand === band.id ? 'border-ditto-purple bg-ditto-purple' : 'border-gray-300 group-hover:border-ditto-purple/50']">
            <svg v-if="form.priceBand === band.id" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
          <input type="radio" class="sr-only" :value="band.id" v-model="form.priceBand" />
          <span class="text-sm font-semibold text-ditto-text">{{ band.label }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { standardStores, advancedStores } from '../../../../data/releaseBuilderMockData'
import type { ReleaseBuilderForm } from '../ReleaseBuilderView.vue'

const props = defineProps<{ form: ReleaseBuilderForm }>()

const filterModes = [
  { id: 'all', label: 'Select All Stores' },
  { id: 'streaming', label: 'Streaming Only' },
  { id: 'download', label: 'Download Only' },
] as const

const priceBands = [
  { id: 'budget', label: 'Budget' },
  { id: 'mid', label: 'Mid' },
  { id: 'premium', label: 'Premium' },
] as const

const activeFilter = ref<'all' | 'streaming' | 'download'>('all')

// Everything on by default, matching the live builder
if (props.form.selectedStores.length === 0) {
  props.form.selectedStores = standardStores.map(s => s.id)
}

const applyFilter = (mode: 'all' | 'streaming' | 'download') => {
  if (mode === 'all') {
    props.form.selectedStores = standardStores.map(s => s.id)
  } else {
    props.form.selectedStores = standardStores
      .filter(s => s.type === mode || s.type === 'both')
      .map(s => s.id)
  }
}

const isOn = (id: string) => props.form.selectedStores.includes(id)
const toggleStore = (id: string) => {
  const i = props.form.selectedStores.indexOf(id)
  if (i >= 0) props.form.selectedStores.splice(i, 1)
  else props.form.selectedStores.push(id)
}

const isAdvancedOn = (id: string) => props.form.advancedStores.includes(id)
const toggleAdvanced = (id: string) => {
  const i = props.form.advancedStores.indexOf(id)
  if (i >= 0) props.form.advancedStores.splice(i, 1)
  else props.form.advancedStores.push(id)
}
</script>
