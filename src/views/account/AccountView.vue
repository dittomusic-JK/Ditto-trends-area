<template>
  <div class="max-w-[1160px]">
    <!-- Header: title left, member info right; tabs on their own row beneath (Royalties pattern) -->
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
      <h1 class="font-satoshi font-black text-xl sm:text-3xl lg:text-[42px] tracking-tight text-ditto-text">Your Account</h1>
      <div class="sm:text-right">
        <p class="text-sm font-semibold text-ditto-text">{{ profile.name }}</p>
        <p class="text-xs text-ditto-subtext">{{ billing.planName }} · Member since {{ profile.memberSince }}</p>
      </div>
    </div>
    <div class="mb-8">
      <LiquidTabs :tabs="tabs" :active="activeTab" @select="activeTab = $event as AccountTab" />
    </div>

    <!-- ══════════ OVERVIEW ══════════ -->
    <div v-if="activeTab === 'overview'" class="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-7">
      <!-- Identity -->
      <div class="bg-white rounded-2xl border border-gray-200 p-7 lg:p-8 flex flex-col items-start">
        <div class="w-28 h-28 rounded-full overflow-hidden ring-4 ring-ditto-light-grey">
          <img :src="profile.avatar" alt="" class="w-full h-full object-cover" />
        </div>
        <p class="font-satoshi font-black text-3xl tracking-[-0.03em] text-ditto-text mt-5">{{ profile.name }}</p>
        <p class="text-[15px] text-ditto-subtext mt-0.5 flex items-center gap-1.5">
          {{ profile.email }}
        </p>
        <button v-if="!profile.emailVerified" @click="activeTab = 'settings'" class="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border border-error text-error hover:bg-error/5 transition-colors">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="9" stroke-width="1.8"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          Email not verified
        </button>
        <span class="mt-3 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-ditto-purple/15 text-ditto-purple">{{ billing.planTag }}</span>

        <div class="w-full border-t border-gray-100 mt-7 pt-2 text-[15px] divide-y divide-gray-100">
          <div class="flex items-center justify-between py-3">
            <span class="text-ditto-subtext">Password</span>
            <button @click="activeTab = 'security'" class="font-medium text-ditto-purple hover:underline">Changed {{ security.passwordChangedOn }}</button>
          </div>
          <div class="flex items-center justify-between py-3">
            <span class="text-ditto-subtext">Two-factor</span>
            <button @click="activeTab = 'security'" class="font-medium hover:underline" :class="security.twoFactorEnabled ? 'text-success' : 'text-[#92400e]'">{{ security.twoFactorEnabled ? 'On' : 'Off — turn on' }}</button>
          </div>
          <div class="flex items-center justify-between py-3">
            <span class="text-ditto-subtext">Currency</span>
            <span class="font-medium text-ditto-text">{{ profile.currency.symbol }} / {{ profile.currency.code }}</span>
          </div>
        </div>
        <button @click="activeTab = 'settings'" class="mt-7 w-full px-5 py-3 rounded-full border border-gray-200 text-sm font-semibold text-ditto-text hover:border-ditto-purple hover:text-ditto-purple transition-colors">Edit profile</button>
      </div>

      <div class="space-y-7">
        <!-- Plan -->
        <div class="bg-white rounded-2xl border border-gray-200 p-7 lg:p-8">
          <div class="flex items-start justify-between gap-4 mb-5">
            <h3 class="font-satoshi font-black tracking-[-0.03em] text-xl text-ditto-text">Your plan</h3>
            <button @click="emit('navigate', 'subscriptions')" class="px-4 py-2 rounded-full bg-ditto-purple btn-pop-purple text-white text-xs font-semibold hover:opacity-95 transition-opacity">Manage plan</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
            <div class="relative overflow-hidden rounded-2xl p-5 text-white plan-tile min-h-[150px] flex flex-col justify-end">
              <span class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/15 pointer-events-none"></span>
              <span class="relative inline-flex self-start text-[10px] font-bold uppercase tracking-[0.14em] bg-[#E6FF3A] text-[#0a0a0a] px-2.5 py-1 rounded-full mb-2">{{ billing.planTag }}</span>
              <p class="relative font-satoshi font-black text-3xl tracking-[-0.03em]">{{ billing.planName }}</p>
              <p class="relative text-xs text-white/70">{{ profile.currency.symbol }}{{ billing.amountDue }}/year</p>
            </div>
            <div>
              <p class="text-[15px] text-ditto-text leading-relaxed">{{ billing.planBlurb }}</p>
              <!-- Plan artists usage — the number the dashboard buries in a line of text -->
              <div class="mt-4">
                <div class="flex items-center justify-between text-[15px] mb-2">
                  <span class="font-semibold text-ditto-text">Plan artists</span>
                  <span class="text-ditto-subtext"><span class="font-semibold text-ditto-text">{{ billing.planArtistsUsed }}</span> of {{ billing.planArtists }} used</span>
                </div>
                <div class="flex gap-1.5 h-2.5">
                  <span v-for="i in billing.planArtists" :key="i" class="flex-1 rounded-full" :class="i <= billing.planArtistsUsed ? 'bg-ditto-purple' : 'bg-ditto-light-grey'"></span>
                </div>
                <button @click="emit('navigate', 'artists')" class="mt-2 text-xs font-medium text-ditto-purple hover:underline">Manage artists →</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Billing -->
        <div class="bg-white rounded-2xl border border-gray-200 p-7 lg:p-8">
          <h3 class="font-satoshi font-black tracking-[-0.03em] text-xl text-ditto-text mb-5">Billing &amp; payments</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <p class="text-[13px] text-ditto-subtext mb-1.5">Next payment</p>
              <p class="font-satoshi font-black text-3xl tracking-[-0.03em] text-ditto-text">{{ profile.currency.symbol }}{{ billing.amountDue }}<span class="text-sm font-medium text-ditto-subtext">.00</span></p>
              <p class="text-[15px] text-ditto-subtext">Due {{ billing.renewsOn }}</p>
            </div>
            <div>
              <p class="text-[13px] text-ditto-subtext mb-1.5">Payment method</p>
              <p class="text-[15px] font-semibold text-ditto-text flex items-center gap-2">
                <span class="inline-flex items-center justify-center w-9 h-6 rounded bg-ditto-text text-white text-[9px] font-black tracking-wide">{{ billing.paymentMethod.brand.toUpperCase() }}</span>
                •••• {{ billing.paymentMethod.last4 }}
              </p>
              <p class="text-[15px] text-ditto-subtext">Expires {{ billing.paymentMethod.expires }}</p>
            </div>
            <div>
              <p class="text-[13px] text-ditto-subtext mb-1.5">Last payment</p>
              <p class="text-[15px] font-semibold text-ditto-text">{{ profile.currency.symbol }}{{ billing.lastPayment.amount }} · {{ billing.lastPayment.date }}</p>
              <p class="text-[15px] text-ditto-subtext">{{ billing.lastPayment.description }}</p>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-3 mt-7 pt-6 border-t border-gray-100">
            <button @click="note('Payment history would open here')" class="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-ditto-text hover:border-ditto-purple hover:text-ditto-purple transition-colors">Payment history</button>
            <button @click="note('Card update would open here')" class="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-ditto-text hover:border-ditto-purple hover:text-ditto-purple transition-colors">Update card</button>
            <label class="ml-auto flex items-center gap-3 text-sm text-ditto-text cursor-pointer">
              <span>Pay renewals from royalties</span>
              <Toggle v-model="prefs.payWithRoyalties" />
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════ SECURITY ══════════ -->
    <div v-else-if="activeTab === 'security'" class="grid grid-cols-1 lg:grid-cols-2 gap-7 items-start">
      <!-- Password -->
      <div class="bg-white rounded-2xl border border-gray-200 p-7 lg:p-8">
        <div class="flex items-start justify-between gap-4 mb-1">
          <h3 class="font-satoshi font-black tracking-[-0.03em] text-xl text-ditto-text">Password</h3>
          <span class="text-xs text-ditto-subtext">Last changed {{ security.passwordChangedOn }}</span>
        </div>
        <p class="text-[15px] text-ditto-subtext mb-5">Change it here, or we can email you a reset link if you've forgotten it.</p>
        <div class="space-y-4">
          <div>
            <label class="block text-[13px] font-medium text-ditto-subtext mb-1.5">Current password</label>
            <input v-model="pw.current" type="password" placeholder="••••••••••••" :class="fieldClass" />
          </div>
          <div>
            <label class="block text-[13px] font-medium text-ditto-subtext mb-1.5">New password</label>
            <input v-model="pw.next" type="password" placeholder="At least 12 characters" :class="fieldClass" />
            <!-- Strength: something the live page doesn't give you -->
            <div class="flex gap-1 mt-2 h-1">
              <span v-for="i in 4" :key="i" class="flex-1 rounded-full transition-colors" :class="i <= strength.level ? strength.colour : 'bg-ditto-light-grey'"></span>
            </div>
            <p class="text-[11px] mt-1" :class="strength.level >= 3 ? 'text-success' : 'text-ditto-subtext'">{{ strength.label }}</p>
          </div>
          <div>
            <label class="block text-[13px] font-medium text-ditto-subtext mb-1.5">Confirm new password</label>
            <input v-model="pw.confirm" type="password" placeholder="Repeat it" :class="fieldClass" />
            <p v-if="pw.confirm && pw.confirm !== pw.next" class="text-[11px] text-error mt-1">Passwords don't match.</p>
          </div>
        </div>
        <div class="flex items-center gap-3 mt-6">
          <button :disabled="!canChangePassword" @click="changePassword" :class="['px-5 py-2.5 rounded-full text-sm font-semibold transition-all', canChangePassword ? 'bg-ditto-purple btn-pop-purple text-white hover:opacity-95' : 'bg-ditto-light-grey text-ditto-subtext/50 cursor-not-allowed']">Change password</button>
          <button @click="note(`Reset link sent to ${profile.email}`)" class="text-sm font-medium text-ditto-purple hover:underline">Email me a reset link</button>
        </div>
      </div>

      <div class="space-y-7">
        <!-- Two-factor (new — the biggest security gap on the live page) -->
        <div class="bg-white rounded-2xl border border-gray-200 p-7 lg:p-8">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="font-satoshi font-black tracking-[-0.03em] text-xl text-ditto-text flex items-center gap-2">
                Two-factor authentication
                <span v-if="!security.twoFactorEnabled" class="text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full bg-[#E6FF3A] text-[#0a0a0a]">Recommended</span>
              </h3>
              <p class="text-[15px] text-ditto-subtext mt-1 max-w-md">Protect your royalties with a code from an authenticator app whenever you sign in on a new device.</p>
            </div>
            <Toggle v-model="security.twoFactorEnabled" @update:model-value="note(security.twoFactorEnabled ? 'Two-factor authentication turned on' : 'Two-factor authentication turned off')" />
          </div>
          <p v-if="security.twoFactorEnabled" class="mt-4 inline-flex items-center gap-2 text-xs font-medium text-[#006633] bg-[#00e785]/10 px-3 py-1.5 rounded-full">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            On — authenticator app · <button class="underline" @click="note('Recovery codes would download here')">recovery codes</button>
          </p>
        </div>

        <!-- Security question -->
        <div class="bg-white rounded-2xl border border-gray-200 p-7 lg:p-8">
          <h3 class="font-satoshi font-black tracking-[-0.03em] text-xl text-ditto-text">Security question</h3>
          <p class="text-[15px] text-ditto-subtext mt-1 mb-4">We'll ask this when we need to confirm it's you, like on a payout change.</p>
          <div v-if="security.securityQuestionSet && !editingQuestion" class="flex items-center justify-between gap-4">
            <p class="text-sm text-ditto-text"><span class="font-semibold">Set</span> · {{ securityQuestions[0] }}</p>
            <button @click="editingQuestion = true" class="text-sm font-medium text-ditto-purple hover:underline flex-shrink-0">Change</button>
          </div>
          <div v-else class="space-y-3">
            <select v-model="sq.question" :class="fieldClass"><option value="" disabled>Choose a question</option><option v-for="q in securityQuestions" :key="q" :value="q">{{ q }}</option></select>
            <input v-model="sq.answer" type="text" placeholder="Your answer" :class="fieldClass" />
            <div class="flex items-center gap-3">
              <button :disabled="!sq.question || !sq.answer.trim()" @click="saveQuestion" :class="['px-5 py-2 rounded-full text-sm font-semibold', sq.question && sq.answer.trim() ? 'bg-ditto-purple btn-pop-purple text-white' : 'bg-ditto-light-grey text-ditto-subtext/50 cursor-not-allowed']">Save</button>
              <button v-if="security.securityQuestionSet" @click="editingQuestion = false" class="text-[15px] text-ditto-subtext hover:text-ditto-text">Cancel</button>
            </div>
          </div>
        </div>

        <!-- Sessions (new) -->
        <div class="bg-white rounded-2xl border border-gray-200 p-7 lg:p-8">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-satoshi font-black tracking-[-0.03em] text-xl text-ditto-text">Where you're signed in</h3>
            <button @click="signOutOthers" class="text-xs font-medium text-error hover:underline">Sign out everywhere else</button>
          </div>
          <div class="divide-y divide-gray-100">
            <div v-for="s in security.sessions" :key="s.id" class="flex items-center gap-3 py-3.5">
              <span class="w-9 h-9 rounded-full bg-ditto-light-grey flex items-center justify-center text-ditto-subtext flex-shrink-0">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 21h8" stroke-linecap="round"/></svg>
              </span>
              <div class="flex-1 min-w-0">
                <p class="text-[15px] font-medium text-ditto-text">{{ s.device }} <span v-if="s.current" class="ml-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-success/15 text-success">This device</span></p>
                <p class="text-xs text-ditto-subtext">{{ s.location }} · {{ s.lastActive }}</p>
              </div>
              <button v-if="!s.current" @click="signOut(s.id)" class="text-xs text-ditto-subtext hover:text-error">Sign out</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════ SETTINGS ══════════ -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-7 items-start">
      <!-- Profile -->
      <div class="bg-white rounded-2xl border border-gray-200 p-7 lg:p-8">
        <h3 class="font-satoshi font-black tracking-[-0.03em] text-xl text-ditto-text mb-5">Profile</h3>
        <div class="flex items-center gap-4 pb-5 border-b border-gray-100">
          <div class="w-16 h-16 rounded-full overflow-hidden flex-shrink-0"><img :src="profile.avatar" alt="" class="w-full h-full object-cover" /></div>
          <div>
            <p class="text-sm font-semibold text-ditto-text">Profile picture</p>
            <p class="text-xs text-ditto-subtext">JPG or PNG, at least 400×400px</p>
            <div class="flex gap-3 mt-1.5">
              <button @click="note('Picture upload would open here')" class="text-xs font-medium text-ditto-purple hover:underline">Upload new</button>
              <button @click="note('Picture removed')" class="text-xs font-medium text-ditto-subtext hover:text-error">Remove</button>
            </div>
          </div>
        </div>
        <div class="space-y-5 pt-5">
          <div>
            <label class="block text-[13px] font-medium text-ditto-subtext mb-1.5">Name</label>
            <input v-model="draft.name" type="text" :class="fieldClass" />
          </div>
          <div>
            <label class="block text-[13px] font-medium text-ditto-subtext mb-1.5">Email</label>
            <input v-model="draft.email" type="email" :class="fieldClass" />
            <!-- The live page shows an unexplained ⚠ here — say what it means and offer the fix -->
            <div v-if="!profile.emailVerified" class="mt-2.5 flex items-center justify-between gap-3 rounded-xl border border-error/60 bg-error/5 px-3.5 py-2.5">
              <p class="flex items-center gap-2 text-[13px] text-error">
                <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="9" stroke-width="1.8"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                <span><span class="font-semibold">Not verified.</span> Royalty payouts need a verified email.</span>
              </p>
              <button @click="note(`Verification email sent to ${draft.email}`)" class="text-[13px] font-semibold text-error underline flex-shrink-0">Resend link</button>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[13px] font-medium text-ditto-subtext mb-1.5">Currency</label>
              <select v-model="draft.currency" :class="fieldClass"><option value="GBP">£ GBP</option><option value="USD">$ USD</option><option value="EUR">€ EUR</option></select>
            </div>
            <div>
              <label class="block text-[13px] font-medium text-ditto-subtext mb-1.5">Country</label>
              <select v-model="draft.country" :class="fieldClass"><option>United Kingdom</option><option>United States</option><option>Nigeria</option><option>Germany</option></select>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between gap-3 mt-6 pt-5 border-t border-gray-100">
          <p class="text-xs text-ditto-subtext">{{ profileDirty ? 'Unsaved changes' : 'Everything saved' }}</p>
          <button :disabled="!profileDirty" @click="saveProfile" :class="['px-5 py-2.5 rounded-full text-sm font-semibold transition-all', profileDirty ? 'bg-ditto-purple btn-pop-purple text-white hover:opacity-95' : 'bg-ditto-light-grey text-ditto-subtext/50 cursor-not-allowed']">Save changes</button>
        </div>
      </div>

      <div class="space-y-7">
        <!-- Email preferences (new) -->
        <div class="bg-white rounded-2xl border border-gray-200 p-7 lg:p-8">
          <h3 class="font-satoshi font-black tracking-[-0.03em] text-xl text-ditto-text mb-1">Email preferences</h3>
          <p class="text-[15px] text-ditto-subtext mb-4">Account and payout emails always come through — these are the optional ones.</p>
          <div class="divide-y divide-gray-100">
            <label class="flex items-center justify-between gap-4 py-4 cursor-pointer">
              <span><span class="block text-[15px] font-medium text-ditto-text">Royalty statements</span><span class="block text-[13px] text-ditto-subtext">When a new statement lands</span></span>
              <Toggle v-model="prefs.emailRoyalties" />
            </label>
            <label class="flex items-center justify-between gap-4 py-4 cursor-pointer">
              <span><span class="block text-[15px] font-medium text-ditto-text">Release updates</span><span class="block text-[13px] text-ditto-subtext">Store approvals, rejections and go-lives</span></span>
              <Toggle v-model="prefs.emailReleases" />
            </label>
            <label class="flex items-center justify-between gap-4 py-4 cursor-pointer">
              <span><span class="block text-[15px] font-medium text-ditto-text">News &amp; offers</span><span class="block text-[13px] text-ditto-subtext">New tools, perks and promotions</span></span>
              <Toggle v-model="prefs.emailNews" />
            </label>
          </div>
        </div>

        <!-- AI music training (adapted from the live OFF/ON control) -->
        <div class="bg-white rounded-2xl border border-gray-200 p-7 lg:p-8">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="font-satoshi font-black tracking-[-0.03em] text-xl text-ditto-text">AI music training</h3>
              <p class="text-[15px] text-ditto-subtext mt-1 max-w-md">License your back catalogue and opt in new releases to train AI models, and get paid for it. You can opt out at any time.
                <a href="#" @click.prevent="note('AI licensing details would open here')" class="text-ditto-purple hover:underline">Find out more</a></p>
            </div>
            <Toggle v-model="prefs.aiTraining" @update:model-value="note(prefs.aiTraining ? 'Opted in to AI music training' : 'Opted out of AI music training')" />
          </div>
          <p class="mt-3 text-xs" :class="prefs.aiTraining ? 'text-[#006633]' : 'text-ditto-subtext'">{{ prefs.aiTraining ? 'Opted in — your catalogue is licensed for training.' : 'Opted out — nothing is licensed.' }}</p>
        </div>

        <!-- Danger zone (new) -->
        <div class="rounded-2xl border border-error/30 p-7 lg:p-8">
          <h3 class="font-satoshi font-black tracking-[-0.03em] text-xl text-ditto-text">Close your account</h3>
          <p class="text-[15px] text-ditto-subtext mt-1 mb-4">Releases stay live under Release Protection; anything else comes down from stores. Unpaid royalties are paid out first.</p>
          <button @click="note('Account closure flow would open here')" class="px-4 py-2 rounded-full border border-error/40 text-xs font-semibold text-error hover:bg-error/5 transition-colors">Close account…</button>
        </div>
      </div>
    </div>

    <Toast :visible="toast.visible" :message="toast.message" type="success" @close="toast.visible = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, reactive, ref } from 'vue'
import LiquidTabs from '../../components/common/LiquidTabs.vue'
import Toast from '../../components/ui/Toast.vue'
import {
  accountProfile,
  accountSecurity,
  accountBilling,
  accountPreferences,
  securityQuestions,
} from '../../data/accountMockData'

const emit = defineEmits<{
  (e: 'navigate', section: string): void
}>()

type AccountTab = 'overview' | 'security' | 'settings'
const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'security', label: 'Security' },
  { id: 'settings', label: 'Settings' },
]
const urlParams = new URLSearchParams(window.location.search)
const paramTab = urlParams.get('tab') as AccountTab | null
const activeTab = ref<AccountTab>(paramTab && ['overview', 'security', 'settings'].includes(paramTab) ? paramTab : 'overview')

const profile = reactive({ ...accountProfile })
const security = reactive({ ...accountSecurity, sessions: [...accountSecurity.sessions] })
const billing = reactive({ ...accountBilling })
const prefs = reactive({ ...accountPreferences, payWithRoyalties: accountBilling.payWithRoyalties })

const fieldClass = 'w-full px-0 py-3 border-0 border-b border-gray-300 text-base text-ditto-text bg-transparent placeholder:text-ditto-subtext focus:outline-none focus:border-ditto-purple transition-colors'

// ── Toast ──
const toast = reactive({ visible: false, message: '' })
let toastTimer: ReturnType<typeof setTimeout> | undefined
const note = (message: string) => {
  toast.message = message
  toast.visible = true
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.visible = false }, 2400)
}

// ── Security ──
const pw = reactive({ current: '', next: '', confirm: '' })
const strength = computed(() => {
  const p = pw.next
  let level = 0
  if (p.length >= 8) level++
  if (p.length >= 12) level++
  if (/[A-Z]/.test(p) && /[a-z]/.test(p) && /\d/.test(p)) level++
  if (/[^A-Za-z0-9]/.test(p)) level++
  const labels = ['Enter a new password', 'Too short', 'Getting there', 'Strong', 'Very strong']
  const colours = ['', 'bg-error', 'bg-warning', 'bg-success', 'bg-success']
  return { level: p ? Math.max(1, level) : 0, label: labels[p ? Math.max(1, level) : 0], colour: colours[p ? Math.max(1, level) : 0] }
})
const canChangePassword = computed(() => pw.current.length > 0 && strength.value.level >= 3 && pw.confirm === pw.next)
const changePassword = () => {
  security.passwordChangedOn = 'Today'
  pw.current = ''; pw.next = ''; pw.confirm = ''
  note('Password changed')
}

const editingQuestion = ref(false)
const sq = reactive({ question: securityQuestions[0], answer: '' })
const saveQuestion = () => { security.securityQuestionSet = true; editingQuestion.value = false; sq.answer = ''; note('Security question saved') }

const signOut = (id: string) => { security.sessions = security.sessions.filter(s => s.id !== id); note('Signed out of that device') }
const signOutOthers = () => { security.sessions = security.sessions.filter(s => s.current); note('Signed out everywhere else') }

// ── Settings: profile draft ──
const draft = reactive({ name: profile.name, email: profile.email, currency: profile.currency.code, country: profile.country })
const profileDirty = computed(() =>
  draft.name !== profile.name || draft.email !== profile.email || draft.currency !== profile.currency.code || draft.country !== profile.country
)
const saveProfile = () => {
  profile.name = draft.name
  if (draft.email !== profile.email) { profile.email = draft.email; profile.emailVerified = false }
  profile.currency = { code: draft.currency, symbol: draft.currency === 'GBP' ? '£' : draft.currency === 'USD' ? '$' : '€' }
  profile.country = draft.country
  note('Profile saved')
}

// Small iOS-style toggle, shared by every switch on the page
const Toggle = defineComponent({
  props: { modelValue: { type: Boolean, required: true } },
  emits: ['update:modelValue'],
  setup(p, { emit: e }) {
    return () => h('button', {
      type: 'button',
      onClick: () => e('update:modelValue', !p.modelValue),
      class: ['w-[44px] h-[26px] rounded-full relative transition-colors flex-shrink-0', p.modelValue ? 'bg-[#34c759]' : 'bg-[#e9e9eb]'],
      'aria-pressed': p.modelValue,
    }, [
      h('span', { class: ['absolute top-[2px] left-[2px] w-[22px] h-[22px] rounded-full bg-white shadow-md transition-transform', p.modelValue ? 'translate-x-[18px]' : 'translate-x-0'] }),
    ])
  },
})
</script>

<style scoped>
/* Same mesh family as the referral / royalties money surfaces */
.plan-tile {
  background:
    radial-gradient(70% 90% at 0% 0%, #2a0a8c 0%, rgba(42, 10, 140, 0) 60%),
    radial-gradient(60% 80% at 100% 100%, #a879ff 0%, rgba(168, 121, 255, 0) 58%),
    linear-gradient(120deg, #3a12a8 0%, #5f1fff 55%, #8b55ff 100%);
}
</style>
