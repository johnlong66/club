export interface Country {
  code: string
  flag: string
  label: string
}

export const COUNTRIES: Country[] = [
  { code: 'DE', flag: '🇩🇪', label: 'Deutschland' },
  { code: 'AT', flag: '🇦🇹', label: 'Österreich' },
  { code: 'CH', flag: '🇨🇭', label: 'Schweiz' },
  { code: 'FR', flag: '🇫🇷', label: 'Frankreich' },
  { code: 'IT', flag: '🇮🇹', label: 'Italien' },
  { code: 'ES', flag: '🇪🇸', label: 'Spanien' },
  { code: 'PT', flag: '🇵🇹', label: 'Portugal' },
  { code: 'NL', flag: '🇳🇱', label: 'Niederlande' },
  { code: 'BE', flag: '🇧🇪', label: 'Belgien' },
  { code: 'LU', flag: '🇱🇺', label: 'Luxemburg' },
  { code: 'PL', flag: '🇵🇱', label: 'Polen' },
  { code: 'CZ', flag: '🇨🇿', label: 'Tschechien' },
  { code: 'SK', flag: '🇸🇰', label: 'Slowakei' },
  { code: 'HU', flag: '🇭🇺', label: 'Ungarn' },
  { code: 'RO', flag: '🇷🇴', label: 'Rumänien' },
  { code: 'BG', flag: '🇧🇬', label: 'Bulgarien' },
  { code: 'HR', flag: '🇭🇷', label: 'Kroatien' },
  { code: 'RS', flag: '🇷🇸', label: 'Serbien' },
  { code: 'SI', flag: '🇸🇮', label: 'Slowenien' },
  { code: 'GR', flag: '🇬🇷', label: 'Griechenland' },
  { code: 'TR', flag: '🇹🇷', label: 'Türkei' },
  { code: 'RU', flag: '🇷🇺', label: 'Russland' },
  { code: 'UA', flag: '🇺🇦', label: 'Ukraine' },
  { code: 'GB', flag: '🇬🇧', label: 'Großbritannien' },
  { code: 'IE', flag: '🇮🇪', label: 'Irland' },
  { code: 'DK', flag: '🇩🇰', label: 'Dänemark' },
  { code: 'SE', flag: '🇸🇪', label: 'Schweden' },
  { code: 'NO', flag: '🇳🇴', label: 'Norwegen' },
  { code: 'FI', flag: '🇫🇮', label: 'Finnland' },
  { code: 'US', flag: '🇺🇸', label: 'USA' },
  { code: 'CA', flag: '🇨🇦', label: 'Kanada' },
  { code: 'BR', flag: '🇧🇷', label: 'Brasilien' },
  { code: 'JP', flag: '🇯🇵', label: 'Japan' },
  { code: 'CN', flag: '🇨🇳', label: 'China' },
  { code: 'IN', flag: '🇮🇳', label: 'Indien' },
  { code: 'AU', flag: '🇦🇺', label: 'Australien' },
  { code: 'TH', flag: '🇹🇭', label: 'Thailand' },
]

export function useCountries() {
  function flagForCode(code: string | null): string {
    return COUNTRIES.find((c) => c.code === code)?.flag ?? ''
  }
  return { countries: COUNTRIES, flagForCode }
}
