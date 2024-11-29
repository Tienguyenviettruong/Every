import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Lifecycle from '../views/Lifecycle1.vue'
import Optimize from '../views/Optimize.vue'
import Lab from '../views/Lab.vue'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/lifecycle',
      name: 'Lifecycle',
      component: Lifecycle,
      meta: { requiresAuth: true }
    },
    {
      path: '/optimize',
      name: 'Optimize',
      component: Optimize,
      meta: { 
        requiresAuth: true,
        layout: 'optimize'
      }
    },
    {
      path: '/lab',
      name: 'Lab',
      component: Lab,
      meta: { 
        requiresAuth: true,
        layout: 'lab'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router