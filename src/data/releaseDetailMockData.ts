// Rich per-release detail data powering the dedicated Release area
// (Overview / Stores / Services & Extras / Splits).

export interface ReleaseTrack {
  id: string
  number: number
  title: string
  artists: string
  isrc: string
  duration: string
}

export type SplitStatus = 'active' | 'pending' | 'unclaimed'

export interface SplitCollaborator {
  id: string
  name: string
  email: string
  share: number
  status: SplitStatus
  activeSince?: string
}

export interface TrackSplits {
  trackId: string
  collaborators: SplitCollaborator[]
}

export interface ReleaseService {
  id: string
  name: string
  description: string
  icon: string
  status: 'active' | 'inactive'
  price?: string
}

export interface ReleaseDetail {
  id: string
  title: string
  artist: string
  type: string
  year: string
  status: string
  artwork: string
  label: string
  copyright: string
  genre: string
  upc: string
  language: string
  releaseDate: string
  productionYear: string
  tracks: ReleaseTrack[]
  selectedStoreIds: string[]
  autoSendToNewStores: boolean
  services: ReleaseService[]
  splits: TrackSplits[]
}

export interface MusicStore {
  id: string
  name: string
  logo: string
  info: string
}

// ---- Store catalogue --------------------------------------------------------

export const musicStores: MusicStore[] = [
  { id: 'spotify', name: 'Spotify', logo: '/img/spotify-icon.svg', info: 'The world\'s largest streaming platform with 600M+ listeners across 180+ markets.' },
  { id: 'apple', name: 'Apple Music', logo: '/img/apple-music-icon.svg', info: 'Reach over 100M subscribers across the Apple ecosystem, including iTunes downloads.' },
  { id: 'amazon', name: 'Amazon Music', logo: '/img/amazonmusic-icon.svg', info: 'Streamed and downloadable on Amazon Music, available to Prime and Unlimited subscribers.' },
  { id: 'youtube', name: 'YouTube Music', logo: '/img/youtube-icon.svg', info: 'Your music on YouTube Music plus Content ID matching across user videos.' },
  { id: 'deezer', name: 'Deezer', logo: '/img/deezer-icon.svg', info: 'A global streaming service with strong reach across Europe and Latin America.' },
  { id: 'tidal', name: 'TIDAL', logo: '/img/tidal-icon.svg', info: 'HiFi-quality streaming with editorial playlist opportunities for emerging artists.' },
  { id: 'shazam', name: 'Shazam', logo: '/img/shazam-icon.svg', info: 'Make your music identifiable by Shazam\'s 300M+ monthly users.' },
  { id: 'soundcloud', name: 'SoundCloud', logo: '/img/soundcloud_icon.svg', info: 'Distribute directly to SoundCloud with monetisation enabled.' },
  { id: 'tiktok', name: 'TikTok', logo: '/img/tiktok-icon.svg', info: 'Available in TikTok\'s sound library for creators to use in their videos.' },
  { id: 'instagram', name: 'Instagram / Facebook', logo: '/img/instagram-icon.svg', info: 'Available in Reels and Stories music stickers across Meta platforms.' },
  { id: 'audiomack', name: 'Audiomack', logo: '/img/audiomack-icon.svg', info: 'A fast-growing platform with a strong Afrobeats and hip-hop audience.' },
  { id: 'boomplay', name: 'Boomplay', logo: '/img/boomplay-icon.svg', info: 'Africa\'s biggest streaming service with 100M+ users.' },
]

// ---- Services & Extras ------------------------------------------------------

const defaultServices = (active: string[] = []): ReleaseService[] => {
  const svc = (id: string, name: string, description: string, icon: string, price?: string): ReleaseService => ({
    id, name, description, icon,
    status: active.includes(id) ? 'active' : 'inactive',
    price,
  })
  return [
    svc('pre-release', 'Pre-release downloads', 'Offer pre-orders of your music on iTunes and Amazon before release day.', 'download', '£29'),
    svc('protection', 'Release Protection', 'Protect your release against fraudulent streams and copyright claims.', 'shield', '£12'),
    svc('charts-uk', 'Charts Registration UK / Ireland', 'Register your release with the Official Charts Company.', 'chart', '£25'),
    svc('charts-us', 'Charts Registration US / Canada', 'Register your release with Billboard and Nielsen SoundScan.', 'chart', '£25'),
    svc('charts-ww', 'Charts Registration Worldwide', 'Register your release with global chart providers.', 'chart', '£35'),
    svc('beatport', 'Beatport label', 'Deliver your release to Beatport under your own label.', 'vinyl', '£20'),
    svc('content-id', 'YouTube Content ID & Shorts', 'Monetise user videos on YouTube that use your music.', 'youtube', '£15'),
  ]
}

// ---- Split collaborators (trends universe) ---------------------------------

const c = (id: string, name: string, email: string, share: number, status: SplitStatus, activeSince?: string): SplitCollaborator =>
  ({ id, name, email, share, status, activeSince })

// ---- Curated release details ------------------------------------------------

// Keyed by `${title}|${artist}` from the MusicView release list.
const curated: Record<string, Partial<ReleaseDetail>> = {
  'Favourite Girl (with Rema)|Darkoo': {
    label: 'Golden Boy Entertainment',
    genre: 'Afrobeats',
    upc: '5054960371330',
    releaseDate: '2024-08-09',
    productionYear: '2024',
    tracks: [
      { id: 't1', number: 1, title: 'Favourite Girl (with Rema)', artists: 'Darkoo & Rema', isrc: 'GBLFP2450865', duration: '02:47' },
    ],
    splits: [
      { trackId: 't1', collaborators: [
        c('s1', 'Rema', 'rema@mavinrecords.com', 25, 'active', '17 Aug 2024'),
        c('s2', 'GA Productions', 'ga.beats@gmail.com', 10, 'unclaimed'),
      ]},
    ],
    services: defaultServices(['charts-uk', 'content-id']),
  },
  '$exy Girl $ummer (Vol.1)|Darkoo': {
    label: 'Golden Boy Entertainment',
    genre: 'Afrobeats',
    upc: '5054960412774',
    releaseDate: '2025-06-06',
    productionYear: '2025',
    tracks: [
      { id: 't1', number: 1, title: 'Your Number', artists: 'Darkoo', isrc: 'GBLFP2550101', duration: '02:31' },
      { id: 't2', number: 2, title: 'Like Dat', artists: 'Darkoo', isrc: 'GBLFP2550102', duration: '02:58' },
      { id: 't3', number: 3, title: 'Focus On Me', artists: 'Darkoo', isrc: 'GBLFP2550103', duration: '03:12' },
      { id: 't4', number: 4, title: 'RHUDE GYAL! (with JELEEL!)', artists: 'Darkoo & JELEEL!', isrc: 'GBLFP2550104', duration: '02:24' },
      { id: 't5', number: 5, title: 'Right Now', artists: 'Darkoo, Davido & Rvssian', isrc: 'GBLFP2550105', duration: '03:05' },
    ],
    splits: [
      { trackId: 't2', collaborators: [
        c('s1', 'Cash Beats', 'cashbeats@hotmail.com', 15, 'active', '6 Jun 2025'),
      ]},
      { trackId: 't4', collaborators: [
        c('s2', 'JELEEL!', 'jeleel@10k.com', 30, 'active', '6 Jun 2025'),
      ]},
      { trackId: 't5', collaborators: [
        c('s3', 'Davido', 'davido@dmwrecords.com', 25, 'pending'),
        c('s4', 'Rvssian', 'rvssian@headconcussion.co', 20, 'unclaimed'),
      ]},
    ],
    services: defaultServices(['pre-release', 'charts-uk', 'charts-ww']),
  },
  'Solar|Darkoo & Ruger': {
    label: 'Golden Boy Entertainment',
    genre: 'Afrobeats',
    upc: '5054960498812',
    releaseDate: '2026-03-13',
    productionYear: '2026',
    tracks: [
      { id: 't1', number: 1, title: 'Solar', artists: 'Darkoo & Ruger', isrc: 'GBLFP2650201', duration: '02:52' },
    ],
    splits: [
      { trackId: 't1', collaborators: [
        c('s1', 'Ruger', 'ruger@jonzing.com', 30, 'active', '13 Mar 2026'),
        c('s2', 'Blaise Beatz', 'blaisebeatz@gmial.com', 10, 'unclaimed'),
      ]},
    ],
    services: defaultServices(['protection', 'charts-uk', 'content-id']),
  },
  'If I Dey Lie (with Crayon)|Almost Joey & Crayon': {
    label: 'Golden Boy Entertainment',
    genre: 'Afropop',
    upc: '5054960356788',
    releaseDate: '2024-10-18',
    productionYear: '2024',
    tracks: [
      { id: 't1', number: 1, title: 'If I Dey Lie (with Crayon)', artists: 'Almost Joey & Crayon', isrc: 'GBLFP2450920', duration: '03:18' },
    ],
    splits: [
      { trackId: 't1', collaborators: [
        c('s1', 'Crayon', 'crayon@mavinrecords.com', 35, 'pending'),
      ]},
    ],
    services: defaultServices([]),
  },
}

// ---- Detail builder ---------------------------------------------------------

export interface ReleaseListItem {
  title: string
  artist: string
  type: string
  year: string
  status: string
  artwork: string
}

// The user's release catalogue (shared by the Music list and the release switcher)
export const releaseCatalog: ReleaseListItem[] = [
  { title: "My Baby (Obimo) [Kraizee Remix]", artist: "Almost Joey", type: "Single", year: "2026", status: "Live", artwork: "https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/05515479/artwork/transforms/almost-joey-my-baby-obimo-cover-art-69d668b083423454897202-69d6696c45975848731632-small.jpg" },
  { title: "My Baby (Obimo)", artist: "Almost Joey", type: "Single", year: "2026", status: "Live", artwork: "https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/05515461/artwork/transforms/almost-joey-my-baby-obimo-cover-art-69d668b083423454897202-small.jpg" },
  { title: "Solar", artist: "Darkoo & Ruger", type: "Single", year: "2026", status: "Live", artwork: "https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/05301321/artwork/transforms/p1680529-edit-edit-edit-69c138b3ab4dd252257380-small.jpg" },
  { title: "Obimo", artist: "Almost Joey", type: "Single", year: "2025", status: "Takedown", artwork: "https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/04149343/artwork/transforms/obimo-67f5311234c0d623819643-small.jpg" },
  { title: "RHUDE GYAL! (with Darkoo)", artist: "Darkoo & JELEEL!", type: "Single", year: "2025", status: "Live", artwork: "https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/04493329/artwork/transforms/rhude-gyal-cover-2-68946b428627b575326562-small.jpg" },
  { title: "$exy Girl $ummer (Vol.1)", artist: "Darkoo", type: "Album", year: "2025", status: "Live", artwork: "https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/04326032/artwork/transforms/darkoo-sexy-girl-summer-artwork-684334c523bdc995981350-small.jpg" },
  { title: "Your Number", artist: "Darkoo", type: "Single", year: "2025", status: "Live", artwork: "https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/04364587/artwork/transforms/darkoo-sexy-girl-summer-artwork-684334c523bdc995981350-large-685524c44ea97979283518-small.jpg" },
  { title: "$exy Girl $ummer (Vol.1)", artist: "Darkoo", type: "Album", year: "2025", status: "Takedown", artwork: "https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/04280153/artwork/transforms/darkoo-sexy-girl-summer-artwork-682de4f81edcc348240698-small.jpg" },
  { title: "Like Dat", artist: "Darkoo", type: "Single", year: "2025", status: "Live", artwork: "https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/04205225/artwork/transforms/likedat-darkooartboard-2-copy-68109d82d3560361244047-small.jpg" },
  { title: "Your Waist", artist: "Almost Joey", type: "Single", year: "2025", status: "Live", artwork: "https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/03784805/artwork/transforms/cover-your-waist-6762dd68c0aa2051281996-small.jpg" },
  { title: "If I Dey Lie (with Crayon)", artist: "Almost Joey & Crayon", type: "Single", year: "2024", status: "Live", artwork: "https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/03604256/artwork/transforms/cover-iidl-670e6069be298946644138-small.jpg" },
  { title: "Favourite Girl (with Rema)", artist: "Darkoo", type: "Single", year: "2024", status: "Live", artwork: "https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/03377228/artwork/transforms/darkoo-x-rema-favourite-girl-1-66b2194cd1729760795317-small.jpg" },
  { title: "Favourite Girl", artist: "Darkoo & Dess Dior", type: "Single", year: "2024", status: "Live", artwork: "https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/03131046/artwork/transforms/Darkoo-Dess-Dior-Artwork-resize-800x800-661d4903ce1a7-small.jpg" },
  { title: "Darkoo - EP", artist: "Darkoo", type: "Single", year: "2025", status: "Inactive", artwork: "https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/03977257/artwork/transforms/placeholder-67b852e678021833672407-small.jpg" },
  { title: "Focus On Me (All The Sexy Girls In The Club)", artist: "Darkoo", type: "Single", year: "2025", status: "Live", artwork: "https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/03797034/artwork/transforms/focus-on-mefom-67698b3e2f65e734260490-small.jpg" },
  { title: "One Of Them", artist: "Tion Wayne & Major League Djz", type: "Single", year: "2024", status: "Live", artwork: "https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/03669462/artwork/transforms/major-leauge-672cfbb3a6022534869049-small.jpg" },
  { title: "One Of Them", artist: "Tion Wayne & Major League Djz", type: "Single", year: "2024", status: "Live", artwork: "https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/03610317/artwork/transforms/photo-oct-08-2024-5-19-34-am-1-6710d40f92f4f490442808-small.jpg" },
  { title: "Right Now", artist: "Darkoo, Davido & Rvssian", type: "Single", year: "2024", status: "Takedown", artwork: "https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/03592636/artwork/transforms/rightnow-6703f7d700441946716686-large-67091ed8e14f2308646901-small.jpg" },
  { title: "Favourite Girl (with Rema)", artist: "Darkoo", type: "Single", year: "2024", status: "Live", artwork: "https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/03402136/artwork/transforms/darkoo-x-rema-favourite-girl-1-66b21947742ce580893980-small.jpg" },
  { title: "Right Now", artist: "Darkoo, Davido & Rvssian", type: "Single", year: "2024", status: "Live", artwork: "https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/03554659/artwork/transforms/rightnow-6703f7d700441946716686-small.jpg" },
  { title: "Favourite Girl (with Rema)", artist: "Darkoo & Rema", type: "Single", year: "2024", status: "Takedown", artwork: "https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/03377342/artwork/transforms/Placeholder-resize-800x800-669eaca9e1aae-small.jpg" },
  { title: "Sweet Thug", artist: "Tion Wayne & One Acen", type: "Single", year: "2018", status: "Live", artwork: "https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/03360937/artwork/transforms/small.jpg" },
]

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// ISRC generator that is stable for a given title
const isrcFor = (title: string, n: number) => {
  let h = 0
  for (const ch of title) h = (h * 31 + ch.charCodeAt(0)) % 100000
  return `GBLFP${String(h).padStart(5, '0')}${n}`
}

export const getReleaseDetail = (release: ReleaseListItem): ReleaseDetail => {
  const key = `${release.title}|${release.artist}`
  const cur = curated[key] ?? {}
  const baseTrack: ReleaseTrack[] = cur.tracks ?? [
    { id: 't1', number: 1, title: release.title, artists: release.artist, isrc: isrcFor(release.title, 1), duration: '03:02' },
  ]
  return {
    id: slug(`${release.title}-${release.artist}`),
    title: release.title,
    artist: release.artist,
    type: release.type,
    year: release.year,
    status: release.status,
    artwork: release.artwork,
    label: cur.label ?? 'Golden Boy Entertainment',
    copyright: `© ${cur.productionYear ?? release.year} ${cur.label ?? 'Golden Boy Entertainment'}`,
    genre: cur.genre ?? 'Afrobeats',
    upc: cur.upc ?? `50549603${String(slug(release.title).length * 7919 % 100000).padStart(5, '0')}`,
    language: 'English',
    releaseDate: cur.releaseDate ?? `${release.year}-01-01`,
    productionYear: cur.productionYear ?? release.year,
    tracks: baseTrack,
    selectedStoreIds: cur.selectedStoreIds ?? ['spotify', 'apple', 'amazon', 'youtube', 'deezer', 'tidal', 'shazam', 'tiktok'],
    autoSendToNewStores: cur.autoSendToNewStores ?? true,
    services: cur.services ?? defaultServices([]),
    splits: cur.splits ?? [],
  }
}
