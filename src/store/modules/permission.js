import { asyncRouterMap, constantRouterMap } from '@/router'

import Layout from '@/views/layout/Layout'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

/**
 *将后台的路由表进行格式化
 * @param {*} asyncRouterMap
 */
function convertRouter(asyncRouterMap) {
  const accessedRouters = []
  if (asyncRouterMap) {
    asyncRouterMap.forEach(item => {
      var parent = generateRouter(item, true)
      var children = []
      if (item.children) {
        item.children.forEach(child => {
          children.push(generateRouter(child, false))
        })
      }
      parent.children = children
      accessedRouters.push(parent)
    })
  }
  accessedRouters.push({ path: '*', redirect: '/404', hidden: true })
  return accessedRouters
}

function generateRouter(item, isParent) {
  // 表单 输入 path： /sys/menu
  // name string-random 生成唯一字符串 xxxoo_sys_menu 形式 6个随机字符 + path 转换
  // redirect： 判断如果是一级菜单 noredirect
  // component: 判断如果是一级菜单component: Layout
  console.log(item.component)

  var router = {
    path: item.path,
    name: item.name,
    meta: item.meta,
    // component: item.component === 'Layout' ? Layout : getViews(item.component),
    component: item.component === 'Layout' ? Layout : () => import(`@/views/${item.component}.vue`),
    // redirect: item.component === 'Layout' ? 'noredirect' :  '',
    // 面包屑上 点击 redirect 的 url  首页/系统管理/菜单管理  , 可点击系统管理
    redirect: item.redirect ? item.redirect : item.component === 'Layout' ? 'noredirect' : '',
    // component: isParent ? Layout : componentsMap[item.name],
    alwaysShow: item.children.length === 1 ? true : false
  }
  console.log('router....', router)
  return router
}

// export const componentsMap = {
//   // example_table: () => import('@/views/table/index'),
//   // example_tree: () => import('@/views/tree/index'),
//   // form_index: () => import('@/views/form/index')
//   menu: () => import('@/views/sys/menu/index')
// }

const permission = {
  state: {
    routers: [],
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        // const { roles } = data
        // let accessedRouters
        // if (roles.includes('admin')) {
        //   accessedRouters = asyncRouterMap
        // } else {
        //   accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        // }
        const { asyncRouterMap } = data
        // const asyncRouterMap = [
        //   {
        //     path: '/sys',
        //     redirect: 'noredirect',
        //     name: 'sys',
        //     meta: {
        //       title: '系统管理',
        //       icon: 'nested'
        //     },
        //     component: 'Layout',
        //     children: [
        //       {
        //         path: '/sys/menu',
        //         name: 'menu',
        //         meta: {
        //           title: '菜单管理',
        //           icon: 'nested'
        //         },
        //         component: 'index',
        //         children: [
        //         ]
        //       }
        //     ]
        //   }
        // ]
        console.log('asyncRouterMap.........', asyncRouterMap)
        const accessedRouters = convertRouter(asyncRouterMap)
        console.log('accessedRouters.........', accessedRouters)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
