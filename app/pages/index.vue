<template>
  <div class="app">
    <header class="header">
      <h1>People I "Meet" In The Club</h1>
      <button class="btn-add" @click="openAdd">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
          <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
        </svg>
        Person hinzufügen
      </button>
    </header>

    <main>
      <div v-if="store.people.length === 0" class="empty">
        <p>Noch niemand eingetragen. Füge jemanden hinzu!</p>
      </div>

      <div v-else class="search-bar">
        <input v-model="search" placeholder="Nach Name oder Spitzname suchen..." />
      </div>

      <ul class="list" v-if="filtered.length > 0">
        <li v-for="person in filtered" :key="person.id">
          <PersonCard :person="person" @edit="openEdit" @delete="store.remove" />
        </li>
      </ul>
      <p v-else-if="store.people.length > 0" class="empty">Keine Treffer.</p>
    </main>

    <div v-if="modalOpen" class="overlay" @click.self="closeModal">
      <div class="modal">
        <h2>{{ editing ? 'Person bearbeiten' : 'Person hinzufügen' }}</h2>
        <PersonForm :initial="editing" @submit="onSubmit" @cancel="closeModal" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Person } from '@/stores/people'
import { usePeopleStore } from '@/stores/people'

const store = usePeopleStore()
await store.fetchAll()

const search = ref('')
const modalOpen = ref(false)
const editing = ref<Person | null>(null)

const filtered = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return store.people
  return store.people.filter(
    (p) => p.prename.toLowerCase().includes(q) || p.nickname.toLowerCase().includes(q),
  )
})

function openAdd() { editing.value = null; modalOpen.value = true }
function openEdit(person: Person) { editing.value = { ...person }; modalOpen.value = true }
function closeModal() { modalOpen.value = false; editing.value = null }

async function onSubmit(data: Omit<Person, 'id'>) {
  if (editing.value) {
    await store.update({ ...data, id: editing.value.id })
  } else {
    await store.add(data)
  }
  closeModal()
}
</script>

<style scoped>
.app { max-width: 640px; margin: 0 auto; padding: 1.5rem 1rem 4rem; }
.header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
.header h1 { font-size: 1.5rem; font-weight: 800; color: #111827; }
.btn-add {
  display: flex; align-items: center; gap: 0.35rem;
  padding: 0.5rem 1rem; background: #4f46e5; color: white;
  border: none; border-radius: 0.6rem; font-size: 0.9rem;
  font-weight: 600; cursor: pointer; transition: background 0.15s;
}
.btn-add:hover { background: #4338ca; }
.search-bar { margin-bottom: 1rem; }
.search-bar input {
  width: 100%; padding: 0.6rem 0.9rem; border: 1px solid #d1d5db;
  border-radius: 0.6rem; font-size: 0.95rem; outline: none;
  background: white; transition: border-color 0.15s;
}
.search-bar input:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }
.list { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; }
.empty { text-align: center; color: #9ca3af; padding: 3rem 0; font-size: 1rem; }
.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem; z-index: 100;
}
.modal {
  background: white; border-radius: 1rem; padding: 1.5rem;
  width: 100%; max-width: 440px; box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.modal h2 { font-size: 1.2rem; font-weight: 700; margin-bottom: 1.25rem; color: #111827; }
</style>
