import request from '@/utils/request'

export function rmvupfile(rmvFile, filename) {
  console.log(rmvFile)
  console.log(filename)
  return request({
    url: '/uploadimg/delimg',
    method: 'post',
    data: {
      filename: rmvFile,
      isdir: 'F'
    }
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
