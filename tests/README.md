// File: tests/README.md
// Placeholder for test instructions.

This folder is reserved for future tests. Add unit and integration tests using your preferred test runner (Vitest/Jest) and reference the typed services and stores created in `src/`.

# Tests — Placeholder

This project does not include tests yet. Here are suggested areas to test:

## Unit Tests (Vitest)

- **`useAuthStore`** — `login()` stores token, `logout()` clears it.
- **`useFetch`** — returns correct `data`, `error`, `loading` states.
- **Axios interceptors** — request adds `Authorization` header; response clears auth on 401.

## Component Tests (Vue Test Utils + Vitest)

- **`BaseInput`** — renders label, emits `update:modelValue`, shows error text.
- **`BaseButton`** — renders slot content, shows spinner when `loading`, disables when `loading`.
- **`Modal`** — renders slot when `open=true`, emits `close` on backdrop click.
- **`DataTable`** — renders columns/rows, emits `edit` / `delete` on button clicks.
- **`Navbar`** — toggles mobile menu, renders all links.

## E2E Tests (Cypress or Playwright)

- **Login flow** — fill form → submit → redirected to `/admin/dashboard`.
- **Auth guard** — visiting `/admin/dashboard` without token → redirected to `/admin/login`.
- **Contact form** — fill and submit → success message appears.
- **Admin CRUD** — create / edit / delete a project via the modal form.

## Getting Started with Testing

```bash
# Install Vitest + Vue Test Utils
npm install -D vitest @vue/test-utils jsdom

# Add a test script to package.json
# "test": "vitest"
```
