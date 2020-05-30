// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'

import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './permission' // permission control
import './utils/filter' // global filter
import './components/global.less'

import GlobalLayout from './layouts/global-install'

Vue.config.productionTip = false

Vue.use(GlobalLayout)
// mount axios Vue.$http and this.$http
Vue.use(VueAxios)

Vue.prototype.$asyncEmit = function (name, payload) {
  return new Promise((resolve, reject) => {
    this.$emit(name, { payload, resolve, reject })
  })
}

new Vue({
  router,
  store,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
