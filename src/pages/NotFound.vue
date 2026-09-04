<!-- src/pages/NotFound.vue — 404 catch-all page. -->
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 text-center">
    <h1 class="text-6xl font-bold text-slate-900 dark:text-slate-100">404</h1>
    <p class="mt-4 text-lg text-slate-500 dark:text-slate-400">Page not found.</p>
    <button
      class="mt-6 rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
      @click="router.push('/')"
    >
      Go Home
    </button>
  </div>
</template>
