import { useReducer, useState } from 'react'
import { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Hydrate } from 'react-query/hydration'
import { ReactQueryDevtools } from 'react-query/devtools'
import { appWithTranslation } from 'next-i18next'

import { AppReducer, initialState } from '@/contexts/app/app.reducer'
import { AppContext } from '@/contexts/app/app.context'

const App = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(() => new QueryClient())
  const [state, dispatch] = useReducer(AppReducer, initialState)

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <AppContext.Provider value={{ state, dispatch }}>
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} />
        </AppContext.Provider>
      </Hydrate>
    </QueryClientProvider>
  )
}
export default appWithTranslation(App)
