import path from '@/constants/path'
import { QueryConfig } from '@/hooks/useQueryConfig'

import classNames from 'classnames'
import { Link, createSearchParams } from 'react-router-dom'
interface Props {
  queryConfig: QueryConfig
  pageSize: number
}
const RANGE = 2
export default function Pagination({ queryConfig, pageSize }: Props) {
  const page = Number(queryConfig.page)
  const renderPagination = () => {
    let dotBefore = false
    let dotAfter = false
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <button
            className='bg-white rounded px-2 md:px-3 py-1.5 md:py-2 shadow-sm mx-1 md:mx-2 cursor-pointer border text-xs md:text-sm'
            key={index}
          >
            ...
          </button>
        )
      }
    }
    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <span
            className='bg-white rounded px-2 md:px-3 py-1.5 md:py-2 shadow-sm mx-1 md:mx-2 border text-xs md:text-sm'
            key={index}
          >
            ...
          </span>
        )
      }
    }
    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber <= pageSize - RANGE) {
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > page + RANGE && pageNumber <= pageSize - RANGE) {
            return renderDotAfter(index)
          }
        } else if (page >= pageSize - RANGE * 2 && pageNumber < page - RANGE && pageNumber > RANGE) {
          return renderDotBefore(index)
        }
        return (
          <Link
            to={{
              pathname: path.home,
              search: createSearchParams({
                ...queryConfig,
                page: pageNumber.toString()
              }).toString()
            }}
            className={classNames(
              `bg-white rounded px-2 md:px-3 py-1.5 md:py-2 shadow-sm mx-1 md:mx-2 cursor-pointer border text-xs md:text-sm transition`,
              {
                'border-cyan-500 text-cyan-500': pageNumber === page,
                'border-transparent hover:border-gray-300': pageNumber !== page
              }
            )}
            key={index}
          >
            {pageNumber}
          </Link>
        )
      })
  }
  return (
    <div className='flex flex-wrap mt-4 md:mt-6 justify-center gap-1 md:gap-2'>
      {page == 1 ? (
        <span className='bg-white rounded px-2 md:px-3 py-1.5 md:py-2 shadow-sm cursor-not-allowed border text-xs md:text-sm opacity-50'>
          Prev
        </span>
      ) : (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              ...queryConfig,
              page: (page - 1).toString()
            }).toString()
          }}
          className='bg-white rounded px-2 md:px-3 py-1.5 md:py-2 shadow-sm cursor-pointer border text-xs md:text-sm hover:bg-gray-50 transition'
        >
          Prev
        </Link>
      )}
      {renderPagination()}
      {page === pageSize ? (
        <span className='bg-white rounded px-2 md:px-3 py-1.5 md:py-2 shadow-sm cursor-not-allowed border text-xs md:text-sm opacity-50'>
          Next
        </span>
      ) : (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              ...queryConfig,
              page: (page + 1).toString()
            }).toString()
          }}
          className='bg-white rounded px-2 md:px-3 py-1.5 md:py-2 shadow-sm cursor-pointer border text-xs md:text-sm hover:bg-gray-50 transition'
        >
          Next
        </Link>
      )}
    </div>
  )
}
