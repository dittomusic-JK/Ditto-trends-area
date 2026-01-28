import type { 
  MetricsData, 
  Release, 
  Track, 
  Playlist, 
  AudienceData,
  Store,
  SourceViewData,
  TrendsType
} from '../types'

// Full year of real streaming data from Ditto Trends API (Feb 2025 - Jan 2026)
const yearlyApiData = {
  total: 6891902,
  previousTotal: 465341,
  data: [
    {
      total: 6122694,
      previous: 427290,
      key: 'Spotify',
      id: '36',
      series: [
        { total: 580912, date: '2025-02-01' },
        { total: 524839, date: '2025-03-01' },
        { total: 495146, date: '2025-04-01' },
        { total: 442635, date: '2025-05-01' },
        { total: 433266, date: '2025-06-01' },
        { total: 427964, date: '2025-07-01' },
        { total: 432878, date: '2025-08-01' },
        { total: 488571, date: '2025-09-01' },
        { total: 629443, date: '2025-10-01' },
        { total: 473391, date: '2025-11-01' },
        { total: 654084, date: '2025-12-01' },
        { total: 539565, date: '2026-01-01' }
      ]
    },
    {
      total: 272489,
      previous: 13394,
      key: 'Boomplay',
      id: '622',
      series: [
        { total: 22121, date: '2025-02-01' },
        { total: 19871, date: '2025-03-01' },
        { total: 24359, date: '2025-04-01' },
        { total: 20779, date: '2025-05-01' },
        { total: 22939, date: '2025-06-01' },
        { total: 22474, date: '2025-07-01' },
        { total: 24554, date: '2025-08-01' },
        { total: 21734, date: '2025-09-01' },
        { total: 23327, date: '2025-10-01' },
        { total: 24263, date: '2025-11-01' },
        { total: 27481, date: '2025-12-01' },
        { total: 18587, date: '2026-01-01' }
      ]
    },
    {
      total: 234200,
      previous: 12826,
      key: 'YouTube',
      id: '167',
      series: [
        { total: 19292, date: '2025-02-01' },
        { total: 18509, date: '2025-03-01' },
        { total: 17691, date: '2025-04-01' },
        { total: 17680, date: '2025-05-01' },
        { total: 20764, date: '2025-06-01' },
        { total: 18007, date: '2025-07-01' },
        { total: 19483, date: '2025-08-01' },
        { total: 17123, date: '2025-09-01' },
        { total: 25578, date: '2025-10-01' },
        { total: 19443, date: '2025-11-01' },
        { total: 24427, date: '2025-12-01' },
        { total: 16203, date: '2026-01-01' }
      ]
    },
    {
      total: 208623,
      previous: 11062,
      key: 'Apple Music',
      id: '564',
      series: [
        { total: 20012, date: '2025-02-01' },
        { total: 17242, date: '2025-03-01' },
        { total: 19270, date: '2025-04-01' },
        { total: 17469, date: '2025-05-01' },
        { total: 15864, date: '2025-06-01' },
        { total: 15691, date: '2025-07-01' },
        { total: 15444, date: '2025-08-01' },
        { total: 15746, date: '2025-09-01' },
        { total: 21864, date: '2025-10-01' },
        { total: 17205, date: '2025-11-01' },
        { total: 18337, date: '2025-12-01' },
        { total: 14479, date: '2026-01-01' }
      ]
    },
    {
      total: 30169,
      previous: 520,
      key: 'Instagram',
      id: '910',
      series: [
        { total: 1565, date: '2025-02-01' },
        { total: 952, date: '2025-03-01' },
        { total: 1743, date: '2025-04-01' },
        { total: 611, date: '2025-05-01' },
        { total: 1260, date: '2025-06-01' },
        { total: 363, date: '2025-07-01' },
        { total: 2014, date: '2025-08-01' },
        { total: 908, date: '2025-09-01' },
        { total: 3925, date: '2025-10-01' },
        { total: 4959, date: '2025-11-01' },
        { total: 9857, date: '2025-12-01' },
        { total: 2012, date: '2026-01-01' }
      ]
    },
    {
      total: 16242,
      previous: 0,
      key: 'TikTok',
      id: '686',
      series: [
        { total: 0, date: '2025-02-01' },
        { total: 0, date: '2025-03-01' },
        { total: 0, date: '2025-04-01' },
        { total: 0, date: '2025-05-01' },
        { total: 827, date: '2025-06-01' },
        { total: 1864, date: '2025-07-01' },
        { total: 1925, date: '2025-08-01' },
        { total: 887, date: '2025-09-01' },
        { total: 2225, date: '2025-10-01' },
        { total: 2624, date: '2025-11-01' },
        { total: 2492, date: '2025-12-01' },
        { total: 3398, date: '2026-01-01' }
      ]
    },
    {
      total: 3179,
      previous: 175,
      key: 'Deezer',
      id: '16',
      series: [
        { total: 378, date: '2025-02-01' },
        { total: 342, date: '2025-03-01' },
        { total: 335, date: '2025-04-01' },
        { total: 272, date: '2025-05-01' },
        { total: 278, date: '2025-06-01' },
        { total: 252, date: '2025-07-01' },
        { total: 202, date: '2025-08-01' },
        { total: 210, date: '2025-09-01' },
        { total: 233, date: '2025-10-01' },
        { total: 290, date: '2025-11-01' },
        { total: 219, date: '2025-12-01' },
        { total: 168, date: '2026-01-01' }
      ]
    },
    {
      total: 1404,
      previous: 58,
      key: 'Amazon',
      id: '9',
      series: [
        { total: 95, date: '2025-02-01' },
        { total: 83, date: '2025-03-01' },
        { total: 67, date: '2025-04-01' },
        { total: 135, date: '2025-05-01' },
        { total: 185, date: '2025-06-01' },
        { total: 160, date: '2025-07-01' },
        { total: 136, date: '2025-08-01' },
        { total: 131, date: '2025-09-01' },
        { total: 146, date: '2025-10-01' },
        { total: 110, date: '2025-11-01' },
        { total: 96, date: '2025-12-01' },
        { total: 60, date: '2026-01-01' }
      ]
    },
    {
      total: 166,
      previous: 5,
      key: 'Soundcloud',
      id: '534',
      series: [
        { total: 17, date: '2025-02-01' },
        { total: 18, date: '2025-03-01' },
        { total: 6, date: '2025-04-01' },
        { total: 1, date: '2025-05-01' },
        { total: 5, date: '2025-06-01' },
        { total: 17, date: '2025-07-01' },
        { total: 8, date: '2025-08-01' },
        { total: 18, date: '2025-09-01' },
        { total: 18, date: '2025-10-01' },
        { total: 23, date: '2025-11-01' },
        { total: 21, date: '2025-12-01' },
        { total: 14, date: '2026-01-01' }
      ]
    },
    {
      total: 216,
      previous: 11,
      key: 'Facebook',
      id: '634',
      series: [
        { total: 0, date: '2025-02-01' },
        { total: 13, date: '2025-03-01' },
        { total: 0, date: '2025-04-01' },
        { total: 30, date: '2025-05-01' },
        { total: 16, date: '2025-06-01' },
        { total: 0, date: '2025-07-01' },
        { total: 0, date: '2025-08-01' },
        { total: 0, date: '2025-09-01' },
        { total: 157, date: '2025-10-01' },
        { total: 0, date: '2025-11-01' },
        { total: 0, date: '2025-12-01' },
        { total: 0, date: '2026-01-01' }
      ]
    }
  ]
}

// Map store keys to our icon names
const storeIconMap: Record<string, string> = {
  'Spotify': 'spotify',
  'Apple Music': 'apple-music',
  'Boomplay': 'boomplay',
  'YouTube': 'youtube',
  'TikTok': 'tiktok',
  'Instagram': 'instagram',
  'Deezer': 'deezer',
  'Amazon': 'amazon-music',
  'Soundcloud': 'soundcloud',
  'Facebook': 'facebook'
}

// Month names for labels
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Function to get data for a specific date range
export function getMetricsForDateRange(startDate: Date, endDate: Date): MetricsData {
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  
  // For ranges longer than 60 days, use monthly aggregated data
  // For shorter ranges, generate daily synthetic data based on monthly averages
  const useMonthlyData = daysDiff > 60
  
  // Filter and interpolate data for the date range
  const stores: Store[] = yearlyApiData.data
    .filter(s => s.key !== 'Unknown')
    .map(store => {
      // Get series data points that fall within or near the date range
      const filteredSeries = store.series.filter(point => {
        const pointDate = new Date(point.date)
        return pointDate >= new Date(startDate.getFullYear(), startDate.getMonth(), 1) &&
               pointDate <= new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0)
      })
      
      // If no data in range, use the most recent month's data scaled
      let series = filteredSeries.length > 0 ? filteredSeries : store.series.slice(-1)
      
      // Calculate total for this store - scale based on days if using monthly data for short period
      let storeTotal = series.reduce((sum, p) => sum + p.total, 0)
      
      // If short range but using monthly data, scale proportionally
      if (!useMonthlyData && series.length > 0) {
        const avgDaily = storeTotal / (series.length * 30) // Approximate daily average
        storeTotal = Math.round(avgDaily * daysDiff)
      }
      
      return {
        id: store.id,
        name: store.key,
        icon: storeIconMap[store.key] || store.key.toLowerCase(),
        proportion: 0,
        streams: storeTotal,
        series: series
      }
    })
    .filter(s => s.streams > 0)
    .sort((a, b) => b.streams - a.streams)
  
  // Calculate total and proportions
  const totalStreams = stores.reduce((sum, s) => sum + s.streams, 0)
  stores.forEach(store => {
    store.proportion = Math.round((store.streams / totalStreams) * 1000) / 10
  })
  
  // Build performance data
  let performance: { day: string; current: number; previous: number }[] = []
  
  if (useMonthlyData) {
    // Use monthly data points
    const dateMap = new Map<string, number>()
    stores.forEach(store => {
      store.series?.forEach(point => {
        const existing = dateMap.get(point.date) || 0
        dateMap.set(point.date, existing + point.total)
      })
    })
    
    performance = Array.from(dateMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, total]) => {
        const d = new Date(date)
        return {
          day: monthNames[d.getMonth()],
          current: total,
          previous: Math.round(total * 0.85)
        }
      })
  } else {
    // Generate daily data points for short ranges
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const dailyAvg = totalStreams / daysDiff
    
    for (let i = 0; i < daysDiff; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      // Add some variance to make the chart interesting
      const variance = 0.8 + Math.random() * 0.4 // 80% to 120%
      const dayValue = Math.round(dailyAvg * variance)
      
      // Use day name for <= 7 days, otherwise use date
      const label = daysDiff <= 7 
        ? dayNames[date.getDay()]
        : `${date.getDate()} ${monthNames[date.getMonth()]}`
      
      performance.push({
        day: label,
        current: dayValue,
        previous: Math.round(dayValue * 0.85)
      })
    }
  }
  
  // Ensure we always have at least some performance data
  if (performance.length === 0) {
    performance = [
      { day: 'Mon', current: Math.round(totalStreams / 7), previous: Math.round(totalStreams / 7 * 0.85) },
      { day: 'Tue', current: Math.round(totalStreams / 7 * 1.1), previous: Math.round(totalStreams / 7 * 0.9) },
      { day: 'Wed', current: Math.round(totalStreams / 7 * 0.95), previous: Math.round(totalStreams / 7 * 0.8) },
      { day: 'Thu', current: Math.round(totalStreams / 7 * 1.05), previous: Math.round(totalStreams / 7 * 0.88) },
      { day: 'Fri', current: Math.round(totalStreams / 7 * 1.15), previous: Math.round(totalStreams / 7 * 0.92) },
      { day: 'Sat', current: Math.round(totalStreams / 7 * 1.2), previous: Math.round(totalStreams / 7 * 0.95) },
      { day: 'Sun', current: Math.round(totalStreams / 7 * 0.9), previous: Math.round(totalStreams / 7 * 0.82) }
    ]
  }
  
  const dailyAverage = Math.round(totalStreams / Math.max(daysDiff, 1))
  const previousTotal = performance.reduce((sum, d) => sum + d.previous, 0)
  const changePercent = previousTotal > 0 
    ? Math.round(((totalStreams - previousTotal) / previousTotal) * 100 * 10) / 10
    : 0
  
  const bestStore = stores[0] || { name: 'Spotify', icon: 'spotify' }
  
  return {
    stats: [
      {
        id: '1',
        title: 'Total Streams',
        value: totalStreams.toLocaleString(),
        change: changePercent,
        iconType: 'broadcast'
      },
      {
        id: '2',
        title: 'Daily Average',
        value: dailyAverage.toLocaleString(),
        change: changePercent,
        iconType: 'clock'
      },
      {
        id: '3',
        title: 'Best Store',
        value: bestStore.name,
        iconType: 'store',
        storeIcon: bestStore.icon,
        storeName: bestStore.name
      }
    ],
    performance,
    stores
  }
}

// Default metrics data (full year)
const defaultStart = new Date('2025-02-01')
const defaultEnd = new Date('2026-01-31')
export const metricsData: MetricsData = getMetricsForDateRange(defaultStart, defaultEnd)

export const releasesData: Release[] = [
  {
    id: '1',
    rank: 1,
    title: 'Adventures of Chris Kaiga',
    artwork: '/img/image-1.png',
    trackCount: 8,
    artist: 'Chris Kaiga',
    streams: 48214,
    uniqueListeners: 23071,
    streamsPerListener: 2.1
  },
  {
    id: '2',
    rank: 2,
    title: 'Zimenice',
    artwork: '/img/image-3.png',
    trackCount: 1,
    artist: 'Chris Kaiga',
    streams: 16374,
    uniqueListeners: 11171,
    streamsPerListener: 1.2
  },
  {
    id: '3',
    rank: 3,
    title: 'Chain Chain',
    artwork: '/img/image-4.png',
    trackCount: 1,
    artist: 'Chris Kaiga',
    streams: 10794,
    uniqueListeners: 7192,
    streamsPerListener: 1.2
  },
  {
    id: '4',
    rank: 4,
    title: 'Niko on',
    artwork: '/img/image-5.png',
    trackCount: 1,
    artist: 'Chris Kaiga',
    streams: 9205,
    uniqueListeners: 6837,
    streamsPerListener: 1.2
  },
  {
    id: '5',
    rank: 5,
    title: 'Kameshika Signal',
    artwork: '/img/image-6.png',
    trackCount: 1,
    artist: 'Chris Kaiga',
    artists: ['Chris Kaiga', 'Cedo', 'Jungle', 'Chic'],
    streams: 8400,
    uniqueListeners: 5705,
    streamsPerListener: 1.3
  },
  {
    id: '6',
    rank: 6,
    title: 'Mwazzara',
    artwork: '/img/image-7.png',
    trackCount: 1,
    artist: 'Chris Kaiga',
    streams: 6112,
    uniqueListeners: 4081,
    streamsPerListener: 1.3
  },
  {
    id: '7',
    rank: 7,
    title: 'Fiti Na',
    artwork: '/img/image-8.png',
    trackCount: 1,
    artist: 'Chris Kaiga',
    streams: 3433,
    uniqueListeners: 2324,
    streamsPerListener: 1.3
  },
  {
    id: '8',
    rank: 8,
    title: 'I Want',
    artwork: '/img/image-9.png',
    trackCount: 1,
    artist: 'Chris Kaiga',
    streams: 2066,
    uniqueListeners: 573,
    streamsPerListener: 1.1
  },
  {
    id: '9',
    rank: 9,
    title: 'Kengele',
    artwork: '/img/image-10.png',
    trackCount: 3,
    artist: 'Chris Kaiga',
    streams: 1696,
    uniqueListeners: 108,
    streamsPerListener: 1.6
  },
  {
    id: '10',
    rank: 10,
    title: 'Next',
    artwork: '/img/image-11.png',
    trackCount: 1,
    artist: 'Chris Kaiga',
    streams: 1368,
    uniqueListeners: 930,
    streamsPerListener: 1.2
  }
]

export const tracksData: Track[] = [
  {
    id: '1',
    rank: 1,
    title: 'I Want',
    artwork: '/img/image-1.png',
    releaseName: 'Adventures of Chris Kaiga',
    artist: 'Chris Kaiga',
    streams: 48214,
    uniqueListeners: 23071,
    streamsPerListener: 2.1
  },
  {
    id: '2',
    rank: 2,
    title: 'Zimenice',
    artwork: '/img/image-3.png',
    releaseName: 'Zimenice',
    artist: 'Chris Kaiga',
    streams: 16374,
    uniqueListeners: 11171,
    streamsPerListener: 1.2
  },
  {
    id: '3',
    rank: 3,
    title: 'Kwa Ceiling',
    artwork: '/img/image-1.png',
    releaseName: 'Adventures of Chris Kaiga',
    artist: 'Chris Kaiga',
    streams: 10794,
    uniqueListeners: 7192,
    streamsPerListener: 1.2
  },
  {
    id: '4',
    rank: 4,
    title: 'Niko on',
    artwork: '/img/image-5.png',
    releaseName: 'Adventures of Chris Kaiga',
    artist: 'Chris Kaiga',
    streams: 9205,
    uniqueListeners: 6837,
    streamsPerListener: 1.2
  },
  {
    id: '5',
    rank: 5,
    title: 'Kameshika Signal',
    artwork: '/img/image-6.png',
    releaseName: 'Adventures of Chris Kaiga',
    artist: 'Chris Kaiga',
    artists: ['Chris Kaiga', 'Cedo'],
    streams: 8400,
    uniqueListeners: 5705,
    streamsPerListener: 1.3
  },
  {
    id: '6',
    rank: 6,
    title: 'Mwazzara',
    artwork: '/img/image-7.png',
    releaseName: 'Adventures of Chris Kaiga',
    artist: 'Chris Kaiga',
    streams: 6112,
    uniqueListeners: 4081,
    streamsPerListener: 1.3
  },
  {
    id: '7',
    rank: 7,
    title: 'Fiti Na',
    artwork: '/img/image-8.png',
    releaseName: 'Adventures of Chris Kaiga',
    artist: 'Chris Kaiga',
    streams: 3433,
    uniqueListeners: 2324,
    streamsPerListener: 1.3
  },
  {
    id: '8',
    rank: 8,
    title: 'I Want',
    artwork: '/img/image-9.png',
    releaseName: 'Adventures of Chris Kaiga',
    artist: 'Chris Kaiga',
    streams: 2066,
    uniqueListeners: 573,
    streamsPerListener: 1.1
  },
  {
    id: '9',
    rank: 9,
    title: 'Kengele',
    artwork: '/img/image-10.png',
    releaseName: 'Adventures of Chris Kaiga',
    artist: 'Chris Kaiga',
    streams: 1696,
    uniqueListeners: 108,
    streamsPerListener: 1.6
  },
  {
    id: '10',
    rank: 10,
    title: 'Next',
    artwork: '/img/image-11.png',
    releaseName: 'Adventures of Chris Kaiga',
    artist: 'Chris Kaiga',
    streams: 1368,
    uniqueListeners: 930,
    streamsPerListener: 1.2
  }
]

export const playlistsData: Playlist[] = [
  {
    id: '1',
    rank: 1,
    name: 'Mix',
    artwork: '/img/image-1.png',
    trackCount: 24,
    streams: 19140,
    followers: null,
    curator: 'Spotify AI',
    skipRate: 9,
    tracks: [
      {
        id: 't1-1',
        name: 'I Want',
        artist: 'Chris Kaiga',
        streams: 2341,
        addDate: '15 Jan 2025',
        streamsSince: 12450,
        skipRate: 8
      },
      {
        id: 't1-2',
        name: 'Kwa Ceiling',
        artist: 'Chris Kaiga',
        streams: 1892,
        addDate: '15 Jan 2025',
        streamsSince: 10234,
        skipRate: 7
      },
      {
        id: 't1-3',
        name: 'Niko on',
        artist: 'Chris Kaiga',
        streams: 1654,
        addDate: '18 Jan 2025',
        streamsSince: 8921,
        skipRate: 9
      },
      {
        id: 't1-4',
        name: 'Kameshika Signal',
        artist: 'Chris Kaiga',
        streams: 1423,
        addDate: '20 Jan 2025',
        streamsSince: 7856,
        skipRate: 11
      }
    ]
  },
  {
    id: '2',
    rank: 2,
    name: 'Made In Kenya',
    artwork: '/img/image-3.png',
    trackCount: 2,
    streams: 1319,
    followers: 47837,
    curator: 'Spotify',
    skipRate: 13,
    tracks: [
      {
        id: 't2-1',
        name: 'Fiti Na',
        artist: 'Chris Kaiga',
        streams: 588,
        addDate: '31 Jan 2025',
        streamsSince: 9112,
        skipRate: 13
      },
      {
        id: 't2-2',
        name: 'Mwazzara',
        artist: 'Chris Kaiga',
        streams: 731,
        addDate: '4 Apr 2025',
        streamsSince: 9112,
        skipRate: 13
      }
    ]
  },
  {
    id: '3',
    rank: 3,
    name: 'Your Radar Release',
    artwork: '/img/image-4.png',
    trackCount: 1,
    streams: 406,
    followers: null,
    curator: 'Spotify AI',
    skipRate: 13,
    tracks: [
      {
        id: 't3-1',
        name: 'Zimenice',
        artist: 'Chris Kaiga',
        streams: 406,
        addDate: '10 Feb 2025',
        streamsSince: 3421,
        skipRate: 13
      }
    ]
  },
  {
    id: '4',
    rank: 4,
    name: 'On Repeat',
    artwork: '/img/image-5.png',
    trackCount: 16,
    streams: 334,
    followers: null,
    curator: 'discoverweekly',
    skipRate: 21,
    tracks: [
      {
        id: 't4-1',
        name: 'I Want',
        artist: 'Chris Kaiga',
        streams: 124,
        addDate: '5 Feb 2025',
        streamsSince: 2341,
        skipRate: 19
      },
      {
        id: 't4-2',
        name: 'Kengele',
        artist: 'Chris Kaiga',
        streams: 98,
        addDate: '8 Feb 2025',
        streamsSince: 1892,
        skipRate: 22
      },
      {
        id: 't4-3',
        name: 'Next',
        artist: 'Chris Kaiga',
        streams: 112,
        addDate: '12 Feb 2025',
        streamsSince: 1654,
        skipRate: 23
      }
    ]
  },
  {
    id: '5',
    rank: 5,
    name: 'Gengetone Fire',
    artwork: '/img/image-6.png',
    trackCount: 2,
    streams: 272,
    followers: 29262,
    curator: 'Spotify',
    skipRate: 8,
    tracks: [
      {
        id: 't5-1',
        name: 'Kameshika Signal',
        artist: 'Chris Kaiga',
        streams: 156,
        addDate: '22 Jan 2025',
        streamsSince: 4521,
        skipRate: 7
      },
      {
        id: 't5-2',
        name: 'Mwazzara',
        artist: 'Chris Kaiga',
        streams: 116,
        addDate: '28 Jan 2025',
        streamsSince: 3892,
        skipRate: 9
      }
    ]
  },
  {
    id: '6',
    rank: 6,
    name: 'BEST LATEST GENGETONE HITS🇰🇪🔥 | KENYAN LOCAL...',
    artwork: '/img/image-7.png',
    trackCount: 4,
    streams: 214,
    followers: 2532,
    curator: 'Spotify',
    skipRate: 17,
    tracks: [
      {
        id: 't6-1',
        name: 'Fiti Na',
        artist: 'Chris Kaiga',
        streams: 67,
        addDate: '3 Feb 2025',
        streamsSince: 1234,
        skipRate: 15
      },
      {
        id: 't6-2',
        name: 'Niko on',
        artist: 'Chris Kaiga',
        streams: 54,
        addDate: '5 Feb 2025',
        streamsSince: 987,
        skipRate: 18
      },
      {
        id: 't6-3',
        name: 'Kwa Ceiling',
        artist: 'Chris Kaiga',
        streams: 48,
        addDate: '10 Feb 2025',
        streamsSince: 876,
        skipRate: 16
      },
      {
        id: 't6-4',
        name: 'Chain Chain',
        artist: 'Chris Kaiga',
        streams: 45,
        addDate: '14 Feb 2025',
        streamsSince: 765,
        skipRate: 19
      }
    ]
  }
]

export const audienceData: AudienceData = {
  gender: {
    male: 75.07,
    female: 24.93
  },
  genderTrend: [
    { date: '20 Jan', male: 15530, female: 4685 },
    { date: '21 Jan', male: 15926, female: 5112 },
    { date: '22 Jan', male: 16032, female: 5568 },
    { date: '23 Jan', male: 15036, female: 5293 },
    { date: '24 Jan', male: 15696, female: 5319 },
    { date: '25 Jan', male: 13003, female: 4308 },
    { date: '26 Jan', male: 14854, female: 4948 }
  ],
  ageRanges: [
    { range: '13-17', total: 3, male: 2.3, female: 0.7 },
    { range: '18-22', total: 18, male: 13.5, female: 4.5 },
    { range: '23-27', total: 32, male: 24, female: 8 },
    { range: '28-34', total: 26, male: 19.5, female: 6.5 },
    { range: '35-44', total: 14, male: 10.5, female: 3.5 },
    { range: '45-59', total: 5, male: 3.8, female: 1.2 },
    { range: '60+', total: 2, male: 1.5, female: 0.5 }
  ],
  countries: [
    { rank: 1, country: 'Kenya', ratio: 88.65, streams: 135431, code: 'KE' },
    { rank: 2, country: 'United States', ratio: 2.56, streams: 3908, code: 'US' },
    { rank: 3, country: 'United Kingdom', ratio: 1.03, streams: 1569, code: 'GB' },
    { rank: 4, country: 'Australia', ratio: 0.91, streams: 1383, code: 'AU' },
    { rank: 5, country: 'Canada', ratio: 0.78, streams: 1194, code: 'CA' },
    { rank: 6, country: 'Germany', ratio: 0.66, streams: 1012, code: 'DE' },
    { rank: 7, country: 'Tanzania', ratio: 0.65, streams: 1000, code: 'TZ' },
    { rank: 8, country: 'Uganda', ratio: 0.46, streams: 705, code: 'UG' },
    { rank: 9, country: 'United Arab Emirates', ratio: 0.38, streams: 575, code: 'AE' },
    { rank: 10, country: 'Netherlands', ratio: 0.33, streams: 509, code: 'NL' },
    { rank: 11, country: 'Qatar', ratio: 0.29, streams: 445, code: 'QA' },
    { rank: 12, country: 'France', ratio: 0.28, streams: 434, code: 'FR' },
    { rank: 13, country: 'Nigeria', ratio: 0.20, streams: 313, code: 'NG' },
    { rank: 14, country: 'South Africa', ratio: 0.17, streams: 267, code: 'ZA' },
    { rank: 15, country: 'Saudi Arabia', ratio: 0.16, streams: 248, code: 'SA' }
  ],
  cities: [
    { rank: 1, city: 'Nairobi', streams: 114573, proportion: 90.48, country: 'Kenya' },
    { rank: 2, city: 'Dar es Salaam', streams: 550, proportion: 0.43, country: 'Tanzania' },
    { rank: 3, city: 'London', streams: 527, proportion: 0.42, country: 'UK' },
    { rank: 4, city: 'Kampala', streams: 443, proportion: 0.35, country: 'Uganda' },
    { rank: 5, city: 'Doha', streams: 425, proportion: 0.34, country: 'Qatar' },
    { rank: 6, city: 'Kigali', streams: 239, proportion: 0.19, country: 'Rwanda' },
    { rank: 7, city: 'Perth', streams: 233, proportion: 0.18, country: 'Australia' },
    { rank: 8, city: 'Melbourne', streams: 214, proportion: 0.17, country: 'Australia' },
    { rank: 9, city: 'Paris', streams: 178, proportion: 0.14, country: 'France' },
    { rank: 10, city: 'Amsterdam', streams: 168, proportion: 0.13, country: 'Netherlands' },
    { rank: 11, city: 'Frankfurt', streams: 156, proportion: 0.12, country: 'Germany' },
    { rank: 12, city: 'Kuwait City', streams: 151, proportion: 0.12, country: 'Kuwait' },
    { rank: 13, city: 'Sydney', streams: 134, proportion: 0.11, country: 'Australia' },
    { rank: 14, city: 'Riyadh', streams: 133, proportion: 0.11, country: 'Saudi Arabia' },
    { rank: 15, city: 'Toronto', streams: 132, proportion: 0.10, country: 'Canada' }
  ]
}

// Generate performance data for a given date range
export function generatePerformanceData(startDate: Date, endDate: Date): { label: string; current: number; previous: number }[] {
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  const data: { label: string; current: number; previous: number }[] = []
  
  // Generate smooth curve data with realistic growth pattern
  const baseValue = 200
  const maxValue = 2500
  const growthFactor = Math.random() * 0.3 + 0.7 // Random growth 0.7-1.0
  
  for (let i = 0; i < daysDiff; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    
    // Create label based on range size
    let label: string
    if (daysDiff <= 7) {
      label = date.toLocaleDateString('en-US', { weekday: 'short' })
    } else if (daysDiff <= 31) {
      label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } else {
      label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
    
    // Generate current values with smooth growth curve + noise
    const progress = i / (daysDiff - 1 || 1)
    const curveValue = baseValue + (maxValue - baseValue) * Math.pow(progress, 0.7) * growthFactor
    const noise = (Math.random() - 0.5) * curveValue * 0.2
    const current = Math.round(curveValue + noise)
    
    // Previous period is lower with similar pattern
    const previousBase = curveValue * 0.6
    const previousNoise = (Math.random() - 0.5) * previousBase * 0.25
    const previous = Math.round(previousBase + previousNoise)
    
    data.push({ label, current, previous })
  }
  
  return data
}

// Calculate stats based on performance data
export function calculateStats(performanceData: { current: number; previous: number }[]): { total: number; dailyAvg: number; change: number } {
  const total = performanceData.reduce((sum, d) => sum + d.current, 0)
  const previousTotal = performanceData.reduce((sum, d) => sum + d.previous, 0)
  const dailyAvg = Math.round(total / performanceData.length)
  const change = previousTotal > 0 ? Math.round(((total - previousTotal) / previousTotal) * 100) : 0
  
  return { total, dailyAvg, change }
}

// Store-filtered data (for Spotify filter view)
export const spotifyMetricsData: MetricsData = {
  stats: [
    {
      id: '1',
      title: 'Total Streams',
      value: '12,151',
      change: 12,
      iconType: 'broadcast'
    },
    {
      id: '2',
      title: 'Daily Average',
      value: '1,423',
      change: 24,
      iconType: 'clock'
    },
    {
      id: '3',
      title: 'Best Store',
      value: 'Spotify',
      iconType: 'store',
      storeIcon: 'spotify',
      storeName: 'Spotify'
    }
  ],
  performance: [
    { day: 'Mon', current: 202, previous: 180 },
    { day: 'Tue', current: 380, previous: 290 },
    { day: 'Wed', current: 720, previous: 480 },
    { day: 'Thu', current: 950, previous: 620 },
    { day: 'Fri', current: 321, previous: 156 },
    { day: 'Sat', current: 1500, previous: 800 },
    { day: 'Sun', current: 2012, previous: 950 }
  ],
  stores: [
    { id: '1', name: 'Spotify', icon: 'spotify', proportion: 76.5, streams: 12151 }
  ]
}

// Source/Origin data from real Ditto API (20 Jan - 26 Jan 2026)
export const sourceData: SourceViewData = {
  totalStreams: 134960,
  sources: [
    {
      id: 's1',
      name: 'Radio',
      icon: 'radio',
      proportion: 61.97,
      streams: 83628,
      breakdown: { automated: 83628 },
      trend: [
        { date: '20 Jan', value: 11670 },
        { date: '21 Jan', value: 13209 },
        { date: '22 Jan', value: 13104 },
        { date: '23 Jan', value: 11118 },
        { date: '24 Jan', value: 11981 },
        { date: '25 Jan', value: 9910 },
        { date: '26 Jan', value: 12636 }
      ]
    },
    {
      id: 's2',
      name: 'Playlist',
      icon: 'playlist',
      proportion: 17.31,
      streams: 23356,
      breakdown: { user: 3740, automated: 19153, editorial: 463 },
      trend: [
        { date: '20 Jan', value: 3553 },
        { date: '21 Jan', value: 3305 },
        { date: '22 Jan', value: 3468 },
        { date: '23 Jan', value: 3835 },
        { date: '24 Jan', value: 3619 },
        { date: '25 Jan', value: 2842 },
        { date: '26 Jan', value: 2734 }
      ]
    },
    {
      id: 's3',
      name: 'Library',
      icon: 'library',
      proportion: 16.20,
      streams: 21869,
      breakdown: { user: 21869 },
      trend: [
        { date: '20 Jan', value: 3072 },
        { date: '21 Jan', value: 3165 },
        { date: '22 Jan', value: 3168 },
        { date: '23 Jan', value: 3388 },
        { date: '24 Jan', value: 3304 },
        { date: '25 Jan', value: 2849 },
        { date: '26 Jan', value: 2923 }
      ]
    },
    {
      id: 's4',
      name: 'Artist or Album',
      icon: 'artist',
      proportion: 3.11,
      streams: 4198,
      breakdown: { automated: 4198 },
      trend: [
        { date: '20 Jan', value: 709 },
        { date: '21 Jan', value: 518 },
        { date: '22 Jan', value: 657 },
        { date: '23 Jan', value: 679 },
        { date: '24 Jan', value: 661 },
        { date: '25 Jan', value: 562 },
        { date: '26 Jan', value: 412 }
      ]
    },
    {
      id: 's5',
      name: 'Search',
      icon: 'search',
      proportion: 1.41,
      streams: 1909,
      breakdown: { user: 1909 },
      trend: [
        { date: '20 Jan', value: 267 },
        { date: '21 Jan', value: 171 },
        { date: '22 Jan', value: 164 },
        { date: '23 Jan', value: 293 },
        { date: '24 Jan', value: 392 },
        { date: '25 Jan', value: 311 },
        { date: '26 Jan', value: 311 }
      ]
    }
  ]
}

// Trends Type specific data
// Fingerprint data (YouTube, TikTok, Instagram, Facebook, Shazam)
export const fingerprintStores: Store[] = [
  { id: 'fp1', name: 'YouTube', icon: 'youtube', proportion: 69.6, streams: 589065 },
  { id: 'fp2', name: 'TikTok', icon: 'tiktok', proportion: 23.5, streams: 198993 },
  { id: 'fp3', name: 'Instagram', icon: 'instagram', proportion: 6.5, streams: 55245 },
  { id: 'fp4', name: 'Facebook', icon: 'facebook', proportion: 0.4, streams: 2970 },
  { id: 'fp5', name: 'Shazam', icon: 'shazam', proportion: 0.03, streams: 247 }
]

// Content Production data (TikTok, Instagram, Facebook)
export const contentStores: Store[] = [
  { id: 'cp1', name: 'TikTok', icon: 'tiktok', proportion: 52.0, streams: 52400 },
  { id: 'cp2', name: 'Instagram', icon: 'instagram', proportion: 47.1, streams: 47450 },
  { id: 'cp3', name: 'Facebook', icon: 'facebook', proportion: 0.8, streams: 824 }
]

// Download data (iTunes, Amazon, Google Music)
export const downloadStores: Store[] = [
  { id: 'dl1', name: 'iTunes', icon: 'apple-music', proportion: 95.6, streams: 325 },
  { id: 'dl2', name: 'Amazon', icon: 'amazon-music', proportion: 4.1, streams: 14 },
  { id: 'dl3', name: 'Google Music', icon: 'google', proportion: 0.3, streams: 1 }
]

// Pre-order data
export const preorderStores: Store[] = [
  { id: 'po1', name: 'iTunes', icon: 'apple-music', proportion: 85.0, streams: 42 },
  { id: 'po2', name: 'Amazon', icon: 'amazon-music', proportion: 15.0, streams: 8 }
]

// Get metrics data for a specific trends type
export function getMetricsForTrendsType(type: TrendsType): MetricsData {
  const typeConfig: Record<TrendsType, { stores: Store[]; total: number; label: string; valueLabel: string }> = {
    streaming: {
      stores: metricsData.stores,
      total: 6891902,
      label: 'Total Streams',
      valueLabel: 'Streams'
    },
    fingerprint: {
      stores: fingerprintStores,
      total: 846520,
      label: 'Total Views',
      valueLabel: 'Views'
    },
    content: {
      stores: contentStores,
      total: 100674,
      label: 'Total Creations',
      valueLabel: 'Creations'
    },
    download: {
      stores: downloadStores,
      total: 340,
      label: 'Total Tracks EQ',
      valueLabel: 'Tracks EQ'
    },
    preorder: {
      stores: preorderStores,
      total: 50,
      label: 'Total Pre-orders',
      valueLabel: 'Pre-orders'
    }
  }
  
  const config = typeConfig[type]
  const dailyAvg = Math.round(config.total / 7)
  const bestStore = config.stores[0]
  
  return {
    stats: [
      {
        id: '1',
        title: config.label,
        value: config.total.toLocaleString(),
        change: 12.5,
        iconType: 'broadcast'
      },
      {
        id: '2',
        title: 'Daily Average',
        value: dailyAvg.toLocaleString(),
        change: 8.2,
        iconType: 'clock'
      },
      {
        id: '3',
        title: 'Best Platform',
        value: bestStore.name,
        iconType: 'store',
        storeIcon: bestStore.icon,
        storeName: bestStore.name
      }
    ],
    performance: metricsData.performance, // Reuse performance data shape
    stores: config.stores
  }
}
