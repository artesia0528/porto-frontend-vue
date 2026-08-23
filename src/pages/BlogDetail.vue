<!-- src/pages/BlogDetail.vue — Single blog detail page. -->
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { motion } from 'motion-v'
import { useFetch } from '@/composables/useFetch'
import { getBlogs } from '@/services/blogs'
import type { Blog } from '@/types'
import { ArrowLeft, Calendar, AlertCircle, FileQuestion } from '@lucide/vue'
import { fadeUpSection, springTransition } from '@/motion/variants'

const route = useRoute()
const router = useRouter()
const blogId = String(route.params.id ?? '')

const { data: blogs, loading, error, run } = useFetch<Blog[]>(getBlogs)

const blog = computed(() => {
  if (!blogs.value) return null
  return blogs.value.find((item) => String(item.id) === blogId) ?? null
})

const notFound = computed(() => !loading.value && !error.value && !blog.value)

function formatDate(value?: string) {
  if (!value) return null

  return new Date(value).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

onMounted(() => void run())
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 pt-28 pb-24">
    <button
      class="mb-8 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-sky-700"
      @click="router.back()"
    >
      <ArrowLeft :size="16" />
      Kembali
    </button>

    <div v-if="loading" class="animate-pulse space-y-6">
      <div class="aspect-video w-full rounded-2xl bg-neutral-100"></div>
      <div class="h-8 w-2/3 rounded bg-neutral-100"></div>
      <div class="space-y-2">
        <div class="h-4 w-full rounded bg-neutral-100"></div>
        <div class="h-4 w-5/6 rounded bg-neutral-100"></div>
        <div class="h-4 w-3/4 rounded bg-neutral-100"></div>
      </div>
    </div>

    <div
      v-else-if="error"
      class="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-5 text-red-700"
    >
      <AlertCircle :size="20" class="mt-0.5 shrink-0" />
      <div>
        <p class="text-sm font-medium">Gagal memuat blog</p>
        <p class="mt-1 text-sm text-red-600/80">{{ error }}</p>
      </div>
    </div>

    <div
      v-else-if="notFound"
      class="flex flex-col items-center rounded-2xl border border-dashed border-neutral-200 py-20 text-center"
    >
      <FileQuestion :size="32" class="text-neutral-300" />
      <p class="mt-4 text-sm font-medium text-neutral-600">Blog tidak ditemukan.</p>
      <p class="mt-1 text-sm text-neutral-400">
        Artikel ini mungkin sudah dihapus atau alamatnya salah.
      </p>
      <RouterLink
        to="/blogs"
        class="mt-5 rounded-md bg-sky-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-800"
      >
        Lihat semua blog
      </RouterLink>
    </div>

    <article v-else-if="blog">
      <motion.img
        v-if="blog.image_url"
        :src="blog.image_url"
        :alt="blog.title"
        class="aspect-video w-full rounded-2xl border border-neutral-200 object-cover shadow-sm"
        :initial="{ opacity: 0, scale: 0.98 }"
        :animate="{ opacity: 1, scale: 1 }"
        :transition="springTransition"
      />

      <motion.div v-bind="fadeUpSection" class="mt-8">
        <div class="flex flex-wrap items-center gap-3 text-sm text-neutral-500">
          <span class="rounded-full bg-sky-50 px-2.5 py-1 font-medium text-sky-700">Blog</span>
          <span v-if="blog.created_at" class="inline-flex items-center gap-1.5">
            <Calendar :size="14" />
            {{ formatDate(blog.created_at) }}
          </span>
        </div>

        <h1 class="mt-5 text-3xl font-bold text-neutral-900 sm:text-4xl">{{ blog.title }}</h1>

        <div class="mt-8 border-t border-neutral-200 pt-6">
          <p class="text-base leading-relaxed whitespace-pre-line text-neutral-600">
            {{ blog.content || blog.excerpt || 'Konten blog belum tersedia.' }}
          </p>
        </div>

        <div class="mt-10 border-t border-neutral-200 pt-6">
          <RouterLink
            to="/blogs"
            class="text-sm font-medium text-sky-700 transition-colors hover:text-sky-800 hover:underline"
          >
            ← Lihat blog lainnya
          </RouterLink>
        </div>
      </motion.div>
    </article>
  </div>
</template>
