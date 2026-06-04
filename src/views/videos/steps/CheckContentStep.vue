<template>
  <div>
    <h2 class="font-satoshi font-black tracking-[-0.03em] text-xl lg:text-2xl text-ditto-text mb-2">Check your content</h2>
    <p class="text-sm text-ditto-subtext mb-6">
      Confirm your video and thumbnail meet our content requirements, then tell us how the video was made.
    </p>

    <!-- Video Content -->
    <div class="flex items-center gap-2 mb-3">
      <svg class="w-4 h-4 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="2" y="4" width="20" height="16" rx="2"/><polygon points="10,8 16,12 10,16"/>
      </svg>
      <h3 class="text-xs font-semibold text-ditto-subtext uppercase tracking-wide">Video Content</h3>
    </div>
    <label
      class="block p-4 rounded-xl border transition-colors cursor-pointer mb-3"
      :class="checks.video ? 'bg-ditto-purple/5 border-ditto-purple/20' : 'border-gray-200 hover:border-ditto-purple/30'"
    >
      <ul class="space-y-1.5 mb-4">
        <li v-for="req in videoRequirements" :key="req" class="flex items-start gap-2 text-xs text-ditto-subtext">
          <svg class="w-3.5 h-3.5 text-ditto-subtext/70 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ req }}
        </li>
      </ul>
      <div class="flex items-start gap-3 pt-3 border-t border-gray-100">
        <input type="checkbox" :checked="checks.video" @change="toggleCheck('video')" class="hidden" />
        <div :class="[
          'w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5',
          checks.video ? 'bg-ditto-purple border-ditto-purple' : 'border-gray-300 bg-white'
        ]">
          <svg v-if="checks.video" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg>
        </div>
        <p class="text-sm font-medium text-ditto-text">I confirm my video meets all of the above requirements</p>
      </div>
    </label>

    <!-- No Lyrics (lyric videos only) -->
    <label
      v-if="isLyricVideo"
      class="flex items-start gap-3 p-4 rounded-xl border transition-colors cursor-pointer mb-8"
      :class="checks.noLyrics ? 'bg-ditto-purple/5 border-ditto-purple/20' : 'border-gray-200 hover:border-ditto-purple/30'"
    >
      <input type="checkbox" :checked="checks.noLyrics" @change="toggleCheck('noLyrics')" class="hidden" />
      <div :class="[
        'w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5',
        checks.noLyrics ? 'bg-ditto-purple border-ditto-purple' : 'border-gray-300 bg-white'
      ]">
        <svg v-if="checks.noLyrics" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg>
      </div>
      <div>
        <p class="text-sm font-medium text-ditto-text">No lyrics</p>
        <p class="text-xs text-ditto-subtext mt-0.5">Video contains NO lyrics overlaid on the visuals.</p>
      </div>
    </label>
    <div v-else class="mb-8"></div>

    <!-- Thumbnail Content -->
    <div class="flex items-center gap-2 mb-3">
      <svg class="w-4 h-4 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/>
      </svg>
      <h3 class="text-xs font-semibold text-ditto-subtext uppercase tracking-wide">Thumbnail Content</h3>
    </div>
    <label
      class="block p-4 rounded-xl border transition-colors cursor-pointer"
      :class="checks.thumbnail ? 'bg-ditto-purple/5 border-ditto-purple/20' : 'border-gray-200 hover:border-ditto-purple/30'"
    >
      <ul class="space-y-1.5 mb-4">
        <li v-for="req in thumbnailRequirements" :key="req" class="flex items-start gap-2 text-xs text-ditto-subtext">
          <svg class="w-3.5 h-3.5 text-ditto-subtext/70 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ req }}
        </li>
      </ul>
      <div class="flex items-start gap-3 pt-3 border-t border-gray-100">
        <input type="checkbox" :checked="checks.thumbnail" @change="toggleCheck('thumbnail')" class="hidden" />
        <div :class="[
          'w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5',
          checks.thumbnail ? 'bg-ditto-purple border-ditto-purple' : 'border-gray-300 bg-white'
        ]">
          <svg v-if="checks.thumbnail" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg>
        </div>
        <p class="text-sm font-medium text-ditto-text">I confirm my thumbnail meets all of the above requirements</p>
      </div>
    </label>

    <!-- Video Asset Source Type -->
    <div class="mt-8 border-t border-gray-200 pt-6">
      <div class="flex items-center gap-2 mb-1.5">
        <svg class="w-4 h-4 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9 12h6M9 16h6M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9l-7-7z"/><path d="M13 2v7h7"/>
        </svg>
        <h3 class="text-xs font-semibold text-ditto-subtext uppercase tracking-wide">Video Source</h3>
        <span class="text-error text-xs">*</span>
      </div>
      <p class="text-sm text-ditto-subtext mb-4">Let us know how your video was made.</p>

      <div class="space-y-2">
        <!-- Original -->
        <label :class="[
          'flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all',
          assetSource.type === 'original' ? 'border-ditto-purple bg-ditto-purple/5' : 'border-gray-200 hover:border-gray-300'
        ]">
          <input type="radio" name="assetSource" value="original" :checked="assetSource.type === 'original'" @change="updateSource('type', 'original')" class="mt-0.5 accent-ditto-purple" />
          <div>
            <p class="text-sm font-medium text-ditto-text">Original Content</p>
            <p class="text-xs text-ditto-subtext mt-0.5">I created this video myself or with my team. I own all rights to the footage.</p>
          </div>
        </label>
        <!-- Original confirmation -->
        <div v-if="assetSource.type === 'original'" class="ml-7 pl-4 border-l-2 border-ditto-purple/20 pb-2">
          <label class="flex items-start gap-3 p-3 rounded-lg bg-ditto-light-grey/60 cursor-pointer">
            <input type="checkbox" :checked="assetSource.ownershipConfirmed" @change="updateSource('ownershipConfirmed', !assetSource.ownershipConfirmed)" class="mt-0.5 accent-ditto-purple" />
            <div>
              <p class="text-sm text-ditto-text">I confirm I own all necessary rights</p>
              <p class="text-xs text-ditto-subtext mt-0.5">This includes the rights to the music, the lyrics, and all video footage.</p>
            </div>
          </label>
        </div>

        <!-- Licensed -->
        <label :class="[
          'flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all',
          assetSource.type === 'licensed' ? 'border-ditto-purple bg-ditto-purple/5' : 'border-gray-200 hover:border-gray-300'
        ]">
          <input type="radio" name="assetSource" value="licensed" :checked="assetSource.type === 'licensed'" @change="updateSource('type', 'licensed')" class="mt-0.5 accent-ditto-purple" />
          <div class="flex-1">
            <p class="text-sm font-medium text-ditto-text">Licensed Content</p>
            <p class="text-xs text-ditto-subtext mt-0.5">I have a license or rights agreement to use this video content.</p>
          </div>
        </label>
        <!-- Licensed fields -->
        <div v-if="assetSource.type === 'licensed'" class="ml-7 pl-4 border-l-2 border-ditto-purple/20 space-y-3 pb-2">
          <div>
            <label class="block text-xs font-medium text-ditto-subtext mb-1">Who licensed it to you?</label>
            <input
              :value="assetSource.licenseHolder"
              @input="updateSource('licenseHolder', ($event.target as HTMLInputElement).value)"
              type="text"
              placeholder="Name of the licensor or rights holder"
              class="w-full px-0 py-2 border-0 border-b border-gray-300 text-sm text-ditto-text bg-transparent focus:outline-none focus:border-ditto-purple transition-colors"
            />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-ditto-subtext mb-1">License Type</label>
              <select
                :value="assetSource.licenseType"
                @change="updateSource('licenseType', ($event.target as HTMLSelectElement).value)"
                class="w-full px-0 py-2 border-0 border-b border-gray-300 text-sm text-ditto-text bg-transparent focus:outline-none focus:border-ditto-purple transition-colors"
              >
                <option value="" disabled>Select type</option>
                <option value="exclusive">Exclusive</option>
                <option value="non-exclusive">Non-exclusive</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-ditto-subtext mb-1">Valid Until <span class="text-ditto-subtext/60">(optional)</span></label>
              <input
                :value="assetSource.licenseValidUntil"
                @input="updateSource('licenseValidUntil', ($event.target as HTMLInputElement).value)"
                type="date"
                class="w-full px-0 py-2 border-0 border-b border-gray-300 text-sm text-ditto-text bg-transparent focus:outline-none focus:border-ditto-purple transition-colors"
              />
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-ditto-subtext mb-1">Where does the license apply?</label>
            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="licenseTerritory" value="global" :checked="assetSource.licenseTerritory === 'global'" @change="updateSource('licenseTerritory', 'global')" class="accent-ditto-purple" />
                <span class="text-sm text-ditto-text">Global / Worldwide</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="licenseTerritory" value="selected" :checked="assetSource.licenseTerritory === 'selected'" @change="updateSource('licenseTerritory', 'selected')" class="accent-ditto-purple" />
                <span class="text-sm text-ditto-text">Selected territories</span>
              </label>
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-ditto-subtext mb-1">Reference number <span class="text-ditto-subtext/60">(optional)</span></label>
            <input
              :value="assetSource.licenseReference"
              @input="updateSource('licenseReference', ($event.target as HTMLInputElement).value)"
              type="text"
              placeholder="License number or agreement reference"
              class="w-full px-0 py-2 border-0 border-b border-gray-300 text-sm text-ditto-text bg-transparent focus:outline-none focus:border-ditto-purple transition-colors"
            />
          </div>
          <label class="flex items-start gap-3 p-3 rounded-lg bg-ditto-light-grey/60 cursor-pointer">
            <input type="checkbox" :checked="assetSource.licenseConfirmed" @change="updateSource('licenseConfirmed', !assetSource.licenseConfirmed)" class="mt-0.5 accent-ditto-purple" />
            <div>
              <p class="text-sm text-ditto-text">I confirm I hold a valid license for this content</p>
              <p class="text-xs text-ditto-subtext mt-0.5">You may be asked to provide proof of your license agreement.</p>
            </div>
          </label>
        </div>

        <!-- Previously Distributed -->
        <label :class="[
          'flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all',
          assetSource.type === 'previously-distributed' ? 'border-ditto-purple bg-ditto-purple/5' : 'border-gray-200 hover:border-gray-300'
        ]">
          <input type="radio" name="assetSource" value="previously-distributed" :checked="assetSource.type === 'previously-distributed'" @change="updateSource('type', 'previously-distributed')" class="mt-0.5 accent-ditto-purple" />
          <div>
            <p class="text-sm font-medium text-ditto-text">Previously Distributed</p>
            <p class="text-xs text-ditto-subtext mt-0.5">This video was previously distributed through another service or platform.</p>
          </div>
        </label>
        <!-- Previously Distributed fields -->
        <div v-if="assetSource.type === 'previously-distributed'" class="ml-7 pl-4 border-l-2 border-ditto-purple/20 space-y-3 pb-2">
          <div>
            <label class="block text-xs font-medium text-ditto-subtext mb-1">Previous Distributor</label>
            <input
              :value="assetSource.previousDistributor"
              @input="updateSource('previousDistributor', ($event.target as HTMLInputElement).value)"
              type="text"
              placeholder="e.g. DistroKid, TuneCore, CD Baby"
              class="w-full px-0 py-2 border-0 border-b border-gray-300 text-sm text-ditto-text bg-transparent focus:outline-none focus:border-ditto-purple transition-colors"
            />
          </div>
          <label class="flex items-start gap-3 p-3 rounded-lg bg-warning/5 border border-warning/10 cursor-pointer">
            <input type="checkbox" :checked="assetSource.takedownConfirmed" @change="updateSource('takedownConfirmed', !assetSource.takedownConfirmed)" class="mt-0.5 accent-ditto-purple" />
            <div>
              <p class="text-sm text-ditto-text">I confirm the previous release has been taken down</p>
              <p class="text-xs text-ditto-subtext mt-0.5">You must remove the video from your previous distributor before re-distributing through Ditto.</p>
            </div>
          </label>
        </div>

        <!-- Commissioned -->
        <label :class="[
          'flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all',
          assetSource.type === 'commissioned' ? 'border-ditto-purple bg-ditto-purple/5' : 'border-gray-200 hover:border-gray-300'
        ]">
          <input type="radio" name="assetSource" value="commissioned" :checked="assetSource.type === 'commissioned'" @change="updateSource('type', 'commissioned')" class="mt-0.5 accent-ditto-purple" />
          <div>
            <p class="text-sm font-medium text-ditto-text">Commissioned Content</p>
            <p class="text-xs text-ditto-subtext mt-0.5">This video was commissioned from a third-party production company or freelancer.</p>
          </div>
        </label>
        <!-- Commissioned fields -->
        <div v-if="assetSource.type === 'commissioned'" class="ml-7 pl-4 border-l-2 border-ditto-purple/20 space-y-3 pb-2">
          <div>
            <label class="block text-xs font-medium text-ditto-subtext mb-1">Who made the video?</label>
            <input
              :value="assetSource.commissionedBy"
              @input="updateSource('commissionedBy', ($event.target as HTMLInputElement).value)"
              type="text"
              placeholder="Production company or creator name"
              class="w-full px-0 py-2 border-0 border-b border-gray-300 text-sm text-ditto-text bg-transparent focus:outline-none focus:border-ditto-purple transition-colors"
            />
          </div>
          <label class="flex items-start gap-3 p-3 rounded-lg bg-ditto-light-grey/60 cursor-pointer">
            <input type="checkbox" :checked="assetSource.commissionAgreement" @change="updateSource('commissionAgreement', !assetSource.commissionAgreement)" class="mt-0.5 accent-ditto-purple" />
            <div>
              <p class="text-sm text-ditto-text">I have an agreement giving me the right to distribute this video</p>
              <p class="text-xs text-ditto-subtext mt-0.5">You may be asked to provide a copy of this agreement.</p>
            </div>
          </label>
        </div>
      </div>

      <!-- Source not selected warning -->
      <div v-if="!assetSource.type" class="mt-3 p-3 rounded-xl bg-warning/10 border border-warning/20 flex items-center gap-2">
        <svg class="w-4 h-4 text-warning flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <p class="text-xs text-warning">Please select a video source to continue.</p>
      </div>
    </div>

    <!-- Status -->
    <div v-if="allConfirmed && assetSource.type" class="mt-6 p-4 rounded-xl bg-success/10 border border-success/20 flex items-center gap-3">
      <svg class="w-5 h-5 text-success flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="22,4 12,14.01 9,11.01" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p class="text-sm font-medium text-success">All content requirements confirmed. You may proceed.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type CheckKeys = 'video' | 'thumbnail' | 'noLyrics'

interface AssetSource {
  type: '' | 'original' | 'licensed' | 'previously-distributed' | 'commissioned'
  ownershipConfirmed: boolean
  licenseHolder: string
  licenseType: '' | 'exclusive' | 'non-exclusive'
  licenseValidUntil: string
  licenseTerritory: 'global' | 'selected'
  licenseReference: string
  licenseConfirmed: boolean
  previousDistributor: string
  takedownConfirmed: boolean
  commissionedBy: string
  commissionAgreement: boolean
}

const props = defineProps<{
  checks: Record<CheckKeys, boolean>
  assetSource: AssetSource
  isLyricVideo: boolean
}>()

const emit = defineEmits<{
  (e: 'update:checks', checks: Record<CheckKeys, boolean>): void
  (e: 'update:assetSource', source: AssetSource): void
}>()

const videoRequirements = [
  'Original content — no stock footage, watermarks, or editing-software logos',
  'No social handles, website URLs, QR codes, advertising, or time-sensitive info',
  'Not made up of still images or promotional material',
  'The complete song — no partial versions, and one song per video (no medleys)',
]

const thumbnailRequirements = [
  'Original artwork — no copyrighted photos or third-party imagery',
  'No clickbait titles or large blocks of overlaid text',
  'High resolution (min. 1920×1080) with appropriate imagery',
]

const allConfirmed = computed(() =>
  props.checks.video &&
  props.checks.thumbnail &&
  (!props.isLyricVideo || props.checks.noLyrics)
)

const toggleCheck = (key: CheckKeys) => {
  emit('update:checks', { ...props.checks, [key]: !props.checks[key] })
}

const updateSource = (key: keyof AssetSource, value: any) => {
  emit('update:assetSource', { ...props.assetSource, [key]: value })
}
</script>
