import { NextComponentType } from 'next'

import { useMe } from '@/data/useMe'

export const withAuth = (Component: NextComponentType) => {
  const Auth = (pageProps: any) => {
    const { data } = useMe()

    if (!data) {
      return (
        <div>not login</div>
      )
    }

    return (
      <Component {...pageProps} />
    )
  }

  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps
  }

  return Auth
}
