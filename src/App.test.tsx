import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import './i18n/i18n'
import App from './App'

describe('App', () => {
  it('renders the home route with the main header search', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )

    const searchInput = await screen.findByPlaceholderText('Tìm kiếm sản phẩm...')

    expect(searchInput).toBeTruthy()
  })

  it('navigates from register to login with React Router', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>
    )

    const confirmPasswordInput = await screen.findByPlaceholderText('Xác nhận mật khẩu')
    expect(confirmPasswordInput).toBeTruthy()

    const registerForm = confirmPasswordInput.closest('form')
    expect(registerForm).toBeTruthy()

    await user.click(within(registerForm as HTMLFormElement).getByRole('link', { name: 'Đăng nhập' }))

    const loginButton = await screen.findByRole('button', { name: 'Đăng nhập' })
    expect(loginButton).toBeTruthy()
    expect(screen.queryByPlaceholderText('Xác nhận mật khẩu')).toBeNull()
  })
})
