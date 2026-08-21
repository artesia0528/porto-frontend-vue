<!-- src/components/DataTable.vue — Reusable typed data table. -->
<script setup lang="ts">
export interface Column {
  key: string
  label: string
}

const props = defineProps<{
  items: Array<Record<string, unknown>>
  columns?: Column[]
  headers?: string[]
  keys?: string[]
}>()

const emit = defineEmits<{
  (e: 'edit', row: Record<string, unknown>): void
  (e: 'delete', row: Record<string, unknown>): void
}>()

const activeColumns: Column[] =
  props.columns && props.columns.length > 0
    ? props.columns
    : (props.keys ?? []).map((k, i) => ({ key: k, label: props.headers?.[i] ?? k }))
</script>

<template>
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        <th
          v-for="(col, idx) in activeColumns"
          :key="idx"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
        >
          {{ col.label }}
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      <tr v-for="(row, idx) in items" :key="String((row as Record<string, unknown>).id ?? idx)">
        <td
          v-for="(col, kidx) in activeColumns"
          :key="kidx"
          class="px-6 py-4 text-sm text-gray-900"
        >
          {{ (row as Record<string, unknown>)[col.key] }}
        </td>
        <td class="px-6 py-4 space-x-2">
          <button class="text-indigo-600 hover:text-indigo-800" @click="$emit('edit', row)">
            Edit
          </button>
          <button class="text-red-600 hover:text-red-800" @click="$emit('delete', row)">
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
