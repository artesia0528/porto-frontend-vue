// src/services/messages.ts — Contact messages API calls (public + admin).
import { api, mapAxiosData } from './axios'
import type { Message } from '../types'

// ── Public ───────────────────────────────────────────────────────────────
/** POST /api/contact — Submit a contact form message. */
export const sendMessage = (
  data: Pick<Message, 'name' | 'email' | 'subject' | 'body'>,
): Promise<void> =>
  api
    .post('/api/contact', {
      name: data.name,
      email: data.email,
      subject: data.subject,
      content: data.body,
    })
    .then(() => undefined)

// ── Admin ────────────────────────────────────────────────────────────────
/** GET /api/admin/messages — List all contact messages. */
export const getMessages = (): Promise<Message[]> =>
  api.get<Message[]>('/api/admin/messages').then(mapAxiosData)

/** PATCH /api/admin/messages/:id — Mark a message as read. */
export const markMessageAsRead = (id: string): Promise<Message> =>
  api.patch<Message>(`/api/admin/messages/${id}/read`, { is_read: true }).then(mapAxiosData)

/** DELETE /api/admin/messages/:id — Delete a message. */
export const deleteMessage = (id: string): Promise<void> =>
  api.delete(`/api/admin/messages/${id}`).then(() => undefined)
