import request from '@/config/axios'

export interface MenuVO {
  id: number
  name: string
  permission: string
  type: number
  sort: number
  parentId: number
  path: string
  icon: string
  component: string
  title?: string
  status: number
  hidden: boolean
  noCache: boolean
  alwaysShow?: boolean
  createTime: Date
}

export const getMenuListApi = (params) => {
  return request.get({ url: '/system/menu/list', params })
}

// 查询菜单（精简）列表
export const getSimpleMenusList = () => {
  return request.get({ url: '/system/menu/listAllSimple' })
}

// 新增菜单
export const createMenu = (data: MenuVO) => {
  return request.post({ url: '/system/menu/create', data })
}
