// File: src/services/auth.ts — Typed functions for authentication API calls.
import { api, mapAxiosData } from './axios'
import type { AuthResponse } from '../types'

export async function loginApi(credentials: {
  username: string
  password: string
}): Promise<AuthResponse> {
  return api.post<AuthResponse>('/api/login', credentials).then(mapAxiosData)
}
