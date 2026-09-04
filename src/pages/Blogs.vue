// File: src/pages/Blogs.vue // Public blogs list page using `getBlogs()` service.

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { motion } from 'motion-v'
import { useFetch } from '@/composables/useFetch'
import { getBlogs } from '@/services/blogs'
import Card from '@/components/Card.vue'
import type { Blog } from '@/types'
import { Search, FolderOpen, AlertCircle } from '@lucide/vue'
import { fadeUpSection, staggerContainer, staggerItem } from '@/motion/variants'

const { data: blogsRef, error, loading, run } = useFetch<Blog[]>(getBlogs)
const blogs = computed(() => blogsRef.value ?? [])

const query = ref('')
const filteredBlogs = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return blogs.value

  return blogs.value.filter(
    (blog) =>
      blog.title.toLowerCase().includes(q) ||
      (blog.excerpt ?? blog.content ?? '').toLowerCase().includes(q),
  )
})

onMounted(() => void run())
</script>

<template>
  <div class="mx-auto max-w-6xl pt-28 pb-20">
    <motion.div v-bind="fadeUpSection">
      <div class="h-1 w-16 rounded bg-sky-600"></div>
      <p class="mt-4 text-sm font-semibold tracking-widest text-neutral-400 uppercase dark:text-neutral-500">Tulisan</p>
      <div class="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-neutral-900 sm:text-4xl dark:text-neutral-100">Blogs</h1>
          <p class="mt-2 max-w-xl text-sm leading-relaxed text-neutral-500 sm:text-base dark:text-neutral-400">
            Catatan, opini, dan pembelajaran yang saya tulis selama proses membangun produk, belajar
            teknik, dan mengeksplorasi ide di dunia web.
          </p>
        </div>

        <p v-if="!loading && !error" class="text-sm text-neutral-400 dark:text-neutral-500">
          {{ filteredBlogs.length }} dari {{ blogs.length }} artikel
        </p>
      </div>

      <div class="relative mt-8 max-w-sm">
        <Search
          :size="16"
          class="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
        />
        <input
          v-model="query"
          type="text"
          placeholder="Cari blog…"
          class="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pr-4 pl-10 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:placeholder:text-neutral-500 dark:focus:border-sky-500 dark:focus:ring-sky-900/50"
        />
      </div>
    </motion.div>

    <div v-if="loading" class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="n in 6"
        :key="n"
        class="animate-pulse overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"
      >
        <div class="aspect-16/10 w-full bg-neutral-100 dark:bg-neutral-700"></div>
        <div class="space-y-2 p-5">
          <div class="h-4 w-3/4 rounded bg-neutral-100 dark:bg-neutral-700"></div>
          <div class="h-3 w-full rounded bg-neutral-100 dark:bg-neutral-700"></div>
          <div class="h-3 w-2/3 rounded bg-neutral-100 dark:bg-neutral-700"></div>
        </div>
      </div>
    </div>

    <div
      v-if="error"
      class="mt-10 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-5 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
    >
      <AlertCircle :size="20" class="mt-0.5 shrink-0" />
      <div>
        <p class="text-sm font-medium">Gagal memuat blog</p>
        <p class="mt-1 text-sm text-red-600/80">{{ error }}</p>
      </div>
    </div>

    <motion.div
      v-if="!loading && !error && filteredBlogs.length"
      class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      v-bind="staggerContainer(0.06)"
    >
      <motion.div v-for="blog in filteredBlogs" :key="blog.id" v-bind="staggerItem">
        <RouterLink :to="`/blogs/${blog.id}`" class="block h-full no-underline">
          <Card
            :title="blog.title"
            :description="blog.excerpt ?? blog.content ?? 'Baca selengkapnya... '"
            :image="blog.image_url"
            :tag="
              blog.created_at
                ? new Date(blog.created_at).toLocaleDateString('id-ID', {
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Blog'
            "
          />
        </RouterLink>
      </motion.div>
    </motion.div>

    <div
      v-else-if="!loading && !error && !filteredBlogs.length"
      class="mt-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-16 text-center dark:border-neutral-700"
    >
      <FolderOpen :size="32" class="text-neutral-300 dark:text-neutral-600" />
      <p class="mt-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
        {{
          query
            ? `Tidak ada blog yang cocok dengan "${query}"`
            : 'Belum ada blog untuk ditampilkan.'
        }}
      </p>
      <button
        v-if="query"
        type="button"
        class="mt-3 text-sm font-medium text-sky-700 hover:underline"
        @click="query = ''"
      >
        Hapus pencarian
      </button>
    </div>
  </div>
</template>
