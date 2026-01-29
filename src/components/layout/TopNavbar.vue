<template>
  <header class="h-14 sm:h-[74px] flex items-center justify-between px-4 sm:px-6 border-b border-ditto-border-grey bg-white">
    <!-- Logo -->
    <div class="flex items-center gap-4 sm:gap-8">
      <img src="/img/logo-2048-black.svg" alt="Ditto" class="h-5 sm:h-6" />
      
      <!-- Nav Items - Hidden on mobile -->
      <nav class="hidden md:flex items-center gap-6">
        <a 
          v-for="item in navItems" 
          :key="item.id"
          :href="item.href"
          :class="[
            'text-sm font-medium transition-colors',
            item.active ? 'text-ditto-purple' : 'text-ditto-text hover:text-ditto-purple'
          ]"
        >
          {{ item.label }}
        </a>
      </nav>
    </div>
    
    <!-- Right side actions -->
    <div class="flex items-center gap-2 sm:gap-4">
      <button class="hidden sm:block px-4 py-1.5 bg-success text-ditto-black text-sm font-medium rounded-full hover:opacity-90 transition-opacity">
        Upgrade
      </button>
      
      <button class="hidden sm:flex w-9 h-9 items-center justify-center text-ditto-subtext hover:text-ditto-text transition-colors">
        <IconHelp />
      </button>
      
      <button class="hidden sm:flex w-9 h-9 items-center justify-center text-ditto-subtext hover:text-ditto-text transition-colors">
        <IconCalendar />
      </button>
      
      <button class="px-3 py-1.5 sm:px-4 bg-ditto-purple text-white text-sm font-medium rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity">
        <span>🎵</span>
        <span class="hidden sm:inline">Create</span>
      </button>
      
      <!-- User Avatar -->
      <button class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-ditto-light-grey overflow-hidden flex items-center justify-center">
        <img src="/img/avatar.jpg" alt="User" class="w-full h-full object-cover" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { IconHelp, IconCalendar } from '../icons'

const navItems = [
  { id: 'artists', label: 'Artists', href: '#', active: false },
  { id: 'music', label: 'Music', href: '#', active: true },
  { id: 'videos', label: 'Videos', href: '#', active: false },
  { id: 'royalties', label: 'Royalties', href: '#', active: false },
  { id: 'analytics', label: 'Analytics', href: '#', active: false },
  { id: 'promotion', label: 'Promotion', href: '#', active: false },
  { id: 'publishing', label: 'Publishing', href: '#', active: false },
]
</script>
