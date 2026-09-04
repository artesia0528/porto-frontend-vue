// File: src/main.ts
// App bootstrap: createApp, register Pinia, router, load styles, initialize interceptors.

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/main.css'
import { setupInterceptors } from './services/axios'
import { useTheme } from './composables/useTheme'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

useTheme()

// Attach Axios interceptors now that Pinia and Router are registered.
setupInterceptors(pinia, router)

app.mount('#app')
