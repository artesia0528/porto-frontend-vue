<!-- File: src/components/Footer.vue — Site footer -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Mail, ArrowUp } from '@lucide/vue'
import { motion } from 'motion-v'

const year = new Date().getFullYear()

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <motion.footer 
    class="mt-8 border-t border-neutral-200 bg-neutral-50"
    :initial="{ opacity: 0, y: 50 }"
    :whileInView="{ opacity: 1, y: 0 }"
    :viewport="{ once: true }"
    :transition="{ duration: 0.5, ease: 'easeOut' }"
  >
    <div class="mx-auto max-w-6xl px-4 py-16">
      <!-- Main footer content -->
      <div class="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
        <!-- About -->
        <div>
          <div class="flex items-center gap-3">
            <span
              class="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-700 text-sm font-bold text-white"
            >
              KA
            </span>
            <h3 class="text-base font-bold text-neutral-800">I Komang Krisna Aditya Kusuma</h3>
          </div>
          <p class="mt-4 max-w-xs text-sm leading-relaxed text-neutral-500">
            Software Developer yang fokus membangun aplikasi web modern, fungsional, dan mudah
            digunakan.
          </p>

          <!-- Social icons -->
          <div class="mt-5 flex gap-4">
            <a
              href="mailto:ditya0528@gmail.com"
              aria-label="Email"
              class="text-neutral-400 transition-colors hover:text-sky-700"
            >
              <Mail :size="20" />
            </a>
            <a
              href="https://github.com/artesia0528"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              class="text-neutral-400 transition-colors hover:text-sky-700"
            >
              <Icon icon="simple-icons:github" width="20" height="20" />
            </a>
            <a
              href="https://linkedin.com/in/i-komang-krisna-aditya-kusuma"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              class="text-neutral-400 transition-colors hover:text-sky-700"
            >
              <Icon icon="simple-icons:linkedin" width="20" height="20" />
            </a>
            <a
              href="https://instagram.com/adit_wokeuplikethis"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              class="text-neutral-400 transition-colors hover:text-sky-700"
            >
              <Icon icon="simple-icons:instagram" width="20" height="20" />
            </a>
          </div>
        </div>

        <!-- Quick links -->
        <div>
          <h4 class="text-sm font-semibold tracking-wide text-neutral-800 uppercase">Navigasi</h4>
          <ul class="mt-4 space-y-3">
            <li>
              <RouterLink
                to="/projects"
                class="text-sm text-neutral-500 transition-colors hover:text-sky-700"
              >
                Projects
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/blogs"
                class="text-sm text-neutral-500 transition-colors hover:text-sky-700"
              >
                Blogs
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/experiences"
                class="text-sm text-neutral-500 transition-colors hover:text-sky-700"
              >
                Experiences
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/contact"
                class="text-sm text-neutral-500 transition-colors hover:text-sky-700"
              >
                Contact
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="text-sm font-semibold tracking-wide text-neutral-800 uppercase">Terhubung</h4>
          <ul class="mt-4 space-y-3">
            <li>
              <a
                href="mailto:ditya0528@gmail.com"
                class="text-sm text-neutral-500 transition-colors hover:text-sky-700"
              >
                ditya0528@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://github.com/artesia0528"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-neutral-500 transition-colors hover:text-sky-700"
              >
                github.com/artesia0528
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com/in/i-komang-krisna-aditya-kusuma"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-neutral-500 transition-colors hover:text-sky-700"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Divider -->
      <div class="mt-12 border-t border-neutral-200 pt-6">
        <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p class="text-center text-sm text-neutral-500 sm:text-left">
            © {{ year }} I Komang Krisna Aditya Kusuma. All rights reserved.
          </p>

          <div class="flex items-center gap-5">
            <p class="text-xs text-neutral-400">Built with love</p>
            <button
              type="button"
              aria-label="Kembali ke atas"
              class="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-sky-700 hover:text-sky-700"
              @click="scrollToTop"
            >
              <ArrowUp :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </motion.footer>
</template>

<style scoped></style>
