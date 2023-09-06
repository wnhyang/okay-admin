import { CACHE_KEY, useStorage } from '@/hooks/web/useStorage'

const { setStorage, getStorage, removeStorage } = useStorage()

export const setToken = (token: string) => {
  setStorage(CACHE_KEY.TOKEN, token)
}

export const getToken = () => {
  return getStorage(CACHE_KEY.TOKEN)
}

// 删除token
export const removeToken = () => {
  removeStorage(CACHE_KEY.TOKEN)
}
