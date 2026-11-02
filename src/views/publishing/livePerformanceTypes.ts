export interface Venue { name: string; city: string; id?: string; category?: string; address?: string }
export interface Work { id: string; title: string; artist: string; tunecode: string }
export interface PerformanceDraft { date: string; venue: Venue | null; workIds: string[] }
export interface Performance { id: number; date: string; venue: Venue; workIds: string[]; status: 'Registered' | 'Submitted' }
