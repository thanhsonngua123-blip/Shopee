import { keepPreviousData, useQuery } from '@tanstack/react-query'
import AsideFilter from './components/AsideFilter'
import Product from './components/Product/Product'

import productApi from '@/apis/product.api'
import Pagination from '@/components/Pagination'

import { ProductListConfig } from '@/types/product.type'

import categoryApi from '@/apis/category.api'
import SortProductList from './components/SortProductList'
import useQueryConfig from '@/hooks/useQueryConfig'
import Seo from '@/components/Seo/Seo'
import { queryKeys } from '@/constants/queryKeys'

export default function ProductList() {
  const queryConfig = useQueryConfig()
  const { data: productData } = useQuery({
    queryKey: queryKeys.products(queryConfig),
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    placeholderData: keepPreviousData,
    staleTime: 3 * 60 * 1000
  })

  const { data: categoryData } = useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  return (
    <div className='bg-gray-200 py-3 md:py-6'>
      <Seo
        title='Shopee - Mua sắm trực tuyến'
        description='Tìm kiếm sản phẩm đa dạng, giá tốt trên Shopee. Mua sắm nhanh chóng và an toàn.'
        pathname='/'
      />
      <div className='container'>
        {productData && (
          <div className='grid grid-cols-12 gap-3 md:gap-6'>
            <div className='hidden md:block md:col-span-3 lg:col-span-2'>
              <AsideFilter categories={categoryData?.data.data || []} queryConfig={queryConfig} />
            </div>
            <div className='col-span-12 md:col-span-9 lg:col-span-10'>
              <SortProductList queryConfig={queryConfig} pageSize={productData.data.data!.pagination.page_size} />
              <div className='mt-4 md:mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4'>
                {productData.data.data?.products.map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              <Pagination queryConfig={queryConfig} pageSize={productData.data.data!.pagination.page_size} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
