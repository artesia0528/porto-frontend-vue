<!-- src/components/Card.vue — Reusable content card for projects/blogs/experiences. -->
<script setup lang="ts">
import { motion } from 'motion-v'
import { ArrowUpRight } from '@lucide/vue'
import { hoverLiftY } from '@/motion/variants'

withDefaults(
  defineProps<{
    title: string
    description?: string
    image?: string
    /** Small chip shown over the image, e.g. "Web App", "Tutorial", "2024" */
    tag?: string
  }>(),
  {
    description: undefined,
    image: undefined,
    tag: undefined,
  },
)
</script>

<template>
  <motion.article
    class="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm ring-1 ring-transparent transition-shadow duration-300 hover:shadow-xl hover:ring-sky-100 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:ring-sky-900"
    v-bind="hoverLiftY"
  >
    <!-- Media -->
    <div class="relative aspect-16/10 w-full shrink-0 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
      <img
        v-if="image"
        :src="image"
        :alt="title"
        class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
      />
      <!-- Fallback when no image: initial-based placeholder, not a blank box -->
      <div
        v-else
        class="flex h-full w-full items-center justify-center bg-linear-to-br from-sky-50 to-neutral-100 text-3xl font-bold text-sky-200 dark:from-sky-900/30 dark:to-neutral-800 dark:text-sky-800"
      >
        {{ title.charAt(0).toUpperCase() }}
      </div>

      <!-- Soft gradient so a tag chip stays legible over any image -->
      <div
        v-if="tag"
        class="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-black/40 to-transparent"
      />
      <span
        v-if="tag"
        class="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-sky-700 backdrop-blur-sm dark:bg-neutral-900/90 dark:text-sky-400"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Content -->
    <div class="flex flex-1 flex-col p-5">
      <h3 class="text-base font-semibold text-neutral-900 transition-colors group-hover:text-sky-700 dark:text-neutral-100 dark:group-hover:text-sky-400">
        {{ title }}
      </h3>
      <p
        v-if="description"
        class="mt-1.5 flex-1 text-sm leading-relaxed text-neutral-500 line-clamp-2 dark:text-neutral-400"
      >
        {{ description }}
      </p>

      <slot />

      <!-- Affordance: signals the card is interactive, echoes the site's sky accent -->
      <div
        class="mt-4 flex items-center gap-1 text-sm font-medium text-neutral-400 transition-colors group-hover:text-sky-700 dark:text-neutral-500 dark:group-hover:text-sky-400"
      >
        <span class="translate-x-0 transition-transform duration-300 group-hover:translate-x-0.5">
          Lihat detail
        </span>
        <ArrowUpRight
          :size="15"
          class="translate-x-0 translate-y-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>
    </div>
  </motion.article>
</template>