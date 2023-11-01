import request from '@/config/axios'

export interface MenuVO {
  id: number
  parentId: number
  name: string
  permission: string
  type: number
  sort: number
  path: string
  icon: string
  component: string
  title?: string
  status: number
  hidden: boolean
  noCache: boolean
  alwaysShow?: boolean
}

export const getMenuList = (params) => {
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

// 更新菜单
export const updateMenu = (data: MenuVO) => {
  return request.put({ url: '/system/menu/update', data })
}

// 删除菜单
export const deleteMenu = (id: number) => {
  return request.delete({ url: '/system/menu/delete?id=' + id })
}
