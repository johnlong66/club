import { feature } from 'topojson-client'
import type { Topology } from 'topojson-specification'

// ISO numeric → alpha-2 for European countries
const EUROPE: Record<number, string> = {
  276: 'DE', 40: 'AT', 756: 'CH', 250: 'FR', 380: 'IT',
  724: 'ES', 620: 'PT', 528: 'NL', 56: 'BE', 442: 'LU',
  616: 'PL', 203: 'CZ', 703: 'SK', 348: 'HU', 642: 'RO',
  100: 'BG', 191: 'HR', 688: 'RS', 705: 'SI', 300: 'GR',
  792: 'TR', 643: 'RU', 804: 'UA', 826: 'GB', 372: 'IE',
  208: 'DK', 752: 'SE', 578: 'NO', 246: 'FI', 112: 'BY',
  498: 'MD', 703: 'SK', 756: 'CH', 20: 'AD', 674: 'SM',
  336: 'VA', 470: 'MT', 196: 'CY', 352: 'IS', 8: 'AL',
  807: 'MK', 70: 'BA', 499: 'ME', 705: 'SI',
}

let cached: object | null = null

export default defineEventHandler(async () => {
  if (cached) return cached

  const topo = await $fetch<Topology>(
    'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json'
  )

  const geojson = feature(topo, topo.objects.countries as any) as any

  geojson.features = geojson.features
    .filter((f: any) => EUROPE[+f.id] !== undefined)
    .map((f: any) => ({
      ...f,
      properties: { name: EUROPE[+f.id] },
    }))

  cached = geojson
  return geojson
})
