import Vue from 'vue'
import VueRouter from 'vue-router'
import Store from '@/store/index.js'
import { SET_NAME } from '@/store/mutation-types'
import routes from '@/router/routes.js'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export async function beforeEach(to, from, next) {
  if (!from.name) {
    await Store.dispatch(`auth/${SET_NAME}`)
  }
  next()
}

export function beforeResolve(to, from, next) {
  let userName = Store.state.auth.userName
  if (to.meta.forGuest && userName) {
    next('/') // ログイン済み
  } else if (to.meta.isPublic || userName) {
    next()
  } else if (to.path === '/') {
    next('/about')
  } else {
    next('/login')
  }
}

router.beforeEach((to, from, next) => beforeEach(to, from, next))
router.beforeResolve((to, from, next) => beforeResolve(to, from, next))

export default router
