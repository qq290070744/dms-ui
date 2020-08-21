<template>
  <basic-container>
    <a-table :dataSource="dataSource" :columns="columns" rowKey="id"></a-table>
  </basic-container>
</template>

<script>
import { getOutsouring } from '@/api/outsourcing'
import XLeader from './components/leader'
export default {
  components: {
    XLeader
  },
  data () {
    return {
      dataSource: [],
      columns: [
        {
          dataIndex: 'name',
          title: '组标识'
        },
        {
          dataIndex: 'display_name',
          title: '组名'
        },
        {
          dataIndex: '',
          title: '组长',
          width: 300,
          customRender: (_, group) => {
            return <x-leader group={group}/>
          }
        },
      ]
    }
  },
  mounted () {
    getOutsouring().then((dataSource) => {
      this.dataSource = dataSource
    })
  }
}
</script>

<style>

</style>
