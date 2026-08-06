// Mock data for the music release builder (Create > Music Release).
// Mirrors the live dashboard builder flow: Upload > Details > Schedule > Stores > Review.

export interface ArtistEntry {
  id: string
  name: string
  initials: string
}

export interface TrackArtists {
  primary: ArtistEntry[]
  featured: ArtistEntry[]
  remixer: ArtistEntry[]
  showFeatured: boolean
  showRemixer: boolean
}

export interface TrackCredit {
  name: string
  role: string
}

export interface TrackCredits {
  composer: string
  songwriter: TrackCredit
  production: TrackCredit
  performer: TrackCredit
  additional: TrackCredit[]
}

export interface BuilderTrack {
  id: string
  title: string
  duration: string
  durationSec: number
  audioFile: string
  hasLicense: boolean
  licenseFile: string | null
  version: string
  previewStart: number
  customIsrc: boolean
  customIsrcValue: string
  addLyrics: boolean
  fingerprint: boolean
  explicit: boolean
  copyrightHolder: string
  copyrightYear: number
  pCopyrightHolder: string
  productionYear: number
  artists: TrackArtists
  // Set once the user edits this track's artists directly — stops the
  // release-level artists from overwriting their choice.
  artistsCustomized: boolean
  credits: TrackCredits
  metadataTouched: boolean
}

export const makeBuilderTrack = (id: string, title: string, duration: string, durationSec: number, audioFile: string): BuilderTrack => ({
  id,
  title,
  duration,
  durationSec,
  audioFile,
  hasLicense: false,
  licenseFile: null,
  version: '',
  previewStart: 30,
  customIsrc: false,
  customIsrcValue: '',
  addLyrics: false,
  fingerprint: false,
  explicit: false,
  copyrightHolder: '',
  copyrightYear: 2026,
  pCopyrightHolder: '',
  productionYear: 2026,
  artists: { primary: [], featured: [], remixer: [], showFeatured: false, showRemixer: false },
  artistsCustomized: false,
  credits: {
    composer: '',
    songwriter: { name: '', role: '' },
    production: { name: '', role: '' },
    performer: { name: '', role: '' },
    additional: [],
  },
  metadataTouched: false,
})

// Release type rules per the Stage 5 spec:
// Single — ≤3 tracks, each ≤10 min. EP — ≤6 tracks and total ≤30 min, OR >3
// tracks with at least one >10 min and total <30 min. Album — anything else.
export const computeReleaseType = (tracks: BuilderTrack[]): 'Single' | 'EP' | 'Album' => {
  const n = tracks.length
  if (n === 0) return 'Single'
  const total = tracks.reduce((s, t) => s + t.durationSec, 0)
  const longest = Math.max(...tracks.map(t => t.durationSec))
  if (n <= 3 && longest <= 600) return 'Single'
  if ((n <= 6 && total <= 1800) || (n > 3 && longest > 600 && total < 1800)) return 'EP'
  return 'Album'
}

// A user HAS to complete credits (plus track copyright) before the release is valid.
export const isTrackMetadataComplete = (t: BuilderTrack): boolean =>
  t.copyrightHolder.trim().length >= 2 &&
  t.pCopyrightHolder.trim().length >= 2 &&
  t.credits.composer.trim().length > 0 &&
  t.credits.songwriter.name.trim().length > 0 && t.credits.songwriter.role.trim().length > 0 &&
  t.credits.production.name.trim().length > 0 && t.credits.production.role.trim().length > 0 &&
  t.credits.performer.name.trim().length > 0 && t.credits.performer.role.trim().length > 0

export interface StoreDef {
  id: string
  name: string
  icon?: string
  letter?: string
  tileColor?: string
  type: 'streaming' | 'download' | 'both'
}

export interface AdvancedStoreDef {
  id: string
  name: string
  description: string
  price?: number
  icon?: string
  letter?: string
  tileColor?: string
}

export const primaryGenres = [
  'Afrobeats', 'Alternative', 'Ambient', 'Blues', 'Classical', 'Country', 'Dance',
  'Electronic', 'Folk', 'Hip Hop/Rap', 'House', 'Indie', 'Jazz', 'Latin', 'Metal',
  'Pop', 'R&B/Soul', 'Reggae', 'Rock', 'Singer/Songwriter', 'Soundtrack', 'Techno', 'World',
]

export const releaseLanguages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch',
  'Japanese', 'Korean', 'Mandarin', 'Hindi', 'Arabic', 'Swahili', 'Instrumental',
]

export const copyrightYears = [2026, 2025, 2024, 2023, 2022, 2021, 2020]

// Track credit role lists (searchable dropdowns, per the live builder)
export const songwriterRoles = ['Arranger', 'Author', 'Conductor', 'Librettist', 'Lyricist']

export const productionRoles = [
  'Assistant Producer', 'Mastering Engineer', 'Mixing Engineer', 'Musical Director', 'Producer', 'Sound Engineer',
]

export const performerRoles = [
  'Accordion', 'Acoustic Guitar', 'Alto Saxophone', 'Background Vocals', 'Banjo', 'Baritone Saxophone',
  'Bass Clarinet', 'Bass Guitar', 'Bass Trombone', 'Bassoon', 'Cello', 'Clarinet', 'Double Bass',
  'Drums', 'Electric Guitar', 'Flute', 'French Horn', 'Harmonica', 'Harp', 'Keyboards', 'Lead Vocals',
  'Mandolin', 'Oboe', 'Organ', 'Percussion', 'Piano', 'Piccolo', 'Rap Vocals', 'Saxophone', 'Strings',
  'Synthesizer', 'Tambourine', 'Tenor Saxophone', 'Trombone', 'Trumpet', 'Tuba', 'Turntables',
  'Ukulele', 'Viola', 'Violin', 'Vocals',
]

// Additional credit rows can hold any role
export const allCreditRoles = [...new Set([...songwriterRoles, ...productionRoles, ...performerRoles])].sort()

// Standard store grid — icons from /img where we have them, letter tiles otherwise.
export const standardStores: StoreDef[] = [
  { id: 'spotify', name: 'Spotify', icon: '/img/spotify-icon.svg', type: 'streaming' },
  { id: 'itunes', name: 'iTunes', letter: 'iT', tileColor: '#c86dd7', type: 'download' },
  { id: 'shazam', name: 'Shazam', icon: '/img/shazam-icon.svg', type: 'streaming' },
  { id: 'apple-music', name: 'Apple Music', icon: '/img/apple-music-icon.svg', type: 'streaming' },
  { id: 'amazon', name: 'Amazon', icon: '/img/amazonmusic-icon.svg', type: 'both' },
  { id: 'facebook', name: 'Facebook', icon: '/img/facebook-icon.svg', type: 'streaming' },
  { id: 'instagram', name: 'Instagram', icon: '/img/instagram-icon.svg', type: 'streaming' },
  { id: 'whatsapp', name: 'WhatsApp', letter: 'W', tileColor: '#25d366', type: 'streaming' },
  { id: 'iheart', name: 'I Heart Radio', letter: 'iH', tileColor: '#c6002b', type: 'streaming' },
  { id: 'pandora', name: 'Pandora', letter: 'P', tileColor: '#3668ff', type: 'streaming' },
  { id: 'deezer', name: 'Deezer', icon: '/img/deezer-icon.svg', type: 'streaming' },
  { id: 'tidal', name: 'Tidal', icon: '/img/tidal-icon.svg', type: 'streaming' },
  { id: 'tiktok', name: 'TikTok', icon: '/img/tiktok-icon.svg', type: 'streaming' },
  { id: 'capcut', name: 'CapCut', letter: 'CC', tileColor: '#111111', type: 'streaming' },
  { id: 'youtube-music', name: 'YouTube Music', icon: '/img/youtube-icon.svg', type: 'streaming' },
  { id: 'claro', name: 'Claro Musica', letter: 'CM', tileColor: '#e0302a', type: 'both' },
  { id: 'soundcloud', name: 'SoundCloud', icon: '/img/soundcloud_icon.svg', type: 'streaming' },
  { id: 'mixcloud', name: 'Mixcloud', letter: 'MX', tileColor: '#5000ff', type: 'streaming' },
  { id: '7digital', name: '7digital', letter: '7d', tileColor: '#1d2b64', type: 'download' },
  { id: 'soundtrack-brand', name: 'Soundtrack Your Brand', letter: 'SB', tileColor: '#f05537', type: 'streaming' },
  { id: 'snapchat', name: 'Snapchat', letter: 'S', tileColor: '#fffc00', type: 'streaming' },
  { id: 'musixmatch', name: 'Musixmatch', letter: 'MM', tileColor: '#ff2453', type: 'streaming' },
  { id: 'boomplay', name: 'Boomplay', icon: '/img/boomplay-icon.svg', type: 'streaming' },
  { id: 'audiomack', name: 'Audiomack', icon: '/img/audiomack-icon.svg', type: 'streaming' },
  { id: 'vevo', name: 'Vevo', icon: '/img/vevo-icon.svg', type: 'streaming' },
]

export const advancedStores: AdvancedStoreDef[] = [
  {
    id: 'youtube-content-id',
    name: 'YouTube Content ID & Shorts',
    description: "Get paid whenever your music is used in a YouTube video. We'll add this release to YouTube's Content ID database and continuously scan for matches. Any ad revenue will automatically go to you, instead of whoever uploaded the video. Your release will also be available on YouTube Shorts.",
    icon: '/img/youtube-icon.svg',
  },
  {
    id: 'ai-platforms',
    name: 'AI Platforms',
    description: 'A new revenue stream from your music. AI platforms pay to license tracks for training their models. This is optional and independent from your other stores.',
    letter: 'AI',
    tileColor: '#1c1c24',
  },
  {
    id: 'audio-fingerprint',
    name: 'Audio Fingerprint',
    description: 'Add this release to the global databases used to match music with artists info and protect tracks from copyright infringement.',
    letter: 'AF',
    tileColor: '#101f3c',
  },
  {
    id: 'beatport',
    name: 'Beatport Distribution & Label Setup',
    description: "If you don't have a Beatport label, you will need to set one up before releasing music on Beatport.",
    price: 49,
    letter: 'B',
    tileColor: '#111111',
  },
]

export const chartRegions = [
  { id: 'uk-ireland', label: 'UK / Ireland', price: 25 },
  { id: 'us-canada', label: 'US / Canada', price: 25 },
  { id: 'australia', label: 'Australia', price: 25 },
  { id: 'worldwide', label: 'Worldwide', price: 69 },
]
