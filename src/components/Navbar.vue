<!-- src/components/Navbar.vue — Top navigation with admin actions. -->
<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function closeMenu() {
  isOpen.value = false
}
</script>

<template>
  <nav class="relative bg-neutral-50 border-b border-neutral-200 z-50">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <RouterLink to="/" class="text-lg font-bold text-neutral-800" @click="closeMenu">
        I Komang Krisna Aditya Kusuma
      </RouterLink>

      <!-- Desktop menu -->
      <div class="hidden md:flex items-center space-x-6">
        <RouterLink
          to="/projects"
          class="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >Projects</RouterLink
        >
        <RouterLink
          to="/blogs"
          class="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >Blogs</RouterLink
        >
        <RouterLink
          to="/experiences"
          class="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >Experiences</RouterLink
        >
        <RouterLink
          to="/contact"
          class="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >Contact</RouterLink
        >
      </div>

      <!-- Hamburger button (mobile only) -->
      <button
        class="md:hidden inline-flex items-center justify-center p-2 rounded text-neutral-700 hover:bg-neutral-200 transition-colors"
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
        class="md:hidden absolute left-0 right-0 top-full bg-neutral-50 border-b border-neutral-200 shadow-lg"
      >
        <div class="flex flex-col px-4 py-2">
          <RouterLink
            to="/projects"
            class="text-sm py-3 text-neutral-600 hover:text-neutral-900 border-b border-neutral-200 last:border-b-0"
            @click="closeMenu"
          >
            Projects
          </RouterLink>
          <RouterLink
            to="/blogs"
            class="text-sm py-3 text-neutral-600 hover:text-neutral-900 border-b border-neutral-200 last:border-b-0"
            @click="closeMenu"
          >
            Blogs
          </RouterLink>
          <RouterLink
            to="/experiences"
            class="text-sm py-3 text-neutral-600 hover:text-neutral-900 border-b border-neutral-200 last:border-b-0"
            @click="closeMenu"
          >
            Experiences
          </RouterLink>
          <RouterLink
            to="/contact"
            class="text-sm py-3 text-neutral-600 hover:text-neutral-900 border-b border-neutral-200 last:border-b-0"
            @click="closeMenu"
          >
            Contact
          </RouterLink>
        </div>
      </div>
    </transition>
  </nav>

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
      class="fixed inset-0 top-14.25 z-40 md:hidden bg-black/40 backdrop-blur-sm"
      @click="closeMenu"
    ></div>
  </transition>
</template>
