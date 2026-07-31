<template>
  <!-- Bottom player bar, ported from the ditto-admin project (PlayerBar.vue) -->
  <Teleport to="body">
    <Transition name="player-slide">
      <div
        v-if="track"
        class="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#e4e4ef] shadow-[0_-4px_16px_rgba(16,31,60,0.08)]"
      >
        <!-- Seek bar along the top edge -->
        <div
          ref="seekRef"
          class="group relative h-1 -mt-px cursor-pointer"
          @click="seek"
        >
          <div class="absolute inset-0 bg-[#efeffc]"></div>
          <div class="absolute inset-y-0 left-0 bg-ditto-purple transition-[width] duration-300 ease-linear" :style="{ width: `${fraction * 100}%` }"></div>
          <div
            class="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-ditto-purple opacity-0 group-hover:opacity-100 transition-opacity shadow"
            :style="{ left: `calc(${fraction * 100}% - 6px)` }"
          ></div>
        </div>

        <div class="flex items-center gap-4 px-4 py-2.5">
          <!-- Track identity -->
          <div class="flex items-center gap-3 min-w-0 w-64 flex-shrink-0">
            <img v-if="track.artwork" :src="track.artwork" :alt="track.title" class="w-10 h-10 rounded-md object-cover flex-shrink-0" />
            <span v-else class="w-10 h-10 rounded-md bg-[#efeffc] flex items-center justify-center flex-shrink-0">
              <PIcon name="music" :size="16" class="text-ditto-subtext" />
            </span>
            <div class="min-w-0">
              <p class="text-[13px] font-medium text-ditto-text truncate">{{ track.title }}</p>
              <p class="text-xs text-ditto-subtext truncate">{{ track.artist }}</p>
            </div>
          </div>

          <!-- Transport -->
          <div class="flex items-center gap-1 mx-auto">
            <button class="w-8 h-8 flex items-center justify-center rounded-full text-ditto-subtext hover:text-ditto-text hover:bg-[#f9f9ff] transition-colors" @click="$emit('previous')" aria-label="Previous track">
              <PIcon name="skip-back" :size="14" />
            </button>
            <button
              class="w-9 h-9 flex items-center justify-center rounded-full bg-ditto-text btn-pop-dark text-white hover:bg-ditto-purple transition-colors mx-1"
              @click="playing = !playing"
              :aria-label="playing ? 'Pause' : 'Play'"
            >
              <PIcon :name="playing ? 'pause' : 'play'" :size="14" />
            </button>
            <button class="w-8 h-8 flex items-center justify-center rounded-full text-ditto-subtext hover:text-ditto-text hover:bg-[#f9f9ff] transition-colors" @click="$emit('next')" aria-label="Next track">
              <PIcon name="skip-forward" :size="14" />
            </button>
          </div>

          <!-- Time -->
          <p class="text-xs text-ditto-subtext tabular-nums flex-shrink-0 w-24 text-center">
            {{ format(elapsed) }} <span class="text-[#b1b1c3]">/ {{ format(duration) }}</span>
          </p>

          <!-- Volume + close -->
          <div class="hidden md:flex items-center gap-2 flex-shrink-0 w-40">
            <PIcon name="volume" :size="15" class="text-ditto-subtext flex-shrink-0" />
            <div class="relative h-1 flex-1 rounded-full bg-[#efeffc] overflow-hidden">
              <div class="absolute inset-y-0 left-0 w-3/4 bg-[#b1b1c3]"></div>
            </div>
          </div>
          <button
            class="w-8 h-8 flex items-center justify-center rounded-full text-ditto-subtext hover:text-ditto-text hover:bg-[#f9f9ff] transition-colors flex-shrink-0"
            @click="$emit('close')"
            aria-label="Close player"
          >
            <PIcon name="x" :size="15" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted, defineComponent, h } from 'vue'

export interface PlayerTrack {
  title: string
  artist: string
  /** seconds */
  duration?: number
  artwork?: string
}

const props = defineProps<{
  track: PlayerTrack | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'previous'): void
  (e: 'next'): void
  (e: 'playing', value: boolean): void
}>()

const playing = ref(false)
const elapsed = ref(0)
const seekRef = ref<HTMLElement | null>(null)

const duration = computed(() => props.track?.duration ?? 204)
const fraction = computed(() => (duration.value ? Math.min(elapsed.value / duration.value, 1) : 0))

let timer: ReturnType<typeof setInterval> | null = null

const tick = () => {
  if (elapsed.value >= duration.value) {
    playing.value = false
    elapsed.value = duration.value
  } else {
    elapsed.value += 0.5
  }
}

watch(playing, val => {
  emit('playing', val)
  if (timer) { clearInterval(timer); timer = null }
  if (val) timer = setInterval(tick, 500)
})

// New track: restart from the top, keep playing
watch(() => props.track, (t, old) => {
  if (!t) { playing.value = false; return }
  if (t !== old) {
    elapsed.value = 0
    playing.value = true
  }
})

const seek = (e: MouseEvent) => {
  const el = seekRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  elapsed.value = ((e.clientX - rect.left) / rect.width) * duration.value
}

const format = (s: number) => {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}

onUnmounted(() => { if (timer) clearInterval(timer) })

defineExpose({
  play: () => { playing.value = true },
  pause: () => { playing.value = false },
})

// Minimal stroke icon renderer (same lucide-style geometry as ditto-admin's Icon.vue)
const ICON_PATHS: Record<string, string[]> = {
  'music': ['M9 18V5l12-2v13', 'M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M18 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
  'play': ['M5 3l14 9-14 9V3z'],
  'pause': ['M7 4v16', 'M17 4v16'],
  'skip-back': ['M19 20L9 12l10-8v16z', 'M5 19V5'],
  'skip-forward': ['M5 4l10 8-10 8V4z', 'M19 5v14'],
  'volume': ['M11 5L6 9H2v6h4l5 4V5z', 'M15.54 8.46a5 5 0 0 1 0 7.07', 'M19.07 4.93a10 10 0 0 1 0 14.14'],
  'x': ['M18 6L6 18', 'M6 6l12 12'],
}

const PIcon = defineComponent({
  props: {
    name: { type: String, required: true },
    size: { type: Number, default: 16 },
  },
  setup(p) {
    return () => h('svg', {
      width: p.size, height: p.size, viewBox: '0 0 24 24', fill: 'none',
      stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    }, (ICON_PATHS[p.name] ?? []).map(d => h('path', { d })))
  },
})
</script>

<style scoped>
.player-slide-enter-active,
.player-slide-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.player-slide-enter-from,
.player-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
