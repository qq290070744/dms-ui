<template>
  <x-wrapper :title="title" :loading="!data" :empty="data && !data.length">
    <a-table
      :scroll="{ y: height }"
      :columns="columns"
      :dataSource="data"
      :pagination="false"
      size="middle"
      :rowKey="rowKey"
    />
  </x-wrapper>
</template>

<script>

import XWrapper from '../wrapper'
const columns = [
  {
    dataIndex: 'DataBase',
    title: '数据库'
  },
  {
    dataIndex: 'Type',
    title: '类型'
  },
  {
    dataIndex: 'inst_name',
    title: '实例'
  },
  {
    dataIndex: 'C',
    title: '数量',
    width: 80
  }
]
export default {
  components: {
    XWrapper
  },
  props: {
    data: {
      type: Array,
      default: () => null
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      columns,
      height: 230,
      rowKey: (r) => `${r.Type},${r.inst_name},${r.DataBase}`
    }
  }
}
</script>
