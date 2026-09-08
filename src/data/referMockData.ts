// Refer a Friend — mock data for the in-house referral programme prototype.
// Programme: the friend gets 40% off Ditto Pro; the referrer earns $10 cash,
// deposited one month after the friend signs up (a holding period that limits
// abuse). No cap on referrals. Three demo states: fresh, mid-programme, and a
// heavy referrer.

export type ReferralStatus =
  | 'paid' // holding period over — $10 deposited into the referrer's balance
  | 'pending' // friend has signed up; $10 lands one month after their sign-up date
  | 'joined' // friend created an account but hasn't taken the Pro offer yet

export interface Referral {
  id: string
  name: string
  email: string
  /** Friend's sign-up date */
  date: string
  status: ReferralStatus
  /** For 'pending': the deposit date (sign-up + 1 month) */
  depositOn?: string
}

export interface ReferProfile {
  /** The user's referral code — the tail of their share link */
  code: string
  link: string
  /** Cash already deposited */
  totalEarned: number
  /** Cash in the one-month holding period */
  pending: number
  referrals: Referral[]
}

export type ReferDemoState = 'new' | 'progress' | 'power'

export const REWARD_PER_REFERRAL = 10
export const FRIEND_DISCOUNT_PERCENT = 40
export const HOLDING_PERIOD_LABEL = '1 month'

const code = 'goldenboy'
const link = `dittomusic.com/r/${code}`

const r = (id: string, name: string, email: string, date: string, status: ReferralStatus, depositOn?: string): Referral =>
  ({ id, name, email, date, status, depositOn })

export const referDemoStates: Record<ReferDemoState, ReferProfile> = {
  new: { code, link, totalEarned: 0, pending: 0, referrals: [] },

  progress: {
    code,
    link,
    totalEarned: 20,
    pending: 20,
    referrals: [
      r('r6', 'Amara Okafor', 'am***@gmail.com', '28 Aug 2026', 'joined'),
      r('r5', 'Callum Reid', 'ca***@outlook.com', '20 Aug 2026', 'pending', '20 Sep 2026'),
      r('r4', 'Jess Whitfield', 'je***@gmail.com', '11 Aug 2026', 'pending', '11 Sep 2026'),
      r('r3', 'Theo Marsh', 'th***@icloud.com', '28 Jun 2026', 'paid'),
      r('r2', 'Nadia Silva', 'na***@gmail.com', '14 Jun 2026', 'paid'),
    ],
  },

  power: {
    code,
    link,
    totalEarned: 90,
    pending: 30,
    referrals: [
      r('p12', 'Ryan Doyle', 'ry***@gmail.com', '3 Sep 2026', 'joined'),
      r('p11', 'Priya Anand', 'pr***@outlook.com', '30 Aug 2026', 'pending', '30 Sep 2026'),
      r('p10', 'Marcus Bell', 'ma***@gmail.com', '24 Aug 2026', 'pending', '24 Sep 2026'),
      r('p9', 'Sofia Reyes', 'so***@icloud.com', '15 Aug 2026', 'pending', '15 Sep 2026'),
      r('p8', 'Callum Reid', 'ca***@outlook.com', '22 Jul 2026', 'paid'),
      r('p7', 'Amara Okafor', 'am***@gmail.com', '10 Jul 2026', 'paid'),
      r('p6', 'Jess Whitfield', 'je***@gmail.com', '27 Jun 2026', 'paid'),
      r('p5', 'Theo Marsh', 'th***@icloud.com', '15 Jun 2026', 'paid'),
      r('p4', 'Nadia Silva', 'na***@gmail.com', '2 Jun 2026', 'paid'),
      r('p3', 'Leon Baptiste', 'le***@gmail.com', '21 May 2026', 'paid'),
      r('p2', 'Hana Yusuf', 'ha***@outlook.com', '9 May 2026', 'paid'),
      r('p1', 'Owen Clarke', 'ow***@gmail.com', '26 Apr 2026', 'paid'),
    ],
  },
}
