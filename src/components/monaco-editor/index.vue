<template>
  <div class="commands-wrapper">
    <div class="commands-content" :style="contentStyle" ref="target"></div>
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
    },
    suggestions: {
      type: Array,
      default () {
        return []
      }
    },
    height: {
      type: Number,
      default: 300
    }
  },
  data () {
    return {
      editor: null,
      langSuggestions: []
    }
  },
  computed: {
    initialValue () {
      return Array.isArray(this.value) ? this.value.join('\n') : this.value
    },
    customSuggestions () {
      return this.suggestions.reduce((result, [detail, strList]) => {
        return result.concat(this.genSuggestion(strList, detail))
      }, [])
    },
    finalSuggestions () {
      return [...this.langSuggestions, ...this.customSuggestions]
    },
    contentStyle () {
      return {
        height: this.height + 'px'
      }
    }
  },
  mounted () {
    this.initEditor()
  },
  methods: {
    getEditor () {
      return this.editor
    },
    getValue () {
      return this.editor.getValue()
    },
    setValue (val) {
      this.editor.setValue(val)
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
        this.bindEvent()
      })
    },
    bindEvent () {
      if (this.$listeners['ctrl-enter']) {
        this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
          this.$emit('ctrl-enter', this.getValue())
        })
      }
    },
    genSuggestion (suggestionStrs, detail) {
      return suggestionStrs.map((kw) => {
        return {
          label: kw,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: kw,
          detail
        }
      })
    },
    registerLanguageSuggention () {
      try {
        const lang = this.language
        const langDef = require(`monaco-editor/esm/vs/basic-languages/${lang}/${lang}`)
        const { builtinFunctions, keywords, operators } = langDef.language

        this.langSuggestions = [
          ...this.genSuggestion(builtinFunctions, '函数'),
          ...this.genSuggestion(keywords, '关键字'),
          ...this.genSuggestion(operators, '操作符'),
        ]
      } catch (e) {
        console.log(e)
      }
    },
    registerSuggention () {
      this.registerLanguageSuggention()
      const that = this
      monaco.languages.registerCompletionItemProvider(this.language, {
        provideCompletionItems (model, position) {
          const word = model.getWordUntilPosition(position)
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
          }
          return {
            suggestions: that.finalSuggestions.map(s => ({ ...s, range }))
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
