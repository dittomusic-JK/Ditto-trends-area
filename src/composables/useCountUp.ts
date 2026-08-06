import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Counts a headline figure up to its final value on mount.
 *
 * Deliberately integer-only — decimals are rendered as a static suffix so the
 * number never scrambles. Eases out so it decelerates into the total rather
 * than stopping dead, and honours prefers-reduced-motion by landing instantly.
 */
export function useCountUp(target: number, options: { duration?: number; delay?: number } = {}) {
  const { duration = 750, delay = 80 } = options
  const value = ref(0)

  let frame = 0
  let timer: ReturnType<typeof setTimeout> | undefined

  // Fast at the start, gentle at the finish
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

  const run = () => {
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      value.value = Math.round(target * easeOutCubic(progress))
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
  }

  onMounted(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    // A hidden tab never fires rAF, so land on the total rather than sitting at
    // zero until the user comes back.
    if (reduced || document.hidden) {
      value.value = target
      return
    }
    timer = setTimeout(run, delay)
  })

  onUnmounted(() => {
    cancelAnimationFrame(frame)
    if (timer) clearTimeout(timer)
  })

  return value
}
