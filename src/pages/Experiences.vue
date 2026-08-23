// File: src/pages/Experiences.vue // Public experiences list page using `getExperiences()` service.

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { motion } from 'motion-v'
import { useFetch } from '@/composables/useFetch'
import { getExperiences } from '@/services/experiences'
import type { Experience } from '@/types'
import { AlertCircle, BriefcaseBusiness, CalendarRange } from '@lucide/vue'
import { fadeUpSection, staggerContainer, staggerItem } from '@/motion/variants'

const { data: experiencesRef, error, loading, run } = useFetch<Experience[]>(getExperiences)
const experiences = computed(() => experiencesRef.value ?? [])

function formatPeriod(start?: string, end?: string, current = false) {
  if (!start) return 'Waktu tidak tersedia'

  const startLabel = new Date(start).toLocaleDateString('id-ID', {
    month: 'short',
    year: 'numeric',
  })

  if (current) return `${startLabel} — Sekarang`
  if (!end) return `${startLabel} — Saat ini`

  const endLabel = new Date(end).toLocaleDateString('id-ID', {
    month: 'short',
    year: 'numeric',
  })

  return `${startLabel} — ${endLabel}`
}

onMounted(() => void run())
</script>

<template>
  <div class="mx-auto max-w-6xl pt-28 pb-20">
    <motion.div v-bind="fadeUpSection">
      <div class="h-1 w-16 rounded bg-sky-600"></div>
      <p class="mt-4 text-sm font-semibold tracking-widest text-neutral-400 uppercase">Roadmap</p>
      <div class="mt-2">
        <h1 class="text-3xl font-bold text-neutral-900 sm:text-4xl">Experience</h1>
        <p class="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-500 sm:text-base">
          Jejak perjalanan profesional yang membentuk cara saya berpikir dalam membangun produk,
          bekerja sama dengan tim, dan menyelesaikan masalah dengan pendekatan yang manusiawi.
        </p>
      </div>
    </motion.div>

    <div v-if="loading" class="mt-10 space-y-6">
      <div
        v-for="n in 3"
        :key="n"
        class="animate-pulse rounded-2xl border border-neutral-200 bg-white p-6"
      >
        <div class="h-5 w-40 rounded bg-neutral-100"></div>
        <div class="mt-3 h-4 w-64 rounded bg-neutral-100"></div>
        <div class="mt-5 h-3 w-full rounded bg-neutral-100"></div>
        <div class="mt-2 h-3 w-5/6 rounded bg-neutral-100"></div>
      </div>
    </div>

    <div
      v-if="error"
      class="mt-10 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-5 text-red-700"
    >
      <AlertCircle :size="20" class="mt-0.5 shrink-0" />
      <div>
        <p class="text-sm font-medium">Gagal memuat experience</p>
        <p class="mt-1 text-sm text-red-600/80">{{ error }}</p>
      </div>
    </div>

    <motion.div
      v-if="!loading && !error && experiences.length"
      class="mt-10 space-y-6"
      v-bind="staggerContainer(0.08)"
    >
      <motion.article
        v-for="experience in experiences"
        :key="experience.id"
        v-bind="staggerItem"
        class="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl"
      >
        <div
          class="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-sky-500 via-cyan-400 to-transparent"
        ></div>

        <div class="ml-4 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div class="flex items-start gap-4">
            <div
              v-if="experience.logo_url"
              class="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50"
            >
              <img
                :src="experience.logo_url"
                :alt="experience.company"
                class="h-full w-full object-cover"
              />
            </div>
            <div
              v-else
              class="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-lg font-bold text-sky-700"
            >
              {{ experience.company.charAt(0).toUpperCase() }}
            </div>

            <div>
              <div class="flex items-center gap-2 text-sm font-medium text-sky-700">
                <BriefcaseBusiness :size="15" />
                <span>{{ experience.position }}</span>
              </div>
              <h2 class="mt-2 text-2xl font-bold text-neutral-900">{{ experience.company }}</h2>
            </div>
          </div>

          <div
            class="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-500 md:mt-1"
          >
            <CalendarRange :size="14" />
            {{ formatPeriod(experience.start_date, experience.end_date, experience.is_current) }}
          </div>
        </div>

        <p
          v-if="experience.description"
          class="ml-4 mt-5 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base"
        >
          {{ experience.description }}
        </p>
      </motion.article>
    </motion.div>

    <div
      v-else-if="!loading && !error && !experiences.length"
      class="mt-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-16 text-center"
    >
      <BriefcaseBusiness :size="32" class="text-neutral-300" />
      <p class="mt-4 text-sm font-medium text-neutral-600">
        Belum ada experience untuk ditampilkan.
      </p>
    </div>
  </div>
</template>
