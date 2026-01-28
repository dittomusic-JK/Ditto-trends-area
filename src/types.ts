export type ViewType = 'metrics' | 'releases' | 'tracks' | 'playlists' | 'audience' | 'source'

export type TrendsType = 'streaming' | 'download' | 'fingerprint' | 'content' | 'preorder'

export interface Filter {
  id: string
  type: 'label' | 'artist' | 'release' | 'track' | 'country' | 'store'
  label: string
  value: string
}

export interface StatsCard {
  id: string
  title: string
  value: string | number
  change?: number // percentage change
  icon?: string
  iconType?: 'broadcast' | 'clock' | 'store'
  storeIcon?: string // for "Best Store" card
  storeName?: string
}

export interface PerformanceDataPoint {
  day: string
  current: number
  previous: number
}

export interface StoreSeriesPoint {
  total: number
  date: string
}

export interface Store {
  id: string
  name: string
  icon: string
  proportion: number // percentage
  streams: number
  series?: StoreSeriesPoint[] // daily breakdown
}

export interface Release {
  id: string
  rank: number
  title: string
  artwork: string
  trackCount: number
  artist: string
  artists?: string[] // for multiple artists
  streams: number
  uniqueListeners: number
  streamsPerListener: number
}

export interface Track {
  id: string
  rank: number
  title: string
  artwork: string
  releaseName: string
  artist: string
  artists?: string[]
  streams: number
  uniqueListeners: number
  streamsPerListener: number
}

export interface PlaylistTrack {
  id: string
  name: string
  artist: string
  streams: number
  addDate: string
  streamsSince?: number
  skipRate: number
}

export interface Playlist {
  id: string
  rank: number
  name: string
  artwork: string
  trackCount: number
  streams: number
  followers: number | null
  curator: string
  skipRate: number
  tracks?: PlaylistTrack[]
  isExpanded?: boolean
}

export interface GenderData {
  male: number
  female: number
}

export interface AgeRangeData {
  range: string
  total: number
  male: number
  female: number
}

export interface CountryData {
  rank: number
  country: string
  ratio: number
  streams: number
  code?: string // ISO country code
}

export interface CityData {
  rank: number
  city: string
  streams: number
  proportion?: number
  country?: string
}

export interface GenderTrendPoint {
  date: string
  male: number
  female: number
}

export interface AudienceData {
  gender: GenderData
  genderTrend?: GenderTrendPoint[]
  ageRanges: AgeRangeData[]
  countries: CountryData[]
  cities: CityData[]
}

export interface MetricsData {
  stats: StatsCard[]
  performance: PerformanceDataPoint[]
  stores: Store[]
}

export interface DateRange {
  start: string
  end: string
}

// Source/Origin data types
export interface SourceTrendPoint {
  date: string
  value: number
}

export interface SourceData {
  id: string
  name: string
  icon: string
  proportion: number
  streams: number
  breakdown?: {
    user?: number
    automated?: number
    editorial?: number
  }
  trend?: SourceTrendPoint[]
}

export interface SourceViewData {
  sources: SourceData[]
  totalStreams: number
}
