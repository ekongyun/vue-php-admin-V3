import request from '@/utils/request'

// 查询框或按钮 无参数时查询所有
export function getUserList(form) {
  return request({
    url: '/sys/user/view',
    method: 'post',
    data: form
  })
}

// 添加按钮
export function createUser(form) {
  return request({
    url: '/sys/user/add',
    method: 'post',
    data: form
  })
}

// 编辑按钮
export function updateUser(form) {
  return request({
    url: '/sys/user/edit',
    method: 'post',
    data: form
  })
}

// 删除按钮
export function deleteUser(form) {
  return request({
    url: '/sys/user/del',
    method: 'post',
    data: form
  })
}

// 新增、编辑角色权限，无需权限分配
export function getRoleOptions(form) {
  return request({
    url: '/sys/user/getroleoptions',
    method: 'get'
  })
}
