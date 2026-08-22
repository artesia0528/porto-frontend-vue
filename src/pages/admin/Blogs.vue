<!-- src/pages/admin/Blogs.vue — Admin CRUD for blog posts. -->
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useFetch } from '@/composables/useFetch'
import { getBlogs, createBlog, updateBlog, deleteBlog } from '@/services/blogs'
import DataTable from '@/components/DataTable.vue'
import type { Column } from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import type { Blog } from '@/types'

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
const form = ref({ title: '', content: '' })

function openCreate() {
  isEditing.value = false
  form.value = { title: '', content: '' }
  imageFile.value = null
  modalOpen.value = true
}

function openEdit(item: Record<string, unknown>) {
  isEditing.value = true
  editingId.value = String(item.id)
  form.value = {
    title: String(item.title ?? ''),
    content: String(item.content ?? ''),
  }
  imageFile.value = null
  modalOpen.value = true
}

async function handleSave() {
  try {
    if (isEditing.value) {
      const payload: Record<string, unknown> = { ...form.value }
      if (imageFile.value) {
        payload.image = imageFile.value as File
      }
      await updateBlog(editingId.value, payload as any)
    } else {
      if (!imageFile.value) {
        alert('Image is required for new blog posts')
        return
      }
      await createBlog({
        ...form.value,
        image: imageFile.value as File,
      })
    }
    modalOpen.value = false
    fetchBlogs()
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

function handleImageChange(event: Event): void {
  const target = event.target as HTMLInputElement
  imageFile.value = target.files?.[0] ?? null
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
      <h2 class="mb-4 text-lg font-bold text-slate-900">
        {{ isEditing ? 'Edit Blog' : 'New Blog' }}
      </h2>
      <form class="space-y-4" @submit.prevent="handleSave">
        <BaseInput v-model="form.title" label="Title" />
        <BaseInput v-model="form.content" label="Content" type="textarea" />
        <div>
          <label class="block text-sm font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            @change="handleImageChange"
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
