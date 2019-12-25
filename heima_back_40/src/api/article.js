import axios from '@/myaxios/myaxios.js'

// 1.获取文章列表数据
export const getPostList = (params) => {
  return axios({
    url: '/post',
    params
  })
}

// 2.发布文章
export const publishPost = (data) => {
  return axios({
    method: 'post',
    url: '/post',
    data
  })
}
