/**
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
  '/dashboard/apply-perms': import(/* webpackChunkName: "views-apply-perms" */'@/views/dashboard/apply-perms'),
  '/dashboard/Workplace': import(/* webpackChunkName: "views-Workplace" */'@/views/dashboard/Workplace'),
  '/log/finished': import(/* webpackChunkName: "views-finished" */'@/views/log/finished'),
  '/log/mongodb': import(/* webpackChunkName: "views-mongodb" */'@/views/log/mongodb'),
  '/log/mysql': import(/* webpackChunkName: "views-mysql" */'@/views/log/mysql'),
  '/log/pgsql': import(/* webpackChunkName: "views-pgsql" */'@/views/log/pgsql'),
  '/log/redis': import(/* webpackChunkName: "views-redis" */'@/views/log/redis'),
  '/monitor/das': import(/* webpackChunkName: "views-das" */'@/views/monitor/das'),
  '/query/mongodb/instance': import(/* webpackChunkName: "views-mongodb" */'@/views/query/mongodb/instance'),
  '/query/mongodb/instance-list': import(/* webpackChunkName: "views-mongodb" */'@/views/query/mongodb/instance-list'),
  '/query/mysql/instance': import(/* webpackChunkName: "views-mysql" */'@/views/query/mysql/instance'),
  '/query/mysql/instance-list': import(/* webpackChunkName: "views-mysql" */'@/views/query/mysql/instance-list'),
  '/query/pgsql/instance': import(/* webpackChunkName: "views-pgsql" */'@/views/query/pgsql/instance'),
  '/query/pgsql/instance-list': import(/* webpackChunkName: "views-pgsql" */'@/views/query/pgsql/instance-list'),
  '/query/redis/instance': import(/* webpackChunkName: "views-redis" */'@/views/query/redis/instance'),
  '/query/redis/instance-list': import(/* webpackChunkName: "views-redis" */'@/views/query/redis/instance-list'),
  '/system/global-settings': import(/* webpackChunkName: "views-global-settings" */'@/views/system/global-settings'),
  '/system/instance': import(/* webpackChunkName: "views-instance" */'@/views/system/instance'),
  '/system/menu': import(/* webpackChunkName: "views-menu" */'@/views/system/menu'),
  '/system/role': import(/* webpackChunkName: "views-role" */'@/views/system/role'),
  '/system/settings': import(/* webpackChunkName: "views-settings" */'@/views/system/settings'),
  '/system/userList': import(/* webpackChunkName: "views-userList" */'@/views/system/userList'),
  '/work-order/exports/apply-list': import(/* webpackChunkName: "views-exports" */'@/views/work-order/exports/apply-list'),
  '/work-order/exports/review-list': import(/* webpackChunkName: "views-exports" */'@/views/work-order/exports/review-list'),
  '/work-order/my-review-list': import(/* webpackChunkName: "views-my-review-list" */'@/views/work-order/my-review-list'),
  '/work-order/my-submit-list': import(/* webpackChunkName: "views-my-submit-list" */'@/views/work-order/my-submit-list'),
  '/work-order/perms-order': import(/* webpackChunkName: "views-perms-order" */'@/views/work-order/perms-order')
}
