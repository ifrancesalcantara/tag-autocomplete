import Vue from 'vue'
import Router from 'vue-router'
import routeNames from './routes'


Vue.use(Router)
const routes = [
  {
    path: '*',
    component: () => import('@/views/Main.vue'),
    name: routeNames.main.name
  }
]

const router = new Router({
  mode: 'history',
  base: 'http://localhost:4000/',
  routes
})

export default router
