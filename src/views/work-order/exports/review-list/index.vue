<template>
  <data-list
    :page="page"
    :operation="operation"
  />
</template>

<script>
import DataList from '../list'
import Action from '../../components/action'
import { myReviewList, approveApply, rejectApply } from '@/api/export-data'

export default {
  components: {
    DataList,
    Action,
  },
  data () {
    return {
      page: myReviewList,
      operation: {
        title: '操作',
        width: 100,
        customRender: (_t, { id, status }) => {
          if (status !== 1) {
            return
          }
          return <action onPass={() => approveApply(id)} onReject={() => rejectApply(id)}/>
        }
      }
    }
  },
  methods: {
    pass ({ id }) {
      approveApply(id)
    }
  }
}
</script>

<style>

</style>
