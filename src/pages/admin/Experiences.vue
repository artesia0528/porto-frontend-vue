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
      <div class="space-y-6">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Experience</p>
          <h2 class="mt-2 text-2xl font-bold text-slate-900">
            {{ isEditing ? 'Edit Experience' : 'New Experience' }}
          </h2>
        </div>

        <form class="space-y-5" @submit.prevent="handleSave">
          <div class="grid gap-4 md:grid-cols-2">
            <label class="block">
              <div class="mb-2 flex items-center justify-between gap-3">
                <span class="text-sm font-medium text-slate-700">Company</span>
                <span class="text-xs font-medium text-red-500">Wajib</span>
              </div>
              <input
                v-model="form.company"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 focus:outline-none"
                :class="formErrors.company ? 'border-red-300 bg-red-50' : ''"
                placeholder="Contoh: Google"
              />
              <p v-if="formErrors.company" class="mt-1 text-xs text-red-600">
                {{ formErrors.company }}
              </p>
            </label>

            <label class="block">
              <div class="mb-2 flex items-center justify-between gap-3">
                <span class="text-sm font-medium text-slate-700">Position</span>
                <span class="text-xs font-medium text-red-500">Wajib</span>
              </div>
              <input
                v-model="form.position"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 focus:outline-none"
                :class="formErrors.position ? 'border-red-300 bg-red-50' : ''"
                placeholder="Contoh: Frontend Developer"
              />
              <p v-if="formErrors.position" class="mt-1 text-xs text-red-600">
                {{ formErrors.position }}
              </p>
            </label>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <label class="block">
              <div class="mb-2 flex items-center justify-between gap-3">
                <span class="text-sm font-medium text-slate-700">Start Date</span>
                <span class="text-xs font-medium text-red-500">Wajib</span>
              </div>
              <input
                v-model="form.start_date"
                type="date"
                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 focus:outline-none"
                :class="formErrors.start_date ? 'border-red-300 bg-red-50' : ''"
              />
              <p v-if="formErrors.start_date" class="mt-1 text-xs text-red-600">
                {{ formErrors.start_date }}
              </p>
            </label>

            <label class="block">
              <div class="mb-2 flex items-center justify-between gap-3">
                <span class="text-sm font-medium text-slate-700">End Date</span>
                <span
                  class="text-xs font-medium text-red-500"
                  :class="form.is_current ? 'text-slate-400' : ''"
                  >{{ form.is_current ? 'Opsional' : 'Wajib' }}</span
                >
              </div>
              <input
                v-model="form.end_date"
                type="date"
                :disabled="form.is_current"
                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                :class="formErrors.end_date ? 'border-red-300 bg-red-50' : ''"
              />
              <p v-if="formErrors.end_date" class="mt-1 text-xs text-red-600">
                {{ formErrors.end_date }}
              </p>
            </label>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <label class="flex cursor-pointer items-center gap-3">
              <input
                v-model="form.is_current"
                type="checkbox"
                @change="handleCurrentToggle"
                class="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <span class="text-sm font-medium text-slate-700">Saat ini masih bekerja disini</span>
            </label>
          </div>

          <label class="block">
            <div class="mb-2 flex items-center justify-between gap-3">
              <span class="text-sm font-medium text-slate-700">Description</span>
              <span class="text-xs font-medium text-red-500">Wajib</span>
            </div>
            <textarea
              v-model="form.description"
              rows="5"
              class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 focus:outline-none"
              :class="formErrors.description ? 'border-red-300 bg-red-50' : ''"
              placeholder="Jelaskan tugas, kontribusi, dan pencapaian Anda..."
            />
            <p v-if="formErrors.description" class="mt-1 text-xs text-red-600">
              {{ formErrors.description }}
            </p>
          </label>

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
