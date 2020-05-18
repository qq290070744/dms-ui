<template>
  <a-form v-bind="formOption">
    <a-form-item label="工单内容(命令)">
      <monaco-editor :value="commands" ref="editor"></monaco-editor>
    </a-form-item>
    <a-form-item label="审核人">
      <a-select
        v-decorator="[
          'auditor_id',
          { rules: [{ required: true, message: '审核人不能为空' }] },
        ]"
        placeholder="请选择审核人"
        :options="auditors"
      ></a-select>
    </a-form-item>
    <a-form-item label="工单说明">
      <a-textarea
        v-decorator="[
          'remark'
        ]"
      ></a-textarea>
    </a-form-item>
  </a-form>
</template>

<script>
import MonacoEditor from '@/components/monaco-editor'
function str (val) {
  return /^\d+|"(?:[^"\\]|\\.)*"$/.test(val) ? val : JSON.stringify(val)
}
export default {
  components: {
    MonacoEditor
  },
  props: {
    actionObject: {
      type: Object,
      default: null
    },
    auditors: {
      type: Array,
      default () { return [] }
    }
  },
  created () {
    this.formOption.form = this.$form.createForm(this)
  },
  data () {
    return {
      loading: false,
      formOption: {
        form: null,
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      }
    }
  },
  computed: {
    commands () {
      const commands = this.actionObject && this.actionObject.commands
      return commands ? commands.join('\n') : ''
    }
  },
  methods: {
    submit () {
      return new Promise((resolve, reject) => {
        this.formOption.form.validateFields((err, values) => {
          if (!err) {
            values.actions = this.getCommands()
            resolve(values)
          } else {
            reject(err)
          }
        })
      })
    },
    getCommands () {
      const lines = this.$refs.editor.getPrettyValue()
      return lines.map((line) => {
        const array = line.match(/"(?:[^"\\]|\\.)*"|\d+|[^\s]+/g)
        return array.map((v, i) => i > 0 ? str(v) : v).join(' ')
      })
    },
  }
}
</script>

<style scoped>
.ant-btn {
  margin-left: 100px;
}
.commands-wrapper {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px;
  box-sizing: border-box;
}
.commands-content {
  height: 300px;
}
</style>
