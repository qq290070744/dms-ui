<template>
  <basic-container class="y-instances">
    <!-- create -->
    <div class="y-instances--function-row">
      <search-bar @searchForm="searchForm" />
      <x-modal title="创建" :onOk="create">
        <template #default="{registerForm}">
          <x-form :registerForm="registerForm" :fields="redisFields"></x-form>
        </template>
      </x-modal>
    </div>
    <!-- data list -->
    <a-table v-bind="table" @change="load">
      <template #serial="text, record, index">
        <span>{{ index + 1 }}</span>
      </template>
      <template #handler="text, record">
        <x-modal title="编辑" :onOk="d => update(d, record)">
          <template #default="{registerForm}">
            <x-form :registerForm="registerForm" :fields="redisFields" :initialValues="record" />
          </template>
        </x-modal>
        <a-popconfirm title="是否删除该实例?" @confirm="remove(record)">
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
} from '@/api/instances'
import XModal from '@/components/Modal'
import XForm from '@/components/Modal/form'
import { calcTableBodyHeight } from '@/utils/util'
import { redisFields } from './form'
import SearchBar from './search-bar'
import { DMS_INSTANCE_TYPE } from '@/utils/const'

export default {
  components: {
    XModal,
    XForm,
    SearchBar
  },
  data() {
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
            dataIndex: 'name'
          },
          {
            title: '类型',
            dataIndex: 'type',
            scopedSlots: { customRender: 'instanceType' },
            customRender: text => DMS_INSTANCE_TYPE.$label[text]
          },
          {
            title: '主机名',
            dataIndex: 'host'
          },
          {
            title: '端口',
            dataIndex: 'port'
          },
          {
            title: '备注',
            dataIndex: 'remark'
          },
          {
            title: '创建时间',
            dataIndex: 'created_time'
          },
          {
            title: '操作',
            width: 200,
            scopedSlots: { customRender: 'handler' }
          }
        ]
      },
      redisFields,
    }
  },
  mounted() {
    this.load()
    window.addEventListener('resize', this.autoHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.autoHeight)
  },
  methods: {
    load(parameters = {}) {
      parameters = { ...this.table.pagination, ...parameters }
      iPage(parameters).then(data => {
        const { records, ...pagination } = data
        this.table.dataSource = records
        this.table.pagination = pagination
        this.autoHeight()
      })
    },
    create(payload) {
      const req = iCreate(payload)
      req.then(() => {
        this.load()
      })
      return req
    },
    update(payload, record) {
      payload.id = record.id
      const req = iUpdate(payload)
      req.then(() => {
        this.load()
      })
      return req
    },
    remove(record) {
      iRemove(record).then(
        () => {
          this.$message.success('删除成功')
          this.load()
        },
        () => {
          this.$message.warn('删除失败')
        }
      )
    },
    autoHeight() {
      this.$nextTick(() => {
        this.table.scroll.y = calcTableBodyHeight(this.$refs.table.$el)
      })
    },
    searchForm(form) {
      this.table.pagination.current = 1
      this.load(form)
    }
  }
}
</script>

<style lang="less">
.y-instances {
  &--function-row {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
  }
}
</style>
