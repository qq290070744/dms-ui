<template>
  <basic-container class="my-review-list">
    <work-order-list :dataSource="dataSource">
    </work-order-list>
  </basic-container>
</template>

<script>
import { apiGetWorkOrderMyAssignedOrder } from '@/api/work-order'
import WorkOrderList from '../modify-order/list'

export default {
  components: {
    WorkOrderList
  },
  data () {
    return {}
  },
  methods: {
    dataSource (params) {
      return apiGetWorkOrderMyAssignedOrder(params)
    }
  }
}
</script>

<style>

</style>
