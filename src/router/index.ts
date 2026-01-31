import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import type { RouteName } from '~/shared/types'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Ruta de login (sin layout)
    {
      path: '/login',
      name: 'login' as RouteName,
      component: () => import('~/modules/auth/views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    
    // Ruta raíz que usa el layout de aplicación
    {
      path: '/',
      component: () => import('~/shared/components/layout/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        // Ruta raíz redirige a dashboard
        {
          path: '',
          redirect: { name: 'dashboard' }
        },
        {
          path: 'dashboard',
          name: 'dashboard' as RouteName,
          component: () => import('~/modules/dashboard/views/DashboardView.vue'),
          children: [
            {
              path: 'ingresos',
              name: 'ingresos' as RouteName,
              component: () => import('~/modules/dashboard/views/IngresosView.vue')
            },
            {
              path: 'egresos',
              name: 'egresos' as RouteName,
              component: () => import('~/modules/dashboard/views/EgresosView.vue')
            }
          ]
        },
        {
          path: 'budgets',
          name: 'budgets' as RouteName,
          component: () => import('~/modules/budget/views/BudgetsView.vue'),
          children: [
            {
              path: ':categoryId',
              name: 'budget-category' as RouteName,
              component: () => import('~/modules/budget/views/BudgetCategoryView.vue')
            }
          ]
        },
        {
          path: 'deudas',
          name: 'deudas' as RouteName,
          component: () => import('~/modules/deudas/views/DeudasView.vue'),
          meta: { userOnly: true },
          children: [
            {
              path: 'historial',
              name: 'deudas-historial' as RouteName,
              component: () => import('~/modules/deudas/views/HistorialView.vue'),
              meta: { userOnly: true }
            }
          ]
        },
        {
          path: 'planificacion',
          name: 'planificacion' as RouteName,
          component: () => import('~/modules/planificacion/views/PlanificacionView.vue')
        }
      ]
    }
  ]
})

// Navigation guard for protected routes
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    // Redirect to dashboard if already logged in
    next('/dashboard')
  } else if (to.meta.userOnly && authStore.user?.role === 'admin') {
    // Redirect admin away from user-only routes
    next('/dashboard')
  } else {
    next()
  }
})

export default router
