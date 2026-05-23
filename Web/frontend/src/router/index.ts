import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/RegisterView.vue')
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/rooms',
      name: 'Rooms',
      component: () => import('@/views/RoomsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/rooms/:id',
      name: 'RoomDetail',
      component: () => import('@/views/RoomDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/devices',
      name: 'Devices',
      component: () => import('@/views/DevicesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/devices/:id',
      name: 'DeviceDetail',
      component: () => import('@/views/DeviceDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/automation',
      name: 'Automation',
      component: () => import('@/views/AutomationView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard'
    }
  ]
})

export default router
