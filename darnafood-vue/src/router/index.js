import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/welcome', name: 'welcome', component: () => import('../views/Welcome.vue') },
  { path: '/cuisines', name: 'kitchens', alias: '/kitchens', component: () => import('../views/Kitchens.vue') },
  { path: '/dish/:id', name: 'kitchen-detail', alias: '/kitchen/:id', component: () => import('../views/KitchenDetail.vue') },
  { path: '/cart', name: 'cart', component: () => import('../views/Checkout.vue') },
  { path: '/confirm', name: 'confirm', component: () => import('../views/Confirm.vue') },
  { path: '/tracking/:id', name: 'tracking', component: () => import('../views/MyOrders.vue') },
  { path: '/profile', name: 'profile', component: () => import('../views/MyOrders.vue') },
  { path: '/auth/login', name: 'login', alias: '/login', component: () => import('../views/Login.vue') },
  { path: '/auth/register', name: 'register', alias: '/register', component: () => import('../views/Register.vue') },
  { path: '/auth/role', name: 'auth-role', component: () => import('../views/Register.vue') },
  { path: '/myorders', name: 'myorders', component: () => import('../views/MyOrders.vue'), meta: { requiresAuth: true } },
  { path: '/dashboard', name: 'dashboard', component: () => import('../views/Dashboard.vue'), meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } },
})

router.beforeEach((to, from, next) => {
  const auth = JSON.parse(localStorage.getItem('df_user') || 'null')
  const isAuth = !!auth && !!localStorage.getItem('df_token')
  if (to.meta.requiresAuth && !isAuth) {
    return next('/auth/login')
  }
  if (to.path === '/' && isAuth) {
    const isCuisinier = auth.role === 'cuisinier'
    return next(isCuisinier ? '/dashboard' : '/cuisines')
  }
  next()
})

export default router
