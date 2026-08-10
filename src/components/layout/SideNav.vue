<template>
  <!-- Alternative navigation exploration: left rail, collapsible to icons (?nav=side) -->
  <aside
    :class="[
      'hidden md:flex flex-col h-screen sticky top-0 bg-white border-r border-ditto-border-grey flex-shrink-0 transition-[width] duration-300 ease-out z-40',
      collapsed ? 'w-[76px]' : 'w-[248px]'
    ]"
    ref="railRef"
  >
    <!-- Logo -->
    <div class="h-[80px] flex items-center flex-shrink-0" :class="collapsed ? 'justify-center' : 'px-5'">
      <button
        @click="emit('navigate', 'home')"
        aria-label="Ditto home"
        class="group rounded-lg transition-transform duration-200 hover:scale-[1.04] active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ditto-purple/40"
      >
        <img v-if="!collapsed" src="/img/logo-2048-black.svg" alt="Ditto" class="h-9 dark:invert transition-opacity duration-200 group-hover:opacity-80" />
        <img v-else src="/img/logo-mark-black.svg" alt="Ditto" class="h-8 dark:invert transition-opacity duration-200 group-hover:opacity-80" />
      </button>
    </div>

    <!-- Create -->
    <div class="flex-shrink-0" :class="collapsed ? 'px-0 flex justify-center' : 'px-3'">
      <button
        @click.stop="toggleFlyout('create', $event)"
        @mouseenter="showTip($event, 'Create')"
        @mouseleave="hideTip"
        :class="[
          'group relative font-semibold text-white flex items-center justify-center gap-2 overflow-hidden transition-all hover:shadow-lg hover:shadow-ditto-purple/30 animate-gradient-shift',
          collapsed ? 'w-10 h-10 rounded-full' : 'w-full px-4 py-2 text-sm rounded-full'
        ]"
        style="background: linear-gradient(135deg, #5f1fff, #8640f4, #a855f7); background-size: 200% 200%"
      >
        <img src="/img/master-distro-icon.svg" alt="" class="w-4 h-4 relative z-10" />
        <span v-if="!collapsed" class="relative z-10">Create</span>
        <svg v-if="!collapsed" class="w-3 h-3 relative z-10 transition-transform" :class="openFlyout === 'create' ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>

    <!-- Main nav -->
    <nav class="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-1 min-h-0">
      <template v-for="item in navEntries" :key="item.id">
        <!-- Flat link -->
        <button
          v-if="item.type === 'link'"
          @click="item.action ? item.action() : null"
          @mouseenter="showTip($event, item.label)"
          @mouseleave="hideTip"
          :class="[
            'flex items-center rounded-xl text-sm font-medium transition-colors',
            collapsed ? 'w-10 h-10 justify-center mx-auto' : 'w-full gap-3 px-3 py-2.5',
            item.active ? 'bg-ditto-purple/10 text-ditto-purple' : 'text-ditto-text hover:bg-ditto-light-grey'
          ]"
        >
          <svg class="w-5 h-5 flex-shrink-0" :class="item.active ? 'text-ditto-purple' : 'text-ditto-subtext'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="navIcons[item.id]"></svg>
          <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
        </button>

        <!-- Group -->
        <div v-else>
          <button
            @click.stop="collapsed ? toggleFlyout(item.id, $event) : toggleGroup(item.id)"
            @mouseenter="showTip($event, item.label)"
            @mouseleave="hideTip"
            :class="[
              'flex items-center rounded-xl text-sm font-medium transition-colors',
              collapsed ? 'w-10 h-10 justify-center mx-auto' : 'w-full gap-3 px-3 py-2.5',
              item.active ? 'bg-ditto-purple/10 text-ditto-purple' : 'text-ditto-text hover:bg-ditto-light-grey'
            ]"
          >
            <svg class="w-5 h-5 flex-shrink-0" :class="item.active ? 'text-ditto-purple' : 'text-ditto-subtext'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="navIcons[item.id]"></svg>
            <span v-if="!collapsed" class="truncate flex-1 text-left">{{ item.label }}</span>
            <svg v-if="!collapsed" class="w-3.5 h-3.5 flex-shrink-0 transition-transform" :class="[isGroupExpanded(item.id) ? 'rotate-180' : '', item.active ? 'text-ditto-purple/60' : 'text-gray-400']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <!-- Expanded accordion -->
          <div v-if="!collapsed" v-show="isGroupExpanded(item.id)" class="mt-1 ml-5 pl-3 border-l border-gray-200 space-y-0.5">
            <button
              v-for="sub in item.items || []" :key="sub.label"
              @click="sub.action ? sub.action() : null"
              :class="[
                'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-left transition-colors',
                sub.active ? 'bg-ditto-purple/10 text-ditto-purple font-medium' : 'text-ditto-text hover:bg-ditto-light-grey'
              ]"
            >
              <span :class="['w-1.5 h-1.5 rounded-full flex-shrink-0', sub.active ? 'bg-ditto-purple' : 'bg-gray-300']"></span>
              <span class="truncate">{{ sub.label }}</span>
            </button>
          </div>
        </div>
      </template>
    </nav>

    <!-- Bottom cluster -->
    <div class="flex-shrink-0 border-t border-gray-100 px-3 py-3 space-y-1">
      <!-- Upgrade (brand lime, reserved for conversion moments) -->
      <button
        @mouseenter="showTip($event, 'Upgrade')"
        @mouseleave="hideTip"
        :class="[
          'font-bold bg-[#E6FF3A] text-[#0a0a0a] flex items-center justify-center gap-1.5 hover:-translate-y-0.5 transition-transform',
          collapsed ? 'w-10 h-10 rounded-full mx-auto' : 'w-full px-3.5 py-2 text-xs rounded-full'
        ]"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/></svg>
        <span v-if="!collapsed">Upgrade</span>
      </button>

      <!-- Help -->
      <button
        @mouseenter="showTip($event, 'Help & FAQs')"
        @mouseleave="hideTip"
        :class="[
          'flex items-center rounded-xl text-sm font-medium text-ditto-text hover:bg-ditto-light-grey transition-colors',
          collapsed ? 'w-10 h-10 justify-center mx-auto' : 'w-full gap-3 px-3 py-2.5'
        ]"
      >
        <img src="/img/nav-help.svg" alt="" class="w-5 h-5 opacity-60 flex-shrink-0" />
        <span v-if="!collapsed">Help &amp; FAQs</span>
      </button>

      <!-- Account -->
      <button
        @click.stop="toggleFlyout('account', $event)"
        @mouseenter="showTip($event, 'Account')"
        @mouseleave="hideTip"
        :class="[
          'flex items-center rounded-xl transition-colors',
          collapsed ? 'w-10 h-10 justify-center mx-auto hover:bg-ditto-light-grey' : 'w-full gap-3 px-2.5 py-2 hover:bg-ditto-light-grey',
          openFlyout === 'account' ? 'bg-ditto-light-grey' : ''
        ]"
      >
        <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-gray-200">
          <img src="/img/avatar.jpg" alt="User" class="w-full h-full object-cover" />
        </div>
        <div v-if="!collapsed" class="min-w-0 text-left">
          <p class="text-[13px] font-semibold text-ditto-text truncate leading-tight">Goldenboy Entertainment</p>
          <p class="text-[10px] font-semibold text-ditto-purple truncate">DITTO PLUS - RLS</p>
        </div>
        <svg v-if="!collapsed" class="w-3 h-3 text-ditto-subtext ml-auto flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>

      <!-- Collapse toggle -->
      <button
        @click="toggleCollapsed"
        @mouseenter="showTip($event, 'Expand')"
        @mouseleave="hideTip"
        :class="[
          'flex items-center rounded-xl text-sm font-medium text-ditto-subtext hover:bg-ditto-light-grey hover:text-ditto-text transition-colors',
          collapsed ? 'w-10 h-10 justify-center mx-auto' : 'w-full gap-3 px-3 py-2.5'
        ]"
      >
        <svg class="w-5 h-5 flex-shrink-0 transition-transform duration-300" :class="collapsed ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="2"/><line x1="9" y1="4" x2="9" y2="20"/><polyline points="15 10 13 12 15 14"/>
        </svg>
        <span v-if="!collapsed">Collapse</span>
      </button>
    </div>
  </aside>

  <!-- Collapsed-state tooltip (fixed so the scroll container can't clip it) -->
  <Teleport to="body">
    <!-- Basket floats top-right over the content: commerce affordance, not navigation -->
    <button
      @click="emit('toggle-basket')"
      class="hidden md:flex fixed top-8 right-3.5 z-40 w-10 h-10 rounded-full bg-[#141414] shadow-sm items-center justify-center hover:bg-[#2a2a30] hover:shadow-md transition-all"
      aria-label="Basket"
    >
      <img src="/img/nav-basket.svg" alt="" class="w-5 h-5 brightness-0 invert" />
      <span v-if="basketCount > 0" class="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 flex items-center justify-center rounded-full bg-[#E6FF3A] text-[#0a0a0a] text-[10px] font-bold leading-none">{{ basketCount }}</span>
    </button>
    <div
      v-if="tooltip.show && collapsed && !openFlyout"
      class="fixed z-[70] px-2.5 py-1.5 rounded-lg bg-[#101f3c] text-white text-xs font-medium whitespace-nowrap pointer-events-none -translate-y-1/2 shadow-lg"
      :style="{ left: '84px', top: tooltip.top + 'px' }"
    >
      {{ tooltip.label }}
    </div>

    <!-- Flyout panel (create / groups / account) -->
    <div
      v-if="openFlyout"
      ref="flyoutRef"
      class="fixed z-[60] w-60 bg-white rounded-2xl shadow-xl border border-gray-200 py-1.5"
      :style="{ left: flyoutLeft + 'px', top: flyoutTop + 'px' }"
    >
      <!-- Create menu -->
      <template v-if="openFlyout === 'create'">
        <button @click="closeFlyout(); emit('create-music')" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors text-left">
          <img src="/img/nav-musical-note.svg" alt="" class="w-4 h-4" /> Music Release
        </button>
        <button @click="closeFlyout(); emit('create-video')" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors text-left">
          <img src="/img/nav-video-camera.svg" alt="" class="w-4 h-4" /> Video Release
        </button>
        <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors text-left">
          <img src="/img/nav-television.svg" alt="" class="w-4 h-4" /> Video Channel
        </button>
      </template>

      <!-- Account menu -->
      <template v-else-if="openFlyout === 'account'">
        <div class="px-4 py-3 border-b border-gray-200 mb-1">
          <p class="text-sm font-semibold text-ditto-text">Goldenboy Entertainment</p>
          <span class="inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-ditto-purple/15 text-ditto-purple">DITTO PLUS - RLS</span>
        </div>
        <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors text-left">
          <img src="/img/nav-settings.svg" alt="" class="w-4 h-4 opacity-60" /> Account Settings
        </button>
        <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors text-left">
          <img src="/img/nav-clock-history.svg" alt="" class="w-4 h-4 opacity-60" /> Order History
        </button>
        <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors text-left">
          <img src="/img/nav-gift.svg" alt="" class="w-4 h-4 opacity-60" /> Perks
        </button>
        <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors text-left">
          <img src="/img/nav-refer-friend.svg" alt="" class="w-4 h-4 opacity-60" /> Refer a Friend
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
            <img src="/img/nav-logout.svg" alt="" class="w-4 h-4" /> Logout
          </button>
        </div>
      </template>

      <!-- Nav group flyout (collapsed rail) -->
      <template v-else>
        <p class="px-4 pt-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ditto-subtext">{{ flyoutGroup?.label }}</p>
        <button
          v-for="sub in flyoutGroup?.items || []" :key="sub.label"
          @click="sub.action ? (sub.action(), closeFlyout()) : null"
          :class="[
            'w-full px-4 py-2.5 text-sm transition-colors text-left',
            sub.active ? 'text-ditto-purple bg-ditto-purple/5 font-medium' : 'text-ditto-text hover:bg-ditto-light-grey'
          ]"
        >
          {{ sub.label }}
        </button>
      </template>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted, onUnmounted } from 'vue'
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

// Collapsed state persists across reloads so the exploration can be lived with.
const collapsed = ref(localStorage.getItem('ditto-side-nav-collapsed') === '1')
const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
  localStorage.setItem('ditto-side-nav-collapsed', collapsed.value ? '1' : '0')
  closeFlyout()
  hideTip()
}

// Accordion groups (expanded rail)
const expandedGroups = ref<string[]>([])
const toggleGroup = (id: string) => {
  const i = expandedGroups.value.indexOf(id)
  if (i >= 0) expandedGroups.value.splice(i, 1)
  else expandedGroups.value.push(id)
}
const isGroupExpanded = (id: string) => expandedGroups.value.includes(id)

// Flyouts are fixed-positioned (the nav scroll container would clip absolute children).
const railRef = ref<HTMLElement | null>(null)
const flyoutRef = ref<HTMLElement | null>(null)
const openFlyout = ref<string | null>(null)
const flyoutTop = ref(0)
const flyoutLeft = ref(0)
const toggleFlyout = (id: string, e: MouseEvent) => {
  if (openFlyout.value === id) {
    openFlyout.value = null
    return
  }
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  flyoutLeft.value = (railRef.value?.getBoundingClientRect().right ?? r.right) + 8
  // Clamp so tall menus opened near the bottom stay on screen
  flyoutTop.value = Math.max(12, Math.min(r.top, window.innerHeight - 340))
  openFlyout.value = id
  hideTip()
}
const closeFlyout = () => { openFlyout.value = null }
const flyoutGroup = computed(() => navEntries.value.find(i => i.id === openFlyout.value && i.type === 'dropdown'))

const handleClickOutside = (e: MouseEvent) => {
  if (openFlyout.value && flyoutRef.value && !flyoutRef.value.contains(e.target as Node)) {
    openFlyout.value = null
  }
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

// Icon-only tooltip
const tooltip = reactive({ show: false, label: '', top: 0 })
const showTip = (e: MouseEvent, label: string) => {
  if (!collapsed.value) return
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  tooltip.top = r.top + r.height / 2
  tooltip.label = label
  tooltip.show = true
}
const hideTip = () => { tooltip.show = false }

// Same inline icon set as the mobile menu in TopNavbar.
const navIcons: Record<string, string> = {
  artists: '<path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  videos: '<rect x="2" y="4" width="20" height="16" rx="2"/><polygon points="10 8 16 12 10 16"/>',
  royalties: '<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>',
  analytics: '<path d="M3 3v18h18"/><polyline points="7 14 11 10 14 13 20 6"/>',
  promotion: '<path d="M3 11l14-5v12L3 14z"/><path d="M17 8a3.5 3.5 0 0 1 0 6"/><path d="M6 15v3a2 2 0 0 0 2 2h1"/>',
  rights: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
}

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
  {
    id: 'royalties', type: 'dropdown', label: 'Royalties',
    active: props.activeSection === 'royalties',
    items: [
      { label: 'Sales', active: props.activeSection === 'royalties' && props.royaltiesSection === 'sales', action: () => emit('open-royalties', 'sales') },
      { label: 'Collaborations', active: props.activeSection === 'royalties' && props.royaltiesSection === 'collaborations', action: () => emit('open-royalties', 'collaborations') },
      { label: 'Reports', active: props.activeSection === 'royalties' && props.royaltiesSection === 'reports', action: () => emit('open-royalties', 'reports') },
      { label: 'Payouts', active: props.activeSection === 'royalties' && props.royaltiesSection === 'payouts', action: () => emit('open-royalties', 'payouts') },
    ],
  },
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
</script>

<style scoped>
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.animate-gradient-shift {
  animation: gradient-shift 3s ease infinite;
}
</style>
