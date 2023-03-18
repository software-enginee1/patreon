import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import { getCurrentUser } from 'vuefire'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)
  const authPrevented = publicPages.includes(to.path)
  const user = await getCurrentUser()

  if (authRequired && !user) {
    return '/login'
  }

  if (authPrevented && user) {
    alert("You're already logged in!")
    return '/'
  }

  document.title = `${to.name?.toString()} - The Ultimate Patreon Clone App` ?? 'Patreon'
})

export default router
