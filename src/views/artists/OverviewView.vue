<template>
  <div class="p-6 lg:p-8">
    <!-- Artist Header with Image -->
    <div class="flex flex-col lg:flex-row gap-6 mb-8">
      <!-- Left: Artist Info -->
      <div class="flex-1">
        <!-- Plan Artist Badge -->
        <span 
          v-if="artist.isPlanArtist"
          class="inline-block plan-artist-badge px-3 py-1 text-xs font-semibold text-white rounded mb-3"
        >
          PLAN ARTIST
        </span>
        
        <!-- Artist Name -->
        <h1 :class="['text-4xl lg:text-5xl font-bold mb-4', isDarkMode ? 'text-white' : 'text-gray-900']">{{ artist.name }}</h1>
        
        <!-- Website -->
        <p v-if="artist.website" class="text-sm mb-2">
          <span class="text-ditto-purple font-medium">Website:</span>
          <a :href="artist.website" target="_blank" :class="['hover:text-ditto-purple ml-1 underline', isDarkMode ? 'text-white' : 'text-gray-900']">
            {{ artist.website.replace(/^https?:\/\//, '') }}
          </a>
        </p>
        
        <!-- Bio -->
        <p v-if="artist.bio" :class="['text-sm mb-4 max-w-lg', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
          <span class="text-ditto-purple font-medium">Bio:</span>
          <span class="ml-1">{{ truncatedBio }}</span>
        </p>
        
        <!-- Social Links -->
        <div class="flex items-center gap-2 mb-5">
          <a 
            v-if="artist.socialLinks.facebook" 
            :href="artist.socialLinks.facebook" 
            target="_blank"
            class="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <IconFacebook class="w-4 h-4 text-white" />
          </a>
          <a 
            v-if="artist.socialLinks.tiktok" 
            :href="artist.socialLinks.tiktok" 
            target="_blank"
            class="w-8 h-8 rounded-full bg-black flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <IconTiktok class="w-4 h-4 text-white" />
          </a>
          <a 
            v-if="artist.socialLinks.twitter" 
            :href="artist.socialLinks.twitter" 
            target="_blank"
            class="w-8 h-8 rounded-full bg-black flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <IconTwitterX class="w-4 h-4 text-white" />
          </a>
          <a 
            v-if="artist.socialLinks.instagram" 
            :href="artist.socialLinks.instagram" 
            target="_blank"
            class="w-8 h-8 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <IconInstagram class="w-4 h-4 text-white" />
          </a>
          <a 
            v-if="artist.socialLinks.youtube" 
            :href="artist.socialLinks.youtube" 
            target="_blank"
            class="w-8 h-8 rounded-full bg-[#FF0000] flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <IconYoutube class="w-4 h-4 text-white" />
          </a>
        </div>
        
        <!-- Edit Artist Info Button -->
        <div class="flex items-center gap-3">
          <button 
            @click="$emit('edit-artist')"
            :class="[
              'px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all duration-200 hover:shadow-lg',
              isDarkMode 
                ? 'border border-gray-600 text-white hover:border-ditto-purple hover:text-ditto-purple' 
                : 'border border-gray-300 text-gray-700 hover:border-ditto-purple hover:text-ditto-purple hover:shadow-ditto-purple/10'
            ]"
          >
            <IconEdit class="w-4 h-4" />
            Edit Artist Info
          </button>
          <Tooltip text="Some profile information is incomplete" position="right">
            <span class="text-warning text-xl cursor-help">⚠</span>
          </Tooltip>
        </div>
      </div>
      
      <!-- Right: Artist Image -->
      <div class="lg:w-[400px] flex-shrink-0">
        <img 
          :src="artist.bannerImage || artist.avatar" 
          :alt="artist.name" 
          class="w-full h-64 lg:h-80 object-cover rounded-2xl shadow-xl"
        />
      </div>
    </div>
    
    <!-- Store IDs Section -->
    <section class="mb-8">
      <h2 :class="['text-lg font-semibold mb-4', isDarkMode ? 'text-white' : 'text-gray-900']">Store ID's</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StoreIdCard store="spotify" :store-id="artist.storeIds.spotify" :is-dark-mode="isDarkMode" />
        <StoreIdCard store="appleMusic" :store-id="artist.storeIds.appleMusic" :is-dark-mode="isDarkMode" />
        <StoreIdCard store="soundcloud" :store-id="artist.storeIds.soundcloud" :is-dark-mode="isDarkMode" />
        <StoreIdCard store="deezer" :store-id="artist.storeIds.deezer" :is-dark-mode="isDarkMode" />
        <StoreIdCard store="audiomack" :store-id="artist.storeIds.audiomack" :is-dark-mode="isDarkMode" />
        <StoreIdCard store="amazon" :store-id="artist.storeIds.amazon" :is-dark-mode="isDarkMode" />
      </div>
    </section>
    
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-8">
      <!-- Top Tracks -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 :class="['text-lg font-semibold', isDarkMode ? 'text-white' : 'text-gray-900']">Top Tracks</h2>
            <p :class="['text-xs', isDarkMode ? 'text-gray-500' : 'text-gray-400']">Last 12 Months</p>
          </div>
          <button class="text-sm text-ditto-purple hover:underline font-medium">See All</button>
        </div>
        
        <div class="space-y-1">
          <SongRow 
            v-for="song in topSongs" 
            :key="song.id" 
            :song="song"
            :is-dark-mode="isDarkMode"
          />
        </div>
      </section>
      
      <!-- Top Countries -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 :class="['text-lg font-semibold', isDarkMode ? 'text-white' : 'text-gray-900']">Top Countries</h2>
            <p :class="['text-xs', isDarkMode ? 'text-gray-500' : 'text-gray-400']">Last 12 Months</p>
          </div>
          <button class="text-sm text-ditto-purple hover:underline font-medium">See All</button>
        </div>
        
        <div class="space-y-2">
          <div 
            v-for="country in topCountries" 
            :key="country.code"
            :class="[
              'flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 hover:scale-[1.01]',
              isDarkMode ? 'hover:bg-[#141414]' : 'hover:bg-white hover:shadow-md'
            ]"
          >
            <span :class="['text-sm font-medium w-6', isDarkMode ? 'text-gray-500' : 'text-gray-400']">{{ country.rank }}</span>
            <img :src="getFlagUrl(country.code)" :alt="country.country" class="w-8 h-6 rounded object-cover shadow-sm" />
            <span :class="['flex-1 text-sm font-medium', isDarkMode ? 'text-white' : 'text-gray-900']">{{ country.country }}</span>
            <span :class="['text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-500']">{{ formatNumber(country.streams) }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Artist, TopSong, TopCountry, Integration } from './artistTypes'
import StoreIdCard from '../../components/artists/StoreIdCard.vue'
import SongRow from '../../components/artists/SongRow.vue'
import { 
  IconEdit, 
  IconFacebook,
  IconTiktok,
  IconTwitterX,
  IconInstagram,
  IconYoutube
} from '../../components/icons/artistIcons'
import Tooltip from '../../components/artists/Tooltip.vue'

const props = defineProps<{
  artist: Artist
  topSongs: TopSong[]
  topCountries: TopCountry[]
  integrations: Integration[]
  isDarkMode: boolean
}>()

defineEmits<{
  (e: 'edit-artist'): void
}>()

const truncatedBio = computed(() => {
  if (!props.artist.bio) return ''
  return props.artist.bio.length > 120 
    ? props.artist.bio.slice(0, 120) + '...' 
    : props.artist.bio
})

const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

// Use flag CDN for consistent flag images
const getFlagUrl = (countryCode: string): string => {
  return `https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`
}
</script>
