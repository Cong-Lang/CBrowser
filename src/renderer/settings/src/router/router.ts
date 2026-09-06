import { createMemoryHistory, createRouter, RouteRecordRaw } from 'vue-router'

import HomeView from '../views/Home.vue'
import HistoryView from '../views/History.vue'

const routes: RouteRecordRaw[] = [
  {
    name: 'home',
    path: '/',
    component: HomeView,
    meta: {
      icon: 'home',
      name: '个人'
    }
  },
  {
    name: 'history',
    path: '/history',
    component: HistoryView,
    meta: {
      icon: 'history',
      name: '历史记录'
    }
  }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

export default router
