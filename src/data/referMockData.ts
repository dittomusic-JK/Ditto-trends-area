// Refer a Friend — mock data for the in-house referral programme prototype.
// Three demo states drive the page: a fresh account, one mid-programme, and
// one that has hit the $50 cap (where the affiliate upsell takes over).

export type ReferralStatus =
  | 'earned' // friend subscribed, $10 in the referrer's balance
  | 'clearing' // friend subscribed, reward held for the refund window
  | 'signed_up' // friend created an account but hasn't subscribed yet
  | 'capped' // friend subscribed after the cap — tracked, no cash reward

export interface Referral {
  id: string
  name: string
  email: string
  date: string
  status: ReferralStatus
  /** For 'clearing' rewards: when the $10 becomes withdrawable */
  availableOn?: string
}

export interface ReferProfile {
  /** The user's referral code — the tail of their share link */
  code: string
  link: string
  totalEarned: number
  successful: number
  referrals: Referral[]
}

export type ReferDemoState = 'new' | 'progress' | 'capped'

export const REWARD_PER_REFERRAL = 10
export const REFERRAL_CAP = 5
export const CAP_AMOUNT = REWARD_PER_REFERRAL * REFERRAL_CAP

const code = 'goldenboy'
const link = `dittomusic.com/r/${code}`

export const referDemoStates: Record<ReferDemoState, ReferProfile> = {
  new: {
    code,
    link,
    totalEarned: 0,
    successful: 0,
    referrals: [],
  },

  progress: {
    code,
    link,
    totalEarned: 30,
    successful: 3,
    referrals: [
      {
        id: 'r6',
        name: 'Amara Okafor',
        email: 'am***@gmail.com',
        date: '8 Aug 2026',
        status: 'signed_up',
      },
      {
        id: 'r5',
        name: 'Callum Reid',
        email: 'ca***@outlook.com',
        date: '2 Aug 2026',
        status: 'clearing',
        availableOn: '1 Sep 2026',
      },
      {
        id: 'r4',
        name: 'Jess Whitfield',
        email: 'je***@gmail.com',
        date: '19 Jul 2026',
        status: 'signed_up',
      },
      {
        id: 'r3',
        name: 'Theo Marsh',
        email: 'th***@icloud.com',
        date: '28 Jun 2026',
        status: 'earned',
      },
      {
        id: 'r2',
        name: 'Nadia Silva',
        email: 'na***@gmail.com',
        date: '14 Jun 2026',
        status: 'earned',
      },
    ],
  },

  capped: {
    code,
    link,
    totalEarned: 50,
    successful: 5,
    referrals: [
      {
        id: 'c7',
        name: 'Ryan Doyle',
        email: 'ry***@gmail.com',
        date: '9 Aug 2026',
        status: 'capped',
      },
      {
        id: 'c6',
        name: 'Priya Anand',
        email: 'pr***@outlook.com',
        date: '31 Jul 2026',
        status: 'capped',
      },
      {
        id: 'c5',
        name: 'Callum Reid',
        email: 'ca***@outlook.com',
        date: '22 Jul 2026',
        status: 'earned',
      },
      {
        id: 'c4',
        name: 'Amara Okafor',
        email: 'am***@gmail.com',
        date: '10 Jul 2026',
        status: 'earned',
      },
      {
        id: 'c3',
        name: 'Jess Whitfield',
        email: 'je***@gmail.com',
        date: '27 Jun 2026',
        status: 'earned',
      },
      {
        id: 'c2',
        name: 'Theo Marsh',
        email: 'th***@icloud.com',
        date: '15 Jun 2026',
        status: 'earned',
      },
      {
        id: 'c1',
        name: 'Nadia Silva',
        email: 'na***@gmail.com',
        date: '2 Jun 2026',
        status: 'earned',
      },
    ],
  },
}
