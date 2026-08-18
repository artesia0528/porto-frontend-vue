<!-- src/pages/admin/Dashboard.vue — Admin dashboard with summary counts. -->
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useFetch } from '@/composables/useFetch'
import { getProjects } from '@/services/projects'
import { getMessages } from '@/services/messages'
import { getBlogs } from '@/services/blogs'
import { getExperiences } from '@/services/experiences'
import type { Project, Message, Blog, Experience } from '@/types'

const { data: projects, run: fetchProjects } = useFetch<Project[]>(getProjects)
const { data: messages, run: fetchMessages } = useFetch<Message[]>(getMessages)
const { data: blogs, run: fetchBlogs } = useFetch<Blog[]>(getBlogs)
const { data: experiences, run: fetchExperiences } = useFetch<Experience[]>(getExperiences)

const projectCount = computed(() => projects.value?.length ?? 0)
const messageCount = computed(() => messages.value?.length ?? 0)
const blogCount = computed(() => blogs.value?.length ?? 0)
const experienceCount = computed(() => experiences.value?.length ?? 0)

onMounted(() => {
  fetchProjects()
  fetchMessages()
  fetchBlogs()
  fetchExperiences()
})
</script>

<template>
  <div>
    <h1 class="mb-6 text-2xl font-bold text-slate-900">Dashboard</h1>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Projects</p>
        <p class="mt-1 text-3xl font-bold text-indigo-600">{{ projectCount }}</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Messages</p>
        <p class="mt-1 text-3xl font-bold text-indigo-600">{{ messageCount }}</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Blogs</p>
        <p class="mt-1 text-3xl font-bold text-indigo-600">{{ blogCount }}</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Experiences</p>
        <p class="mt-1 text-3xl font-bold text-indigo-600">{{ experienceCount }}</p>
      </div>
    </div>
  </div>
</template>
