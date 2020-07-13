<template>
  <basic-container>
    <div class="instance-list">
      <a-table
        v-bind="table"
        :dataSource="instances"
      >
      </a-table>
    </div>
  </basic-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    resourceKey: {
      required: true,
      type: String,
      default: ''
    }
  },
  data () {
    const columns = [{
      title: '#',
      width: 60,
      customRender: (_, __, index) => {
        return <span>{ index + 1 }</span>
      }
    }, {
      title: '实例',
      dataIndex: 'name'
    }, {
      title: '操作',
      width: 200,
      customRender: (_, record) => {
        return <router-link to={{
          path: `/query/${this.resourceKey}/${record.id}`
        }}>查询实例</router-link>
      }
    }]
    return {
      table: {
        rowKey: 'id',
        columns
      }
    }
  },
  beforeRouteEnter (_f, _t, next) {
    // 重新获取用户信息，以获取新的授权实例
    next((vm) => vm.GetInfo())
  },
  computed: {
    ...mapGetters(['resources']),
    instances () {
      return this.resources
        ? (
          this.resources[this.resourceKey] || []
        )
        : []
    }
  },
  methods: {
    ...mapActions(['GetInfo'])
  }
}
</script>

<style>
</style>
