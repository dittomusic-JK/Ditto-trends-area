// Countries available for release restrictions, grouped by continent.
// Shared by the video and music builders. The stored value stays a flat
// `restrictedCountries: string[]` of country names; continent state is derived.

export type Continent = 'Africa' | 'Antarctica' | 'Asia' | 'Europe' | 'North America' | 'Oceania' | 'South America'

export const continents: Continent[] = ['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America']

export interface RestrictableCountry {
  code: string
  name: string
  flag: string
  continent: Continent
}

export const restrictableCountries: RestrictableCountry[] = [
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', continent: 'South America' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', continent: 'Oceania' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', continent: 'Europe' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', continent: 'Europe' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', continent: 'South America' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', continent: 'North America' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', continent: 'South America' },
  { code: 'CN', name: 'China', flag: '🇨🇳', continent: 'Asia' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', continent: 'South America' },
  { code: 'CZ', name: 'Czechia', flag: '🇨🇿', continent: 'Europe' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', continent: 'Europe' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', continent: 'Africa' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', continent: 'Europe' },
  { code: 'FR', name: 'France', flag: '🇫🇷', continent: 'Europe' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', continent: 'Europe' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', continent: 'Africa' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', continent: 'Europe' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', continent: 'Asia' },
  { code: 'IN', name: 'India', flag: '🇮🇳', continent: 'Asia' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', continent: 'Asia' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', continent: 'Europe' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', continent: 'Asia' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', continent: 'Europe' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲', continent: 'North America' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', continent: 'Asia' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', continent: 'Africa' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', continent: 'Asia' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', continent: 'North America' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', continent: 'Europe' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', continent: 'Oceania' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', continent: 'Africa' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', continent: 'Europe' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', continent: 'Asia' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', continent: 'South America' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', continent: 'Asia' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', continent: 'Europe' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', continent: 'Europe' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', continent: 'Europe' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', continent: 'Asia' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', continent: 'Asia' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', continent: 'Africa' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', continent: 'Asia' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', continent: 'Europe' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', continent: 'Europe' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', continent: 'Europe' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', continent: 'Asia' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', continent: 'Africa' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', continent: 'Asia' },
  { code: 'TR', name: 'Türkiye', flag: '🇹🇷', continent: 'Asia' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', continent: 'Africa' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', continent: 'Europe' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', continent: 'Asia' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', continent: 'Europe' },
  { code: 'US', name: 'United States', flag: '🇺🇸', continent: 'North America' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', continent: 'Asia' },
]

export const countriesIn = (continent: Continent) => restrictableCountries.filter(c => c.continent === continent)

export type ContinentState = 'none' | 'some' | 'all'

/** How much of a continent the flat selection covers */
export const continentState = (continent: Continent, selected: string[]): ContinentState => {
  const names = countriesIn(continent).map(c => c.name)
  if (!names.length) return 'none'
  const picked = names.filter(n => selected.includes(n)).length
  return picked === 0 ? 'none' : picked === names.length ? 'all' : 'some'
}

/** A chip for the summaries: a fully selected continent collapses to one chip */
export interface RestrictionChip {
  kind: 'continent' | 'country'
  label: string
  /** Country names this chip stands for (one for a country) */
  countries: string[]
}

export const restrictionChips = (selected: string[]): RestrictionChip[] => {
  const chips: RestrictionChip[] = []
  const covered = new Set<string>()
  for (const continent of continents) {
    if (continentState(continent, selected) === 'all') {
      const names = countriesIn(continent).map(c => c.name)
      names.forEach(n => covered.add(n))
      chips.push({ kind: 'continent', label: `All of ${continent}`, countries: names })
    }
  }
  for (const name of selected) {
    if (!covered.has(name)) chips.push({ kind: 'country', label: name, countries: [name] })
  }
  return chips
}

/** Remove a chip from the flat selection (a continent chip drops every country in it) */
export const withoutChip = (selected: string[], chip: RestrictionChip) =>
  selected.filter(n => !chip.countries.includes(n))

/** "12 countries in 2 continents restricted" once any continent is fully selected */
export const restrictionSummary = (selected: string[]): string => {
  const n = selected.length
  const full = continents.filter(c => continentState(c, selected) === 'all').length
  const countries = `${n} ${n === 1 ? 'country' : 'countries'}`
  return full ? `${countries} in ${full} ${full === 1 ? 'continent' : 'continents'} restricted` : `${countries} restricted`
}
