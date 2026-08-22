// src/services/experiences.ts — Experience-related API calls (public + admin).
import { api, mapAxiosData, createFormData } from './axios'
import type { Experience, CreateExperienceRequest, UpdateExperienceRequest } from '../types'

// ── Public ───────────────────────────────────────────────────────────────
/** GET /api/experiences — Fetch all experiences. */
export const getExperiences = (): Promise<Experience[]> =>
  api.get<Experience[]>('/api/experiences').then(mapAxiosData)

// ── Admin ────────────────────────────────────────────────────────────────
/** POST /api/admin/experiences — Create a new experience entry (multipart/form-data). */
export const createExperience = (data: CreateExperienceRequest): Promise<Experience> => {
  const formData = createFormData(data)
  return api
    .post<Experience>('/api/admin/experiences', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(mapAxiosData)
}

/** PUT /api/admin/experiences/:id — Update an existing experience (multipart/form-data). */
export const updateExperience = (
  id: string,
  data: UpdateExperienceRequest,
): Promise<Experience> => {
  const formData = createFormData(data)
  return api
    .put<Experience>(`/api/admin/experiences/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(mapAxiosData)
}

/** DELETE /api/admin/experiences/:id — Delete an experience. */
export const deleteExperience = (id: string): Promise<void> =>
  api.delete(`/api/admin/experiences/${id}`).then(() => undefined)
