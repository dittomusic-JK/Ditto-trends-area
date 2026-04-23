<template>
  <!-- Mobile Header -->
  <header class="md:hidden h-16 flex items-center justify-between px-4 border-b border-gray-200 bg-white">
    <img src="/img/logo-2048-black.svg" alt="Ditto" class="h-6" />
    <div class="flex items-center gap-2">
      <button class="group relative px-3 py-1 text-xs font-semibold rounded-full text-white flex items-center gap-1.5 animate-gradient-shift" style="background: linear-gradient(135deg, #5f1fff, #8640f4, #a855f7); background-size: 200% 200%">
        <img src="/img/master-distro-icon.svg" alt="" class="w-3 h-3" />
        Create
      </button>
      <button @click="showMobileMenu = !showMobileMenu" class="w-10 h-10 flex items-center justify-center text-ditto-text">
        <svg v-if="!showMobileMenu" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  </header>

  <!-- Mobile Slide-out Menu -->
  <Transition name="slide">
    <div v-if="showMobileMenu" class="md:hidden fixed inset-0 top-16 z-40 bg-white overflow-y-auto">
      <nav class="px-4 py-4 space-y-1">
        <button
          v-for="item in computedNavItems" :key="item.id"
          @click="item.action ? (item.action(), showMobileMenu = false) : null"
          :class="['w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors', item.active ? 'bg-ditto-purple/10 text-ditto-purple' : 'text-ditto-text hover:bg-ditto-light-grey']"
        >{{ item.label }}</button>
      </nav>
      <div class="border-t border-gray-200 px-4 py-4 space-y-1">
        <button class="w-full text-left px-4 py-3 rounded-xl text-sm text-ditto-text hover:bg-ditto-light-grey">Account Settings</button>
        <button class="w-full text-left px-4 py-3 rounded-xl text-sm text-ditto-text hover:bg-ditto-light-grey">Help & FAQs</button>
        <button class="w-full text-left px-4 py-3 rounded-xl text-sm text-error hover:bg-error/5">Logout</button>
      </div>
    </div>
  </Transition>
  
  <!-- Desktop Header -->
  <header class="hidden md:flex h-[80px] items-center justify-between px-8 lg:px-12 border-b border-ditto-border-grey bg-white">
    <!-- Logo and Nav -->
    <div class="flex items-center gap-8">
      <img src="/img/logo-2048-black.svg" alt="Ditto" class="h-8" />
      
      <!-- Nav Items -->
      <nav class="relative flex items-center gap-6" ref="navRef">
        <button 
          v-for="item in computedNavItems" 
          :key="item.id"
          :ref="(el) => { if (el) navItemRefs[item.id] = el as HTMLElement }"
          @click="item.action ? item.action() : null"
          :class="[
            'text-sm font-medium transition-colors pb-1',
            item.active ? 'text-ditto-purple' : 'text-ditto-text hover:text-ditto-purple'
          ]"
        >
          {{ item.label }}
        </button>
        <!-- Animated underline indicator -->
        <div 
          class="absolute bottom-[-28px] h-[2px] bg-ditto-purple rounded-full transition-all duration-300 ease-out"
          :style="indicatorStyle"
        ></div>
      </nav>
    </div>
    
    <!-- Right side actions -->
    <div class="flex items-center gap-3">
      <button class="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-ditto-purple/30 text-ditto-purple hover:bg-ditto-purple/5 transition-colors flex items-center gap-1.5">
        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/></svg>
        Upgrade
      </button>
      
      <button class="w-9 h-9 flex items-center justify-center text-ditto-subtext hover:text-ditto-text transition-colors">
        <img src="/img/nav-basket.svg" alt="Basket" class="w-5 h-5 opacity-50 hover:opacity-100 transition-opacity" />
      </button>
      
      <div class="relative" ref="helpDropdownRef">
        <button @click="showHelpMenu = !showHelpMenu" class="w-9 h-9 flex items-center justify-center text-ditto-subtext hover:text-ditto-text transition-colors">
          <img src="/img/nav-help.svg" alt="Help" class="w-5 h-5 opacity-50 hover:opacity-100 transition-opacity" />
        </button>
        <div v-if="showHelpMenu" class="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50">
          <button class="w-full flex items-center gap-3 px-4 py-3 text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors text-left">
            <img src="/img/nav-help.svg" alt="" class="w-5 h-5 opacity-60" />
            Try our FAQs
          </button>
          <button class="w-full flex items-center justify-between px-4 py-3 text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors text-left">
            <span class="flex items-center gap-3">
              <img src="/img/nav-chat.svg" alt="" class="w-5 h-5 opacity-60" />
              Start Chat
            </span>
            <img src="/img/nav-angle-right.svg" alt="" class="w-3 h-3 opacity-40" />
          </button>
        </div>
      </div>
      
      <div class="relative" ref="createDropdownRef">
        <button 
          @click="showCreateMenu = !showCreateMenu"
          class="group relative px-4 py-1.5 text-sm font-semibold rounded-full text-white flex items-center gap-2 overflow-hidden transition-all hover:shadow-lg hover:shadow-ditto-purple/30 hover:scale-105 active:scale-100 animate-gradient-shift"
          style="background: linear-gradient(135deg, #5f1fff, #8640f4, #a855f7); background-size: 200% 200%"
        >
          <img src="/img/master-distro-icon.svg" alt="" class="w-4 h-4 relative z-10" />
          <span class="relative z-10">Create</span>
          <svg class="w-3 h-3 relative z-10 transition-transform" :class="showCreateMenu ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <div class="absolute inset-0 bg-white/15 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
        </button>
        <!-- Dropdown -->
        <div 
          v-if="showCreateMenu"
          class="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-200 py-1.5 z-50"
        >
          <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors text-left">
            <img src="/img/nav-musical-note.svg" alt="" class="w-4 h-4" />
            Music Release
          </button>
          <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors text-left">
            <img src="/img/nav-video-camera.svg" alt="" class="w-4 h-4" />
            Video Release
          </button>
          <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors text-left">
            <img src="/img/nav-television.svg" alt="" class="w-4 h-4" />
            Video Channel
          </button>
        </div>
      </div>
      
      <!-- User Avatar Dropdown -->
      <div class="relative" ref="avatarDropdownRef">
        <button @click="showAvatarMenu = !showAvatarMenu" class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-full bg-ditto-purple overflow-hidden flex items-center justify-center">
            <img src="/img/avatar.jpg" alt="User" class="w-full h-full object-cover" />
          </div>
          <svg class="w-3 h-3 text-ditto-subtext transition-transform" :class="showAvatarMenu ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div v-if="showAvatarMenu" class="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50">
          <!-- User Info -->
          <div class="px-4 py-3 border-b border-gray-200">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-ditto-purple overflow-hidden flex items-center justify-center flex-shrink-0">
                <img src="/img/avatar.jpg" alt="User" class="w-full h-full object-cover" />
              </div>
              <div>
                <p class="text-sm font-semibold text-ditto-text">Goldenboy Entertainment</p>
                <span class="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-ditto-purple/15 text-ditto-purple">DITTO PLUS - RLS</span>
              </div>
            </div>
          </div>
          <!-- Menu Items -->
          <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors text-left">
            <img src="/img/nav-settings.svg" alt="" class="w-4 h-4 opacity-60" />
            Account Settings
          </button>
          <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors text-left">
            <img src="/img/nav-clock-history.svg" alt="" class="w-4 h-4 opacity-60" />
            Order History
          </button>
          <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors text-left">
            <img src="/img/nav-gift.svg" alt="" class="w-4 h-4 opacity-60" />
            Perks
          </button>
          <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors text-left">
            <img src="/img/nav-refer-friend.svg" alt="" class="w-4 h-4 opacity-60" />
            Refer a Friend
          </button>
          <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors text-left">
            <img src="/img/nav-globe.svg" alt="" class="w-4 h-4 opacity-60" />
            Language
          </button>
          <div class="border-t border-gray-200 mt-1 pt-1">
            <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error/5 transition-colors text-left">
              <img src="/img/nav-logout.svg" alt="" class="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted, onUnmounted, watch, nextTick } from 'vue'
// Icons loaded as img tags from /img/nav-*.svg
import type { AppSection } from '../../types'

const props = defineProps<{
  activeSection?: AppSection
}>()

const emit = defineEmits<{
  (e: 'navigate', section: AppSection): void
}>()

const navRef = ref<HTMLElement | null>(null)
const navItemRefs: Record<string, HTMLElement> = {}
const indicatorStyle = reactive({ opacity: '0', left: '0px', width: '0px' })

const updateIndicator = () => {
  const activeItem = computedNavItems.value.find(i => i.active)
  if (!activeItem || !navItemRefs[activeItem.id] || !navRef.value) {
    indicatorStyle.opacity = '0'
    return
  }
  const el = navItemRefs[activeItem.id]
  const navRect = navRef.value.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  indicatorStyle.opacity = '1'
  indicatorStyle.left = `${elRect.left - navRect.left}px`
  indicatorStyle.width = `${elRect.width}px`
}

watch(() => props.activeSection, () => { nextTick(updateIndicator) })
onMounted(() => { nextTick(updateIndicator) })

const showMobileMenu = ref(false)
const showCreateMenu = ref(false)
const showAvatarMenu = ref(false)
const showHelpMenu = ref(false)
const createDropdownRef = ref<HTMLElement | null>(null)
const avatarDropdownRef = ref<HTMLElement | null>(null)
const helpDropdownRef = ref<HTMLElement | null>(null)

const handleClickOutside = (e: MouseEvent) => {
  if (createDropdownRef.value && !createDropdownRef.value.contains(e.target as Node)) {
    showCreateMenu.value = false
  }
  if (avatarDropdownRef.value && !avatarDropdownRef.value.contains(e.target as Node)) {
    showAvatarMenu.value = false
  }
  if (helpDropdownRef.value && !helpDropdownRef.value.contains(e.target as Node)) {
    showHelpMenu.value = false
  }
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

const computedNavItems = computed(() => [
  { id: 'music', label: 'Music', active: props.activeSection === 'music', action: () => emit('navigate', 'music') },
  { id: 'artists', label: 'Artists', active: props.activeSection === 'artists', action: () => emit('navigate', 'artists') },
  { id: 'analytics', label: 'Analytics', active: props.activeSection === 'analytics', action: () => emit('navigate', 'analytics') },
  { id: 'royalties', label: 'Royalties', active: props.activeSection === 'royalties', action: () => emit('navigate', 'royalties') },
  { id: 'publishing', label: 'Publishing', active: props.activeSection === 'publishing', action: () => emit('navigate', 'publishing') },
  { id: 'promotion', label: 'Promotion', active: false, action: null },
  { id: 'videos', label: 'Videos', active: false, action: null },
])
</script>

<style scoped>
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.animate-gradient-shift {
  animation: gradient-shift 3s ease infinite;
}
.slide-enter-active, .slide-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
