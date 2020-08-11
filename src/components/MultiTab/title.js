import events from './events'
import store from '@/store'
export function listenerRoute (router) {
  router.beforeEach((to, _from, next) => {
    const id = to.params.instance_id
    if (to.params.instance_id) {
      const map = store.getters.resourceMap[to.meta.resourceKey] || {}
      const title = map[id] ? map[id].name : ''
      events.$emit('extra', {
        key: to.fullPath,
        name: `${title} `
      })
    }
    next()
  })
}
