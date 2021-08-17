import { NextPage } from 'next'
import { useTranslation } from 'next-i18next'

import style from '@/styles/Home.module.scss'

const Home: NextPage = () => {
  const { t } = useTranslation()
  return (
    <div>
      <h1 className={style.title_page}>{t('home')}</h1>
    </div>
  )
}

export default Home
