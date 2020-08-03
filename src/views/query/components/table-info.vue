<template>
  <a-table
    class="mini-row-table"
    size="small"
    :bordered="true"
    :rowKey="rowKey"
    :scroll="scroll"
    :columns="columns"
    :dataSource="dataSource"
  />
</template>

<script>
import ATable from 'ant-design-vue/es/table/Table'
import { genHorizontalScroll } from '@/utils/util'
const { columns, scroll, rowKey, dataSource } = ATable.props
export default {
  props: {
    columns,
    scroll,
    rowKey,
    dataSource
  },
  data () {
    return {
      hScroll: genHorizontalScroll()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.hScroll.add(
        this.$el,
        this.$el.querySelector('.ant-table-body')
      )
    })
  },
  beforeDestroy () {
    this.hScroll.remove()
  }
}
</script>

<style>

</style>
