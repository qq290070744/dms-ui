<template>
  <div class="redis-query-instance-list">
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
        columns,
        size: 'small'
      }
    }
  },
  computed: {
    ...mapGetters(['resources']),
    redisInstances () {
      return this.resources ? (this.resources.redis || []) : []
    }
  }
}
</script>

<style>
</style>
