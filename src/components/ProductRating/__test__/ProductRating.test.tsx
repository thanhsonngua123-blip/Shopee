import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import ProductRating from '../ProductRating'

const defaultProps = {
  rating: 4.5,
  activeClassname: 'active-star',
  nonActiveClassname: 'inactive-star'
}

describe('ProductRating', () => {
  it('renders 5 star containers', () => {
    const { container } = render(<ProductRating {...defaultProps} />)
    // Each star has both an active overlay and a background svg
    const svgEls = container.querySelectorAll('svg')
    // 5 active + 5 background = 10 svgs
    expect(svgEls.length).toBe(10)
  })

  it('first 4 stars are fully filled (width 100%) for rating 4.5', () => {
    const { container } = render(<ProductRating {...defaultProps} />)
    const overlays = container.querySelectorAll('.absolute')
    expect((overlays[0] as HTMLElement).style.width).toBe('100%')
    expect((overlays[1] as HTMLElement).style.width).toBe('100%')
    expect((overlays[2] as HTMLElement).style.width).toBe('100%')
    expect((overlays[3] as HTMLElement).style.width).toBe('100%')
  })

  it('5th star is 50% filled for rating 4.5', () => {
    const { container } = render(<ProductRating {...defaultProps} />)
    const overlays = container.querySelectorAll('.absolute')
    expect((overlays[4] as HTMLElement).style.width).toBe('50%')
  })

  it('all stars are 0% filled for rating 0', () => {
    const { container } = render(
      <ProductRating rating={0} activeClassname='active-star' nonActiveClassname='inactive-star' />
    )
    const overlays = container.querySelectorAll('.absolute')
    overlays.forEach((el) => {
      expect((el as HTMLElement).style.width).toBe('0%')
    })
  })

  it('all stars are 100% filled for rating 5', () => {
    const { container } = render(
      <ProductRating rating={5} activeClassname='active-star' nonActiveClassname='inactive-star' />
    )
    const overlays = container.querySelectorAll('.absolute')
    overlays.forEach((el) => {
      expect((el as HTMLElement).style.width).toBe('100%')
    })
  })

  it('applies activeClassname to active svg', () => {
    const { container } = render(<ProductRating {...defaultProps} />)
    const activeSvgs = container.querySelectorAll('.active-star')
    expect(activeSvgs.length).toBeGreaterThan(0)
  })

  it('applies nonActiveClassname to background svg', () => {
    const { container } = render(<ProductRating {...defaultProps} />)
    const inactiveSvgs = container.querySelectorAll('.inactive-star')
    expect(inactiveSvgs.length).toBe(5)
  })
})
