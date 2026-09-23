// Subscription page — plans as on dittomusic.com/pricing, rules as on
// dashboard.dittomusic.com/subscriptions (current plan locked, downgrades
// blocked while the account has more Plan Artists than the target allows).

export type PlanId = 'starter' | 'pro' | 'ultimate' | 'label'

/** Video distribution bolt-on: any plan, unlimited videos to the five video stores */
export const VIDEO_ADDON_PRICE = 99
/** Priority Distro list price and the Ultimate member rate */
export const PRIORITY_PRICE = 40
export const PRIORITY_MEMBER_PRICE = 25

export interface LabelTier {
  artists: number
  price: number
}

/** Label tiers and annual prices from the live dashboard slider */
export const labelTiers: LabelTier[] = [
  { artists: 5, price: 89 },
  { artists: 10, price: 139 },
  { artists: 15, price: 179 },
  { artists: 20, price: 219 },
  { artists: 30, price: 269 },
  { artists: 40, price: 319 },
]

export interface Plan {
  id: PlanId
  name: string
  eyebrow: string
  price: number
  artists: number
  blurb: string
  featuresIntro: string
  features: string[]
  mostPopular?: boolean
  bestValue?: boolean
  /** Ultimate: video is part of the plan, no bolt-on needed */
  includesVideo?: boolean
}

// Ultimate is parked (see ultimatePlan) until Labels is repositioned above it.
export const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    eyebrow: 'Starter',
    price: 19,
    artists: 1,
    blurb: 'Upload as much music as you like to every music platform.',
    featuresIntro: 'This plan includes:',
    features: [
      'Unlimited releases for 1 artist',
      'Upload to 150+ platforms',
      'Keep 100% of royalties',
      'Free pre-save smartlinks',
      'Analytics & fan data',
      'Auto-split royalty payments',
      'Submit to playlists',
      'Instant Spotify verification',
      'Fast royalty payouts',
      'Ditto Perks',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    eyebrow: 'Pro',
    price: 59,
    artists: 2,
    blurb: 'Take the next step. Unlock new revenue and our full Pro toolkit.',
    featuresIntro: 'Everything in Starter, plus:',
    features: [
      'Unlimited releases for 2 artists',
      'Pitch for TV & film sync licensing',
      'Collect publishing royalties',
      'YouTube Content ID & OAC setup',
      'Set exact release times',
      'Release protection included',
      'Priority support',
      'Compilation releases',
      'Pro Perks',
    ],
    mostPopular: true,
  },
  {
    id: 'label',
    name: 'Labels',
    eyebrow: 'Labels',
    price: labelTiers[0].price,
    artists: labelTiers[0].artists,
    blurb: 'Manage multiple artists and access the tools you need to run a label.',
    featuresIntro: 'Everything in Pro, plus:',
    features: ['Unlimited releases for 3+ artists'],
  },
]

/** The account's current subscription — drives the card states */
export interface Subscription {
  planId: PlanId
  /** For label plans: which tier */
  labelArtists?: number
  /** Plan Artists currently on the account — downgrades below this are blocked */
  planArtists: number
  /** Video distribution bolt-on (£99/yr) on top of the plan */
  videoAddon: boolean
  renewsOn: string
}

/** Can this account distribute video? Ultimate includes it; others need the bolt-on. */
export const hasVideoDistribution = (sub: Subscription) => sub.planId === 'ultimate' || sub.videoAddon

export type SubscriptionDemoState = 'starter' | 'pro' | 'proVideo' | 'label5'

export const subscriptionDemoStates: Record<SubscriptionDemoState, Subscription> = {
  starter: { planId: 'starter', planArtists: 1, videoAddon: false, renewsOn: '14 Jun 2027' },
  pro: { planId: 'pro', planArtists: 2, videoAddon: false, renewsOn: '14 Jun 2027' },
  proVideo: { planId: 'pro', planArtists: 2, videoAddon: true, renewsOn: '14 Jun 2027' },
  label5: { planId: 'label', labelArtists: 5, planArtists: 4, videoAddon: false, renewsOn: '14 Jun 2027' },
}

/** Ordering for upgrade/downgrade decisions */
export const planRank = (planId: PlanId, labelArtists = 0) =>
  planId === 'starter' ? 1 : planId === 'pro' ? 2 : planId === 'ultimate' ? 3 : 10 + labelArtists

/** Parked: everything in Pro + video + per-release extras. Not shown while Labels is being reworked. */
export const ultimatePlan: Plan = {
    id: 'ultimate',
    name: 'Ultimate',
    eyebrow: 'Ultimate',
    price: 179,
    artists: 2,
    blurb: 'Everything Ditto does, one price. Music, video and every release extra.',
    featuresIntro: 'Everything in Pro, plus:',
    features: [
      'Unlimited video distribution',
      'Spotify, Apple Music, VEVO, TIDAL & Amazon',
      'Chart registration on every release',
      'Pre-release downloads on every release',
      `Priority Distro at member rate (£${PRIORITY_MEMBER_PRICE})`,
      'Ultimate Perks',
    ],
    bestValue: true,
    includesVideo: true,
  }

export const perks = ['Try before you pay', 'Cancel anytime', 'Keep 100% royalties', 'Unlimited uploads']
