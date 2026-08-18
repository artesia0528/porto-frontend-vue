<!-- src/layouts/AdminLayout.vue — Admin dashboard layout with sidebar navigation. -->
<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.clearAuth()
  router.push({ name: 'AdminLogin' })
}

const sidebarLinks = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/blogs', label: 'Blogs' },
  { to: '/admin/experiences', label: 'Experiences' },
  { to: '/admin/messages', label: 'Messages' },
]
</script>

<template>
  <div class="flex min-h-screen bg-slate-50">
    <aside class="flex w-60 flex-col border-r border-slate-200 bg-white">
      <div class="border-b border-slate-200 px-4 py-4">
        <RouterLink to="/admin/dashboard" class="text-lg font-bold text-indigo-600">
          Admin Panel
        </RouterLink>
      </div>
      <nav class="flex-1 space-y-1 p-3" aria-label="Admin navigation">
        <RouterLink
          v-for="link in sidebarLinks"
          :key="link.to"
          :to="link.to"
          class="block rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
          active-class="bg-indigo-50 font-medium text-indigo-700"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
      <div class="border-t border-slate-200 p-3">
        <button
          class="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          @click="handleLogout"
        >
          Logout
        </button>
      </div>
    </aside>

    <main class="flex-1 p-6">
      <RouterView />
    </main>
  </div>
</template>
