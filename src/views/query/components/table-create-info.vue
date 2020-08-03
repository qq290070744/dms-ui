<template>
  <a-button type="link" @click="show">建表语句</a-button>
</template>

<script>
import { apiPostWorkOrderMysqlShowCreateTable } from '@/api/base-db-query'
import Modal from 'ant-design-vue/es/modal/Modal'

export default {
  props: {
    params: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    show () {
      const modal = Modal.info({
        title: '建表语句',
        content: <a-spin />,
        width: '60vw',
        onOk: () => {
          modal.destroy()
        }
      })
      apiPostWorkOrderMysqlShowCreateTable(this.params)
        .then(({ sql }) => {
          modal.update({
            content: (
              <x-monaco-editor height="30vw" language="mysql" value={sql} readOnly/>
            )
          })
        })
    }
  }
}
</script>

<style>

</style>
