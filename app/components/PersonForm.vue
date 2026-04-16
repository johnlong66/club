<template>
  <form @submit.prevent="submit" class="form">
    <div class="field">
      <label>Vorname</label>
      <div class="nickname-input-wrap">
        <input v-model="form.prename" :readonly="form.prenameUnknown" />
        <span v-if="form.prenameUnknown" class="asterisk" title="Unbekannt">*</span>
      </div>
      <label class="checkbox-label">
        <input type="checkbox" v-model="form.prenameUnknown" />
        Unbekannt
      </label>
    </div>
    <div class="field">
      <label>Spitzname</label>
      <div class="nickname-input-wrap">
        <input v-model="form.nickname"  />
        <span v-if="form.nicknameUnsure" class="asterisk" title="Nicht ganz sicher">*</span>
      </div>
      <label class="checkbox-label">
        <input type="checkbox" v-model="form.nicknameUnsure" />
        Nicht ganz sicher
      </label>
    </div>
    <div class="field">
      <label>Kommentar</label>
      <textarea v-model="form.comment" placeholder="Notizen zur Person..." rows="2" />
    </div>
    <div class="field">
      <label>Kennengelernt am</label>
      <input v-model="form.meetingDay" type="date" required />
    </div>
    <div class="actions">
      <button type="button" class="btn-secondary" @click="$emit('cancel')">Abbrechen</button>
      <button type="submit" class="btn-primary">{{ isEdit ? 'Speichern' : 'Hinzufügen' }}</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Person } from '@/stores/people'

const props = defineProps<{ initial?: Person | null }>()
const emit = defineEmits<{ submit: [data: Omit<Person, 'id'>]; cancel: [] }>()

const isEdit = !!props.initial

const form = reactive({
  prename: props.initial?.prename ?? '',
  prenameUnknown: props.initial?.prenameUnknown ?? false,
  nickname: props.initial?.nickname ?? '',
  nicknameUnsure: props.initial?.nicknameUnsure ?? false,
  meetingDay: props.initial?.meetingDay ?? '',
  comment: props.initial?.comment ?? '',
})

watch(() => props.initial, (val) => {
  form.prename = val?.prename ?? ''
  form.prenameUnknown = val?.prenameUnknown ?? false
  form.nickname = val?.nickname ?? ''
  form.nicknameUnsure = val?.nicknameUnsure ?? false
  form.meetingDay = val?.meetingDay ?? ''
  form.comment = val?.comment ?? ''
})

function submit() {
  emit('submit', { ...form, prename: form.prename || null, nickname: form.nickname || null, comment: form.comment || null })
}
</script>

<style scoped>
.form { display: flex; flex-direction: column; gap: 1rem; }
.field { display: flex; flex-direction: column; gap: 0.35rem; }
label { font-size: 0.85rem; font-weight: 600; color: #374151; }
input[type="text"], input[type="date"], input:not([type]) {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.15s;
}
input:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }
input[readonly] { background: #f3f4f6; color: #9ca3af; cursor: default; }
textarea {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: inherit;
  outline: none;
  resize: vertical;
  transition: border-color 0.15s;
}
textarea:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }
.nickname-input-wrap { position: relative; display: flex; align-items: center; }
.nickname-input-wrap input { flex: 1; }
.asterisk {
  position: absolute; right: 0.65rem;
  font-size: 1.1rem; font-weight: 700; color: #d97706; pointer-events: none;
}
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
}
.checkbox-label input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
  accent-color: #4f46e5;
}
.actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 0.5rem; }
.btn-primary {
  padding: 0.5rem 1.25rem; background: #4f46e5; color: white;
  border: none; border-radius: 0.5rem; font-size: 0.95rem; font-weight: 600;
  cursor: pointer; transition: background 0.15s;
}
.btn-primary:hover { background: #4338ca; }
.btn-secondary {
  padding: 0.5rem 1.25rem; background: white; color: #374151;
  border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 0.95rem;
  font-weight: 600; cursor: pointer; transition: background 0.15s;
}
.btn-secondary:hover { background: #f9fafb; }
</style>
