import request from '@/utils/request'

// 操作：列出菜单 TableData
export function getMenuTree(form) {
  return request({
    url: '/sys/menu/view',
    method: 'post',
    data: form
  })
}

// 添加按钮
export function createMenu(form) {
  return request({
    url: '/sys/menu/add',
    method: 'post',
    data: form
  })
}

// 编辑按钮
export function updateMenu(form) {
  return request({
    url: '/sys/menu/edit',
    method: 'post',
    data: form
  })
}
// 删除按钮
export function deleteMenu(form) {
  return request({
    url: '/sys/menu/del',
    method: 'post',
    data: form
  })
}
// 查询按钮
export function viewMenuTree(rmvFile, filename) {
  return request({
    url: '/sys/menu/view',
    method: 'get'
  })
}

// 新建编辑菜单时，下拉选项，配置父节点操作 不需求权限验证
export function getTreeOptions(rmvFile, filename) {
  return request({
    url: '/sys/menu/treeoptions',
    method: 'get'
  })
}
