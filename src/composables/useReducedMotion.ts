// src/composables/useReducedMotion.ts
// Tracks the user's OS-level "reduce motion" preference so components
// can dial down or skip decorative animation.
import { ref, onMounted, onUnmounted } from 'vue'

export function useReducedMotion() {
  const prefersReduced = ref(false)

  let mql: MediaQueryList | null = null
  const handleChange = (e: MediaQueryListEvent) => {
    prefersReduced.value = e.matches
  }

  onMounted(() => {
    mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReduced.value = mql.matches
    mql.addEventListener('change', handleChange)
  })

  onUnmounted(() => {
    mql?.removeEventListener('change', handleChange)
  })

  return prefersReduced
}

// Helper: returns a "no-op" transition-safe motion prop set when the user
// prefers reduced motion, otherwise returns the given props unchanged.
// Usage: v-bind="reducedSafe(prefersReduced, { initial: {...}, animate: {...} })"
export function reducedSafe(
  prefersReduced: { value: boolean },
  motionProps: Record<string, unknown>,
) {
  if (!prefersReduced.value) return motionProps
  return {
    initial: false,
    animate: undefined,
    whileInView: undefined,
    transition: { duration: 0 },
  }
}