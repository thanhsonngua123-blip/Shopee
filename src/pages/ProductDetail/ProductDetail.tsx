/* eslint-disable react-hooks/set-state-in-effect */
import productApi from '@/apis/product.api'
import purchaseApi from '@/apis/purchase.api'
import path from '@/constants/path'
import { queryKeys } from '@/constants/queryKeys'
import { Product as ProductType, ProductListConfig } from '@/types/product.type'
import { getIdFromNameId } from '@/utils/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/Seo/Seo'
import ProductImageGallery from './components/ProductImageGallery'
import ProductInfo from './components/ProductInfo'
import ProductDescription from './components/ProductDescription'
import RelatedProducts from './components/RelatedProducts'

export default function ProductDetail() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { nameId } = useParams()
  const { t } = useTranslation('product')

  const id = getIdFromNameId(nameId as string)

  const [buyCount, setBuyCount] = useState(1)
  const [activeImage, setActiveImage] = useState('')

  const location = useLocation()

  const { data: productDetailData } = useQuery({
    queryKey: queryKeys.product(id as string),
    queryFn: () => productApi.getProductDetail(id as string)
  })

  const product = productDetailData?.data.data

  const queryConfig = {
    limit: '20',
    page: '1',
    category: product?.category._id
  }

  const { data: productsData } = useQuery({
    queryKey: queryKeys.products(queryConfig),
    queryFn: () => productApi.getProducts(queryConfig as ProductListConfig),
    enabled: Boolean(product),
    staleTime: 3 * 60 * 1000
  })

  const addToCartMutation = useMutation({
    mutationFn: (body: { product_id: string; buy_count: number }) => purchaseApi.addToCart(body)
  })

  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0])
    }
  }, [product])

  const addToCart = () => {
    addToCartMutation.mutate(
      {
        buy_count: buyCount,
        product_id: (product as ProductType)?._id
      },
      {
        onSuccess: () => {
          toast.success(t('addToCartSuccess'), { autoClose: 1000 })
          queryClient.invalidateQueries({ queryKey: queryKeys.purchasesInCart() })
        }
      }
    )
  }

  const buyNow = async () => {
    const res = await addToCartMutation.mutateAsync({
      buy_count: buyCount,
      product_id: (product as ProductType)._id
    })

    navigate(path.cart, {
      state: {
        purchaseId: res.data.data?._id
      }
    })
  }

  if (!product) return null

  const productSeoDescription = product.description.replace(/<[^>]+>/g, '').slice(0, 160)

  return (
    <div className='bg-gray-200 py-3 md:py-6'>
      <Seo
        title={`${product.name} | Shopee`}
        description={productSeoDescription}
        image={product.images[0]}
        pathname={location.pathname}
      />
      <div className='container'>
        <div className='rounded-sm bg-white p-2 shadow md:p-4'>
          <div className='grid grid-cols-12 gap-4 md:gap-9'>
            <div className='col-span-12 sm:col-span-6 md:col-span-5'>
              <ProductImageGallery product={product} activeImage={activeImage} setActiveImage={setActiveImage} />
            </div>

            <div className='col-span-12 sm:col-span-6 md:col-span-7'>
              <ProductInfo
                product={product}
                buyCount={buyCount}
                setBuyCount={setBuyCount}
                onAddToCart={addToCart}
                onBuyNow={buyNow}
              />
            </div>
          </div>
        </div>
      </div>

      <ProductDescription description={product.description || ''} />
      <RelatedProducts products={productsData?.data.data?.products} />
    </div>
  )
}
