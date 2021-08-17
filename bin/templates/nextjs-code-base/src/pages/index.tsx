import { NextPage, GetStaticPropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import HomeComponent from '@/components/home/Home'
import Layout from '@/components/common/Layout'
import { withAuth } from '@/utils/with-auth'

const Home: NextPage = () => (
  <Layout>
    <HomeComponent />
  </Layout>
)

export const getStaticProps = async ({ locale }: GetStaticPropsContext) => ({
  props: { ...await serverSideTranslations(locale || 'en') },
})

export default withAuth(Home)
