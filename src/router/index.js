import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap } from '@/config/router.config'
import { listenerRoute } from '@/components/MultiTab/title'

// hack router push callback
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

listenerRoute(router)

export default router
