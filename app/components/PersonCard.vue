<template>
  <div class="card">
    <div class="card-body">
      <div class="name-row">
        <h2 class="full-name">
          <span v-if="person.prename">{{ person.prename }}</span>
          <span v-else class="unknown">?</span>
          <span v-if="person.prenameUnknown" class="asterisk" title="Unbekannt">*</span>
        </h2>
        <span v-if="person.nickname" class="nickname">"{{ person.nickname }}"<span v-if="person.nicknameUnsure" class="asterisk" title="Unsure">*</span></span>
        <span v-else-if="person.nicknameUnsure" class="badge-unsure">Spitzname unsicher?</span>
      </div>
      <p class="meeting-day">
        Kennengelernt am {{ formattedDate }}
        <span v-if="person.country" class="flag">{{ flagForCode(person.country) }}</span>
      </p>
      <p v-if="person.comment" class="comment">{{ person.comment }}</p>
    </div>
    <div class="card-actions">
      <button class="icon-btn" title="Bearbeiten" @click="$emit('edit', person)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
          <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
        </svg>
      </button>
      <button class="icon-btn danger" title="Löschen" @click="$emit('delete', person.id)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
          <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Person } from '@/stores/people'
import { useCountries } from '@/composables/useCountries'

const props = defineProps<{ person: Person }>()
const { flagForCode } = useCountries()
defineEmits<{ edit: [person: Person]; delete: [id: string] }>()

const formattedDate = computed(() => {
  if (!props.person.meetingDay) return '—'
  return new Date(props.person.meetingDay + 'T00:00:00').toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric',
  })
})
</script>

<style scoped>
.card {
  display: flex; align-items: center; background: white;
  border: 1px solid #e5e7eb; border-radius: 0.75rem;
  padding: 1rem 1.25rem; gap: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05); transition: box-shadow 0.15s;
}
.card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.card-body { flex: 1; min-width: 0; }
.name-row { display: flex; align-items: baseline; gap: 0.5rem; flex-wrap: wrap; }
.full-name { margin: 0; font-size: 1.05rem; font-weight: 700; color: #111827; display: flex; align-items: baseline; gap: 0.15rem; }
.unknown { color: #9ca3af; }
.nickname { font-size: 0.9rem; color: #6b7280; font-style: italic; }
.asterisk { color: #d97706; font-weight: 700; margin-left: 0.1rem; }
.badge-unsure {
  font-size: 0.75rem; color: #d97706; background: #fef3c7;
  border: 1px solid #fde68a; border-radius: 0.35rem;
  padding: 0.1rem 0.45rem; font-weight: 500;
}
.meeting-day { margin: 0.2rem 0 0; font-size: 0.82rem; color: #9ca3af; display: flex; align-items: center; gap: 0.35rem; }
.flag { font-size: 1rem; line-height: 1; }
.comment { margin: 0.25rem 0 0; font-size: 0.85rem; color: #6b7280; white-space: pre-wrap; }
.card-actions { display: flex; gap: 0.25rem; }
.icon-btn {
  padding: 0.4rem; background: transparent; border: none;
  border-radius: 0.4rem; cursor: pointer; color: #6b7280;
  transition: background 0.15s, color 0.15s; display: flex; align-items: center;
}
.icon-btn:hover { background: #f3f4f6; color: #374151; }
.icon-btn.danger:hover { background: #fee2e2; color: #dc2626; }
</style>
