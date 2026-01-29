<template>
  <!-- Mobile Header -->
  <header class="md:hidden h-14 flex items-center justify-between px-4 border-b border-ditto-border-grey bg-white">
    <!-- Shop Icon -->
    <button class="w-10 h-10 flex items-center justify-center text-ditto-text">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    </button>
    
    <!-- Centered Logo -->
    <img src="/img/logo-2048-black.svg" alt="Ditto" class="h-5" />
    
    <!-- Hamburger Menu -->
    <button class="w-10 h-10 flex items-center justify-center text-ditto-text">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>
  </header>
  
  <!-- Desktop Header -->
  <header class="hidden md:flex h-[74px] items-center justify-between px-6 border-b border-ditto-border-grey bg-white">
    <!-- Logo and Nav -->
    <div class="flex items-center gap-8">
      <img src="/img/logo-2048-black.svg" alt="Ditto" class="h-6" />
      
      <!-- Nav Items -->
      <nav class="flex items-center gap-6">
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
    <div class="flex items-center gap-4">
      <button class="px-4 py-1.5 bg-success text-ditto-black text-sm font-medium rounded-full hover:opacity-90 transition-opacity">
        Upgrade
      </button>
      
      <button class="w-9 h-9 flex items-center justify-center text-ditto-subtext hover:text-ditto-text transition-colors">
        <IconHelp />
      </button>
      
      <button class="w-9 h-9 flex items-center justify-center text-ditto-subtext hover:text-ditto-text transition-colors">
        <IconCalendar />
      </button>
      
      <button class="px-4 py-1.5 bg-ditto-purple text-white text-sm font-medium rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity">
        <span>🎵</span>
        Create
      </button>
      
      <!-- User Avatar -->
      <button class="w-9 h-9 rounded-full bg-ditto-light-grey overflow-hidden flex items-center justify-center">
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
