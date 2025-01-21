import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'store', component: () => import('pages/StorePage.vue') },
      { path: 'payments', component: () => import('pages/PaymentsPage.vue') },
      { path: 'accounts', component: () => import('pages/AccountsPage.vue') },
      { path: 'accounts/details', name: 'accountDetails', component: () => import('pages/AccountDetailsPage.vue') },
      { path: 'tasks', component: () => import('pages/TasksPage.vue') },
      { path: 'ranks', component: () => import('pages/RanksPage.vue') },
      { path: 'communication', component: () => import('pages/CommunicationPage.vue') },
      { path: 'math', component: () => import('pages/MathPage.vue') },
      { path: 'general-config', component: () => import('pages/GeneralConfigurationPage.vue') },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/LoginPage.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
