import type { RoyaltiesStatsCard as StatsCard, EarningsDataPoint, StoreEarnings, CountryEarnings, SalesBreakdown, ReleaseEarnings, TrackEarnings } from '../types'

export const statsData: StatsCard[] = [
  {
    id: 'total-earnings',
    title: 'Lifetime Earnings',
    value: '£722,924.27',
    change: 12.4,
    icon: 'earnings',
  },
  {
    id: 'monthly-average',
    title: 'Monthly Average',
    value: '£15,540.87',
    change: 8.2,
    icon: 'average',
  },
  {
    id: 'best-store',
    title: 'Best Store',
    value: '£305,689.28',
    icon: 'store',
    storeIcon: 'spotify',
    storeName: 'Spotify',
  },
]

export const earningsData: EarningsDataPoint[] = [
  { month: 'Jan', total: 12400, streams: 10800, downloads: 1600 },
  { month: 'Feb', total: 13200, streams: 11500, downloads: 1700 },
  { month: 'Mar', total: 14800, streams: 13100, downloads: 1700 },
  { month: 'Apr', total: 13900, streams: 12200, downloads: 1700 },
  { month: 'May', total: 15200, streams: 13600, downloads: 1600 },
  { month: 'Jun', total: 16800, streams: 15100, downloads: 1700 },
  { month: 'Jul', total: 15540, streams: 13900, downloads: 1640 },
  { month: 'Aug', total: 17200, streams: 15500, downloads: 1700 },
  { month: 'Sep', total: 16100, streams: 14400, downloads: 1700 },
  { month: 'Oct', total: 18300, streams: 16700, downloads: 1600 },
  { month: 'Nov', total: 17600, streams: 15900, downloads: 1700 },
  { month: 'Dec', total: 19200, streams: 17500, downloads: 1700 },
]

export const storesData: StoreEarnings[] = [
  { id: 's1', name: 'Spotify', icon: 'spotify', earnings: 305689.28, proportion: 42.3, color: '#1DB954' },
  { id: 's2', name: 'Apple Music', icon: 'apple-music', earnings: 205986.33, proportion: 28.5, color: '#FC3C44' },
  { id: 's3', name: 'YouTube Content ID', icon: 'youtube', earnings: 69653.13, proportion: 9.6, color: '#FF0000' },
  { id: 's4', name: 'Amazon Music', icon: 'amazon-music', earnings: 29471.56, proportion: 4.1, color: '#00A8E1' },
  { id: 's5', name: 'YouTube Music', icon: 'youtube', earnings: 28605.02, proportion: 4.0, color: '#FF4444' },
  { id: 's6', name: 'Deezer', icon: 'deezer', earnings: 14980.85, proportion: 2.1, color: '#A238FF' },
  { id: 's7', name: 'TikTok', icon: 'tiktok', earnings: 12340.10, proportion: 1.7, color: '#010101' },
  { id: 's8', name: 'SoundCloud', icon: 'soundcloud', earnings: 8420.50, proportion: 1.2, color: '#FF5500' },
  { id: 's9', name: 'Tidal', icon: 'tidal', earnings: 6230.40, proportion: 0.86, color: '#000000' },
  { id: 's10', name: 'Boomplay', icon: 'boomplay', earnings: 4120.30, proportion: 0.57, color: '#FF006E' },
  { id: 's11', name: 'iHeartRadio', icon: 'soundcloud', earnings: 1890.20, proportion: 0.26, color: '#C6002B' },
  { id: 's12', name: 'Pandora', icon: 'soundcloud', earnings: 1245.80, proportion: 0.17, color: '#005483' },
  { id: 's13', name: 'Napster', icon: 'soundcloud', earnings: 342.10, proportion: 0.05, color: '#000000' },
  { id: 's14', name: 'Audiomack', icon: 'soundcloud', earnings: 186.50, proportion: 0.03, color: '#FFA200' },
  { id: 's15', name: 'Anghami', icon: 'soundcloud', earnings: 98.20, proportion: 0.01, color: '#8640f4' },
  { id: 's16', name: 'Resso', icon: 'soundcloud', earnings: 45.60, proportion: 0.01, color: '#12c1ae' },
  { id: 's17', name: 'Saavn/JioSaavn', icon: 'soundcloud', earnings: 18.40, proportion: 0.003, color: '#2BC5B4' },
]

export const countriesData: CountryEarnings[] = [
  { rank: 1, country: 'United Kingdom', code: 'gb', earnings: 289170, proportion: 40 },
  { rank: 2, country: 'United States', code: 'us', earnings: 144585, proportion: 20 },
  { rank: 3, country: 'Germany', code: 'de', earnings: 72292, proportion: 10 },
  { rank: 4, country: 'France', code: 'fr', earnings: 50605, proportion: 7 },
  { rank: 5, country: 'Canada', code: 'ca', earnings: 36146, proportion: 5 },
  { rank: 6, country: 'Netherlands', code: 'nl', earnings: 28917, proportion: 4 },
  { rank: 7, country: 'Australia', code: 'au', earnings: 21687, proportion: 3 },
  { rank: 8, country: 'Brazil', code: 'br', earnings: 14459, proportion: 2 },
  { rank: 9, country: 'Japan', code: 'jp', earnings: 10844, proportion: 1.5 },
  { rank: 10, country: 'Kenya', code: 'ke', earnings: 7229, proportion: 1 },
]

export const breakdownData: SalesBreakdown[] = [
  { type: 'Streams', sales: 7584995109, earnings: 713701.63, icon: 'streams' },
  { type: 'Track Downloads', sales: 9609, earnings: 9180.40, icon: 'downloads' },
  { type: 'Release Downloads', sales: 45, earnings: 41.78, icon: 'releases' },
  { type: 'Video Downloads', sales: 3, earnings: 0.46, icon: 'video' },
]

export const releasesData: ReleaseEarnings[] = [
  { id: 'r1', rank: 1, title: 'Adventures of Chris Kaiga', artwork: '/img/image-1.png', artist: 'Chris Kaiga', trackCount: 8, streams: 2412000, downloads: 3200, earnings: 245120.50 },
  { id: 'r2', rank: 2, title: 'Midnight Sessions', artwork: '/img/image-3.png', artist: 'Bensoul', trackCount: 12, streams: 1856000, downloads: 2100, earnings: 189340.20 },
  { id: 'r3', rank: 3, title: 'Stories Untold', artwork: '/img/image-4.png', artist: 'Nviiri the Storyteller', trackCount: 10, streams: 1234000, downloads: 1800, earnings: 126780.90 },
  { id: 'r4', rank: 4, title: 'Sol Generation', artwork: '/img/image-5.png', artist: 'Sauti Sol', trackCount: 14, streams: 890000, downloads: 1200, earnings: 91540.30 },
  { id: 'r5', rank: 5, title: 'Zimenice', artwork: '/img/image-6.png', artist: 'Chris Kaiga', trackCount: 1, streams: 456000, downloads: 800, earnings: 47230.15 },
  { id: 'r6', rank: 6, title: 'Chain Chain', artwork: '/img/image-7.png', artist: 'Bien', trackCount: 1, streams: 312000, downloads: 509, earnings: 22912.22 },
]

export const tracksData: TrackEarnings[] = [
  { id: 't1', rank: 1, title: 'I Want', artwork: '/img/image-1.png', artist: 'Chris Kaiga', releaseName: 'Adventures of Chris Kaiga', streams: 48214000, downloads: 1200, earnings: 98420.50 },
  { id: 't2', rank: 2, title: 'Zimenice', artwork: '/img/image-6.png', artist: 'Chris Kaiga', releaseName: 'Zimenice', streams: 16374000, downloads: 890, earnings: 67210.30 },
  { id: 't3', rank: 3, title: 'Kwa Ceiling', artwork: '/img/image-3.png', artist: 'Bensoul', releaseName: 'Midnight Sessions', streams: 10794000, downloads: 670, earnings: 45890.20 },
  { id: 't4', rank: 4, title: 'Chain Chain', artwork: '/img/image-7.png', artist: 'Bien', releaseName: 'Chain Chain', streams: 9205000, downloads: 540, earnings: 38120.80 },
  { id: 't5', rank: 5, title: 'Niko On', artwork: '/img/image-5.png', artist: 'Savara', releaseName: 'Sol Generation', streams: 8400000, downloads: 420, earnings: 34560.10 },
  { id: 't6', rank: 6, title: 'Kameshika Signal', artwork: '/img/image-8.png', artist: 'Chimano', releaseName: 'Sol Generation', streams: 6112000, downloads: 380, earnings: 25340.60 },
  { id: 't7', rank: 7, title: 'Midnight Train', artwork: '/img/image-4.png', artist: 'Nviiri the Storyteller', releaseName: 'Stories Untold', streams: 5230000, downloads: 310, earnings: 21890.40 },
  { id: 't8', rank: 8, title: 'Mwazzara', artwork: '/img/image-9.png', artist: 'Chris Kaiga', releaseName: 'Adventures of Chris Kaiga', streams: 4120000, downloads: 290, earnings: 17230.50 },
]
