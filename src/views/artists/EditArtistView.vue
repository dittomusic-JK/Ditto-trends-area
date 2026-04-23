<template>
<div class="p-6 lg:p-8">
    <!-- Header -->
    <div class="flex items-start justify-between gap-6 mb-8">
      <h1 :class="['text-3xl lg:text-4xl font-bold', isDarkMode ? 'text-white' : 'text-gray-900']">{{ isNew ? 'Add New Artist' : 'Edit Artist' }}</h1>
      
      <!-- Info Tooltip -->
      <div class="flex-shrink-0 max-w-xs p-4 bg-gray-800 text-white text-sm rounded-xl">
        Fill out as much information as you can about your artist, we'll sync all of this data across multiple platforms.
      </div>
    </div>
    
    <!-- Artist Avatar & Name Section -->
    <div class="flex items-start gap-5 mb-6">
      <!-- Avatar Upload -->
      <div class="relative">
        <!-- Show placeholder for new artist, image for existing -->
        <div 
          v-if="isNew && !hasCustomAvatar"
          :class="['w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center', isDarkMode ? 'bg-[#0F0E0E] border-gray-600' : 'bg-gray-100 border-gray-300']"
        >
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
        <img 
          v-else
          :src="formData.avatar" 
          :alt="formData.name" 
          class="w-20 h-20 rounded-full object-cover border-2 border-ditto-purple"
        />
        <button class="absolute bottom-0 right-0 w-7 h-7 bg-ditto-purple rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </button>
      </div>
      
      <!-- Artist Name -->
      <div class="flex-1">
        <label :class="['block text-xs mb-1', isDarkMode ? 'text-gray-400' : 'text-gray-500']">Artist Name</label>
        <input 
          v-model="formData.name"
          type="text"
          :class="['w-full text-xl font-medium border-b pb-2 focus:border-ditto-purple focus:outline-none transition-colors bg-transparent', isDarkMode ? 'text-white border-gray-700' : 'text-gray-900 border-gray-200']"
        />
      </div>
    </div>
    
    <!-- Toggle Options -->
    <div class="flex flex-wrap gap-8 mb-6">
      <div class="flex items-center gap-3">
        <Tooltip text="Plan artists are included in your monthly subscription" position="bottom">
          <span :class="['text-sm cursor-help border-b border-dashed', isDarkMode ? 'text-gray-300 border-gray-500' : 'text-gray-700 border-gray-400']">Include artist in Plan?</span>
        </Tooltip>
        <ToggleSwitch v-model="formData.isPlanArtist" />
      </div>
      
      <div class="flex items-center gap-3">
        <Tooltip text="This helps us identify and link existing profiles" position="bottom">
          <span :class="['text-sm cursor-help border-b border-dashed', isDarkMode ? 'text-gray-300 border-gray-500' : 'text-gray-700 border-gray-400']">Have they released music before?</span>
        </Tooltip>
        <ToggleSwitch v-model="formData.hasReleasedBefore" />
      </div>
    </div>
    
    <!-- Store IDs Section -->
    <section class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h2 :class="['text-lg font-semibold', isDarkMode ? 'text-white' : 'text-gray-900']">Store IDs</h2>
        <div :class="['max-w-xs p-2 text-xs rounded-lg', isDarkMode ? 'bg-[#0F0E0E] text-gray-400' : 'bg-gray-100 text-gray-600']">
          Entering store ID's helps us match your music to the correct profile.
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <StoreIdInput label="Apple Music ID" v-model="formData.storeIds.appleMusic" :verified="!!formData.storeIds.appleMusic" tooltip="Find in iTunes Connect under Artist page URL" />
        <StoreIdInput label="Spotify ID" v-model="formData.storeIds.spotify" :verified="!!formData.storeIds.spotify" tooltip="Find in Spotify Artist URI - last part of your artist URL" />
        <StoreIdInput label="Soundcloud ID" v-model="formData.storeIds.soundcloud" placeholder="Enter ID if you have one" tooltip="Your Soundcloud user ID from profile settings" />
        <StoreIdInput label="Deezer ID" v-model="formData.storeIds.deezer" placeholder="Enter ID if you have one" tooltip="Find in your Deezer artist page URL" />
        <StoreIdInput label="Audiomack ID" v-model="formData.storeIds.audiomack" placeholder="Enter ID if you have one" tooltip="Your Audiomack username or ID" />
        <StoreIdInput label="Amazon ID" v-model="formData.storeIds.amazon" placeholder="Enter ID if you have one" tooltip="Find in Amazon Music artist page URL" />
      </div>
    </section>
    
    <!-- Artist Overview Section -->
    <section class="mb-6">
      <h2 :class="['text-lg font-semibold mb-3', isDarkMode ? 'text-white' : 'text-gray-900']">Artist Overview</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <SelectInput label="Type" v-model="formData.type" :options="typeOptions" />
        <SelectInput label="Role" v-model="formData.role" :options="roleOptions" />
        <SelectInput label="Main Genre" v-model="formData.genre" :options="genreOptions" />
        <SelectInput label="Country" v-model="formData.country" :options="countryOptions" />
      </div>
      
      <div>
        <label :class="['block text-xs mb-1', isDarkMode ? 'text-gray-400' : 'text-gray-500']">Artist Bio</label>
        <textarea 
          v-model="formData.bio"
          rows="3"
          :class="['w-full p-3 border rounded-xl text-sm focus:border-ditto-purple focus:outline-none focus:ring-1 focus:ring-ditto-purple transition-all resize-none', isDarkMode ? 'bg-[#0F0E0E] border-gray-700 text-white placeholder-gray-500' : 'border-gray-200 text-gray-900']"
          placeholder="Tell us about the artist..."
        ></textarea>
      </div>
    </section>
    
    <!-- Social Accounts Section -->
    <section class="mb-6">
      <h2 :class="['text-lg font-semibold mb-3', isDarkMode ? 'text-white' : 'text-gray-900']">Social Accounts</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <TextInput label="Website URL" v-model="formData.website" placeholder="https://" />
        <TextInput label="Facebook Handle" v-model="formData.socialHandles.facebook" prefix="@" />
        <TextInput label="X Handle" v-model="formData.socialHandles.twitter" />
        <TextInput label="Instagram Handle" v-model="formData.socialHandles.instagram" />
        <TextInput label="Youtube Handle" v-model="formData.socialHandles.youtube" />
        <TextInput label="TikTok Handle" v-model="formData.socialHandles.tiktok" />
      </div>
    </section>
    
    <!-- Footer Actions -->
    <div :class="['flex items-center justify-between pt-4 border-t', isDarkMode ? 'border-gray-700' : 'border-gray-200']">
      <button 
        @click="$emit('cancel')"
        :class="['text-sm transition-colors', isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900']"
      >
        Cancel
      </button>
      
      <button 
        @click="handleSave"
        class="px-6 py-2.5 bg-ditto-purple text-white text-sm font-medium rounded-full hover:opacity-90 transition-opacity shadow-md shadow-ditto-purple/25"
      >
        {{ isNew ? 'Add Artist' : 'Update Artist' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Artist } from './artistTypes'

// Sub-components (inline for simplicity)
import ToggleSwitch from '../../components/artists/ToggleSwitch.vue'
import StoreIdInput from '../../components/artists/StoreIdInput.vue'
import SelectInput from '../../components/artists/SelectInput.vue'
import TextInput from '../../components/artists/TextInput.vue'
import Tooltip from '../../components/artists/Tooltip.vue'

const props = defineProps<{
  artist?: Artist
  isNew?: boolean
  isDarkMode?: boolean
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'save', data: typeof formData): void
}>()

// Default empty values for new artist
const defaultStoreIds = {
  appleMusic: '',
  spotify: '',
  soundcloud: '',
  deezer: '',
  audiomack: '',
  amazon: ''
}

const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop'

// Track if user has uploaded a custom avatar
const hasCustomAvatar = ref(false)

const formData = reactive({
  name: props.artist?.name || '',
  avatar: props.artist?.avatar || defaultAvatar,
  isPlanArtist: props.artist?.isPlanArtist || false,
  hasReleasedBefore: props.isNew ? false : true,
  storeIds: props.artist?.storeIds ? { ...props.artist.storeIds } : { ...defaultStoreIds },
  type: 'Solo Artist',
  role: 'Vocalist',
  genre: 'Rock',
  country: 'United Kingdom',
  bio: props.artist?.bio || '',
  website: props.artist?.website || '',
  socialHandles: {
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    tiktok: '',
  }
})

const typeOptions = ['Solo Artist', 'Band', 'DJ', 'Producer', 'Duo']
const roleOptions = ['Vocalist', 'Instrumentalist', 'Producer', 'DJ', 'Songwriter']
const genreOptions = ['Rock', 'Pop', 'Hip Hop', 'R&B', 'Electronic', 'Country', 'Jazz', 'Classical']
const countryOptions = ['United Kingdom', 'United States', 'Canada', 'Australia', 'Germany', 'France']

const handleSave = () => {
  emit('save', formData)
}
</script>
