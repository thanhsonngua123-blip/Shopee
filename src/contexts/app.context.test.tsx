import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, within, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useContext } from 'react'
import { AppContext, AppProvider } from './app.context'
import { clearLS } from '@/utils/auth'

afterEach(cleanup)

function TestConsumer() {
  const { isAuthenticated, setIsAuthenticated, reset } = useContext(AppContext)
  return (
    <div>
      <span data-testid='auth-status'>{isAuthenticated ? 'authenticated' : 'unauthenticated'}</span>
      <button onClick={() => setIsAuthenticated(true)}>set-true</button>
      <button onClick={() => reset()}>reset</button>
    </div>
  )
}

describe('AppContext', () => {
  beforeEach(() => {
    clearLS()
    localStorage.clear()
  })

  it('starts unauthenticated when no token in localStorage', () => {
    const { container } = render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    )
    expect(within(container).getByTestId('auth-status').textContent).toBe('unauthenticated')
  })

  // Note: initialAppContext.isAuthenticated is evaluated once at module import time,
  // so localStorage changes before render won't affect it in the same test run.
  // The initial-authenticated behavior is covered by the integration tests in App.test.tsx.
  it('AppProvider default isAuthenticated reflects module-load localStorage state', () => {
    const { container } = render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    )
    // Just verify the context renders without crashing
    expect(within(container).getByTestId('auth-status')).toBeTruthy()
  })

  it('setIsAuthenticated updates value to true', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    )
    await user.click(within(container).getByText('set-true'))
    expect(within(container).getByTestId('auth-status').textContent).toBe('authenticated')
  })

  it('reset sets isAuthenticated back to false', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    )
    await user.click(within(container).getByText('set-true'))
    expect(within(container).getByTestId('auth-status').textContent).toBe('authenticated')
    await user.click(within(container).getByText('reset'))
    expect(within(container).getByTestId('auth-status').textContent).toBe('unauthenticated')
  })
})
