import purchaseApi from '@/apis/purchase.api'
import path from '@/constants/path'
import { purchaseStatus } from '@/constants/purchase'
import useQueryParams from '@/hooks/useQueryParams'
import { PurchaseListStatus } from '@/types/purchase.type'
import { formatCurrency, generateNameId } from '@/utils/utils'
import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { createSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

type PurchaseTabNameKey =
  | 'statusAll'
  | 'statusWaitForConfirmation'
  | 'statusWaitForGetting'
  | 'statusInProgress'
  | 'statusDelivered'
  | 'statusCanceled'

const purchaseTabs: { status: number; nameKey: PurchaseTabNameKey }[] = [
  {
    status: purchaseStatus.all,
    nameKey: 'statusAll'
  },
  {
    status: purchaseStatus.waitForConfirmation,
    nameKey: 'statusWaitForConfirmation'
  },
  {
    status: purchaseStatus.waitForGetting,
    nameKey: 'statusWaitForGetting'
  },
  {
    status: purchaseStatus.inProgress,
    nameKey: 'statusInProgress'
  },
  {
    status: purchaseStatus.delivered,
    nameKey: 'statusDelivered'
  },
  {
    status: purchaseStatus.canceled,
    nameKey: 'statusCanceled'
  }
]

export default function HistoryPurchase() {
  const { t } = useTranslation('user')
  const queryParams: {
    status?: string
  } = useQueryParams()
  const status: number = Number(queryParams.status) || purchaseStatus.all

  const purchaseTabsLink = purchaseTabs.map((tab) => (
    <Link
      key={tab.status}
      to={{
        pathname: path.historyPurchase,
        search: createSearchParams({
          status: tab.status.toString()
        }).toString()
      }}
      className={classNames(
        'flex items-center justify-center border-b-2 bg-white py-3 px-4 text-xs md:flex-1 md:py-4 md:px-0 md:text-sm font-medium whitespace-nowrap flex-shrink-0',
        {
          'border-b-orange text-orange': status === tab.status,
          'border-b-black/10 text-gray-900': status !== tab.status
        }
      )}
    >
      {t(tab.nameKey)}
    </Link>
  ))

  const {
    data: purchaseData,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['purchase', { status }],
    queryFn: () => purchaseApi.getPurchases({ status: status as PurchaseListStatus })
  })
  const purchases = purchaseData?.data.data || []

  if (isLoading) return <div className='flex h-40 items-center justify-center text-gray-500'>{t('loadingOrders')}</div>
  if (isError) return <div className='flex h-40 items-center justify-center text-gray-500'>{t('fetchError')}</div>

  return (
    <div>
      <div className='sticky top-0 z-10 flex overflow-x-auto rounded-t-sm shadow-sm bg-white'>{purchaseTabsLink}</div>
      <div className='space-y-4'>
        {purchases.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-sm bg-white px-4 py-16 md:py-20 shadow'>
            <img
              src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/12fe8880616de161.png'
              alt='empty cart'
              className='h-20 w-20 md:h-24 md:w-24 object-contain'
            />
            <div className='mt-3 font-bold text-gray-400'>{t('noOrders')}</div>
          </div>
        ) : (
          purchases.map((purchase) => (
            <div
              key={purchase._id}
              className='rounded-sm border border-black/10 bg-white p-4 md:p-6 text-gray-800 shadow-sm'
            >
              <Link
                to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                className='flex'
              >
                <div className='flex-shrink-0'>
                  <img
                    src={purchase.product.image}
                    className='h-16 w-16 md:h-20 md:w-20 object-cover'
                    alt={purchase.product.name}
                  />
                </div>
                <div className='ml-2 md:ml-3 flex-grow overflow-hidden'>
                  <div className='line-clamp-2 text-base md:text-lg'>{purchase.product.name}</div>
                  <div className='mt-2 md:mt-3 text-sm'>x{purchase.buy_count}</div>
                </div>
                <div className='ml-2 md:ml-3 flex-shrink-0 text-right'>
                  <span className='block truncate text-gray-500 line-through text-xs md:text-sm'>
                    đ{formatCurrency(purchase.price_before_discount)}
                  </span>
                  <span className='truncate text-orange ml-1 md:ml-2 text-sm md:text-base'>
                    đ{formatCurrency(purchase.price)}
                  </span>
                </div>
              </Link>
              <div className='mt-4 flex justify-end border-t border-black/10 pt-4'>
                <div>
                  <span className='text-sm'>Tổng giá tiền: </span>
                  <span className='ml-4 text-lg md:text-xl text-orange'>
                    đ{formatCurrency(purchase.price * purchase.buy_count)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
