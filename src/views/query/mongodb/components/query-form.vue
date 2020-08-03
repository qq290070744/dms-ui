<template>
  <a-form :form="form" layout="inline">
    <a-form-item label="集合">
      <a-select size="small" :options="tables" v-decorator="['tb_name', { rules: [{ required: true }] }]"/>
    </a-form-item>
    <a-form-item label="限制条数">
      <a-input-number size="small" v-decorator="['limit', { initialValue: 100 }]" :max="1000" :min="1"/>
    </a-form-item>
    <a-form-item label="排序">
      <a-input size="small" :options="tables" v-decorator="['sort', { rules: [{ validator: this.sortValidator }] }]"/>
    </a-form-item>
    <a-form-item>
      <a-button @click="doClick" :loading="loading" type="primary" size="small">查询</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  props: {
    tables: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: null
    }
  },
  created () {
    this.form = this.$form.createForm(this)
  },
  methods: {
    doClick () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        if (values.sort) {
          values.sort = JSON.parse(values.sort)
        } else {
          values.sort = {}
        }
        this.$emit('query', values)
      })
    },
    sortValidator (_r, value, callback) {
      if (!value) {
        callback()
      } else {
        try {
          JSON.parse(value)
          callback()
        } catch (_e) {
          callback(new Error('请填写JSON'))
        }
      }
    }
  }
}
</script>

<style scoped>
.ant-form {
  display: inline-block;
}
</style>
