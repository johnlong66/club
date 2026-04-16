<template>
  <div class="page">
    <header class="header">
      <h1>Statistik</h1>
      <p class="subtitle">{{ store.people.length }} {{ store.people.length === 1 ? 'Person' : 'Personen' }} insgesamt</p>
    </header>

    <div v-if="store.people.length === 0" class="empty">
      <p>Noch keine Personen eingetragen.</p>
    </div>

    <template v-else>
      <!-- Pie chart: people per date -->
      <div class="chart-card">
        <VChart :option="pieOption" autoresize style="height: 300px;" />
      </div>

      <!-- Choropleth map: people per European country -->
      <div class="chart-card">
        <p class="chart-title">Herkunft nach Land</p>
        <VChart v-if="mapReady" :option="mapOption" autoresize style="height: 460px;" />
        <div v-else class="loading">Karte wird geladen…</div>
      </div>

      <!-- Date groups -->
      <div class="groups">
        <section v-for="group in grouped" :key="group.date" class="group">
          <div class="group-header">
            <span class="group-date">{{ group.label }}</span>
            <span class="group-count">{{ group.people.length }} {{ group.people.length === 1 ? 'Person' : 'Personen' }}</span>
          </div>
          <ul class="group-list">
            <li v-for="person in group.people" :key="person.id" class="group-item">
              <span class="person-name">{{ person.prename ?? '?' }}</span>
              <span v-if="person.nickname" class="person-nickname">
                „{{ person.nickname }}"<span v-if="person.nicknameUnsure" class="asterisk" title="Nicht ganz sicher">*</span>
              </span>
              <span v-else-if="person.nicknameUnsure" class="badge-unsure">Spitzname unsicher?</span>
              <span v-if="person.country" class="person-flag">{{ flagForCode(person.country) }}</span>
            </li>
          </ul>
        </section>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'
import { use, registerMap } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, MapChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent, VisualMapComponent, GeoComponent } from 'echarts/components'
import { usePeopleStore } from '@/stores/people'
import { useCountries } from '@/composables/useCountries'

use([CanvasRenderer, PieChart, MapChart, TooltipComponent, LegendComponent, VisualMapComponent, GeoComponent])

const store = usePeopleStore()
const { flagForCode, countries } = useCountries()

await store.fetchAll()

// --- Geo map setup ---
const mapReady = ref(false)
const { data: geoJson } = await useFetch('/api/geo/europe')

onMounted(() => {
  if (geoJson.value) {
    registerMap('europe', geoJson.value as any)
    mapReady.value = true
  }
})

// --- Country counts ---
const countryCounts = computed(() => {
  const map = new Map<string, number>()
  for (const p of store.people) {
    if (!p.country){
      p.country = 'DE' // Default to Germany if no country is set
    }
    map.set(p.country, (map.get(p.country) ?? 0) + 1)
  }
  return map
})

const countryLabel = (code: string) =>
  countries.find((c) => c.code === code)?.label ?? code

// --- Grouped by date ---
const grouped = computed(() => {
  const map = new Map<string, typeof store.people>()
  for (const person of store.people) {
    const key = person.meetingDay
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(person)
  }
  return [...map.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, people]) => ({
      date,
      label: new Date(date + 'T00:00:00').toLocaleDateString('de-DE', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      }),
      shortLabel: new Date(date + 'T00:00:00').toLocaleDateString('de-DE', {
        day: '2-digit', month: '2-digit', year: '2-digit',
      }),
      people: [...people].sort((a, b) => (a.prename ?? '').localeCompare(b.prename ?? '')),
    }))
})

// --- Pie chart ---
const pieOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { orient: 'horizontal', bottom: 0, textStyle: { fontSize: 12 } },
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    center: ['50%', '45%'],
    avoidLabelOverlap: true,
    itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
    label: { show: false },
    emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
    data: grouped.value.map((g) => ({ name: g.shortLabel, value: g.people.length })),
  }],
}))

// --- Map chart ---
const mapOption = computed(() => {
  const data = [...countryCounts.value.entries()].map(([code, value]) => ({
    name: code,
    value,
    label: countryLabel(code),
  }))
  const max = Math.max(1, ...data.map((d) => d.value))

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        if (!params.data) return params.name
        const flag = flagForCode(params.name)
        const label = countryLabel(params.name)
        return `${flag} ${label}: <b>${params.data.value}</b>`
      },
    },
    visualMap: {
      min: 0,
      max,
      left: 'left',
      bottom: 16,
      text: ['Viel', 'Wenig'],
      inRange: { color: ['#e0e7ff', '#4f46e5'] },
      calculable: true,
      textStyle: { fontSize: 11, color: '#6b7280' },
    },
    series: [{
      type: 'map',
      map: 'europe',
      roam: true,
      zoom: 1.2,
      center: [15, 54],
      label: { show: false },
      emphasis: {
        label: { show: false },
        itemStyle: { areaColor: '#818cf8' },
      },
      itemStyle: {
        areaColor: '#f3f4f6',
        borderColor: '#d1d5db',
        borderWidth: 0.5,
      },
      data,
    }],
  }
})
</script>

<style scoped>
.page { max-width: 760px; margin: 0 auto; padding: 1.5rem 1rem 4rem; }
.header { margin-bottom: 1.5rem; }
.header h1 { font-size: 1.5rem; font-weight: 800; color: #111827; }
.subtitle { margin-top: 0.2rem; font-size: 0.9rem; color: #9ca3af; }

.empty { text-align: center; color: #9ca3af; padding: 3rem 0; }

.chart-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.chart-title { font-size: 0.85rem; font-weight: 600; color: #6b7280; margin-bottom: 0.5rem; }
.loading { height: 460px; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 0.9rem; }

.groups { display: flex; flex-direction: column; gap: 1.25rem; }

.group {
  background: white; border: 1px solid #e5e7eb; border-radius: 0.75rem;
  overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.group-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.75rem 1rem; background: #f9fafb; border-bottom: 1px solid #e5e7eb;
}
.group-date { font-size: 0.9rem; font-weight: 700; color: #374151; }
.group-count {
  font-size: 0.78rem; font-weight: 600;
  background: #eef2ff; color: #4f46e5;
  border-radius: 9999px; padding: 0.15rem 0.6rem;
}

.group-list { list-style: none; }
.group-item {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.6rem 1rem; border-bottom: 1px solid #f3f4f6;
}
.group-item:last-child { border-bottom: none; }

.person-name { font-weight: 600; color: #111827; }
.person-nickname { font-size: 0.88rem; color: #6b7280; font-style: italic; }
.person-flag { margin-left: auto; font-size: 1rem; }
.asterisk { color: #d97706; font-weight: 700; margin-left: 0.1rem; }
.badge-unsure {
  font-size: 0.75rem; color: #d97706; background: #fef3c7;
  border: 1px solid #fde68a; border-radius: 0.35rem;
  padding: 0.1rem 0.45rem; font-weight: 500;
}
</style>
