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
const form = ref({ title: '', description: '', image_url: '' })
const imageFile = ref<File | null>(null)
const preview = ref<string | null>(null)
const formErrors = ref({ title: '', description: '', image: '' })

function resetForm() {
  form.value = { title: '', description: '', image_url: '' }
  imageFile.value = null
  preview.value = null
  formErrors.value = { title: '', description: '', image: '' }
}

function openCreate() {
  isEditing.value = false
  editingId.value = ''
  resetForm()
  modalOpen.value = true
}

function openEdit(item: Record<string, unknown>) {
  isEditing.value = true
  editingId.value = String(item.id)
  form.value = {
    title: String(item.title ?? ''),
    description: String(item.description ?? ''),
    image_url: String(item.image_url ?? ''),
  }
  imageFile.value = null
  preview.value = String(item.image_url ?? '') || null
  formErrors.value = { title: '', description: '', image: '' }
  modalOpen.value = true
}

function validateForm(): boolean {
  const nextErrors = { title: '', description: '', image: '' }
  const title = form.value.title.trim()
  const description = form.value.description.trim()

  if (!title) nextErrors.title = 'Judul wajib diisi.'
  else if (title.length < 3) nextErrors.title = 'Judul minimal 3 karakter.'

  if (!description) nextErrors.description = 'Deskripsi wajib diisi.'
  else if (description.length < 10) nextErrors.description = 'Deskripsi minimal 10 karakter.'

  if (!isEditing.value && !imageFile.value && !form.value.image_url) {
    nextErrors.image = 'Gambar wajib diupload.'
  }

  if (imageFile.value) {
    const maxSize = 5 * 1024 * 1024
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']

    if (!allowedTypes.includes(imageFile.value.type)) {
      nextErrors.image = 'Format file harus JPG, PNG, atau WebP.'
    } else if (imageFile.value.size > maxSize) {
      nextErrors.image = 'Ukuran file maksimal 5MB.'
    }
  }

  formErrors.value = nextErrors
  return !nextErrors.title && !nextErrors.description && !nextErrors.image
}

function onImageChange(event: Event) {
  const target = event.target as HTMLInputElement | null
  const file = target?.files?.[0] ?? null

  imageFile.value = file

  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      preview.value = String(reader.result)
    }
    reader.readAsDataURL(file)
    formErrors.value.image = ''
  } else {
    preview.value = form.value.image_url || null
  }
}

async function handleSave() {
  if (!validateForm()) return

  try {
    const payload = {
      title: form.value.title.trim(),
      description: form.value.description.trim(),
    }

    if (isEditing.value) {
      await updateProject(editingId.value, payload, imageFile.value)
    } else {
      await createProject(payload, imageFile.value)
    }

    modalOpen.value = false
    resetForm()
    await fetchProjects()
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
        <BaseInput v-model="form.title" label="Title" :error="formErrors.title" />
        <BaseInput v-model="form.description" label="Description" :error="formErrors.description" />

        <label class="block">
          <span class="text-sm font-medium">Image</span>
          <input
            type="file"
            accept="image/*"
            class="mt-1 block w-full rounded border px-3 py-2"
            @change="onImageChange"
          />
          <p v-if="form.image_url && !preview" class="mt-1 text-sm text-slate-500">
            Current: {{ form.image_url }}
          </p>
          <img v-if="preview" :src="preview" alt="preview" class="mt-2 h-32 w-auto object-cover" />
          <p v-if="formErrors.image" class="mt-1 text-sm text-red-600">{{ formErrors.image }}</p>
        </label>

        <div class="flex justify-end gap-2">
          <BaseButton variant="secondary" @click="modalOpen = false">Cancel</BaseButton>
          <BaseButton type="submit" variant="primary">Save</BaseButton>
        </div>
      </form>
    </Modal>
  </div>
</template>
