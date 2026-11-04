<template>
  <!-- Lyric Video Maker landing: pick a track, pick a look, generate. The
       generation itself is out of scope for the prototype; "Generate" drops
       the user into the video builder with the lyric video flag set. -->
  <div class="relative px-4 py-4 sm:px-6 sm:py-6 lg:px-16 lg:py-8 w-full max-w-full box-border">
    <GlobalSearch />

    <button @click="emit('back')" class="inline-flex items-center gap-1.5 text-sm text-ditto-subtext hover:text-ditto-text transition-colors mb-4">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      My Videos
    </button>

    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
      <div>
        <h1 class="font-satoshi font-black text-xl sm:text-3xl lg:text-[42px] tracking-[-0.03em] text-ditto-text">
          <img src="/img/products/lyric-video.svg" alt="" class="h-8 sm:h-10 lg:h-12 w-auto inline-block align-middle mr-2 sm:mr-3 -mt-1" />Lyric Video Maker
        </h1>
        <p class="text-sm text-ditto-subtext mt-1.5 max-w-xl">Turn any track you've released into a lyric video in minutes. Pick a track, choose a look, and we'll time the lyrics to the audio.</p>
      </div>
      <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E6FF3A] text-[#0a0a0a] text-xs font-bold flex-shrink-0 self-start sm:self-auto">
        Included with video distribution
      </span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 lg:gap-8 items-start">
      <!-- Left: the three choices -->
      <div class="space-y-6">
        <!-- 1. Track -->
        <section class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div class="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#f6f3ff] to-transparent">
            <h2 class="font-satoshi font-black tracking-[-0.02em] text-base text-ditto-text flex items-center gap-2"><span class="step-num">1</span> Pick a track</h2>
            <span class="text-xs text-ditto-subtext">{{ tracks.length }} released tracks</span>
          </div>
          <div class="divide-y divide-gray-100 max-h-[320px] overflow-y-auto">
            <button
              v-for="t in tracks" :key="t.id"
              @click="trackId = t.id"
              :class="['w-full flex items-center gap-3 px-5 sm:px-6 py-3 text-left transition-colors', trackId === t.id ? 'bg-[#faf9ff]' : 'hover:bg-ditto-light-grey/60']"
            >
              <span :class="['w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0', trackId === t.id ? 'border-ditto-purple' : 'border-gray-300']">
                <span v-if="trackId === t.id" class="w-2 h-2 rounded-full bg-ditto-purple"></span>
              </span>
              <img :src="t.artwork" alt="" class="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-ditto-light-grey" />
              <span class="flex-1 min-w-0">
                <span class="block text-sm font-semibold text-ditto-text truncate">{{ t.title }}</span>
                <span class="block text-xs text-ditto-subtext truncate">{{ t.artist }} · {{ t.release }}</span>
              </span>
              <span v-if="t.hasLyrics" class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#e6fbf1] text-[#0f8a4f] flex-shrink-0">Lyrics on file</span>
              <span v-else class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-ditto-light-grey text-ditto-subtext flex-shrink-0">We'll transcribe</span>
            </button>
          </div>
        </section>

        <!-- 2. Look -->
        <section class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div class="px-5 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#f6f3ff] to-transparent">
            <h2 class="font-satoshi font-black tracking-[-0.02em] text-base text-ditto-text flex items-center gap-2"><span class="step-num">2</span> Choose a look</h2>
          </div>
          <div class="p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              v-for="s in styles" :key="s.id"
              @click="styleId = s.id"
              :class="['rounded-xl border-2 p-2 text-left transition-colors', styleId === s.id ? 'border-ditto-purple' : 'border-gray-200 hover:border-ditto-purple/50']"
            >
              <span class="block aspect-video rounded-lg mb-2 flex items-center justify-center text-[11px] font-bold tracking-wide" :style="s.preview">{{ s.sample }}</span>
              <span class="block text-xs font-semibold text-ditto-text">{{ s.name }}</span>
              <span class="block text-[11px] text-ditto-subtext">{{ s.blurb }}</span>
            </button>
          </div>
        </section>

        <!-- 3. Background -->
        <section class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div class="px-5 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#f6f3ff] to-transparent">
            <h2 class="font-satoshi font-black tracking-[-0.02em] text-base text-ditto-text flex items-center gap-2"><span class="step-num">3</span> Background</h2>
          </div>
          <div class="p-5 sm:p-6 flex flex-wrap gap-2">
            <button
              v-for="b in backgrounds" :key="b.id"
              @click="backgroundId = b.id"
              :class="['px-3.5 py-2 rounded-full border text-sm transition-colors', backgroundId === b.id ? 'border-ditto-purple bg-[#efe9ff] text-ditto-purple font-medium' : 'border-gray-200 text-ditto-text hover:border-ditto-purple/50']"
            >{{ b.label }}</button>
          </div>
        </section>
      </div>

      <!-- Right: summary + generate -->
      <aside class="bg-white rounded-2xl border border-gray-200 p-5 lg:sticky lg:top-6">
        <div class="aspect-video rounded-xl mb-4 flex items-center justify-center text-center p-4" :style="selectedStyle.preview">
          <span class="text-sm font-bold leading-snug">{{ selectedTrack ? `${selectedTrack.title}` : 'Pick a track to preview' }}</span>
        </div>
        <dl class="text-sm space-y-2 mb-5">
          <div class="flex justify-between gap-3"><dt class="text-ditto-subtext">Track</dt><dd class="font-medium text-ditto-text text-right truncate">{{ selectedTrack?.title ?? 'Not chosen' }}</dd></div>
          <div class="flex justify-between gap-3"><dt class="text-ditto-subtext">Look</dt><dd class="font-medium text-ditto-text">{{ selectedStyle.name }}</dd></div>
          <div class="flex justify-between gap-3"><dt class="text-ditto-subtext">Background</dt><dd class="font-medium text-ditto-text">{{ backgrounds.find(b => b.id === backgroundId)?.label }}</dd></div>
          <div class="flex justify-between gap-3"><dt class="text-ditto-subtext">Lyrics</dt><dd class="font-medium text-ditto-text">{{ selectedTrack ? (selectedTrack.hasLyrics ? 'From your release' : 'Transcribed from audio') : '–' }}</dd></div>
        </dl>
        <button
          @click="generate"
          :disabled="!selectedTrack"
          :class="['w-full px-5 py-3 text-sm font-medium rounded-full transition-all', selectedTrack ? 'bg-ditto-purple btn-pop-purple text-white hover:opacity-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed']"
        >Generate lyric video</button>
        <p class="text-[11px] text-ditto-subtext mt-3 text-center">Takes about two minutes. You'll review it before anything goes to stores.</p>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import GlobalSearch from '../../components/layout/GlobalSearch.vue'
import { releasesData } from '../../data/mockData'

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'generate', payload: { trackId: string; styleId: string; backgroundId: string }): void
}>()

// Flatten the catalogue to tracks; lyrics "on file" is demoed on a few
const tracks = computed(() => {
  const out: { id: string; title: string; artist: string; release: string; artwork: string; hasLyrics: boolean }[] = []
  releasesData.forEach((r, ri) => {
    const titles = (r as any).tracks as { title: string }[] | undefined
    const list = titles?.length ? titles.map(t => t.title) : [r.title]
    list.forEach((title, ti) => out.push({
      id: `${r.id ?? ri}-${ti}`, title, artist: r.artist, release: r.title, artwork: (r as any).artwork ?? (r as any).cover ?? '',
      hasLyrics: (ri + ti) % 3 !== 1,
    }))
  })
  return out.slice(0, 14)
})

const styles = [
  { id: 'bold', name: 'Bold', blurb: 'Big type, hard cuts', sample: 'Aa', preview: 'background:#0a0a0a;color:#e6ff3a' },
  { id: 'soft', name: 'Soft', blurb: 'Slow fades, serif', sample: 'Aa', preview: 'background:#f6f3ff;color:#5f1fff' },
  { id: 'kinetic', name: 'Kinetic', blurb: 'Word by word motion', sample: 'A a', preview: 'background:#5f1fff;color:#fff' },
  { id: 'minimal', name: 'Minimal', blurb: 'One line at a time', sample: 'Aa', preview: 'background:#fff;color:#0a0a0a;border:1px solid #e5e7eb' },
]
const backgrounds = [
  { id: 'artwork', label: 'Release artwork' },
  { id: 'colour', label: 'Solid colour' },
  { id: 'gradient', label: 'Brand gradient' },
  { id: 'upload', label: 'Upload a clip' },
]

const trackId = ref<string | null>(null)
const styleId = ref('bold')
const backgroundId = ref('artwork')

const selectedTrack = computed(() => tracks.value.find(t => t.id === trackId.value) ?? null)
const selectedStyle = computed(() => styles.find(s => s.id === styleId.value) ?? styles[0])

const generate = () => {
  if (!trackId.value) return
  emit('generate', { trackId: trackId.value, styleId: styleId.value, backgroundId: backgroundId.value })
}
</script>

<style scoped>
.step-num {
  display: inline-flex; align-items: center; justify-content: center;
  width: 1.125rem; height: 1.125rem; border-radius: 9999px;
  background: #efe9ff; color: var(--ditto-purple);
  font-size: 10px; font-weight: 700; line-height: 1;
}
.dark .step-num { background: #2a2340; }
</style>
