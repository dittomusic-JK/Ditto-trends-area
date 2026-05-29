<template>
  <div>
    <h2 class="font-satoshi font-black tracking-[-0.03em] text-xl lg:text-2xl text-ditto-text mb-2">Add video metadata</h2>
    <p class="text-sm text-ditto-subtext mb-6">Fill in the details about your video release.</p>

    <div class="space-y-5">
      <!-- Video Title -->
      <div>
        <div class="flex items-center gap-1.5 mb-1.5">
          <label class="text-sm font-medium text-ditto-text">Video Title</label>
          <span class="text-error text-xs">*</span>
          <div class="relative group">
            <svg class="w-3.5 h-3.5 text-ditto-subtext cursor-help" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
            </svg>
            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-ditto-text text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              Enter the name of your video. Do not include any additional text here, like mix version, producer, songwriter, release year etc.
            </div>
          </div>
        </div>
        <input
          :value="metadata.title"
          @input="updateField('title', ($event.target as HTMLInputElement).value)"
          @blur="touched.title = true"
          type="text"
          maxlength="255"
          placeholder="Video title"
          :class="[
            'w-full px-0 py-2.5 border-0 border-b text-sm text-ditto-text bg-transparent focus:outline-none transition-colors',
            touched.title && !metadata.title ? 'border-error focus:border-error' : 'border-gray-300 focus:border-ditto-purple'
          ]"
        />
        <div class="flex items-center justify-between mt-1">
          <p v-if="touched.title && !metadata.title" class="text-xs text-error">Video title is required</p>
          <span v-else></span>
          <p class="text-xs text-ditto-subtext">{{ metadata.title.length }} / 255</p>
        </div>
      </div>

      <!-- Copyright Holders Row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Copyright Holder -->
        <div>
          <div class="flex items-center gap-1.5 mb-1.5">
            <label class="text-sm font-medium text-ditto-text">&copy; Copyright Holder</label>
            <span class="text-error text-xs">*</span>
            <div class="relative group">
              <svg class="w-3.5 h-3.5 text-ditto-subtext cursor-help" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
              </svg>
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-ditto-text text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                Enter the name of whoever controls the copyright for this release's lyrics and melodies.
              </div>
            </div>
          </div>
          <input
            :value="metadata.copyrightHolder"
            @input="updateField('copyrightHolder', ($event.target as HTMLInputElement).value)"
            @blur="touched.copyrightHolder = true"
            type="text"
            maxlength="255"
            placeholder="Copyright holder name"
            :class="[
              'w-full px-0 py-2.5 border-0 border-b text-sm text-ditto-text bg-transparent focus:outline-none transition-colors',
              touched.copyrightHolder && metadata.copyrightHolder.length < 2 ? 'border-error focus:border-error' : 'border-gray-300 focus:border-ditto-purple'
            ]"
          />
          <p v-if="touched.copyrightHolder && !metadata.copyrightHolder" class="text-xs text-error mt-1">Please enter &copy; Copyright Holder.</p>
          <p v-else-if="touched.copyrightHolder && metadata.copyrightHolder.length < 2" class="text-xs text-error mt-1">Name must be at least 2 characters.</p>
        </div>

        <!-- Copyright Year -->
        <div>
          <div class="flex items-center gap-1.5 mb-1.5">
            <label class="text-sm font-medium text-ditto-text">Copyright Year</label>
            <div class="relative group">
              <svg class="w-3.5 h-3.5 text-ditto-subtext cursor-help" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
              </svg>
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-ditto-text text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                Enter the year your video will be released, or was originally released.
              </div>
            </div>
          </div>
          <select
            :value="metadata.copyrightYear"
            @change="updateField('copyrightYear', Number(($event.target as HTMLSelectElement).value))"
            class="w-full px-0 py-2.5 border-0 border-b border-gray-300 text-sm text-ditto-text bg-transparent focus:outline-none focus:border-ditto-purple transition-colors"
          >
            <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
      </div>

      <!-- P Copyright Row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div class="flex items-center gap-1.5 mb-1.5">
            <label class="text-sm font-medium text-ditto-text">&#8471; Copyright Holder</label>
            <span class="text-error text-xs">*</span>
            <div class="relative group">
              <svg class="w-3.5 h-3.5 text-ditto-subtext cursor-help" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
              </svg>
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-ditto-text text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                Enter the name of whoever controls the copyright for this release's sound recordings.
              </div>
            </div>
          </div>
          <input
            :value="metadata.pCopyrightHolder"
            @input="updateField('pCopyrightHolder', ($event.target as HTMLInputElement).value)"
            @blur="touched.pCopyrightHolder = true"
            type="text"
            maxlength="255"
            placeholder="P copyright holder name"
            :class="[
              'w-full px-0 py-2.5 border-0 border-b text-sm text-ditto-text bg-transparent focus:outline-none transition-colors',
              touched.pCopyrightHolder && metadata.pCopyrightHolder.length < 2 ? 'border-error focus:border-error' : 'border-gray-300 focus:border-ditto-purple'
            ]"
          />
          <p v-if="touched.pCopyrightHolder && !metadata.pCopyrightHolder" class="text-xs text-error mt-1">Please enter &#8471; Copyright Holder.</p>
          <p v-else-if="touched.pCopyrightHolder && metadata.pCopyrightHolder.length < 2" class="text-xs text-error mt-1">Name must be at least 2 characters.</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-ditto-text mb-1.5">Production Year</label>
          <select
            :value="metadata.productionYear"
            @change="updateField('productionYear', Number(($event.target as HTMLSelectElement).value))"
            class="w-full px-0 py-2.5 border-0 border-b border-gray-300 text-sm text-ditto-text bg-transparent focus:outline-none focus:border-ditto-purple transition-colors"
          >
            <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
      </div>

      <!-- Record Label -->
      <div>
        <div class="flex items-center gap-1.5 mb-1.5">
          <label class="text-sm font-medium text-ditto-text">Record Label</label>
          <div class="relative group">
            <svg class="w-3.5 h-3.5 text-ditto-subtext cursor-help" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
            </svg>
            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-ditto-text text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              If you are releasing with a record label, add the label name here. If you are not releasing with a label, please select 'Independent'.
            </div>
          </div>
        </div>
        <select
          :value="metadata.recordLabel"
          @change="updateField('recordLabel', ($event.target as HTMLSelectElement).value)"
          class="w-full px-0 py-2.5 border-0 border-b border-gray-300 text-sm text-ditto-text bg-transparent focus:outline-none focus:border-ditto-purple transition-colors"
        >
          <option value="Independent">Independent</option>
          <option value="Goldenboy Entertainment">Goldenboy Entertainment</option>
          <option value="__add_new">+ Add New Label</option>
        </select>
      </div>

      <!-- Genres -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div class="flex items-center gap-1.5 mb-1.5">
            <label class="text-sm font-medium text-ditto-text">Primary Genre</label>
            <span class="text-error text-xs">*</span>
          </div>
          <select
            :value="metadata.primaryGenre"
            @change="updateField('primaryGenre', ($event.target as HTMLSelectElement).value); touched.primaryGenre = true"
            @blur="touched.primaryGenre = true"
            :class="[
              'w-full px-0 py-2.5 border-0 border-b text-sm text-ditto-text bg-transparent focus:outline-none transition-colors',
              touched.primaryGenre && !metadata.primaryGenre ? 'border-error focus:border-error' : 'border-gray-300 focus:border-ditto-purple'
            ]"
          >
            <option value="" disabled>Select genre</option>
            <option v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</option>
          </select>
          <p v-if="touched.primaryGenre && !metadata.primaryGenre" class="text-xs text-error mt-1">Please select a primary genre</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-ditto-text mb-1.5">Secondary Genre</label>
          <select
            :value="metadata.secondaryGenre"
            @change="updateField('secondaryGenre', ($event.target as HTMLSelectElement).value)"
            class="w-full px-0 py-2.5 border-0 border-b border-gray-300 text-sm text-ditto-text bg-transparent focus:outline-none focus:border-ditto-purple transition-colors"
          >
            <option value="">Optional</option>
            <option v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</option>
          </select>
        </div>
      </div>

      <!-- Language -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div class="flex items-center gap-1.5 mb-1.5">
            <label class="text-sm font-medium text-ditto-text">Language</label>
            <div class="relative group">
              <svg class="w-3.5 h-3.5 text-ditto-subtext cursor-help" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
              </svg>
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-ditto-text text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                If your video has no lyrics, this can be used to target a language-specific audience.
              </div>
            </div>
          </div>
          <select
            :value="metadata.language"
            @change="updateField('language', ($event.target as HTMLSelectElement).value)"
            class="w-full px-0 py-2.5 border-0 border-b border-gray-300 text-sm text-ditto-text bg-transparent focus:outline-none focus:border-ditto-purple transition-colors"
          >
            <option v-for="lang in languages" :key="lang" :value="lang">{{ lang }}</option>
          </select>
        </div>

        <!-- ISRC -->
        <div>
          <div class="flex items-center gap-1.5 mb-1.5">
            <label class="text-sm font-medium text-ditto-text">ISRC Code</label>
            <div class="relative group">
              <svg class="w-3.5 h-3.5 text-ditto-subtext cursor-help" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
              </svg>
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-ditto-text text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                Enter your own ISRC if you have one, otherwise we will assign one to this video for free. Format: CC-XXX-YY-NNNNN
              </div>
            </div>
          </div>
          <input
            :value="metadata.isrc"
            @input="updateField('isrc', ($event.target as HTMLInputElement).value)"
            type="text"
            maxlength="17"
            placeholder="e.g. GB-ABC-24-12345"
            :class="[
              'w-full px-0 py-2.5 border-0 border-b text-sm text-ditto-text bg-transparent focus:outline-none transition-colors',
              metadata.isrc && !isValidIsrc ? 'border-error focus:border-error' : 'border-gray-300 focus:border-ditto-purple'
            ]"
          />
          <p v-if="metadata.isrc && !isValidIsrc" class="text-[11px] text-error mt-1">
            That doesn't look right — check the format matches the example (e.g. GB-ABC-24-12345)
          </p>
          <p v-else-if="!metadata.isrc" class="text-[11px] text-ditto-subtext mt-1">
            Leave blank to auto-assign
          </p>
        </div>
      </div>

      <!-- Artist Type -->
      <div>
        <label class="block text-sm font-medium text-ditto-text mb-2">Artist Type</label>
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="artistType"
              value="artist"
              :checked="metadata.artistType === 'artist'"
              @change="updateField('artistType', 'artist')"
              class="hidden"
            />
            <div :class="[
              'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors',
              metadata.artistType === 'artist' ? 'border-ditto-purple' : 'border-gray-300'
            ]">
              <div v-if="metadata.artistType === 'artist'" class="w-2 h-2 rounded-full bg-ditto-purple"></div>
            </div>
            <span class="text-sm text-ditto-text">Artist / Band</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="artistType"
              value="compilation"
              :checked="metadata.artistType === 'compilation'"
              @change="updateField('artistType', 'compilation')"
              class="hidden"
            />
            <div :class="[
              'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors',
              metadata.artistType === 'compilation' ? 'border-ditto-purple' : 'border-gray-300'
            ]">
              <div v-if="metadata.artistType === 'compilation'" class="w-2 h-2 rounded-full bg-ditto-purple"></div>
            </div>
            <span class="text-sm text-ditto-text">Compilation / Various Artists</span>
          </label>
        </div>
      </div>

      <!-- Toggles -->
      <div class="space-y-4 border-t border-gray-200 pt-5">
        <!-- Lyric Video -->
        <div class="flex items-center justify-between">
          <span class="text-sm text-ditto-text">Is this a lyric video?</span>
          <button
            @click="updateField('isLyricVideo', !metadata.isLyricVideo)"
            :class="[
              'w-[51px] h-[31px] rounded-full relative transition-colors flex-shrink-0',
              metadata.isLyricVideo ? 'bg-[#34c759]' : 'bg-[#e9e9eb]'
            ]"
          >
            <span :class="[
              'absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform',
              metadata.isLyricVideo ? 'translate-x-[20px]' : 'translate-x-0'
            ]"></span>
          </button>
        </div>

        <!-- 18+ -->
        <div class="flex items-center justify-between">
          <span class="text-sm text-ditto-text">18+ only?</span>
          <button
            @click="updateField('is18Plus', !metadata.is18Plus)"
            :class="[
              'w-[51px] h-[31px] rounded-full relative transition-colors flex-shrink-0',
              metadata.is18Plus ? 'bg-[#34c759]' : 'bg-[#e9e9eb]'
            ]"
          >
            <span :class="[
              'absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform',
              metadata.is18Plus ? 'translate-x-[20px]' : 'translate-x-0'
            ]"></span>
          </button>
        </div>

        <!-- Explicit -->
        <div class="flex items-center justify-between">
          <span class="text-sm text-ditto-text">Explicit content?</span>
          <button
            @click="updateField('isExplicit', !metadata.isExplicit)"
            :class="[
              'w-[51px] h-[31px] rounded-full relative transition-colors flex-shrink-0',
              metadata.isExplicit ? 'bg-[#34c759]' : 'bg-[#e9e9eb]'
            ]"
          >
            <span :class="[
              'absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform',
              metadata.isExplicit ? 'translate-x-[20px]' : 'translate-x-0'
            ]"></span>
          </button>
        </div>
      </div>

      <!-- Video Type -->
      <div>
        <label class="block text-sm font-medium text-ditto-text mb-2">Type</label>
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="videoType"
              value="official"
              :checked="metadata.videoType === 'official'"
              @change="updateField('videoType', 'official')"
              class="hidden"
            />
            <div :class="[
              'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors',
              metadata.videoType === 'official' ? 'border-ditto-purple' : 'border-gray-300'
            ]">
              <div v-if="metadata.videoType === 'official'" class="w-2 h-2 rounded-full bg-ditto-purple"></div>
            </div>
            <span class="text-sm text-ditto-text">Official Video</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="videoType"
              value="live"
              :checked="metadata.videoType === 'live'"
              @change="updateField('videoType', 'live')"
              class="hidden"
            />
            <div :class="[
              'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors',
              metadata.videoType === 'live' ? 'border-ditto-purple' : 'border-gray-300'
            ]">
              <div v-if="metadata.videoType === 'live'" class="w-2 h-2 rounded-full bg-ditto-purple"></div>
            </div>
            <span class="text-sm text-ditto-text">Live Performance</span>
          </label>
        </div>
      </div>

      <!-- Video Description -->
      <div>
        <label class="block text-sm font-medium text-ditto-text mb-1.5">Video Description</label>
        <textarea
          :value="metadata.description"
          @input="updateField('description', ($event.target as HTMLTextAreaElement).value)"
          maxlength="5000"
          rows="4"
          placeholder="Describe your video..."
          class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-ditto-text bg-white focus:outline-none focus:border-ditto-purple transition-colors resize-none"
        ></textarea>
        <p class="text-xs text-ditto-subtext mt-1 text-right">{{ metadata.description.length }} / 5000</p>
      </div>

      <!-- AI Transparency -->
      <div class="flex items-center justify-between border-t border-gray-200 pt-5">
        <div>
          <span class="text-sm font-medium text-ditto-text">AI Transparency</span>
          <p class="text-xs text-ditto-subtext mt-0.5">Enable if AI tools were used in producing this video.</p>
        </div>
        <button
          @click="updateField('aiTransparency', !metadata.aiTransparency)"
          :class="[
            'w-[51px] h-[31px] rounded-full relative transition-colors flex-shrink-0',
            metadata.aiTransparency ? 'bg-[#34c759]' : 'bg-[#e9e9eb]'
          ]"
        >
          <span :class="[
            'absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform',
            metadata.aiTransparency ? 'translate-x-[20px]' : 'translate-x-0'
          ]"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { videoGenres, videoLanguages } from '../../../data/videoMockData'

interface Metadata {
  title: string
  copyrightHolder: string
  copyrightYear: number
  pCopyrightHolder: string
  productionYear: number
  recordLabel: string
  primaryGenre: string
  secondaryGenre: string
  language: string
  isrc: string
  artistType: 'artist' | 'compilation'
  isLyricVideo: boolean
  isExplicit: boolean
  is18Plus: boolean
  videoType: 'official' | 'live'
  description: string
  aiTransparency: boolean
}

const props = defineProps<{
  metadata: Metadata
}>()

const emit = defineEmits<{
  (e: 'update:metadata', metadata: Metadata): void
}>()

const genres = videoGenres
const languages = videoLanguages

// Track which fields have been visited (for validation on blur)
const touched = reactive({
  title: false,
  copyrightHolder: false,
  pCopyrightHolder: false,
  primaryGenre: false,
})

const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: currentYear - 1900 + 2 }, (_, i) => currentYear + 1 - i)

// ISRC format validation: CC-XXX-YY-NNNNN (with or without hyphens)
const isValidIsrc = computed(() => {
  if (!props.metadata.isrc) return true
  const cleaned = props.metadata.isrc.replace(/-/g, '')
  // Standard ISRC is 12 characters: 2 country + 3 registrant + 2 year + 5 designation
  return /^[A-Z]{2}[A-Z0-9]{3}\d{2}\d{5}$/i.test(cleaned)
})

const updateField = (key: keyof Metadata, value: any) => {
  emit('update:metadata', { ...props.metadata, [key]: value })
}
</script>
