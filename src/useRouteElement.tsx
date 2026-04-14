/* eslint-disable react-refresh/only-export-components */
import { AppContext } from './contexts/app.context'
import path from './constants/path'
import MainLayout from './layouts/MainLayout'
import RegisterLayout from './layouts/RegisterLayout'
import { lazy, Suspense, useContext, type ReactNode } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import NotFound from './pages/User/pages/NotFound'

const ProductList = lazy(() => import('./pages/ProductList'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const CartLayout = lazy(() => import('./layouts/CartLayout'))
const UserLayout = lazy(() => import('./pages/User/layouts/UserLayout'))
const ChangePassword = lazy(() => import('./pages/User/pages/ChangePassword'))
const HistoryPurchase = lazy(() => import('./pages/User/pages/HistoryPurchase'))
const Profile = lazy(() => import('./pages/User/pages/Profile'))

function RouteFallback() {
  return (
    <div className='container py-10 text-sm text-gray-500' role='status'>
      Đang tải...
    </div>
  )
}

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>
}

export default function useRouteElement() {
  return useRoutes([
    {
      path: '/',
      element: <MainLayout>{withSuspense(<ProductList />)}</MainLayout>
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: path.cart,
          element: withSuspense(
            <CartLayout>
              <Cart />
            </CartLayout>
          )
        },
        {
          path: path.user,
          element: withSuspense(
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,
              element: withSuspense(<Profile />)
            },
            {
              path: path.changePassword,
              element: withSuspense(<ChangePassword />)
            },
            {
              path: path.historyPurchase,
              element: withSuspense(<HistoryPurchase />)
            }
          ]
        }
      ]
    },
    {
      path: path.productDetail,
      index: true,
      element: <MainLayout>{withSuspense(<ProductDetail />)}</MainLayout>
    },
    {
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: <RegisterLayout>{withSuspense(<Login />)}</RegisterLayout>
        },
        {
          path: path.register,
          element: <RegisterLayout>{withSuspense(<Register />)}</RegisterLayout>
        }
      ]
    },
    {
      path: '*',
      element: <NotFound />
    }
  ])
}
