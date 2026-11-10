<!--
  VEVO channels catalogue (Yuliya, 27 Oct 2026): every channel this account has set up
  through Ditto, with edit and delete. The builder's Select Stores step picks from the
  same reactive list, so an edit here shows up there straight away.

  Open questions for Yuliya:
  - Can a channel name be edited after VEVO has provisioned it, or only while Pending?
    (Prototype: editable while Pending or Rejected, read-only once Live.)
  - Does deleting a Live channel need a support ticket rather than a self-serve action?
    (Prototype: Live channels with no linked videos can be deleted self-serve.)
  - Should the catalogue also live under Account settings, or Videos only?
    (Prototype: Videos only, reached from the My Videos header and from the builder.)
-->
<template>
  <div class="px-4 sm:px-6 lg:px-16 pt-4 sm:pt-6 lg:pt-8 pb-16">
    <!-- Header -->
    <button @click="$emit('back')" class="flex items-center gap-1.5 text-sm text-ditto-subtext hover:text-ditto-text transition-colors mb-4">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      Back to Videos
    </button>
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        <div class="flex items-center gap-2.5 mb-1">
          <img src="/img/vevo-icon.svg" alt="" class="w-6 h-6 object-contain" />
          <h1 class="font-satoshi font-black text-xl sm:text-3xl lg:text-[42px] tracking-[-0.03em] text-ditto-text leading-none">VEVO channels</h1>
        </div>
        <p class="text-sm text-ditto-subtext mt-2 max-w-xl">Channels set up through Ditto. New channels take a minimum of 10 days to go live with VEVO.</p>
      </div>
      <button
        v-if="channels.length"
        @click="openCreate"
        class="flex items-center gap-2 px-5 py-2.5 bg-ditto-purple btn-pop-purple text-white text-sm font-medium rounded-full hover:opacity-95 transition-opacity flex-shrink-0"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Create a channel
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="!channels.length" class="rounded-2xl border border-gray-200 py-16 px-6 text-center">
      <div class="w-16 h-16 rounded-full bg-ditto-light-grey flex items-center justify-center mx-auto mb-5">
        <img src="/img/vevo-icon.svg" alt="" class="w-7 h-7 object-contain" />
      </div>
      <p class="text-base font-semibold text-ditto-text mb-1">No VEVO channels yet</p>
      <p class="text-sm text-ditto-subtext max-w-sm mx-auto mb-6">A VEVO channel puts your videos on YouTube under your own artist channel, with monetisation and analytics. You set one up while creating a video release.</p>
      <button @click="openCreate" class="px-6 py-2.5 bg-ditto-purple btn-pop-purple text-white text-sm font-medium rounded-full hover:opacity-95 transition-opacity">Create a channel</button>
    </div>

    <!-- List -->
    <div v-else class="rounded-2xl border border-gray-200 overflow-hidden">
      <div class="hidden md:grid grid-cols-[48px_1fr_140px_120px_90px_120px] gap-4 px-6 py-3 text-xs text-ditto-subtext border-b border-gray-100">
        <span></span><span>Channel</span><span>Status</span><span>Created</span><span>Videos</span><span class="text-right">Actions</span>
      </div>
      <div
        v-for="ch in channels"
        :key="ch.id"
        class="grid grid-cols-[48px_1fr_auto] md:grid-cols-[48px_1fr_140px_120px_90px_120px] gap-4 px-4 md:px-6 py-4 items-center border-t border-gray-50 first:border-t-0 hover:bg-ditto-light-grey/60 transition-colors"
      >
        <!-- Artist image -->
        <div class="w-12 h-12 rounded-xl overflow-hidden bg-ditto-light-grey flex items-center justify-center flex-shrink-0">
          <img v-if="ch.artistImage" :src="ch.artistImage" :alt="ch.artist" class="w-full h-full object-cover" />
          <span v-else class="text-sm font-bold text-ditto-subtext">{{ ch.artist.slice(0, 1) }}</span>
        </div>
        <div class="min-w-0">
          <p class="text-sm font-semibold text-ditto-text truncate">{{ ch.name }}</p>
          <p class="text-xs text-ditto-subtext truncate">{{ ch.artist }}</p>
          <!-- Mobile meta -->
          <p class="md:hidden text-[11px] text-ditto-subtext mt-1">
            <span :class="statusText(ch.status)">{{ vevoStatusLabel[ch.status] }}</span> · {{ fmtDate(ch.createdAt) }} · {{ ch.linkedVideoIds.length }} {{ ch.linkedVideoIds.length === 1 ? 'video' : 'videos' }}
          </p>
        </div>
        <span class="hidden md:inline-flex">
          <span :class="['text-[11px] font-semibold px-2.5 py-1 rounded-full', statusPill(ch.status)]">{{ vevoStatusLabel[ch.status] }}</span>
        </span>
        <span class="hidden md:block text-sm text-ditto-subtext">{{ fmtDate(ch.createdAt) }}</span>
        <span class="hidden md:block text-sm text-ditto-text tabular-nums">{{ ch.linkedVideoIds.length }}</span>
        <div class="flex items-center justify-end gap-1.5">
          <button @click="openEdit(ch)" class="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-ditto-text hover:bg-white hover:border-ditto-purple hover:text-ditto-purple transition-colors" aria-label="Edit channel">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button @click="channelToDelete = ch" class="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-ditto-text hover:bg-white hover:border-error hover:text-error transition-colors" aria-label="Delete channel">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ── Edit modal ── -->
    <div v-if="editing" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4" @click.self="closeEdit">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div class="px-7 pt-7 pb-4 flex items-start justify-between gap-4">
          <div>
            <h2 class="font-satoshi font-black text-xl tracking-[-0.03em] text-ditto-text">Edit channel</h2>
            <p class="text-xs text-ditto-subtext mt-1">{{ editing.name }} · <span :class="statusText(editing.status)">{{ vevoStatusLabel[editing.status] }}</span></p>
          </div>
          <button @click="closeEdit" class="w-8 h-8 -mt-1 -mr-1 rounded-full hover:bg-ditto-light-grey flex items-center justify-center" aria-label="Close">
            <svg class="w-4 h-4 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="px-7 pb-2 overflow-y-auto space-y-6">
          <!-- 10-day notice for channels still pending -->
          <div v-if="editing.status === 'Pending'" class="p-3 rounded-lg bg-warning/10 border border-warning/20 flex items-start gap-2">
            <svg class="w-4 h-4 text-warning flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            <p class="text-xs text-warning leading-relaxed"><strong>Your VEVO channel will take a minimum of 10 days to be set up.</strong> It may take longer depending on VEVO's current timescales.</p>
          </div>

          <!-- Channel name -->
          <div>
            <label class="block text-xs font-medium text-ditto-subtext mb-1">Channel Name <span class="text-error">*</span></label>
            <div class="relative">
              <input
                v-model="draft.base"
                type="text"
                maxlength="20"
                :disabled="!nameEditable"
                :class="[
                  'w-full px-0 py-2.5 pr-14 border-0 border-b text-sm text-ditto-text bg-transparent focus:outline-none transition-colors disabled:text-ditto-subtext',
                  nameError ? 'border-error focus:border-error' : 'border-gray-300 focus:border-ditto-purple'
                ]"
              />
              <span class="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-ditto-purple bg-ditto-purple/10 px-1.5 py-0.5 rounded">VEVO</span>
            </div>
            <p v-if="!nameEditable" class="text-xs text-ditto-subtext mt-1.5">The name is locked once VEVO has provisioned the channel. Contact support to change it.</p>
            <p v-else-if="nameError" class="text-xs text-error mt-1.5">{{ nameError }}</p>
            <p v-else-if="finalName" class="text-xs text-ditto-subtext mt-1.5">Your channel will be <strong class="text-ditto-text">{{ finalName }}</strong> <span class="text-ditto-subtext/70">· {{ finalName.length }}/20</span></p>
            <ul v-if="nameEditable" class="mt-2.5 space-y-1 text-[11px] text-ditto-subtext leading-relaxed">
              <li class="flex items-start gap-1.5"><span class="w-1 h-1 rounded-full bg-ditto-subtext/60 mt-[7px] flex-shrink-0"></span>Must include your artist name</li>
              <li class="flex items-start gap-1.5"><span class="w-1 h-1 rounded-full bg-ditto-subtext/60 mt-[7px] flex-shrink-0"></span>Letters and numbers only, no spaces, symbols or special characters</li>
              <li class="flex items-start gap-1.5"><span class="w-1 h-1 rounded-full bg-ditto-subtext/60 mt-[7px] flex-shrink-0"></span>20 characters max, including "VEVO"</li>
              <li class="flex items-start gap-1.5"><span class="w-1 h-1 rounded-full bg-ditto-subtext/60 mt-[7px] flex-shrink-0"></span>The VEVO tag is added automatically</li>
            </ul>
          </div>

          <!-- Biography -->
          <div>
            <label class="block text-xs font-medium text-ditto-subtext mb-1">Biography</label>
            <textarea v-model="draft.biography" rows="3" placeholder="Tell viewers about the artist…" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-ditto-text bg-white focus:outline-none focus:border-ditto-purple transition-colors resize-none"></textarea>
          </div>

          <!-- Images -->
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-ditto-subtext mb-1">Channel artist image</label>
              <div class="border-2 border-dashed rounded-xl p-4 text-center" :class="draft.artistImage ? 'border-ditto-purple/40 bg-ditto-purple/5' : 'border-gray-300 bg-white'">
                <div v-if="draft.artistImage" class="flex items-center gap-3 text-left">
                  <img :src="draft.artistImage" class="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-medium text-ditto-text truncate">artist-image.jpg</p>
                    <button @click="draft.artistImage = null" class="text-[11px] text-ditto-subtext hover:text-error">Remove</button>
                  </div>
                </div>
                <template v-else>
                  <p class="text-xs font-medium text-ditto-text">Upload artist image</p>
                  <p class="text-[10px] text-ditto-subtext mt-1 leading-relaxed">JPEG · min 5000 × 5000 px · max 15 MB<br />No text or logos · not a pure white background</p>
                  <button @click="draft.artistImage = demoImage" class="mt-2 text-xs font-medium text-ditto-purple hover:underline">Browse</button>
                </template>
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-ditto-subtext mb-1">Channel art</label>
              <div class="border-2 border-dashed rounded-xl p-4 text-center" :class="draft.channelArt ? 'border-ditto-purple/40 bg-ditto-purple/5' : 'border-gray-300 bg-white'">
                <div v-if="draft.channelArt" class="flex items-center gap-3 text-left">
                  <img :src="draft.channelArt" class="w-16 h-9 rounded-lg object-cover flex-shrink-0" />
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-medium text-ditto-text truncate">channel-art.png</p>
                    <button @click="draft.channelArt = null" class="text-[11px] text-ditto-subtext hover:text-error">Remove</button>
                  </div>
                </div>
                <template v-else>
                  <p class="text-xs font-medium text-ditto-text">Upload channel art</p>
                  <p class="text-[10px] text-ditto-subtext mt-1 leading-relaxed">PNG · min 2560 × 1440 px · max 4 MB</p>
                  <button @click="draft.channelArt = demoImage" class="mt-2 text-xs font-medium text-ditto-purple hover:underline">Browse</button>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div class="px-7 py-5 flex items-center justify-end gap-3 border-t border-gray-100 mt-4">
          <button @click="closeEdit" class="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-ditto-text hover:bg-ditto-light-grey transition-colors">Cancel</button>
          <button @click="saveEdit" :disabled="!!nameError || !finalName" class="px-6 py-2.5 rounded-full bg-ditto-purple btn-pop-purple text-white text-sm font-semibold hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity">Save changes</button>
        </div>
      </div>
    </div>

    <!-- ── Create channel popup: the builder's Channel Details form, verbatim ── -->
    <div v-if="creating" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4" @click.self="creating = false">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div class="px-7 pt-7 pb-4 flex items-start justify-between gap-4">
          <div>
            <h2 class="font-satoshi font-black text-xl tracking-[-0.03em] text-ditto-text">Create a channel</h2>
            <p class="text-xs text-ditto-subtext mt-1">Set up a new VEVO channel through Ditto.</p>
          </div>
          <button @click="creating = false" class="w-8 h-8 -mt-1 -mr-1 rounded-full hover:bg-ditto-light-grey flex items-center justify-center" aria-label="Close">
            <svg class="w-4 h-4 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div ref="createBody" class="px-7 pb-2 overflow-y-auto space-y-5">
          <div class="p-3 rounded-lg bg-warning/10 border border-warning/20 flex items-start gap-2">
            <svg class="w-4 h-4 text-warning flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            <p class="text-xs text-warning leading-relaxed"><strong>Please note that your VEVO channel will take a minimum of 10 days to be setup.</strong> It may take longer depending on VEVO's current timescales.</p>
          </div>
          <VevoChannelDetails :stores="newChannel" @update="(key, value) => ((newChannel as any)[key] = value)" />
        </div>

        <div class="px-7 py-5 flex items-center justify-end gap-3 border-t border-gray-100 mt-4">
          <button @click="creating = false" class="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-ditto-text hover:bg-ditto-light-grey transition-colors">Cancel</button>
          <!-- Looks inactive until the form is valid, but still takes the click so the toast can say why -->
          <button
            @click="saveCreate"
            :aria-disabled="!newChannelValid"
            :class="['px-6 py-2.5 rounded-full text-sm font-semibold transition-all', newChannelValid ? 'bg-ditto-purple btn-pop-purple text-white hover:opacity-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed']"
          >Create channel</button>
        </div>
      </div>
    </div>

    <!-- Toast: the form runs below the fold, so an incomplete submit says why -->
    <transition
      enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-y-2" enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0 translate-y-2"
    >
      <div v-if="toast" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] bg-ditto-text text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
        <svg v-if="toastKind === 'warn'" class="w-4 h-4 text-warning flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        <svg v-else class="w-4 h-4 text-success flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12" stroke-linecap="round" stroke-linejoin="round"/></svg>
        {{ toast }}
      </div>
    </transition>

    <!-- ── Delete confirmation ── -->
    <div v-if="channelToDelete" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4" @click.self="channelToDelete = null">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md px-8 py-7">
        <template v-if="channelToDelete.linkedVideoIds.length">
          <h2 class="font-satoshi font-black text-xl tracking-[-0.03em] text-ditto-text">This channel has videos on it</h2>
          <p class="text-sm text-ditto-subtext mt-2 leading-relaxed">
            <strong class="text-ditto-text">{{ channelToDelete.name }}</strong> has {{ channelToDelete.linkedVideoIds.length }} {{ channelToDelete.linkedVideoIds.length === 1 ? 'video' : 'videos' }} delivered to it, so it can't be deleted. Take those videos down or move them to another channel first.
          </p>
          <ul class="mt-4 space-y-1.5 max-h-40 overflow-y-auto">
            <li v-for="v in linkedVideos(channelToDelete)" :key="v.id">
              <button @click="$emit('open-video', v); channelToDelete = null" class="w-full flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-ditto-light-grey text-left transition-colors">
                <img :src="v.artwork" :alt="v.title" class="w-12 h-7 rounded object-cover flex-shrink-0" />
                <span class="text-sm text-ditto-text truncate flex-1">{{ v.title }}</span>
                <svg class="w-3.5 h-3.5 text-ditto-subtext flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </li>
          </ul>
          <div class="flex justify-end mt-6">
            <button @click="channelToDelete = null" class="px-6 py-2.5 rounded-full bg-ditto-text text-white text-sm font-semibold hover:opacity-90 transition-opacity">Got it</button>
          </div>
        </template>
        <template v-else>
          <h2 class="font-satoshi font-black text-xl tracking-[-0.03em] text-ditto-text">Delete {{ channelToDelete.name }}?</h2>
          <p class="text-sm text-ditto-subtext mt-2 leading-relaxed">
            <template v-if="channelToDelete.status === 'Live'">The channel will be removed from VEVO and YouTube. This can't be undone.</template>
            <template v-else-if="channelToDelete.status === 'Pending'">Set-up with VEVO will be cancelled. You can create a new channel at any time.</template>
            <template v-else>The rejected request will be removed. You can create a new channel at any time.</template>
          </p>
          <div class="flex items-center justify-end gap-3 mt-6">
            <button @click="channelToDelete = null" class="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-ditto-text hover:bg-ditto-light-grey transition-colors">Cancel</button>
            <button @click="confirmDelete" class="px-6 py-2.5 rounded-full bg-error text-white text-sm font-semibold hover:opacity-90 transition-opacity">Delete channel</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { existingVevoChannels, vevoStatusLabel, videoReleases } from '../../data/videoMockData'
import type { VevoChannel, VideoRelease } from '../../data/videoMockData'
import VevoChannelDetails from './steps/VevoChannelDetails.vue'
import type { VevoChannelDetailsData } from './steps/VevoChannelDetails.vue'

defineEmits<{
  (e: 'back'): void
  (e: 'create-channel'): void
  (e: 'open-video', video: VideoRelease): void
}>()

const channels = existingVevoChannels
const demoImage = 'https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/03377228/artwork/transforms/darkoo-x-rema-favourite-girl-1-66b2194cd1729760795317-small.jpg'

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const statusPill = (s: VevoChannel['status']) =>
  s === 'Live' ? 'bg-[#e6fbf1] text-[#0f8a4f]' : s === 'Pending' ? 'bg-[#fdf1cc] text-[#92400e]' : 'bg-error/10 text-error'
const statusText = (s: VevoChannel['status']) =>
  s === 'Live' ? 'text-[#0f8a4f]' : s === 'Pending' ? 'text-[#92400e]' : 'text-error'

const linkedVideos = (ch: VevoChannel) => videoReleases.filter(v => ch.linkedVideoIds.includes(v.id))

// ── Create (popup with the builder's Channel Details form) ──
const creating = ref(false)
const newChannel = reactive<VevoChannelDetailsData>({ vevoChannelName: '', vevoBiography: '', vevoArtistImage: null, vevoBanner: null })
const openCreate = () => {
  Object.assign(newChannel, { vevoChannelName: '', vevoBiography: '', vevoArtistImage: null, vevoBanner: null })
  creating.value = true
}
const newChannelFinalName = computed(() => {
  const base = newChannel.vevoChannelName.trim().replace(/vevo$/i, '')
  return base ? base + 'VEVO' : ''
})
const newChannelValid = computed(() =>
  /^[A-Za-z0-9]+$/.test(newChannel.vevoChannelName.trim()) && newChannelFinalName.value.length <= 20
)
const createBody = ref<HTMLElement | null>(null)
const toast = ref('')
const toastKind = ref<'ok' | 'warn'>('ok')
let toastTimer: ReturnType<typeof setTimeout> | undefined
const showToast = (msg: string, kind: 'ok' | 'warn' = 'ok') => {
  toast.value = msg; toastKind.value = kind
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 3200)
}
const saveCreate = () => {
  if (!newChannelValid.value) {
    // Say what's missing and bring the field back into view
    showToast(newChannel.vevoChannelName.trim() ? 'Fix the channel name to continue' : 'Add a channel name to continue', 'warn')
    createBody.value?.scrollTo({ top: 0, behavior: 'smooth' })
    createBody.value?.querySelector<HTMLInputElement>('input[type="text"]')?.focus({ preventScroll: true })
    return
  }
  const name = newChannelFinalName.value
  channels.unshift({
    id: `vc-${Date.now()}`,
    name,
    artist: name.replace(/VEVO$/, ''),
    status: 'Pending',
    createdAt: new Date().toISOString().slice(0, 10),
    biography: newChannel.vevoBiography.trim(),
    artistImage: newChannel.vevoArtistImage ? URL.createObjectURL(newChannel.vevoArtistImage) : null,
    channelArt: newChannel.vevoBanner ? URL.createObjectURL(newChannel.vevoBanner) : null,
    linkedVideoIds: [],
  })
  creating.value = false
  showToast(`${name} created. Set-up takes a minimum of 10 days.`)
}

// ── Edit ──
const editing = ref<VevoChannel | null>(null)
const draft = reactive({ base: '', biography: '', artistImage: null as string | null, channelArt: null as string | null })

const openEdit = (ch: VevoChannel) => {
  editing.value = ch
  draft.base = ch.name.replace(/VEVO$/i, '')
  draft.biography = ch.biography
  draft.artistImage = ch.artistImage
  draft.channelArt = ch.channelArt
}
const closeEdit = () => { editing.value = null }

// Name follows the builder's rules; only editable before VEVO provisions the channel
const nameEditable = computed(() => editing.value?.status !== 'Live')
const finalName = computed(() => {
  const base = draft.base.trim().replace(/vevo$/i, '')
  return base ? base + 'VEVO' : ''
})
const nameError = computed(() => {
  const name = draft.base.trim()
  if (!name) return 'Enter a channel name.'
  if (!/^[A-Za-z0-9]+$/.test(name)) return 'Letters and numbers only, remove spaces, symbols or special characters.'
  if (finalName.value.length > 20) return `Too long: ${finalName.value.length} characters including "VEVO", the limit is 20.`
  return null
})

const saveEdit = () => {
  if (!editing.value || nameError.value) return
  const ch = editing.value
  if (nameEditable.value) ch.name = finalName.value
  ch.biography = draft.biography.trim()
  ch.artistImage = draft.artistImage
  ch.channelArt = draft.channelArt
  editing.value = null
}

// ── Delete ──
const channelToDelete = ref<VevoChannel | null>(null)
const confirmDelete = () => {
  const ch = channelToDelete.value
  if (!ch || ch.linkedVideoIds.length) return
  const i = channels.findIndex(c => c.id === ch.id)
  if (i !== -1) channels.splice(i, 1)
  channelToDelete.value = null
}
</script>
