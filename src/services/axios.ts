// File: src/services/axios.ts
// Export a typed Axios instance and a setup function to attach interceptors.

// File: src/services/axios.ts
// Export a typed Axios instance and a setup function to attach interceptors.

import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import type { Pinia } from 'pinia'
import type { Router } from 'vue-router'
import type { ApiError } from '../types/index'

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

export function mapAxiosData<T>(res: AxiosResponse<T>): T {
  return res.data
}

/**
 * Attach interceptors after Pinia and Router are created.
 * - Reads token from localStorage on requests.
 * - On 401 clears localStorage, resets Pinia auth store and redirects.
 */
export function setupInterceptors(pinia: Pinia, router: Router): void {
  api.interceptors.request.use((config) => {
    const token: string | null = localStorage.getItem('token')
    if (token && config.headers) {
      ;(config.headers as Record<string, string>).Authorization = `Bearer ${token}`
    }
    return config
  })

  api.interceptors.response.use(
    (res) => res,
    async (err) => {
      const responseStatus = err.response?.status
      if (responseStatus === 401) {
        try {
          // dynamic import to avoid circular top-level dependency
          const mod = await import('../stores/auth')
          const useAuthStore = mod.useAuthStore as (pinia?: Pinia) => { clearAuth: () => void }
          const authStore = useAuthStore(pinia)
          authStore.clearAuth()
        } catch {
          // fallback: just remove token
          localStorage.removeItem('token')
        }
        // navigate to admin login
        try {
          router.push('/admin/login')
        } catch {
          // ignore
        }
      }

      const apiError: ApiError = {
        message: err.message,
        code: err.response?.status,
      }
      return Promise.reject(apiError)
    },
  )
}

// `api` is exported above as a named export
