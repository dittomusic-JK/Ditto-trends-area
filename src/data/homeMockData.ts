// Home hub content: guides from the Ditto blog and the quieter area tiles.
// The hero content (releases, stats, artists) comes from the sections' own mocks.

export interface HomeGuide {
  title: string
  category: string
  image: string
  url: string
}

export const homeGuides: HomeGuide[] = [
  {
    title: 'How Do Music Royalties Work?',
    category: 'Royalties',
    image: '/img/pub-learn-mechanical.webp',
    url: 'https://dittomusic.com/en/blog/how-do-music-royalties-work',
  },
  {
    title: 'What is Music Distribution? Everything Artists Need to Know',
    category: 'Distribution',
    image: '/img/pub-learn-publishing.webp',
    url: 'https://dittomusic.com/en/blog/what-is-music-distribution-everything-artists-need-to-know',
  },
  {
    title: '5 Things Artists Forget When Releasing Music',
    category: 'Releasing',
    image: '/img/image-8.png',
    url: 'https://dittomusic.com/en/blog/5-things-artists-forget-when-releasing-music',
  },
  {
    title: 'Latest Music Funding & Grants Opportunities',
    category: 'Funding',
    image: '/img/image-9.png',
    url: 'https://dittomusic.com/en/blog/latest-music-funding-and-grants-opportunities',
  },
  {
    title: 'How to Promote Your Music Independently',
    category: 'Promotion',
    image: '/img/image-10.png',
    url: 'https://dittomusic.com/en/blog/how-to-promote-your-music-independently',
  },
  {
    title: 'How to Start a Record Label',
    category: 'Labels',
    image: '/img/pub-learn-sync.webp',
    url: 'https://dittomusic.com/en/blog/how-to-start-a-record-label',
  },
]

export interface ExploreTile {
  id: string
  label: string
  blurb: string
  section: string
  icon: string
}

// Lower-priority areas: present, but one quiet row. Icons from the brand suite.
export const exploreTiles: ExploreTile[] = [
  { id: 'videos', label: 'Videos', blurb: 'Distribute music videos', section: 'videos', icon: '/img/suite/music-video-distro.svg' },
  { id: 'publishing', label: 'Publishing', blurb: 'Register works & claim royalties', section: 'publishing', icon: '/img/suite/publishing.svg' },
  { id: 'nr', label: 'Neighbouring Rights', blurb: 'Collect broadcast royalties', section: 'neighbouring-rights', icon: '/img/suite/release-protection.svg' },
  { id: 'sync', label: 'Sync', blurb: 'Pitch for film, TV & games', section: 'sync', icon: '/img/suite/sync.svg' },
]
