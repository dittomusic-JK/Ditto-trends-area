export type SyncCategory = 'Advertising' | 'Film' | 'TV Series' | 'Gaming' | 'Trailer'

export interface SyncOpp {
  id: number
  title: string
  description: string
  category: SyncCategory
  deadline: string
  daysLeft: number
  urgent: boolean
  reference: string | null
  budget: string
  usage: string
  tags: string[]
  cover: string
}

export const categoryClass = (cat: SyncCategory): string => {
  switch (cat) {
    case 'Advertising': return 'bg-info/15 text-info'
    case 'Film': return 'bg-ditto-purple/15 text-ditto-purple'
    case 'TV Series': return 'bg-warning/15 text-warning'
    case 'Gaming': return 'bg-success/15 text-success'
    case 'Trailer': return 'bg-error/15 text-error'
    default: return 'bg-ditto-light-grey text-ditto-subtext'
  }
}

// Cover gradient used as the brief "cover image"
export const categoryGradient = (cat: SyncCategory): string => {
  switch (cat) {
    case 'Advertising': return 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 55%, #60a5fa 100%)'
    case 'Film': return 'linear-gradient(135deg, #5f1fff 0%, #8640f4 55%, #a855f7 100%)'
    case 'TV Series': return 'linear-gradient(135deg, #c2410c 0%, #f59e0b 60%, #fbbf24 100%)'
    case 'Gaming': return 'linear-gradient(135deg, #047857 0%, #10b981 60%, #34d399 100%)'
    case 'Trailer': return 'linear-gradient(135deg, #be123c 0%, #ef4444 55%, #fb7185 100%)'
    default: return 'linear-gradient(135deg, #6b7280, #9ca3af)'
  }
}

// Emoji used as the brief icon / cover watermark
export const categoryEmoji = (cat: SyncCategory): string => {
  switch (cat) {
    case 'Advertising': return '📣'
    case 'Film': return '🎬'
    case 'TV Series': return '📺'
    case 'Gaming': return '🎮'
    case 'Trailer': return '🎞️'
    default: return '🎵'
  }
}
