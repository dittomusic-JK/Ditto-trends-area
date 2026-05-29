<template>
  <div>
    <h2 class="font-satoshi font-black tracking-[-0.03em] text-xl lg:text-2xl text-ditto-text mb-2">Artists</h2>
    <p class="text-sm text-ditto-subtext mb-6">Add the artists involved in this video release.</p>

    <!-- Primary Artists -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-ditto-text">Primary Artists</h3>
        <span class="text-xs text-ditto-subtext">{{ artists.primary.length }} / 4</span>
      </div>

      <!-- Artist Chips -->
      <div v-if="artists.primary.length > 0" class="flex flex-wrap gap-2 mb-3">
        <div
          v-for="artist in artists.primary"
          :key="artist.id"
          class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-ditto-purple/10 border border-ditto-purple/20"
        >
          <div class="w-6 h-6 rounded-full bg-ditto-purple flex items-center justify-center text-[10px] font-bold text-white">
            {{ artist.initials }}
          </div>
          <span class="text-sm text-ditto-text">{{ artist.name }}</span>
          <button @click="removeArtist('primary', artist.id)" class="text-ditto-subtext hover:text-error transition-colors">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <button
        @click="openArtistModal('primary')"
        :disabled="artists.primary.length >= 4"
        :class="[
          'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
          artists.primary.length >= 4
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-ditto-light-grey text-ditto-purple hover:bg-ditto-purple/10'
        ]"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
        Add Artists
      </button>
    </div>

    <!-- Featured Artists Toggle -->
    <div class="border-t border-gray-200 pt-5 mb-5">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm text-ditto-text">Would you like to add any Featured artists?</span>
        <button
          @click="toggleSection('showFeatured')"
          :class="[
            'w-[51px] h-[31px] rounded-full relative transition-colors flex-shrink-0',
            artists.showFeatured ? 'bg-[#34c759]' : 'bg-[#e9e9eb]'
          ]"
        >
          <span :class="[
            'absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform',
            artists.showFeatured ? 'translate-x-[20px]' : 'translate-x-0'
          ]"></span>
        </button>
      </div>

      <div v-if="artists.showFeatured" class="ml-0">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-ditto-text">Featured Artists</h3>
          <span class="text-xs text-ditto-subtext">{{ artists.featured.length }} / 10</span>
        </div>
        <div v-if="artists.featured.length > 0" class="flex flex-wrap gap-2 mb-3">
          <div
            v-for="artist in artists.featured"
            :key="artist.id"
            class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-info/10 border border-info/20"
          >
            <div class="w-6 h-6 rounded-full bg-info flex items-center justify-center text-[10px] font-bold text-white">
              {{ artist.initials }}
            </div>
            <span class="text-sm text-ditto-text">{{ artist.name }}</span>
            <button @click="removeArtist('featured', artist.id)" class="text-ditto-subtext hover:text-error transition-colors">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
        <button
          @click="openArtistModal('featured')"
          :disabled="artists.featured.length >= 10"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
            artists.featured.length >= 10
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-ditto-light-grey text-ditto-purple hover:bg-ditto-purple/10'
          ]"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Add Featured Artists
        </button>
      </div>
    </div>

    <!-- Remixer Artists Toggle -->
    <div class="border-t border-gray-200 pt-5">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm text-ditto-text">Would you like to add any Remix artists?</span>
        <button
          @click="toggleSection('showRemixer')"
          :class="[
            'w-[51px] h-[31px] rounded-full relative transition-colors flex-shrink-0',
            artists.showRemixer ? 'bg-[#34c759]' : 'bg-[#e9e9eb]'
          ]"
        >
          <span :class="[
            'absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform',
            artists.showRemixer ? 'translate-x-[20px]' : 'translate-x-0'
          ]"></span>
        </button>
      </div>

      <div v-if="artists.showRemixer" class="ml-0">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-ditto-text">Remixer Artists</h3>
          <span class="text-xs text-ditto-subtext">{{ artists.remixer.length }} / 4</span>
        </div>
        <div v-if="artists.remixer.length > 0" class="flex flex-wrap gap-2 mb-3">
          <div
            v-for="artist in artists.remixer"
            :key="artist.id"
            class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20"
          >
            <div class="w-6 h-6 rounded-full bg-warning flex items-center justify-center text-[10px] font-bold text-white">
              {{ artist.initials }}
            </div>
            <span class="text-sm text-ditto-text">{{ artist.name }}</span>
            <button @click="removeArtist('remixer', artist.id)" class="text-ditto-subtext hover:text-error transition-colors">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
        <button
          @click="openArtistModal('remixer')"
          :disabled="artists.remixer.length >= 4"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
            artists.remixer.length >= 4
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-ditto-light-grey text-ditto-purple hover:bg-ditto-purple/10'
          ]"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Add Remix Artists
        </button>
      </div>
    </div>

    <!-- Select Artists Modal -->
    <div v-if="showArtistModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[2px]" @click.self="showArtistModal = false">
      <div class="bg-white rounded-2xl shadow-2xl w-[460px] max-w-[90vw] flex flex-col gap-4 p-6">
        <!-- Header -->
        <div class="flex items-start justify-between">
          <h3 class="font-bold text-[22px] text-ditto-text tracking-[-0.03em] leading-tight">Your Artists</h3>
          <button @click="showArtistModal = false" class="text-ditto-subtext hover:text-ditto-text p-1 -m-1 rounded-md transition-colors">
            <svg class="w-[18px] h-[18px]" viewBox="0 0 18 18" fill="none">
              <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <p class="text-sm text-ditto-text -mt-2">
          You can select up to {{ maxForType(modalType) }} {{ modalTypeLabel.toLowerCase() }} artists<template v-if="modalType === 'primary'">, including at least one <strong>Plan Artist.</strong> They will be displayed in the order selected.</template>
        </p>

        <!-- Search -->
        <div class="relative">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ditto-subtext pointer-events-none" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M11 11L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search artists..."
            class="w-full h-10 rounded-full border border-gray-300 pl-9 pr-9 text-sm text-ditto-text focus:outline-none focus:border-ditto-purple focus:ring-2 focus:ring-ditto-purple/10 transition-all"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full bg-ditto-light-grey flex items-center justify-center text-ditto-subtext hover:text-ditto-text"
          >
            <svg class="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none">
              <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- Selection counter -->
        <div class="flex items-center justify-between text-xs text-ditto-subtext -mt-1">
          <span><strong class="text-ditto-text font-semibold">{{ tempSelection.length }}</strong> of {{ maxForType(modalType) }} selected</span>
          <span v-if="modalType === 'primary'" :class="hasPlanArtist ? 'text-success' : 'text-ditto-subtext'">
            {{ hasPlanArtist ? 'Plan Artist included' : 'Include at least one Plan Artist' }}
          </span>
        </div>

        <!-- Artist Grid -->
        <div class="grid grid-cols-4 gap-x-3 gap-y-4 max-h-[320px] overflow-y-auto py-1 px-0.5 -mx-0.5 scrollbar-thin">
          <!-- Add New Artist tile -->
          <button
            @click="showAddNewModal = true"
            class="flex flex-col items-center gap-2 group"
          >
            <div class="w-[84px] h-[84px] rounded-full border-2 border-[#2680eb] bg-ditto-light-grey flex items-center justify-center text-[#2680eb] group-hover:bg-blue-50 transition-colors">
              <svg class="w-8 h-8" viewBox="0 0 32 32" fill="none">
                <circle cx="13" cy="11" r="4.5" stroke="currentColor" stroke-width="1.8"/>
                <path d="M5 25c0-4 3.6-7 8-7 2.4 0 4.5.9 6 2.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                <path d="M22 18v8M18 22h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </div>
            <span class="text-[13px] text-[#2680eb] text-center leading-tight">+ Add New Artist</span>
          </button>

          <!-- Artist tiles -->
          <button
            v-for="artist in filteredArtists"
            :key="artist.id"
            @click="!isArtistUsedElsewhere(artist.id) ? toggleArtistSelection(artist) : null"
            :class="[
              'flex flex-col items-center gap-2',
              isArtistUsedElsewhere(artist.id) ? 'opacity-40 cursor-not-allowed' : 'group'
            ]"
          >
            <div
              class="relative w-[84px] h-[84px] rounded-full flex items-center justify-center text-white font-bold text-[30px] tracking-[-0.03em] transition-all"
              :style="{ backgroundColor: artist.color }"
              :class="[
                isArtistSelected(artist.id) ? 'ring-[3px] ring-[#2680eb]' : '',
                !isArtistUsedElsewhere(artist.id) ? 'group-hover:-translate-y-0.5' : ''
              ]"
            >
              {{ artist.initials.charAt(0) }}
              <!-- Plan badge -->
              <span
                v-if="artist.plan && isArtistSelected(artist.id)"
                class="absolute inset-0 flex items-center justify-center"
              >
                <span class="bg-[#2680eb] text-white text-[10px] font-medium px-2.5 py-1 rounded-sm">Plan</span>
              </span>
            </div>
            <span
              class="text-[13px] text-center leading-tight max-w-[92px] break-words"
              :class="isArtistSelected(artist.id) ? 'font-semibold' : ''"
            >{{ artist.name }}</span>
            <span v-if="isArtistUsedElsewhere(artist.id)" class="text-[10px] text-ditto-subtext text-center">Already selected</span>
          </button>

          <!-- Empty state -->
          <div v-if="filteredArtists.length === 0" class="col-span-4 text-center py-7 text-sm text-ditto-subtext">
            No artists match <strong class="text-ditto-text font-semibold">"{{ searchQuery }}"</strong>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-center mt-1">
          <button
            @click="confirmArtistSelection"
            :disabled="tempSelection.length === 0 || (modalType === 'primary' && !hasPlanArtist)"
            :class="[
              'h-[52px] px-9 min-w-[200px] rounded-full text-[15px] font-medium transition-all',
              tempSelection.length > 0 && (modalType !== 'primary' || hasPlanArtist)
                ? 'bg-ditto-purple text-white hover:opacity-95 active:translate-y-px'
                : 'bg-gray-300/60 text-gray-400 cursor-not-allowed'
            ]"
          >Add Artists</button>
        </div>
      </div>
    </div>

    <!-- Add New Artist Modal -->
    <div v-if="showAddNewModal" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/10 backdrop-blur-[2px]" @click.self="showAddNewModal = false">
      <div class="bg-white rounded-[22px] shadow-2xl w-[460px] max-w-[90vw] overflow-hidden">
        <h3 class="font-bold text-2xl text-ditto-text tracking-[-0.03em] px-5 pt-5 pb-3.5">Add New Artist</h3>

        <!-- Artist image -->
        <div class="flex items-center gap-3.5 px-5 pb-4">
          <div class="w-[60px] h-[60px] rounded-full bg-ditto-subtext flex items-center justify-center flex-shrink-0">
            <svg class="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none">
              <path d="M9 4l-1.5 2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3.5L15 4H9z" stroke="#ffffff" stroke-width="1.6" stroke-linejoin="round"/>
              <circle cx="12" cy="13" r="3.5" stroke="#ffffff" stroke-width="1.6"/>
            </svg>
          </div>
          <span class="text-base text-gray-400">Artist Image</span>
        </div>

        <!-- Artist name -->
        <div class="border-t border-gray-300 px-5 py-4">
          <input
            v-model="newArtistName"
            type="text"
            placeholder="Artist name"
            class="w-full text-base text-ditto-text bg-transparent border-0 outline-none placeholder:text-gray-400"
          />
        </div>

        <!-- Released music toggle -->
        <div class="border-t border-gray-300 px-5 py-4 flex items-center justify-between">
          <span class="text-base text-ditto-text">Has this artist ever released music before?</span>
          <button
            @click="newArtistHasReleased = !newArtistHasReleased"
            :class="[
              'w-[51px] h-[31px] rounded-full relative transition-colors flex-shrink-0',
              newArtistHasReleased ? 'bg-[#34c759]' : 'bg-[#e9e9eb]'
            ]"
          >
            <span :class="[
              'absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform',
              newArtistHasReleased ? 'translate-x-[20px]' : 'translate-x-0'
            ]"></span>
          </button>
        </div>

        <!-- Connect Artist Profiles -->
        <h4 class="font-bold text-base text-ditto-text px-5 pt-5 pb-2.5">Connect Artist Profiles</h4>

        <!-- Spotify ID -->
        <div class="border-t border-gray-300 px-5 py-4 flex flex-col gap-1.5">
          <label class="text-[13px] font-medium text-ditto-subtext">Spotify ID</label>
          <div class="flex items-center gap-2.5">
            <img src="/img/spotify-icon.svg" alt="Spotify" class="w-5 h-5 flex-shrink-0" />
            <input
              v-model="newArtistSpotifyId"
              type="text"
              placeholder="1Xyo4u8uXC1ZmMpatF05PJ"
              class="flex-1 text-base text-ditto-text bg-transparent border-0 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        <!-- Apple Music ID -->
        <div class="border-t border-gray-300 px-5 py-4 flex flex-col gap-1.5">
          <label class="text-[13px] font-medium text-ditto-subtext">Apple Music ID</label>
          <div class="flex items-center gap-2.5">
            <img src="/img/apple-music-icon.svg" alt="Apple Music" class="w-5 h-5 flex-shrink-0" />
            <input
              v-model="newArtistAppleId"
              type="text"
              placeholder="159260351"
              class="flex-1 text-base text-ditto-text bg-transparent border-0 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        <!-- Plan Artist toggle -->
        <div class="border-t border-gray-300 px-5 py-4 flex items-center justify-between">
          <div>
            <span class="text-base text-ditto-text">Make this artist a Plan Artist?</span>
            <span class="block text-[11px] text-ditto-purple mt-0.5">(1/2 Remaining)</span>
          </div>
          <button
            @click="newArtistIsPlan = !newArtistIsPlan"
            :class="[
              'w-[51px] h-[31px] rounded-full relative transition-colors flex-shrink-0',
              newArtistIsPlan ? 'bg-[#34c759]' : 'bg-[#e9e9eb]'
            ]"
          >
            <span :class="[
              'absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform',
              newArtistIsPlan ? 'translate-x-[20px]' : 'translate-x-0'
            ]"></span>
          </button>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-300 px-5 py-5 flex justify-center gap-2.5">
          <button
            @click="showAddNewModal = false"
            class="w-[160px] h-[52px] rounded-full border border-gray-300 bg-[#e8e8ff] text-sm text-ditto-text hover:opacity-90 transition-opacity"
          >Cancel</button>
          <button
            @click="addNewArtist"
            :disabled="!newArtistName.trim()"
            :class="[
              'w-[160px] h-[52px] rounded-full text-sm font-medium transition-all',
              newArtistName.trim()
                ? 'bg-ditto-purple text-white hover:opacity-95'
                : 'bg-gray-300/60 text-gray-400 cursor-not-allowed'
            ]"
          >+ Add Artist</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockArtists } from '../../../data/videoMockData'

interface ArtistEntry {
  id: string
  name: string
  initials: string
}

interface ArtistsData {
  primary: ArtistEntry[]
  featured: ArtistEntry[]
  remixer: ArtistEntry[]
  showFeatured: boolean
  showRemixer: boolean
}

const props = defineProps<{
  artists: ArtistsData
}>()

const emit = defineEmits<{
  (e: 'update:artists', artists: ArtistsData): void
}>()

const showArtistModal = ref(false)
const showAddNewModal = ref(false)
const modalType = ref<'primary' | 'featured' | 'remixer'>('primary')
const tempSelection = ref<ArtistEntry[]>([])
const searchQuery = ref('')

// Add New Artist form state
const newArtistName = ref('')
const newArtistHasReleased = ref(true)
const newArtistSpotifyId = ref('')
const newArtistAppleId = ref('')
const newArtistIsPlan = ref(false)

const allArtists = ref([...mockArtists])

const filteredArtists = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return allArtists.value
  return allArtists.value.filter(a => a.name.toLowerCase().includes(q))
})

const modalTypeLabel = computed(() => {
  if (modalType.value === 'primary') return 'Primary'
  if (modalType.value === 'featured') return 'Featured'
  return 'Remix'
})

const hasPlanArtist = computed(() => {
  return tempSelection.value.some(sel => {
    const artist = allArtists.value.find(a => a.id === sel.id)
    return artist?.plan
  })
})

const maxForType = (type: 'primary' | 'featured' | 'remixer') => {
  if (type === 'featured') return 10
  if (type === 'primary') return 4
  return 4
}

const openArtistModal = (type: 'primary' | 'featured' | 'remixer') => {
  modalType.value = type
  tempSelection.value = [...props.artists[type]]
  searchQuery.value = ''
  showArtistModal.value = true
}

const isArtistSelected = (id: string) => {
  return tempSelection.value.some(a => a.id === id)
}

// Check if artist is already used in a different role at the release level
const isArtistUsedElsewhere = (id: string) => {
  const otherTypes = (['primary', 'featured', 'remixer'] as const).filter(t => t !== modalType.value)
  return otherTypes.some(t => props.artists[t].some(a => a.id === id))
}

const toggleArtistSelection = (artist: { id: string; name: string; initials: string }) => {
  const index = tempSelection.value.findIndex(a => a.id === artist.id)
  if (index >= 0) {
    tempSelection.value.splice(index, 1)
  } else if (tempSelection.value.length < maxForType(modalType.value)) {
    tempSelection.value.push({ id: artist.id, name: artist.name, initials: artist.initials })
  }
}

const confirmArtistSelection = () => {
  const updated = { ...props.artists }
  updated[modalType.value] = [...tempSelection.value]
  emit('update:artists', updated)
  showArtistModal.value = false
}

const removeArtist = (type: 'primary' | 'featured' | 'remixer', id: string) => {
  const updated = { ...props.artists }
  updated[type] = updated[type].filter(a => a.id !== id)
  emit('update:artists', updated)
}

const toggleSection = (key: 'showFeatured' | 'showRemixer') => {
  const updated = { ...props.artists }
  updated[key] = !updated[key]
  emit('update:artists', updated)
}

const addNewArtist = () => {
  if (!newArtistName.value.trim()) return

  const name = newArtistName.value.trim()
  const id = 'new_' + Date.now()
  const initials = name.split(' ').map(w => w.charAt(0).toUpperCase()).join('').slice(0, 2)
  const colors = ['#3a3f5c','#7e6a55','#4f8a6b','#7a3a2c','#5f1fff','#a85be0','#e07a3a','#2e89c9']
  const color = colors[Math.floor(Math.random() * colors.length)]

  // Add to the artist list
  allArtists.value.push({ id, name, initials, plan: newArtistIsPlan.value, color })

  // Auto-select in the current modal
  if (tempSelection.value.length < maxForType(modalType.value)) {
    tempSelection.value.push({ id, name, initials })
  }

  // Reset form
  newArtistName.value = ''
  newArtistHasReleased.value = true
  newArtistSpotifyId.value = ''
  newArtistAppleId.value = ''
  newArtistIsPlan.value = false
  showAddNewModal.value = false
}
</script>
