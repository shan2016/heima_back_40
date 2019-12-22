import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/Login.vue'
import Index from '@/views/Index.vue'
import Welcome from '@/views/Welcome.vue'
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
      component: Index,
      redirect: { name: 'Welcome' },
      children: [
        {
          name: 'Welcome',
          path: 'welcome',
          component: Welcome
        }
      ]
    }
  ]
})

export default router

// 添加导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    let token = localStorage.getItem('heima_40_back_token')
    // console.log(token)
    if (token) {
      next()
    } else {
      next({ path: `/login` })
    }
  }
})
