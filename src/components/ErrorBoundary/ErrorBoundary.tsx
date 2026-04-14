import { Component, ErrorInfo, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  resetKey?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundaryInner extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state = {
    hasError: false,
    error: null
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error)
    console.error('Component stack:', info.componentStack)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.props.resetKey && prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null })
    }
  }

  render() {
    const { hasError } = this.state
    const { fallback, children } = this.props

    if (hasError) {
      return (
        <div className='min-h-screen flex items-center justify-center bg-white'>
          {fallback ?? (
            <div className='grid min-h-screen w-full place-items-center bg-gray-900 px-6 py-12 sm:py-24 lg:px-8'>
              <div className='text-center'>
                <p className='font-semibold text-orange text-[5rem]'>500</p>
                <h1 className='mt-4 text-4xl font-semibold tracking-tight text-balance text-white sm:text-6xl'>
                  Lỗi Server
                </h1>
                <p className='mt-6 text-base font-medium text-pretty text-gray-400 sm:text-lg line-clamp-2 w-2/3 mx-auto'>
                  Xin lỗi, đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau hoặc liên hệ với bộ phận hỗ trợ nếu vấn
                  đề vẫn tiếp diễn.
                </p>
                <div className='mt-10 flex items-center justify-center gap-x-6'>
                  <Link
                    to='/'
                    className='rounded-md bg-orange px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#d13d1f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange'
                  >
                    Quay lại trang chủ
                  </Link>
                  <Link to='/' className='text-sm font-semibold text-white'>
                    Liên hệ hỗ trợ <span aria-hidden='true'>→</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    }

    return children
  }
}

export default function ErrorBoundary({ children, fallback }: Omit<ErrorBoundaryProps, 'resetKey'>) {
  const location = useLocation()
  const { t } = useTranslation('error')

  const defaultFallback = (
    <div className='grid min-h-screen w-full place-items-center bg-gray-900 px-6 py-12 sm:py-24 lg:px-8'>
      <div className='text-center'>
        <p className='font-semibold text-orange text-[5rem]'>500</p>
        <h1 className='mt-4 text-4xl font-semibold tracking-tight text-balance text-white sm:text-6xl'>
          {t('serverErrorTitle')}
        </h1>
        <p className='mt-6 text-base font-medium text-pretty text-gray-400 sm:text-lg line-clamp-2 w-2/3 mx-auto'>
          {t('serverErrorMessage')}
        </p>
        <div className='mt-10 flex items-center justify-center gap-x-6'>
          <Link
            to='/'
            className='rounded-md bg-orange px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#d13d1f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange'
          >
            {t('goBackHome')}
          </Link>
          <Link to='/' className='text-sm font-semibold text-white'>
            {t('contactSupport')}
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <ErrorBoundaryInner
      fallback={fallback ?? defaultFallback}
      resetKey={location.key || `${location.pathname}${location.search}`}
    >
      {children}
    </ErrorBoundaryInner>
  )
}
