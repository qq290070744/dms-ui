import XModal from './Modal'
import XForm from './Modal/form'
import XAuditorSelector from './AuditorSelector'
import XTableCellEllipsis from './TableCellEllipsis'

const comps = [
  XAuditorSelector,
  XModal,
  XForm,
  XTableCellEllipsis
]
export default {
  install (Vue) {
    comps.forEach((comp) => {
      Vue.component(comp.name, comp)
    })
  }
}
