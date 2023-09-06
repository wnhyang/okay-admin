import { store } from '@/store'
import { defineStore } from 'pinia'
import { getToken, removeToken } from '@/utils/auth'
import { CACHE_KEY } from '@/hooks/web/useStorage'
import { getInfo, loginOutApi } from '@/api/login'
import { useStorage } from '@/hooks/web/useStorage'

const { getStorage, setStorage, clear } = useStorage()

interface UserVO {
  id: number
  avatar: string
  nickname: string
}
interface UserInfoVO {
  permissions: string[]
  roles: string[]
  isSetUser: boolean
  user: UserVO
}

export const useUserStore = defineStore('admin-user', {
  state: (): UserInfoVO => ({
    permissions: [],
    roles: [],
    isSetUser: false,
    user: {
      id: 0,
      avatar: '',
      nickname: ''
    }
  }),
  getters: {
    getPermissions(): string[] {
      return this.permissions
    },
    getRoles(): string[] {
      return this.roles
    },
    getIsSetUser(): boolean {
      return this.isSetUser
    },
    getUser(): UserVO {
      return this.user
    }
  },
  actions: {
    async setUserInfoAction() {
      if (!getToken()) {
        this.resetState()
        return null
      }
      let userInfo = getStorage(CACHE_KEY.USER)
      if (!userInfo) {
        const res = await getInfo()
        if (res) {
          userInfo = res.data
          console.log(userInfo)
        }
      }
      this.permissions = userInfo.permissions
      this.roles = userInfo.roles
      this.user = userInfo.user
      this.isSetUser = true
      setStorage(CACHE_KEY.USER, userInfo)
      setStorage(CACHE_KEY.ROLE_ROUTERS, userInfo.menus)
    },
    async loginOut() {
      await loginOutApi()
      removeToken()
      clear()
      this.resetState()
    },
    resetState() {
      this.permissions = []
      this.roles = []
      this.isSetUser = false
      this.user = {
        id: 0,
        avatar: '',
        nickname: ''
      }
    }
  }
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
