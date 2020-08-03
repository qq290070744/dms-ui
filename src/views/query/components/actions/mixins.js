export default {
  props: {
    params: {
      type: Function,
      default: () => () => undefined
    },
    cb: {
      type: Function,
      default: () => () => undefined
    }
  },
  methods: {
    action () {
      return Promise.resolve(true)
    },
    _action () {
      const params = this.params()
      if (!params) {
        return
      }
      this.action(params)
        .then((result) => {
          this.cb(result, params, true)
        }, (result) => {
          this.cb(result, params, false)
        })
    }
  }
}
