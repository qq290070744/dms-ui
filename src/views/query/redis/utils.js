export function resize (ev, curr, range, set) {
  const { clientX: initX } = ev
  const prevCursor = document.body.style.cursor
  document.body.style.cursor = 'col-resize'
  function move (ev) {
    const movement = ev.clientX - initX
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

export function genRange (el) {
  const { width } = el.getBoundingClientRect()

  return [0, width]
}

export function defaultRedisObject () {
  return {
    dbName: '',
    instId: '',
    key: '',
    value: '',
    type: '',
    ttl: '-1'
  }
}
