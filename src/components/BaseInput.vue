<!-- src/components/BaseInput.vue — Typed input with v-model, label, error, and type props. -->
<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    error?: string | null
    type?: string
  }>(),
  {
    label: '',
    error: null,
    type: 'text',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function onInput(e: Event): void {
  const target = e.target as HTMLInputElement | null
  if (target) emit('update:modelValue', target.value)
}
</script>

<template>
  <label class="block">
    <span class="text-sm font-medium">{{ label }}</span>
    <input
      :type="type"
      :value="modelValue"
      :aria-invalid="!!error"
      class="mt-1 block w-full rounded border px-3 py-2"
      @input="onInput"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </label>
</template>
