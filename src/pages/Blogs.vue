// File: src/pages/Blogs.vue // Public blogs list page using `getBlogs()` service.

<template>
  <section>
    <h1 class="text-2xl font-bold mb-4">Blogs</h1>
    <div v-if="loading">Loading…</div>
    <div v-if="error" class="text-red-600">{{ error }}</div>
    <div class="space-y-4">
      <article v-for="b in blogs" :key="b.id" class="border rounded p-4">
        <h3 class="font-semibold">{{ b.title }}</h3>
        <p class="text-sm text-gray-600">{{ b.excerpt }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useFetch } from '@/composables/useFetch'
import { getBlogs } from '@/services/blogs'
import type { Blog } from '@/types'

const { data: blogsRef, error, loading, run } = useFetch<Blog[]>(getBlogs)
const blogs = computed(() => blogsRef.value ?? [])
onMounted(() => void run())
</script>

<style scoped></style>
