<template>
  <div>
    <a-modal
      title="关联角色"
      :visible="visible"
      v-if="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirm-loading="confirmLoading"
      width="600px"
      :maskClosable="false"
    >
      <div class="role-label">角色列表：</div>
      <a-select
        placeholder="选择角色"
        show-search
        allowClear
        style="width: 300px"
        :filterOption="filterOption"
        @change="handleChange"
        :value="roleId"
      >
        <a-select-option v-for="item in roleList" :key="item.id" :value="item.id">
          {{ item.display_name }}
        </a-select-option>
      </a-select>
    </a-modal>
  </div>
</template>

<script>
import { getRoles } from '@/api/role'
import { associatedUserRole, getUserInfo } from '@/api/userList'

export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      roleList: [],
      userId: '',
      roleId: ''
    }
  },
  methods: {
    handleOk() {
      if (!this.roleId) {
        this.$message.warning('请选择角色')
        return
      }
      this.fetchAssociated()
    },
    fetchAssociated() {
      associatedUserRole({
        role_id: this.roleId,
        user_id: this.userId
      }).then(() => {
        this.$message.success('关联成功！')
        this.visible = false
        this.roleId = ''
      })
    },
    handleCancel() {
      this.visible = false
      this.roleId = ''
    },
    handleOpenModal(record) {
      this.userId = record.id
      getUserInfo(record.id).then(res => {
        this.roleId = res.role_id
      })
      this.visible = true
    },
    initData() {
      getRoles().then(res => {
        this.roleList = res.records
      })
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    handleChange(value) {
      this.roleId = value
    }
  },
  created() {
    this.initData()
  }
}
</script>

<style lang="less" scoped>
.role-label {
  display: inline-block;
}
</style>
