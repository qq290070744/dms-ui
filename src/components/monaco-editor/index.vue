<template>
  <div class="ys-monaco-editor commands-wrapper">
    <div class="commands-content" :style="contentStyle" ref="target"></div>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'
import { waitRefShow } from '../../utils/util'
import throttle from 'lodash.throttle'
import suggestionStore from './suggestion'

const HAS_REGISTER = {}
const langSuggestions = {}
const langs = [
  'abap',
  'apex',
  'azcli',
  'bat',
  'cameligo',
  'clojure',
  'coffee',
  'cpp',
  'csharp',
  'csp',
  'css',
  'dockerfile',
  'fsharp',
  'go',
  'graphql',
  'handlebars',
  'html',
  'ini',
  'java',
  'javascript',
  'kotlin',
  'less',
  'lua',
  'markdown',
  'mips',
  'msdax',
  'mysql',
  'objective-c',
  'pascal',
  'pascaligo',
  'perl',
  'pgsql',
  'php',
  'postiats',
  'powerquery',
  'powershell',
  'pug',
  'python',
  'r',
  'razor',
  'redis',
  'redshift',
  'restructuredtext',
  'ruby',
  'rust',
  'sb',
  'scheme',
  'scss',
  'shell',
  'solidity',
  'sophia',
  'sql',
  'st',
  'swift',
  'tcl',
  'twig',
  'typescript',
  'vb',
  'xml',
  'yaml',
]
export default {
  name: 'XMonacoEditor',
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
      type: [Number, String],
      default: 200
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
    },
    contentStyle () {
      return {
        height: /^\d+(\.\d+)?$/.test(this.height + '') ? this.height + 'px' : this.height
      }
    }
  },
  watch: {
    suggestions: {
      immediate: true,
      handler (v) {
        if (v) {
          suggestionStore.insertSuggestions(v, this.language)
        }
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
    getSelectionValue () {
      return this.editor.getModel().getValueInRange(this.editor.getSelection())
    },
    initEditor () {
      this.registerLanguageSuggention()
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
        this.editor.addCommand(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
          () => {
            this.$emit('ctrl-enter', this.getValue(), this.editor.getPosition())
          }
        )
      }
      if (this.$listeners.change) {
        const change = throttle(() => {
          this.$listeners.change(this.getValue())
        }, 200)
        this.editor.getModel().onDidChangeContent(change)
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
      const lang = this.language
      if (HAS_REGISTER[lang]) {
        return
      }
      HAS_REGISTER[lang] = true
      if (langs.includes(lang)) {
        try {
          const langDef = require(`monaco-editor/esm/vs/basic-languages/${lang}/${lang}`)
          const { builtinFunctions, keywords, operators } = langDef.language
          langSuggestions[lang] = [
            ['函数', builtinFunctions],
            ['关键字', keywords],
            ['操作符', operators],
          ]
        } catch (e) {
          console.log(e)
        }
      }
      suggestionStore.insertSuggestions(langSuggestions[lang], this.language)
    },
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
