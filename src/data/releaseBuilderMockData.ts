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
  /** AI disclosure: this credit was created with AI (partial releases; entirely-AI releases lock every credit on) */
  ai: boolean
}

export interface TrackCredits {
  composer: string
  composerAi: boolean
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
    composerAi: false,
    songwriter: { name: '', role: '', ai: false },
    production: { name: '', role: '', ai: false },
    performer: { name: '', role: '', ai: false },
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

export interface AdvancedSubPlatform {
  id: string
  name: string
  icon?: string
  letter?: string
  tileColor?: string
}

export interface AdvancedStoreDef {
  id: string
  name: string
  description: string
  price?: number
  icon?: string
  letter?: string
  tileColor?: string
  /** Bundled with a Pro plan — shown as a badge instead of a price */
  includedWithPro?: boolean
  /** Individually selectable platforms revealed when the parent is on */
  subPlatforms?: AdvancedSubPlatform[]
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
  { id: 'itunes', name: 'iTunes', icon: '/img/itunes-icon.svg', type: 'download' },
  { id: 'shazam', name: 'Shazam', icon: '/img/shazam-icon.svg', type: 'streaming' },
  { id: 'apple-music', name: 'Apple Music', icon: '/img/apple-music-icon.svg', type: 'streaming' },
  { id: 'amazon', name: 'Amazon', icon: '/img/amazonmusic-icon.svg', type: 'both' },
  { id: 'facebook', name: 'Facebook', icon: '/img/facebook-icon.svg', type: 'streaming' },
  { id: 'instagram', name: 'Instagram', icon: '/img/instagram-icon.svg', type: 'streaming' },
  { id: 'whatsapp', name: 'WhatsApp', icon: '/img/whatsapp-icon.svg', type: 'streaming' },
  { id: 'iheart', name: 'I Heart Radio', icon: '/img/iheart-icon.svg', type: 'streaming' },
  { id: 'pandora', name: 'Pandora', icon: '/img/pandora-icon.svg', type: 'streaming' },
  { id: 'deezer', name: 'Deezer', icon: '/img/deezer-icon.svg', type: 'streaming' },
  { id: 'tidal', name: 'Tidal', icon: '/img/tidal-icon.svg', type: 'streaming' },
  { id: 'tiktok', name: 'TikTok', icon: '/img/tiktok-icon.svg', type: 'streaming' },
  { id: 'capcut', name: 'CapCut', letter: 'CC', tileColor: '#111111', type: 'streaming' },
  { id: 'youtube-music', name: 'YouTube Music', icon: '/img/youtube-icon.svg', type: 'streaming' },
  { id: 'claro', name: 'Claro Musica', icon: '/img/claro-icon.svg', type: 'both' },
  { id: 'soundcloud', name: 'SoundCloud', icon: '/img/soundcloud_icon.svg', type: 'streaming' },
  { id: 'mixcloud', name: 'Mixcloud', icon: '/img/mixcloud-icon.svg', type: 'streaming' },
  { id: '7digital', name: '7digital', icon: '/img/7digital-icon.svg', type: 'download' },
  { id: 'soundtrack-brand', name: 'Soundtrack Your Brand', icon: '/img/soundtrack-brand-icon.svg', type: 'streaming' },
  { id: 'snapchat', name: 'Snapchat', icon: '/img/snapchat-icon.svg', type: 'streaming' },
  { id: 'musixmatch', name: 'Musixmatch', icon: '/img/musixmatch-icon.svg', type: 'streaming' },
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
    includedWithPro: true,
  },
  {
    id: 'ai-platforms',
    name: 'AI Platforms',
    description: 'A new revenue stream from your music. AI platforms pay to license tracks for training their models. This is optional and independent from your other stores.',
    icon: '/img/ai-platforms-icon.svg',
    subPlatforms: [
      { id: 'elevenlabs', name: 'ElevenLabs', icon: '/img/elevenlabs-icon.svg' },
      { id: 'udio', name: 'Udio', icon: '/img/udio-icon.svg' },
      { id: 'meta', name: 'Meta', icon: '/img/meta-icon.svg' },
    ],
  },
  {
    id: 'audio-fingerprint',
    name: 'Audio Fingerprint',
    description: 'Add this release to the global databases used to match music with artist info and protect tracks from copyright infringement.',
    icon: '/img/audio-fingerprint-icon.svg',
    includedWithPro: true,
    subPlatforms: [
      { id: 'jaxsta', name: 'Jaxsta', icon: '/img/jaxsta-icon.svg' },
      { id: 'acrcloud', name: 'ACRCloud', icon: '/img/acrcloud-icon.svg' },
      { id: 'soundcloud-id', name: 'SoundCloud ID', icon: '/img/soundcloud_icon.svg' },
      { id: 'gracenote', name: 'Gracenote', letter: 'GN', tileColor: '#1c1c24' },
      { id: 'soundmouse', name: 'Sound Mouse', icon: '/img/soundmouse-icon.svg' },
    ],
  },
  {
    id: 'beatport',
    name: 'Beatport Label Setup & Distribution',
    description: 'You need a label set up with Beatport to release your music on this store, one time only fee.',
    price: 65,
    icon: '/img/beatport-icon.svg',
  },
]

// Beatport needs a label and genres once it's switched on
export const beatportLabels = [
  'The Esoteric Order of Dagon Records',
  'Goldenboy Entertainment',
  'Set up a new label',
]

export const beatportGenres = [
  'Progressive Trance', 'Hard Trance', 'Techno (Peak Time / Driving)', 'Techno (Raw / Deep / Hypnotic)',
  'Tech House', 'Deep House', 'Melodic House & Techno', 'Drum & Bass', 'Dubstep', 'Bass House',
  'Minimal / Deep Tech', 'Afro House', 'Organic House', 'Electro House', 'Big Room', 'Trap / Wave',
]

export const chartRegions = [
  { id: 'uk-ireland', label: 'UK / Ireland', price: 25 },
  { id: 'us-canada', label: 'US / Canada', price: 25 },
  { id: 'australia', label: 'Australia', price: 25 },
  { id: 'worldwide', label: 'Worldwide', price: 69 },
]
