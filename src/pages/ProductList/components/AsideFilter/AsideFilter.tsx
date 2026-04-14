import Button from '@/components/Button'

import path from '@/constants/path'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'

import { Category } from '@/types/category.type'
import classNames from 'classnames'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { filterSchema } from '@/utils/rules'
import InputNumber from '@/components/InputNumber'
import RatingStars from '../RatingStar'
import omit from 'lodash/omit'
import { QueryConfig } from '@/hooks/useQueryConfig'
import { useTranslation } from 'react-i18next'
interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}

type FormData = {
  price_min: string
  price_max: string
}

export default function AsideFilter({ queryConfig, categories }: Props) {
  const { t } = useTranslation('home')
  const { category } = queryConfig
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: zodResolver(filterSchema)
  })
  const navigate = useNavigate()
  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_min: data.price_min,
        price_max: data.price_max
      }).toString()
    })
  })

  const handleRemoveAll = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['price_min', 'price_max', 'rating_filter', 'category'])).toString()
    })
  }

  return (
    <div className='py-2 md:py-4 text-sm md:text-base'>
      <Link
        to={path.home}
        className={classNames('flex items-center font-bold text-xs md:text-sm', {
          'text-orange': !category
        })}
      >
        <svg viewBox='0 0 12 10' className='w-2.5 md:w-3 h-3 md:h-4 mr-1.5 md:mr-2 fill-current flex-shrink-0'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        {t('allCategories')}
      </Link>
      <div className='bg-gray-300 h-[1px] my-2 md:my-4' />

      <ul>
        {categories.map((item) => {
          const isActive = category === item._id
          return (
            <li className='py-1.5 md:py-2 pl-1.5 md:pl-2' key={item._id}>
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    category: item._id
                  }).toString()
                }}
                className={classNames('relative px-1.5 md:px-2 text-xs md:text-sm', {
                  'text-orange font-semibold': isActive
                })}
              >
                {isActive && (
                  <svg
                    viewBox='0 0 4 7'
                    className='h-1.5 md:h-2 w-1.5 md:w-2 fill-orange absolute top-1 left-[-8px] md:left-[-10px]'
                  >
                    <polygon points='4 3.5 0 0 0 7' />
                  </svg>
                )}

                {item.name}
              </Link>
            </li>
          )
        })}
      </ul>
      <Link
        to={path.home}
        className='flex items-center font-bold mt-2 md:mt-4 uppercase text-xs md:text-sm gap-1.5 md:gap-2'
      >
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x={0}
          y={0}
          className='w-2.5 md:w-3 h-3 md:h-4 fill-current stroke-current flex-shrink-0'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        {t('searchFilter')}
      </Link>
      <div className='bg-gray-300 h-[1px] my-2 md:my-4' />
      <div className='my-3 md:my-5'>
        <div className='text-xs md:text-sm font-medium'>{t('priceRange')}</div>
        <form className='mt-2 md:mt-3' onSubmit={onSubmit}>
          <div className='flex items-start gap-1 md:gap-2'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='number'
                    className='w-20'
                    name='from'
                    placeholder={`₫ ${t('from')}`}
                    classNameInput='p-1 w-full border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    onChange={(e) => {
                      field.onChange(e)
                      trigger('price_max')
                    }}
                    value={field.value}
                    ref={field.ref}
                    classNameError='hidden'
                  />
                )
              }}
            />

            <div className='mx-2 shrink-0'>-</div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='number'
                    className='w-20'
                    name='to'
                    placeholder={`₫ ${t('to')}`}
                    classNameInput='p-1 w-full border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    onChange={(e) => {
                      field.onChange(e)
                      trigger('price_min')
                    }}
                    value={field.value}
                    ref={field.ref}
                    classNameError='hidden'
                  />
                )
              }}
            />
          </div>
          <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm text-center mb-1'>{errors.price_min?.message}</div>
          <Button className='w-full p-2 uppercase bg-orange text-white text-sm hover:bg-orange-80 flex justify-center items-center'>
            {t('apply')}
          </Button>
        </form>
      </div>
      <div className='bg-gray-300 h-[1px] my-4 ' />
      <div className='text-sm'>{t('rating')}</div>
      <RatingStars queryConfig={queryConfig} />
      <div className='bg-gray-300 h-[1px] my-4 ' />
      <Button
        className='w-full p-2 uppercase bg-orange text-white text-sm hover:bg-orange-80 flex justify-center items-center'
        onClick={() => handleRemoveAll()}
      >
        Xóa tất cả
      </Button>
    </div>
  )
}
