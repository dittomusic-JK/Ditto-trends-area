<template>
  <img 
    :src="iconSrc" 
    :alt="store" 
    class="w-6 h-6 rounded"
    v-if="iconSrc"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  store: string
}>()

const storeIconMap: Record<string, string> = {
  'spotify': '/img/spotify-icon.svg',
  'apple-music': '/img/apple-music-icon.svg',
  'deezer': '/img/deezer-icon.svg',
  'youtube': '/img/youtube-icon.svg',
  'amazon-music': '/img/amazonmusic-icon.svg',
  'soundcloud': '/img/soundcloud_icon.svg',
  'tidal': '/img/tidal-icon.svg',
  'boomplay': '/img/boomplay-icon.svg',
  'tiktok': '/img/tiktok-icon.svg',
  'instagram': '/img/instagram-icon.svg',
  'facebook': '/img/facebook-icon.svg',
  'shazam': '/img/shazam-icon.svg',
  'google': '/img/google-icon.svg',
}

const iconSrc = computed(() => storeIconMap[props.store] || null)
</script>
