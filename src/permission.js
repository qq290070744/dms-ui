import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getAccessTokenFromCookie, redirectToLogin } from '@/utils/unified-auth'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`))

  const onSuccess = res => {
    const roles = res.result && res.result.role
    store.dispatch('GenerateRoutes', { roles }).then(() => {
      // 根据roles权限生成可访问的路由表
      // 动态添加可访问路由表
      router.addRoutes(store.getters.addRouters)
      // 请求带有 redirect 重定向时，登录自动重定向到该地址
      const redirect = decodeURIComponent(from.query.redirect || to.path)
      if (to.path === redirect) {
        // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        next({ ...to, replace: true })
      } else {
        // 跳转到目的路由
        next({ path: redirect })
      }
    })
  }
  const onFail = (e) => {
    console.log(e)
    notification.error({
      message: '错误',
      description: '请求用户信息失败，请重试'
    })
    // store.dispatch('Logout').then(() => {
    //   next({ path: '/user/login', query: { redirect: to.fullPath } })
    // })
    redirectToLogin()
  }
  if (getAccessTokenFromCookie() || Vue.ls.get(ACCESS_TOKEN)) {
    if (store.getters.roles.length === 0) {
      store.dispatch('GetInfo').then(onSuccess, onFail)
    } else {
      next()
    }
  } else {
    NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    // todo: auth login
    console.log('todo: auth login')
    redirectToLogin()
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
