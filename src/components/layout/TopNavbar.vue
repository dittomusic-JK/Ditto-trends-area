<template>
  <!-- Mobile Header -->
  <header class="md:hidden h-16 flex items-center justify-between px-4 border-b border-gray-200 bg-white">
    <button @click="emit('navigate', 'home')" aria-label="Ditto home">
      <img src="/img/logo-2048-black.svg" alt="Ditto" class="h-6 dark:invert" />
    </button>
    <div class="flex items-center gap-2">
      <button @click="showMobileMenu = true" class="group relative px-3 py-1 text-xs font-semibold rounded-full text-white flex items-center gap-1.5 animate-gradient-shift" style="background: linear-gradient(135deg, #5f1fff, #8640f4, #a855f7); background-size: 200% 200%">
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
    <div v-if="showMobileMenu" class="md:hidden fixed inset-0 top-16 z-40 bg-white flex flex-col">
      <div class="flex-1 overflow-y-auto overscroll-contain">
        <!-- Profile (expands into the user subnav) -->
        <button @click="showUserMenu = !showUserMenu" class="w-full flex items-center gap-3 px-5 py-4 text-left bg-gradient-to-r from-ditto-purple/10 to-transparent border-b border-gray-100">
          <div class="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white shadow-sm">
            <img src="/img/avatar.jpg" alt="User" class="w-full h-full object-cover" />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-ditto-text truncate">Goldenboy Entertainment</p>
            <span class="inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-ditto-purple/15 text-ditto-purple">DITTO PLUS - RLS</span>
          </div>
          <svg class="w-4 h-4 text-ditto-subtext ml-auto flex-shrink-0 transition-transform" :class="showUserMenu ? 'rotate-90' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>

        <!-- User subnav -->
        <div v-show="showUserMenu" class="px-4 py-3 border-b border-gray-100 space-y-0.5 bg-ditto-light-grey/40">
          <button class="w-full mb-2 px-3.5 py-2.5 text-xs font-bold rounded-full bg-[#E6FF3A] text-[#0a0a0a] flex items-center justify-center gap-1.5">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/></svg>
            Upgrade
          </button>
          <button @click.stop="toggleTheme" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors text-left">
            <svg class="w-4 h-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <span class="flex-1">Dark Mode</span>
            <span :class="['relative w-8 h-[18px] rounded-full transition-all flex-shrink-0', isDark ? 'bg-gradient-to-b from-white via-[#f3f3fa] to-[#dcdce9] shadow-inner' : 'bg-gray-200']">
              <span :class="['absolute top-[2px] w-[14px] h-[14px] rounded-full shadow transition-all', isDark ? 'left-[18px] bg-ditto-purple' : 'left-[2px] bg-white']"></span>
            </span>
          </button>
          <button @click.stop="toggleNewUser" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors text-left">
            <svg class="w-4 h-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
            <span class="flex-1">New User Demo</span>
            <span :class="['relative w-8 h-[18px] rounded-full transition-all flex-shrink-0', isNewUser ? 'bg-gradient-to-b from-white via-[#f3f3fa] to-[#dcdce9] shadow-inner' : 'bg-gray-200']">
              <span :class="['absolute top-[2px] w-[14px] h-[14px] rounded-full shadow transition-all', isNewUser ? 'left-[18px] bg-ditto-purple' : 'left-[2px] bg-white']"></span>
            </span>
          </button>
          <button class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors">
            <img src="/img/nav-settings.svg" alt="" class="w-4 h-4 opacity-60" /> Account Settings
          </button>
          <button class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors">
            <img src="/img/nav-help.svg" alt="" class="w-4 h-4 opacity-60" /> Help &amp; FAQs
          </button>
          <button class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-error hover:bg-error/5 transition-colors">
            <img src="/img/nav-logout.svg" alt="" class="w-4 h-4" /> Logout
          </button>
        </div>

        <!-- Create -->
        <div class="px-4 pt-4">
          <p class="px-1 mb-2 text-[11px] font-semibold uppercase tracking-wide text-ditto-subtext">Create</p>
          <div class="grid grid-cols-3 gap-2">
            <button @click="emit('create-music'); showMobileMenu = false" class="flex flex-col items-center gap-1.5 py-3.5 rounded-xl bg-ditto-light-grey hover:bg-ditto-purple/10 active:scale-95 transition-all">
              <img src="/img/nav-musical-note.svg" alt="" class="w-5 h-5" />
              <span class="text-[11px] font-medium text-ditto-text">Music</span>
            </button>
            <button @click="emit('create-video'); showMobileMenu = false" class="flex flex-col items-center gap-1.5 py-3.5 rounded-xl bg-ditto-light-grey hover:bg-ditto-purple/10 active:scale-95 transition-all">
              <img src="/img/nav-video-camera.svg" alt="" class="w-5 h-5" />
              <span class="text-[11px] font-medium text-ditto-text">Video</span>
            </button>
            <button class="flex flex-col items-center gap-1.5 py-3.5 rounded-xl bg-ditto-light-grey hover:bg-ditto-purple/10 active:scale-95 transition-all">
              <img src="/img/nav-television.svg" alt="" class="w-5 h-5" />
              <span class="text-[11px] font-medium text-ditto-text">Channel</span>
            </button>
          </div>
        </div>

        <!-- Main nav -->
        <nav class="px-4 pt-5 pb-2">
          <p class="px-1 mb-2 text-[11px] font-semibold uppercase tracking-wide text-ditto-subtext">Menu</p>
          <div class="space-y-1">
            <template v-for="item in mobileNavEntries" :key="item.id">
              <!-- Flat link -->
              <button
                v-if="item.type === 'link'"
                @click="item.action ? (item.action(), showMobileMenu = false) : null"
                :class="[
                  'w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors',
                  item.active ? 'bg-ditto-purple/10 text-ditto-purple' : 'text-ditto-text hover:bg-ditto-light-grey'
                ]"
              >
                <svg class="w-5 h-5 flex-shrink-0" :class="item.active ? 'text-ditto-purple' : 'text-ditto-subtext'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="navIcons[item.id]"></svg>
                {{ item.label }}
                <svg class="w-4 h-4 ml-auto flex-shrink-0" :class="item.active ? 'text-ditto-purple/60' : 'text-gray-300'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>

              <!-- Expandable group (accordion) -->
              <div v-else>
                <button
                  @click="toggleGroup(item.id)"
                  :class="[
                    'w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors',
                    item.active ? 'bg-ditto-purple/10 text-ditto-purple' : 'text-ditto-text hover:bg-ditto-light-grey'
                  ]"
                >
                  <svg class="w-5 h-5 flex-shrink-0" :class="item.active ? 'text-ditto-purple' : 'text-ditto-subtext'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="navIcons[item.id]"></svg>
                  {{ item.label }}
                  <svg class="w-4 h-4 ml-auto flex-shrink-0 transition-transform" :class="[isGroupExpanded(item.id) ? 'rotate-180' : '', item.active ? 'text-ditto-purple/60' : 'text-gray-400']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <div v-show="isGroupExpanded(item.id)" class="mt-1 ml-5 pl-3 border-l border-gray-200 space-y-1">
                  <button
                    v-for="sub in item.items || []" :key="sub.label"
                    @click="sub.action ? (sub.action(), showMobileMenu = false) : null"
                    :class="[
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
                      sub.active ? 'bg-ditto-purple/10 text-ditto-purple font-medium' : 'text-ditto-text hover:bg-ditto-light-grey'
                    ]"
                  >
                    <span :class="['w-1.5 h-1.5 rounded-full flex-shrink-0', sub.active ? 'bg-ditto-purple' : 'bg-gray-300']"></span>
                    {{ sub.label }}
                  </button>
                </div>
              </div>
            </template>
          </div>
        </nav>
      </div>

    </div>
  </Transition>
  
  <!-- Desktop Header -->
  <header class="hidden md:flex h-[80px] items-center justify-between px-8 lg:px-12 border-b border-ditto-border-grey bg-white">
    <!-- Logo and Nav -->
    <div class="flex items-center gap-8">
      <button @click="emit('navigate', 'home')" aria-label="Ditto home" class="cursor-pointer">
        <img src="/img/logo-2048-black.svg" alt="Ditto" class="h-8 dark:invert" />
      </button>
      
      <!-- Nav Items -->
      <nav class="relative flex items-center gap-6" ref="navRef">
        <template v-for="item in navEntries" :key="item.id">
          <!-- Flat link -->
          <button
            v-if="item.type === 'link'"
            :ref="(el) => { if (el) navItemRefs[item.id] = el as HTMLElement }"
            @click="item.action ? item.action() : null"
            :class="[
              'text-sm font-medium transition-colors pb-1',
              item.active ? 'text-ditto-purple' : 'text-ditto-text hover:text-ditto-purple'
            ]"
          >
            {{ item.label }}
          </button>

          <!-- Dropdown -->
          <div
            v-else
            class="relative"
            :ref="(el) => { if (el) navDropdownRefs[item.id] = el as HTMLElement }"
          >
            <button
              :ref="(el) => { if (el) navItemRefs[item.id] = el as HTMLElement }"
              @click="toggleNavDropdown(item.id)"
              :class="[
                'text-sm font-medium transition-colors pb-1 flex items-center gap-1',
                item.active ? 'text-ditto-purple' : 'text-ditto-text hover:text-ditto-purple'
              ]"
            >
              {{ item.label }}
              <svg class="w-3 h-3 transition-transform" :class="openNavDropdown === item.id ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div v-if="openNavDropdown === item.id" class="absolute left-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 py-1.5 z-50">
              <button
                v-for="sub in item.items || []" :key="sub.label"
                @click="sub.action ? (sub.action(), openNavDropdown = null) : null"
                :class="[
                  'w-full px-4 py-2.5 text-sm transition-colors text-left',
                  sub.active ? 'text-ditto-purple bg-ditto-purple/5 font-medium' : 'text-ditto-text hover:bg-ditto-light-grey'
                ]"
              >
                {{ sub.label }}
              </button>
            </div>
          </div>
        </template>
        <!-- Animated underline indicator -->
        <div
          class="absolute bottom-[-28px] h-[2px] bg-ditto-purple rounded-full transition-all duration-300 ease-out"
          :style="indicatorStyle"
        ></div>
      </nav>
    </div>
    
    <!-- Right side actions -->
    <div class="flex items-center gap-3">
      <!-- Brand lime: reserved for conversion moments (btn-lime — lime bg, ink text, hover lift) -->
      <button class="px-3.5 py-1.5 text-xs font-bold rounded-full bg-[#E6FF3A] text-[#0a0a0a] hover:-translate-y-0.5 transition-transform flex items-center gap-1.5">
        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/></svg>
        Upgrade
      </button>
      
      <button class="relative w-9 h-9 flex items-center justify-center text-ditto-subtext hover:text-ditto-text transition-colors" @click="emit('toggle-basket')">
        <img src="/img/nav-basket.svg" alt="Basket" class="w-5 h-5 opacity-50 hover:opacity-100 transition-opacity" />
        <span v-if="basketCount > 0" class="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-ditto-purple text-white text-[10px] font-bold leading-none">{{ basketCount }}</span>
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
          <button @click="showCreateMenu = false; emit('create-music')" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors text-left">
            <img src="/img/nav-musical-note.svg" alt="" class="w-4 h-4" />
            Music Release
          </button>
          <button
            @click="showCreateMenu = false; emit('create-video')"
            class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors text-left"
          >
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
          <button @click.stop="toggleTheme" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors text-left">
            <svg class="w-4 h-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <span class="flex-1">Dark Mode</span>
            <span :class="['relative w-8 h-[18px] rounded-full transition-all flex-shrink-0', isDark ? 'bg-gradient-to-b from-white via-[#f3f3fa] to-[#dcdce9] shadow-inner' : 'bg-gray-200']">
              <span :class="['absolute top-[2px] w-[14px] h-[14px] rounded-full shadow transition-all', isDark ? 'left-[18px] bg-ditto-purple' : 'left-[2px] bg-white']"></span>
            </span>
          </button>
          <button @click.stop="toggleNewUser" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors text-left">
            <svg class="w-4 h-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/>
            </svg>
            <span class="flex-1">New User Demo</span>
            <span :class="['relative w-8 h-[18px] rounded-full transition-all flex-shrink-0', isNewUser ? 'bg-gradient-to-b from-white via-[#f3f3fa] to-[#dcdce9] shadow-inner' : 'bg-gray-200']">
              <span :class="['absolute top-[2px] w-[14px] h-[14px] rounded-full shadow transition-all', isNewUser ? 'left-[18px] bg-ditto-purple' : 'left-[2px] bg-white']"></span>
            </span>
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
import { useBasketStore } from '../../composables/useBasketStore'
import { useTheme } from '../../composables/useTheme'
import { useDemoUser } from '../../composables/useDemoUser'

const props = defineProps<{
  activeSection?: AppSection
  royaltiesSection?: string
}>()

const emit = defineEmits<{
  (e: 'navigate', section: AppSection): void
  (e: 'create-video'): void
  (e: 'create-music'): void
  (e: 'toggle-basket'): void
  (e: 'open-live-performances'): void
  (e: 'open-royalties', section: string): void
}>()

const { isDark, toggleTheme } = useTheme()
const { isNewUser, toggleNewUser } = useDemoUser()

const { basket } = useBasketStore()
const basketCount = computed(() =>
  basket.value.reduce((sum, item) => sum + item.services.length, 0)
)

const navRef = ref<HTMLElement | null>(null)
const navItemRefs: Record<string, HTMLElement> = {}
const navDropdownRefs: Record<string, HTMLElement> = {}
const indicatorStyle = reactive({ opacity: '0', left: '0px', width: '0px' })

const updateIndicator = () => {
  const activeItem = navEntries.value.find(i => i.active)
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
const showUserMenu = ref(false)
const showCreateMenu = ref(false)
const showAvatarMenu = ref(false)
const showHelpMenu = ref(false)
const openNavDropdown = ref<string | null>(null)

// Mobile menu accordion groups (Promotion, Rights Management)
const expandedGroups = ref<string[]>([])
const toggleGroup = (id: string) => {
  const i = expandedGroups.value.indexOf(id)
  if (i >= 0) expandedGroups.value.splice(i, 1)
  else expandedGroups.value.push(id)
}
const isGroupExpanded = (id: string) => expandedGroups.value.includes(id)

// Inline icon markup (injected into an <svg> via v-html) for the mobile menu.
const navIcons: Record<string, string> = {
  artists: '<path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  videos: '<rect x="2" y="4" width="20" height="16" rx="2"/><polygon points="10 8 16 12 10 16"/>',
  royalties: '<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>',
  analytics: '<path d="M3 3v18h18"/><polyline points="7 14 11 10 14 13 20 6"/>',
  promotion: '<path d="M3 11l14-5v12L3 14z"/><path d="M17 8a3.5 3.5 0 0 1 0 6"/><path d="M6 15v3a2 2 0 0 0 2 2h1"/>',
  rights: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
}
const createDropdownRef = ref<HTMLElement | null>(null)
const avatarDropdownRef = ref<HTMLElement | null>(null)
const helpDropdownRef = ref<HTMLElement | null>(null)

const toggleNavDropdown = (id: string) => {
  openNavDropdown.value = openNavDropdown.value === id ? null : id
}

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
  if (openNavDropdown.value) {
    const el = navDropdownRefs[openNavDropdown.value]
    if (el && !el.contains(e.target as Node)) {
      openNavDropdown.value = null
    }
  }
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

interface NavSub {
  label: string
  active?: boolean
  action: (() => void) | null
}
interface NavEntry {
  id: string
  type: 'link' | 'dropdown'
  label: string
  active: boolean
  action?: (() => void) | null
  items?: NavSub[]
}

const navEntries = computed<NavEntry[]>(() => [
  { id: 'artists', type: 'link', label: 'Artists', active: props.activeSection === 'artists', action: () => emit('navigate', 'artists') },
  { id: 'music', type: 'link', label: 'Music', active: props.activeSection === 'music', action: () => emit('navigate', 'music') },
  { id: 'videos', type: 'link', label: 'Videos', active: props.activeSection === 'videos', action: () => emit('navigate', 'videos') },
  { id: 'royalties', type: 'link', label: 'Royalties', active: props.activeSection === 'royalties', action: () => emit('navigate', 'royalties') },
  { id: 'analytics', type: 'link', label: 'Analytics', active: props.activeSection === 'analytics', action: () => emit('navigate', 'analytics') },
  {
    id: 'rights', type: 'dropdown', label: 'Rights Management',
    active: props.activeSection === 'publishing' || props.activeSection === 'neighbouring-rights' || props.activeSection === 'sync',
    items: [
      { label: 'Music Publishing', active: props.activeSection === 'publishing', action: () => emit('navigate', 'publishing') },
      { label: 'Apply for Sync', active: props.activeSection === 'sync', action: () => emit('navigate', 'sync') },
      { label: 'Neighbouring Rights', active: props.activeSection === 'neighbouring-rights', action: () => emit('navigate', 'neighbouring-rights') },
      { label: 'Register Live Performances', action: () => emit('open-live-performances') },
    ],
  },
  {
    id: 'promotion', type: 'dropdown', label: 'Promotion', active: false,
    items: [
      { label: 'Promo Campaigns', action: null },
      { label: 'Ad Launcher', action: null },
      { label: 'Promo Cards', action: null },
      { label: 'AI Artwork Generator', action: null },
    ],
  },
])

// The mobile slide-out mirrors the side rail: Royalties expands into its
// sections instead of being a flat link. Desktop top-nav entries unchanged.
const mobileNavEntries = computed<NavEntry[]>(() =>
  navEntries.value.map(entry => {
    if (entry.id !== 'royalties') return entry
    return {
      id: 'royalties', type: 'dropdown', label: 'Royalties',
      active: props.activeSection === 'royalties',
      items: [
        { label: 'Sales', active: props.activeSection === 'royalties' && props.royaltiesSection === 'sales', action: () => emit('open-royalties', 'sales') },
        { label: 'Collaborations', active: props.activeSection === 'royalties' && props.royaltiesSection === 'collaborations', action: () => emit('open-royalties', 'collaborations') },
        { label: 'Reports', active: props.activeSection === 'royalties' && props.royaltiesSection === 'reports', action: () => emit('open-royalties', 'reports') },
        { label: 'Payouts', active: props.activeSection === 'royalties' && props.royaltiesSection === 'payouts', action: () => emit('open-royalties', 'payouts') },
      ],
    }
  })
)

// Auto-expand the group containing the active section when the mobile menu opens.
watch(showMobileMenu, (open) => {
  if (open) {
    expandedGroups.value = navEntries.value.filter(e => e.type === 'dropdown' && e.active).map(e => e.id)
  }
})
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
