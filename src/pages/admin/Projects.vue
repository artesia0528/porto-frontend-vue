<!-- src/pages/admin/Projects.vue — Admin CRUD for projects with DataTable + Modal form. -->
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useFetch } from '@/composables/useFetch'
import { getProjects, createProject, updateProject, deleteProject } from '@/services/projects'
import DataTable from '@/components/DataTable.vue'
import type { Column } from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import type { Project } from '@/types'

const { data: projectsRef, run: fetchProjects } = useFetch<Project[]>(getProjects)
const projects = computed(() => projectsRef.value ?? [])

onMounted(() => fetchProjects())

const columns: Column[] = [
  { key: 'title', label: 'Title' },
  { key: 'description', label: 'Description' },
]

const modalOpen = ref(false)
const isEditing = ref(false)
const editingId = ref('')
const form = ref({ title: '', description: '', image: '', url: '' })

function openCreate() {
  isEditing.value = false
  form.value = { title: '', description: '', image: '', url: '' }
  modalOpen.value = true
}

function openEdit(item: Record<string, unknown>) {
  isEditing.value = true
  editingId.value = String(item.id)
  form.value = {
    title: String(item.title ?? ''),
    description: String(item.description ?? ''),
    image: String(item.image ?? ''),
    url: String(item.url ?? ''),
  }
  modalOpen.value = true
}

async function handleSave() {
  try {
    if (isEditing.value) {
      await updateProject(editingId.value, { ...form.value })
    } else {
      await createProject({ ...form.value })
    }
    modalOpen.value = false
    fetchProjects()
  } catch {
    // error handled by useFetch interceptor
  }
}

async function handleDelete(item: Record<string, unknown>) {
  if (confirm('Delete this project?')) {
    try {
      await deleteProject(String(item.id))
      fetchProjects()
    } catch {
      // error handled by useFetch interceptor
    }
  }
}
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-900">Manage Projects</h1>
      <BaseButton variant="primary" @click="openCreate">+ New Project</BaseButton>
    </div>

    <DataTable
      :columns="columns"
      :items="(projects as unknown as Record<string, unknown>[]) ?? []"
      @edit="openEdit"
      @delete="handleDelete"
    />

    <Modal :open="modalOpen" @close="modalOpen = false">
      <h2 class="mb-4 text-lg font-bold text-slate-900">
        {{ isEditing ? 'Edit Project' : 'New Project' }}
      </h2>
      <form class="space-y-4" @submit.prevent="handleSave">
        <BaseInput v-model="form.title" label="Title" />
        <BaseInput v-model="form.description" label="Description" />
        <BaseInput v-model="form.image" label="Image URL" />
        <BaseInput v-model="form.url" label="Project URL" />
        <div class="flex justify-end gap-2">
          <BaseButton variant="secondary" @click="modalOpen = false">Cancel</BaseButton>
          <BaseButton type="submit" variant="primary">Save</BaseButton>
        </div>
      </form>
    </Modal>
  </div>
</template>
