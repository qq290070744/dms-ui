<template>
  <a-modal
    title="关联API"
    :visible="visible"
    v-if="visible"
    width="600px"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-transfer
      showSearch
      :data-source="dataSource"
      :target-keys="targetKeys"
      :selected-keys="selectedKeys"
      :list-style="{
        width: '250px',
        height: '300px'
      }"
      :render="record => record.display_name"
      @selectChange="handleSelectChange"
      @change="handleChange"
    />
  </a-modal>
</template>

<script>
import { getApiList, associatedApi, getApiListByMenu } from '@/api/menu'

export default {
  data() {
    return {
      visible: false,
      dataSource: [],
      targetKeys: [],
      selectedKeys: [],
      value: 1,
      menuId: null
    }
  },
  methods: {
    handleCancel() {
      this.visible = false
    },
    handleOk() {
      if (!this.targetKeys || this.targetKeys.length === 0) {
        return
      }
      associatedApi({
        menu_id: this.menuId,
        actions: this.targetKeys.map(Number)
      }).then(() => {
        this.$message.success('关联成功！')
        this.$emit('transferSuccess')
        this.visible = false
      })
    },
    handleChange(nextTargetKeys) {
      this.targetKeys = nextTargetKeys
    },
    handleSelectChange(sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys]
    },
    open(record) {
      this.visible = true
      this.targetKeys = []
      this.selectedKeys = []
      this.menuId = record.id
      getApiListByMenu(this.menuId).then(res => {
        this.targetKeys = res ? res.map(String) : []
      })
    }
  },
  created() {
    getApiList().then(res => {
      const list = (res || []).map(item => {
        return {
          ...item,
          key: item.id.toString(),
          title: item.id.toString()
        }
      })
      this.dataSource = list
    })
  }
}
</script>

<style lang="less" scoped>
</style>
