import { Product as ProductType } from '@/types/product.type'
import Product from '@/pages/ProductList/components/Product/Product'

interface RelatedProductsProps {
  products?: ProductType[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) return null

  return (
    <div className='mt-4 md:mt-8'>
      <div className='container'>
        <div className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-6 md:gap-4 md:grid-cols-3 lg:grid-cols-4'>
          {products.map((item) => (
            <div className='col-span-1' key={item._id}>
              <Product product={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
