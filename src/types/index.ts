// File: src/types/index.ts
// Centralized TypeScript interfaces/types used across the app.

export interface User {
  id: string
  name: string
  username: string
  role?: 'admin' | 'user'
}

export interface AuthResponse {
  token: string
  user?: User
}

export interface Project {
  id: string
  title: string
  description?: string
  image_url?: string
  created_at?: string
  updated_at?: string
  createdAt?: string
}

// ── Blog ─────────────────────────────────────────────────────────────────
export interface Blog {
  id: string
  title: string
  content: string
  image_url: string
  created_at: string
  updated_at: string
}

export interface CreateBlogRequest extends Record<string, unknown> {
  title: string
  content: string
  image: File
}

export interface UpdateBlogRequest extends Record<string, unknown> {
  title?: string
  content?: string
  image?: File
}

// ── Experience ───────────────────────────────────────────────────────────
export interface Experience {
  id: string
  company: string
  position: string
  start_date: string
  end_date?: string
  is_current: boolean
  description?: string
  logo_url: string
  created_at: string
  updated_at: string
}

export interface CreateExperienceRequest extends Record<string, unknown> {
  company: string
  position: string
  start_date: string
  end_date?: string
  is_current?: boolean
  description?: string
  logo: File
}

export interface UpdateExperienceRequest extends Record<string, unknown> {
  company?: string
  position?: string
  start_date?: string
  end_date?: string
  is_current?: boolean
  description?: string
  logo?: File
}

export interface Message {
  id: string
  name: string
  email: string
  subject?: string
  body: string
  read: boolean
  createdAt?: string
}

export interface ApiError {
  message: string
  code?: number
}

export interface ApiResponse<T> {
  data: T
  meta?: Record<string, unknown>
}
