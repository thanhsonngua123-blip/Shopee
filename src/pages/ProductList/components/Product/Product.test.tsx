import { describe, it, expect, afterEach } from 'vitest'
import { render, within, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Product from '../Product'
import type { Product as ProductType } from '@/types/product.type'
import '@/i18n/i18n'

afterEach(cleanup)

const mockProduct: ProductType = {
  _id: 'abc123',
  name: 'Áo thun nam',
  price: 150000,
  price_before_discount: 200000,
  rating: 4.5,
  sold: 1200,
  quantity: 50,
  view: 500,
  image: 'https://example.com/image.jpg',
  images: [],
  description: 'Mô tả sản phẩm',
  category: { _id: 'cat1', name: 'Thời trang', __v: 0 },
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
}

function renderProduct(product = mockProduct) {
  return render(
    <MemoryRouter>
      <Product product={product} />
    </MemoryRouter>
  )
}

describe('Product component', () => {
  it('renders product name', () => {
    const { container } = renderProduct()
    expect(within(container).getByText('Áo thun nam')).toBeTruthy()
  })

  it('renders product image with alt text', () => {
    const { container } = renderProduct()
    const img = within(container).getByAltText('Áo thun nam')
    expect(img).toBeTruthy()
    expect((img as HTMLImageElement).src).toContain('example.com')
  })

  it('renders formatted discounted price', () => {
    const { container } = renderProduct()
    expect(within(container).getByText(/150\.000/)).toBeTruthy()
  })

  it('renders formatted original price', () => {
    const { container } = renderProduct()
    expect(within(container).getByText(/200\.000/)).toBeTruthy()
  })

  it('renders ProductRating component', () => {
    const { container } = renderProduct()
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })

  it('renders link to product detail page', () => {
    const { container } = renderProduct()
    const link = within(container).getByRole('link')
    expect((link as HTMLAnchorElement).href).toContain('abc123')
  })

  it('renders sold count', () => {
    const { container } = renderProduct()
    // formatNumberToSocialStyle(1200) -> '1,2k' or similar compact form
    expect(within(container).getByText(/1[.,]2/)).toBeTruthy()
  })
})
