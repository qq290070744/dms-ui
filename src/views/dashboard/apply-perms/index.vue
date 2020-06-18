<template>
  <basic-container>
    <a-tabs v-model="tab">
      <a-tab-pane key="List" tab="我申请权限列表">
        <perms-work-order-list :key="refresh" :dataSource="dataSource" />
      </a-tab-pane>
      <a-tab-pane :key="type.MYSQL" tab="MySql 权限申请">
        <mysql-perms :key="refresh" @submit="submit" @to-list="refreshList" />
      </a-tab-pane>
      <a-tab-pane :key="type.REDIS" tab="Redis 权限申请">
        <redis-perms :key="refresh" @submit="submit" @to-list="refreshList" />
      </a-tab-pane>
    </a-tabs>
  </basic-container>
</template>

<script>
import { applyPerms, myApplyPermsWO } from '@/api/perms'
import MysqlPerms from './mysql'
import RedisPerms from './redis'
import { INSTANCE_TYPE } from './utils'
import PermsWorkOrderList from '@/views/work-order/perms-order/list'

export default {
  name: 'ApplyPerms',
  components: {
    PermsWorkOrderList,
    MysqlPerms,
    RedisPerms
  },
  data () {
    return {
      type: INSTANCE_TYPE,
      tab: 'List',
      refresh: 0
    }
  },
  methods: {
    submit ({ payload, resolve, reject }) {
      return applyPerms(payload).then(() => {
        resolve(true)
      }, reject)
    },
    dataSource (params) {
      return myApplyPermsWO(params)
    },
    refreshList () {
      this.tab = 'List'
      this.refresh++
    }
  }
}
</script>
