import ProductRating from '@/components/ProductRating'
import path from '@/constants/path'
import { Product as ProductType } from '@/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, generateNameId } from '@/utils/utils'
import { Link } from 'react-router-dom'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  product: ProductType
}

const Product = ({ product }: Props) => {
  const { t } = useTranslation('product')

  return (
    <Link to={`${path.home}${generateNameId({ name: product.name, id: product._id })}`}>
      <div className='bg-white shadow rounded-sm hover:translate-y-[-0.0625rem] hover:shadow-md duration-100 transition-transform overflow-hidden h-full'>
        <div className='w-full pt-[100%] relative'>
          <img
            src={product?.image}
            alt={product.name}
            loading='lazy'
            decoding='async'
            className='absolute top-0 left-0 w-full h-full bg-white object-cover'
          />
        </div>
        <div className='p-1.5 md:p-2 overflow-hidden flex flex-col gap-1 md:gap-2'>
          <div className='min-h-[1.5rem] md:min-h-[2rem] line-clamp-2 text-xs md:text-sm'>{product.name}</div>
          <div className='flex items-center gap-1 mt-auto'>
            <div className='line-through max-w-[50%] text-gray-500 truncate text-[10px] md:text-xs'>
              {formatCurrency(product.price_before_discount)}đ
            </div>
            <div className='text-orange truncate text-xs md:text-sm font-medium'>{formatCurrency(product.price)}đ</div>
          </div>
          <div className='mt-1 md:mt-2 flex items-center justify-end gap-1'>
            <ProductRating rating={product.rating} activeClassname={''} nonActiveClassname={''} />
            <div className='text-[10px] md:text-xs'>
              <span>{formatNumberToSocialStyle(product.sold)}</span>
              <span className='ml-0.5'>{t('sold')}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default memo(Product)
