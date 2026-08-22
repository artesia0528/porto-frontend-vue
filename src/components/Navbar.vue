<!-- src/components/Navbar.vue — Top navigation with admin actions. -->
<script setup lang="ts">
import { ref } from 'vue'
import { motion } from 'motion-v'
import { springTransitionSoft } from '@/motion/variants'
import { useReducedMotion } from '@/composables/useReducedMotion'

const isOpen = ref(false)
const prefersReduced = useReducedMotion()

const navLinks = [
  { to: '/projects', label: 'Projects' },
  { to: '/blogs', label: 'Blogs' },
  { to: '/experiences', label: 'Experiences' },
]

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function closeMenu() {
  isOpen.value = false
}
</script>

<template>
  <!--
    Drop-in animation once per mount. If Navbar lives outside <RouterView>
    (e.g. in App.vue) it mounts once and this plays once, as intended.
    If it ever gets re-mounted per-route, this would replay on every
    navigation — worth confirming Navbar isn't inside the routed view.
  -->
  <motion.nav
    class="fixed inset-x-0 top-0 z-50 h-16 border-b border-neutral-200 bg-neutral-50/80 backdrop-blur-md"
    :initial="prefersReduced ? false : { y: -100 }"
    :animate="{ y: 0 }"
    :transition="springTransitionSoft"
  >
    <div class="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
      <!-- Logo mark (initials, no full name) -->
      <RouterLink
        to="/"
        aria-label="Beranda"
        class="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-700 text-sm font-bold text-white transition-transform hover:scale-105"
        @click="closeMenu"
      >
        KA
      </RouterLink>

      <!-- Desktop menu -->
      <div class="hidden items-center gap-1 md:flex">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="relative px-3 py-2 text-sm text-neutral-500 transition-colors after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-sky-700 after:transition-transform after:content-[''] hover:text-neutral-900 [&.router-link-exact-active]:font-medium [&.router-link-exact-active]:text-neutral-900 [&.router-link-exact-active]:after:scale-x-100"
        >
          {{ link.label }}
        </RouterLink>

        <RouterLink
          to="/contact"
          class="ml-2 rounded-md border border-sky-700 px-4 py-1.5 text-sm font-medium text-sky-700 transition-colors hover:bg-sky-700 hover:text-white"
        >
          Contact
        </RouterLink>
      </div>

      <!-- Hamburger button (mobile only) -->
      <button
        class="inline-flex items-center justify-center rounded p-2 text-neutral-700 transition-colors hover:bg-neutral-200 md:hidden"
        @click="toggleMenu"
        :aria-expanded="isOpen"
        aria-label="Toggle navigation menu"
      >
        <svg
          v-if="!isOpen"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile menu (overlay, floats above content) -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isOpen"
        class="absolute inset-x-0 top-full border-b border-neutral-200 bg-neutral-50 shadow-lg md:hidden"
      >
        <div class="flex flex-col px-4 py-2">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="border-b border-neutral-200 py-3 text-sm text-neutral-600 last:border-b-0 hover:text-neutral-900 [&.router-link-exact-active]:font-medium [&.router-link-exact-active]:text-sky-700"
            @click="closeMenu"
          >
            {{ link.label }}
          </RouterLink>
          <RouterLink
            to="/contact"
            class="py-3 text-sm text-neutral-600 hover:text-neutral-900 [&.router-link-exact-active]:font-medium [&.router-link-exact-active]:text-sky-700"
            @click="closeMenu"
          >
            Contact
          </RouterLink>
        </div>
      </div>
    </transition>
  </motion.nav>

  <transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 top-16 z-40 bg-black/40 backdrop-blur-sm md:hidden"
      @click="closeMenu"
    ></div>
  </transition>
</template>