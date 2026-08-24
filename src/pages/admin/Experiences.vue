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
import BaseButton from '@/components/BaseButton.vue'
import FormInput from '@/components/FormInput.vue'
import FormTextarea from '@/components/FormTextarea.vue'
import FormCheckbox from '@/components/FormCheckbox.vue'
import ImageUploadField from '@/components/ImageUploadField.vue'
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
const deleteModalOpen = ref(false)
const isEditing = ref(false)
const editingId = ref('')
const selectedExperience = ref<Record<string, unknown> | null>(null)
const logoFile = ref<File | null>(null)
const form = ref({
  company: '',
  position: '',
  start_date: '',
  end_date: '',
  is_current: false,
  description: '',
  logo_url: '',
})
const formErrors = ref({
  company: '',
  position: '',
  start_date: '',
  end_date: '',
  description: '',
  logo: '',
})

function normalizeDateInput(value?: string): string {
  if (!value) return ''

  if (/^\d{4}-\d{2}$/.test(value)) {
    return `${value}-01`
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value
  }

  const parsed = new Date(value)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10)
  }

  return ''
}

function resetForm() {
  form.value = {
    company: '',
    position: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    logo_url: '',
  }
  logoFile.value = null
  formErrors.value = {
    company: '',
    position: '',
    start_date: '',
    end_date: '',
    description: '',
    logo: '',
  }
}

function handleCurrentToggle() {
  if (form.value.is_current) {
    form.value.end_date = ''
    formErrors.value.end_date = ''
  }
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
    company: String(item.company ?? ''),
    position: String(item.position ?? ''),
    start_date: normalizeDateInput(String(item.start_date ?? '')),
    end_date: normalizeDateInput(String(item.end_date ?? '')),
    is_current: Boolean(item.is_current ?? false),
    description: String(item.description ?? ''),
    logo_url: String(item.logo_url ?? ''),
  }
  logoFile.value = null
  formErrors.value = {
    company: '',
    position: '',
    start_date: '',
    end_date: '',
    description: '',
    logo: '',
  }
  modalOpen.value = true
}

function validateForm(): boolean {
  const nextErrors = {
    company: '',
    position: '',
    start_date: '',
    end_date: '',
    description: '',
    logo: '',
  }

  const company = form.value.company.trim()
  const position = form.value.position.trim()
  const startDate = form.value.start_date.trim()
  const endDate = form.value.end_date.trim()
  const description = form.value.description.trim()

  if (!company) nextErrors.company = 'Perusahaan wajib diisi.'
  if (!position) nextErrors.position = 'Posisi wajib diisi.'
  if (!startDate) nextErrors.start_date = 'Tanggal mulai wajib dipilih.'

  if (!form.value.is_current && !endDate) {
    nextErrors.end_date = 'Tanggal akhir wajib dipilih, kecuali jika masih bekerja di sini.'
  }

  if (!description) nextErrors.description = 'Deskripsi wajib diisi.'
  else if (description.length < 10) {
    nextErrors.description = 'Deskripsi minimal 10 karakter.'
  }

  if (!isEditing.value && !logoFile.value && !form.value.logo_url) {
    nextErrors.logo = 'Logo wajib diupload saat membuat experience baru.'
  }

  if (logoFile.value) {
    const maxSize = 5 * 1024 * 1024
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']

    if (!allowedTypes.includes(logoFile.value.type)) {
      nextErrors.logo = 'Format file harus JPG, PNG, atau WebP.'
    } else if (logoFile.value.size > maxSize) {
      nextErrors.logo = 'Ukuran file maksimal 5MB.'
    }
  }

  formErrors.value = nextErrors
  return (
    !nextErrors.company &&
    !nextErrors.position &&
    !nextErrors.start_date &&
    !nextErrors.end_date &&
    !nextErrors.description &&
    !nextErrors.logo
  )
}

async function handleSave() {
  if (!validateForm()) return

  try {
    const payload: Record<string, unknown> = {
      company: form.value.company.trim(),
      position: form.value.position.trim(),
      start_date: form.value.start_date,
      end_date: form.value.is_current ? '' : form.value.end_date,
      is_current: form.value.is_current,
      description: form.value.description.trim(),
    }

    if (logoFile.value) {
      payload.logo = logoFile.value as File
    }

    if (isEditing.value) {
      await updateExperience(editingId.value, payload as any)
    } else {
      if (!logoFile.value) {
        alert('Logo wajib diupload saat membuat experience baru.')
        return
      }
      await createExperience({
        ...payload,
        logo: logoFile.value as File,
      } as any)
    }

    modalOpen.value = false
    resetForm()
    await fetchExperiences()
  } catch {
    // error handled by useFetch interceptor
  }
}

function openDeleteConfirm(item: Record<string, unknown>) {
  selectedExperience.value = item
  deleteModalOpen.value = true
}

async function confirmDelete() {
  if (!selectedExperience.value) return

  try {
    await deleteExperience(String(selectedExperience.value.id))
    deleteModalOpen.value = false
    selectedExperience.value = null
    fetchExperiences()
  } catch {
    // error handled by useFetch interceptor
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
      @delete="openDeleteConfirm"
    />

    <Modal :open="deleteModalOpen" @close="deleteModalOpen = false">
      <div class="space-y-5">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">Confirm</p>
          <h2 class="mt-2 text-2xl font-bold text-slate-900">Delete this experience?</h2>
        </div>

        <div v-if="selectedExperience" class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-sm font-semibold text-slate-800">{{ selectedExperience.company }}</p>
          <p class="mt-1 text-sm text-slate-600">{{ selectedExperience.position }}</p>
          <p class="mt-2 text-sm text-slate-600">
            This action cannot be undone. The experience entry will be permanently removed.
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
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Experience</p>
          <h2 class="mt-2 text-2xl font-bold text-slate-900">
            {{ isEditing ? 'Edit Experience' : 'New Experience' }}
          </h2>
        </div>

        <form class="space-y-5" @submit.prevent="handleSave">
          <div class="grid gap-4 md:grid-cols-2">
            <FormInput
              v-model="form.company"
              label="Company"
              :required="true"
              :error="formErrors.company"
              placeholder="Contoh: Google"
            />

            <FormInput
              v-model="form.position"
              label="Position"
              :required="true"
              :error="formErrors.position"
              placeholder="Contoh: Frontend Developer"
            />
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <FormInput
              v-model="form.start_date"
              label="Start Date"
              :required="true"
              :error="formErrors.start_date"
              type="date"
            />

            <FormInput
              v-model="form.end_date"
              label="End Date"
              :required="!form.is_current"
              :error="formErrors.end_date"
              type="date"
              :disabled="form.is_current"
            />
          </div>

          <FormCheckbox
            :model-value="form.is_current"
            label="Saat ini masih bekerja disini"
            @update:model-value="
              (value) => {
                form.is_current = value
                handleCurrentToggle()
              }
            "
          />

          <FormTextarea
            v-model="form.description"
            label="Description"
            :required="true"
            :error="formErrors.description"
            :rows="5"
            placeholder="Jelaskan tugas, kontribusi, dan pencapaian Anda..."
          />

          <ImageUploadField
            v-model="logoFile"
            :preview-url="form.logo_url || null"
            label="Logo"
            :required="!isEditing"
            :error="formErrors.logo"
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
