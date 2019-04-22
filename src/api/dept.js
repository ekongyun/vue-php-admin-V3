import request from '@/utils/request'

// 操作：列出机构
export function getDeptList(form) {
  return request({
    url: '/sys/dept/view',
    method: 'post',
    data: form
  })
}

// 添加按钮
export function createDept(form) {
  return request({
    url: '/sys/dept/add',
    method: 'post',
    data: form
  })
}

// 编辑按钮
export function updateDept(form) {
  return request({
    url: '/sys/dept/edit',
    method: 'post',
    data: form
  })
}

// 删除按钮
export function deleteDept(form) {
  return request({
    url: '/sys/dept/del',
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
    url: '/sys/dept/allmenus',
    method: 'get'
  })
}
// 获取所有角色类权限 不需权限验证
export function getAllRoles() {
  return request({
    url: '/sys/dept/allroles',
    method: 'get'
  })
}

//  获取角色对应菜单 不需权限验证
export function getRoleMenu(form) {
  return request({
    url: '/sys/dept/rolemenu',
    method: 'post',
    data: form
  })
}

//  获取角色拥有角色权限 不需权限验证
export function getRoleRole(form) {
  return request({
    url: '/sys/dept/rolerole',
    method: 'post',
    data: form
  })
}

export function saveRolePerms(roleId, rolePerms) {
  return request({
    url: '/sys/dept/saveroleperm',
    method: 'post',
    data: { roleId, rolePerms }
  })
}

