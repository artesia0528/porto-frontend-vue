<!-- src/pages/admin/Blogs.vue — Admin CRUD for blog posts. -->
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useFetch } from '@/composables/useFetch'
import { getBlogs, createBlog, updateBlog, deleteBlog } from '@/services/blogs'
import DataTable from '@/components/DataTable.vue'
import type { Column } from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'
import BaseButton from '@/components/BaseButton.vue'
import FormInput from '@/components/FormInput.vue'
import FormTextarea from '@/components/FormTextarea.vue'
import ImageUploadField from '@/components/ImageUploadField.vue'
import type { Blog, CreateBlogRequest, UpdateBlogRequest } from '@/types'

const { data: blogsRef, run: fetchBlogs } = useFetch<Blog[]>(getBlogs)
const blogs = computed(() => blogsRef.value ?? [])

onMounted(() => fetchBlogs())

const columns: Column[] = [
  { key: 'title', label: 'Title' },
  { key: 'content', label: 'Content' },
]

const modalOpen = ref(false)
const deleteModalOpen = ref(false)
const isEditing = ref(false)
const editingId = ref('')
const selectedBlog = ref<Record<string, unknown> | null>(null)
const imageFile = ref<File | null>(null)
const form = ref({ title: '', content: '', image_url: '' })
const formErrors = ref({ title: '', content: '', image: '' })

function resetForm() {
  form.value = { title: '', content: '', image_url: '' }
  imageFile.value = null
  formErrors.value = { title: '', content: '', image: '' }
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
    content: String(item.content ?? ''),
    image_url: String(item.image_url ?? ''),
  }
  imageFile.value = null
  formErrors.value = { title: '', content: '', image: '' }
  modalOpen.value = true
}

function validateForm(): boolean {
  const nextErrors = { title: '', content: '', image: '' }
  const title = form.value.title.trim()
  const content = form.value.content.trim()

  if (!title) nextErrors.title = 'Judul wajib diisi.'
  else if (title.length < 3) nextErrors.title = 'Judul minimal 3 karakter.'

  if (!content) nextErrors.content = 'Konten wajib diisi.'
  else if (content.length < 20) nextErrors.content = 'Konten minimal 20 karakter.'

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
  return !nextErrors.title && !nextErrors.content && !nextErrors.image
}

async function handleSave() {
  if (!validateForm()) return

  try {
    if (isEditing.value) {
      const payload: UpdateBlogRequest = {
        title: form.value.title.trim(),
        content: form.value.content.trim(),
      }

      if (imageFile.value) {
        payload.image = imageFile.value
      }

      await updateBlog(editingId.value, payload)
    } else {
      if (!imageFile.value) {
        alert('Gambar wajib diupload saat menambah blog baru.')
        return
      }

      const payload: CreateBlogRequest = {
        title: form.value.title.trim(),
        content: form.value.content.trim(),
        image: imageFile.value,
      }

      await createBlog(payload)
    }

    modalOpen.value = false
    resetForm()
    await fetchBlogs()
  } catch {
    // error handled by useFetch interceptor
  }
}

function openDeleteConfirm(item: Record<string, unknown>) {
  selectedBlog.value = item
  deleteModalOpen.value = true
}

async function confirmDelete() {
  if (!selectedBlog.value) return

  try {
    await deleteBlog(String(selectedBlog.value.id))
    deleteModalOpen.value = false
    selectedBlog.value = null
    fetchBlogs()
  } catch {
    // error handled by useFetch interceptor
  }
}
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-900">Manage Blogs</h1>
      <BaseButton variant="primary" @click="openCreate">+ New Blog</BaseButton>
    </div>

    <DataTable
      :columns="columns"
      :items="(blogs as unknown as Record<string, unknown>[]) ?? []"
      @edit="openEdit"
      @delete="openDeleteConfirm"
    />

    <Modal :open="deleteModalOpen" @close="deleteModalOpen = false">
      <div class="space-y-5">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">Confirm</p>
          <h2 class="mt-2 text-2xl font-bold text-slate-900">Delete this blog post?</h2>
        </div>

        <div v-if="selectedBlog" class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-sm font-semibold text-slate-800">{{ selectedBlog.title }}</p>
          <p class="mt-2 text-sm text-slate-600">
            This action cannot be undone. The blog post will be permanently removed.
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
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Blog</p>
          <h2 class="mt-2 text-2xl font-bold text-slate-900">
            {{ isEditing ? 'Edit Blog' : 'New Blog' }}
          </h2>
        </div>

        <form class="space-y-5" @submit.prevent="handleSave">
          <FormInput
            v-model="form.title"
            label="Title"
            :required="true"
            :error="formErrors.title"
            placeholder="Contoh: Membuat portfolio modern dengan Vue"
          />

          <FormTextarea
            v-model="form.content"
            label="Content"
            :required="true"
            :error="formErrors.content"
            :rows="6"
            placeholder="Tulis isi artikel..."
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
