<template>
  <data-list
    :page="page"
    :filters="filters"
  />
</template>

<script>
import DataList from '../list'
import { myApplyList } from '@/api/export-data'

export default {
  components: {
    DataList,
  },
  data () {
    return {
      page: myApplyList,
      filters: [
        ['auditor', '审核人', {
          component: 'user-complete'
        }],
      ]
    }
  }
}
</script>

<style>

</style>
