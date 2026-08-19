<!-- src/pages/Home.vue — Public homepage showing a project preview grid. -->
<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useFetch } from '@/composables/useFetch'
import { getProjects } from '@/services/projects'
import Card from '@/components/Card.vue'
import type { Project } from '@/types'

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
      class="flex flex-col items-center gap-6 py-20 text-center sm:py-24 md:flex-row md:text-left"
    >
      <img
        src="/profile.webp"
        alt="I Komang Krisna Aditya Kusuma"
        width="160"
        height="160"
        fetchpriority="high"
        loading="eager"
        class="h-32 w-32 rounded-full object-cover ring-4 ring-neutral-200 sm:h-40 sm:w-40 md:shrink-0"
      />
      <div>
        <h1 class="text-3xl font-bold text-neutral-900 sm:text-4xl">
          I Komang Krisna Aditya Kusuma
        </h1>
        <p class="mt-1 text-lg font-medium text-neutral-500">Software Developer</p>
        <p class="mx-auto mt-3 max-w-xl text-base text-neutral-500 md:mx-0">
          Saya membangun aplikasi web modern, fungsional, dan mudah digunakan dengan fokus pada
          pengalaman pengguna yang baik.
        </p>

        <div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
          <RouterLink
            to="/projects"
            class="rounded-md bg-sky-700 px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105 hover:bg-sky-800"
          >
            Lihat Projects
          </RouterLink>
          <RouterLink
            to="/contact"
            class="rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
          >
            Hubungi Saya
          </RouterLink>
          <a
            href="/resume.pdf"
            class="rounded-md border border-sky-700 text-sky-700 px-5 py-2.5 text-sm font-medium hover:bg-sky-50 transition-colors"
            download
          >
            Download CV
          </a>
        </div>

        <!-- Social links (inline SVG icons for lightweight polish) -->
        <div class="mt-5 flex justify-center gap-4 md:justify-start">
          <a
            href="https://github.com/artesia0528"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            class="text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path
                d="M12 .5a12 12 0 00-3.8 23.4c.6.1.8-.2.8-.5v-1.9c-3.3.7-4-1.6-4-1.6-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1 1.6-.7 1.8-1.1.2-.7.5-1.1.9-1.3-2.6-.3-5.3-1.3-5.3-5.9 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.2 1.2a11 11 0 015.8 0C17 5 18 5.3 18 5.3c.6 1.6.2 2.9.1 3.2.8.9 1.3 2 1.3 3.3 0 4.6-2.7 5.6-5.3 5.9.5.4 1 1.1 1 2.2v3.3c0 .3.2.6.8.5A12 12 0 0012 .5z"
              />
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/i-komang-krisna-aditya-kusuma"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            class="text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path
                d="M4.98 3.5a2.5 2.5 0 11-.001 5.001A2.5 2.5 0 014.98 3.5zM3 9h4v12H3zM9 9h3.8v1.6h.1c.5-.9 1.8-1.9 3.6-1.9 3.8 0 4.5 2.5 4.5 5.8V21H16v-5.4c0-1.3 0-3-1.8-3-1.8 0-2.1 1.4-2.1 2.9V21H9V9z"
              />
            </svg>
          </a>
          <a
            href="mailto:ditya0528@gmail.com"
            aria-label="Email"
            class="text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path
                d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="border-t border-neutral-200 py-10">
      <h2 class="text-xl font-bold text-neutral-900 sm:text-2xl">Tentang Saya</h2>
      <p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-500 sm:text-base">
        Saya adalah seorang developer yang senang mengubah ide menjadi produk digital yang nyata.
        Dengan pengalaman membangun aplikasi web dari front-end hingga integrasi API, saya selalu
        berusaha menulis kode yang bersih, terstruktur, dan mudah dikembangkan lebih lanjut.
      </p>

      <!-- Stat highlights -->
      <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div class="rounded-lg border border-neutral-200 p-4 text-center">
          <p class="text-2xl font-bold text-neutral-900">1+</p>
          <p class="mt-1 text-xs text-neutral-500">Tahun Pengalaman</p>
        </div>
        <div class="rounded-lg border border-neutral-200 p-4 text-center">
          <p class="text-2xl font-bold text-neutral-900">10+</p>
          <p class="mt-1 text-xs text-neutral-500">Project Selesai</p>
        </div>
        <div class="rounded-lg border border-neutral-200 p-4 text-center">
          <p class="text-2xl font-bold text-neutral-900">18</p>
          <p class="mt-1 text-xs text-neutral-500">Teknologi Dikuasai</p>
        </div>
        <div class="rounded-lg border border-neutral-200 p-4 text-center">
          <p class="text-2xl font-bold text-neutral-900">Freelance</p>
          <p class="mt-1 text-xs text-neutral-500">Status</p>
        </div>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section class="border-t border-neutral-200 py-10">
      <h2 class="text-xl font-bold text-neutral-900 sm:text-2xl">Tech Stack</h2>
      <div class="mt-5 grid gap-6 sm:grid-cols-3">
        <div v-for="(items, cat) in techStack" :key="cat">
          <h3 class="text-sm font-semibold text-neutral-700">{{ cat }}</h3>
          <div class="mt-3 flex flex-wrap gap-2">
            <span
              v-for="tech in items"
              :key="tech"
              class="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm text-neutral-600 transition-transform hover:scale-105"
            >
              {{ tech }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Projects Section -->
    <section class="border-t border-neutral-200 py-10">
      <div class="flex items-center justify-between">
        <div>
          <div class="h-1 w-16 rounded bg-sky-600 mb-3"></div>
          <h2 class="text-xl font-bold text-neutral-900 sm:text-2xl">Featured Projects</h2>
        </div>
        <RouterLink
          to="/projects"
          class="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          Lihat Semua →
        </RouterLink>
      </div>

      <!-- Loading state -->
      <p v-if="loading" class="mt-6 text-center text-neutral-400">Loading projects…</p>

      <!-- Error state -->
      <p v-if="error" class="mt-6 text-center text-red-500">{{ error }}</p>

      <!-- Project cards grid -->
      <div v-if="projects.length" class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="(project, idx) in projects"
          :key="project.id"
          :class="idx === 0 ? 'transform hover:scale-105' : 'transform hover:scale-101'"
        >
          <div :class="idx === 0 ? 'ring-2 ring-sky-100 rounded' : ''">
            <Card
              :title="project.title"
              :description="project.description"
              :image="project.image"
            />
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <p v-else-if="!loading && !error" class="mt-6 text-center text-neutral-400">
        Belum ada project untuk ditampilkan.
      </p>
    </section>
  </div>
</template>
