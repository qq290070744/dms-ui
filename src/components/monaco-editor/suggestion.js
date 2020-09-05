import * as monaco from 'monaco-editor'
import Vue from 'vue'
const suggestionStore = new Vue({
  data () {
    return {
      list: [],
      map: {},
      langs: {}
    }
  },
  methods: {
    registerProvider (lang) {
      const that = this
      monaco.languages.registerCompletionItemProvider(lang, {
        provideCompletionItems (model, position) {
          const word = model.getWordUntilPosition(position)
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
          }
          return {
            suggestions: that.list.map(s => ({ ...s, range }))
          }
        }
      })
    },
    insertSuggestions (suggestions, lang) {
      for (const sug of this.genCustomSuggestions(suggestions)) {
        this.list.push(sug)
      }
      if (!this.langs[lang]) {
        this.registerProvider(lang)
        this.langs[lang] = true
      }
    },
    genCustomSuggestions (suggestions) {
      return (suggestions || []).reduce((result, [detail, strList]) => {
        return result.concat(this.genSuggestion(strList, detail))
      }, [])
    },
    genSuggestion (suggestionStrs, detail) {
      return suggestionStrs
        .filter(kw => !this.map[kw])
        .map((kw) => {
          this.map[kw] = true
          return {
            label: kw,
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: kw,
            detail
          }
        })
    },
  }
})

export default suggestionStore
