import XModal from './Modal'
import XForm from './Modal/form'
import XAuditorSelector from './AuditorSelector'

const comps = [
  XAuditorSelector,
  XModal,
  XForm,
]
export default {
  install (Vue) {
    comps.forEach((comp) => {
      Vue.component(comp.name, comp)
    })
  }
}
