<template>
  <div class="upload-container">
    <a-upload
      name="avatar"
      :show-upload-list="false"
      :customRequest="action"
    >
      <a-button> <a-icon type="upload" /> 点击上传文件并预览SQL </a-button>
    </a-upload>
    <a-spin :spinning="loading" tip="上传中">
      <monaco-editor ref="monaco" readOnly language="mysql"></monaco-editor>
    </a-spin>
  </div>
</template>
<script>
import MonacoEditor from '@/components/monaco-editor'
import { apiPostSqlFileWorkOrderUploadSqlFile } from '@/api/work-order'

function readFile (file, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsText(file)
}

export default {
  components: {
    MonacoEditor
  },
  data() {
    return {
      loading: true
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    action ({ file }) {
      this.loading = true
      const formData = new FormData()
      formData.append('sql_file', file)
      const upload = apiPostSqlFileWorkOrderUploadSqlFile(formData)
      upload.then(({ sql_file_path }) => {
        this.triggerChange(sql_file_path)
        this.loading = false
      })
      readFile(file, (result) => {
        this.$nextTick(() => {
          this.$refs.monaco.setValue(result)
        })
      })
      return upload
    },
    triggerChange(changedValue) {
      this.$emit('change', changedValue)
    },
  },
}
</script>
<style scoped>
</style>
