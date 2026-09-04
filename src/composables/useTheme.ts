import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'theme-preference'

type Theme = 'light' | 'dark' | 'system'

const theme = ref<Theme>(
  (localStorage.getItem(STORAGE_KEY) as Theme) || 'system',
)

const isDark = ref(false)

function applyTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDark.value = theme.value === 'dark' || (theme.value === 'system' && prefersDark)
  document.documentElement.classList.toggle('dark', isDark.value)
}

let mediaQuery: MediaQueryList | null = null

function onSystemChange() {
  if (theme.value === 'system') {
    applyTheme()
  }
}

export function useTheme() {
  if (typeof window !== 'undefined' && !mediaQuery) {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', onSystemChange)
    applyTheme()
  }

  watchEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme.value)
    applyTheme()
  })

  function toggle() {
    if (isDark.value) {
      theme.value = 'light'
    } else {
      theme.value = 'dark'
    }
  }

  function setTheme(value: Theme) {
    theme.value = value
  }

  return { theme, isDark, toggle, setTheme }
}
