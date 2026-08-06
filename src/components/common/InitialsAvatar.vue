<template>
  <span
    class="flex items-center justify-center w-full h-full select-none"
    :style="{ backgroundColor: colors[0], color: colors[1] }"
  >
    <span :class="['font-satoshi font-black tracking-[-0.02em]', textClass || 'text-base']">{{ initials }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ name: string; textClass?: string }>()

// Brand colour pairs [background, text] — picked deterministically per name so
// an artist keeps the same colour everywhere they appear.
const palette: [string, string][] = [
  ['#5f1fff', '#ffffff'], // purple
  ['#101f3c', '#E6FF3A'], // ink + lime
  ['#a06bff', '#101f3c'], // lavender + ink
  ['#E6FF3A', '#101f3c'], // lime + ink
  ['#101f3c', '#ffffff'], // ink + white
]

// "(3x3)" style suffixes don't belong in the initials
const cleanName = computed(() => props.name.replace(/\(.*?\)/g, '').trim())

const initials = computed(() => {
  const words = cleanName.value.split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].length <= 3 ? words[0].toUpperCase() : words[0][0].toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
})

const colors = computed(() => {
  let hash = 0
  for (const ch of props.name) hash = (hash * 31 + ch.charCodeAt(0)) % 997
  return palette[hash % palette.length]
})
</script>
