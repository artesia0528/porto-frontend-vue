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
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
    : 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
}
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200 table-fixed dark:divide-slate-700">
        <thead class="bg-slate-50 dark:bg-slate-800/60">
          <tr>
            <th
              v-for="(col, idx) in activeColumns"
              :key="idx"
              class="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400"
            >
              {{ col.label }}
            </th>
            <th
              class="w-40 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-800">
          <tr v-for="(row, idx) in items" :key="String((row as Record<string, unknown>).id ?? idx)">
            <td
              v-for="(col, kidx) in activeColumns"
              :key="kidx"
              class="px-5 py-4 align-top text-sm text-slate-700 dark:text-slate-300"
            >
              <span
                v-if="typeof (row as Record<string, unknown>)[col.key] === 'boolean'"
                class="inline-flex rounded-full border px-2.5 py-1 text-xs font-medium"
                :class="readBadgeClass((row as Record<string, unknown>)[col.key])"
              >
                {{ cellValue(row, col.key) }}
              </span>
              <span
                v-else
                class="block w-full line-clamp-2 leading-relaxed"
                :title="cellValue(row, col.key)"
              >
                {{ cellValue(row, col.key) }}
              </span>
            </td>
            <td class="px-5 py-4">
              <div class="flex flex-wrap gap-2">
                <button
                  type="button"
                  class="inline-flex items-center rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1.5 text-xs font-medium text-sky-700 transition hover:border-sky-300 hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-900/30 dark:text-sky-400 dark:hover:border-sky-700 dark:hover:bg-sky-900/50"
                  @click="$emit('edit', row)"
                >
                  {{ editLabel }}
                </button>
                <button
                  type="button"
                  class="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 transition hover:border-red-300 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400 dark:hover:border-red-700 dark:hover:bg-red-900/50"
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
