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
