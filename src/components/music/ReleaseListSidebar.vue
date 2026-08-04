<template>
  <!-- Catalog sidebar for the release manage view. Same anatomy as
       ArtistListSidebar so the two collection→item areas stay consistent. -->
  <aside class="w-[280px] flex-shrink-0 border-r border-gray-200 flex flex-col h-full bg-white">
    <div class="px-4 py-4 border-b border-gray-200">
      <div class="flex items-baseline justify-between mb-3">
        <h2 class="text-base font-semibold text-ditto-text">Your releases</h2>
        <span class="text-xs text-ditto-subtext tabular-nums">{{ filtered.length }} of {{ releases.length }}</span>
      </div>
      <SearchInput v-model="query" placeholder="Search for a release" width-class="w-full" />
    </div>

    <div class="flex-1 overflow-y-auto py-1.5">
      <!-- Selected treatment mirrors ArtistListSidebar: inset rounded row,
           soft fill + purple border, ring on the artwork, purple title -->
      <button
        v-for="item in filtered"
        :key="item.title + item.artist + item.year"
        @click="$emit('select', item)"
        :class="[
          'flex items-center gap-3 px-3 py-2.5 text-left transition-all rounded-lg',
          isCurrent(item)
            ? 'bg-[#FDF2F8] border border-[#A855F7]/30'
            : 'hover:bg-ditto-light-grey border border-transparent'
        ]"
        style="width: calc(100% - 16px); margin-left: 8px; margin-right: 8px;"
      >
        <img
          :src="item.artwork"
          :alt="item.title"
          class="w-10 h-10 rounded-lg object-cover flex-shrink-0 ring-2 ring-transparent"
          :class="{ 'ring-ditto-purple': isCurrent(item) }"
          loading="lazy"
        />
        <span class="flex-1 min-w-0">
          <span :class="['block text-sm font-medium truncate', isCurrent(item) ? 'text-ditto-purple' : 'text-ditto-text']">{{ item.title }}</span>
          <span class="block text-xs text-ditto-subtext truncate">{{ item.artist }} · {{ item.year }}</span>
        </span>
        <span :class="['w-2 h-2 rounded-full flex-shrink-0', statusDot(item.status)]" :title="item.status"></span>
      </button>

      <p v-if="filtered.length === 0" class="px-4 py-8 text-center text-xs text-ditto-subtext">
        No releases match "{{ query }}".
      </p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SearchInput from '../common/SearchInput.vue'
import type { ReleaseListItem } from '../../data/releaseDetailMockData'

const props = defineProps<{
  releases: ReleaseListItem[]
  current: { title: string; artist: string; status: string }
}>()

defineEmits<{
  (e: 'select', item: ReleaseListItem): void
}>()

const query = ref('')

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.releases
  return props.releases.filter(r =>
    r.title.toLowerCase().includes(q) || r.artist.toLowerCase().includes(q)
  )
})

const isCurrent = (item: ReleaseListItem) =>
  item.title === props.current.title && item.artist === props.current.artist && item.status === props.current.status

const statusDot = (status: string) => {
  const s = status.toLowerCase()
  if (s === 'live') return 'bg-success'
  if (s.includes('progress')) return 'bg-warning'
  if (s.includes('takedown')) return 'bg-error'
  return 'bg-gray-300'
}
</script>
