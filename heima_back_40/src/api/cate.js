import axios from '@/myaxios/myaxios.js'

// 1.获取文章列表数据
export const getCateList = () => {
  return axios({
    url: '/category'
  })
}
