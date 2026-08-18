// File: README.md
// Short README describing generated files and next steps.

# Frontend scaffold (generated)

This folder contains typed Vue 3 + TypeScript frontend scaffolding:

- Pinia store at `src/stores/auth.ts`
- Typed Axios instance at `src/services/axios.ts` with `setupInterceptors`
- Services under `src/services/*` for auth, projects, blogs, experiences, messages
- Centralized types in `src/types/index.ts`
- Router with auth guard in `src/router/index.ts`
- Generic `useFetch` composable at `src/composables/useFetch.ts`
- Minimal components in `src/components/`
- Layouts in `src/layouts/`
- Pages in `src/pages/` (public and admin)
- `src/main.ts` bootstraps the app and attaches interceptors

How to proceed:

- Ensure `VITE_API_BASE_URL` is set in your `.env` or environment.
- Run the dev server: `npm install && npm run dev`.

# Porto Frontend (Vue 3)

A portfolio frontend built with **Vite + Vue 3 + Tailwind CSS v4 + Pinia + Vue Router**.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set your backend API URL
cp .env.example .env   # or edit .env directly
# VITE_API_BASE_URL=http://localhost:8080

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── assets/          # Global CSS (Tailwind entry)
├── components/      # Reusable UI components (BaseButton, Card, Modal…)
├── composables/     # Composition API hooks (useFetch)
├── layouts/         # DefaultLayout (public) & AdminLayout (admin)
├── pages/           # Route-level page components
│   ├── admin/       # Admin pages (Login, Dashboard, CRUD…)
│   ├── Home.vue
│   ├── Projects.vue
│   └── …
├── router/          # Vue Router config + auth guard
├── services/        # Axios instance + API call functions
├── stores/          # Pinia stores (auth)
└── main.ts          # App entry point
```

## Key Concepts for Beginners

| Concept             | What It Does                                              | Learn More                                                          |
| ------------------- | --------------------------------------------------------- | ------------------------------------------------------------------- |
| **Composition API** | `<script setup>` + `ref()` / `computed()` / `onMounted()` | [Vue Docs](https://vuejs.org/guide/extras/composition-api-faq.html) |
| **Pinia**           | Global state management (replaces Vuex)                   | [Pinia Docs](https://pinia.vuejs.org/)                              |
| **Vue Router**      | Client-side routing + navigation guards                   | [Router Docs](https://router.vuejs.org/)                            |
| **Axios**           | HTTP client for API calls                                 | [Axios Docs](https://axios-http.com/)                               |
| **Tailwind CSS**    | Utility-first CSS framework                               | [Tailwind Docs](https://tailwindcss.com/)                           |

## Environment Variables

| Variable            | Description                              | Example                 |
| ------------------- | ---------------------------------------- | ----------------------- |
| `VITE_API_BASE_URL` | Backend API base URL (no trailing slash) | `http://localhost:8080` |

## Available Scripts

- `npm run dev` — Start Vite dev server
- `npm run build` — Type-check + production build
- `npm run preview` — Preview the production build locally
- `npm run lint` — Lint with ESLint + Oxlint
- `npm run format` — Format with Prettier
