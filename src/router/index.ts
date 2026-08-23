// File: src/router/index.ts
// Vue Router with typed guards protecting admin routes using `useAuthStore()`.

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../layouts/DefaultLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('../pages/Home.vue') },
      { path: 'projects', name: 'Projects', component: () => import('../pages/Projects.vue') },
      {
        path: 'projects/:id',
        name: 'ProjectDetail',
        component: () => import('../pages/ProjectDetail.vue'),
      },
      { path: 'contact', name: 'Contact', component: () => import('../pages/Contact.vue') },
      { path: 'blogs', name: 'Blogs', component: () => import('../pages/Blogs.vue') },
      {
        path: 'blogs/:id',
        name: 'BlogDetail',
        component: () => import('../pages/BlogDetail.vue'),
      },
      {
        path: 'experiences',
        name: 'Experiences',
        component: () => import('../pages/Experiences.vue'),
      },
    ],
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../pages/admin/Login.vue'),
  },
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../pages/admin/Dashboard.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'projects',
        name: 'AdminProjects',
        component: () => import('../pages/admin/Projects.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'blogs',
        name: 'AdminBlogs',
        component: () => import('../pages/admin/Blogs.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'experiences',
        name: 'AdminExperiences',
        component: () => import('../pages/admin/Experiences.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'messages',
        name: 'AdminMessages',
        component: () => import('../pages/admin/Messages.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    return { top: 0, left: 0 }
  },
})

router.beforeEach((to, _from) => {
  const auth = useAuthStore()
  // Redirect away from login if already authenticated
  if (to.name === 'AdminLogin' && auth.token) {
    return { name: 'AdminDashboard' }
  }

  const requiresAuth = to.matched.some(
    (r) => (r.meta as { requiresAuth?: boolean }).requiresAuth === true,
  )

  if (requiresAuth && !auth.token) {
    return { name: 'AdminLogin' }
  }
})

export default router
