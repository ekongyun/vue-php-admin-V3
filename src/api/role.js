import request from '@/utils/request'

// 操作：列出菜单  
export function getRoleList(form) {
  return request({
    url: '/sys/role/info',
    method: 'get'
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

// 查询按钮
export function viewRole(rmvFile, filename) {
  return request({
    url: '/sys/role/view',
    method: 'get'
  })
}


