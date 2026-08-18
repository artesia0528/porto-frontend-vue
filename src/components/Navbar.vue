<!-- src/components/Navbar.vue — Top navigation with admin actions. -->
<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const isLoggedIn = computed(() => !!auth.token)

function goToLogin(): void {
  router.push({ name: 'AdminLogin' }).catch(() => {})
}

function logout(): void {
  auth.clearAuth()
  router.push({ name: 'Home' }).catch(() => {})
}
</script>

<template>
  <nav class="bg-white border-b">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <div class="flex items-center justify-between w-full">
        <RouterLink to="/" class="text-lg font-bold">I Komang Krisna Aditya Kusuma</RouterLink>
        <div class="flex items-center space-x-4">
          <RouterLink to="/projects" class="text-sm">Projects</RouterLink>
          <RouterLink to="/blogs" class="text-sm">Blogs</RouterLink>
          <RouterLink to="/experiences" class="text-sm">Experiences</RouterLink>
          <RouterLink to="/contact" class="text-sm">Contact</RouterLink>
        </div>
      </div>
      <div>
        <!-- <button v-if="!isLoggedIn" class="text-sm" @click="goToLogin">Admin Login</button> -->
        <!-- <button v-else class="text-sm" @click="logout">Logout</button> -->
      </div>
    </div>
  </nav>
</template>
