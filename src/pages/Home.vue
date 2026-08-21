<!-- src/pages/Home.vue — Public homepage showing a project preview grid. -->
<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useFetch } from '@/composables/useFetch'
import { getProjects } from '@/services/projects'
import Card from '@/components/Card.vue'
import type { Project } from '@/types'
import { Icon } from '@iconify/vue'
import { Mail } from '@lucide/vue'

const { data: projectsRef, loading, error, run } = useFetch<Project[]>(getProjects)

// Batasi hanya menampilkan 4 project unggulan di homepage
const projects = computed(() => {
  const val = projectsRef.value
  if (Array.isArray(val)) return val.slice(0, 4)
  if (val && Array.isArray((val as any).data)) return (val as any).data.slice(0, 4)
  return []
})

// Group tech stack into categories for easier scanning
const techStack = {
  Frontend: ['Vue.js', 'React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'JavaScript'],
  Backend: ['Node.js', 'Golang', 'Gin', 'REST API', 'PostgreSQL', 'SQL'],
  Tools: ['Git', 'GitHub', 'Docker', 'Linux', 'Postman', 'Figma'],
}

onMounted(() => void run())
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section
      class="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-10 py-16 text-center md:flex-row md:gap-16 md:text-left"
    >
      <img
        src="/profile.webp"
        alt="I Komang Krisna Aditya Kusuma"
        width="192"
        height="192"
        fetchpriority="high"
        loading="eager"
        class="h-40 w-40 shrink-0 rounded-full object-cover ring-4 ring-neutral-200 sm:h-48 sm:w-48 md:h-56 md:w-56"
      />
      <div class="max-w-xl">
        <p class="text-sm font-semibold tracking-widest text-sky-700 uppercase">
          Software Developer
        </p>
        <h1 class="mt-3 text-4xl leading-tight font-bold text-neutral-900 sm:text-5xl md:text-6xl">
          I Komang Krisna
          <span class="block text-sky-700">Aditya Kusuma</span>
        </h1>
        <p
          class="mx-auto mt-5 max-w-lg text-base leading-relaxed text-neutral-500 sm:text-lg md:mx-0"
        >
          Saya membangun aplikasi web modern, fungsional, dan mudah digunakan dengan fokus pada
          pengalaman pengguna yang baik.
        </p>

        <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
          <RouterLink
            to="/projects"
            class="rounded-md bg-sky-700 px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105 hover:bg-sky-800"
          >
            Lihat Projects
          </RouterLink>
          <RouterLink
            to="/contact"
            class="rounded-md border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
          >
            Hubungi Saya
          </RouterLink>
          <a
            href="/resume.pdf"
            class="rounded-md border border-sky-700 px-6 py-3 text-sm font-medium text-sky-700 transition-colors hover:bg-sky-50"
            download
          >
            Download CV
          </a>
        </div>

        <!-- Social links (inline SVG icons for lightweight polish) -->
        <div class="mt-8 flex justify-center gap-5 md:justify-start">
          <a
            href="https://github.com/artesia0528"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            class="text-neutral-400 transition-colors hover:text-neutral-900"
          >
            <Icon icon="simple-icons:github" width="24" height="24" color="#181717" />
          </a>
          <a
            href="https://linkedin.com/in/i-komang-krisna-aditya-kusuma"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            class="text-neutral-400 transition-colors hover:text-neutral-900"
          >
            <Icon icon="simple-icons:linkedin" width="24" height="24" color="#0077b5" />
          </a>
          <a
            href="mailto:ditya0528@gmail.com"
            aria-label="Email"
            class="text-neutral-400 transition-colors hover:text-neutral-900"
          >
            <Mail height="24" width="24" color="#181717" />
          </a>
        </div>
      </div>

      <!-- Scroll cue -->
      <div
        class="absolute bottom-8 left-1/2 hidden -translate-x-1/2 animate-bounce text-neutral-300 md:block"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>

    <!-- About Section -->
    <section class="flex min-h-[85dvh] flex-col justify-center border-t border-neutral-200 py-20">
      <div class="h-1 w-16 rounded bg-sky-600"></div>
      <p class="mt-4 text-sm font-semibold tracking-widest text-neutral-400 uppercase">Profil</p>
      <h2 class="mt-2 text-2xl font-bold text-neutral-900 sm:text-3xl">Tentang Saya</h2>
      <p class="mt-5 max-w-3xl text-base leading-relaxed text-neutral-500 sm:text-lg">
        Saya adalah seorang developer yang senang mengubah ide menjadi produk digital yang nyata.
        Dengan pengalaman membangun aplikasi web dari front-end hingga integrasi API, saya selalu
        berusaha menulis kode yang bersih, terstruktur, dan mudah dikembangkan lebih lanjut.
      </p>

      <!-- Stat highlights -->
      <div class="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-4">
        <div
          class="rounded-xl border border-neutral-200 p-6 text-center transition-colors hover:border-sky-200 hover:bg-sky-50/50"
        >
          <p class="text-3xl font-bold text-neutral-900 sm:text-4xl">1+</p>
          <p class="mt-2 text-xs text-neutral-500 sm:text-sm">Tahun Pengalaman</p>
        </div>
        <div
          class="rounded-xl border border-neutral-200 p-6 text-center transition-colors hover:border-sky-200 hover:bg-sky-50/50"
        >
          <p class="text-3xl font-bold text-neutral-900 sm:text-4xl">10+</p>
          <p class="mt-2 text-xs text-neutral-500 sm:text-sm">Project Selesai</p>
        </div>
        <div
          class="rounded-xl border border-neutral-200 p-6 text-center transition-colors hover:border-sky-200 hover:bg-sky-50/50"
        >
          <p class="text-3xl font-bold text-neutral-900 sm:text-4xl">18</p>
          <p class="mt-2 text-xs text-neutral-500 sm:text-sm">Teknologi Dikuasai</p>
        </div>
        <div
          class="rounded-xl border border-neutral-200 p-6 text-center transition-colors hover:border-sky-200 hover:bg-sky-50/50"
        >
          <p class="text-3xl font-bold text-neutral-900 sm:text-4xl">Freelance</p>
          <p class="mt-2 text-xs text-neutral-500 sm:text-sm">Status</p>
        </div>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section class="flex min-h-[75dvh] flex-col justify-center border-t border-neutral-200 py-20">
      <div class="h-1 w-16 rounded bg-sky-600"></div>
      <p class="mt-4 text-sm font-semibold tracking-widest text-neutral-400 uppercase">Keahlian</p>
      <h2 class="mt-2 text-2xl font-bold text-neutral-900 sm:text-3xl">Tech Stack</h2>

      <div class="mt-10 grid gap-10 sm:grid-cols-3 sm:divide-x sm:divide-neutral-200">
        <div v-for="(items, cat) in techStack" :key="cat" class="sm:pl-8 sm:first:pl-0">
          <h3 class="text-sm font-semibold tracking-wide text-neutral-700 uppercase">{{ cat }}</h3>
          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="tech in items"
              :key="tech"
              class="rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1.5 text-sm text-neutral-600 transition-all hover:scale-105 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
            >
              {{ tech }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Projects Section -->
    <section class="flex min-h-[85dvh] flex-col justify-center border-t border-neutral-200 py-20">
      <div class="flex items-end justify-between">
        <div>
          <div class="h-1 w-16 rounded bg-sky-600"></div>
          <p class="mt-4 text-sm font-semibold tracking-widest text-neutral-400 uppercase">Karya</p>
          <h2 class="mt-2 text-2xl font-bold text-neutral-900 sm:text-3xl">Featured Projects</h2>
        </div>
        <RouterLink
          to="/projects"
          class="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
        >
          Lihat Semua →
        </RouterLink>
      </div>

      <!-- Loading state -->
      <p v-if="loading" class="mt-16 text-center text-neutral-400">Loading projects…</p>

      <!-- Error state -->
      <p v-if="error" class="mt-16 text-center text-red-500">{{ error }}</p>

      <!-- Project cards grid -->
      <div v-if="projects.length" class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="(project, idx) in projects"
          :key="project.id"
          :class="
            idx === 0
              ? 'scale-100 transform transition-transform hover:scale-105'
              : 'scale-100 transform transition-transform hover:scale-[1.02]'
          "
        >
          <div :class="idx === 0 ? 'rounded ring-2 ring-sky-100' : ''">
            <Card
              :title="project.title"
              :description="project.description"
              :image="project.image_url"
            />
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <p v-else-if="!loading && !error" class="mt-16 text-center text-neutral-400">
        Belum ada project untuk ditampilkan.
      </p>
    </section>
  </div>
</template>
