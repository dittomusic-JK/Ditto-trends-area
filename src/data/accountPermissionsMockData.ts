// Account Permissions (DC-123): who can do what on this account. Roles are
// account-level; Manager / Reporter can be scoped to selected artists, Artist is
// always tied to one Plan Artist (their own sales and split). The Owner is the
// account holder — not a role you assign, and never removable.

export type RoleId = 'admin' | 'manager' | 'artist' | 'reporter'

export type Capability =
  | 'releases'      // create, edit, take down releases; deliver to new stores
  | 'splits'        // manage revenue splits
  | 'sales'         // view sales & analytics
  | 'payouts'       // request payouts
  | 'team'          // invite and manage people on the account

export interface Role {
  id: RoleId
  name: string
  summary: string
  /** Capability → level. 'own' = only their own revenue split. */
  can: Partial<Record<Capability, 'all' | 'own'>>
}

export const capabilities: { id: Capability; label: string }[] = [
  { id: 'releases', label: 'Create, edit & take down releases' },
  { id: 'sales', label: 'View sales & analytics' },
  { id: 'payouts', label: 'Request payouts' },
  { id: 'splits', label: 'Manage revenue splits' },
  { id: 'team', label: 'Manage account access' },
]

export const roles: Role[] = [
  {
    id: 'admin',
    name: 'Admin',
    summary: 'Full control — releases, stores, sales, payouts, splits and who has access.',
    can: { releases: 'all', sales: 'all', payouts: 'all', splits: 'all', team: 'all' },
  },
  {
    id: 'manager',
    name: 'Manager',
    summary: 'Runs releases day to day: takedowns, new stores, sales and payouts. Can\'t change splits.',
    can: { releases: 'all', sales: 'all', payouts: 'all' },
  },
  {
    id: 'artist',
    name: 'Artist',
    summary: 'Sees sales for their own music and can request payouts for their own split.',
    can: { sales: 'own', payouts: 'own' },
  },
  {
    id: 'reporter',
    name: 'Reporter',
    summary: 'Read-only: sales and analytics, nothing else.',
    can: { sales: 'all' },
  },
]

export type MemberStatus = 'owner' | 'active' | 'pending' | 'expired'

export interface Member {
  id: string
  name: string
  email: string
  role: RoleId | 'owner'
  /** 'account' = everything; otherwise the artist ids this person is limited to */
  scope: 'account' | string[]
  status: MemberStatus
  addedOn: string
  addedBy: string
  /** For pending: when the invite was last sent */
  invitedOn?: string
  lastActive?: string
}

export const members: Member[] = [
  { id: 'm0', name: 'James Keane', email: 'james.keane@goldenboyent.com', role: 'owner', scope: 'account', status: 'owner', addedOn: '2 Feb 2023', addedBy: '—', lastActive: 'Now' },
  { id: 'm1', name: 'Ola Adeyemi', email: 'ola@goldenboyent.com', role: 'admin', scope: 'account', status: 'active', addedOn: '14 Mar 2025', addedBy: 'James Keane', lastActive: 'Yesterday' },
  { id: 'm2', name: 'Priya Anand', email: 'priya@goldenboyent.com', role: 'manager', scope: 'account', status: 'active', addedOn: '3 Jun 2025', addedBy: 'James Keane', lastActive: '2 days ago' },
  { id: 'm3', name: 'Darkoo', email: 'darkoo@goldenboyent.com', role: 'artist', scope: ['91001'], status: 'active', addedOn: '20 Jun 2025', addedBy: 'Ola Adeyemi', lastActive: 'Last week' },
  { id: 'm4', name: 'Sam Okafor', email: 'sam.okafor@bigfishmgmt.co', role: 'manager', scope: ['91001', '91002'], status: 'pending', addedOn: '9 Sep 2026', addedBy: 'James Keane', invitedOn: '9 Sep 2026' },
  { id: 'm5', name: 'Almost Joey', email: 'joey@almostjoey.com', role: 'artist', scope: ['91002'], status: 'expired', addedOn: '1 Aug 2026', addedBy: 'Priya Anand', invitedOn: '1 Aug 2026' },
  { id: 'm6', name: 'Hannah Moss', email: 'hannah@mosspr.co.uk', role: 'reporter', scope: 'account', status: 'active', addedOn: '12 Jan 2026', addedBy: 'James Keane', lastActive: '3 weeks ago' },
]

/** Emails already registered with Ditto — inviting one of these grants access immediately
 *  (they get a notification, not an invitation). Anyone else must sign up first. */
export const registeredDittoUsers = [
  'rema@mavin.com', 'ayra@mavin.com', 'burna@spaceship.com', 'wiz@starboy.com', 'tems@leadingvibe.com',
  'ckay@chocolatecity.com', 'fireboy@ybnl.com', 'omah@keystoneagency.com', 'asake@ybnl.com', 'kwame@studio45.co.uk',
]

/** Organisations this login belongs to, and the role held in each (avatar switcher) */
export interface Organisation {
  id: string
  name: string
  plan: string
  role: RoleId | 'owner'
}

export const organisations: Organisation[] = [
  { id: 'o1', name: 'Goldenboy Entertainment', plan: 'DITTO PLUS - RLS', role: 'owner' },
  { id: 'o2', name: 'Kaiga Records', plan: 'LABEL 10', role: 'manager' },
  { id: 'o3', name: 'Almost Joey', plan: 'PRO', role: 'artist' },
]
