import request from '@/utils/request'

// 操作：列出菜单
export function getRoleList(form) {
  return request({
    url: '/sys/role/view',
    method: 'post',
    data: form
  })
}

// 添加按钮
export function createRole(form) {
  return request({
    url: '/sys/role/add',
    method: 'post',
    data: form
  })
}

// 编辑按钮
export function updateRole(form) {
  return request({
    url: '/sys/role/edit',
    method: 'post',
    data: form
  })
}

// 删除按钮
export function deleteRole(form) {
  return request({
    url: '/sys/role/del',
    method: 'post',
    data: form
  })
}

// // 查询按钮
// export function viewRole(rmvFile, filename) {
//   return request({
//     url: '/sys/role/view',
//     method: 'get'
//   })
// }

// 获取所有菜单类权限 不需权限验证
export function getAllMenus() {
  return request({
    url: '/sys/role/allmenus',
    method: 'get'
  })
}
// 获取所有角色类权限 不需权限验证
export function getAllRoles() {
  return request({
    url: '/sys/role/allroles',
    method: 'get'
  })
}

//  获取角色对应菜单 不需权限验证
export function getRoleMenu(form) {
  return request({
    url: '/sys/role/rolemenu',
    method: 'post',
    data: form
  })
}

//  获取角色拥有角色权限 不需权限验证
export function getRoleRole(form) {
  return request({
    url: '/sys/role/rolerole',
    method: 'post',
    data: form
  })
}

export function saveRolePerms(roleId, rolePerms) {
  return request({
    url: '/sys/role/saveroleperm',
    method: 'post',
    data: { roleId, rolePerms }
  })
}

