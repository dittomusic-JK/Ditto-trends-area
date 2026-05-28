export interface VideoRelease {
  id: string
  title: string
  artist: string
  status: 'Live' | 'In Progress' | 'Processing' | 'Takedown' | 'Inactive'
  year: string
  type: 'Official Video' | 'Live Performance' | 'Lyric Video'
  artwork: string
  views: number
  platform: string
}

export const videoReleases: VideoRelease[] = [
  {
    id: 'vr-001',
    title: 'Summer Vibes (Official Video)',
    artist: 'Darkoo',
    status: 'Live',
    year: '2026',
    type: 'Official Video',
    artwork: 'https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/04326032/artwork/transforms/darkoo-sexy-girl-summer-artwork-684334c523bdc995981350-small.jpg',
    views: 1240000,
    platform: 'VEVO'
  },
  {
    id: 'vr-002',
    title: 'Midnight Run (Live Performance)',
    artist: 'Almost Joey',
    status: 'Live',
    year: '2026',
    type: 'Live Performance',
    artwork: 'https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/05515461/artwork/transforms/almost-joey-my-baby-obimo-cover-art-69d668b083423454897202-small.jpg',
    views: 856000,
    platform: 'Apple Music'
  },
  {
    id: 'vr-003',
    title: 'Solar (Official Video)',
    artist: 'Darkoo & Ruger',
    status: 'Live',
    year: '2026',
    type: 'Official Video',
    artwork: 'https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/05301321/artwork/transforms/p1680529-edit-edit-edit-69c138b3ab4dd252257380-small.jpg',
    views: 3450000,
    platform: 'VEVO'
  },
  {
    id: 'vr-004',
    title: 'Right Now (Lyric Video)',
    artist: 'Darkoo, Davido & Rvssian',
    status: 'In Progress',
    year: '2026',
    type: 'Lyric Video',
    artwork: 'https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/03554659/artwork/transforms/rightnow-6703f7d700441946716686-small.jpg',
    views: 0,
    platform: 'VEVO'
  },
  {
    id: 'vr-005',
    title: 'Favourite Girl (Official Video)',
    artist: 'Darkoo & Rema',
    status: 'Live',
    year: '2025',
    type: 'Official Video',
    artwork: 'https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/03377228/artwork/transforms/darkoo-x-rema-favourite-girl-1-66b2194cd1729760795317-small.jpg',
    views: 5670000,
    platform: 'VEVO'
  },
  {
    id: 'vr-006',
    title: 'Your Number (Official Video)',
    artist: 'Darkoo',
    status: 'Processing',
    year: '2025',
    type: 'Official Video',
    artwork: 'https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/04364587/artwork/transforms/darkoo-sexy-girl-summer-artwork-684334c523bdc995981350-large-685524c44ea97979283518-small.jpg',
    views: 0,
    platform: 'Apple Music'
  },
  {
    id: 'vr-007',
    title: 'RHUDE GYAL! (Live Performance)',
    artist: 'Darkoo & JELEEL!',
    status: 'Takedown',
    year: '2025',
    type: 'Live Performance',
    artwork: 'https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/04493329/artwork/transforms/rhude-gyal-cover-2-68946b428627b575326562-small.jpg',
    views: 412000,
    platform: 'TIDAL'
  },
  {
    id: 'vr-008',
    title: 'Like Dat (Official Video)',
    artist: 'Darkoo',
    status: 'Live',
    year: '2025',
    type: 'Official Video',
    artwork: 'https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/04205225/artwork/transforms/likedat-darkooartboard-2-copy-68109d82d3560361244047-small.jpg',
    views: 2180000,
    platform: 'VEVO'
  },
  {
    id: 'vr-009',
    title: 'If I Dey Lie (Official Video)',
    artist: 'Almost Joey & Crayon',
    status: 'Inactive',
    year: '2024',
    type: 'Official Video',
    artwork: 'https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/03604256/artwork/transforms/cover-iidl-670e6069be298946644138-small.jpg',
    views: 980000,
    platform: 'VEVO'
  },
  {
    id: 'vr-010',
    title: 'Focus On Me (Lyric Video)',
    artist: 'Darkoo',
    status: 'Live',
    year: '2025',
    type: 'Lyric Video',
    artwork: 'https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/03797034/artwork/transforms/focus-on-mefom-67698b3e2f65e734260490-small.jpg',
    views: 1540000,
    platform: 'Apple Music'
  },
]

export const videoGenres = [
  'Afrobeats', 'Afro Pop', 'Alternative', 'Amapiano', 'Blues', 'Classical',
  'Country', 'Dance', 'Electronic', 'Folk', 'Funk', 'Gospel', 'Hip Hop',
  'House', 'Indie', 'Jazz', 'K-Pop', 'Latin', 'Metal', 'Pop', 'R&B',
  'Rap', 'Reggae', 'Reggaeton', 'Rock', 'Soul', 'Trap', 'World Music'
]

export const videoLanguages = [
  'English', 'Spanish', 'French', 'Portuguese', 'German', 'Italian',
  'Japanese', 'Korean', 'Chinese (Mandarin)', 'Arabic', 'Hindi',
  'Yoruba', 'Igbo', 'Swahili', 'Turkish', 'Dutch', 'Russian', 'Polish'
]

export const creditRoles = [
  // Songwriter / Composition
  'Composer', 'Songwriter', 'Lyricist', 'Arranger', 'Librettist', 'Author',
  // Production & Engineering
  'Producer', 'Assistant Producer', 'Engineer', 'Sound Engineer',
  'Mixing Engineer', 'Mastering Engineer', 'Remixer',
  // Performer
  'Performer', 'Lead Vocals', 'Background Vocals', 'Harmony Vocals',
  'Mezzo-soprano Vocals', 'Choir', 'Chorus',
  // Instruments
  'Acoustic Guitar', 'Bass Guitar', 'Classical Guitar', 'Electric Guitar',
  'Lead Guitar', 'Rhythm Guitar', 'Guitar', 'Pedal Steel Guitar',
  'Piano', 'Rhodes Piano', 'Keyboards', 'Hammond Organ', 'Organ', 'Harpsichord',
  'Drums', 'Percussion', 'Bongos', 'Congas', 'Djembe', 'Tabla',
  'Tambourine', 'Timbales', 'Timpani',
  'Bass Clarinet', 'Clarinet', 'Flute', 'Piccolo', 'Oboe', 'Bassoon',
  'Saxophone', 'Alto Saxophone', 'Baritone Saxophone', 'Sopranino Saxophone', 'Tenor Saxophone',
  'Trumpet', 'Cornet', 'Flugelhorn', 'Trombone', 'Bass Trombone', 'Tuba',
  'Violin', 'First Violin', 'Second Violin', 'Viola', 'Cello', 'Double Bass', 'Fiddle',
  'Harp', 'Banjo', 'Bouzouki', 'Harmonica', 'Kora', 'Mandolin', 'Sitar', 'Ukulele',
  // Other
  'Conductor', 'Musical Director', 'DJ', 'Instrumentalist',
  // Video-specific
  'Director', 'Cinematographer', 'Editor', 'Choreographer', 'Art Director',
]

export const mockArtists = [
  { id: 'a1', name: 'Darkoo', initials: 'DK', plan: true, color: '#5f1fff' },
  { id: 'a2', name: 'Almost Joey', initials: 'AJ', plan: false, color: '#3a3f5c' },
  { id: 'a3', name: 'Ruger', initials: 'RU', plan: true, color: '#7e6a55' },
  { id: 'a4', name: 'Rema', initials: 'RE', plan: false, color: '#4f8a6b' },
  { id: 'a5', name: 'Davido', initials: 'DV', plan: false, color: '#7a3a2c' },
  { id: 'a6', name: 'Rvssian', initials: 'RV', plan: false, color: '#a85be0' },
  { id: 'a7', name: 'JELEEL!', initials: 'JL', plan: true, color: '#e07a3a' },
  { id: 'a8', name: 'Crayon', initials: 'CR', plan: false, color: '#2e89c9' },
  { id: 'a9', name: 'Tion Wayne', initials: 'TW', plan: false, color: '#d4a72c' },
  { id: 'a10', name: 'Dess Dior', initials: 'DD', plan: false, color: '#3d8b8b' },
  { id: 'a11', name: 'Neon Dream', initials: 'ND', plan: false, color: '#6c4f9e' },
  { id: 'a12', name: 'Solar Kid', initials: 'SK', plan: true, color: '#c14c5a' },
  { id: 'a13', name: 'Vela', initials: 'VE', plan: false, color: '#1f6e8c' },
  { id: 'a14', name: 'Echo Park', initials: 'EP', plan: false, color: '#b25a8a' },
  { id: 'a15', name: 'Marigold', initials: 'MG', plan: false, color: '#587a3a' },
]

export const videoStores = [
  { id: 'spotify', name: 'Spotify', logo: '/img/spotify-icon.svg', info: 'Your video will appear on the track page as a Canvas clip or linked music video, visible to 600M+ listeners.' },
  { id: 'apple', name: 'Apple Music', logo: '/img/apple-music-icon.svg', info: 'Displayed as a music video in the Apple Music catalogue and linked to the matching song for subscribers.' },
  { id: 'vevo', name: 'VEVO', logo: '/img/vevo-icon.svg', info: 'Published to your VEVO channel on YouTube with monetisation, analytics, and playlist placement opportunities.' },
  { id: 'tidal', name: 'TIDAL', logo: '/img/tidal-icon.svg', info: 'Delivered as a high-quality music video to TIDAL\'s catalogue, available to HiFi and Premium subscribers.' },
  { id: 'amazon', name: 'Amazon Music', logo: '/img/amazonmusic-icon.svg', info: 'Appears alongside the matching track on Amazon Music, accessible to Prime and Unlimited subscribers.' },
]

// Spotify Music Releases — user's releases currently live on Spotify
export interface SpotifyTrack {
  id: string
  title: string
  trackNumber: number
  isrc: string
  primaryArtists: { id: string; name: string; initials: string }[]
  featuredArtists: { id: string; name: string; initials: string }[]
  copyrightHolder: string
  copyrightYear: number
  pCopyrightHolder: string
  productionYear: number
  primaryGenre: string
  secondaryGenre: string
  language: string
  recordLabel: string
}

export interface SpotifyMusicRelease {
  id: string
  title: string
  artist: string
  artwork: string
  releaseDate: string
  tracks: SpotifyTrack[]
}

export const spotifyMusicReleases: SpotifyMusicRelease[] = [
  {
    id: 'smr-001',
    title: 'Sexy Girl Summer',
    artist: 'Darkoo',
    artwork: 'https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/04326032/artwork/transforms/darkoo-sexy-girl-summer-artwork-684334c523bdc995981350-small.jpg',
    releaseDate: '2026-05-15',
    tracks: [
      {
        id: 'st-001', title: 'Summer Vibes', trackNumber: 1, isrc: 'GBDTT2600001',
        primaryArtists: [{ id: 'a1', name: 'Darkoo', initials: 'DK' }],
        featuredArtists: [],
        copyrightHolder: 'Darkoo Music Ltd', copyrightYear: 2026,
        pCopyrightHolder: 'Darkoo Music Ltd', productionYear: 2026,
        primaryGenre: 'Afrobeats', secondaryGenre: 'Afro Pop',
        language: 'English', recordLabel: 'Darkoo Records',
      },
      {
        id: 'st-002', title: 'Sexy Girl Summer', trackNumber: 2, isrc: 'GBDTT2600002',
        primaryArtists: [{ id: 'a1', name: 'Darkoo', initials: 'DK' }],
        featuredArtists: [{ id: 'a4', name: 'Rema', initials: 'RE' }],
        copyrightHolder: 'Darkoo Music Ltd', copyrightYear: 2026,
        pCopyrightHolder: 'Darkoo Music Ltd', productionYear: 2026,
        primaryGenre: 'Afrobeats', secondaryGenre: 'Pop',
        language: 'English', recordLabel: 'Darkoo Records',
      },
      {
        id: 'st-003', title: 'Beach Party', trackNumber: 3, isrc: 'GBDTT2600003',
        primaryArtists: [{ id: 'a1', name: 'Darkoo', initials: 'DK' }],
        featuredArtists: [],
        copyrightHolder: 'Darkoo Music Ltd', copyrightYear: 2026,
        pCopyrightHolder: 'Darkoo Music Ltd', productionYear: 2026,
        primaryGenre: 'Afrobeats', secondaryGenre: 'Dance',
        language: 'English', recordLabel: 'Darkoo Records',
      },
    ],
  },
  {
    id: 'smr-002',
    title: 'Solar',
    artist: 'Darkoo & Ruger',
    artwork: 'https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/05301321/artwork/transforms/p1680529-edit-edit-edit-69c138b3ab4dd252257380-small.jpg',
    releaseDate: '2026-03-20',
    tracks: [
      {
        id: 'st-004', title: 'Solar', trackNumber: 1, isrc: 'GBDTT2600004',
        primaryArtists: [{ id: 'a1', name: 'Darkoo', initials: 'DK' }, { id: 'a3', name: 'Ruger', initials: 'RU' }],
        featuredArtists: [],
        copyrightHolder: 'Darkoo Music Ltd / Ruger Ent', copyrightYear: 2026,
        pCopyrightHolder: 'Darkoo Music Ltd / Ruger Ent', productionYear: 2026,
        primaryGenre: 'Afro Pop', secondaryGenre: 'R&B',
        language: 'English', recordLabel: 'Independent',
      },
    ],
  },
  {
    id: 'smr-003',
    title: 'Favourite Girl',
    artist: 'Darkoo & Rema',
    artwork: 'https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/03377228/artwork/transforms/darkoo-x-rema-favourite-girl-1-66b2194cd1729760795317-small.jpg',
    releaseDate: '2025-08-10',
    tracks: [
      {
        id: 'st-005', title: 'Favourite Girl', trackNumber: 1, isrc: 'GBDTT2500001',
        primaryArtists: [{ id: 'a1', name: 'Darkoo', initials: 'DK' }, { id: 'a4', name: 'Rema', initials: 'RE' }],
        featuredArtists: [],
        copyrightHolder: 'Darkoo Music Ltd', copyrightYear: 2025,
        pCopyrightHolder: 'Darkoo Music Ltd', productionYear: 2025,
        primaryGenre: 'Afrobeats', secondaryGenre: 'Pop',
        language: 'English', recordLabel: 'Darkoo Records',
      },
    ],
  },
  {
    id: 'smr-004',
    title: 'My Baby (Obimo)',
    artist: 'Almost Joey',
    artwork: 'https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/05515461/artwork/transforms/almost-joey-my-baby-obimo-cover-art-69d668b083423454897202-small.jpg',
    releaseDate: '2026-04-01',
    tracks: [
      {
        id: 'st-006', title: 'My Baby (Obimo)', trackNumber: 1, isrc: 'GBDTT2600010',
        primaryArtists: [{ id: 'a2', name: 'Almost Joey', initials: 'AJ' }],
        featuredArtists: [],
        copyrightHolder: 'Almost Joey', copyrightYear: 2026,
        pCopyrightHolder: 'Almost Joey', productionYear: 2026,
        primaryGenre: 'Afrobeats', secondaryGenre: 'Soul',
        language: 'English', recordLabel: 'Independent',
      },
      {
        id: 'st-007', title: 'Midnight Run', trackNumber: 2, isrc: 'GBDTT2600011',
        primaryArtists: [{ id: 'a2', name: 'Almost Joey', initials: 'AJ' }],
        featuredArtists: [],
        copyrightHolder: 'Almost Joey', copyrightYear: 2026,
        pCopyrightHolder: 'Almost Joey', productionYear: 2026,
        primaryGenre: 'R&B', secondaryGenre: 'Soul',
        language: 'English', recordLabel: 'Independent',
      },
    ],
  },
  {
    id: 'smr-005',
    title: 'Like Dat',
    artist: 'Darkoo',
    artwork: 'https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/04205225/artwork/transforms/likedat-darkooartboard-2-copy-68109d82d3560361244047-small.jpg',
    releaseDate: '2025-11-22',
    tracks: [
      {
        id: 'st-008', title: 'Like Dat', trackNumber: 1, isrc: 'GBDTT2500005',
        primaryArtists: [{ id: 'a1', name: 'Darkoo', initials: 'DK' }],
        featuredArtists: [],
        copyrightHolder: 'Darkoo Music Ltd', copyrightYear: 2025,
        pCopyrightHolder: 'Darkoo Music Ltd', productionYear: 2025,
        primaryGenre: 'Afrobeats', secondaryGenre: 'Hip Hop',
        language: 'English', recordLabel: 'Darkoo Records',
      },
    ],
  },
]

// Whether the current user has any music releases live on Spotify
export const userHasSpotifyReleases = spotifyMusicReleases.length > 0
