// File: src/pages/Experiences.vue // Public experiences list page using `getExperiences()` service.

<template>
  <section>
    <h1 class="text-2xl font-bold mb-4">Experiences</h1>
    <div v-if="loading">Loading…</div>
    <div v-if="error" class="text-red-600">{{ error }}</div>
    <ul class="space-y-3">
      <li v-for="e in experiences" :key="e.id" class="border rounded p-3">
        <strong>{{ e.role }}</strong> — {{ e.company }}
        <p class="text-sm text-gray-600">{{ e.description }}</p>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useFetch } from '@/composables/useFetch'
import { getExperiences } from '@/services/experiences'
import type { Experience } from '@/types'

const { data: experiencesRef, error, loading, run } = useFetch<Experience[]>(getExperiences)
const experiences = computed(() => experiencesRef.value ?? [])
onMounted(() => void run())
</script>

<style scoped></style>
