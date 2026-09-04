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
const experiences = computed(() => {
  return [...(experiencesRef.value ?? [])].sort((a, b) => {
    const aCurrent = Number(Boolean(a.is_current))
    const bCurrent = Number(Boolean(b.is_current))

    if (aCurrent !== bCurrent) {
      return bCurrent - aCurrent
    }

    const aEnd = a.is_current
      ? Number.MAX_SAFE_INTEGER
      : new Date(a.end_date || a.start_date).getTime()
    const bEnd = b.is_current
      ? Number.MAX_SAFE_INTEGER
      : new Date(b.end_date || b.start_date).getTime()

    if (aEnd !== bEnd) {
      return bEnd - aEnd
    }

    const aStart = new Date(a.start_date).getTime()
    const bStart = new Date(b.start_date).getTime()
    return bStart - aStart
  })
})

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
      <p class="mt-4 text-sm font-semibold tracking-widest text-neutral-400 uppercase dark:text-neutral-500">Roadmap</p>
      <div class="mt-2">
        <h1 class="text-3xl font-bold text-neutral-900 sm:text-4xl dark:text-neutral-100">Experience</h1>
        <p class="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-500 sm:text-base dark:text-neutral-400">
          Jejak perjalanan profesional yang membentuk cara saya berpikir dalam membangun produk,
          bekerja sama dengan tim, dan menyelesaikan masalah dengan pendekatan yang manusiawi.
        </p>
      </div>
    </motion.div>

    <div v-if="loading" class="mt-10 space-y-6">
      <div
        v-for="n in 3"
        :key="n"
        class="animate-pulse rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800"
      >
        <div class="h-5 w-40 rounded bg-neutral-100 dark:bg-neutral-700"></div>
        <div class="mt-3 h-4 w-64 rounded bg-neutral-100 dark:bg-neutral-700"></div>
        <div class="mt-5 h-3 w-full rounded bg-neutral-100 dark:bg-neutral-700"></div>
        <div class="mt-2 h-3 w-5/6 rounded bg-neutral-100 dark:bg-neutral-700"></div>
      </div>
    </div>

    <div
      v-if="error"
      class="mt-10 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-5 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
    >
      <AlertCircle :size="20" class="mt-0.5 shrink-0" />
      <div>
        <p class="text-sm font-medium">Gagal memuat experience</p>
        <p class="mt-1 text-sm text-red-600/80">{{ error }}</p>
      </div>
    </div>

    <motion.div
      v-if="!loading && !error && experiences.length"
      class="mt-10"
      v-bind="staggerContainer(0.08)"
    >
      <div
        class="relative space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[1.15rem] before:w-px before:bg-linear-to-b before:from-sky-200 before:via-sky-100 before:to-neutral-200 md:before:left-[2.15rem] dark:before:from-sky-800 dark:before:via-sky-900 dark:before:to-neutral-800"
      >
        <motion.article
          v-for="experience in experiences"
          :key="experience.id"
          v-bind="staggerItem"
          class="group relative pl-10 md:pl-16"
        >
          <div
            class="absolute left-0 top-7 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-sky-500 shadow-[0_0_0_4px_rgba(14,165,233,0.12)] md:left-0 md:h-10 md:w-10 dark:border-slate-950"
          >
            <BriefcaseBusiness :size="16" class="text-white" />
          </div>

          <div
            class="overflow-hidden rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-xl sm:p-6 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-sky-800"
          >
            <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div class="flex items-start gap-4">
                <div
                  v-if="experience.logo_url"
                  class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <img
                    :src="experience.logo_url"
                    :alt="experience.company"
                    class="h-full w-full object-cover"
                  />
                </div>
                <div
                  v-else
                  class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-lg font-bold text-sky-700 dark:bg-sky-900/40 dark:text-sky-400"
                >
                  {{ experience.company.charAt(0).toUpperCase() }}
                </div>

                <div>
                  <span
                    class="inline-flex items-center rounded-full border border-sky-100 bg-sky-50 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-sky-700 uppercase dark:border-sky-800 dark:bg-sky-900/40 dark:text-sky-400"
                  >
                    {{ experience.position }}
                  </span>
                  <h2 class="mt-3 text-2xl font-bold text-neutral-900 dark:text-neutral-100">{{ experience.company }}</h2>
                </div>
              </div>

              <div
                class="inline-flex items-center gap-2 self-start rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
              >
                <CalendarRange :size="14" class="text-sky-600" />
                {{
                  formatPeriod(experience.start_date, experience.end_date, experience.is_current)
                }}
              </div>
            </div>

            <p
              v-if="experience.description"
              class="mt-5 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-400"
            >
              {{ experience.description }}
            </p>
          </div>
        </motion.article>
      </div>
    </motion.div>

    <div
      v-else-if="!loading && !error && !experiences.length"
      class="mt-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-16 text-center dark:border-neutral-700"
    >
      <BriefcaseBusiness :size="32" class="text-neutral-300 dark:text-neutral-600" />
      <p class="mt-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
        Belum ada experience untuk ditampilkan.
      </p>
    </div>
  </div>
</template>
