<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    error?: string | null
    required?: boolean
    placeholder?: string
    rows?: number
    textareaClass?: string
  }>(),
  {
    modelValue: '',
    label: '',
    error: null,
    required: false,
    placeholder: '',
    rows: 5,
    textareaClass: '',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement | null
  if (target) emit('update:modelValue', target.value)
}
</script>

<template>
  <FormField :label="label" :required="required" :error="error">
    <textarea
      :value="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      :aria-invalid="!!error"
      class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:bg-slate-900 dark:focus:ring-sky-900/50"
      :class="[error ? 'border-red-300 bg-red-50' : '', textareaClass]"
      @input="onInput"
    />
  </FormField>
</template>
