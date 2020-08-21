<template>
  <basic-container>
    <perms-work-order-list :dataSource="dataSource" :auditor="true">
      <template #operation="record">
        <span v-if="record.status === 1">
          <a-popconfirm title="确认通过该项权限申请？" @confirm="pass(record)">
            <a-button type="primary" size="small">通过</a-button>
          </a-popconfirm>
          <a-popconfirm title="确认驳回该项权限申请？" @confirm="reject(record)">
            <a-button type="danger" size="small">驳回</a-button>
          </a-popconfirm>
        </span>
      </template>
    </perms-work-order-list>
  </basic-container>
</template>

<script>
import { myAuditPermsWO, approvePermsWO, rejectPermsWO } from '@/api/perms'
import PermsWorkOrderList from './list'
export default {
  components: {
    PermsWorkOrderList
  },
  data () {
    return {}
  },
  methods: {
    dataSource (params) {
      return myAuditPermsWO(params)
    },
    pass (record) {
      approvePermsWO(record.id).then(() => {
        this.$message.success('操作成功')
        record.status = 3
      })
    },
    reject (record) {
      rejectPermsWO(record.id).then(() => {
        this.$message.success('操作成功')
        record.status = 2
      })
    }
  }
}
</script>

<style>

</style>
