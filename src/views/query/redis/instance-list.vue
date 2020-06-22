<template>
  <basic-container>
    <div class="redis-query-instance-list--title"></div>
    <div class="redis-query-instance-list--table">
      <a-table
        v-bind="table"
        :dataSource="redisInstances"
      >
        <template #serial="text, record, index">
          <span>{{ index + 1 }}</span>
        </template>
        <template #actions="text, record">
          <router-link :to="{path: '/query/redis/' + record.id}">查询实例</router-link>
        </template>
      </a-table>
    </div>
  </basic-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    const columns = [{
      title: '#',
      width: 60,
      scopedSlots: { customRender: 'serial' }
    }, {
      title: '实例',
      dataIndex: 'name'
    }, {
      title: '操作',
      width: 200,
      scopedSlots: { customRender: 'actions' }
    }]
    return {
      table: {
        rowKey: 'id',
        columns
      }
    }
  },
  beforeRouteEnter (_f, _t, next) {
    // 重新获取用户信息，以获取新的授权实例
    next((vm) => vm.GetInfo())
  },
  computed: {
    ...mapGetters(['resources']),
    redisInstances () {
      return this.resources ? (this.resources.redis || []) : []
    }
  },
  methods: {
    ...mapActions(['GetInfo'])
  }
}
</script>

<style>
</style>
