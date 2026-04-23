<template>
  <div class="relative">
    <!-- Banner Image -->
    <div class="relative h-48 lg:h-64 overflow-hidden rounded-xl">
      <img 
        :src="artist.bannerImage || artist.avatar" 
        :alt="artist.name" 
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 artist-banner-gradient"></div>
      
      <!-- Edit Banner Button -->
      <button class="absolute top-4 right-4 w-10 h-10 bg-ditto-purple rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
        <IconEdit class="w-5 h-5 text-white" />
      </button>
      
      <!-- Plan Artist Badge -->
      <span 
        v-if="artist.isPlanArtist"
        class="absolute bottom-20 left-4 lg:left-6 plan-artist-badge px-3 py-1 text-xs font-semibold text-white rounded-full"
      >
        PLAN ARTIST
      </span>
      
      <!-- Artist Name (overlay on banner) -->
      <h1 class="absolute bottom-4 left-4 lg:left-6 text-3xl lg:text-4xl font-bold text-white">
        {{ artist.name }}
      </h1>
    </div>
    
    <!-- Artist Info Section -->
    <div class="mt-4 lg:mt-6">
      <!-- Website -->
      <p v-if="artist.website" class="text-sm mb-2">
        <span class="text-ditto-purple">Website:</span>
        <a :href="artist.website" target="_blank" class="text-ditto-purple hover:underline ml-1">
          {{ artist.website.replace(/^https?:\/\//, '') }}
        </a>
      </p>
      
      <!-- Bio -->
      <p v-if="artist.bio" class="text-sm text-ditto-subtext mb-4">
        <span class="text-ditto-purple">Bio:</span>
        <span class="ml-1">{{ truncatedBio }}</span>
      </p>
      
      <!-- Social Links -->
      <div class="flex items-center gap-3 mb-4">
        <a 
          v-if="artist.socialLinks.facebook" 
          :href="artist.socialLinks.facebook" 
          target="_blank"
          class="text-ditto-text hover:text-ditto-purple transition-colors"
        >
          <IconFacebook class="w-8 h-8" />
        </a>
        <a 
          v-if="artist.socialLinks.tiktok" 
          :href="artist.socialLinks.tiktok" 
          target="_blank"
          class="text-ditto-text hover:text-ditto-purple transition-colors"
        >
          <IconTiktok class="w-8 h-8" />
        </a>
        <a 
          v-if="artist.socialLinks.twitter" 
          :href="artist.socialLinks.twitter" 
          target="_blank"
          class="text-ditto-text hover:text-ditto-purple transition-colors"
        >
          <IconTwitterX class="w-8 h-8" />
        </a>
        <a 
          v-if="artist.socialLinks.instagram" 
          :href="artist.socialLinks.instagram" 
          target="_blank"
          class="text-ditto-text hover:text-ditto-purple transition-colors"
        >
          <IconInstagram class="w-8 h-8" />
        </a>
        <a 
          v-if="artist.socialLinks.youtube" 
          :href="artist.socialLinks.youtube" 
          target="_blank"
          class="text-ditto-text hover:text-ditto-purple transition-colors"
        >
          <IconYoutube class="w-8 h-8" />
        </a>
      </div>
      
      <!-- Edit Artist Info Button -->
      <button 
        @click="$emit('edit')"
        class="w-full lg:w-auto px-6 py-3 border border-gray-200 rounded-full text-sm font-medium flex items-center justify-center gap-2 hover:border-ditto-purple hover:text-ditto-purple transition-colors"
      >
        <IconEdit class="w-4 h-4" />
        Edit Artist Info
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Artist } from '../../views/artists/artistTypes'
import { 
  IconEdit, 
  IconFacebook, 
  IconTiktok, 
  IconTwitterX, 
  IconInstagram, 
  IconYoutube 
} from '../icons/artistIcons'

const props = defineProps<{
  artist: Artist
}>()

defineEmits<{
  (e: 'edit'): void
}>()

const truncatedBio = computed(() => {
  if (!props.artist.bio) return ''
  return props.artist.bio.length > 150 
    ? props.artist.bio.slice(0, 150) + '...' 
    : props.artist.bio
})
</script>
