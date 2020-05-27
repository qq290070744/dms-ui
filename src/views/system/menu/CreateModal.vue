<template>
  <div>
    <a-modal
      :title="modalTile"
      :visible="visible"
      v-if="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirm-loading="confirmLoading"
      width="600px"
      class="container"
    >
      <a-form layout="inline" :form="form">
        <a-row>
          <a-form-item label="上级菜单" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
            <treeselect
              v-model="myForm.pid"
              :options="menuOptions"
              :normalizer="normalizer"
              :show-count="true"
              placeholder="选择上级菜单"
              style="width: 100%"
              noOptionsText="暂无数据"
              :disabled="editId ? true : false"
            />
          </a-form-item>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="菜单标题">
              <a-input
                placeholder="请输入菜单标题"
                v-decorator="[
                  'display_name',
                  { rules: [{ required: true, message: '请输入菜单标题' }] }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="显示排序">
              <a-input-number placeholder="请输入显示排序" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-form-item
            label="菜单图标"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 21 }"
            style="display: block"
          >
            <a-popover trigger="click" placement="bottomLeft" v-model="popoverVisible">
              <a-input
                placeholder="点击选择图标"
                readOnly
                style="width: 100%"
                v-decorator="['extras']"
              >
                <a-icon slot="prefix" :type="menuIcon" />
              </a-input>
              <IconSelect slot="content" style="width: 438px" @selectIcon="selectIcon" />
            </a-popover>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item label="菜单类型">
            <a-radio-group v-decorator="['type', { initialValue: 1 }]" @change="handleType">
              <a-radio :value="1">菜单</a-radio>
              <a-radio :value="2">按钮</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-row>
        <a-row v-if="radioType === 1">
          <a-col :span="12">
            <a-form-item label="路由名称">
              <a-input
                placeholder="请输入路由名称"
                v-decorator="['name', { rules: [{ required: true, message: '请输入路由名称' }] }]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="组件路径">
              <a-input
                placeholder="请输入组件路径"
                v-decorator="['path', { rules: [{ required: true, message: '请输入组件路径' }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="radioType === 2">
          <a-col :span="12">
            <a-form-item label="名称">
              <a-input
                placeholder="请输入名称"
                v-decorator="['name', { rules: [{ required: true, message: '请输入名称' }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-form-item label="菜单状态">
            <a-radio-group v-decorator="['status', { initialValue: 1 }]">
              <a-radio :value="1">显示</a-radio>
              <a-radio :value="0">隐藏</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { getMenuTree, createMenuTree, editMenu } from '@/api/menu'
import Treeselect from '@riophae/vue-treeselect'
import IconSelect from '@/components/IconSelect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  data() {
    return {
      form: this.$form.createForm(this),
      myForm: {},
      visible: false,
      modalTile: '',
      confirmLoading: false,
      // 菜单树选项
      menuOptions: [],
      isEdit: false,
      editId: null,
      menuIcon: 'search',
      popoverVisible: false,
      radioType: 1
    }
  },
  components: {
    Treeselect,
    IconSelect
  },
  methods: {
    handleOk() {
      if (!this.myForm.pid) {
        this.$message.error('请选择上级菜单')
        return
      }
      const _this = this
      this.form.validateFields((err, values) => {
        if (!err) {
          if (_this.isEdit) {
            _this.fetchEdit(values)
          } else {
            _this.fetchCreate(values)
          }
        }
      })
    },
    fetchCreate(values) {
      this.confirmLoading = true
      createMenuTree(this.getParams(values)).then(() => {
        this.$message.success('添加成功！')
        this.$emit('modalSuccess')
        this.confirmLoading = false
        this.visible = false
        this.menuIcon = 'search'
      })
    },
    fetchEdit(values) {
      this.confirmLoading = true
      editMenu(this.myForm.pid, this.getParams(values)).then(() => {
        this.$message.success('修改成功！')
        this.$emit('modalSuccess')
        this.confirmLoading = false
        this.visible = false
        this.menuIcon = 'search'
      })
    },
    getParams(values) {
      return {
        pid: this.myForm.pid,
        name: values.name,
        display_name: values.display_name,
        path: values.type === 1 ? values.path : values.name,
        status: values.status,
        type: values.type,
        extras: values.extras
      }
    },
    handleCancel() {
      this.visible = false
      this.myForm.pid = null
      this.menuIcon = 'search'
    },
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.display_name,
        children: node.children
      }
    },
    fetchMenuTree() {
      getMenuTree().then(res => {
        this.menuOptions = [res]
      })
    },
    handleCreate() {
      this.fetchMenuTree()
      this.visible = true
      this.isEdit = false
      this.modalTile = '添加菜单'
      this.editId = null
    },
    handleEdit(record) {
      this.fetchMenuTree()
      this.visible = true
      this.isEdit = true
      this.modalTile = '编辑菜单'
      // eslint-disable-next-line camelcase
      const { display_name, name, path, id, status, type, extras } = record
      this.$nextTick(() => {
        this.form.setFieldsValue({
          display_name,
          name,
          path,
          status,
          type,
          extras
        })
        this.myForm.pid = id
        this.editId = id
        this.menuIcon = extras
      })
    },
    //  当前菜单层级下的新建
    handleAdd(record) {
      this.fetchMenuTree()
      this.visible = true
      this.isEdit = false
      this.modalTile = '添加菜单'
      const { id } = record
      this.$nextTick(() => {
        this.myForm.pid = id
        this.editId = id
      })
    },
    selectIcon(icon) {
      this.menuIcon = icon
      this.form.setFieldsValue({
        extras: icon
      })
      this.popoverVisible = false
    },
    handleType(e) {
      this.radioType = e.target.value
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  .ant-row {
    margin-bottom: 10px;
  }
}
</style>
