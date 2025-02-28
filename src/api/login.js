import { axios } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return axios({
    url: '/login',
    method: 'post',
    data: parameter
  })
}

export function logout () {
  return axios({
    url: '/auth/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getInfo () {
  return axios({
    url: '/auth/user/info',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getCurrentUserNav (token) {
  return axios({
    url: '/user/nav',
    method: 'get'
  })
}

export function getSmsCaptcha (parameter) {
  return axios({
    url: 'api.SendSms',
    method: 'post',
    data: parameter
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return axios({
    url: 'api.twoStepCode',
    method: 'post',
    data: parameter
  })
}
