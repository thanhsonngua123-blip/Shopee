import DOMPurify from 'dompurify'
import { useTranslation } from 'react-i18next'

interface ProductDescriptionProps {
  description: string
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  const { t } = useTranslation('product')

  return (
    <div className='mt-4 rounded-sm bg-white p-2 shadow md:mt-8 md:p-4'>
      <div className='container'>
        <div className='rounded bg-gray-50 p-3 text-sm font-medium capitalize text-slate-700 md:p-4 md:text-lg'>
          {t('description')}
        </div>
        <div className='mx-2 mb-4 mt-2 text-xs md:mx-4 md:text-sm'>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(description)
            }}
          />
        </div>
      </div>
    </div>
  )
}
