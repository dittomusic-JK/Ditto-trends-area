// Catalog for the publishing Add Work flow — releases with registrable tracks.
// Mirrors the shape of the Neighbouring Rights registration flow.
import { releaseCatalog } from './releaseDetailMockData'

export interface RegistrableTrack {
  id: string
  number: number
  title: string
  duration: string
  isrc: string
  registered: boolean
}

export interface RegistrableRelease {
  id: string
  title: string
  artist: string
  year: string
  artwork: string
  tracks: RegistrableTrack[]
}

const t = (id: string, number: number, title: string, duration: string, isrc: string, registered = false): RegistrableTrack =>
  ({ id, number, title, duration, isrc, registered })

const art = (i: number) => releaseCatalog[i]?.artwork ?? ''

export const registrableReleases: RegistrableRelease[] = [
  {
    id: 'r1', title: 'My Baby (Obimo) [Kraizee Remix]', artist: 'Almost Joey', year: '2026', artwork: art(0),
    tracks: [t('r1t1', 1, 'My Baby (Obimo) [Kraizee Remix]', '03:02', 'GBLFP814471', true)],
  },
  {
    id: 'r2', title: 'My Baby (Obimo)', artist: 'Almost Joey', year: '2026', artwork: art(1),
    tracks: [t('r2t1', 1, 'My Baby (Obimo)', '03:12', 'GBLFP814470', true)],
  },
  {
    id: 'r3', title: 'Solar', artist: 'Darkoo & Ruger', year: '2026', artwork: art(2),
    tracks: [t('r3t1', 1, 'Solar', '02:43', 'GBLFP2650201', true)],
  },
  {
    id: 'r4', title: '$exy Girl $ummer (Vol.1)', artist: 'Darkoo', year: '2025', artwork: art(6),
    tracks: [
      t('r4t1', 1, 'Drop', '02:16', 'QMEZE2102614'),
      t('r4t2', 2, 'Gimme Dat', '02:41', 'QMEZE2102615'),
      t('r4t3', 3, 'Wine For Me', '03:05', 'QMEZE2102616'),
      t('r4t4', 4, 'Summer Body', '02:58', 'QMEZE2102617'),
    ],
  },
  {
    id: 'r5', title: 'Your Number', artist: 'Darkoo', year: '2025', artwork: art(7),
    tracks: [
      t('r5t1', 1, 'Your Number', '02:49', 'GBLFP2550118'),
      t('r5t2', 2, 'Your Number (Sped Up)', '02:31', 'GBLFP2550119'),
    ],
  },
  {
    id: 'r6', title: 'Like Dat', artist: 'Darkoo', year: '2025', artwork: art(9),
    tracks: [t('r6t1', 1, 'Like Dat', '02:36', 'GBLFP2550041')],
  },
]

export const writerRoles = [
  'Composer',
  'Author',
  'Composer/Author',
  'Author (Lyrics only)',
  'Arranger',
]
