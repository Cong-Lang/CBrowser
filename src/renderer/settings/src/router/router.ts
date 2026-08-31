import { createMemoryHistory, createRouter, RouteRecordRaw } from 'vue-router'

import HomeView from '../views/Home.vue'

const routes: RouteRecordRaw[] = [
  {
    name: 'home',
    path: '/',
    component: HomeView,
    meta: {
      icon: 'home',
      name: '个人'
    }
  }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

export default router
