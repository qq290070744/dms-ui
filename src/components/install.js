import XModal from './Modal'
import XForm from './Modal/form'
import XAuditorSelector from './AuditorSelector'
import XTableCellEllipsis from './TableCellEllipsis'
import XMonacoEditor from './monaco-editor'

const comps = [
  XAuditorSelector,
  XModal,
  XForm,
  XTableCellEllipsis,
  XMonacoEditor
]
export default {
  install (Vue) {
    comps.forEach((comp) => {
      Vue.component(comp.name, comp)
    })
  }
}
