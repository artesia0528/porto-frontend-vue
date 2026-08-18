<!-- src/components/BaseButton.vue — Typed button with loading, type, and variant props. -->
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    loading?: boolean
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary'
  }>(),
  {
    loading: false,
    type: 'button',
    variant: 'primary',
  },
)

defineEmits<{
  (e: 'click'): void
}>()

const computedClass = computed(() =>
  props.variant === 'primary'
    ? 'bg-blue-600 text-white hover:bg-blue-700'
    : 'bg-gray-100 text-gray-900 hover:bg-gray-200',
)
</script>

<template>
  <button
    :type="type"
    :disabled="loading"
    :class="computedClass"
    class="inline-flex items-center justify-center rounded px-4 py-2 disabled:opacity-50"
    @click="$emit('click')"
  >
    <span v-if="loading" class="mr-2 animate-spin" aria-hidden="true">&#8987;</span>
    <slot />
  </button>
</template>
