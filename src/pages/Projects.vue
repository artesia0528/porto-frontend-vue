<!-- src/pages/Projects.vue — Public projects listing using DataTable or Card. -->
<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useFetch } from '@/composables/useFetch'
import { getProjects } from '@/services/projects'
import Card from '@/components/Card.vue'
import type { Project } from '@/types'

const { data: projectsRef, loading, error, run } = useFetch<Project[]>(getProjects)
const projects = computed(() => projectsRef.value ?? [])

onMounted(() => void run())
</script>

<template>
  <div>
    <h1 class="mb-6 text-3xl font-bold text-slate-900">Projects</h1>

    <p v-if="loading" class="text-slate-400">Loading…</p>
    <p v-if="error" class="text-red-500">{{ error }}</p>

    <div v-if="projects.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <RouterLink
        v-for="project in projects"
        :key="project.id"
        :to="`/projects/${project.id}`"
        class="block no-underline"
      >
        <Card
          :title="project.title"
          :description="project.description"
          :image="project.image_url"
        />
      </RouterLink>
    </div>
  </div>
</template>
