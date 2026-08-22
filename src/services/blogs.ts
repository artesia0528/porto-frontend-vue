// src/services/blogs.ts — Blog-related API calls (public + admin).
import { api, mapAxiosData, createFormData } from './axios'
import type { Blog, CreateBlogRequest, UpdateBlogRequest } from '../types'

// ── Public ───────────────────────────────────────────────────────────────
/** GET /api/blogs — Fetch all blog posts. */
export const getBlogs = (): Promise<Blog[]> => api.get<Blog[]>('/api/blogs').then(mapAxiosData)

// ── Admin ────────────────────────────────────────────────────────────────
/** POST /api/admin/blogs — Create a new blog post (multipart/form-data). */
export const createBlog = (data: CreateBlogRequest): Promise<Blog> => {
  const formData = createFormData(data)
  return api
    .post<Blog>('/api/admin/blogs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(mapAxiosData)
}

/** PUT /api/admin/blogs/:id — Update an existing blog post (multipart/form-data). */
export const updateBlog = (id: string, data: UpdateBlogRequest): Promise<Blog> => {
  const formData = createFormData(data)
  return api
    .put<Blog>(`/api/admin/blogs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(mapAxiosData)
}

/** DELETE /api/admin/blogs/:id — Delete a blog post. */
export const deleteBlog = (id: string): Promise<void> =>
  api.delete(`/api/admin/blogs/${id}`).then(() => undefined)
