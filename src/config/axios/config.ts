import {
  AxiosConfig,
  AxiosResponse,
  AxiosRequestHeaders,
  AxiosError,
  InternalAxiosRequestConfig
} from './types'
import { ElMessage } from 'element-plus'
import qs from 'qs'
import { getToken } from '@/utils/auth'

const config: AxiosConfig = {
  /**
   * api请求基础路径
   */
  baseUrl: {
    // 开发环境接口前缀
    base: 'http://nacos:9001',

    // 打包开发环境接口前缀
    dev: 'http://nacos:9001',

    // 打包生产环境接口前缀
    pro: 'http://nacos:9001',

    // 打包测试环境接口前缀
    test: 'http://nacos:9001'
  },

  /**
   * 接口成功返回状态码
   */
  code: 0,

  /**
   * 接口请求超时时间
   */
  timeout: 60000,

  /**
   * 默认接口请求类型
   * 可选值：application/x-www-form-urlencoded multipart/form-data
   */
  defaultHeaders: 'application/json',

  interceptors: {
    //请求拦截
    // requestInterceptors: (config) => {
    //   return config
    // },
    // 响应拦截器
    // responseInterceptors: (result: AxiosResponse) => {
    //   return result
    // }
  }
}
// 请求白名单，无须token的接口
const whiteList: string[] = ['/login', '/refresh-token']

const defaultRequestInterceptors = (config: InternalAxiosRequestConfig) => {
  console.log('request config', config)
  // 是否需要设置 token
  let isToken = (config!.headers || {}).isToken === false
  whiteList.some((v) => {
    if (config.url) {
      config.url.indexOf(v) > -1
      return (isToken = false)
    }
  })
  if (getToken() && !isToken) {
    ;(config as Recordable).headers.Authorization = 'Bearer ' + getToken() // 让每个请求携带自定义token
  }
  if (
    config.method === 'post' &&
    (config.headers as AxiosRequestHeaders)['Content-Type'] === 'application/x-www-form-urlencoded'
  ) {
    config.data = qs.stringify(config.data)
  }
  if (config.method === 'get' && config.params) {
    let url = config.url as string
    url += '?'
    const keys = Object.keys(config.params)
    for (const key of keys) {
      if (config.params[key] !== void 0 && config.params[key] !== null) {
        url += `${key}=${encodeURIComponent(config.params[key])}&`
      }
    }
    url = url.substring(0, url.length - 1)
    config.params = {}
    config.url = url
  }
  return config
}
;(error: AxiosError) => {
  console.log(error)
  Promise.reject(error)
}

const defaultResponseInterceptors = (response: AxiosResponse<any>) => {
  console.log('response response', response)
  const { data } = response
  console.log('data', data)
  if (response?.config?.responseType === 'blob') {
    // 如果是文件流，直接过
    return response
  } else if (response.data.code === config.code) {
    return response.data
  } else {
    ElMessage.error(data.msg)
  }
}
;(error: AxiosError) => {
  console.log('err' + error) // for debug
  ElMessage.error(error.message)
  return Promise.reject(error)
}

export { defaultResponseInterceptors, defaultRequestInterceptors }
export default config
