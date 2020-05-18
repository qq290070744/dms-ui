<template>
  <div class="commands-wrapper">
    <div class="commands-content" ref="target"></div>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'
import { waitRefShow } from '../../utils/util'
export default {
  props: {
    language: {
      type: String,
      default: 'redis'
    },
    value: {
      type: [String, Array],
      default () { return '' }
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editor: null
    }
  },
  computed: {
    initialValue () {
      return Array.isArray(this.value) ? this.value.join('\n') : this.value
    }
  },
  mounted () {
    this.initEditor()
  },
  methods: {
    getValue () {
      return this.editor.getValue()
    },
    getPrettyValue () {
      return this.getValue().split('\n').map(command => command.trim().replace(/\s+/g, ' ')).filter(v => !!v)
    },
    initEditor () {
      waitRefShow(this, 'target').then((ref) => {
        this.editor = monaco.editor.create(ref, {
          value: this.initialValue,
          readOnly: this.readOnly,
          language: this.language
        })
      })
    }
  }
}
</script>

<style scoped>
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
