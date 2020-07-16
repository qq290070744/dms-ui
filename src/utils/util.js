export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome () {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {}
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

export function isIE () {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

export function waitRefShow (vm, key, timeout = 3000) {
  const initTime = Date.now()
  return new Promise(function (resolve, reject) {
    const check = function () {
      if (vm.$refs[key]) {
        resolve(vm.$refs[key])
      } else if (Date.now() - initTime > timeout) {
        reject(new Error('timeout'))
      } else {
        requestAnimationFrame(check)
      }
    }
    requestAnimationFrame(check)
  })
}

export function calcTableBodyHeight (tableEl, bottomPadding = 0) {
  const bodyHeight = document.body.clientHeight
  const tbodyHeightOrigin = (tableEl.querySelector('.ant-table-tbody') || { clientHeight: 0 }).clientHeight
  const theadHeightOrigin = (tableEl.querySelector('.ant-table-thead') || { clientHeight: 0 }).clientHeight
  const { top, height } = tableEl.getBoundingClientRect()
  const pagination = height - tbodyHeightOrigin - theadHeightOrigin
  // 底部溢出
  const overflow = top + height - bodyHeight
  const tbodyHeight = height - overflow - pagination - theadHeightOrigin - 16 - bottomPadding // padding-bottom
  return tbodyHeight
}

// ctrl + mousewheel 控制左右滚动
export function genHorizontalScroll () {
  const scroller = {
    listenEl: null,
    scrollEl: null,
    saver: 0,
    listener (e) {
      console.log(e)
      if (e.ctrlKey) {
        e.preventDefault()
        scroller.saver += e.deltaY
        scroller.scrollEl.scrollLeft = scroller.saver
      }
    },
    add (listenEl, scrollEl = listenEl) {
      console.log('add', listenEl)
      scroller.saver = 0
      scroller.listenEl = listenEl
      scroller.scrollEl = scrollEl
      listenEl.addEventListener('mousewheel', scroller.listener)
    },
    remove() {
      console.log('remove', scroll.listenEl)
      if (scroll.listenEl) {
        scroll.listenEl.removeEventListener('mousewheel', scroll.listener)
      }
    }
  }
  scroller.listener.bind(scroller)

  return scroller
}
