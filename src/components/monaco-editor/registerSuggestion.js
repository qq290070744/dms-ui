
import * as monaco from 'monaco-editor'
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

const langSuggestions = {

}

const keywordSuggestions = {

}

function registerLanguageSuggention (lang) {
  if (langs.includes(lang) && !langSuggestions[lang]) {
    try {
      const langDef = require(`monaco-editor/esm/vs/basic-languages/${lang}/${lang}`)
      const { builtinFunctions, keywords, operators } = langDef.language

      langSuggestions[lang] = [
        ...genSuggestion(builtinFunctions, '函数'),
        ...genSuggestion(keywords, '关键字'),
        ...genSuggestion(operators, '操作符'),
      ]
    } catch (e) {
      console.log(e)
    }
  }
}

function registerSuggention (lang, ) {
  const lang = this.language

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
        suggestions: that.finalSuggestions.map(s => ({ ...s, range }))
      }
    }
  })
}

function genKeywordSuggestion () {
  
}

function genSuggestion (suggestionStrs, detail) {
  return suggestionStrs.map((kw) => {
    return {
      label: kw,
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: kw,
      detail
    }
  })
}