// File: src/pages/admin/Login.vue // Admin login form that calls `useAuthStore().login()` and
redirects on success.

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
    <div
      class="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/70 lg:grid-cols-[1.1fr_0.9fr]"
    >
      <div
        class="relative hidden bg-slate-900 p-10 text-white lg:flex lg:flex-col lg:justify-between"
      >
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.38),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.24),transparent_40%)]"
        />
        <div class="relative z-10">
          <div
            class="mb-8 inline-flex rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200"
          >
            Portfolio Admin
          </div>
          <h1 class="max-w-sm text-4xl font-bold leading-tight">
            Kelola portfolio Anda dengan cepat.
          </h1>
          <p class="mt-4 max-w-md text-sm leading-6 text-slate-300">
            Update project, blog, pengalaman kerja, dan pesan dari klien dari satu tempat.
          </p>
        </div>

        <div class="relative z-10 space-y-3 text-sm text-slate-200">
          <div class="flex items-center gap-3">
            <span class="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            Konten lebih cepat terupdate
          </div>
          <div class="flex items-center gap-3">
            <span class="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
            Keputusan lebih cepat dengan dashboard
          </div>
          <div class="flex items-center gap-3">
            <span class="inline-flex h-2.5 w-2.5 rounded-full bg-violet-400" />
            Semua komunikasi dalam satu panel
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center p-6 sm:p-10">
        <div class="w-full max-w-md">
          <div class="mb-8 text-center lg:text-left">
            <p class="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">
              Welcome back
            </p>
            <h2 class="mt-3 text-3xl font-bold text-slate-900">Sign in</h2>
          </div>

          <form @submit.prevent="onSubmit" class="space-y-5">
            <div class="space-y-4">
              <BaseInput v-model="username" label="Username" />
              <BaseInput v-model="password" label="Password" type="password" />
            </div>

            <div
              v-if="error"
              class="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
            >
              {{ error }}
            </div>

            <BaseButton
              :loading="loading"
              type="submit"
              class="w-full rounded-xl py-3 font-semibold"
            >
              Login
            </BaseButton>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const username = ref<string>('')
const password = ref<string>('')
const loading = ref<boolean>(false)
const error = ref<string | null>(null)

async function onSubmit(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    await auth.login({ username: username.value, password: password.value })
    await router.replace({ name: 'AdminDashboard' }).catch(() => {})
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped></style>
