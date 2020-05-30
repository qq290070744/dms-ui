import store from '@/store'
import unifiedAuth from 'ys-unified-auth'
import Cookies from 'js-cookie'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'

// bootstrap.js
function getAccessTokenFromCookie () {
  if (process.env.VUE_APP_LOCAL_TOKEN) {
    return process.env.VUE_APP_LOCAL_TOKEN
  }
  const config = { path: '/', domain: process.env.VUE_APP_COOKIE_DOMAIN }
  const prefix = process.env.VUE_APP_COOKIE_PREFIX
  const accessToken = Cookies.get(`${prefix}TOKEN`, config)
  return accessToken
}

function removeTokenFromCookie () {
  const config = { path: '/', domain: process.env.VUE_APP_COOKIE_DOMAIN }
  const prefix = process.env.VUE_APP_COOKIE_PREFIX
  Cookies.remove(`${prefix}TOKEN`, config)
}

const auth = {
  clientId: process.env.VUE_APP_AUTH_CLIENT_ID,
  responseType: process.env.VUE_APP_AUTH_RESPONSE_TYPE,
  scope: process.env.VUE_APP_AUTH_SCOPE,
  state: process.env.VUE_APP_STATE,
}

const config = {
  authHost: process.env.VUE_APP_AUTH_HOST,
  serverRedirectUri: process.env.VUE_APP_AUTH_AFTER_LOGIN,
  ...auth
}
const {
  genLoginUrl,
  genLogoutUrl,
} = unifiedAuth(config)

function clearAll () {
  store.commit('SET_TOKEN', '')
  store.commit('SET_ROLES', [])
  Vue.ls.remove(ACCESS_TOKEN)
  removeTokenFromCookie()
  return Promise.resolve(true)
}

function redirectToLogin () {
  clearAll().then(() => {
    window.location.href = genLoginUrl()
  })
}

function redirectToLogout () {
  clearAll().then(() => {
    window.location.href = genLogoutUrl()
  })
}

export {
  redirectToLogin,
  redirectToLogout,
  getAccessTokenFromCookie
}
