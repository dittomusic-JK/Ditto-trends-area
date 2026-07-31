<template>
  <div>
    <!-- Selected stores -->
    <div class="mb-10">
      <h3 class="font-satoshi font-black tracking-[-0.03em] text-xl text-ditto-text mb-1">Your stores</h3>
      <p class="text-sm text-ditto-subtext mb-5">This release is live on {{ selectedStores.length }} stores.</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        <div
          v-for="store in selectedStores"
          :key="store.id"
          class="flex items-center gap-3 px-4 py-3.5 bg-white border border-gray-200 rounded-xl"
        >
          <img :src="store.logo" :alt="store.name" class="w-9 h-9 object-contain flex-shrink-0" />
          <span class="text-sm font-medium text-ditto-text flex-1 truncate">{{ store.name }}</span>
          <span class="w-5 h-5 rounded-full bg-success flex items-center justify-center flex-shrink-0">
            <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
        </div>
      </div>
    </div>

    <!-- Available stores -->
    <div>
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h3 class="font-satoshi font-black tracking-[-0.03em] text-xl text-ditto-text mb-1">Available stores</h3>
          <p class="text-sm text-ditto-subtext">Send this release to more stores at no extra cost.</p>
        </div>
        <!-- Auto-send toggle -->
        <label class="flex items-center gap-3 cursor-pointer flex-shrink-0">
          <span class="text-sm text-ditto-text">Auto-send to new stores</span>
          <button
            role="switch"
            :aria-checked="autoSend"
            @click.prevent="autoSend = !autoSend"
            :class="['relative w-11 h-6 rounded-full transition-colors', autoSend ? 'bg-ditto-purple' : 'bg-gray-300']"
          >
            <span :class="['absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all', autoSend ? 'left-[22px]' : 'left-0.5']"></span>
          </button>
        </label>
      </div>

      <div v-if="availableStores.length === 0" class="px-6 py-10 bg-ditto-light-grey rounded-2xl text-center">
        <p class="text-sm text-ditto-subtext">You're live on every store we deliver to. Nice.</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        <div
          v-for="store in availableStores"
          :key="store.id"
          @click="toggleAdd(store.id)"
          :class="[
            'flex items-center gap-3 px-4 py-3.5 border rounded-xl cursor-pointer transition-all',
            addedIds.has(store.id) ? 'border-ditto-purple bg-ditto-purple/5' : 'border-gray-200 bg-white hover:border-gray-300'
          ]"
        >
          <img :src="store.logo" :alt="store.name" class="w-9 h-9 object-contain flex-shrink-0" />
          <div class="flex-1 min-w-0 flex items-center gap-1.5">
            <span class="text-sm font-medium text-ditto-text truncate">{{ store.name }}</span>
            <!-- More information tooltip -->
            <div class="relative group flex-shrink-0" @click.stop>
              <svg class="w-3.5 h-3.5 text-ditto-subtext cursor-help" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-ditto-text text-white text-xs leading-relaxed rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
                {{ store.info }}
                <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-ditto-text"></div>
              </div>
            </div>
          </div>
          <span :class="[
            'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
            addedIds.has(store.id) ? 'bg-ditto-purple border-ditto-purple' : 'border-gray-300 bg-white'
          ]">
            <svg v-if="addedIds.has(store.id)" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
        </div>
      </div>

      <!-- Send action -->
      <transition
        enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0"
      >
        <div v-if="addedIds.size > 0" class="flex justify-end mt-5">
          <button
            @click="sendToStores"
            class="px-6 py-2.5 bg-ditto-purple btn-pop-purple text-white text-sm font-medium rounded-full hover:opacity-95 transition-all"
          >
            Send to {{ addedIds.size }} store{{ addedIds.size === 1 ? '' : 's' }}
          </button>
        </div>
      </transition>
    </div>

    <!-- Toast -->
    <transition
      enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-y-2" enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0 translate-y-2"
    >
      <div v-if="toast" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-ditto-text text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
        <svg class="w-4 h-4 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12" stroke-linecap="round" stroke-linejoin="round"/></svg>
        {{ toast }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ReleaseDetail } from '../../data/releaseDetailMockData'
import { musicStores } from '../../data/releaseDetailMockData'

const props = defineProps<{ release: ReleaseDetail }>()

const selectedIds = ref<Set<string>>(new Set(props.release.selectedStoreIds))
const addedIds = ref<Set<string>>(new Set())
const autoSend = ref(props.release.autoSendToNewStores)
const toast = ref('')
let toastTimer: ReturnType<typeof setTimeout> | undefined

const selectedStores = computed(() => musicStores.filter(s => selectedIds.value.has(s.id)))
const availableStores = computed(() => musicStores.filter(s => !selectedIds.value.has(s.id)))

const toggleAdd = (id: string) => {
  const next = new Set(addedIds.value)
  next.has(id) ? next.delete(id) : next.add(id)
  addedIds.value = next
}

const sendToStores = () => {
  const count = addedIds.value.size
  const next = new Set(selectedIds.value)
  addedIds.value.forEach(id => next.add(id))
  selectedIds.value = next
  addedIds.value = new Set()
  toast.value = `Release sent to ${count} new store${count === 1 ? '' : 's'}`
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 3200)
}
</script>
