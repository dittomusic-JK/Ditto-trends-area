<template>
  <div class="max-w-[1200px]">
    <!-- Page header -->
    <div class="mb-6 lg:mb-8">
      <h1 class="font-satoshi font-black text-xl sm:text-3xl lg:text-[42px] tracking-tight text-ditto-text mb-2">
        Refer a <span class="text-ditto-purple">Friend</span>
      </h1>
      <p class="text-sm sm:text-base text-ditto-subtext max-w-xl">
        ${{ REWARD_PER_REFERRAL }} for you, ${{ REWARD_PER_REFERRAL }} for them — every time a friend joins on a paid plan, up to ${{ CAP_AMOUNT }}.
      </p>
    </div>

    <!-- Post-cap: the affiliate upsell takes over the top of the page -->
    <div
      v-if="isCapped"
      class="relative overflow-hidden rounded-3xl p-6 sm:p-8 mb-6 text-white affiliate-banner"
    >
      <span class="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/15 pointer-events-none"></span>
      <div class="relative flex flex-col sm:flex-row sm:items-center gap-5">
        <div class="flex-1">
          <span class="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide bg-[#E6FF3A] text-[#0a0a0a] px-2.5 py-1 rounded-full mb-3">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/></svg>
            You've earned the full ${{ CAP_AMOUNT }}
          </span>
          <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl sm:text-3xl mb-2">Want to keep earning?</h2>
          <p class="text-sm sm:text-base text-white/75 max-w-lg">
            You clearly know people. Join the Ditto Affiliate Programme and earn
            <span class="font-semibold text-white">uncapped commission</span> on every artist you bring to Ditto.
          </p>
        </div>
        <div class="flex-shrink-0">
          <a
            href="https://dittomusic.com/affiliates"
            target="_blank"
            rel="noreferrer"
            class="inline-block px-7 py-3.5 bg-[#E6FF3A] text-[#0a0a0a] text-base font-semibold rounded-full hover:-translate-y-0.5 transition-transform"
          >
            Join the Affiliate Programme
          </a>
        </div>
      </div>
    </div>

    <!-- Earnings + share link -->
    <div class="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 mb-14 lg:mb-16">
      <!-- Earnings card -->
      <div class="relative overflow-hidden rounded-3xl p-7 sm:p-8 flex flex-col text-white shadow-[0_10px_30px_rgba(58,18,168,0.25)] refer-hero-card">
        <span class="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none"></span>
        <span class="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/15 pointer-events-none"></span>

        <p class="relative text-sm text-white/65 mb-2">Referral earnings</p>
        <p class="relative text-6xl sm:text-7xl font-satoshi font-black tracking-[-0.03em] mb-8">
          ${{ animatedEarned }}<span class="text-3xl align-top">.00</span>
        </p>

        <!-- One segment per possible referral -->
        <div class="relative flex gap-1.5 h-3 mb-3">
          <div
            v-for="i in REFERRAL_CAP"
            :key="i"
            class="flex-1 rounded-full transition-colors duration-700"
            :class="i <= profile.successful ? 'bg-[#E6FF3A]' : 'bg-white/15'"
            :style="{ transitionDelay: `${i * 90}ms` }"
          ></div>
        </div>

        <div class="relative flex items-center justify-between text-sm mb-1">
          <span class="text-white">
            <span class="font-semibold">{{ profile.successful }} of {{ REFERRAL_CAP }}</span> friends joined
          </span>
          <span v-if="!isCapped" class="text-white/65">${{ CAP_AMOUNT - profile.totalEarned }} still to earn</span>
          <span v-else class="text-[#E6FF3A] font-semibold">Complete</span>
        </div>

        <div v-if="profile.successful === 0 || isCapped" class="relative mt-auto pt-6">
          <p v-if="profile.successful === 0" class="text-sm text-white/75">
            Share your link below to earn your first ${{ REWARD_PER_REFERRAL }}.
          </p>
          <button v-else class="px-6 py-3 bg-white/15 text-white text-sm font-semibold rounded-full hover:bg-white/25 transition-colors">
            View your balance
          </button>
        </div>
      </div>

      <!-- Share link card -->
      <div class="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 flex flex-col">
        <h3 class="font-satoshi font-black tracking-[-0.03em] text-lg text-ditto-text mb-5">Share your link</h3>

        <!-- Link + copy -->
        <div class="flex items-center gap-2 bg-ditto-light-grey/60 border border-gray-200 rounded-2xl p-2 pl-4 mb-4">
          <span class="flex-1 min-w-0 truncate text-sm font-medium text-ditto-text select-all">{{ profile.link }}</span>
          <button
            @click="copyLink"
            class="flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full text-white btn-pop-purple hover:opacity-90 transition-opacity flex items-center gap-1.5"
          >
            <svg v-if="!justCopied" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ justCopied ? 'Copied' : 'Copy link' }}
          </button>
        </div>

        <!-- Share channels -->
        <div class="flex flex-wrap gap-2 mb-5">
          <a
            v-for="channel in shareChannels"
            :key="channel.label"
            :href="channel.href"
            target="_blank"
            rel="noreferrer"
            class="flex items-center gap-2 px-3.5 py-2 rounded-full bg-ditto-light-grey text-sm font-medium text-ditto-text hover:bg-ditto-purple/10 hover:text-ditto-purple transition-colors"
          >
            <span class="w-4 h-4 flex-shrink-0" v-html="channel.icon"></span>
            {{ channel.label }}
          </a>
        </div>

        <!-- Friend incentive -->
        <div class="mt-auto flex items-center gap-2.5 pt-4">
          <img src="/img/suite/perks.svg" alt="" class="w-6 h-6 flex-shrink-0" />
          <p class="text-sm text-ditto-subtext">
            <span class="font-semibold text-ditto-text">Your friend gets ${{ REWARD_PER_REFERRAL }} too</span> — Ditto credit to spend on the platform when they join.
          </p>
        </div>
      </div>
    </div>

    <!-- How it works (suite-tile treatment, same as the home hub) -->
    <div class="mb-14 lg:mb-16">
      <h3 class="font-satoshi font-black tracking-[-0.03em] text-lg lg:text-xl text-ditto-text mb-5">How it works</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div
          v-for="step in howItWorks"
          :key="step.title"
          class="rounded-2xl bg-white shadow-[0_2px_14px_rgba(16,31,60,0.08)] hover:shadow-[0_12px_32px_rgba(95,31,255,0.18)] hover:-translate-y-1 transition-all duration-200 p-7 flex flex-col items-center text-center gap-4"
        >
          <img :src="step.icon" alt="" class="w-14 h-14" />
          <span>
            <span class="block text-base font-bold text-ditto-text">{{ step.title }}</span>
            <span class="block text-sm text-ditto-subtext mt-1">{{ step.body }}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Referrals list -->
    <div class="mb-14 lg:mb-16">
      <div class="flex items-baseline justify-between mb-4">
        <h3 class="font-satoshi font-black tracking-[-0.03em] text-lg lg:text-xl text-ditto-text">Your referrals</h3>
        <span v-if="profile.referrals.length" class="text-sm text-ditto-subtext">{{ profile.referrals.length }} total</span>
      </div>

      <!-- Empty state -->
      <div v-if="profile.referrals.length === 0" class="bg-white rounded-2xl border border-dashed border-gray-300 py-14 px-6 text-center">
        <span class="inline-flex w-12 h-12 rounded-full bg-ditto-purple/10 items-center justify-center mb-4">
          <svg class="w-6 h-6 text-ditto-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="10" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14" stroke-linecap="round"/>
            <line x1="16" y1="11" x2="22" y2="11" stroke-linecap="round"/>
          </svg>
        </span>
        <p class="text-base font-semibold text-ditto-text mb-1">No referrals yet</p>
        <p class="text-sm text-ditto-subtext max-w-sm mx-auto">
          Share your link with friends who make music. When one of them joins on a paid subscription, you'll see them here — and ${{ REWARD_PER_REFERRAL }} in your balance.
        </p>
      </div>

      <!-- Rows -->
      <div v-else class="space-y-1">
        <div
          v-for="referral in profile.referrals"
          :key="referral.id"
          class="flex items-center gap-4 px-4 py-4 hover:bg-ditto-light-grey rounded-2xl transition-colors"
        >
          <!-- Initials avatar -->
          <div class="w-10 h-10 rounded-full bg-ditto-purple/10 text-ditto-purple flex items-center justify-center flex-shrink-0 text-sm font-bold">
            {{ initials(referral.name) }}
          </div>

          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-ditto-text truncate">{{ referral.name }}</p>
            <p class="text-xs text-ditto-subtext truncate">{{ referral.email }} · {{ referral.date }}</p>
          </div>

          <!-- Status -->
          <div class="flex items-center gap-3 flex-shrink-0">
            <span
              class="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
              :class="statusMeta[referral.status].pill"
            >
              {{ statusLabel(referral) }}
            </span>
            <p class="text-base font-semibold w-16 text-right" :class="statusMeta[referral.status].amountClass">
              {{ statusMeta[referral.status].amount }}
            </p>
          </div>
        </div>
      </div>

    </div>

    <!-- FAQs (two independent columns so an open answer only grows its own side) -->
    <div class="mb-14">
      <h3 class="font-satoshi font-black tracking-[-0.03em] text-lg lg:text-xl text-ditto-text mb-5">FAQs</h3>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-3 lg:gap-y-0">
        <div v-for="(column, c) in faqColumns" :key="c" class="space-y-3">
          <div
            v-for="faq in column"
            :key="faq.q"
            class="bg-white rounded-2xl border border-gray-200 overflow-hidden"
          >
            <button
              @click="openFaq = openFaq === faq.q ? null : faq.q"
              class="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span class="text-base font-bold text-ditto-text">{{ faq.q }}</span>
              <svg
                class="w-4 h-4 text-ditto-subtext flex-shrink-0 transition-transform"
                :class="openFaq === faq.q ? 'rotate-180' : ''"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              >
                <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div v-show="openFaq === faq.q" class="px-6 pb-5">
              <p class="text-sm text-ditto-subtext">{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Copy toast -->
    <Toast :visible="showToast" message="Referral link copied to clipboard" type="success" @close="showToast = false" />

    <!-- Prototype-only: flip between programme states -->
    <div class="fixed bottom-4 left-4 z-50 flex items-center gap-1 bg-white border border-gray-200 rounded-full shadow-lg px-1.5 py-1">
      <span class="text-[10px] font-semibold uppercase tracking-wide text-ditto-subtext px-1.5">Demo</span>
      <button
        v-for="state in demoStateOptions"
        :key="state.id"
        @click="demoState = state.id"
        class="px-2.5 py-1 text-[11px] font-medium rounded-full transition-colors"
        :class="demoState === state.id ? 'bg-ditto-text text-white dark:text-[#16161d]' : 'text-ditto-subtext hover:bg-ditto-light-grey'"
      >
        {{ state.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Toast from '../../components/ui/Toast.vue'
import {
  referDemoStates,
  REWARD_PER_REFERRAL,
  REFERRAL_CAP,
  CAP_AMOUNT,
  type ReferDemoState,
  type Referral,
  type ReferralStatus,
} from '../../data/referMockData'
import { useCountUp } from '../../composables/useCountUp'

// Demo state: ?refer=new|progress|capped, defaulting to mid-programme
const urlParams = new URLSearchParams(window.location.search)
const paramState = urlParams.get('refer') as ReferDemoState | null
const demoState = ref<ReferDemoState>(
  paramState && paramState in referDemoStates ? paramState : 'progress'
)

const demoStateOptions: { id: ReferDemoState; label: string }[] = [
  { id: 'new', label: 'New' },
  { id: 'progress', label: 'In progress' },
  { id: 'capped', label: 'Capped' },
]

const profile = computed(() => referDemoStates[demoState.value])
const isCapped = computed(() => profile.value.successful >= REFERRAL_CAP)

// Headline figure counts up on load; switching demo states just snaps
const countUp = useCountUp(profile.value.totalEarned)
const snapped = ref<number | null>(null)
watch(demoState, () => { snapped.value = profile.value.totalEarned })
const animatedEarned = computed(() => snapped.value ?? countUp.value)

// ── Share ──
const justCopied = ref(false)
const showToast = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | undefined

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(`https://${profile.value.link}`)
  } catch {
    /* clipboard unavailable in some embedded contexts — demo continues */
  }
  justCopied.value = true
  showToast.value = true
  clearTimeout(copyTimer)
  copyTimer = setTimeout(() => {
    justCopied.value = false
    showToast.value = false
  }, 2200)
}

const shareText = computed(() =>
  encodeURIComponent(`Join me on Ditto and we both get $${REWARD_PER_REFERRAL}: https://${profile.value.link}`)
)
const shareUrl = computed(() => encodeURIComponent(`https://${profile.value.link}`))

const shareChannels = computed(() => [
  {
    label: 'X',
    href: `https://twitter.com/intent/tweet?text=${shareText.value}`,
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  },
  {
    label: 'WhatsApp',
    href: `https://wa.me/?text=${shareText.value}`,
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
  },
  {
    label: 'Facebook',
    href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl.value}`,
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
  },
  {
    label: 'Email',
    href: `mailto:?subject=${encodeURIComponent('Join me on Ditto Music — we both get $10')}&body=${shareText.value}`,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
])

// ── Copy ──
const howItWorks = [
  {
    icon: '/img/suite/Smartlinks.svg',
    title: 'Share your link',
    body: 'Send it to friends who make music.',
  },
  {
    icon: '/img/suite/add-artist.svg',
    title: 'They join Ditto',
    body: 'Any paid plan counts.',
  },
  {
    icon: '/img/suite/Royalties.svg',
    title: 'You both get paid',
    body: `$${REWARD_PER_REFERRAL} cash for you, $${REWARD_PER_REFERRAL} Ditto credit for them.`,
  },
]

const faqs = [
  {
    q: 'How much can I earn?',
    a: `$${REWARD_PER_REFERRAL} for each friend who signs up with your link and buys any paid Ditto subscription, up to $${CAP_AMOUNT} (${REFERRAL_CAP} friends). After that, our Affiliate Programme offers uncapped commission.`,
  },
  {
    q: 'What does my friend get?',
    a: `$${REWARD_PER_REFERRAL} of Ditto credit once they've joined on a paid subscription through your link — usable toward anything on the platform, though it can't be withdrawn as cash.`,
  },
  {
    q: 'Who can take part?',
    a: 'Any Ditto user with a paid subscription can refer friends. Your friend just needs to be new to Ditto.',
  },
  {
    q: 'When do I get my reward?',
    a: `Your $${REWARD_PER_REFERRAL} is confirmed once your friend's first subscription payment clears its 30-day refund window. It's then added to your Ditto balance, ready to withdraw through the normal payout flow.`,
  },
  {
    q: 'How long does my link last?',
    a: 'Friends need to sign up within 30 days of clicking your link. Once they\'ve created their account through it, the referral counts whenever they subscribe.',
  },
  {
    q: 'My friend signed up without my link — can I still get credit?',
    a: 'Unfortunately not. Referrals can only be tracked when the link is used at signup, so we can\'t add them retroactively.',
  },
  {
    q: 'What currency am I paid in?',
    a: 'Rewards are shown in USD and paid in your local currency, converted at the exchange rate on the day the reward is issued.',
  },
  {
    q: 'Are there any rules?',
    a: 'Referrals must be genuine new Ditto customers — self-referrals, duplicate accounts and anything that looks like gaming the programme won\'t be rewarded. Rewards may be reversed if a referred subscription is refunded.',
  },
]

// ── Referral rows ──
const initials = (name: string) =>
  name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase()

const statusMeta: Record<ReferralStatus, { pill: string; amount: string; amountClass: string }> = {
  earned: { pill: 'bg-success/15 text-success', amount: `+$${REWARD_PER_REFERRAL}`, amountClass: 'text-ditto-text' },
  clearing: { pill: 'bg-info/15 text-info', amount: `+$${REWARD_PER_REFERRAL}`, amountClass: 'text-ditto-subtext' },
  signed_up: { pill: 'bg-warning/15 text-warning', amount: '—', amountClass: 'text-ditto-subtext' },
  capped: { pill: 'bg-ditto-light-grey text-ditto-subtext', amount: '$0', amountClass: 'text-ditto-subtext' },
}

const statusLabel = (referral: Referral): string => {
  switch (referral.status) {
    case 'earned': return 'Reward earned'
    case 'clearing': return `Clearing · available ${referral.availableOn}`
    case 'signed_up': return 'Signed up — not subscribed yet'
    case 'capped': return 'Joined after cap'
  }
}

const openFaq = ref<string | null>(null)

// Two balanced columns; expansion only pushes items in its own column
const faqColumns = [
  faqs.slice(0, Math.ceil(faqs.length / 2)),
  faqs.slice(Math.ceil(faqs.length / 2)),
]
</script>

<style scoped>
/* Same mesh treatment as the Royalties balance card, so "money" surfaces
   read as one family across the dashboard */
.refer-hero-card {
  background:
    radial-gradient(75% 95% at 0% 0%, #2a0a8c 0%, rgba(42, 10, 140, 0) 62%),
    radial-gradient(65% 80% at 104% 96%, #d6bcff 0%, rgba(214, 188, 255, 0) 58%),
    radial-gradient(60% 70% at 96% 18%, #a879ff 0%, rgba(168, 121, 255, 0) 55%),
    radial-gradient(55% 60% at 62% 78%, #7d3bff 0%, rgba(125, 59, 255, 0) 58%),
    radial-gradient(55% 65% at 6% 108%, #35109f 0%, rgba(53, 16, 159, 0) 60%),
    linear-gradient(120deg, #3a12a8 0%, #5f1fff 52%, #9c6dff 100%);
}

/* Post-cap banner: ink navy base so the lime CTA owns the conversion moment */
.affiliate-banner {
  background:
    radial-gradient(70% 90% at 100% 0%, rgba(95, 31, 255, 0.55) 0%, rgba(95, 31, 255, 0) 60%),
    radial-gradient(60% 80% at 0% 100%, rgba(40, 126, 247, 0.35) 0%, rgba(40, 126, 247, 0) 55%),
    linear-gradient(120deg, #0d1830 0%, #101f3c 55%, #1c2f5c 100%);
}
</style>
