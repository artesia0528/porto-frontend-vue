<!-- src/pages/admin/Blogs.vue — Admin CRUD for blog posts. -->
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useFetch } from '@/composables/useFetch'
import { getBlogs, createBlog, updateBlog, deleteBlog } from '@/services/blogs'
import DataTable from '@/components/DataTable.vue'
import type { Column } from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'
import BaseButton from '@/components/BaseButton.vue'
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
const isEditing = ref(false)
const editingId = ref('')
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

async function handleDelete(item: Record<string, unknown>) {
  if (confirm('Delete this blog post?')) {
    try {
      await deleteBlog(String(item.id))
      fetchBlogs()
    } catch {
      // error handled by useFetch interceptor
    }
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
      @delete="handleDelete"
    />

    <Modal :open="modalOpen" @close="modalOpen = false">
      <div class="space-y-6">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Blog</p>
          <h2 class="mt-2 text-2xl font-bold text-slate-900">
            {{ isEditing ? 'Edit Blog' : 'New Blog' }}
          </h2>
        </div>

        <form class="space-y-5" @submit.prevent="handleSave">
          <label class="block">
            <div class="mb-2 flex items-center justify-between gap-3">
              <span class="text-sm font-medium text-slate-700">Title</span>
              <span class="text-xs font-medium text-red-500">Wajib</span>
            </div>
            <input
              v-model="form.title"
              type="text"
              class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 focus:outline-none"
              :class="formErrors.title ? 'border-red-300 bg-red-50' : ''"
              placeholder="Contoh: Membuat portfolio modern dengan Vue"
            />
            <p v-if="formErrors.title" class="mt-1 text-xs text-red-600">{{ formErrors.title }}</p>
          </label>

          <label class="block">
            <div class="mb-2 flex items-center justify-between gap-3">
              <span class="text-sm font-medium text-slate-700">Content</span>
              <span class="text-xs font-medium text-red-500">Wajib</span>
            </div>
            <textarea
              v-model="form.content"
              rows="6"
              class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 focus:outline-none"
              :class="formErrors.content ? 'border-red-300 bg-red-50' : ''"
              placeholder="Tulis isi artikel..."
            />
            <p v-if="formErrors.content" class="mt-1 text-xs text-red-600">
              {{ formErrors.content }}
            </p>
          </label>

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
