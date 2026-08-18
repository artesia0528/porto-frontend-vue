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
  image?: string
  url?: string
  createdAt?: string
}

export interface Blog {
  id: string
  title: string
  excerpt?: string
  content?: string
  image?: string
  createdAt?: string
}

export interface Experience {
  id: string
  company: string
  role: string
  startDate?: string
  endDate?: string
  description?: string
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
