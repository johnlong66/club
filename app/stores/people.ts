import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Person {
  id: string
  prename: string | null
  prenameUnknown: boolean
  nickname: string | null
  nicknameUnsure: boolean
  meetingDay: string
  comment: string | null
  country: string | null
}

export const usePeopleStore = defineStore('people', () => {
  const people = ref<Person[]>([])

  async function fetchAll() {
    people.value = await $fetch<Person[]>('/api/people')
  }

  async function add(data: Omit<Person, 'id'>) {
    const created = await $fetch<Person>('/api/people', { method: 'POST', body: data })
    people.value.push(created)
  }

  async function update(person: Person) {
    const updated = await $fetch<Person>(`/api/people/${person.id}`, { method: 'PUT', body: person })
    const idx = people.value.findIndex((p) => p.id === person.id)
    if (idx !== -1) people.value[idx] = updated
  }

  async function remove(id: string) {
    await $fetch(`/api/people/${id}`, { method: 'DELETE' })
    people.value = people.value.filter((p) => p.id !== id)
  }

  return { people, fetchAll, add, update, remove }
})
