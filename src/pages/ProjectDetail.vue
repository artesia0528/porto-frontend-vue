<!-- src/pages/ProjectDetail.vue — Single project detail page. -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFetch } from '@/composables/useFetch'
import { getProject } from '@/services/projects'
import type { Project } from '@/types'

const route = useRoute()
const router = useRouter()
const projectId = route.params.id as string

const { data: project, loading, error, run } = useFetch<Project>(() => getProject(projectId))

onMounted(() => void run())
</script>

<template>
  <div>
    <button class="mb-6 text-sm text-indigo-600 hover:text-indigo-800" @click="router.back()">
      &larr; Back
    </button>

    <p v-if="loading" class="text-slate-400">Loading...</p>
    <p v-if="error" class="text-red-500">{{ error }}</p>

    <article v-if="project" class="space-y-4">
      <img
        v-if="project.image"
        :src="project.image"
        :alt="project.title"
        class="h-64 w-full rounded object-cover"
      />
      <h1 class="text-3xl font-bold text-slate-900">{{ project.title }}</h1>
      <p v-if="project.description" class="text-slate-600">{{ project.description }}</p>
      <p v-if="project.createdAt" class="text-sm text-slate-400">
        Created: {{ new Date(project.createdAt).toLocaleDateString() }}
      </p>
      <a
        v-if="project.url"
        :href="project.url"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-block rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
      >
        Visit Project &rarr;
      </a>
    </article>
  </div>
</template>
