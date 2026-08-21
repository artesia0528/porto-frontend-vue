<!-- src/pages/ProjectDetail.vue — Single project detail page. -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFetch } from '@/composables/useFetch'
import { getProjects } from '@/services/projects'
import type { Project } from '@/types'

const route = useRoute()
const router = useRouter()
const projectId = String(route.params.id ?? '')

const { data: projects, loading, error, run } = useFetch<Project[]>(getProjects)

const project = computed(() => {
  if (!projects.value) return null
  return projects.value.find((item) => String(item.id) === projectId) ?? null
})

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
        v-if="project.image_url"
        :src="project.image_url"
        :alt="project.title"
        class="h-64 w-full rounded object-cover"
      />
      <h1 class="text-3xl font-bold text-slate-900">{{ project.title }}</h1>
      <p v-if="project.description" class="text-slate-600">{{ project.description }}</p>
      <p v-if="project.created_at || project.createdAt" class="text-sm text-slate-400">
        Created: {{ new Date(project.created_at ?? project.createdAt ?? Date.now()).toLocaleDateString() }}
      </p>
    </article>
  </div>
</template>
