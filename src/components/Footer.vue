<!-- File: src/components/Footer.vue — Site footer -->
<template>
  <footer class="bg-neutral-50 border-t border-neutral-200 mt-8">
    <div class="max-w-6xl mx-auto px-4 py-10">
      <!-- Main footer content -->
      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <!-- About -->
        <div>
          <h3 class="text-base font-bold text-neutral-800">I Komang Krisna Aditya Kusuma</h3>
          <p class="mt-2 text-sm text-neutral-500 leading-relaxed">
            Software Developer yang fokus membangun aplikasi web modern, fungsional, dan mudah
            digunakan.
          </p>
        </div>

        <!-- Quick links -->
        <div>
          <h4 class="text-sm font-semibold text-neutral-800 uppercase tracking-wide">Navigasi</h4>
          <ul class="mt-3 space-y-2">
            <li>
              <RouterLink
                to="/projects"
                class="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Projects
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/blogs"
                class="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Blogs
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/experiences"
                class="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Experiences
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/contact"
                class="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Contact
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Social / contact -->
        <div>
          <h4 class="text-sm font-semibold text-neutral-800 uppercase tracking-wide">Terhubung</h4>
          <ul class="mt-3 space-y-2">
            <li>
              <a
                href="mailto:ditya0528@gmail.com"
                class="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                ditya0528@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://github.com/artesia0528"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com/in/i-komang-krisna-aditya-kusuma"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/adit_wokeuplikethis"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Divider -->
      <div class="mt-8 border-t border-neutral-200 pt-6">
        <div class="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p class="text-sm text-neutral-500 text-center sm:text-left">
            © {{ year }} I Komang Krisna Aditya Kusuma. All rights reserved.
          </p>
          <p class="text-xs text-neutral-400 text-center sm:text-right">
            Built with Love
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// File: src/components/Footer.vue - Site footer
const year = new Date().getFullYear()
</script>

<style scoped></style>
