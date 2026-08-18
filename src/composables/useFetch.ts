// File: src/composables/useFetch.ts
// Generic `useFetch` composable that wraps async calls with reactive state.

import { ref, type Ref } from 'vue'
import type { ApiError } from '../types'

export function useFetch<T>(fn: () => Promise<T>) {
  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<string | null>(null) as Ref<string | null>
  const loading = ref<boolean>(false) as Ref<boolean>

  async function run(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const res = await fn()
      data.value = res
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        error.value = (err as ApiError | Error).message
      } else {
        error.value = 'Unknown error'
      }
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    error,
    loading,
    run,
  } as const
}
