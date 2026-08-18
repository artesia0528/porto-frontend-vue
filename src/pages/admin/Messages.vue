<!-- src/pages/admin/Messages.vue — Admin messages list with mark-read and delete. -->
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useFetch } from '@/composables/useFetch'
import { getMessages, markMessageAsRead, deleteMessage } from '@/services/messages'
import DataTable from '@/components/DataTable.vue'
import type { Column } from '@/components/DataTable.vue'
import type { Message } from '@/types'

const { data: messagesRef, run: fetchMessages } = useFetch<Message[]>(getMessages)
const messages = computed(() => messagesRef.value ?? [])

onMounted(() => fetchMessages())

const columns: Column[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'subject', label: 'Subject' },
  { key: 'body', label: 'Message' },
  { key: 'read', label: 'Read?' },
]

async function handleMarkRead(item: Record<string, unknown>) {
  try {
    await markMessageAsRead(String(item.id))
    fetchMessages()
  } catch {
    // error handled by interceptor
  }
}

async function handleDelete(item: Record<string, unknown>) {
  if (confirm('Delete this message?')) {
    try {
      await deleteMessage(String(item.id))
      fetchMessages()
    } catch {
      // error handled by interceptor
    }
  }
}
</script>

<template>
  <div>
    <h1 class="mb-4 text-2xl font-bold text-slate-900">Messages</h1>

    <DataTable
      :columns="columns"
      :items="(messages as unknown as Record<string, unknown>[]) ?? []"
      @edit="handleMarkRead"
      @delete="handleDelete"
    />

    <p class="mt-2 text-xs text-slate-400">Tip: Click "Edit" to mark a message as read.</p>
  </div>
</template>
