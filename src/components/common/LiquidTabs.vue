<template>
  <nav ref="navRef" class="flex items-center gap-2">
    <button
      v-for="(tab, i) in tabs"
      :key="tab.id"
      :ref="el => setBtnRef(el, i)"
      @click="$emit('select', tab.id)"
      :class="[
        'relative overflow-hidden rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors bg-ditto-light-grey',
        active === tab.id ? '' : 'hover:bg-gray-200'
      ]"
    >
      <!-- Per-button clipped slice of the shared fill (masked to the pill shape) -->
      <span class="absolute inset-y-0 rounded-full pointer-events-none" :class="fillClass" :style="fillStyle(i)"></span>
      <span :class="['relative z-10 transition-colors duration-200 flex items-center gap-2', active === tab.id ? 'text-white' : 'text-ditto-text']">
        <component :is="tab.icon" v-if="tab.icon" class="w-4 h-4 flex-shrink-0" />
        {{ tab.label }}
      </span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  tabs: { id: string; label: string; icon?: object }[]
  active: string
  fillClass?: string
}>(), {
  fillClass: 'bg-ditto-text btn-pop-dark',
})

defineEmits<{
  (e: 'select', id: string): void
}>()

const navRef = ref<HTMLElement | null>(null)
const btnRefs: HTMLElement[] = []
const setBtnRef = (el: unknown, i: number) => { if (el) btnRefs[i] = el as HTMLElement }

// Per-button geometry (nav coordinates) + the shared fill span (nav coordinates).
const btnGeom = reactive<{ left: number; width: number }[]>([])
const fill = reactive({ left: 0, rightEdge: 0, transition: 'none', ready: false })

let prevIndex = props.tabs.findIndex(t => t.id === props.active)
const EASE = 'cubic-bezier(0.34, 1.4, 0.5, 1)' // springy overshoot

const measure = () => {
  for (let i = 0; i < props.tabs.length; i++) {
    const b = btnRefs[i]
    if (b) btnGeom[i] = { left: b.offsetLeft, width: b.offsetWidth }
  }
}

const updatePosition = (animate: boolean) => {
  const i = props.tabs.findIndex(t => t.id === props.active)
  const b = btnRefs[i]
  if (!b || !navRef.value) return
  measure()

  if (animate) {
    // The leading edge moves first, the trailing edge follows (small delay), so
    // the fill stretches across the gap and settles — a liquid morph.
    const movingRight = i > prevIndex
    fill.transition = movingRight
      ? `left 0.4s ${EASE} 0.07s, right 0.4s ${EASE}`
      : `left 0.4s ${EASE}, right 0.4s ${EASE} 0.07s`
  } else {
    fill.transition = 'none'
  }

  fill.left = b.offsetLeft
  fill.rightEdge = b.offsetLeft + b.offsetWidth
  fill.ready = true
  prevIndex = i
}

// The same nav-space fill, expressed in each button's local coordinates. Each
// button clips it (overflow-hidden), so it only shows inside the pill shapes.
const fillStyle = (i: number) => {
  const g = btnGeom[i]
  if (!g || !fill.ready) return { opacity: 0 }
  return {
    left: `${fill.left - g.left}px`,
    right: `${g.left + g.width - fill.rightEdge}px`,
    transition: fill.transition,
  }
}

watch(() => props.active, () => nextTick(() => updatePosition(true)))

const onResize = () => updatePosition(false)

onMounted(() => nextTick(() => {
  updatePosition(false)
  window.addEventListener('resize', onResize)
}))
onUnmounted(() => window.removeEventListener('resize', onResize))
</script>
