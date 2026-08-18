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

// ── Admin ────────────────────────────────────────────────────────────────
/** POST /api/admin/projects — Create a new project. */
export const createProject = (data: Partial<Project>): Promise<Project> =>
  api.post<Project>('/api/admin/projects', data).then(mapAxiosData)

/** PUT /api/admin/projects/:id — Update an existing project. */
export const updateProject = (id: string, data: Partial<Project>): Promise<Project> =>
  api.put<Project>(`/api/admin/projects/${id}`, data).then(mapAxiosData)

/** DELETE /api/admin/projects/:id — Delete a project. */
export const deleteProject = (id: string): Promise<void> =>
  api.delete(`/api/admin/projects/${id}`).then(() => undefined)
