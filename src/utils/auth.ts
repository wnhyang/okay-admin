import { useStorage } from '@/hooks/web/useStorage'
import { useAppStore } from '@/store/modules/app'
import {UserType} from "@/api/login/types";

const appStore = useAppStore()

const { setStorage } = useStorage()

export const setToken = (token: UserType extends any ? UserType : any) => {
  setStorage(appStore.token, token)
}
