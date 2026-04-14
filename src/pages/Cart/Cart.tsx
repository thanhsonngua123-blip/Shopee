import purchaseApi from '@/apis/purchase.api'
import Button from '@/components/Button'
import QuantityController from '@/components/QuantityController'
import path from '@/constants/path'
import { purchaseStatus } from '@/constants/purchase'
import { queryKeys } from '@/constants/queryKeys'
import { ExtendedPurchase, Purchase } from '@/types/purchase.type'
import { formatCurrency, generateNameId } from '@/utils/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import Seo from '@/components/Seo/Seo'

export default function Cart() {
  const { t } = useTranslation('cart')
  const queryClient = useQueryClient()
  const location = useLocation()
  const selectedPurchaseId = (location.state as { purchaseId: string } | null)?.purchaseId

  const [checkedPurchaseIds, setCheckedPurchaseIds] = useState<string[]>(() =>
    selectedPurchaseId ? [selectedPurchaseId] : []
  )
  const [disabledPurchaseIds, setDisabledPurchaseIds] = useState<string[]>([])
  const [draftQuantities, setDraftQuantities] = useState<Record<string, number>>({})

  const { data: purchasesInCartData } = useQuery({
    queryKey: queryKeys.purchasesInCart(),
    queryFn: () => purchaseApi.getPurchases({ status: purchaseStatus.inCart })
  })

  const purchasesInCart = useMemo(() => purchasesInCartData?.data.data ?? [], [purchasesInCartData])

  useEffect(() => {
    return () => {
      if (selectedPurchaseId) {
        location.state = null
      }
    }
  }, [selectedPurchaseId, location])

  const extendedPurchases = useMemo<ExtendedPurchase[]>(
    () =>
      purchasesInCart.map((purchase) => ({
        ...purchase,
        disabled: disabledPurchaseIds.includes(purchase._id),
        checked: checkedPurchaseIds.includes(purchase._id),
        buy_count: draftQuantities[purchase._id] ?? purchase.buy_count
      })),
    [checkedPurchaseIds, disabledPurchaseIds, draftQuantities, purchasesInCart]
  )

  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchasesInCart() })
    }
  })

  const deletePurchasesMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchasesInCart() })
    }
  })

  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.buyProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchasesInCart() })
      toast.success('Mua hàng thành công', {
        position: 'top-right',
        autoClose: 1000
      })
    }
  })

  const isAllChecked = useMemo(
    () => extendedPurchases.length > 0 && extendedPurchases.every((purchase) => purchase.checked),
    [extendedPurchases]
  )

  const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])

  const checkedPurchasesCount = checkedPurchases.length

  const totalCheckedPurchasePrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + current.product.price * current.buy_count
      }, 0),
    [checkedPurchases]
  )

  const totalCheckedPurchaseSavingPrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + (current.product.price_before_discount - current.product.price) * current.buy_count
      }, 0),
    [checkedPurchases]
  )

  const handleChecked = (purchaseId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedPurchaseIds((prev) => (e.target.checked ? [...prev, purchaseId] : prev.filter((id) => id !== purchaseId)))
  }

  const handleCheckedAll = () => {
    setCheckedPurchaseIds(isAllChecked ? [] : extendedPurchases.map((purchase) => purchase._id))
  }

  const handleQuantity = (purchase: ExtendedPurchase, value: number, enabled: boolean) => {
    if (!enabled) return

    setDisabledPurchaseIds((prev) => (prev.includes(purchase._id) ? prev : [...prev, purchase._id]))

    updatePurchaseMutation.mutate(
      {
        product_id: purchase.product._id,
        buy_count: value
      },
      {
        onSuccess: () => {
          setDraftQuantities((prev) => ({ ...prev, [purchase._id]: value }))
          setDisabledPurchaseIds((prev) => prev.filter((id) => id !== purchase._id))
        },
        onError: () => {
          setDisabledPurchaseIds((prev) => prev.filter((id) => id !== purchase._id))
        }
      }
    )
  }

  const handleTypeQuantity = (purchaseId: string) => (value: number) => {
    setDraftQuantities((prev) => ({ ...prev, [purchaseId]: value }))
  }

  const handleDelete = (purchaseId: string) => () => {
    deletePurchasesMutation.mutate([purchaseId])
  }

  const handleDeleteManyPurchases = () => {
    deletePurchasesMutation.mutate(checkedPurchases.map((purchase) => purchase._id))
  }

  const handleBuyPurchases = () => {
    if (checkedPurchases.length === 0) return

    buyProductsMutation.mutate(
      checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))
    )
  }

  return (
    <div className='bg-neutral-100 py-16'>
      <Seo title={t('cartTitle')} description='Xem giỏ hàng và tiến hành thanh toán nhanh chóng trên Shopee.' pathname='/cart' />
      <div className='container'>
        {extendedPurchases.length > 0 ? (
          <>
            <div className='overflow-auto'>
              <div className='min-w-[700px] md:min-w-[1000px]'>
                <div className='grid grid-cols-12 rounded-sm bg-white px-4 py-3 md:px-9 md:py-5 text-xs md:text-sm capitalize text-gray-500 shadow'>
                  <div className='col-span-6'>
                    <div className='flex items-center'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          className='h-5 w-5 accent-orange'
                          checked={isAllChecked}
                          onChange={handleCheckedAll}
                          disabled={extendedPurchases.length === 0}
                        />
                      </div>
                      <div className='flex-grow text-black'>{t('product')}</div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 text-center'>
                      <div className='col-span-2'>{t('unitPrice')}</div>
                      <div className='col-span-1'>{t('quantity')}</div>
                      <div className='col-span-1'>{t('totalPrice')}</div>
                      <div className='col-span-1'>{t('action')}</div>
                    </div>
                  </div>
                </div>

                <div className='my-3 rounded-sm bg-white p-3 md:p-5 shadow'>
                  {extendedPurchases.map((purchase, index) => (
                    <div
                      key={purchase._id}
                      className='mb-5 grid grid-cols-12 items-center rounded-sm border border-gray-200 px-4 py-4 md:py-5 text-center text-xs md:text-sm text-gray-500 first:mt-0'
                    >
                      <div className='col-span-6'>
                        <div className='flex'>
                          <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                            <input
                              type='checkbox'
                              className='h-5 w-5 accent-orange'
                              checked={purchase.checked}
                              onChange={handleChecked(purchase._id)}
                            />
                          </div>
                          <div className='flex-grow'>
                            <div className='flex'>
                              <Link
                                to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                                className='h-16 w-16 md:h-20 md:w-20 flex-shrink-0'
                              >
                                <img src={purchase.product.image} alt={purchase.product.name} />
                              </Link>
                              <div className='flex-grow px-2 pb-2 pt-1 text-left'>
                                <Link
                                  to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                                  className='line-clamp-2'
                                >
                                  {purchase.product.name}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='col-span-6'>
                        <div className='grid grid-cols-5 items-center'>
                          <div className='col-span-2'>
                            <div className='flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2'>
                              <span className='text-gray-300 line-through'>
                                {formatCurrency(purchase.price_before_discount)}đ
                              </span>
                              <span>{formatCurrency(purchase.price)}đ</span>
                            </div>
                          </div>
                          <div className='col-span-1'>
                            <QuantityController
                              max={purchase.product.quantity}
                              value={purchase.buy_count}
                              classNameWrapper='flex items-center justify-center'
                              onIncrease={(value) =>
                                handleQuantity(purchase, value, value <= purchase.product.quantity)
                              }
                              onDecrease={(value) => handleQuantity(purchase, value, value >= 1)}
                              disabled={purchase.disabled}
                              onType={handleTypeQuantity(purchase._id)}
                              onFocusOut={(value) =>
                                handleQuantity(
                                  purchase,
                                  value,
                                  value >= 1 &&
                                    value <= purchase.product.quantity &&
                                    value !== (purchasesInCart[index] as Purchase).buy_count
                                )
                              }
                            />
                          </div>
                          <div className='col-span-1'>
                            <span className='text-orange'>
                              {formatCurrency(purchase.product.price * purchase.buy_count)}đ
                            </span>
                          </div>
                          <div className='col-span-1'>
                            <button
                              className='bg-none text-black transition-colors hover:text-orange'
                              onClick={handleDelete(purchase._id)}
                            >
                              {t('remove')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className='sticky bottom-0 z-10 mt-6 md:mt-10 flex flex-col rounded-sm border border-gray-200 bg-white p-3 md:p-5 shadow sm:flex-row sm:items-center'>
              <div className='flex items-center'>
                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                  <input
                    type='checkbox'
                    className='h-5 w-5 accent-orange'
                    checked={isAllChecked}
                    onChange={handleCheckedAll}
                    disabled={extendedPurchases.length === 0}
                  />
                </div>
                <button className='mx-3 border-none bg-none whitespace-nowrap' onClick={handleCheckedAll}>
                  {t('selectAll')} ({extendedPurchases.length})
                </button>
                <button className='mx-3 border-none bg-none' onClick={handleDeleteManyPurchases}>
                  {t('remove')}
                </button>
              </div>

              <div className='mt-4 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center'>
                <div className='mb-4 sm:mb-0'>
                  <div className='flex items-center justify-between sm:justify-end'>
                    <div>
                      {t('orderTotal')} ({checkedPurchasesCount} {t('quantity').toLowerCase()}):{' '}
                    </div>
                    <div className='ml-2 text-xl md:text-2xl text-orange'>
                      {formatCurrency(totalCheckedPurchasePrice)}đ
                    </div>
                  </div>
                  <div className='flex items-center justify-between sm:justify-end text-xs md:text-sm'>
                    <div className='text-gray-500'>{t('saving')}: </div>
                    <div className='ml-6 text-orange'>{formatCurrency(totalCheckedPurchaseSavingPrice)}đ</div>
                  </div>
                </div>
                <Button
                  className='mt-3 flex h-10 w-full sm:ml-4 sm:mt-0 sm:w-52 items-center justify-center bg-red-500 px-4 text-center text-sm uppercase text-white hover:bg-red-600'
                  disabled={buyProductsMutation.isPending || checkedPurchases.length === 0}
                  onClick={handleBuyPurchases}
                >
                  {t('buyProducts')}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className='flex flex-col items-center justify-center rounded-sm bg-white px-4 py-20 shadow'>
            <img
              src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/12fe8880616de161.png'
              alt='empty cart'
              className='h-24 w-24 object-contain'
            />
            <div className='mt-2 font-bold text-gray-400'>{t('emptyCartTitle')}</div>
            <Link
              to={path.home}
              className='mt-5 rounded-sm bg-orange px-10 py-2 uppercase text-white shadow-sm transition-colors hover:bg-orange/80'
            >
              {t('shopNow')}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
