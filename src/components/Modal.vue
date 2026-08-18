// File: src/components/Modal.vue // Minimal modal with slot content and `open` prop and close
event.

<template>
  <div v-if="open" class="fixed inset-0 flex items-center justify-center z-50">
    <div class="fixed inset-0 bg-black opacity-40" @click="$emit('close')"></div>
    <div class="bg-white rounded p-6 z-10 max-w-lg w-full">
      <button class="ml-auto mb-2" @click="$emit('close')">Close</button>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
// File: src/components/Modal.vue - Modal wrapper
const props = defineProps<{
  open: boolean
}>()
</script>

<style scoped></style>
