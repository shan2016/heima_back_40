import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:3000'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  let token = localStorage.getItem('heima_40_back_token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

export default axios
