import { describe, it, expect, afterEach } from 'vitest'
import { render, within, cleanup, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '../../i18n/i18n'
import Register from './Register'
import { AppProvider } from '@/contexts/app.context'

afterEach(cleanup)

function renderRegister() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/register']}>
        <AppProvider>
          <Register />
        </AppProvider>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('Register page', () => {
  it('renders register form', () => {
    const { container } = renderRegister()
    expect(within(container).getByRole('button', { name: /đăng ký/i })).toBeTruthy()
  })

  it('renders email, password, confirm_password inputs', () => {
    const { container } = renderRegister()
    expect(container.querySelector('input[type="email"]')).toBeTruthy()
    const passwordInputs = container.querySelectorAll('input[type="password"]')
    expect(passwordInputs.length).toBe(2)
  })

  // Empty email fails regex first → 'Email không hợp lệ'
  it('shows validation error for empty email on submit', async () => {
    const user = userEvent.setup()
    const { container } = renderRegister()
    await user.click(within(container).getByRole('button', { name: /đăng ký/i }))
    await waitFor(() => {
      expect(within(container).getByText(/email không hợp lệ/i)).toBeTruthy()
    })
  })

  it('shows validation error for empty password on submit', async () => {
    const user = userEvent.setup()
    const { container } = renderRegister()
    await user.type(container.querySelector('input[type="email"]') as HTMLElement, 'test@example.com')
    await user.click(within(container).getByRole('button', { name: /đăng ký/i }))
    await waitFor(() => {
      expect(within(container).getByText('Mật khẩu là bắt buộc')).toBeTruthy()
    })
  })

  it('shows error when confirm_password does not match', async () => {
    const user = userEvent.setup()
    const { container } = renderRegister()
    const passwordInputs = container.querySelectorAll('input[type="password"]')
    await user.type(container.querySelector('input[type="email"]') as HTMLElement, 'test@example.com')
    await user.type(passwordInputs[0] as HTMLElement, 'password123')
    await user.type(passwordInputs[1] as HTMLElement, 'different123')
    await user.click(within(container).getByRole('button', { name: /đăng ký/i }))
    await waitFor(() => {
      expect(within(container).getByText(/mật khẩu không trùng khớp/i)).toBeTruthy()
    })
  })

  it('has a link to login page', () => {
    const { container } = renderRegister()
    const link = within(container).getByRole('link', { name: /đăng nhập/i })
    expect(link).toBeTruthy()
  })
})
