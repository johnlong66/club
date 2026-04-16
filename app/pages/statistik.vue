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
      <div class="chart-card">
        <VChart :option="chartOption" autoresize style="height: 320px;" />
      </div>

      <div class="groups">
        <section v-for="group in grouped" :key="group.date" class="group">
          <div class="group-header">
            <span class="group-date">{{ group.label }}</span>
            <span class="group-count">{{ group.people.length }} {{ group.people.length === 1 ? 'Person' : 'Personen' }}</span>
          </div>
          <ul class="group-list">
            <li v-for="person in group.people" :key="person.id" class="group-item">
              <span class="person-name">{{ person.prename }}</span>
              <span v-if="person.nickname" class="person-nickname">
                „{{ person.nickname }}"<span v-if="person.nicknameUnsure" class="asterisk" title="Nicht ganz sicher">*</span>
              </span>
              <span v-else-if="person.nicknameUnsure" class="badge-unsure">Spitzname unsicher?</span>
            </li>
          </ul>
        </section>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { usePeopleStore } from '@/stores/people'

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent])

const store = usePeopleStore()
await store.fetchAll()

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
      people: [...people].sort((a, b) => a.prename.localeCompare(b.prename)),
    }))
})

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'horizontal',
    bottom: 0,
    textStyle: { fontSize: 12 },
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 14, fontWeight: 'bold' },
      },
      data: grouped.value.map((g) => ({
        name: g.shortLabel,
        value: g.people.length,
      })),
    },
  ],
}))
</script>

<style scoped>
.page { max-width: 640px; margin: 0 auto; padding: 1.5rem 1rem 4rem; }
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

.groups { display: flex; flex-direction: column; gap: 1.25rem; }

.group {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.group-date { font-size: 0.9rem; font-weight: 700; color: #374151; }
.group-count {
  font-size: 0.78rem; font-weight: 600;
  background: #eef2ff; color: #4f46e5;
  border-radius: 9999px; padding: 0.15rem 0.6rem;
}

.group-list { list-style: none; }

.group-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-bottom: 1px solid #f3f4f6;
}
.group-item:last-child { border-bottom: none; }

.person-name { font-weight: 600; color: #111827; }
.person-nickname { font-size: 0.88rem; color: #6b7280; font-style: italic; }
.asterisk { color: #d97706; font-weight: 700; margin-left: 0.1rem; }
.badge-unsure {
  font-size: 0.75rem; color: #d97706; background: #fef3c7;
  border: 1px solid #fde68a; border-radius: 0.35rem;
  padding: 0.1rem 0.45rem; font-weight: 500;
}
</style>
