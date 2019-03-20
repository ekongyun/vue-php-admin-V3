import request from '@/utils/request'

export function getgoods(token) {
  return request({
    url: '/table/goods',
    method: 'get'
  })
}

