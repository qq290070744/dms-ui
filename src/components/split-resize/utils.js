let tempVal = null
let needRender = false
export function resize (ev, curr, range, set, vertical, autoStart) {
  const { clientX: initX, clientY: initY } = ev
  const prevCursor = document.body.style.cursor
  document.body.style.cursor = vertical ? 'row-resize' : 'col-resize'
  needRender = true
  function move (ev) {
    let movement = vertical ? ev.clientY - initY : ev.clientX - initX
    if (autoStart) { movement = -movement }
    tempVal = curr + movement
  }

  function end (ev) {
    move(ev)
    document.body.style.cursor = prevCursor
    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', end)
    tempVal = null
    needRender = false
  }

  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', end)

  const [min = 0, max] = range
  requestAnimationFrame(function setValue () {
    if (needRender) {
      if (tempVal !== null) {
        set(Math.min(Math.max(min, tempVal), max))
      }
      requestAnimationFrame(setValue)
    }
  })
}

export function genRange (el, vertical) {
  const { width, height } = el.getBoundingClientRect()

  return [0, vertical ? height : width]
}
