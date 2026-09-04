<!-- src/layouts/DefaultLayout.vue — Public-facing layout with Navbar + Footer. -->
<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
    <Navbar />
    <!-- Page content rendered by <RouterView /> -->
    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>
