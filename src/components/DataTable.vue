<!-- src/components/DataTable.vue — Reusable typed data table. -->
<script setup lang="ts">
export interface Column {
  key: string
  label: string
}

const props = withDefaults(
  defineProps<{
    items: Array<Record<string, unknown>>
    columns?: Column[]
    headers?: string[]
    keys?: string[]
    editLabel?: string
    deleteLabel?: string
  }>(),
  {
    editLabel: 'Edit',
    deleteLabel: 'Delete',
  },
)

const emit = defineEmits<{
  (e: 'edit', row: Record<string, unknown>): void
  (e: 'delete', row: Record<string, unknown>): void
}>()

const activeColumns: Column[] =
  props.columns && props.columns.length > 0
    ? props.columns
    : (props.keys ?? []).map((k, i) => ({ key: k, label: props.headers?.[i] ?? k }))

function cellValue(row: Record<string, unknown>, key: string): string {
  const value = row[key]

  if (typeof value === 'boolean') {
    return value ? 'Read' : 'Unread'
  }

  if (value === null || value === undefined || value === '') {
    return '-'
  }

  return String(value)
}

function readBadgeClass(value: unknown): string {
  return typeof value === 'boolean' && value
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : 'border-slate-200 bg-slate-100 text-slate-600'
}
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th
              v-for="(col, idx) in activeColumns"
              :key="idx"
              class="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500"
            >
              {{ col.label }}
            </th>
            <th
              class="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 bg-white">
          <tr v-for="(row, idx) in items" :key="String((row as Record<string, unknown>).id ?? idx)">
            <td
              v-for="(col, kidx) in activeColumns"
              :key="kidx"
              class="px-5 py-4 align-top text-sm text-slate-700"
            >
              <span
                v-if="typeof (row as Record<string, unknown>)[col.key] === 'boolean'"
                class="inline-flex rounded-full border px-2.5 py-1 text-xs font-medium"
                :class="readBadgeClass((row as Record<string, unknown>)[col.key])"
              >
                {{ cellValue(row, col.key) }}
              </span>
              <span v-else class="block max-w-xs leading-relaxed">
                {{ cellValue(row, col.key) }}
              </span>
            </td>
            <td class="px-5 py-4">
              <div class="flex flex-wrap gap-2">
                <button
                  type="button"
                  class="inline-flex items-center rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1.5 text-xs font-medium text-sky-700 transition hover:border-sky-300 hover:bg-sky-100"
                  @click="$emit('edit', row)"
                >
                  {{ editLabel }}
                </button>
                <button
                  type="button"
                  class="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 transition hover:border-red-300 hover:bg-red-100"
                  @click="$emit('delete', row)"
                >
                  {{ deleteLabel }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
