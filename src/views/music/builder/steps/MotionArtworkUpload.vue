<template>
  <!-- Optional Apple Music motion artwork. Lives on the Artwork step behind a
       toggle, beneath the still cover — no extra stage. Apple Music only. -->
  <div class="mt-14 max-w-4xl mx-auto border-t border-gray-200 pt-10">
    <div class="flex items-start justify-between gap-6">
      <div>
        <h2 class="font-satoshi font-black text-xl lg:text-2xl tracking-[-0.03em] text-ditto-text flex items-center flex-wrap gap-x-3 gap-y-1">
          <span>Add <span class="text-ditto-purple">motion artwork</span> for Apple Music?</span>
          <span class="inline-flex items-center text-[10px] font-bold uppercase tracking-[1.4px] text-ditto-subtext bg-ditto-light-grey rounded-full px-2 py-0.5 font-sans">Optional</span>
        </h2>
        <p class="text-sm text-ditto-subtext mt-2 max-w-xl leading-relaxed">
          A short looping version of your cover. Apple needs a square and a portrait file, and only Apple Music uses them — other stores keep the still artwork.
          <a href="https://help.apple.com/itc/albummotionguide/en.lproj/static.html" target="_blank" rel="noopener" class="text-ditto-purple hover:underline">Apple's motion artwork guide</a>
        </p>
      </div>
      <button
        type="button"
        @click="toggle"
        :class="['w-[51px] h-[31px] rounded-full relative transition-colors flex-shrink-0', ma.enabled ? 'bg-[#34c759]' : 'bg-[#e9e9eb]']"
        :aria-pressed="ma.enabled"
        aria-label="Add motion artwork"
      >
        <span :class="['absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform', ma.enabled ? 'translate-x-[20px]' : 'translate-x-0']"></span>
      </button>
    </div>

    <div v-if="ma.enabled" class="mt-6 grid lg:grid-cols-[minmax(0,1fr)_260px] gap-10 items-stretch">
      <!-- ── Left: Apple's two required deliverables, side by side ── -->
      <div class="flex flex-col">
        <div class="grid sm:grid-cols-2 gap-4 items-stretch flex-1">
          <MotionArtworkSlot ref="squareSlot" :slot="ma.square" ratio="square" @checked="failedBySlot.square = $event" />
          <MotionArtworkSlot ref="portraitSlot" :slot="ma.portrait" ratio="portrait" @checked="failedBySlot.portrait = $event" />
        </div>
        <!-- Apple needs both versions: one on its own can't be delivered -->
        <p v-if="missingOther" class="mt-4 text-xs text-[#92400e] bg-warning/15 rounded-lg px-3 py-2 inline-flex items-start gap-2">
          <svg class="w-3.5 h-3.5 text-warning flex-shrink-0 mt-px" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          <span>Add the <strong>{{ missingOther }}</strong> file too, or remove this one — Apple needs both.</span>
        </p>
        <p v-else-if="hasInvalid" class="mt-4 text-xs text-ditto-subtext">Replace or remove the invalid file to continue.</p>
      </div>

      <!-- ── Right: the specification ── -->
      <aside class="lg:border-l lg:border-gray-200 lg:pl-8 pt-1">
        <p class="text-xs font-semibold text-ditto-subtext uppercase tracking-wide mb-4">Apple's specification</p>
        <ul class="space-y-2.5">
          <li v-for="spec in specs" :key="spec.label" class="flex items-start gap-2.5 text-xs leading-snug">
            <svg class="w-3.5 h-3.5 flex-shrink-0 mt-px" :class="specState(spec.key) === 'fail' ? 'text-error' : specState(spec.key) === 'pass' ? 'text-[#00b368]' : 'text-ditto-subtext/50'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <template v-if="specState(spec.key) === 'fail'"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></template>
              <polyline v-else points="20 6 9 17 4 12"/>
            </svg>
            <span :class="specState(spec.key) === 'fail' ? 'text-error' : 'text-ditto-text'"><span class="font-medium">{{ spec.label }}</span> <span class="text-ditto-subtext">— {{ spec.value }}</span></span>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { ReleaseBuilderForm } from '../ReleaseBuilderView.vue'
import MotionArtworkSlot from './MotionArtworkSlot.vue'
import type { MotionSpecKey } from './motionArtworkSpec'

const props = defineProps<{ form: ReleaseBuilderForm }>()
const ma = computed(() => props.form.motionArtwork)

const specs: { key: MotionSpecKey; label: string; value: string }[] = [
  { key: 'format', label: 'File type', value: '.mov or .mp4' },
  { key: 'codec', label: 'Codec', value: 'Apple ProRes 422 / 4444, or H.264' },
  { key: 'resolution', label: 'Resolution', value: 'One 1:1 and one 3:4, sizes as shown' },
  { key: 'fps', label: 'Frame rate', value: '23.976, 24, 25, 29.97 or 30 fps' },
  { key: 'duration', label: 'Length', value: '8 to 35 seconds' },
  { key: 'audio', label: 'Audio', value: 'No audio track' },
  { key: 'colour', label: 'Colour profile', value: 'Rec. 709 or sRGB' },
  { key: 'pixels', label: 'Pixel aspect', value: '1:1 (square pixels)' },
  { key: 'bitrate', label: 'Bitrate', value: '45–100 Mbps (H.264 exports)' },
]

// Spec ticks reflect both files: a row fails if either file failed it, passes once both are valid
const failedBySlot = reactive<{ square: Set<MotionSpecKey>; portrait: Set<MotionSpecKey> }>({ square: new Set(), portrait: new Set() })
const hasInvalid = computed(() => ma.value.square.status === 'invalid' || ma.value.portrait.status === 'invalid')
const bothValid = computed(() => ma.value.square.status === 'valid' && ma.value.portrait.status === 'valid')
const specState = (key: MotionSpecKey): 'idle' | 'pass' | 'fail' => {
  if (failedBySlot.square.has(key) || failedBySlot.portrait.has(key)) return 'fail'
  if (bothValid.value || hasInvalid.value) return 'pass'
  return 'idle'
}

// Exactly one valid file and nothing in the other slot → name the missing one
const missingOther = computed(() => {
  const sq = ma.value.square.status, po = ma.value.portrait.status
  if (sq === 'valid' && po === '') return 'portrait'
  if (po === 'valid' && sq === '') return 'square'
  return ''
})

const squareSlot = ref<InstanceType<typeof MotionArtworkSlot> | null>(null)
const portraitSlot = ref<InstanceType<typeof MotionArtworkSlot> | null>(null)
const toggle = () => {
  props.form.motionArtwork.enabled = !props.form.motionArtwork.enabled
  if (!props.form.motionArtwork.enabled) {
    squareSlot.value?.removeFile()
    portraitSlot.value?.removeFile()
  }
}
</script>
