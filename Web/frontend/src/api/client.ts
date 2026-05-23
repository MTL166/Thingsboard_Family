import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

const client = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器：自动带 JWT Token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：解包统一响应格式 {code, message, data}
interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

client.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const body = response.data
    if (body.code !== 200) {
      ElMessage.error(body.message || '请求失败')
      return Promise.reject(new Error(body.message))
    }
    // 直接返回 data，调用方不用再解包
    return body.data as any
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      ElMessage.error('登录已过期，请重新登录')
      setTimeout(() => {
        window.location.href = '/login'
      }, 1000)
    } else if (!error.response) {
      ElMessage.error('网络异常，请稍后重试')
    } else {
      ElMessage.error(error.response.data?.message || '服务器错误')
    }
    return Promise.reject(error)
  }
)

export default client
