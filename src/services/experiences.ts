// src/services/experiences.ts — Experience-related API calls (public + admin).
import { api, mapAxiosData } from './axios'
import type { Experience } from '../types'

// ── Public ───────────────────────────────────────────────────────────────
/** GET /api/experiences — Fetch all experiences. */
export const getExperiences = (): Promise<Experience[]> =>
  api.get<Experience[]>('/api/experiences').then(mapAxiosData)

// ── Admin ────────────────────────────────────────────────────────────────
/** POST /api/admin/experiences — Create a new experience entry. */
export const createExperience = (data: Partial<Experience>): Promise<Experience> =>
  api.post<Experience>('/api/admin/experiences', data).then(mapAxiosData)

/** PUT /api/admin/experiences/:id — Update an existing experience. */
export const updateExperience = (id: string, data: Partial<Experience>): Promise<Experience> =>
  api.put<Experience>(`/api/admin/experiences/${id}`, data).then(mapAxiosData)

/** DELETE /api/admin/experiences/:id — Delete an experience. */
export const deleteExperience = (id: string): Promise<void> =>
  api.delete(`/api/admin/experiences/${id}`).then(() => undefined)
