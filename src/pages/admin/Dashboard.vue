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
const unreadMessageCount = computed(
  () =>
    (messages.value ?? []).filter((message) => !(message.read ?? message.is_read ?? false)).length,
)

function getDateValue(item: { created_at?: string; createdAt?: string; updated_at?: string }) {
  const value = item.updated_at ?? item.created_at ?? item.createdAt ?? ''
  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? 0 : date.getTime()
}

const recentProjects = computed(() =>
  [...(projects.value ?? [])].sort((a, b) => getDateValue(b) - getDateValue(a)).slice(0, 3),
)

const recentBlogs = computed(() =>
  [...(blogs.value ?? [])].sort((a, b) => getDateValue(b) - getDateValue(a)).slice(0, 3),
)

const recentMessages = computed(() =>
  [...(messages.value ?? [])].sort((a, b) => getDateValue(b) - getDateValue(a)).slice(0, 3),
)

const latestExperience = computed(() => {
  const list = [...(experiences.value ?? [])].sort((a, b) => getDateValue(b) - getDateValue(a))
  return list[0] ?? null
})

onMounted(() => {
  fetchProjects()
  fetchMessages()
  fetchBlogs()
  fetchExperiences()
})

function formatDate(value?: string) {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}
</script>

<template>
  <div class="space-y-6">
    <header
      class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-linear-to-r from-indigo-600 to-blue-500 p-6 text-white shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-700"
    >
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-100">Overview</p>
        <h1 class="mt-2 text-3xl font-bold">Dashboard</h1>
      </div>
      <div class="rounded-xl bg-white/10 px-4 py-2 text-sm text-indigo-50 backdrop-blur-sm">
        {{ projectCount }} projects • {{ blogCount }} posts • {{ experienceCount }} experiences
      </div>
    </header>

    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div class="flex items-center justify-between">
          <p class="text-sm text-slate-500 dark:text-slate-400">Projects</p>
          <span class="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400"
            >Live</span
          >
        </div>
        <p class="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100">{{ projectCount }}</p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div class="flex items-center justify-between">
          <p class="text-sm text-slate-500 dark:text-slate-400">Blogs</p>
          <span class="rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-400"
            >Posts</span
          >
        </div>
        <p class="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100">{{ blogCount }}</p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div class="flex items-center justify-between">
          <p class="text-sm text-slate-500 dark:text-slate-400">Experiences</p>
          <span class="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/50 dark:text-amber-400"
            >Career</span
          >
        </div>
        <p class="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100">{{ experienceCount }}</p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div class="flex items-center justify-between">
          <p class="text-sm text-slate-500 dark:text-slate-400">Messages</p>
          <span class="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-900/50 dark:text-rose-400"
            >Unread</span
          >
        </div>
        <p class="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100">{{ unreadMessageCount }}</p>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">of {{ messageCount }} total</p>
      </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Recent projects</h2>
          <RouterLink
            to="/admin/projects"
            class="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            View all
          </RouterLink>
        </div>

        <div v-if="recentProjects.length" class="space-y-3">
          <div
            v-for="project in recentProjects"
            :key="project.id"
            class="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-700 dark:bg-slate-800"
          >
            <div>
              <p class="font-medium text-slate-800 dark:text-slate-200">{{ project.title }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                {{ formatDate(project.created_at ?? project.createdAt) }}
              </p>
            </div>
            <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Project</span>
          </div>
        </div>

        <div
          v-else
          class="rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
        >
          Belum ada project yang dibuat.
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Latest experience</h2>
        </div>

        <div
          v-if="latestExperience"
          class="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800"
        >
          <p class="text-sm text-slate-500 dark:text-slate-400">Current / latest</p>
          <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100">{{ latestExperience.position }}</h3>
          <p class="text-sm font-medium text-indigo-600 dark:text-indigo-400">{{ latestExperience.company }}</p>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            {{ formatDate(latestExperience.start_date) }} —
            {{ latestExperience.is_current ? 'Present' : formatDate(latestExperience.end_date) }}
          </p>
        </div>

        <div
          v-else
          class="rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
        >
          Belum ada pengalaman kerja.
        </div>
      </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-2">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Recent blogs</h2>
          <RouterLink
            to="/admin/blogs"
            class="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            View all
          </RouterLink>
        </div>

        <div v-if="recentBlogs.length" class="space-y-3">
          <div
            v-for="blog in recentBlogs"
            :key="blog.id"
            class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-700 dark:bg-slate-800"
          >
            <p class="font-medium text-slate-800 dark:text-slate-200">{{ blog.title }}</p>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ formatDate(blog.created_at) }}</p>
          </div>
        </div>

        <div
          v-else
          class="rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
        >
          Belum ada blog yang dipublish.
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Latest messages</h2>
          <RouterLink
            to="/admin/messages"
            class="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            View all
          </RouterLink>
        </div>

        <div v-if="recentMessages.length" class="space-y-3">
          <div
            v-for="message in recentMessages"
            :key="message.id"
            class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-700 dark:bg-slate-800"
          >
            <div class="flex items-center justify-between gap-3">
              <p class="font-medium text-slate-800 dark:text-slate-200">{{ message.name }}</p>
              <span
                v-if="!(message.read ?? message.is_read ?? false)"
                class="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-900/50 dark:text-amber-400"
              >
                Unread
              </span>
            </div>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ message.subject || 'No subject' }}</p>
            <p class="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
              {{ message.content || message.body || 'No message content' }}
            </p>
          </div>
        </div>

        <div
          v-else
          class="rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
        >
          Belum ada pesan masuk.
        </div>
      </div>
    </section>
  </div>
</template>
