<template>
  <data-list
    :page="page"
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
      page: myApplyList
    }
  }
}
</script>

<style>

</style>
