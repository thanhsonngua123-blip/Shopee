import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, cleanup, fireEvent } from '@testing-library/react'
import { InputNumber } from '../InputNumber'

afterEach(cleanup)

describe('InputNumber', () => {
  it('renders the input element', () => {
    const { container } = render(<InputNumber />)
    expect(container.querySelector('input')).toBeTruthy()
  })

  it('renders with placeholder', () => {
    const { container } = render(<InputNumber placeholder='Nhập số' />)
    expect(container.querySelector('input[placeholder="Nhập số"]')).toBeTruthy()
  })

  it('shows error message when errorMessage is provided', () => {
    const { getByText } = render(<InputNumber errorMessage='Giá trị không hợp lệ' />)
    expect(getByText('Giá trị không hợp lệ')).toBeTruthy()
  })

  it('calls onChange and updates value when input is numeric', () => {
    const handleChange = vi.fn()
    const { container } = render(<InputNumber onChange={handleChange} />)
    const input = container.querySelector('input') as HTMLInputElement
    fireEvent.change(input, { target: { value: '123' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('does NOT call onChange when input is non-numeric', () => {
    const handleChange = vi.fn()
    const { container } = render(<InputNumber onChange={handleChange} />)
    const input = container.querySelector('input') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'abc' } })
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('allows empty string value', () => {
    const handleChange = vi.fn()
    const { container } = render(<InputNumber onChange={handleChange} value='5' />)
    const input = container.querySelector('input') as HTMLInputElement
    fireEvent.change(input, { target: { value: '' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('applies custom classNameInput', () => {
    const { container } = render(<InputNumber classNameInput='custom-input-class' />)
    const input = container.querySelector('input')
    expect(input?.className).toContain('custom-input-class')
  })

  it('applies custom classNameError', () => {
    const { getByText } = render(<InputNumber errorMessage='Error' classNameError='custom-error-class' />)
    const errorDiv = getByText('Error')
    expect(errorDiv.className).toContain('custom-error-class')
  })

  it('does not allow decimal or special characters', () => {
    const handleChange = vi.fn()
    const { container } = render(<InputNumber onChange={handleChange} />)
    const input = container.querySelector('input') as HTMLInputElement
    fireEvent.change(input, { target: { value: '1.5' } })
    expect(handleChange).not.toHaveBeenCalled()
  })
})
