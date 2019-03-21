import request from '@/utils/request'

// 操作：列出菜单 TableData
export function getMenuTree(form) {
  return request({
    url: '/sys/menu/info',
    method: 'get'
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

// 查询按钮
export function viewMenuTree(rmvFile, filename) {
  return request({
    url: '/sys/menu/view',
    method: 'get'
  })
}

// 新建编辑菜单时，下拉选项，配置父节点操作
export function getTreeOptions(rmvFile, filename) {
  return request({
    url: '/sys/menu/treeoptions',
    method: 'get'
  })
}

export function onsubmit(form) {
  console.log(form)
  return request({
    url: '/uploadimg/onsubmit',
    method: 'post',
    data: form
  })
}
