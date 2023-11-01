import { defineStore } from 'pinia'
import { constantRouterMap } from '@/router'
import { generateRoutesByServer, flatMultiLevelRoutes } from '@/utils/routerHelper'
import { useStorage } from '@/hooks/web/useStorage'
import { store } from '@/store'
import { cloneDeep } from 'lodash-es'
import { CACHE_KEY } from '@/hooks/web/useStorage'

const { getStorage } = useStorage()

export interface PermissionState {
  routers: AppRouteRecordRaw[]
  addRouters: AppRouteRecordRaw[]
  isAddRouters: boolean
  menuTabRouters: AppRouteRecordRaw[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routers: [],
    addRouters: [],
    isAddRouters: false,
    menuTabRouters: []
  }),
  getters: {
    getRouters(): AppRouteRecordRaw[] {
      return this.routers
    },
    getAddRouters(): AppRouteRecordRaw[] {
      return flatMultiLevelRoutes(cloneDeep(this.addRouters))
    },
    getIsAddRouters(): boolean {
      return this.isAddRouters
    },
    getMenuTabRouters(): AppRouteRecordRaw[] {
      return this.menuTabRouters
    }
  },
  actions: {
    async generateRoutes(): Promise<unknown> {
      return new Promise<void>(async (resolve) => {
        let res: AppCustomRouteRecordRaw[] = []
        if (getStorage(CACHE_KEY.ROLE_ROUTERS)) {
          res = getStorage(CACHE_KEY.ROLE_ROUTERS) as AppCustomRouteRecordRaw[]
        }
        console.log('generateRoute', res)
        const routerMap: AppRouteRecordRaw[] = generateRoutesByServer(
          res as AppCustomRouteRecordRaw[]
        )
        console.log('routerMap', routerMap)
        // 动态路由，404一定要放到最后面
        this.addRouters = routerMap.concat([
          {
            path: '/:path(.*)*',
            redirect: '/404',
            name: '404Page',
            meta: {
              hidden: true,
              breadcrumb: false
            }
          }
        ])
        // 渲染菜单的所有路由
        this.routers = cloneDeep(constantRouterMap).concat(routerMap)
        console.log('this.routers', this.routers)
        resolve()
      })
    },
    setIsAddRouters(state: boolean): void {
      this.isAddRouters = state
    },
    setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
      this.menuTabRouters = routers
    }
  }
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
