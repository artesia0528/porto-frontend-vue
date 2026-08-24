<!-- src/pages/admin/Projects.vue — Admin CRUD for projects with DataTable + Modal form. -->
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useFetch } from '@/composables/useFetch'
import { getProjects, createProject, updateProject, deleteProject } from '@/services/projects'
import DataTable from '@/components/DataTable.vue'
import type { Column } from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'
import BaseButton from '@/components/BaseButton.vue'
import FormInput from '@/components/FormInput.vue'
import FormTextarea from '@/components/FormTextarea.vue'
import ImageUploadField from '@/components/ImageUploadField.vue'
import type { Project } from '@/types'

const { data: projectsRef, run: fetchProjects } = useFetch<Project[]>(getProjects)
const projects = computed(() => projectsRef.value ?? [])

onMounted(() => fetchProjects())

const columns: Column[] = [
  { key: 'title', label: 'Title' },
  { key: 'description', label: 'Description' },
]

const modalOpen = ref(false)
const deleteModalOpen = ref(false)
const isEditing = ref(false)
const editingId = ref('')
const selectedProject = ref<Record<string, unknown> | null>(null)
const form = ref({ title: '', description: '', image_url: '' })
const imageFile = ref<File | null>(null)
const formErrors = ref({ title: '', description: '', image: '' })

function resetForm() {
  form.value = { title: '', description: '', image_url: '' }
  imageFile.value = null
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
      if (!imageFile.value) {
        alert('Gambar wajib diupload saat menambah project baru.')
        return
      }
      await createProject(payload, imageFile.value)
    }

    modalOpen.value = false
    resetForm()
    await fetchProjects()
  } catch {
    // error handled by useFetch interceptor
  }
}

function openDeleteConfirm(item: Record<string, unknown>) {
  selectedProject.value = item
  deleteModalOpen.value = true
}

async function confirmDelete() {
  if (!selectedProject.value) return

  try {
    await deleteProject(String(selectedProject.value.id))
    deleteModalOpen.value = false
    selectedProject.value = null
    fetchProjects()
  } catch {
    // error handled by useFetch interceptor
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
      @delete="openDeleteConfirm"
    />

    <Modal :open="deleteModalOpen" @close="deleteModalOpen = false">
      <div class="space-y-5">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">Confirm</p>
          <h2 class="mt-2 text-2xl font-bold text-slate-900">Delete this project?</h2>
        </div>

        <div v-if="selectedProject" class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-sm font-semibold text-slate-800">{{ selectedProject.title }}</p>
          <p class="mt-2 text-sm text-slate-600">
            This action cannot be undone. The project will be permanently removed.
          </p>
        </div>

        <div class="flex justify-end gap-3 border-t border-slate-200 pt-4">
          <BaseButton variant="secondary" @click="deleteModalOpen = false">Cancel</BaseButton>
          <BaseButton variant="danger" @click="confirmDelete">Delete</BaseButton>
        </div>
      </div>
    </Modal>

    <Modal :open="modalOpen" @close="modalOpen = false">
      <div class="space-y-6">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Project</p>
          <h2 class="mt-2 text-2xl font-bold text-slate-900">
            {{ isEditing ? 'Edit Project' : 'New Project' }}
          </h2>
        </div>

        <form class="space-y-5" @submit.prevent="handleSave">
          <FormInput
            v-model="form.title"
            label="Title"
            :required="true"
            :error="formErrors.title"
            placeholder="Contoh: Portfolio Dashboard"
          />

          <FormTextarea
            v-model="form.description"
            label="Description"
            :required="true"
            :error="formErrors.description"
            :rows="5"
            placeholder="Ceritakan project, fitur, dan hasilnya..."
          />

          <ImageUploadField
            v-model="imageFile"
            :preview-url="form.image_url || null"
            label="Image"
            :required="!isEditing"
            :error="formErrors.image"
          />

          <div class="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <BaseButton variant="secondary" @click="modalOpen = false">Cancel</BaseButton>
            <BaseButton type="submit" variant="primary">Save</BaseButton>
          </div>
        </form>
      </div>
    </Modal>
  </div>
</template>
