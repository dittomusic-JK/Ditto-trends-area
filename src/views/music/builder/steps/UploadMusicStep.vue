<template>
  <div>
    <!-- ── Upload your music ── -->
    <div class="text-center max-w-2xl mx-auto">
      <h1 class="font-satoshi font-black text-2xl lg:text-[32px] tracking-[-0.03em] text-ditto-text mb-4">Upload Your Music</h1>
      <p class="text-sm text-ditto-subtext leading-relaxed">
        Make sure you have high quality audio files available. For the best streaming and download
        quality, we recommend 16-bit, 44.1 kHz stereo .wav, .mp3 or .flac files.
      </p>
    </div>

    <!-- Dropzone (only while empty) -->
    <div v-if="form.tracks.length === 0" class="mt-12 max-w-lg mx-auto">
      <button
        @click="addTrack"
        class="w-full aspect-[4/3] border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-5 hover:border-ditto-purple hover:bg-ditto-purple/[0.03] transition-colors group"
      >
        <svg class="w-20 h-20 text-gray-300 group-hover:text-ditto-purple/40 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="10" cy="15.5" r="1.75"/><path d="M11.75 15.5V10l3-1"/>
        </svg>
        <span class="text-center">
          <span class="block font-satoshi font-black text-xl text-ditto-text tracking-[-0.02em]">Drag &amp; Drop Files</span>
          <span class="block text-sm text-ditto-subtext mt-1.5">Drop any audio files, or <span class="underline text-ditto-text">browse your files</span></span>
        </span>
      </button>
    </div>

    <!-- Track rows (drag to rearrange) -->
    <div v-else class="mt-12 max-w-4xl mx-auto space-y-3">
      <div
        v-for="(track, i) in form.tracks"
        :key="track.id"
        draggable="true"
        @dragstart="onDragStart(i, $event)"
        @dragover.prevent="onDragOver(i)"
        @drop.prevent="onDrop(i)"
        @dragend="onDragEnd"
        :class="[
          'flex items-center gap-5 px-5 py-4 border rounded-2xl bg-white transition-all',
          dragIndex === i ? 'opacity-40 border-ditto-purple/50' :
          dropIndex === i && dragIndex !== null ? 'border-ditto-purple border-dashed' : 'border-gray-200'
        ]"
      >
        <svg class="w-4 h-4 text-gray-300 flex-shrink-0 cursor-grab active:cursor-grabbing" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/></svg>
        <span class="text-sm text-ditto-subtext w-4 text-center flex-shrink-0">{{ i + 1 }}</span>
        <button class="w-9 h-9 rounded-full bg-ditto-light-grey flex items-center justify-center flex-shrink-0 hover:bg-ditto-purple/10 transition-colors">
          <svg class="w-3.5 h-3.5 text-ditto-purple ml-0.5" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21"/></svg>
        </button>
        <div class="min-w-0 flex-1">
          <input
            v-model="track.title"
            class="w-full text-sm font-semibold text-ditto-text bg-transparent border-0 outline-none focus:ring-0 p-0"
            placeholder="Track title"
          />
          <p class="text-xs text-ditto-subtext mt-0.5">{{ track.duration }}</p>
        </div>
        <button
          @click="openLicense(track)"
          :class="[
            'flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-full border transition-colors flex-shrink-0',
            track.hasLicense
              ? 'border-[#00e785]/40 text-[#006633] bg-[#00e785]/10'
              : 'border-gray-200 text-ditto-text hover:border-ditto-purple hover:text-ditto-purple'
          ]"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          {{ track.hasLicense ? 'License added' : 'Upload a license' }}
        </button>
        <button @click="removeTrack(track.id)" class="w-9 h-9 flex items-center justify-center text-error/70 hover:text-error transition-colors flex-shrink-0" aria-label="Remove track">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
      </div>

      <div class="pt-4">
        <button @click="addTrack" class="flex items-center gap-2.5 px-1 text-sm font-semibold text-ditto-text hover:text-ditto-purple transition-colors group">
          <span class="w-8 h-8 rounded-full bg-ditto-text group-hover:bg-ditto-purple flex items-center justify-center transition-colors">
            <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </span>
          <span class="underline underline-offset-2">Add more tracks</span>
        </button>
      </div>
    </div>

    <!-- ── Add a License modal ── -->
    <Teleport to="body">
      <div v-if="licenseModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" @click.self="licenseModal = null">
        <div class="bg-white rounded-2xl max-w-md w-full p-8 relative text-center">
          <button @click="licenseModal = null" class="absolute top-5 right-5 text-ditto-subtext hover:text-ditto-text transition-colors" aria-label="Close">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <svg class="w-12 h-12 mx-auto mb-4 text-ditto-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <h3 class="font-satoshi font-black text-2xl tracking-[-0.03em] text-ditto-text mb-4">Add a License</h3>
          <p class="text-sm text-ditto-subtext leading-relaxed mb-3">
            If your release contains any copyrighted material such as samples,
            please upload the documentation proving you own the copyright to the audio.
          </p>
          <p class="text-sm text-ditto-subtext leading-relaxed mb-7">
            Without the required licensing documentation, music containing
            copyrighted material may be rejected by stores.
          </p>
          <button
            @click="confirmLicense"
            class="px-8 py-2.5 bg-ditto-text btn-pop-dark text-white text-sm font-semibold rounded-full hover:opacity-95 transition-opacity"
          >I Understand</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { makeBuilderTrack } from '../../../../data/releaseBuilderMockData'
import type { BuilderTrack } from '../../../../data/releaseBuilderMockData'
import type { ReleaseBuilderForm } from '../ReleaseBuilderView.vue'

const props = defineProps<{ form: ReleaseBuilderForm }>()

// Simulated uploads — this is a prototype, so "browsing" instantly lands a file.
const mockTitles = ['Midnight Run', 'Golden Hour', 'City Lights', 'Waves']
const mockDurations: Array<[string, number]> = [['03:47', 227], ['02:58', 178], ['04:12', 252], ['03:21', 201]]
const mockFiles = ['midnight-run-master.wav', 'golden-hour-master.wav', 'city-lights-master.wav', 'waves-master.wav']

let seq = 0
const licenseShownOnce = ref(false)
const licenseModal = ref<BuilderTrack | null>(null)

const addTrack = () => {
  const i = props.form.tracks.length % mockTitles.length
  const [duration, durationSec] = mockDurations[i]
  const track = makeBuilderTrack(
    'trk-' + (++seq) + '-' + props.form.tracks.length,
    mockTitles[i],
    duration,
    durationSec,
    mockFiles[i],
  )
  props.form.tracks.push(track)
  if (!props.form.title) props.form.title = track.title
  // The licensing reminder appears the first time audio lands
  if (!licenseShownOnce.value) {
    licenseShownOnce.value = true
    licenseModal.value = track
  }
}

const removeTrack = (id: string) => {
  const idx = props.form.tracks.findIndex(t => t.id === id)
  if (idx >= 0) props.form.tracks.splice(idx, 1)
}

const openLicense = (track: BuilderTrack) => {
  licenseModal.value = track
}

const confirmLicense = () => {
  if (licenseModal.value) {
    licenseModal.value.hasLicense = true
    licenseModal.value.licenseFile = 'license-agreement.pdf'
  }
  licenseModal.value = null
}

// ── Drag to rearrange ──
const dragIndex = ref<number | null>(null)
const dropIndex = ref<number | null>(null)

const onDragStart = (i: number, e: DragEvent) => {
  dragIndex.value = i
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(i))
  }
}

const onDragOver = (i: number) => {
  dropIndex.value = i
}

const onDrop = (i: number) => {
  if (dragIndex.value === null || dragIndex.value === i) return
  const moved = props.form.tracks.splice(dragIndex.value, 1)[0]
  props.form.tracks.splice(i, 0, moved)
  onDragEnd()
}

const onDragEnd = () => {
  dragIndex.value = null
  dropIndex.value = null
}
</script>
