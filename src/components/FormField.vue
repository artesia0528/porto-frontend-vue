<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    required?: boolean
    error?: string | null
  }>(),
  {
    label: '',
    required: false,
    error: null,
  },
)
</script>

<template>
  <div class="block">
    <div class="mb-2 flex items-center justify-between gap-3">
      <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ label }}</span>
      <span v-if="required" class="text-xs font-medium text-red-500">Wajib</span>
    </div>

    <slot />

    <p v-if="error" class="mt-1 text-xs text-red-600">{{ error }}</p>
  </div>
</template>
