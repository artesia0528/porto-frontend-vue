// File: src/pages/admin/Login.vue // Admin login form that calls `useAuthStore().login()` and
redirects on success.

<template>
  <section class="max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-4">Admin Login</h1>
    <form @submit.prevent="onSubmit" class="space-y-3">
      <BaseInput v-model="username" label="Username" />
      <BaseInput v-model="password" label="Password" type="password" />
      <BaseButton :loading="loading" type="submit">Login</BaseButton>
      <p v-if="error" class="text-red-600">{{ error }}</p>
    </form>
  </section>
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
