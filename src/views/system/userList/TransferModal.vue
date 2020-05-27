<template>
  <div>
    <a-modal
      title="database"
      :visible="visible"
      v-if="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirm-loading="confirmLoading"
      width="800px"
      :maskClosable="false"
    >
      <a-transfer
        showSearch
        :data-source="dataSource"
        :target-keys="targetKeys"
        :render="item => item.title"
        @selectChange="handleSelectChange"
        @change="handleChange"
      >
        <template
          slot="children"
          slot-scope="{
            props: { direction, filteredItems, selectedKeys, disabled: listDisabled },
            on: { itemSelectAll, itemSelect }
          }"
        >
          <a-table
            :row-selection="
              getRowSelection({ disabled: listDisabled, selectedKeys, itemSelectAll, itemSelect })
            "
            :columns="direction === 'left' ? tableColumns : tableColumns"
            :data-source="filteredItems"
            size="small"
            :style="{ pointerEvents: listDisabled ? 'none' : null }"
            :defaultPageSize="5"
            :custom-row="
              ({ key, disabled: itemDisabled }) => ({
                on: {
                  click: () => {
                    if (itemDisabled || listDisabled) return
                    itemSelect(key, !selectedKeys.includes(key))
                  }
                }
              })
            "
          />
        </template>
      </a-transfer>
    </a-modal>
  </div>
</template>

<script>
import difference from 'lodash/difference'
import { getDatabase, associatedUserDatabase, getUserInfo } from '@/api/userList'

const instanceDatabase = {
  1: 'mysql',
  2: 'redis',
  3: 'mongodb',
  4: 'pgsql'
}

const tableColumns = [
  {
    title: '实例名',
    dataIndex: 'title'
  },
  {
    title: '实例类型',
    dataIndex: 'type',
    customRender: text => instanceDatabase[text]
  }
]

export default {
  data() {
    return {
      tableColumns,
      visible: false,
      confirmLoading: false,
      dataSource: [],
      targetKeys: [],
      userId: null
    }
  },
  methods: {
    handleOpenModal(record) {
      this.userId = record.id
      getUserInfo(record.id).then(res => {
        this.targetKeys = res.db_ids ? res.db_ids.map(String) : []
      })
      this.visible = true
    },
    handleOk() {
      if (!this.targetKeys || this.targetKeys.length === 0) {
        return
      }
      const list = []
      this.dataSource.forEach(item => {
        if (this.targetKeys.includes(item.key)) {
          list.push({
            id: item.id,
            type: item.type
          })
        }
      })
      associatedUserDatabase({
        user_id: this.userId,
        dbs: list
      }).then(() => {
        this.$message.success('授权成功')
        this.visible = false
      })
    },
    handleCancel() {
      this.visible = false
    },
    handleChange(nextTargetKeys) {
      this.targetKeys = nextTargetKeys
    },
    handleSelectChange(sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys]
    },
    getRowSelection({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      return {
        getCheckboxProps: item => ({ props: { disabled: disabled || item.disabled } }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows.filter(item => !item.disabled).map(({ key }) => key)
          const diffKeys = selected
            ? difference(treeSelectedKeys, selectedKeys)
            : difference(selectedKeys, treeSelectedKeys)
          itemSelectAll(diffKeys, selected)
        },
        onSelect({ key }, selected) {
          itemSelect(key, selected)
        },
        selectedRowKeys: selectedKeys
      }
    }
  },
  created() {
    getDatabase().then(res => {
      const list = (res || []).map(item => {
        return {
          ...item,
          key: item.id.toString(),
          title: item.name
        }
      })
      this.dataSource = list
    })
  }
}
</script>

<style lang="less" scoped>
</style>
