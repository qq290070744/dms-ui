import store from '@/store'
import unifiedAuth from 'ys-unified-auth'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'

const auth = {
  clientId: process.env.VUE_APP_AUTH_CLIENT_ID,
  responseType: process.env.VUE_APP_AUTH_RESPONSE_TYPE,
  scope: process.env.VUE_APP_AUTH_SCOPE,
  state: process.env.VUE_APP_STATE,
}

const clear = () => {
  store.commit('SET_TOKEN', '')
  store.commit('SET_ROLES', [])
  Vue.ls.remove(ACCESS_TOKEN)
}

const config = {
  authHost: process.env.VUE_APP_AUTH_HOST,
  serverRedirectUri: process.env.VUE_APP_AUTH_AFTER_LOGIN,
  ...auth,
  cookieConfig: {
    key: `${process.env.VUE_APP_COOKIE_PREFIX}TOKEN`,
    domain: process.env.VUE_APP_COOKIE_DOMAIN
  },
  tokenConfig: {
    before: (token) => token.replace('+', ' '),
    local: process.env.VUE_APP_LOCAL_TOKEN
  },
  beforeLogin: clear,
  beforeLogout: clear
}
const {
  redirectToLogin,
  redirectToLogout,
  hasAccessToken,
  getAccessToken: getAccessTokenFromCookie,
} = unifiedAuth(config)

export {
  redirectToLogin,
  redirectToLogout,
  hasAccessToken,
  getAccessTokenFromCookie,
}
