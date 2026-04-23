import type { 
  Artist, 
  TopSong, 
  TopCountry, 
  ArtistRelease, 
  Smartlink, 
  Integration, 
  AvailableContract, 
  UserContract 
} from '../views/artists/artistTypes'

// Sample Artists
export const artists: Artist[] = [
  {
    id: '38398',
    name: 'Shaun Reynolds',
    avatar: '/images/artist_image.png',
    bannerImage: '/images/artist_image.png',
    artistType: 'plan',
    isPlanArtist: true,
    releaseCount: 19,
    website: 'https://shaunreynoldsmusic.com',
    bio: 'Shaun Reynolds (born: Shaun Daniel Reynolds) is a British music producer, singer & songwriter, who became known for his work with various artists.',
    socialLinks: {
      facebook: 'https://facebook.com',
      tiktok: 'https://tiktok.com',
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com',
      youtube: 'https://youtube.com'
    },
    storeIds: {
      spotify: '0Tn0YISbd1XYRBk9myaseg',
      appleMusic: 'TIGEJ5123FA',
      soundcloud: '285419023',
      deezer: undefined,
      audiomack: '15252151',
      amazon: '1252512512'
    }
  },
  {
    id: '39035',
    name: 'Black Prez',
    avatar: '/images/image-2.png',
    artistType: 'plan',
    isPlanArtist: true,
    releaseCount: 10,
    socialLinks: {},
    storeIds: {}
  },
  {
    id: '938509',
    name: 'SecondBorn Music Group',
    avatar: '/images/image-1.png',
    artistType: 'plan',
    isPlanArtist: true,
    releaseCount: 4,
    socialLinks: {},
    storeIds: {}
  },
  {
    id: '997383',
    name: 'Matt Luis',
    avatar: '/images/image-3.png',
    artistType: 'plan',
    isPlanArtist: true,
    releaseCount: 6,
    socialLinks: {},
    storeIds: {}
  },
  {
    id: '1083523',
    name: 'Seniors Lo-Fi',
    avatar: '/images/image-5.png',
    artistType: 'plan',
    isPlanArtist: true,
    releaseCount: 1,
    socialLinks: {},
    storeIds: {}
  },
  {
    id: '1092163',
    name: 'Esmée Denters',
    avatar: '/images/image-4.png',
    artistType: 'plan',
    isPlanArtist: true,
    releaseCount: 15,
    socialLinks: {},
    storeIds: {}
  },
  {
    id: '1128482',
    name: 'RNLD',
    avatar: '/images/image-6.png',
    artistType: 'plan',
    isPlanArtist: true,
    releaseCount: 2,
    socialLinks: {},
    storeIds: {
      spotify: '1J0Y3ckQiHwLop55N4XAww'
    }
  },
  {
    id: '1349789',
    name: 'Tilda',
    avatar: '/images/image-1.png',
    artistType: 'plan',
    isPlanArtist: true,
    releaseCount: 7,
    socialLinks: {},
    storeIds: {
      spotify: '1GQ101cyceb0teCPL6XdMY'
    }
  }
]

// Top Songs for artist overview (based on actual stream data)
export const topSongs: TopSong[] = [
  { id: '1', title: 'Up All Night', artwork: '/images/image 1.png', streams: 5907 },
  { id: '2', title: 'Get Home', artwork: '/images/image 1-1.png', streams: 682 },
  { id: '3', title: 'Feel Good', artwork: '/images/image 1-2.png', streams: 440 },
  { id: '4', title: 'Move To This (The Curley Shuffle)', artwork: '/images/image 1-3.png', streams: 289 },
  { id: '5', title: 'Need Your Love', artwork: '/images/image 1-4.png', streams: 156 }
]

// Top Countries for artist overview
export const topCountries: TopCountry[] = [
  { rank: 1, country: 'United States', code: 'US', streams: 22806 },
  { rank: 2, country: 'Canada', code: 'CA', streams: 3029 },
  { rank: 3, country: 'Australia', code: 'AU', streams: 2140 },
  { rank: 4, country: 'Germany', code: 'DE', streams: 1908 },
  { rank: 5, country: 'United Kingdom', code: 'GB', streams: 1355 }
]

// Artist releases (based on actual release data)
export const releases: ArtistRelease[] = [
  {
    id: '3662941',
    title: 'Christmas Like That',
    artwork: '/images/image 1.png',
    releaseDate: '29th Nov 2024',
    artistRole: 'Featured',
    status: 'Active'
  },
  {
    id: '3660079',
    title: "Wake Up It's Christmas",
    artwork: '/images/image 1-1.png',
    releaseDate: '15th Nov 2024',
    artistRole: 'Performer',
    status: 'Sent to stores'
  },
  {
    id: '3111447',
    title: 'What Was I Made For?',
    artwork: '/images/image 1-2.png',
    releaseDate: '14th Apr 2024',
    artistRole: 'Performer',
    status: 'Pending'
  },
  {
    id: '2812765',
    title: 'Motivation',
    artwork: '/images/image 1-3.png',
    releaseDate: '30th Nov 2023',
    artistRole: 'Featured',
    status: 'Active'
  },
  {
    id: '2812528',
    title: 'Feel Good (Instrumental)',
    artwork: '/images/image 1-4.png',
    releaseDate: '30th Nov 2023',
    artistRole: 'Performer',
    status: 'Active'
  },
  {
    id: '2812520',
    title: 'We Move Fast',
    artwork: '/images/image 1.png',
    releaseDate: '30th Nov 2023',
    artistRole: 'Performer',
    status: 'Active'
  },
  {
    id: '2812513',
    title: 'Feel Good',
    artwork: '/images/image 1-1.png',
    releaseDate: '30th Nov 2023',
    artistRole: 'Performer',
    status: 'Active'
  },
  {
    id: '2812483',
    title: 'Play This at a Party',
    artwork: '/images/image 1-2.png',
    releaseDate: '30th Nov 2023',
    artistRole: 'Performer',
    status: 'Active'
  },
  {
    id: '2774522',
    title: 'Get Home (Black Prez Version)',
    artwork: '/images/image 1-3.png',
    releaseDate: '9th Nov 2023',
    artistRole: 'Performer',
    status: 'Active'
  },
  {
    id: '2752339',
    title: 'Get Home',
    artwork: '/images/image 1-4.png',
    releaseDate: '9th Nov 2023',
    artistRole: 'Performer',
    status: 'Active'
  }
]

// Contributions (collaborations with other artists)
export const contributions: ArtistRelease[] = [
  {
    id: '2812765',
    title: 'Motivation',
    artwork: '/images/image 1-3.png',
    releaseDate: '30th Nov 2023',
    artistRole: 'Featured',
    status: 'Active'
  },
  {
    id: '3662941',
    title: 'Christmas Like That',
    artwork: '/images/image 1.png',
    releaseDate: '29th Nov 2024',
    artistRole: 'Featured',
    status: 'Active'
  },
  {
    id: '2598077',
    title: 'Need Your Love',
    artwork: '/images/image 1-1.png',
    releaseDate: '28th Oct 2023',
    artistRole: 'Performer',
    status: 'Active'
  },
  {
    id: '2564124',
    title: 'My Superpower',
    artwork: '/images/image 1-2.png',
    releaseDate: '3rd Aug 2023',
    artistRole: 'Performer',
    status: 'Active'
  },
  {
    id: '2533001',
    title: 'Podium',
    artwork: '/images/image 1-4.png',
    releaseDate: '16th Jul 2023',
    artistRole: 'Performer',
    status: 'Active'
  }
]

// Smartlinks
export const smartlinks: Smartlink[] = [
  {
    id: '1',
    title: "Wake Up It's Christmas",
    artwork: '/images/image 1.png',
    artist: 'Shaun Reynolds',
    url: 'ditto.fm/bigkelvin_imakwa-giving_out',
    status: 'Pre-Release',
    releaseDate: '15th Nov, 2024',
    clicks: 1412
  },
  {
    id: '2',
    title: 'What Was I Made For?',
    artwork: '/images/image 1-1.png',
    artist: 'Shaun Reynolds',
    url: 'ditto.fm/bigkelvin_imakwa-giving_out',
    status: 'Released',
    releaseDate: '24th Apr 2024',
    clicks: 0
  },
  {
    id: '3',
    title: 'Get Home (Black Prez Vers...',
    artwork: '/images/image 1-2.png',
    artist: 'Shaun Reynolds',
    url: 'ditto.fm/bigkelvin_imakwa-giving_out',
    status: 'Pre-Release',
    releaseDate: '9th Nov 2024',
    clicks: 32
  },
  {
    id: '4',
    title: 'Get Home',
    artwork: '/images/image 1-3.png',
    artist: 'Shaun Reynolds',
    url: 'ditto.fm/bigkelvin_imakwa-giving_out',
    status: 'Pre-Release',
    releaseDate: '9th Nov 2024',
    clicks: 458
  }
]

// Integrations
export const integrations: Integration[] = [
  {
    id: 'spotify',
    name: 'Spotify For Artists',
    description: 'Get verified so you can start pitching, or link up your existing profile.',
    icon: '/images/spotifyforartists.svg',
    buttonText: 'Get Access',
    isConnected: false
  },
  {
    id: 'youtube',
    name: 'Youtube Official Artist Channel',
    description: 'Upgrade now for access to analytics and tools, enhancing fan engagement and platform presence.',
    icon: '/images/youtubeartistchannel.svg',
    buttonText: 'Setup',
    isConnected: false
  }
]

// Available Contracts
export const availableContracts: AvailableContract[] = [
  {
    id: 'exclusive-recording',
    title: 'Exclusive Recording Agreement',
    description: 'Covers exclusive recording rights, artist obligations, payment, promotion, master ownership, and other key terms.',
    icon: '/images/Icons.png',
    price: 39
  },
  {
    id: 'sample-clearance',
    title: 'Sample Clearance License',
    description: 'Gain the rights to legally use music samples in your tracks. Protect your releases from copyright claims with clear licensing for UK and USA territories.',
    icon: '/images/Icons-1.png',
    price: 39
  },
  {
    id: 'beat-lease',
    title: 'Exclusive Beat Lease',
    description: 'Purchase the exclusive rights to lease beats and instrumentals. Ensure full control and exclusivity of your tracks in UK and USA markets.',
    icon: '/images/Icons-2.png',
    price: 39
  },
  {
    id: 'distribution',
    title: 'Music Distribution Agreement',
    description: 'Clearly outline distribution terms, royalties, and rights management across streaming services and platforms.',
    icon: '/images/Icons-3.png',
    price: 39
  },
  {
    id: 'booking',
    title: 'Artist Booking Terms',
    description: 'Clearly define booking agreements, payment terms, performance expectations, and cancellation policies for artists, venues, and promoters. UK/US.',
    icon: '/images/Icons-4.png',
    price: 39
  },
  {
    id: 'band-partnership',
    title: 'Band Partnership Agreement',
    description: 'Protect band members by outlining roles, royalty splits, ownership rights, and responsibilities to avoid future conflicts in your group.',
    icon: '/images/Icons-5.png',
    price: 39
  },
  {
    id: 'collaborator-splits',
    title: 'Collaborator Splits Agreement',
    description: 'Clearly outline royalty shares, songwriting credits, and publishing splits to ensure fair and transparent collaboration among creators.',
    icon: '/images/Icons-6.png',
    price: 39
  },
  {
    id: 'merchandising',
    title: 'Merchandising Agreement',
    description: 'Formalize agreements for selling and licensing artist-branded merchandise. Ensure clear terms on production, distribution, payments, and royalty percentages.',
    icon: '/images/Icons-6.png',
    price: 39
  }
]

// User Contracts
export const userContracts: UserContract[] = [
  {
    id: '1045',
    name: '#1045 Band Partnership Agreement',
    status: 'Draft',
    dateCreated: '20th May 2025',
    canResend: false
  },
  {
    id: '1041',
    name: '#1041 Licensing agreement for Sample',
    status: 'Ready',
    dateCreated: '15th May 2025',
    canResend: true
  },
  {
    id: '1044',
    name: '#1044 Hire Musician Contract',
    status: 'Processing',
    dateCreated: '9th May 2025',
    canResend: false
  },
  {
    id: '1044-2',
    name: '#1044 Hire Musician Contract',
    status: 'Ready',
    dateCreated: '1st May 2025',
    canResend: true
  },
  {
    id: '1040',
    name: '#1040 Distribution Agreement',
    status: 'Ended',
    dateCreated: '15th March 2025',
    canResend: false
  },
  {
    id: '1039',
    name: '#1039 Collaborator Splits',
    status: 'Removed',
    dateCreated: '1st Feb 2025',
    canResend: false
  }
]
