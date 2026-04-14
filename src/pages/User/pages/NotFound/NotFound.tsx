import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/Seo/Seo'

export default function NotFound() {
  const { t } = useTranslation('error')

  return (
    <div className='grid min-h-screen w-full place-items-center bg-gray-900 px-6 py-12 sm:py-24 lg:px-8'>
      <Seo
        title={t('pageNotFoundTitle')}
        description={t('pageNotFoundMessage')}
        pathname='/404'
        robots='noindex,nofollow'
      />
      <div className='text-center'>
        <p className='font-semibold text-orange text-[5rem]'>404</p>
        <h1 className='mt-4 text-4xl font-semibold tracking-tight text-balance text-white sm:text-6xl'>
          {t('pageNotFoundTitle')}
        </h1>
        <p className='mt-6 text-base font-medium text-pretty text-gray-400 sm:text-lg'>{t('pageNotFoundMessage')}</p>
        <div className='mt-10 flex items-center justify-center gap-x-6'>
          <Link
            to='/'
            className='rounded-md bg-orange px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#d13d1f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange'
          >
            {t('goBackHome')}
          </Link>
          <Link to='/' className='text-sm font-semibold text-white'>
            {t('contactSupport')} <span aria-hidden='true'>→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
