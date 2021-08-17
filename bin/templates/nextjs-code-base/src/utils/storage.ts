export const setLocalStorage = (key: string, value: string) => {
  if (typeof window !== 'undefined') window.localStorage.setItem(key, value)
}

export const getLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    const value = window.localStorage.getItem(key)
    return value === null ? '' : value
  }
  return ''
}
