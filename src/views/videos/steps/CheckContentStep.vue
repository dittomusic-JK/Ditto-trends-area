<template>
  <!-- Lives inside the Upload step: section="video" | "thumbnail" | "artwork"
       renders that asset's requirement confirmation (placed beside its upload);
       section="source" renders the video-source declaration (full width beneath). -->
  <div>
    <!-- One asset's check card: sits beside that asset's upload on the Upload step -->
    <template v-if="section === 'video'">
    <!-- Video Content -->
    <div class="flex items-center gap-2 mb-3">
      <svg class="w-4 h-4 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="2" y="4" width="20" height="16" rx="2"/><polygon points="10,8 16,12 10,16"/>
      </svg>
      <h3 class="text-xs font-semibold text-ditto-subtext uppercase tracking-wide">Video Content</h3>
    </div>
    <label
      class="block p-5 rounded-xl border transition-colors cursor-pointer"
      :class="checks.video ? 'bg-ditto-purple/5 border-ditto-purple/20' : 'border-gray-200 hover:border-ditto-purple/30'"
    >
      <ul class="space-y-2 mb-4">
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
      class="flex items-start gap-3 p-5 rounded-xl border transition-colors cursor-pointer mt-4"
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
    </template>

    <template v-else-if="section === 'thumbnail'">
    <!-- Thumbnail Content -->
    <div class="flex items-center gap-2 mb-3">
      <svg class="w-4 h-4 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/>
      </svg>
      <h3 class="text-xs font-semibold text-ditto-subtext uppercase tracking-wide">Thumbnail Content</h3>
    </div>
    <label
      class="block p-5 rounded-xl border transition-colors cursor-pointer"
      :class="checks.thumbnail ? 'bg-ditto-purple/5 border-ditto-purple/20' : 'border-gray-200 hover:border-ditto-purple/30'"
    >
      <ul class="space-y-2 mb-4">
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
    </template>

    <template v-else-if="section === 'artwork'">
    <!-- Album Artwork -->
    <div class="flex items-center gap-2 mb-3">
      <svg class="w-4 h-4 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/>
      </svg>
      <h3 class="text-xs font-semibold text-ditto-subtext uppercase tracking-wide">Album Artwork</h3>
    </div>
    <label
      class="block p-5 rounded-xl border transition-colors cursor-pointer"
      :class="checks.artwork ? 'bg-ditto-purple/5 border-ditto-purple/20' : 'border-gray-200 hover:border-ditto-purple/30'"
    >
      <ul class="space-y-2 mb-4">
        <li v-for="req in artworkRequirements" :key="req" class="flex items-start gap-2 text-xs text-ditto-subtext">
          <svg class="w-3.5 h-3.5 text-ditto-subtext/70 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ req }}
        </li>
      </ul>
      <div class="flex items-start gap-3 pt-3 border-t border-gray-100">
        <input type="checkbox" :checked="checks.artwork" @change="toggleCheck('artwork')" class="hidden" />
        <div :class="[
          'w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5',
          checks.artwork ? 'bg-ditto-purple border-ditto-purple' : 'border-gray-300 bg-white'
        ]">
          <svg v-if="checks.artwork" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg>
        </div>
        <p class="text-sm font-medium text-ditto-text">I confirm my artwork meets all of the above requirements</p>
      </div>
    </label>
    </template>

    <!-- Video Asset Source Type -->
    <div v-else>
      <h2 class="font-satoshi font-black tracking-[-0.03em] text-xl lg:text-2xl text-ditto-text mb-1">Video source <span class="text-error text-base align-top">*</span></h2>
      <p class="text-sm text-ditto-subtext mb-5">Let us know how your video was made. This covers everything on screen — footage, stock clips, overlays, graphics, fonts, logos and any third-party material — as well as the music.</p>

      <div class="space-y-2">
        <!-- Original -->
        <label :class="[
          'flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all',
          assetSource.type === 'original' ? 'border-ditto-purple bg-ditto-purple/5' : 'border-gray-200 hover:border-gray-300'
        ]">
          <input type="radio" name="assetSource" value="original" :checked="assetSource.type === 'original'" @change="updateSource('type', 'original')" class="mt-0.5 accent-ditto-purple" />
          <div>
            <p class="text-sm font-medium text-ditto-text">Original Content</p>
            <p class="text-xs text-ditto-subtext mt-0.5">I created this video myself or with my team, and nothing in it comes from a stock library, another creator, or a third-party brand.</p>
          </div>
        </label>
        <!-- Original confirmation -->
        <div v-if="assetSource.type === 'original'" class="ml-7 pl-4 border-l-2 border-ditto-purple/20 pt-3 pb-2">
          <label class="flex items-start gap-3 p-3 rounded-lg bg-ditto-light-grey/60 cursor-pointer">
            <input type="checkbox" :checked="assetSource.ownershipConfirmed" @change="updateSource('ownershipConfirmed', !assetSource.ownershipConfirmed)" class="hidden" />
            <div :class="['w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5', assetSource.ownershipConfirmed ? 'bg-ditto-purple border-ditto-purple' : 'border-gray-300 bg-white']">
              <svg v-if="assetSource.ownershipConfirmed" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg>
            </div>
            <div>
              <p class="text-sm text-ditto-text">I confirm I own all necessary rights</p>
              <p class="text-xs text-ditto-subtext mt-0.5">This includes the music and lyrics, all footage, and any overlays, graphics, fonts, logos or effects used in the edit.</p>
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
            <p class="text-xs text-ditto-subtext mt-0.5">Some or all of the video uses licensed material — stock footage or clips, overlays, templates, graphics, fonts, or footage shot by someone else — under a licence or rights agreement.</p>
          </div>
        </label>
        <!-- Licensed fields -->
        <div v-if="assetSource.type === 'licensed'" class="ml-7 pl-4 border-l-2 border-ditto-purple/20 space-y-4 pt-3 pb-2">
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
          <div class="sm:max-w-xs">
            <label class="block text-xs font-medium text-ditto-subtext mb-1">Valid Until <span class="text-ditto-subtext/60">(optional)</span></label>
            <input
              :value="assetSource.licenseValidUntil"
              @input="updateSource('licenseValidUntil', ($event.target as HTMLInputElement).value)"
              type="date"
              class="w-full px-0 py-2 border-0 border-b border-gray-300 text-sm text-ditto-text bg-transparent focus:outline-none focus:border-ditto-purple transition-colors"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-ditto-subtext mb-1">Where does the license apply?</label>
            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="licenseTerritory" value="global" :checked="assetSource.licenseTerritory === 'global'" @change="updateSource('licenseTerritory', 'global')" class="hidden" />
                <div :class="['w-5 h-5 rounded-full flex items-center justify-center transition-colors flex-shrink-0', assetSource.licenseTerritory === 'global' ? 'bg-ditto-purple' : 'border-2 border-gray-300']">
                  <svg v-if="assetSource.licenseTerritory === 'global'" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <span class="text-sm text-ditto-text">Global / Worldwide</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="licenseTerritory" value="selected" :checked="assetSource.licenseTerritory === 'selected'" @change="updateSource('licenseTerritory', 'selected')" class="hidden" />
                <div :class="['w-5 h-5 rounded-full flex items-center justify-center transition-colors flex-shrink-0', assetSource.licenseTerritory === 'selected' ? 'bg-ditto-purple' : 'border-2 border-gray-300']">
                  <svg v-if="assetSource.licenseTerritory === 'selected'" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <span class="text-sm text-ditto-text">Selected territories</span>
              </label>
            </div>
          </div>
          <!-- Licence document (mirrors the music builder's licence upload) -->
          <div>
            <label class="block text-xs font-medium text-ditto-subtext mb-1.5">Licence document</label>
            <div v-if="assetSource.licenseDocument" class="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200">
              <div class="w-9 h-9 rounded-lg bg-ditto-purple/10 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-ditto-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-ditto-text truncate">{{ assetSource.licenseDocument.name }}</p>
                <p class="text-xs text-ditto-subtext">{{ formatFileSize(assetSource.licenseDocument.size) }} · Licence added</p>
              </div>
              <button @click="updateSource('licenseDocument', null)" class="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors flex-shrink-0" aria-label="Remove licence document">
                <svg class="w-4 h-4 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div
              v-else
              @dragover.prevent="isDraggingLicence = true"
              @dragleave="isDraggingLicence = false"
              @drop.prevent="handleLicenceDrop"
              :class="[
                'rounded-xl border-2 border-dashed px-4 py-5 text-center transition-colors',
                isDraggingLicence ? 'border-ditto-purple bg-ditto-purple/5' : 'border-gray-300 bg-white hover:border-ditto-purple/50'
              ]"
            >
              <svg class="w-6 h-6 mx-auto mb-2 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <p class="text-sm text-ditto-text">
                Drag and drop your licence agreement or
                <button @click="licenceInputRef?.click()" class="text-ditto-purple font-medium hover:underline">browse your files</button>
              </p>
              <p class="text-xs text-ditto-subtext mt-1">PDF, JPG or PNG &middot; max 10 MB</p>
              <p v-if="licenceError" class="text-xs text-error mt-2">{{ licenceError }}</p>
              <input ref="licenceInputRef" type="file" accept=".pdf,.jpg,.jpeg,.png" class="hidden" @change="handleLicenceSelect" />
            </div>
          </div>
          <label class="flex items-start gap-3 p-3 rounded-lg bg-ditto-light-grey/60 cursor-pointer">
            <input type="checkbox" :checked="assetSource.licenseConfirmed" @change="updateSource('licenseConfirmed', !assetSource.licenseConfirmed)" class="hidden" />
            <div :class="['w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5', assetSource.licenseConfirmed ? 'bg-ditto-purple border-ditto-purple' : 'border-gray-300 bg-white']">
              <svg v-if="assetSource.licenseConfirmed" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg>
            </div>
            <div>
              <p class="text-sm text-ditto-text">I confirm I hold a valid license for this content</p>
              <p class="text-xs text-ditto-subtext mt-0.5">Without the licence document, stores may reject a video that uses licensed material.</p>
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
        <div v-if="assetSource.type === 'previously-distributed'" class="ml-7 pl-4 border-l-2 border-ditto-purple/20 space-y-3 pt-3 pb-2">
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
            <input type="checkbox" :checked="assetSource.takedownConfirmed" @change="updateSource('takedownConfirmed', !assetSource.takedownConfirmed)" class="hidden" />
            <div :class="['w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5', assetSource.takedownConfirmed ? 'bg-ditto-purple border-ditto-purple' : 'border-gray-300 bg-white']">
              <svg v-if="assetSource.takedownConfirmed" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg>
            </div>
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
        <div v-if="assetSource.type === 'commissioned'" class="ml-7 pl-4 border-l-2 border-ditto-purple/20 space-y-3 pt-3 pb-2">
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
            <input type="checkbox" :checked="assetSource.commissionAgreement" @change="updateSource('commissionAgreement', !assetSource.commissionAgreement)" class="hidden" />
            <div :class="['w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5', assetSource.commissionAgreement ? 'bg-ditto-purple border-ditto-purple' : 'border-gray-300 bg-white']">
              <svg v-if="assetSource.commissionAgreement" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg>
            </div>
            <div>
              <p class="text-sm text-ditto-text">I have an agreement giving me the right to distribute this video</p>
              <p class="text-xs text-ditto-subtext mt-0.5">You may be asked to provide a copy of this agreement.</p>
            </div>
          </label>
        </div>
      </div>

      <!-- Source not selected: only once the user has moved on without choosing -->
      <p v-if="visited && !assetSource.type" class="text-xs text-error mt-3">Please select a video source.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type CheckKeys = 'video' | 'thumbnail' | 'artwork' | 'noLyrics'

interface AssetSource {
  type: '' | 'original' | 'licensed' | 'previously-distributed' | 'commissioned'
  ownershipConfirmed: boolean
  licenseHolder: string
  licenseValidUntil: string
  licenseTerritory: 'global' | 'selected'
  licenseDocument: File | null
  licenseConfirmed: boolean
  previousDistributor: string
  takedownConfirmed: boolean
  commissionedBy: string
  commissionAgreement: boolean
}

const props = defineProps<{
  section: 'video' | 'thumbnail' | 'artwork' | 'source'
  checks: Record<CheckKeys, boolean>
  assetSource: AssetSource
  isLyricVideo: boolean
  /** True once the user has left the Upload step — required errors only show from then on */
  visited?: boolean
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

const artworkRequirements = [
  'Square JPG or JPEG, at least 3000×3000px',
  'No social media or music platform logos',
  'No copyrighted, explicit or pixelated images',
  'No QR codes, web addresses or URLs',
]


const toggleCheck = (key: CheckKeys) => {
  emit('update:checks', { ...props.checks, [key]: !props.checks[key] })
}

// Licence document upload
const MAX_LICENCE_SIZE = 10 * 1024 * 1024
const licenceInputRef = ref<HTMLInputElement | null>(null)
const isDraggingLicence = ref(false)
const licenceError = ref<string | null>(null)

const formatFileSize = (bytes: number) => bytes >= 1048576 ? (bytes / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(bytes / 1024)) + ' KB'

const acceptLicence = (file: File) => {
  licenceError.value = null
  if (!/\.(pdf|jpe?g|png)$/i.test(file.name)) { licenceError.value = 'Please upload a PDF, JPG or PNG.'; return }
  if (file.size > MAX_LICENCE_SIZE) { licenceError.value = `That file is ${formatFileSize(file.size)} — the limit is 10 MB.`; return }
  updateSource('licenseDocument', file)
}
const handleLicenceSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files?.[0]) acceptLicence(input.files[0])
  input.value = ''
}
const handleLicenceDrop = (e: DragEvent) => {
  isDraggingLicence.value = false
  if (e.dataTransfer?.files?.[0]) acceptLicence(e.dataTransfer.files[0])
}

const updateSource = (key: keyof AssetSource, value: any) => {
  emit('update:assetSource', { ...props.assetSource, [key]: value })
}
</script>
