function getEnv () {
  return process.env.VUE_APP_ENV_MODE
}

function genColor () {
  if (process.env.VUE_APP_FAVICON_STATUS_COLOR) {
    return process.env.VUE_APP_FAVICON_STATUS_COLOR
  }
  const mapper = {
    dev: '#2db7f5',
    test: '#ffcc01',
    uat: '#00c024'
  }
  return mapper[getEnv()]
}

function getIconEl () {
  return document.querySelector('link[rel=icon]')
}

function load (src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = (e) => reject(e)
    image.src = src
  })
}

function drawFavIcon (color) {
  const icon = getIconEl()

  if (!icon) {
    return
  }

  load(icon.href)
    .then((image) => {
      const cvs = document.createElement('canvas')
      const S = 32
      const S2 = 20
      cvs.width = S
      cvs.height = S

      const ctx = cvs.getContext('2d')
      ctx.drawImage(image, 0, 0, S, S)
      ctx.fillStyle = color
      ctx.fillRect(S2, S2, S, S)
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.strokeRect(S2, S2, S, S)

      const url = cvs.toDataURL('image/png')
      icon.href = url
    })
}

window.addEventListener('load', () => {
  const color = genColor()
  if (color) {
    drawFavIcon(color)
  }
})
