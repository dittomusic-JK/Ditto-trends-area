// Account area — identity, security posture, preferences. Mirrors the live
// dashboard's three tabs (Overview / Security / Settings) with the overlaps
// removed: each fact lives in one place.

export interface AccountProfile {
  name: string
  email: string
  emailVerified: boolean
  avatar: string
  currency: { code: string; symbol: string }
  country: string
  memberSince: string
}

export interface AccountSecurity {
  passwordChangedOn: string
  twoFactorEnabled: boolean
  securityQuestionSet: boolean
  sessions: { id: string; device: string; location: string; lastActive: string; current: boolean }[]
}

export interface AccountBilling {
  planName: string
  planTag: string
  planBlurb: string
  planArtists: number
  planArtistsUsed: number
  renewsOn: string
  amountDue: number
  paymentMethod: { brand: string; last4: string; expires: string }
  payWithRoyalties: boolean
  lastPayment: { date: string; amount: number; description: string }
}

export interface AccountPreferences {
  aiTraining: boolean
  emailNews: boolean
  emailRoyalties: boolean
  emailReleases: boolean
}

export const accountProfile: AccountProfile = {
  name: 'James Keane',
  email: 'james.keane@goldenboyent.com',
  emailVerified: false,
  avatar: '/img/avatar.jpg',
  currency: { code: 'GBP', symbol: '£' },
  country: 'United Kingdom',
  memberSince: 'March 2021',
}

export const accountSecurity: AccountSecurity = {
  passwordChangedOn: '4 Aug 2026',
  twoFactorEnabled: false,
  securityQuestionSet: true,
  sessions: [
    { id: 's1', device: 'Chrome on macOS', location: 'Liverpool, UK', lastActive: 'Now', current: true },
    { id: 's2', device: 'Ditto app on iPhone', location: 'Liverpool, UK', lastActive: '2 hours ago', current: false },
    { id: 's3', device: 'Safari on iPad', location: 'Manchester, UK', lastActive: '12 days ago', current: false },
  ],
}

export const accountBilling: AccountBilling = {
  planName: 'Label 5',
  planTag: 'LABEL 5',
  planBlurb: 'Unlimited releases for 5 artists, music publishing, sync and all Pro features.',
  planArtists: 5,
  planArtistsUsed: 3,
  renewsOn: '2 Mar 2027',
  amountDue: 89,
  paymentMethod: { brand: 'Visa', last4: '4242', expires: '09/28' },
  payWithRoyalties: false,
  lastPayment: { date: '2 Mar 2026', amount: 89, description: 'Label 5 — annual renewal' },
}

export const accountPreferences: AccountPreferences = {
  aiTraining: false,
  emailNews: true,
  emailRoyalties: true,
  emailReleases: true,
}

export const securityQuestions = [
  'What was the name of your first pet?',
  'What was the first gig you went to?',
  'What street did you grow up on?',
  'What was your childhood nickname?',
]
