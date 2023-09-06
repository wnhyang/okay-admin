import request from '@/config/axios'
import type { UserLoginVO, UserType } from './types'

interface RoleParams {
  roleName: string
}

export const loginApi = (data: UserLoginVO): Promise<IResponse<string>> => {
  return request.post({ url: '/auth/login', data })
}

export const loginOutApi = (): Promise<IResponse> => {
  return request.get({ url: '/auth/logout' })
}

export const getUserListApi = ({ params }: AxiosConfig) => {
  return request.get<{
    code: string
    data: {
      list: UserType[]
      total: number
    }
  }>({ url: '/user/list', params })
}

export const getAdminRoleApi = (
  params: RoleParams
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: '/role/list', params })
}

export const getTestRoleApi = (params: RoleParams): Promise<IResponse<string[]>> => {
  return request.get({ url: '/role/list', params })
}

// 获取用户权限信息
export const getInfo = () => {
  return request.get({ url: '/system/user/info' })
}
