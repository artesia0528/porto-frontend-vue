// File: src/components/Footer.vue // Simple footer component.

<template>
  <footer class="bg-gray-50 border-t mt-8 py-6">
    <div class="max-w-6xl mx-auto px-4 text-center text-sm text-gray-600">
      © {{ year }} My Portfolio — Built with Vue 3 + TypeScript
    </div>
  </footer>
</template>

<script setup lang="ts">
// File: src/components/Footer.vue - Site footer
const year = new Date().getFullYear()
</script>

<style scoped></style>
