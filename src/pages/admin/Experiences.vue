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
  { key: 'position', label: 'Position' },
  { key: 'start_date', label: 'Start' },
  { key: 'end_date', label: 'End' },
]

const modalOpen = ref(false)
const isEditing = ref(false)
const editingId = ref('')
const logoFile = ref<File | null>(null)
const form = ref({
  company: '',
  position: '',
  start_date: '',
  end_date: '',
  is_current: false,
  description: '',
})

function openCreate() {
  isEditing.value = false
  form.value = {
    company: '',
    position: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
  }
  logoFile.value = null
  modalOpen.value = true
}

function openEdit(item: Record<string, unknown>) {
  isEditing.value = true
  editingId.value = String(item.id)
  form.value = {
    company: String(item.company ?? ''),
    position: String(item.position ?? ''),
    start_date: String(item.start_date ?? ''),
    end_date: String(item.end_date ?? ''),
    is_current: Boolean(item.is_current ?? false),
    description: String(item.description ?? ''),
  }
  logoFile.value = null
  modalOpen.value = true
}

async function handleSave() {
  try {
    if (isEditing.value) {
      const payload: Record<string, unknown> = { ...form.value }
      if (logoFile.value) {
        payload.logo = logoFile.value as File
      }
      await updateExperience(editingId.value, payload as any)
    } else {
      if (!logoFile.value) {
        alert('Logo is required for new experiences')
        return
      }
      await createExperience({
        ...form.value,
        logo: logoFile.value as File,
      } as any)
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

function handleLogoChange(event: Event): void {
  const target = event.target as HTMLInputElement
  logoFile.value = target.files?.[0] ?? null
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
        <BaseInput v-model="form.position" label="Position" />
        <BaseInput v-model="form.start_date" label="Start Date (YYYY-MM)" placeholder="2024-01" />
        <BaseInput v-model="form.end_date" label="End Date (YYYY-MM)" placeholder="2024-06" />
        <div>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="form.is_current" class="w-4 h-4" />
            <span class="text-sm font-medium">Currently working here</span>
          </label>
        </div>
        <BaseInput v-model="form.description" label="Description" type="textarea" />
        <div>
          <label class="block text-sm font-medium mb-1">Logo</label>
          <input
            type="file"
            accept="image/*"
            @change="handleLogoChange"
            class="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        <div class="flex justify-end gap-2">
          <BaseButton variant="secondary" @click="modalOpen = false">Cancel</BaseButton>
          <BaseButton type="submit" variant="primary">Save</BaseButton>
        </div>
      </form>
    </Modal>
  </div>
</template>
