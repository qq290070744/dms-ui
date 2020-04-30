import Vue from 'vue'
import axios from 'axios'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios-plugin'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getAccessTokenFromCookie, redirectToLogin } from './unified-auth'

const ERROR_CODE = 1

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 6000 // 请求超时时间
})

const err = (error) => {
  if (typeof error === 'string') {
    return Promise.reject(new Error(error))
  }

  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        redirectToLogin()
        // store.dispatch('Logout').then(() => {
        //   setTimeout(() => {
        //     window.location.reload()
        //   }, 1500)
        // })
      }
    } else {
      const { status, data, statusText } = error.response
      notification.error({
        message: data.code || status,
        description: data.msg || statusText
      })
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = getAccessTokenFromCookie() || Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['Authorization'] = token.replace('+', ' ') // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  const responseData = response.data
  // 处理业务逻辑
  if (responseData.code !== undefined && responseData.msg !== undefined) {
    if (responseData.code === ERROR_CODE) {
      return err(responseData.msg)
    } else {
      // 返回真正的业务数据
      return responseData.data || responseData.result
    }
  } else {
    return response.data
  }
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
