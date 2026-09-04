<!-- src/pages/admin/Messages.vue — Admin messages list with mark-read and delete. -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useFetch } from '@/composables/useFetch'
import { getMessages, markMessageAsRead, deleteMessage } from '@/services/messages'
import DataTable from '@/components/DataTable.vue'
import type { Column } from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'
import BaseButton from '@/components/BaseButton.vue'
import type { Message } from '@/types'

const { data: messagesRef, run: fetchMessages } = useFetch<Message[]>(getMessages)
const messages = computed(() => messagesRef.value ?? [])

const deleteModalOpen = ref(false)
const selectedMessage = ref<Record<string, unknown> | null>(null)

onMounted(() => fetchMessages())

const columns: Column[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'subject', label: 'Subject' },
  { key: 'content', label: 'Message' },
  { key: 'is_read', label: 'Status' },
]

function getMessageStatus(value: unknown): string {
  return value === true ? 'Read' : 'Unread'
}

async function handleMarkRead(item: Record<string, unknown>) {
  const itemRead = Boolean(item.read ?? item.is_read ?? false)

  if (itemRead) return

  try {
    await markMessageAsRead(String(item.id))
    fetchMessages()
  } catch {
    // error handled by interceptor
  }
}

function openDeleteConfirm(item: Record<string, unknown>) {
  selectedMessage.value = item
  deleteModalOpen.value = true
}

async function confirmDelete() {
  if (!selectedMessage.value) return

  try {
    await deleteMessage(String(selectedMessage.value.id))
    deleteModalOpen.value = false
    selectedMessage.value = null
    fetchMessages()
  } catch {
    // error handled by interceptor
  }
}
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between gap-3">
      <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Messages</h1>
      <div
        class="rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 dark:border-sky-800 dark:bg-sky-900/40 dark:text-sky-400"
      >
        {{ messages.filter((item) => Boolean(item.read ?? item.is_read)).length }} read
      </div>
    </div>

    <DataTable
      :columns="columns"
      :items="(messages as unknown as Record<string, unknown>[]) ?? []"
      edit-label="Mark read"
      delete-label="Delete"
      @edit="handleMarkRead"
      @delete="openDeleteConfirm"
    />

    <Modal :open="deleteModalOpen" @close="deleteModalOpen = false">
      <div class="space-y-5">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">Confirm</p>
          <h2 class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Delete this message?</h2>
        </div>

        <div v-if="selectedMessage" class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
          <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">{{ selectedMessage.name }}</p>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">{{ selectedMessage.email }}</p>
          <p class="mt-3 text-sm text-slate-600 dark:text-slate-400">
            {{ getMessageStatus(selectedMessage.read ?? selectedMessage.is_read) }}
          </p>
        </div>

        <div class="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
          <BaseButton variant="secondary" @click="deleteModalOpen = false">Cancel</BaseButton>
          <BaseButton variant="danger" @click="confirmDelete">Delete</BaseButton>
        </div>
      </div>
    </Modal>
  </div>
</template>
