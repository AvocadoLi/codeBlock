import { createRouter, createWebHistory } from 'vue-router'
import DefaultLaout from '../layout/DefaultLaout.vue'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'defaultLayout',
      component: DefaultLaout,
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'Home',
          component: () => import('../views/HomeView.vue'),
        },
      ],
    },
  ],
})

export default router
