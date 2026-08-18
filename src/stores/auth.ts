// File: src/stores/auth.ts
// Pinia store `useAuthStore` to keep token and user in sync with localStorage.

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, AuthResponse } from '../types/index'
import { loginApi } from '../services/auth'

const TOKEN_KEY = 'token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const user = ref<User | null>(null)

  function setToken(newToken: string): void {
    token.value = newToken
    localStorage.setItem(TOKEN_KEY, newToken)
  }

  function clearAuth(): void {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  async function login(credentials: { username: string; password: string }): Promise<AuthResponse> {
    const resRaw = await loginApi(credentials)
    // Normalize response: some APIs wrap payload in `data` (ApiResponse<AuthResponse>)
    const maybeData = resRaw as unknown as any
    const payload: { token?: string; user?: User } =
      maybeData.token || maybeData.user ? maybeData : maybeData.data || {}

    if (payload.token) {
      setToken(payload.token)
    }
    if (payload.user) {
      user.value = payload.user
    }

    return payload as AuthResponse
  }

  return {
    token,
    user,
    setToken,
    clearAuth,
    login,
  }
})
