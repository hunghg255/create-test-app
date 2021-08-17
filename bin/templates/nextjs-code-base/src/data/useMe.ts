import { useQuery } from 'react-query'

import { api } from '@/utils/axios'

export const useMe = () => useQuery('me', async () => {
  const response = await api.get('/auth/me')
  return response.data
}, {
  staleTime: 300000,
})
