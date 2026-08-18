// src/services/blogs.ts — Blog-related API calls (public + admin).
import { api, mapAxiosData } from './axios'
import type { Blog } from '../types'

// ── Public ───────────────────────────────────────────────────────────────
/** GET /api/blogs — Fetch all blog posts. */
export const getBlogs = (): Promise<Blog[]> =>
  api.get<Blog[]>('/api/blogs').then(mapAxiosData)

// ── Admin ────────────────────────────────────────────────────────────────
/** POST /api/admin/blogs — Create a new blog post. */
export const createBlog = (data: Partial<Blog>): Promise<Blog> =>
  api.post<Blog>('/api/admin/blogs', data).then(mapAxiosData)

/** PUT /api/admin/blogs/:id — Update an existing blog post. */
export const updateBlog = (id: string, data: Partial<Blog>): Promise<Blog> =>
  api.put<Blog>(`/api/admin/blogs/${id}`, data).then(mapAxiosData)

/** DELETE /api/admin/blogs/:id — Delete a blog post. */
export const deleteBlog = (id: string): Promise<void> =>
  api.delete(`/api/admin/blogs/${id}`).then(() => undefined)
