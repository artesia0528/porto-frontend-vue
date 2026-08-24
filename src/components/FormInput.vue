<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    error?: string | null
    type?: string
    required?: boolean
    placeholder?: string
    disabled?: boolean
    inputClass?: string
  }>(),
  {
    modelValue: '',
    label: '',
    error: null,
    type: 'text',
    required: false,
    placeholder: '',
    disabled: false,
    inputClass: '',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement | null
  if (target) emit('update:modelValue', target.value)
}
</script>

<template>
  <FormField :label="label" :required="required" :error="error">
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="!!error"
      class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
      :class="[error ? 'border-red-300 bg-red-50' : '', inputClass]"
      @input="onInput"
    />
  </FormField>
</template>
