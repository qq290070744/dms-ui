import { getMenuUserTree } from '@/api/menu'
import { BasicLayout, BlankLayout, RouteView } from '@/layouts'
import { constantMenu } from '@/config/router.config'

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*',
  redirect: '/404',
  hidden: true
}

/**
 * 需要重定向路由，一般是一级目录的重定向
 */
const redirectRouter = {
  root: '/dashboard/Workplace',
  system: '/system/menu', //  系统管理
  instances: '/instances/redis', //  实例管理
  query: '/query/redis', //  查询
  queryRedis: 'redis/instances', //  查询
  queryMysql: 'mysql/instances', //  查询
  queryPgsql: 'pgsql/instances', //  查询
  queryMongodb: 'mongodb/instances', //  查询
  dashboard: '/dashboard/Workplace' // 仪表盘
}

const genQueryInstanceRoute = (resourceNames = []) => {
  return resourceNames
    .reduce((routes, resourceName) => {
      const lower = resourceName.toLowerCase()
      const capitalize = lower.slice(0, 1).toUpperCase() + lower.slice(1)

      const routeChildren = [
        {
          path: 'instances',
          name: `query${capitalize}Instances`,
          component: () => import('@/views/query/' + lower + '/instance-list'),
          meta: { title: `${resourceName}列表` }
        },
        {
          path: ':instance_id',
          name: `query${capitalize}Instance`,
          component: () => import('@/views/query/' + lower + '/instance'),
          meta: { title: `${resourceName}实例` }
        }
      ]

      routes[`query${capitalize}`] = routeChildren
      return routes
    }, {})
}

/**
 * 路由名匹配children
 */
const mapChildrenByName = genQueryInstanceRoute(['Redis', 'MySQL', 'PgSQL', 'MongoDB'])

/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = () => {
  return new Promise((resolve, reject) => {
    getMenuUserTree()
      .then(res => {
        const menuNav = []
        menuNav.push(res)
        const routers = generator(menuNav)
        if (routers[0] && routers[0].name === 'root') {
          const rootChildren = routers[0].children || []
          rootChildren.push(...constantMenu)
          routers[0].children = rootChildren
        }
        routers.push(notFoundRouter)
        resolve(routers)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    // eslint-disable-next-line camelcase
    const { display_name, name, path, status, extras } = item
    const currentRouter = {
      path: path,
      // 路由名称
      name: name,
      // 该路由对应页面的 组件 : (动态加载)
      component:
        item.name === 'root' ? BasicLayout : parent.name === 'root' ? RouteView : () => import(
          '@/views' + item.path
        ),
      meta: {
        title: display_name, icon: extras
      },
      hidden: status === 0
    }
    // 重定向
    if (redirectRouter[item.name]) {
      currentRouter.redirect = redirectRouter[item.name]
    }

    if (mapChildrenByName[item.name]) {
      currentRouter.children = mapChildrenByName[item.name]
      currentRouter.hideChildrenInMenu = true
      // 当有子路由时，把当前路由的组件置为空的 <router-view />
      currentRouter.component = BlankLayout
    }

    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}
