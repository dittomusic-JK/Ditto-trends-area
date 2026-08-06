<template>
  <!-- Side-nav global search: absolutely anchored inside each page's root
       wrapper so it always sits on the basket chip's centreline (y=52), flush
       with the content edge — immune to per-page header layout differences.
       Renders nothing in top-nav mode. -->
  <div v-if="navStyle === 'side'" ref="rootRef" class="absolute top-8 right-[4.5rem] z-40 hidden lg:block w-[24rem]">
    <!-- Input pill -->
    <div
      :class="[
        'flex items-center gap-2.5 h-10 pl-4 pr-2 rounded-full bg-white border transition-all',
        open ? 'border-ditto-purple/40 shadow-md' : 'border-gray-200 shadow-sm hover:border-gray-300'
      ]"
    >
      <svg class="w-4 h-4 text-ditto-subtext flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke-linecap="round"/>
      </svg>
      <input
        ref="inputRef"
        v-model="query"
        type="text"
        placeholder="Search releases, artists, pages…"
        class="flex-1 min-w-0 bg-transparent border-0 outline-none text-sm text-ditto-text placeholder:text-ditto-subtext"
        @focus="open = true"
        @keydown.escape.prevent="close"
        @keydown.enter.prevent="selectFirst"
      />
      <span class="px-1.5 py-0.5 rounded-md bg-ditto-light-grey text-[11px] font-medium text-ditto-subtext select-none flex-shrink-0">⌘K</span>
    </div>

    <!-- Results panel -->
    <div v-if="open" class="absolute left-0 right-0 top-12 z-50 max-h-[70vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-200 py-2">
      <!-- Quick links (empty query) -->
      <template v-if="!query.trim()">
        <p class="px-4 pt-2 pb-1 text-xs text-ditto-subtext">Jump to</p>
        <button
          v-for="page in pages.slice(0, 7)"
          :key="'quick-' + page.label"
          @click="goPage(page)"
          class="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-ditto-light-grey transition-colors"
        >
          <span class="w-8 h-8 rounded-lg bg-ditto-light-grey flex items-center justify-center text-base flex-shrink-0">{{ page.emoji }}</span>
          <span class="text-sm font-medium text-ditto-text">{{ page.label }}</span>
        </button>
      </template>

      <template v-else>
        <!-- Pages -->
        <template v-if="pageResults.length">
          <p class="px-4 pt-2 pb-1 text-xs text-ditto-subtext">Pages</p>
          <button
            v-for="page in pageResults"
            :key="'page-' + page.label"
            @click="goPage(page)"
            class="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-ditto-light-grey transition-colors"
          >
            <span class="w-8 h-8 rounded-lg bg-ditto-light-grey flex items-center justify-center text-base flex-shrink-0">{{ page.emoji }}</span>
            <span class="text-sm font-medium text-ditto-text">{{ page.label }}</span>
          </button>
        </template>

        <!-- Releases -->
        <template v-if="releaseResults.length">
          <p class="px-4 pt-2 pb-1 text-xs text-ditto-subtext">Releases</p>
          <button
            v-for="item in releaseResults"
            :key="'rel-' + item.title + item.year"
            @click="goRelease(item)"
            class="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-ditto-light-grey transition-colors"
          >
            <img :src="item.artwork" :alt="item.title" class="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-semibold text-ditto-text truncate">{{ item.title }}</span>
              <span class="block text-xs text-ditto-subtext truncate">{{ item.type }} by {{ item.artist }} · {{ item.year }}</span>
            </span>
          </button>
        </template>

        <!-- Artists -->
        <template v-if="artistResults.length">
          <p class="px-4 pt-2 pb-1 text-xs text-ditto-subtext">Artists</p>
          <button
            v-for="artist in artistResults"
            :key="'art-' + artist.id"
            @click="goArtist(artist)"
            class="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-ditto-light-grey transition-colors"
          >
            <span class="block w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
              <img v-if="artist.avatar" :src="artist.avatar" :alt="artist.name" class="w-full h-full object-cover" />
              <InitialsAvatar v-else :name="artist.name" text-class="text-xs" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-semibold text-ditto-text truncate">{{ artist.name }}</span>
              <span class="block text-xs text-ditto-subtext truncate">{{ artist.releaseCount }} {{ artist.artistType === 'contributing' ? (artist.releaseCount === 1 ? 'Track' : 'Tracks') : (artist.releaseCount === 1 ? 'Release' : 'Releases') }}</span>
            </span>
          </button>
        </template>

        <p v-if="!pageResults.length && !releaseResults.length && !artistResults.length" class="px-4 py-6 text-sm text-ditto-subtext text-center">
          No results for “{{ query.trim() }}”
        </p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, onMounted, onUnmounted } from 'vue'
import InitialsAvatar from '../common/InitialsAvatar.vue'
import { releaseCatalog } from '../../data/releaseDetailMockData'
import type { ReleaseListItem } from '../../data/releaseDetailMockData'
import { artists } from '../../data/artistsMockData'
import type { Artist } from '../../views/artists/artistTypes'
import { useDemoUser } from '../../composables/useDemoUser'

// App-level navigation API (provided by App.vue) — lets the search live inside
// any page header without each page re-wiring navigation events.
interface AppNav {
  navigate: (section: string) => void
  openRoyalties: (section: string) => void
  openRelease: (item: ReleaseListItem) => void
  openArtist: (id: string) => void
}

const navStyle = inject<'top' | 'side'>('navStyle', 'top')
const appNav = inject<AppNav | null>('appNav', null)

// New users have no catalog to search — pages only
const { isNewUser } = useDemoUser()

const query = ref('')
const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

interface PageEntry {
  label: string
  emoji: string
  section: string
  royaltiesSection?: string
  keywords: string
}

const pages: PageEntry[] = [
  { label: 'Home', emoji: '🏠', section: 'home', keywords: 'home hub dashboard start' },
  { label: 'Your Releases', emoji: '💿', section: 'music', keywords: 'music releases catalog albums singles eps' },
  { label: 'New release', emoji: '➕', section: 'music-builder', keywords: 'create upload distribute new release builder' },
  { label: 'Your Artists', emoji: '🎤', section: 'artists', keywords: 'artists profiles roster contracts' },
  { label: 'My Videos', emoji: '🎬', section: 'videos', keywords: 'videos vevo music video' },
  { label: 'Royalties & Sales', emoji: '💰', section: 'royalties', keywords: 'royalties sales earnings money income streams revenue' },
  { label: 'Collaborations', emoji: '🤝', section: 'royalties', royaltiesSection: 'collaborations', keywords: 'collaborations splits share royalties' },
  { label: 'Reports', emoji: '📊', section: 'royalties', royaltiesSection: 'reports', keywords: 'reports statements csv royalties' },
  { label: 'Payouts', emoji: '🏦', section: 'royalties', royaltiesSection: 'payouts', keywords: 'payouts withdraw balance bank money' },
  { label: 'Analytics', emoji: '📈', section: 'analytics', keywords: 'analytics trends streams audience playlists stats data' },
  { label: 'Publishing', emoji: '📝', section: 'publishing', keywords: 'publishing works songwriter cowriters live performances' },
  { label: 'Sync', emoji: '🎞️', section: 'sync', keywords: 'sync licensing film tv games pitching' },
  { label: 'Neighbouring Rights', emoji: '🛡️', section: 'neighbouring-rights', keywords: 'neighbouring rights registration collection societies broadcast' },
  { label: 'Basket', emoji: '🛒', section: 'basket', keywords: 'basket cart checkout order' },
]

const q = computed(() => query.value.trim().toLowerCase())

const pageResults = computed(() =>
  pages.filter(p => p.label.toLowerCase().includes(q.value) || p.keywords.includes(q.value)).slice(0, 5)
)

const releaseResults = computed(() => {
  if (isNewUser.value) return []
  return releaseCatalog
    .filter(r => r.title.toLowerCase().includes(q.value) || r.artist.toLowerCase().includes(q.value))
    .slice(0, 5)
})

const artistResults = computed(() => {
  if (isNewUser.value) return []
  return artists.filter(a => a.name.toLowerCase().includes(q.value)).slice(0, 5)
})

const close = () => {
  open.value = false
  query.value = ''
  inputRef.value?.blur()
}

const goPage = (page: PageEntry) => {
  if (page.royaltiesSection) appNav?.openRoyalties(page.royaltiesSection)
  else appNav?.navigate(page.section)
  close()
}

const goRelease = (item: ReleaseListItem) => {
  appNav?.openRelease(item)
  close()
}

const goArtist = (artist: Artist) => {
  appNav?.openArtist(artist.id)
  close()
}

const selectFirst = () => {
  if (!q.value) return
  if (pageResults.value.length) return goPage(pageResults.value[0])
  if (releaseResults.value.length) return goRelease(releaseResults.value[0])
  if (artistResults.value.length) return goArtist(artistResults.value[0])
}

const handleClickOutside = (e: MouseEvent) => {
  if (open.value && rootRef.value && !rootRef.value.contains(e.target as Node)) close()
}

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    open.value = true
    inputRef.value?.focus()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>
