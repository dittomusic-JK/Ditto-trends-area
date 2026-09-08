// Analytics › Videos — the Trends "Top Videos" ranking with a store breakdown
// beneath it. Figures modelled on content.dittomusic.com/analytics/trends/rankings/videos.
import type { PerformanceDataPoint, Store } from '../types'
import { videoReleases } from './videoMockData'

export interface VideoRanking {
  id: string
  rank: number
  title: string
  artist: string
  thumbnail: string
  views: number
  proportion: number
  platform: string
  /** This video's monthly views vs its previous period — drives the chart when focused */
  performance: PerformanceDataPoint[]
  /** This video's own platform mix */
  stores: Store[]
}

export interface VideoAnalyticsData {
  totalViews: number
  performance: PerformanceDataPoint[]
  videos: VideoRanking[]
  stores: Store[]
}

const thumb = (i: number) => videoReleases[i % videoReleases.length].artwork

const months = ['Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26', 'Aug 26', 'Sep 26']

// Each video gets its own shape: a launch spike somewhere in the year, tailing off after
const videoPerformance = (total: number, peakMonth: number): PerformanceDataPoint[] => {
  const weights = months.map((_, m) => {
    const d = m - peakMonth
    return d < 0 ? 0.25 + 0.05 * m : Math.max(0.2, 1.6 * Math.exp(-d / 3.2))
  })
  const sum = weights.reduce((a, b) => a + b, 0)
  return months.map((day, m) => ({
    day,
    current: Math.round((total * weights[m]) / sum),
    previous: Math.round((total * 0.55 * weights[(m + 5) % 12]) / sum),
  }))
}

// Platform mix varies by where the video was pushed hardest.
// Ditto delivers video to five stores: Spotify, Apple Music, VEVO, TIDAL, Amazon Music.
const STORE_NAMES: Record<string, string> = { vevo: 'VEVO', spotify: 'Spotify', 'apple-music': 'Apple Music', tidal: 'TIDAL', 'amazon-music': 'Amazon Music' }
const storeKey = (name: string) => Object.keys(STORE_NAMES).find(k => STORE_NAMES[k] === name) ?? 'vevo'
const storeMix = (views: number, lead: string): Store[] => {
  const base: Record<string, number> = { vevo: 46, spotify: 24, 'apple-music': 17, tidal: 8, 'amazon-music': 5 }
  base[storeKey(lead)] += 22
  const sum = Object.values(base).reduce((a, b) => a + b, 0)
  return Object.entries(base)
    .map(([id, w]) => ({ id, name: STORE_NAMES[id], icon: id, proportion: Math.round((w / sum) * 1000) / 10, streams: Math.round((views * w) / sum) }))
    .sort((a, b) => b.proportion - a.proportion)
}

const rawViews = [13326386, 9765416, 8181010, 7455554, 6902113, 5410880, 4823001, 3781230, 3109808, 3067643, 2493951, 1911266]
const total = rawViews.reduce((a, b) => a + b, 0)

const titles: [string, string, string][] = [
  ['Summer Vibes (Official Video)', 'Darkoo', 'VEVO'],
  ['My Baby (Obimo) [Official Video]', 'Almost Joey', 'Spotify'],
  ['Favourite Girl (with Rema) — Official Video', 'Darkoo', 'VEVO'],
  ['Solar (Visualiser)', 'Darkoo & Ruger', 'Apple Music'],
  ['Midnight Run (Live Performance)', 'Almost Joey', 'VEVO'],
  ['RHUDE GYAL! (with JELEEL!) — Official Video', 'Darkoo', 'VEVO'],
  ['Your Number (Lyric Video)', 'Darkoo', 'Spotify'],
  ['Like Dat (Official Video)', 'Darkoo', 'Apple Music'],
  ['Golden Hour (Visualiser)', 'Almost Joey', 'TIDAL'],
  ['Obimo (Official Video)', 'Almost Joey', 'VEVO'],
  ['Right Now (with Davido & Rvssian)', 'Darkoo', 'VEVO'],
  ['Your Waist (Official Video)', 'Almost Joey', 'Amazon Music'],
]

export const videoAnalyticsData: VideoAnalyticsData = {
  totalViews: total,
  // Monthly views, Oct 25 → Sep 26, vs the previous twelve months
  performance: [
    ['Oct 25', 6.9, 5.1], ['Nov 25', 7.2, 5.4], ['Dec 25', 6.4, 5.0], ['Jan 26', 6.1, 4.8],
    ['Feb 26', 6.6, 5.2], ['Mar 26', 8.1, 5.9], ['Apr 26', 7.4, 5.6], ['May 26', 6.3, 5.3],
    ['Jun 26', 5.9, 5.1], ['Jul 26', 5.2, 4.7], ['Aug 26', 5.6, 4.9], ['Sep 26', 4.9, 4.4],
  ].map(([day, c, p]) => ({ day: day as string, current: Math.round((c as number) * 1_000_000), previous: Math.round((p as number) * 1_000_000) })),
  videos: titles.map(([title, artist, platform], i) => ({
    id: `va-${i + 1}`,
    rank: i + 1,
    title,
    artist,
    thumbnail: thumb(i),
    views: rawViews[i],
    proportion: Math.round((rawViews[i] / total) * 1000) / 10,
    platform,
    performance: videoPerformance(rawViews[i], [5, 2, 8, 0, 6, 3, 9, 1, 7, 4, 10, 2][i]),
    stores: storeMix(rawViews[i], platform),
  })),
  stores: [
    { id: 'vevo', name: 'VEVO', icon: 'vevo', proportion: 47.6, streams: Math.round(total * 0.476) },
    { id: 'spotify', name: 'Spotify', icon: 'spotify', proportion: 23.8, streams: Math.round(total * 0.238) },
    { id: 'apple-music', name: 'Apple Music', icon: 'apple-music', proportion: 16.1, streams: Math.round(total * 0.161) },
    { id: 'tidal', name: 'TIDAL', icon: 'tidal', proportion: 8.0, streams: Math.round(total * 0.08) },
    { id: 'amazon-music', name: 'Amazon Music', icon: 'amazon-music', proportion: 4.5, streams: Math.round(total * 0.045) },
  ],
}
