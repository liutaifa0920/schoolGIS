import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import CesuimView from './views/CesuimView.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/CesuimView',
      name: 'CesuimView',
      component: CesuimView
    }
  ]
})
