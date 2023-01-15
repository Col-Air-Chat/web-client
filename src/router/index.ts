import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/IndexView.vue'
const subtitle: string = "Col Air Chat"
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: HomeView,
      meta: {
        title: '主页',
      },
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/home/HomeView.vue'),
      meta: {
        title: '开始你的Col Air路途',
      },
    },
  ]
})
router.beforeEach((to, from, next) => {
  if (to.meta.title && typeof to.meta.title === 'string') {
    document.title = to.meta.title + ' - ' + subtitle
  }
  next()
})


export default router
