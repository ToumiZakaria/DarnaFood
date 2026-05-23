import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/welcome', name: 'welcome', component: () => import('../views/Welcome.vue') },
  { path: '/kitchens', name: 'kitchens', component: () => import('../views/Kitchens.vue') },
  { path: '/kitchen/:id', name: 'kitchen-detail', component: () => import('../views/KitchenDetail.vue') },
  { path: '/checkout', name: 'checkout', component: () => import('../views/Checkout.vue') },
  { path: '/confirm', name: 'confirm', component: () => import('../views/Confirm.vue') },
  { path: '/login', name: 'login', component: () => import('../views/Login.vue') },
  { path: '/register', name: 'register', component: () => import('../views/Register.vue') },
  { path: '/dashboard', name: 'dashboard', component: () => import('../views/Dashboard.vue'), meta: { requiresAuth: true } },
  { path: '/myorders', name: 'myorders', component: () => import('../views/MyOrders.vue'), meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } },
})

router.beforeEach((to, from, next) => {
  const auth = JSON.parse(localStorage.getItem('df_user') || 'null')
  if (to.meta.requiresAuth && !auth) {
    next('/login')
  } else {
    next()
  }
})

export default router
