import { sortBy, order as orderConstant } from '@/constants/product'

import classNames from 'classnames'
import { ProductListConfig } from '@/types/product.type'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import path from '@/constants/path'
import omit from 'lodash/omit'
import { QueryConfig } from '@/hooks/useQueryConfig'
import { useTranslation } from 'react-i18next'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}
export default function SortProductList({ queryConfig, pageSize }: Props) {
  const { t } = useTranslation('home')
  const page = Number(queryConfig.page)
  const { sort_by = sortBy.createdAt, order } = queryConfig
  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }
  const navigate = useNavigate()
  const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue
          },
          ['order']
        )
      ).toString()
    })
  }
  const handlePriceOrder = (orderValue: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderValue
      }).toString()
    })
  }
  return (
    <div className='bg-gray-300/40 py-2 md:py-4 px-2 md:px-3 rounded-sm'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-2'>
        <div className='flex items-center flex-wrap gap-1.5 md:gap-2 text-xs md:text-sm'>
          <div className='whitespace-nowrap font-medium'>{t('sortBy')}</div>
          <button
            className={classNames(
              'px-2 md:px-4 py-1.5 md:py-2 h-7 md:h-8 capitalize text-xs md:text-sm rounded-sm transition',
              {
                'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.view),
                'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.view)
              }
            )}
            onClick={() => handleSort(sortBy.view)}
          >
            {t('popular')}
          </button>
          <button
            className={classNames(
              'px-2 md:px-4 py-1.5 md:py-2 h-7 md:h-8 capitalize text-xs md:text-sm rounded-sm transition',
              {
                'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.createdAt),
                'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.createdAt)
              }
            )}
            onClick={() => handleSort(sortBy.createdAt)}
          >
            {t('newest')}
          </button>
          <button
            className={classNames(
              'px-2 md:px-4 py-1.5 md:py-2 h-7 md:h-8 capitalize text-xs md:text-sm rounded-sm transition',
              {
                'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.sold),
                'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.sold)
              }
            )}
            onClick={() => handleSort(sortBy.sold)}
          >
            {t('bestSeller')}
          </button>
          <select
            className='h-7 md:h-8 px-2 md:px-4 capitalize text-xs md:text-sm bg-white text-black hover:bg-slate-200 rounded-sm cursor-pointer'
            value={order || ''}
            onChange={(e) => handlePriceOrder(e.target.value as Exclude<ProductListConfig['order'], undefined>)}
          >
            <option value='' disabled>
              {t('selectPrice')}
            </option>
            <option value={orderConstant.asc}>{t('priceLowToHigh')}</option>
            <option value={orderConstant.desc}>{t('priceHighToLow')}</option>
          </select>
        </div>
        <div className='flex items-center gap-2 text-xs md:text-sm'>
          <div className='whitespace-nowrap'>
            <span className='text-orange font-medium'>{page}</span>
            <span>/{pageSize}</span>
          </div>
          <div className='flex gap-0.5'>
            {page === 1 ? (
              <span className='flex w-7 md:w-9 h-7 md:h-8 rounded-sm bg-white/60 cursor-not-allowed justify-center items-center hover:bg-white/60'>
                <svg viewBox='0 0 7 11' className='w-2 md:w-2.5 h-2 md:h-2.5'>
                  <path
                    d='M4.694078 9.8185598L.2870824 5.4331785c-.1957415-.1947815-.1965198-.511363-.0017382-.7071046a.50867033.50867033 0 0 1 .000868-.0008702L4.7381375.2732784 4.73885.273991c.1411545-.127878.3284279-.205779.5338961-.205779.4393237 0 .7954659.3561422.7954659.7954659 0 .2054682-.077901.3927416-.205779.5338961l.0006632.0006632-.0226101.0226101a.80174653.80174653 0 0 1-.0105706.0105706L2.4680138 4.7933195c-.1562097.1562097-.1562097.4094757 0 .5656855a.45579485.45579485 0 0 0 .0006962.0006944l3.3930018 3.3763607-.0009482.0009529c.128869.1413647.2074484.3293723.2074484.5357331 0 .4393237-.3561422.7954659-.7954659.7954659-.2049545 0-.391805-.077512-.5328365-.2048207l-.0003877.0003896-.0097205-.0096728a.80042023.80042023 0 0 1-.0357234-.0355483z'
                    fillRule='nonzero'
                  />
                </svg>
              </span>
            ) : (
              <Link
                className='flex w-7 md:w-9 h-7 md:h-8 rounded-sm bg-white cursor-pointer justify-center items-center hover:bg-slate-100 transition'
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page - 1).toString()
                  }).toString()
                }}
              >
                <svg viewBox='0 0 7 11' className='w-2 md:w-2.5 h-2 md:h-2.5'>
                  <path
                    d='M4.694078 9.8185598L.2870824 5.4331785c-.1957415-.1947815-.1965198-.511363-.0017382-.7071046a.50867033.50867033 0 0 1 .000868-.0008702L4.7381375.2732784 4.73885.273991c.1411545-.127878.3284279-.205779.5338961-.205779.4393237 0 .7954659.3561422.7954659.7954659 0 .2054682-.077901.3927416-.205779.5338961l.0006632.0006632-.0226101.0226101a.80174653.80174653 0 0 1-.0105706.0105706L2.4680138 4.7933195c-.1562097.1562097-.1562097.4094757 0 .5656855a.45579485.45579485 0 0 0 .0006962.0006944l3.3930018 3.3763607-.0009482.0009529c.128869.1413647.2074484.3293723.2074484.5357331 0 .4393237-.3561422.7954659-.7954659.7954659-.2049545 0-.391805-.077512-.5328365-.2048207l-.0003877.0003896-.0097205-.0096728a.80042023.80042023 0 0 1-.0357234-.0355483z'
                    fillRule='nonzero'
                  />
                </svg>
              </Link>
            )}
            {page === pageSize ? (
              <span className='flex w-7 md:w-9 justify-center items-center h-7 md:h-8 rounded-sm bg-white/60 cursor-not-allowed hover:bg-white/60'>
                <svg viewBox='0 0 7 11' className='w-2 md:w-2.5 h-2 md:h-2.5'>
                  <path
                    d='M2.305922 9.81856l4.4069956-4.385381c.1957415-.194782.1965198-.511364.0017382-.707105a.26384055.26384055 0 0 0-.000868-.00087L2.2618625.273278 2.26115.273991C2.1199955.146113 1.9327221.068212 1.7272539.068212c-.4393237 0-.7954659.356142-.7954659.795466 0 .205468.077901.392741.205779.533896l-.0006632.000663.0226101.02261c.0034906.003557.0070143.00708.0105706.010571L4.5319862 4.79332c.1562097.156209.1562097.409475 0 .565685-.0002318.000232-.0004639.000463-.0006962.000694L1.1382882 8.73606l.0009482.000953c-.128869.141365-.2074484.329372-.2074484.535733 0 .439324.3561422.795466.7954659.795466.2049545 0 .391805-.077512.5328365-.204821l.0003877.00039.0097205-.009673c.012278-.011471.0241922-.023327.0357234-.035548z'
                    fillRule='nonzero'
                  />
                </svg>
              </span>
            ) : (
              <Link
                className=' h-7 md:h-8 rounded-sm bg-white cursor-pointer flex justify-center items-center w-7 md:w-9 hover:bg-slate-100 transition'
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page + 1).toString()
                  }).toString()
                }}
              >
                <svg viewBox='0 0 7 11' className='w-2 md:w-2.5 h-2 md:h-2.5'>
                  <path
                    d='M2.305922 9.81856l4.4069956-4.385381c.1957415-.194782.1965198-.511364.0017382-.707105a.26384055.26384055 0 0 0-.000868-.00087L2.2618625.273278 2.26115.273991C2.1199955.146113 1.9327221.068212 1.7272539.068212c-.4393237 0-.7954659.356142-.7954659.795466 0 .205468.077901.392741.205779.533896l-.0006632.000663.0226101.02261c.0034906.003557.0070143.00708.0105706.010571L4.5319862 4.79332c.1562097.156209.1562097.409475 0 .565685-.0002318.000232-.0004639.000463-.0006962.000694L1.1382882 8.73606l.0009482.000953c-.128869.141365-.2074484.329372-.2074484.535733 0 .439324.3561422.795466.7954659.795466.2049545 0 .391805-.077512.5328365-.204821l.0003877.00039.0097205-.009673c.012278-.011471.0241922-.023327.0357234-.035548z'
                    fillRule='nonzero'
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
