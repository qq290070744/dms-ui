<template>
  <div class="upload-container">
    <a-upload
      name="avatar"
      :show-upload-list="false"
      :customRequest="action"
      @change="handleChange"
    >
      <a-button> <a-icon type="upload" /> 点击上传文件并预览SQL </a-button>
    </a-upload>
    <monaco-editor ref="monaco" readOnly language="mysql"></monaco-editor>
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
      loading: false
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        this.loading = false
      }
    },
    action ({ file }) {
      const formData = new FormData()
      formData.append('sql_file', file)
      const upload = apiPostSqlFileWorkOrderUploadSqlFile(formData)
      upload.then(({ sql_file_path }) => {
        this.triggerChange(sql_file_path)
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
