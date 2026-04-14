import { describe, it, expect, afterEach } from 'vitest'
import { render, within, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Pagination from '../Pagination'

afterEach(cleanup)

const defaultQueryConfig = {
  page: '1',
  limit: '20',
  sort_by: 'createdAt' as const
}

function renderPagination(page: string, pageSize: number) {
  return render(
    <MemoryRouter>
      <Pagination queryConfig={{ ...defaultQueryConfig, page }} pageSize={pageSize} />
    </MemoryRouter>
  )
}

describe('Pagination', () => {
  it('renders Prev as disabled span on first page', () => {
    const { container } = renderPagination('1', 5)
    const prevEl = within(container).getByText('Prev')
    expect(prevEl.tagName).toBe('SPAN')
  })

  it('renders Prev as link when not on first page', () => {
    const { container } = renderPagination('3', 5)
    const prevEl = within(container).getByText('Prev')
    expect(prevEl.tagName).toBe('A')
  })

  it('renders Next as disabled span on last page', () => {
    const { container } = renderPagination('5', 5)
    const nextEl = within(container).getByText('Next')
    expect(nextEl.tagName).toBe('SPAN')
  })

  it('renders Next as link when not on last page', () => {
    const { container } = renderPagination('1', 5)
    const nextEl = within(container).getByText('Next')
    expect(nextEl.tagName).toBe('A')
  })

  it('renders all pages when page count is small', () => {
    const { container } = renderPagination('1', 5)
    expect(within(container).getByText('1')).toBeTruthy()
    expect(within(container).getByText('2')).toBeTruthy()
    expect(within(container).getByText('5')).toBeTruthy()
  })

  it('renders ellipsis dots for large page counts', () => {
    const { container } = renderPagination('1', 20)
    const dots = within(container).getAllByText('...')
    expect(dots.length).toBeGreaterThan(0)
  })

  it('renders dotBefore ellipsis when page is near the end', () => {
    const { container } = renderPagination('18', 20)
    const dots = within(container).getAllByText('...')
    expect(dots.length).toBeGreaterThan(0)
  })

  it('renders both dotBefore and dotAfter for middle pages', () => {
    const { container } = renderPagination('10', 20)
    const dots = within(container).getAllByText('...')
    expect(dots.length).toBe(2)
  })
})
