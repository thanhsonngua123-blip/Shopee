import { ToastContainer } from 'react-toastify'
import useRouteElement from './useRouteElement'
import { useContext, useEffect } from 'react'
import { LocalStorageEventTarget } from './utils/auth'
import { AppContext, AppProvider } from './contexts/app.context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ErrorBoundary from './components/ErrorBoundary'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0
    }
  }
})

export default function App() {
  const routeElement = useRouteElement()
  const { reset } = useContext(AppContext)
  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clear', reset)
    return () => {
      LocalStorageEventTarget.removeEventListener('clear', reset)
    }
  }, [reset])
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <ErrorBoundary>
          {routeElement}
          <ToastContainer />
        </ErrorBoundary>
      </AppProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
