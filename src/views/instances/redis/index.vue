<template>
  <div class="y-instances-redis">
    <!-- create -->
    <div class="y-instances-redis--function-row">
      <form-wrapper>
        <template #default="{close}">
          <create-record @submit="(payload) => create(payload, close)"></create-record>
        </template>
      </form-wrapper>
    </div>
    <!-- data list -->
    <a-table v-bind="table">
      <template #serial="text, record, index">
        <span>{{ index + 1 }}</span>
      </template>
      <template #handler="text, record, index">
        <form-wrapper placement="left">
          <template #default="{close}">
            <create-record :initial="record" @submit="(payload) => update(payload, close, record)"></create-record>
          </template>
          <template #open="{show}">
            <a-button type="primary" @click="() => show()">编辑</a-button>
          </template>
        </form-wrapper>
        <a-popconfirm
          title="是否删除该实例?"
          @confirm="remove(record)"
        >
          <a-button type="danger">删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>

<script>
import {
  page as iPage,
  create as iCreate,
  update as iUpdate,
  remove as iRemove
} from '@/api/db-redis'
import CreateRecord from './create'
import FormWrapper from './form-wrapper'
export default {
  components: {
    FormWrapper,
    CreateRecord
  },
  data () {
    return {
      table: {
        ref: 'table',
        rowKey: 'id',
        scroll: { y: 0 },
        dataSource: [],
        pagination: {},
        columns: [
          {
            title: '#',
            width: 60,
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '名称',
            dataIndex: 'name',
          },
          {
            title: '主机名',
            dataIndex: 'host',
          },
          {
            title: '端口',
            dataIndex: 'port',
          },
          {
            title: '备注',
            dataIndex: 'remark',
          },
          {
            title: '创建时间',
            dataIndex: 'created_time',
          },
          {
            title: '操作',
            width: 200,
            scopedSlots: { customRender: 'handler' }
          }
        ]
      }
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load (parameters = {}) {
      parameters = { ...this.table.pagination, ...parameters }
      iPage(parameters).then((data) => {
        const { records, ...pagination } = data
        this.table.dataSource = records
        this.table.pagination = pagination
        this.autoHeight()
      })
    },
    create ({ payload, resolve, reject }, closeDrawer) {
      return iCreate(payload).then(() => {
        this.$message.success('创建成功')
        resolve()
        closeDrawer()
        this.load()
      }, (e) => {
        this.$message.warn(e.message || '创建失败')
        reject()
      })
    },
    update ({ payload, resolve, reject }, closeDrawer, record) {
      payload.id = record.id
      return iUpdate(payload).then(() => {
        this.$message.success('编辑成功')
        resolve()
        closeDrawer()
        this.load()
      }, (e) => {
        this.$message.warn(e.message || '编辑失败')
        reject()
      })
    },
    remove (record) {
      iRemove(record).then(() => {
        this.$message.success('删除成功')
        this.load()
      }, () => {
        this.$message.warn('删除失败')
      })
    },
    autoHeight () {
      this.$nextTick(() => {
        const tableEl = this.$refs.table.$el
        const thead = tableEl.querySelector('.ant-table-thead')
        const { top, height } = tableEl.getBoundingClientRect()
        const bodyHeight = document.body.clientHeight
        // 底部溢出
        const overflow = top + height - bodyHeight
        const tbodyHeight = bodyHeight - top - (thead ? thead.clientHeight : 0) - overflow
        this.table.scroll.y = tbodyHeight
      })
    }
  }
}
</script>

<style lang="less">
.y-instances-redis {
  &--function-row {
    margin-bottom: 8px;
  }
}
</style>
