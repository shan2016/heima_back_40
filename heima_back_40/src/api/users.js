import axios from '@/myaxios/myaxios.js'

// 验证登录
export const userLogin = (data) => {
  return axios({
    method: 'post',
    url: '/login',
    data
  })
}
