import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Lifecycle from '../views/Lifecycle1.vue'
import Optimize from '../views/Optimize.vue'
import Lab from '../views/Lab.vue'
import Chat from '../views/Chat.vue'
import Workflow from '../views/Workflow.vue'
import MapView from '../views/MapView.vue'

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
    },
    {
      path: '/chat',
      name: 'Chat',
      component: Chat,
      meta: { 
        requiresAuth: true,
        layout: 'chat'
      }
    },
    {
      path: '/workflow',
      name: 'Workflow',
      component: Workflow,
      meta: { requiresAuth: true }
    },
    {
      path: '/map',
      name: 'Map',
      component: MapView,
      meta: { requiresAuth: true }
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