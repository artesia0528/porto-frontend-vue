<!-- src/pages/ProjectDetail.vue — Single project detail page. -->
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { motion } from 'motion-v'
import { useFetch } from '@/composables/useFetch'
import { getProjects } from '@/services/projects'
import type { Project } from '@/types'
import { ArrowLeft, Calendar, AlertCircle, FileQuestion } from '@lucide/vue'
import { fadeUpSection, springTransition } from '@/motion/variants'

const route = useRoute()
const router = useRouter()
const projectId = String(route.params.id ?? '')

const { data: projects, loading, error, run } = useFetch<Project[]>(getProjects)

const project = computed(() => {
  if (!projects.value) return null
  return projects.value.find((item) => String(item.id) === projectId) ?? null
})

// Distinguish "still loading" from "fetched fine, but this id doesn't exist" —
// the previous version rendered nothing at all in the latter case.
const notFound = computed(() => !loading.value && !error.value && !project.value)

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
    <!-- Back -->
    <button
      class="mb-8 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-sky-700"
      @click="router.back()"
    >
      <ArrowLeft :size="16" />
      Kembali
    </button>

    <!-- Loading skeleton -->
    <div v-if="loading" class="animate-pulse space-y-6">
      <div class="aspect-video w-full rounded-2xl bg-neutral-100"></div>
      <div class="h-8 w-2/3 rounded bg-neutral-100"></div>
      <div class="space-y-2">
        <div class="h-4 w-full rounded bg-neutral-100"></div>
        <div class="h-4 w-5/6 rounded bg-neutral-100"></div>
        <div class="h-4 w-3/4 rounded bg-neutral-100"></div>
      </div>
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-5 text-red-700"
    >
      <AlertCircle :size="20" class="mt-0.5 shrink-0" />
      <div>
        <p class="text-sm font-medium">Gagal memuat project</p>
        <p class="mt-1 text-sm text-red-600/80">{{ error }}</p>
      </div>
    </div>

    <!-- Not found: previously this case rendered a blank page -->
    <div
      v-else-if="notFound"
      class="flex flex-col items-center rounded-2xl border border-dashed border-neutral-200 py-20 text-center"
    >
      <FileQuestion :size="32" class="text-neutral-300" />
      <p class="mt-4 text-sm font-medium text-neutral-600">Project tidak ditemukan.</p>
      <p class="mt-1 text-sm text-neutral-400">
        Project ini mungkin sudah dihapus atau alamatnya salah.
      </p>
      <RouterLink
        to="/projects"
        class="mt-5 rounded-md bg-sky-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-800"
      >
        Lihat semua project
      </RouterLink>
    </div>

    <!-- Content -->
    <article v-else-if="project">
      <motion.img
        v-if="project.image_url"
        :src="project.image_url"
        :alt="project.title"
        class="aspect-video w-full rounded-2xl border border-neutral-200 object-cover shadow-sm"
        :initial="{ opacity: 0, scale: 0.98 }"
        :animate="{ opacity: 1, scale: 1 }"
        :transition="springTransition"
      />

      <motion.div v-bind="fadeUpSection" class="mt-8">
        <h1 class="text-3xl font-bold text-neutral-900 sm:text-4xl">{{ project.title }}</h1>

        <div
          v-if="project.created_at || project.createdAt"
          class="mt-3 flex items-center gap-1.5 text-sm text-neutral-400"
        >
          <Calendar :size="14" />
          <span>{{ formatDate(project.created_at ?? project.createdAt) }}</span>
        </div>

        <p
          v-if="project.description"
          class="mt-6 max-w-2xl text-base leading-relaxed whitespace-pre-line text-neutral-600"
        >
          {{ project.description }}
        </p>

        <div class="mt-10 border-t border-neutral-200 pt-6">
          <RouterLink
            to="/projects"
            class="text-sm font-medium text-sky-700 transition-colors hover:text-sky-800 hover:underline"
          >
            ← Lihat project lainnya
          </RouterLink>
        </div>
      </motion.div>
    </article>
  </div>
</template>