<template>
  <data-list
    ref="list"
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
        width: 150,
        customRender: (_t, { id, status }) => {
          if (status !== 1) {
            return
          }
          return <action
            onPass={() => this.doAction(id, approveApply)}
            onReject={() => this.doAction(id, rejectApply)}
          />
        }
      }
    }
  },
  methods: {
    doAction (id, action) {
      action(id)
        .then(() => {
          this.$refs.list.refresh()
        })
    }
  }
}
</script>

<style>

</style>
