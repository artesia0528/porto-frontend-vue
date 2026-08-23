<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ImagePlus, X } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    modelValue?: File | null
    previewUrl?: string | null
    label?: string
    required?: boolean
    error?: string | null
    accept?: string
  }>(),
  {
    modelValue: null,
    previewUrl: null,
    label: 'Image',
    required: false,
    error: null,
    accept: 'image/*',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: File | null): void
}>()

const localPreview = ref<string | null>(null)

const preview = computed(() => localPreview.value ?? props.previewUrl ?? null)

watch(
  () => props.modelValue,
  (file) => {
    if (!file) {
      localPreview.value = props.previewUrl ?? null
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      localPreview.value = String(reader.result)
    }
    reader.readAsDataURL(file)
  },
  { immediate: true },
)

watch(
  () => props.previewUrl,
  (url) => {
    if (!props.modelValue) {
      localPreview.value = url ?? null
    }
  },
)

function onChange(event: Event): void {
  const target = event.target as HTMLInputElement | null
  const file = target?.files?.[0] ?? null
  emit('update:modelValue', file)

  if (!file) {
    localPreview.value = props.previewUrl ?? null
  }
}

function clearImage(): void {
  emit('update:modelValue', null)
  localPreview.value = props.previewUrl ?? null
}
</script>

<template>
  <label class="block">
    <div class="mb-2 flex items-center justify-between gap-3">
      <span class="text-sm font-medium text-slate-700">{{ label }}</span>
      <span v-if="required" class="text-xs font-medium text-red-500">Wajib</span>
    </div>

    <div
      class="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-3 transition-all duration-200 hover:border-sky-300 hover:bg-sky-50"
    >
      <div
        v-if="preview"
        class="relative overflow-hidden rounded-xl border border-slate-200 bg-white"
      >
        <img :src="preview" alt="Preview upload" class="h-40 w-full object-cover" />
        <button
          type="button"
          class="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm transition hover:bg-slate-800"
          @click.prevent="clearImage()"
        >
          <X :size="12" />
          Hapus
        </button>
      </div>

      <label
        class="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-sky-300 hover:text-sky-700"
      >
        <ImagePlus :size="16" />
        <span>{{ preview ? 'Ganti gambar' : 'Pilih gambar' }}</span>
        <input
          type="file"
          :accept="accept"
          class="hidden"
          :required="required"
          @change="onChange"
        />
      </label>
    </div>

    <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
  </label>
</template>
