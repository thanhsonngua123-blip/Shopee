import { describe, it, expect, afterEach } from 'vitest'
import { render, within, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SortProductList from '../SortProductList'
import '@/i18n/i18n'

afterEach(cleanup)

const defaultQueryConfig = {
  page: '1',
  limit: '20',
  sort_by: 'createdAt' as const
}

function renderSort(queryConfig = defaultQueryConfig, pageSize = 10) {
  return render(
    <MemoryRouter>
      <SortProductList queryConfig={queryConfig} pageSize={pageSize} />
    </MemoryRouter>
  )
}

describe('SortProductList', () => {
  it('renders sort buttons', () => {
    const { container } = renderSort()
    const buttons = within(container).getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('renders price order select', () => {
    const { container } = renderSort()
    expect(container.querySelector('select')).toBeTruthy()
  })

  it('highlights active sort button when sort_by matches', () => {
    const { container } = renderSort({ ...defaultQueryConfig, sort_by: 'view' as const })
    const buttons = container.querySelectorAll('button')
    const viewBtn = Array.from(buttons).find((btn) => btn.textContent?.includes('Phổ biến'))
    expect(viewBtn?.className).toContain('bg-orange')
  })

  it('shows price order options', () => {
    const { container } = renderSort()
    const select = container.querySelector('select') as HTMLSelectElement
    expect(select?.options.length).toBeGreaterThan(1)
  })

  it('renders current page number', () => {
    const { container } = renderSort()
    const pageSpan = container.querySelector('.text-orange.font-medium')
    expect(pageSpan?.textContent).toBe('1')
  })
})
