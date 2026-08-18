<!-- src/pages/Home.vue — Public homepage showing a project preview grid. -->
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
    <section class="mb-12 text-center">
      <h1 class="text-4xl font-bold text-slate-900">Welcome to My Portfolio</h1>
      <p class="mt-3 text-lg text-slate-500">
        I'm a passionate developer creating innovative solutions.
      </p>
    </section>

    <!-- Loading state -->
    <p v-if="loading" class="text-center text-slate-400">Loading projects…</p>

    <!-- Error state -->
    <p v-if="error" class="text-center text-red-500">{{ error }}</p>

    <!-- Project cards grid -->
    <div v-if="projects.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Card
        v-for="project in projects"
        :key="project.id"
        :title="project.title"
        :description="project.description"
        :image="project.image"
      />
    </div>
  </div>
</template>
