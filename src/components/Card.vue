<!-- src/components/Card.vue — Reusable content card for projects/blogs/experiences. -->
<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description?: string
    image?: string
  }>(),
  {
    description: undefined,
    image: undefined,
  },
)
</script>

<template>
  <article class="overflow-hidden rounded border shadow-sm transition-shadow hover:shadow-md">
    <img v-if="image" :src="image" :alt="title" class="h-40 w-full object-cover" />
    <div class="p-4">
      <h3 class="text-lg font-semibold">{{ title }}</h3>
      <p v-if="description" class="mt-1 text-sm text-gray-600">{{ description }}</p>
      <slot />
    </div>
  </article>
</template>
