export function resize (ev, curr, range, set, vertical) {
  const { clientX: initX, clientY: initY } = ev
  const prevCursor = document.body.style.cursor
  document.body.style.cursor = 'col-resize'
  function move (ev) {
    const movement = vertical ? ev.clientY - initY : ev.clientX - initX
    const pos = curr + movement
    const [min = 0, max] = range
    set(Math.min(Math.max(min, pos), max))
  }

  function end (ev) {
    move(ev)
    document.body.style.cursor = prevCursor
    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', end)
  }

  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', end)
}

export function genRange (el, vertical) {
  const { width, height } = el.getBoundingClientRect()

  return [0, vertical ? height : width]
}
