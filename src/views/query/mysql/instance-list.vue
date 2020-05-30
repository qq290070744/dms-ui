<template>
  <basic-container>
    <div class="mysql-query-instance-list--title"></div>
    <div class="mysql-query-instance-list--table">
      <a-table
        v-bind="table"
        :dataSource="mysqlInstances"
      />
    </div>
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    const columns = [{
      title: '#',
      width: 60,
      customRender: (text, record, index) => {
        return <span>{ index + 1 }</span>
      }
    }, {
      title: '实例',
      dataIndex: 'name'
    }, {
      title: '操作',
      width: 200,
      customRender: (text, record, index) => {
        return <router-link to={{ path: '/query/mysql/' + record.id }}>查询实例</router-link>
      }
    }]
    return {
      table: {
        rowKey: 'id',
        columns
      }
    }
  },
  computed: {
    ...mapGetters(['resources']),
    mysqlInstances () {
      return this.resources ? (this.resources.mysql || []) : []
    }
  }
}
</script>
