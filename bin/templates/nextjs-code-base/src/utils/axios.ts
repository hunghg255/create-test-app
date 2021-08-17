import axios from 'axios'

import { getLocalStorage, setLocalStorage } from '@/utils/storage'

export const api = axios.create({
  baseURL: process.env.API,
  timeout: 10000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
})

const setHeaderAuthorization = (token: string) => {
  api.defaults.headers.common.Authorization = `Bearer ${token}`
}

setHeaderAuthorization(getLocalStorage(process.env.USER_TOKEN || 'USER_TOKEN'))

export const setToken = (token: string) => {
  setLocalStorage(process.env.USER_TOKEN || 'USER_TOKEN', token)
  setHeaderAuthorization(token)
}

export const clearToken = () => setToken('')
