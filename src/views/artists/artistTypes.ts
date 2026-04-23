// View types for navigation
export type ArtistViewType = 'overview' | 'releases' | 'contributions' | 'smartlinks' | 'integrations' | 'contracts'

export type ArtistFilterType = 'all' | 'plan' | 'release' | 'contributing'
export type ArtistType = 'plan' | 'release' | 'contributing'

// Store IDs for various platforms
export interface StoreIds {
  spotify?: string
  appleMusic?: string
  soundcloud?: string
  deezer?: string
  audiomack?: string
  amazon?: string
}

// Social media links
export interface SocialLinks {
  facebook?: string
  tiktok?: string
  twitter?: string
  instagram?: string
  youtube?: string
}

// Main Artist interface
export interface Artist {
  id: string
  name: string
  avatar: string
  bannerImage?: string
  artistType: ArtistType  // 'plan' = paying plan artist, 'release' = secondary artist on release, 'contributing' = featured/split artist
  isPlanArtist: boolean   // Keep for backwards compatibility
  releaseCount: number
  website?: string
  bio?: string
  socialLinks: SocialLinks
  storeIds: StoreIds
}

// Top song in artist overview
export interface TopSong {
  id: string
  title: string
  artwork: string
  streams: number
}

// Top country in artist overview
export interface TopCountry {
  rank: number
  country: string
  code: string
  streams: number
}

// Artist release (for Releases and Contributions views)
export type ArtistRole = 'Performer' | 'Featured' | 'Remixer'
export type ReleaseStatus = 'Active' | 'Sent to stores' | 'Pending' | 'Processing'

export interface ArtistRelease {
  id: string
  title: string
  artwork: string
  releaseDate: string
  artistRole: ArtistRole
  status: ReleaseStatus
}

// Smartlink
export type SmartlinkStatus = 'Released' | 'Pre-Release'

export interface Smartlink {
  id: string
  title: string
  artwork: string
  artist: string
  url: string
  status: SmartlinkStatus
  releaseDate: string
  clicks: number
}

// Integration platforms
export interface Integration {
  id: string
  name: string
  description: string
  icon: string
  buttonText: string
  isConnected: boolean
}

// Contract types
export type ContractType = 
  | 'exclusive-recording'
  | 'sample-clearance'
  | 'beat-lease'
  | 'distribution'
  | 'booking'
  | 'band-partnership'
  | 'collaborator-splits'
  | 'merchandising'

export type ContractStatus = 'Draft' | 'Processing' | 'Ready' | 'Ended' | 'Removed'

export interface AvailableContract {
  id: ContractType
  title: string
  description: string
  icon: string
  price: number  // Price in GBP
}

export interface UserContract {
  id: string
  name: string
  status: ContractStatus
  dateCreated: string
  canResend: boolean
}

// Artist overview data
export interface ArtistOverviewData {
  artist: Artist
  topSongs: TopSong[]
  topCountries: TopCountry[]
}
