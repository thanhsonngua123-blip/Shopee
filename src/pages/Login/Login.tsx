import authApi from '@/apis/auth.api'
import Button from '@/components/Button'
import Input from '@/components/Input'
import path from '@/constants/path'
import { AppContext } from '@/contexts/app.context'
import { ErrorResponse } from '@/types/utils.type'
import { loginSchema, LoginSchema } from '@/utils/rules'
import { isAxiosUnprocessableEntityError } from '@/utils/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { queryKeys } from '@/constants/queryKeys'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/Seo/Seo'
export default function Login() {
  const queryClient = useQueryClient()
  const { setIsAuthenticated } = useContext(AppContext)
  const navigate = useNavigate()
  const { t } = useTranslation('auth')
  const {
    register,
    handleSubmit,
    trigger,
    setError,
    formState: { errors }
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  const loginAccountMutation = useMutation({
    mutationFn: (body: LoginSchema) => authApi.loginAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginAccountMutation.mutate(data, {
      onSuccess: async () => {
        setIsAuthenticated(true)
        await queryClient.invalidateQueries({ queryKey: queryKeys.profile })
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<LoginSchema>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof LoginSchema, {
                message: formError[key as keyof typeof formError],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  return (
    <div className='bg-orange'>
      <Seo title={t('login')} description={t('loginDescription')} pathname='/login' />
      <div className='mx-auto max-w-7xl px-4'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit}>
              <div className='text-2xl'>{t('login')}</div>

              <Input
                type='email'
                name='email'
                register={register}
                placeholder={t('email')}
                className='mt-8 w-full rounded-sm  p-3 outline-none focus:border-gray-500 focus:shadow-sm'
                rules={{
                  onChange: () => {
                    trigger('email')
                  }
                }}
                errorMessage={errors.email?.message}
              />

              <Input
                type='password'
                name='password'
                register={register}
                className='mt-2 w-full rounded-sm  p-3 outline-none focus:border-gray-500 focus:shadow-sm'
                placeholder={t('password')}
                errorMessage={errors.password?.message}
              />

              <div className='mt-3'>
                <Button
                  className='flex w-full items-center justify-center bg-red-500 px-2 py-4 text-center text-sm uppercase text-white hover:bg-red-600'
                  isLoading={loginAccountMutation.isPending}
                  disabled={loginAccountMutation.isPending}
                >
                  {t('login')}
                </Button>
              </div>

              <div className='mt-8 flex item-center justify-center gap-1'>
                <span className='text-slate-400'>{t('newToShopee')}</span>
                <Link to={path.register} className='text-red-400'>
                  {t('register')}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
