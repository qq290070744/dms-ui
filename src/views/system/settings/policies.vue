<template>
  <div class="container" :style="{height: height}">
    <a-form layout="inline" :form="form">
      <div class="content">
        <a-form-item class="item" :key="p.name" :labelCol="{span: 11}" v-for="p in policies">
          <template #label>
            <span>
              <span>{{ p.name }}</span>
              <a-tooltip placement="top" :title="p.remark">
                <a-icon type="question-circle" />
              </a-tooltip>
            </span>
          </template>
          <x-prop :type="p.type" v-decorator="[p.name, { initialValue: p.value }]"/>
        </a-form-item>
      </div>
    </a-form>
    <div class="submit">
      <a-button type="primary" @click="submit" :loading="loading">
        提交
      </a-button>
    </div>
  </div>
</template>

<script>
import XProp from './prop.jsx'
import { getPolicies, setPolicies } from '@/api/settings'
export default {
  components: {
    XProp
  },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      form: null,
      initial: { name: 10 },
      policies: [],
      height: '100%',
      loading: false
    }
  },
  created() {
    this.form = this.$form.createForm(this)
    getPolicies(this.type).then((policies) => {
      this.policies = policies
      this.initHeight()
    })
  },
  methods: {
    initHeight () {
      this.$nextTick(() => {
        const padding = 40
        const { top } = this.$el.getBoundingClientRect()
        this.height = window.innerHeight - top - padding + 'px'
      })
    },
    submit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          setPolicies(values, this.type).then(() => {
            this.loading = false
            this.$message.success('设置成功')
          }, () => {
            this.loading = false
            this.$message.fail('设置失败')
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.container {
  display: flex;
  flex-direction: column;
}
.ant-form.ant-form-inline {
  flex: 1;
  overflow: auto;
}
.submit {
  border-top: 1px solid #ccc;
  height: 50px;
  padding: 16px;
  display: flex;
  justify-content: center;
}
.item {
  width: 45%;
}
.anticon-question-circle {
  margin-left: 8px;
  color: #999;
  cursor: pointer;
  &:hover {
    color: #666;
  }
}
</style>
