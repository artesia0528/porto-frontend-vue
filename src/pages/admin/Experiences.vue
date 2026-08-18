<!-- src/pages/admin/Experiences.vue — Admin CRUD for experiences. -->
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useFetch } from '@/composables/useFetch'
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from '@/services/experiences'
import DataTable from '@/components/DataTable.vue'
import type { Column } from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import type { Experience } from '@/types'

const { data: experiencesRef, run: fetchExperiences } = useFetch<Experience[]>(getExperiences)
const experiences = computed(() => experiencesRef.value ?? [])

onMounted(() => fetchExperiences())

const columns: Column[] = [
  { key: 'company', label: 'Company' },
  { key: 'role', label: 'Role' },
  { key: 'startDate', label: 'Start' },
  { key: 'endDate', label: 'End' },
]

const modalOpen = ref(false)
const isEditing = ref(false)
const editingId = ref('')
const form = ref({ company: '', role: '', startDate: '', endDate: '', description: '' })

function openCreate() {
  isEditing.value = false
  form.value = { company: '', role: '', startDate: '', endDate: '', description: '' }
  modalOpen.value = true
}

function openEdit(item: Record<string, unknown>) {
  isEditing.value = true
  editingId.value = String(item.id)
  form.value = {
    company: String(item.company ?? ''),
    role: String(item.role ?? ''),
    startDate: String(item.startDate ?? ''),
    endDate: String(item.endDate ?? ''),
    description: String(item.description ?? ''),
  }
  modalOpen.value = true
}

async function handleSave() {
  try {
    if (isEditing.value) {
      await updateExperience(editingId.value, { ...form.value })
    } else {
      await createExperience({ ...form.value })
    }
    modalOpen.value = false
    fetchExperiences()
  } catch {
    // error handled by useFetch interceptor
  }
}

async function handleDelete(item: Record<string, unknown>) {
  if (confirm('Delete this experience?')) {
    try {
      await deleteExperience(String(item.id))
      fetchExperiences()
    } catch {
      // error handled by useFetch interceptor
    }
  }
}
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-900">Manage Experiences</h1>
      <BaseButton variant="primary" @click="openCreate">+ New Experience</BaseButton>
    </div>

    <DataTable
      :columns="columns"
      :items="(experiences as unknown as Record<string, unknown>[]) ?? []"
      @edit="openEdit"
      @delete="handleDelete"
    />

    <Modal :open="modalOpen" @close="modalOpen = false">
      <h2 class="mb-4 text-lg font-bold text-slate-900">
        {{ isEditing ? 'Edit Experience' : 'New Experience' }}
      </h2>
      <form class="space-y-4" @submit.prevent="handleSave">
        <BaseInput v-model="form.company" label="Company" />
        <BaseInput v-model="form.role" label="Role" />
        <BaseInput v-model="form.startDate" label="Start Date" />
        <BaseInput v-model="form.endDate" label="End Date" />
        <BaseInput v-model="form.description" label="Description" />
        <div class="flex justify-end gap-2">
          <BaseButton variant="secondary" @click="modalOpen = false">Cancel</BaseButton>
          <BaseButton type="submit" variant="primary">Save</BaseButton>
        </div>
      </form>
    </Modal>
  </div>
</template>
