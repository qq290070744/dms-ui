<template>
  <div>
    <a-modal
      :title="modalTitle"
      :visible="visible"
      v-if="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirm-loading="confirmLoading"
      width="600px"
      class="container"
      :maskClosable="false"
    >
      <a-form-model
        :model="form"
        :rules="rules"
        ref="ruleForm"
        layout="horizontal"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="角色名称" prop="display_name">
          <a-input placeholder="请输入角色名称" v-model="form.display_name" />
        </a-form-model-item>
        <a-form-model-item label="权限字符" prop="name">
          <a-input
            placeholder="请输入权限字符"
            v-model="form.name"
            :disabled="isEdit ? true : false"
          />
        </a-form-model-item>
        <a-form-model-item label="顺序" prop="shunxu">
          <a-input-number placeholder="请输入顺序" v-model="form.shunxu" style="width: 100%" />
        </a-form-model-item>
        <a-form-model-item label="菜单权限">
          <a-tree
            checkable
            :tree-data="menuTree"
            :replaceFields="replaceFields"
            v-model="form.menuIds"
            @check="onCheck"
          >
          </a-tree>
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-radio-group v-model="form.status">
            <a-radio :value="1">显示</a-radio>
            <a-radio :value="0">隐藏</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="备注" prop="remark">
          <a-textarea placeholder="请输入备注" v-model="form.remark" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { createRole, editRole, getRoleDetail } from '@/api/role'
import { getMenuTree } from '@/api/menu'

export default {
  data() {
    return {
      form: {
        display_name: '',
        name: '',
        status: 1,
        menuIds: [],
        remark: ''
      },
      rules: {
        display_name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        name: [{ required: true, message: '请输入权限字符', trigger: 'blur' }]
      },
      modalTitle: '添加角色',
      visible: false,
      confirmLoading: false,
      roleList: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      },
      menuTree: [],
      replaceFields: {
        title: 'display_name',
        key: 'id'
      },
      isEdit: false,
      editId: null
    }
  },
  methods: {
    handleOk() {
      const _this = this
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (_this.isEdit) {
            _this.fetchEdit()
          } else {
            _this.fetchCreate()
          }
        }
      })
    },
    fetchCreate() {
      this.confirmLoading = true
      createRole(this.getParams()).then(() => {
        this.$message.success('添加成功！')
        this.$emit('modalSuccess')
        this.confirmLoading = false
        this.visible = false
        this.resetForm()
      })
    },
    fetchEdit() {
      this.confirmLoading = true
      editRole(this.editId, this.getParams()).then(() => {
        this.$message.success('修改成功！')
        this.$emit('modalSuccess')
        this.confirmLoading = false
        this.visible = false
        this.resetForm()
      })
    },
    getParams() {
      const { form } = this
      return {
        display_name: form.display_name,
        name: form.name,
        remark: form.remark,
        menu_ids: form.menuIds,
        status: form.status
      }
    },
    handleCancel() {
      this.visible = false
      this.resetForm()
    },
    handleCreate() {
      this.visible = true
      this.isEdit = false
      this.modalTitle = '添加角色'
      this.editId = null
    },
    fetchMenuTree() {
      getMenuTree().then(res => {
        this.menuTree = res.children
      })
    },
    onCheck(checkedKeys) {
      this.form.menuIds = checkedKeys
    },
    handleEdit(record) {
      this.visible = true
      this.isEdit = true
      this.modalTitle = '编辑角色'
      // eslint-disable-next-line camelcase
      const { display_name, name, status, remark } = record
      this.form = {
        display_name,
        name,
        status,
        remark
      }
      this.editId = record.id
      const _this = this
      getRoleDetail(this.editId).then(res => {
        _this.$set(this.form, 'menuIds', res.menus || [])
      })
    },
    resetForm() {
      this.form = {
        display_name: '',
        name: '',
        status: 1,
        menuIds: [],
        remark: ''
      }
    }
  },
  created() {
    this.fetchMenuTree()
  }
}
</script>

<style lang="less" scoped>
</style>
