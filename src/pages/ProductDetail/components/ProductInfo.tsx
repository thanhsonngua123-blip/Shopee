import ProductRating from '@/components/ProductRating'
import QuantityController from '@/components/QuantityController'
import { Product as ProductType } from '@/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, rateSale } from '@/utils/utils'
import { useTranslation } from 'react-i18next'

interface ProductInfoProps {
  product: ProductType
  buyCount: number
  setBuyCount: React.Dispatch<React.SetStateAction<number>>
  onAddToCart: () => void
  onBuyNow: () => void
}

export default function ProductInfo({ product, buyCount, setBuyCount, onAddToCart, onBuyNow }: ProductInfoProps) {
  const { t } = useTranslation('product')

  return (
    <>
      <h1 className='text-base font-medium uppercase md:text-xl lg:text-2xl'>{product.name}</h1>
      <div className='mt-2 flex flex-wrap items-center gap-2 md:mt-4 md:gap-4'>
        <div className='flex items-center gap-1'>
          <span className='border-b border-b-orange text-xs font-medium text-orange md:text-sm'>{product.rating}</span>
          <ProductRating
            rating={product.rating}
            activeClassname='h-3 w-3 fill-orange text-orange md:h-4 md:w-4'
            nonActiveClassname='h-3 w-3 fill-gray-300 text-gray-300 md:h-4 md:w-4'
          />
        </div>
        <div className='hidden h-3 w-[1px] bg-gray-300 sm:block md:h-4'></div>
        <div className='text-xs md:text-sm'>
          <span className='border-b border-b-gray-400'>{formatNumberToSocialStyle(product.sold)}</span>
          <span className='ml-1 text-gray-500'>{t('sold')}</span>
        </div>
      </div>

      <div className='mt-3 flex flex-col items-start gap-2 rounded-sm bg-gray-50 px-3 py-2 sm:flex-row sm:items-center md:mt-4 md:px-5 md:py-4'>
        <div className='text-xs text-gray-500 line-through md:text-xl'>
          {formatCurrency(product.price_before_discount)}đ
        </div>
        <div className='text-xl font-medium text-orange md:text-3xl'>{formatCurrency(product.price)}đ</div>
        <div className='rounded-sm bg-orange px-1.5 py-1 text-[10px] font-semibold uppercase text-white md:py-[2px] md:text-xs'>
          {rateSale(product.price, product.price_before_discount)}% giảm
        </div>
      </div>

      <div className='mt-3 flex flex-col gap-2 sm:flex-row sm:items-center md:mt-4'>
        <div className='whitespace-nowrap text-xs capitalize text-gray-500 md:text-sm'>{t('quantity')}</div>
        <QuantityController
          onDecrease={setBuyCount}
          onIncrease={setBuyCount}
          onType={setBuyCount}
          value={buyCount}
          max={product.quantity}
        />
        <div className='text-[11px] text-gray-500 md:text-sm'>
          {product.quantity} {t('availableProducts')}
        </div>
      </div>

      <div className='mt-6 flex flex-col gap-2 sm:flex-row md:mt-8 md:gap-4'>
        <button
          className='flex flex-1 items-center justify-center gap-1.5 rounded-sm border border-orange bg-orange/10 px-2 text-xs capitalize text-orange shadow-sm transition hover:bg-orange/5 sm:flex-none md:h-12 md:px-4 md:text-base'
          onClick={onAddToCart}
        >
          <img
            alt='icon-add-to-cart'
            className='h-4 md:h-5'
            src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/f600cbfffbe02cc144a1.svg'
          />
          <span className='hidden sm:inline'>{t('addToCart')}</span>
          <span className='sm:hidden'>{t('addToCart')}</span>
        </button>
        <button
          onClick={onBuyNow}
          className='flex h-10 flex-1 items-center justify-center rounded-sm bg-orange px-3 text-xs capitalize text-white shadow-sm outline-none transition hover:bg-orange/90 md:h-12 md:px-5 md:text-base'
        >
          {t('buyNow')}
        </button>
      </div>
    </>
  )
}
