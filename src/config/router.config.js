// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: 'dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: '仪表盘', keepAlive: true, icon: bxAnaalyse, permission: [ 'dashboard' ] },
        children: [
          {
            path: 'workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: '工作台', keepAlive: true, permission: [ 'dashboard' ] }
          }
        ]
      },
      // 实例管理
      {
        path: 'instances',
        name: 'instances',
        redirect: '/instances/redis',
        component: RouteView,
        meta: { title: '数据库实例管理', keepAlive: true, icon: 'table' },
        children: [
          {
            path: 'redis',
            name: 'instancesRedis',
            component: () => import('@/views/instances/redis'),
            meta: { title: 'redis实例管理', keepAlive: true }
          },
          {
            path: 'mysql',
            name: 'instancesMysql',
            component: () => import('@/views/instances/mysql'),
            meta: { title: 'mysql实例管理', keepAlive: true }
          }
        ]
      },
      // query 查询
      {
        path: 'query',
        name: 'query',
        redirect: '/query/redis',
        component: RouteView,
        meta: { title: '查询', keepAlive: true, icon: 'search' },
        children: [
          {
            path: 'redis',
            name: 'queryRedis',
            component: () => import('@/views/query/redis'),
            meta: { title: 'redis实例列表', keepAlive: true },
            redirect: 'redis/instances',
            hideChildrenInMenu: true,
            children: [
              {
                path: 'instances',
                name: 'queryRedisInstances',
                component: () => import('@/views/query/redis/instance-list'),
                meta: { title: 'redis查询', keepAlive: true }
              },
              {
                path: ':instance_id',
                name: 'queryRedisInstance',
                component: () => import('@/views/query/redis/instance'),
                meta: { title: 'redis查询', keepAlive: true }
              }
            ]
          }
        ]
      },

      // account
      {
        path: '/account',
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        meta: { title: '个人页', icon: 'user', keepAlive: true, permission: [ 'user' ] },
        children: [
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: '个人设置', hideHeader: true, permission: [ 'user' ] },
            redirect: '/account/settings/base',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/base',
                name: 'BaseSettings',
                component: () => import('@/views/account/settings/BaseSetting'),
                meta: { title: '基本设置', hidden: true, permission: [ 'user' ] }
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: { title: '安全设置', hidden: true, keepAlive: true, permission: [ 'user' ] }
              },
              {
                path: '/account/settings/custom',
                name: 'CustomSettings',
                component: () => import('@/views/account/settings/Custom'),
                meta: { title: '个性化设置', hidden: true, keepAlive: true, permission: [ 'user' ] }
              },
              {
                path: '/account/settings/binding',
                name: 'BindingSettings',
                component: () => import('@/views/account/settings/Binding'),
                meta: { title: '账户绑定', hidden: true, keepAlive: true, permission: [ 'user' ] }
              },
              {
                path: '/account/settings/notification',
                name: 'NotificationSettings',
                component: () => import('@/views/account/settings/Notification'),
                meta: { title: '新消息通知', hidden: true, keepAlive: true, permission: [ 'user' ] }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
