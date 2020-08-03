const fs = require('fs')
const path = require('path')

const excludes = ['components']
const viewsPath = path.join(__dirname, '../src/views')
const viewsImport = []
function readDir (fullDirPath) {
  const files = fs.readdirSync(fullDirPath)
  
  files.forEach((file) => {
    const fullFilePath = path.join(fullDirPath, file)
    const fileStatus = fs.statSync(fullFilePath)
    if (fileStatus.isDirectory() && !excludes.includes(file)) {
      readDir(fullFilePath)
    } else if (file === 'index.vue') {
      const relPathArr = path.relative(viewsPath, fullFilePath)
        .split(path.sep)
      const relPath = relPathArr
        .join('/')
        .replace('/index.vue', '')
      const viewModule = relPathArr[1]
      viewsImport.push(
        `  '/${relPath}': import(/* webpackChunkName: "views-${viewModule}" */'@/views/${relPath}')`
      )
    }
  })
}

readDir(viewsPath)

fs.writeFileSync('./src/config/dynamic-router.config.js', `/**
 *******************************************************************
 **** 这个文件由 /scripts/gen-routers.js 自动生成，请不要手动修改  ****
 *******************************************************************
 *
 * /src/views 下的 index.vue（排除 components 文件夹）对应的目录都会生成一个路由
 * 在 /src/router/genenrator-router.js 中用 · () => dynamicRouterMap[item.path] · 的方式引入
 * item.path 则是由系统菜单管理写入后端的一个属性，对应上面所说的 index.vue 的目录（相对于 @/views 的路径）
 * 如：
 *  编写了一个页面：/src/views/dashboard/Workplace/index.vue
 *  1. 执行 node .scriptsgen-routers.js
 *  2. 在系统菜单管理写入 path: '/dashboard/Workplace' 的菜单
 *  然后 /src/router/genenrator-router.js 会自动引入页面
 */

export const dynamicRouterMap = {
${viewsImport.join(',\n')}
}
`)
