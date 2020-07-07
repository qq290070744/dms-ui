<template>
  <basic-container class="y-instances">
    <!-- create -->
    <div class="y-instances--function-row">
      <x-modal title="创建" :onOk="create">
        <template #default="{registerForm}" >
          <x-form :registerForm="registerForm" :fields="mysqlFields"></x-form>
        </template>
      </x-modal>
    </div>
    <!-- data list -->
    <a-table v-bind="table" @change="load">
      <template #serial="text, record, index">
        <span>{{ index + 1 }}</span>
      </template>
      <template #handler="text, record, index">
        <x-modal title="编辑" :onOk="(d) => update(d, record)">
          <template #default="{registerForm}">
            <x-form
              :registerForm="registerForm"
              :fields="mysqlFields"
              :initialValues="record"
            />
          </template>
        </x-modal>
        <a-popconfirm
          title="是否删除该实例?"
          @confirm="remove(record)"
        >
          <a-button type="danger">删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>
  </basic-container>
</template>

<script>
import {
  page as iPage,
  create as iCreate,
  update as iUpdate,
  remove as iRemove
} from '@/api/db-mysql'
import XModal from '@/components/Modal'
import XForm from '@/components/Modal/form'
import { calcTableBodyHeight } from '../../../utils/util'
import { mysqlFields } from '../redis/form'
export default {
  components: {
    XForm,
    XModal
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
            title: '用户名',
            dataIndex: 'username',
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
      },
      mysqlFields
    }
  },
  mounted () {
    this.load()
    window.addEventListener('resize', this.autoHeight)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.autoHeight)
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
    create (payload) {
      const req = iCreate(payload)
      req.then(() => {
        this.load()
      })
      return req
    },
    update (payload, record) {
      payload.id = record.id
      const req = iUpdate(payload)
      req.then(() => {
        this.load()
      })
      return req
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
        this.table.scroll.y = calcTableBodyHeight(this.$refs.table.$el)
      })
    }
  }
}
</script>

<style lang="less">
.y-instances {
  &--function-row {
    margin-bottom: 8px;
  }
}
</style>
