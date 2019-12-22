import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/Login.vue'
import Index from '@/views/Index.vue'
Vue.use(VueRouter)

let router = new VueRouter({
  routes: [
    {
      name: 'Login',
      path: '/login',
      component: Login
    },
    {
      name: 'Index',
      path: '/index',
      component: Index
    }
  ]
})

export default router
