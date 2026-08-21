// src/services/projects.ts — Project-related API calls (public + admin).
import { api, mapAxiosData } from './axios'
import type { Project } from '../types'

// ── Public ───────────────────────────────────────────────────────────────
/** GET /api/projects — Fetch all projects. */
export const getProjects = (): Promise<Project[]> =>
  api.get<Project[]>('/api/projects').then(mapAxiosData)

/** GET /api/projects/:id — Fetch a single project by ID. */
export const getProject = (id: string): Promise<Project> =>
  api.get<Project>(`/api/projects/${id}`).then(mapAxiosData)

const buildProjectFormData = (data: Partial<Project>, file?: File | null): FormData => {
  const formData = new FormData()

  if (data.title) formData.append('title', data.title.trim())
  if (data.description !== undefined) formData.append('description', data.description.trim())
  if (file) formData.append('image', file)

  return formData
}

// ── Admin ────────────────────────────────────────────────────────────────
/** POST /api/admin/projects — Create a new project. */
export const createProject = (data: Partial<Project>, file?: File | null): Promise<Project> => {
  const formData = buildProjectFormData(data, file)

  return api
    .post<Project>('/api/admin/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(mapAxiosData)
}

/** PUT /api/admin/projects/:id — Update an existing project. */
export const updateProject = (
  id: string,
  data: Partial<Project>,
  file?: File | null,
): Promise<Project> => {
  const formData = buildProjectFormData(data, file)

  return api
    .put<Project>(`/api/admin/projects/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(mapAxiosData)
}

/** DELETE /api/admin/projects/:id — Delete a project. */
export const deleteProject = (id: string): Promise<void> =>
  api.delete(`/api/admin/projects/${id}`).then(() => undefined)

/** POST /api/admin/uploads — Upload an image file and return its URL. */
export const uploadImage = (file: File): Promise<string> => {
  const fd = new FormData()
  fd.append('file', file)
  return api
    .post('/api/admin/uploads', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => {
      const data = (res as any).data
      return data?.url ?? data
    })
}
