<template>
  <div class="commands-wrapper">
    <div class="commands-content" ref="target"></div>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'
import { language as mysqlDef } from 'monaco-editor/esm/vs/basic-languages/mysql/mysql'
import { language as redisDef } from 'monaco-editor/esm/vs/basic-languages/redis/redis'
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
    },
    suggestions: {
      type: Array,
      default () {
        return []
      }
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
      this.registerSuggention()
      waitRefShow(this, 'target').then((ref) => {
        this.editor = monaco.editor.create(ref, {
          value: this.initialValue,
          readOnly: this.readOnly,
          language: this.language
        })
      })
    },
    genSuggestion (...args) {
      args = args.reduce((result, arg) => {
        return result.concat(arg)
      }, [])
      return args.map((kw) => {
        return {
          label: kw,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: kw,
        }
      })
    },
    registerSuggention () {
      const defs = {
        mysql: mysqlDef,
        redis: redisDef
      }
      const lang = this.language
      const { builtinFunctions, keywords, operators } = defs[lang]
      monaco.languages.registerCompletionItemProvider(lang, {
        provideCompletionItems: () => {
          return {
            suggestions: this.genSuggestion(builtinFunctions, keywords, operators)
          }
        }
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
