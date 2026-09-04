<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: boolean
    label?: string
    error?: string | null
    required?: boolean
  }>(),
  {
    modelValue: false,
    label: '',
    error: null,
    required: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

function onChange(event: Event) {
  const target = event.target as HTMLInputElement | null
  if (target) emit('update:modelValue', target.checked)
}
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
    <label class="flex cursor-pointer items-center gap-3">
      <input
        :checked="modelValue"
        type="checkbox"
        class="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700"
        :aria-invalid="!!error"
        @change="onChange"
      />
      <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ label }}</span>
    </label>
    <p v-if="error" class="mt-2 text-xs text-red-600">{{ error }}</p>
  </div>
</template>
