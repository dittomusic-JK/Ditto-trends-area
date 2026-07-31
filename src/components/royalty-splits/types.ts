// Types for the royalty-splits components, ported 1:1 from the
// ditto-services project (ditto_royalty_splits).

export type UserType = 'subscription' | 'rls'
export type SplitStatus = 'active' | 'pending' | 'rejected' | 'unclaimed'

export interface Collaborator {
  id: string
  name: string
  email: string
  share: number
  status: SplitStatus
  activeSince?: string
  originalShare?: number // The share value before editing (for showing pending changes)
  hasAccount?: boolean // Whether the collaborator has a Ditto account (for subscription mode)
}

export interface TrackSplit {
  trackId: string
  trackNumber: number
  trackName: string
  splits: Collaborator[]
  userShare: number
}

export interface Release {
  id: string
  title: string
  artwork: string
  accountHolder: string
  tracks: TrackSplit[]
}
