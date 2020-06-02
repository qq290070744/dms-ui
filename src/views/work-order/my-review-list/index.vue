<template>
  <basic-container class="my-review-list">
    <work-order-list :dataSource="dataSource"></work-order-list>
  </basic-container>
</template>

<script>
import { myReviewWorkOrder } from '@/api/work-order'
import WorkOrderList from '../list'
export default {
  components: {
    WorkOrderList,
  },
  data () {
    return {}
  },
  methods: {
    dataSource (params) {
      return myReviewWorkOrder(params)
    }
  }
}
</script>

<style>

</style>
