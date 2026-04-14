import { describe, it, expect, afterEach } from 'vitest'
import { render, within, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RatingStars from './RatingStars'

afterEach(cleanup)

const defaultQueryConfig = {
  page: '1',
  limit: '20',
  sort_by: 'createdAt' as const
}

function renderRatingStars(queryConfig = defaultQueryConfig) {
  return render(
    <MemoryRouter>
      <RatingStars queryConfig={queryConfig} />
    </MemoryRouter>
  )
}

describe('RatingStars component', () => {
  it('renders 5 rating rows', () => {
    const { container } = renderRatingStars()
    const rows = container.querySelectorAll('li')
    expect(rows.length).toBe(5)
  })

  it('first row (5 stars) shows 5 filled stars', () => {
    const { container } = renderRatingStars()
    const firstRow = container.querySelectorAll('li')[0]
    // 5 filled + 0 empty star SVGs in first row
    const goldSvgs = firstRow.querySelectorAll('svg[viewBox="0 0 9.5 8"]')
    expect(goldSvgs.length).toBe(5)
  })

  it('last row (1 star) shows 1 filled star', () => {
    const { container } = renderRatingStars()
    const lastRow = container.querySelectorAll('li')[4]
    const goldSvgs = lastRow.querySelectorAll('svg[viewBox="0 0 9.5 8"]')
    expect(goldSvgs.length).toBe(1)
  })

  it('renders "trở lên" text label for non-first rows', () => {
    const { container } = renderRatingStars()
    const labels = within(container).getAllByText(/trở lên/)
    // "trở lên" only appears when index !== 0, so 4 times
    expect(labels.length).toBe(4)
  })
})
