<template>
  <div ref="root" class="relative">
    <!-- Trigger -->
    <button
      type="button"
      @click="toggle"
      :class="[
        'w-full flex items-center justify-between gap-2 px-0 py-2.5 border-0 border-b text-sm text-left bg-transparent transition-colors',
        error ? 'border-error' : open ? 'border-ditto-purple' : 'border-gray-300'
      ]"
    >
      <span :class="modelValue ? 'text-ditto-text truncate' : 'text-ditto-subtext truncate'">
        {{ modelValue || placeholder }}
      </span>
      <svg
        class="w-4 h-4 text-ditto-subtext flex-shrink-0 transition-transform"
        :class="{ 'rotate-180': open }"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      >
        <polyline points="6 9 12 15 18 9" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Menu -->
    <div
      v-if="open"
      class="absolute z-30 left-0 right-0 mt-1 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden"
    >
      <div class="p-2 border-b border-gray-100">
        <input
          ref="searchInput"
          v-model="query"
          type="text"
          placeholder="Search..."
          class="w-full px-2 py-1.5 text-sm text-ditto-text bg-transparent focus:outline-none placeholder:text-ditto-subtext"
          @click.stop
        />
      </div>
      <div class="max-h-60 overflow-y-auto py-1">
        <button
          v-for="option in filtered"
          :key="option"
          type="button"
          @click="select(option)"
          :class="[
            'w-full text-left px-4 py-2.5 text-sm transition-colors',
            option === modelValue ? 'bg-ditto-purple/5 text-ditto-purple font-medium' : 'text-ditto-text hover:bg-ditto-light-grey'
          ]"
        >
          {{ option }}
        </button>
        <p v-if="filtered.length === 0" class="px-4 py-3 text-sm text-ditto-subtext text-center">
          No matches for &ldquo;{{ query }}&rdquo;
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string
  options: string[]
  placeholder?: string
  error?: boolean
}>(), {
  placeholder: 'Select...',
  error: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur'): void
}>()

const root = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const open = ref(false)
const query = ref('')

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.options
  return props.options.filter(o => o.toLowerCase().includes(q))
})

watch(open, (isOpen) => {
  if (isOpen) {
    query.value = ''
    nextTick(() => searchInput.value?.focus())
  }
})

const close = () => {
  if (!open.value) return
  open.value = false
  emit('blur')
}

const toggle = () => {
  if (open.value) close()
  else open.value = true
}

const select = (option: string) => {
  emit('update:modelValue', option)
  close()
}

const handleClickOutside = (event: MouseEvent) => {
  if (root.value && !root.value.contains(event.target as Node)) close()
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))
</script>
