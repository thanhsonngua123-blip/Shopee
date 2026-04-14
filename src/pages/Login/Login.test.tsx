import { describe, it, expect, afterEach } from 'vitest'
import { render, within, cleanup, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '../../i18n/i18n'
import Login from './Login'
import { AppProvider } from '@/contexts/app.context'

afterEach(cleanup)

function renderLogin() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/login']}>
        <AppProvider>
          <Login />
        </AppProvider>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('Login page', () => {
  it('renders login form', () => {
    const { container } = renderLogin()
    expect(within(container).getByRole('button', { name: /đăng nhập/i })).toBeTruthy()
  })

  it('shows email and password inputs', () => {
    const { container } = renderLogin()
    expect(container.querySelector('input[type="email"]')).toBeTruthy()
    expect(container.querySelector('input[type="password"]')).toBeTruthy()
  })

  // Empty email fails regex first → 'Email không hợp lệ'
  it('shows validation error for empty email', async () => {
    const user = userEvent.setup()
    const { container } = renderLogin()
    await user.click(within(container).getByRole('button', { name: /đăng nhập/i }))
    await waitFor(() => {
      expect(within(container).getByText(/email không hợp lệ/i)).toBeTruthy()
    })
  })

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup()
    const { container } = renderLogin()
    await user.type(container.querySelector('input[type="email"]') as HTMLElement, 'invalid')
    await user.click(within(container).getByRole('button', { name: /đăng nhập/i }))
    await waitFor(() => {
      expect(within(container).getByText(/email không hợp lệ/i)).toBeTruthy()
    })
  })

  it('shows validation error for empty password', async () => {
    const user = userEvent.setup()
    const { container } = renderLogin()
    await user.type(container.querySelector('input[type="email"]') as HTMLElement, 'test@example.com')
    await user.click(within(container).getByRole('button', { name: /đăng nhập/i }))
    await waitFor(() => {
      expect(within(container).getByText(/mật khẩu là bắt buộc/i)).toBeTruthy()
    })
  })

  it('has a link to register page', () => {
    const { container } = renderLogin()
    const link = within(container).getByRole('link', { name: /đăng ký/i })
    expect(link).toBeTruthy()
  })
})
