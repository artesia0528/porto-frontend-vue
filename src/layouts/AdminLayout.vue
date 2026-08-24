<!-- src/layouts/AdminLayout.vue — Admin dashboard layout with sidebar navigation. -->
<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import {
  BriefcaseBusiness,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  NotebookText,
} from '@lucide/vue'
import BaseButton from '@/components/BaseButton.vue'
import Modal from '@/components/Modal.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const logoutModalOpen = ref(false)

const sidebarLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/blogs', label: 'Blogs', icon: NotebookText },
  { to: '/admin/experiences', label: 'Experiences', icon: BriefcaseBusiness },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquareText },
]

function openLogoutConfirm() {
  logoutModalOpen.value = true
}

function confirmLogout() {
  auth.clearAuth()
  logoutModalOpen.value = false
  router.push({ name: 'AdminLogin' })
}
</script>

<template>
  <div class="flex min-h-screen bg-slate-100">
    <aside class="flex w-72 flex-col border-r border-slate-800 bg-slate-950 text-slate-200">
      <div class="border-b border-slate-800 px-5 py-5">
        <RouterLink to="/admin/dashboard" class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 ring-1 ring-inset ring-indigo-400/30"
          >
            <LayoutDashboard :size="20" />
          </div>
          <div>
            <p class="text-[10px] uppercase tracking-[0.25em] text-slate-400">Admin</p>
            <p class="text-lg font-bold text-white">Portfolio</p>
          </div>
        </RouterLink>
      </div>

      <nav class="flex-1 space-y-2 p-4" aria-label="Admin navigation">
        <RouterLink
          v-for="link in sidebarLinks"
          :key="link.to"
          :to="link.to"
          class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
          active-class="bg-indigo-500/15 text-white ring-1 ring-inset ring-indigo-400/30"
        >
          <component
            :is="link.icon"
            :size="18"
            class="text-slate-400 group-[.router-link-active]:text-indigo-300"
          />
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="border-t border-slate-800 p-4">
        <button
          type="button"
          class="flex w-full items-center justify-between rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-left text-sm font-medium text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
          @click="openLogoutConfirm"
        >
          <span class="flex items-center gap-2">
            <LogOut :size="16" />
            Logout
          </span>
        </button>
      </div>
    </aside>

    <main class="w-full p-5">
      <div class="mx-auto">
        <RouterView />
      </div>
    </main>
  </div>

  <Modal :open="logoutModalOpen" @close="logoutModalOpen = false">
    <div class="space-y-5">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">Confirm</p>
        <h2 class="mt-2 text-2xl font-bold text-slate-900">Logout from admin panel?</h2>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        You will be signed out and redirected to the login page. You can sign in again anytime.
      </div>

      <div class="flex justify-end gap-3 border-t border-slate-200 pt-4">
        <BaseButton variant="secondary" @click="logoutModalOpen = false">Cancel</BaseButton>
        <BaseButton variant="danger" @click="confirmLogout">Logout</BaseButton>
      </div>
    </div>
  </Modal>
</template>
