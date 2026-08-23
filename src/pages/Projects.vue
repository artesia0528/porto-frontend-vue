<!-- src/pages/Projects.vue — Public projects listing. -->
<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { motion } from 'motion-v'
import { useFetch } from '@/composables/useFetch'
import { getProjects } from '@/services/projects'
import Card from '@/components/Card.vue'
import type { Project } from '@/types'
import { Search, FolderOpen, AlertCircle } from '@lucide/vue'
import { fadeUpSection, staggerContainer, staggerItem } from '@/motion/variants'

const { data: projectsRef, loading, error, run } = useFetch<Project[]>(getProjects)
const projects = computed(() => projectsRef.value ?? [])

// Client-side search — filters on fields we know exist (title/description).
// If your Project type has tags/category, this is the spot to extend the
// filter and add chip-based filtering on top of it.
const query = ref('')
const filteredProjects = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return projects.value
  return projects.value.filter(
    (p) => p.title.toLowerCase().includes(q) || (p.description ?? '').toLowerCase().includes(q),
  )
})

onMounted(() => void run())
</script>

<template>
  <div class="mx-auto max-w-6xl pt-28 pb-20">
    <!-- Header -->
    <motion.div v-bind="fadeUpSection">
      <div class="h-1 w-16 rounded bg-sky-600"></div>
      <p class="mt-4 text-sm font-semibold tracking-widest text-neutral-400 uppercase">Karya</p>
      <div class="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-neutral-900 sm:text-4xl">Projects</h1>
          <p class="mt-2 max-w-xl text-sm leading-relaxed text-neutral-500 sm:text-base">
            Kumpulan aplikasi dan eksperimen yang pernah saya bangun, dari front-end hingga
            back-end. Beberapa project bersifat open-source, beberapa lainnya adalah project pribadi
            atau untuk klien.
          </p>
        </div>

        <p v-if="!loading && !error" class="text-sm text-neutral-400">
          {{ filteredProjects.length }} dari {{ projects.length }} project
        </p>
      </div>

      <!-- Search -->
      <div class="relative mt-8 max-w-sm">
        <Search
          :size="16"
          class="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-neutral-400"
        />
        <input
          v-model="query"
          type="text"
          placeholder="Cari project…"
          class="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pr-4 pl-10 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 focus:outline-none"
        />
      </div>
    </motion.div>

    <!-- Loading: skeleton grid so the layout doesn't jump when data arrives -->
    <div v-if="loading" class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="n in 6"
        :key="n"
        class="animate-pulse overflow-hidden rounded-2xl border border-neutral-200 bg-white"
      >
        <div class="aspect-16/10 w-full bg-neutral-100"></div>
        <div class="space-y-2 p-5">
          <div class="h-4 w-3/4 rounded bg-neutral-100"></div>
          <div class="h-3 w-full rounded bg-neutral-100"></div>
          <div class="h-3 w-2/3 rounded bg-neutral-100"></div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div
      v-if="error"
      class="mt-10 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-5 text-red-700"
    >
      <AlertCircle :size="20" class="mt-0.5 shrink-0" />
      <div>
        <p class="text-sm font-medium">Gagal memuat projects</p>
        <p class="mt-1 text-sm text-red-600/80">{{ error }}</p>
      </div>
    </div>

    <!-- Grid: staggered reveal -->
    <motion.div
      v-if="!loading && !error && filteredProjects.length"
      class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      v-bind="staggerContainer(0.06)"
    >
      <motion.div v-for="project in filteredProjects" :key="project.id" v-bind="staggerItem">
        <RouterLink :to="`/projects/${project.id}`" class="block h-full no-underline">
          <Card
            :title="project.title"
            :description="project.description"
            :image="project.image_url"
          />
        </RouterLink>
      </motion.div>
    </motion.div>

    <!-- Empty: distinguishes "no data at all" from "no search match" -->
    <div
      v-else-if="!loading && !error && !filteredProjects.length"
      class="mt-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-16 text-center"
    >
      <FolderOpen :size="32" class="text-neutral-300" />
      <p class="mt-4 text-sm font-medium text-neutral-600">
        {{
          query
            ? `Tidak ada project yang cocok dengan "${query}"`
            : 'Belum ada project untuk ditampilkan.'
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
