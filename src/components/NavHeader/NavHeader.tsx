import authApi from '@/apis/auth.api'
import userApi from '@/apis/user.api'
import path from '@/constants/path'
import { queryKeys } from '@/constants/queryKeys'
import { AppContext } from '@/contexts/app.context'
import { getAvatarURL } from '@/utils/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import Popover from '../Popover'
import { useTranslation } from 'react-i18next'
import Language from '../../components/Language'
export default function NavHeader() {
  const queryClient = useQueryClient()
  const { setIsAuthenticated, isAuthenticated } = useContext(AppContext)

  const { t: tAuth } = useTranslation('auth')
  const { t: tUser } = useTranslation('user')

  const { data: profileData } = useQuery({
    queryKey: queryKeys.profile,
    queryFn: userApi.getProfile,
    enabled: isAuthenticated
  })

  const profile = profileData?.data.data

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setIsAuthenticated(false)
      queryClient.removeQueries({ queryKey: queryKeys.profile })
      queryClient.removeQueries({ queryKey: queryKeys.purchasesInCart() })
    }
  })

  return (
    <div className='mb-2 flex flex-wrap justify-between gap-2 text-xs md:mb-4 md:text-sm sm:justify-end sm:gap-4'>
      <Language className='hover:text-gray-300' />
      {isAuthenticated ? (
        <Popover
          renderPopover={
            <div>
              <Link to={path.profile} className='block px-4 py-2 text-gray-700 hover:bg-gray-100'>
                {tUser('myAccount')}
              </Link>
              <Link to={path.historyPurchase} className='block px-4 py-2 text-gray-700 hover:bg-gray-100'>
                {tUser('purchaseHistory')}
              </Link>
              <button
                className='block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100'
                onClick={() => logoutMutation.mutate()}
              >
                {tAuth('logout')}
              </button>
            </div>
          }
        >
          <div className='flex cursor-pointer items-center gap-1 py-1 hover:text-gray-300 md:ml-4'>
            <div className='h-4 w-4 flex-shrink-0 md:h-5 md:w-5'>
              <img
                src={getAvatarURL(profile?.avatar)}
                alt='avatar'
                className='h-full w-full rounded-full object-cover'
              />
            </div>
            <div className='truncate text-[11px] text-white md:text-[14px]'>{profile?.email}</div>
          </div>
        </Popover>
      ) : (
        <div className='flex items-center gap-1 md:gap-3'>
          <Link
            to={path.register}
            className='text-xs capitalize opacity-70 transition-opacity hover:text-white hover:opacity-100 md:text-sm'
          >
            {tAuth('register')}
          </Link>
          <div className='h-3 border-r border-r-white/40 md:h-4'></div>
          <Link
            to={path.login}
            className='text-xs capitalize opacity-70 transition-opacity hover:text-white hover:opacity-100 md:text-sm'
          >
            {tAuth('login')}
          </Link>
        </div>
      )}
    </div>
  )
}
