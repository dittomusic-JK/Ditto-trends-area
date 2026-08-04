<template>
  <!-- Canonical status pill (anatomy from the Neighbouring Rights tracklist):
       soft tint fill, darker same-hue text for contrast, small leading dot.
       success = registered/accepted/live · warning = submitted/pending
       danger = rejected/failed · info = informational · neutral = inactive -->
  <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap', tone.pill]">
    <span :class="['w-1.5 h-1.5 rounded-full flex-shrink-0', tone.dot]"></span>
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  label?: string
}>(), {
  variant: 'neutral',
})

// Literal hex tints: Tailwind can't alpha-modify var()-based colors
// (bg-success/10 compiles to nothing), so tints are spelled out.
const tones: Record<string, { pill: string; dot: string }> = {
  success: { pill: 'bg-[#00e785]/10 text-[#006633]', dot: 'bg-[#00e785]' },
  warning: { pill: 'bg-[#fffbeb] text-[#92400e]', dot: 'bg-[#f59e0b]' },
  danger: { pill: 'bg-[#ee404c]/10 text-[#d92121]', dot: 'bg-[#ee404c]' },
  info: { pill: 'bg-[#287ef7]/10 text-[#1e63c4]', dot: 'bg-[#287ef7]' },
  neutral: { pill: 'bg-ditto-light-grey text-ditto-grey', dot: 'bg-[#9595a7]' },
}

const tone = computed(() => tones[props.variant])
</script>
