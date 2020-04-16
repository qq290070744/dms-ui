<template>
  <div class="redis-query-instance-list">
    <div class="redis-query-instance-list--title"></div>
    <div class="redis-query-instance-list--table">
      <s-table
        v-bind="table"
      >
        <template #serial="text, record, index">
          <span>{{ index + 1 }}</span>
        </template>
        <template #actions="text, record">
          <router-link :to="{path: '/query/redis/' + record.id}">查询实例</router-link>
        </template>
      </s-table>
    </div>
  </div>
</template>

<script>
import * as redisApi from '@/api/redis'
import { STable } from '@/components'
export default {
  components: {
    STable
  },
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
        size: 'small',
        data: parameter => {
          return redisApi.instances({ ...parameter, ...this.queryParam })
            .then(result => result)
        }
      }
    }
  }
}
</script>

<style>
</style>
