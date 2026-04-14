import authApi from '@/apis/auth.api'
import Button from '@/components/Button'
import Input from '@/components/Input'
import path from '@/constants/path'
import { queryKeys } from '@/constants/queryKeys'
import { AppContext } from '@/contexts/app.context'
import { ErrorResponse } from '@/types/utils.type'
import { registerSchema, RegisterSchema } from '@/utils/rules'
import { isAxiosUnprocessableEntityError } from '@/utils/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import omit from 'lodash/omit'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/Seo/Seo'

export default function Register() {
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
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<RegisterSchema, 'confirm_password'>) => authApi.registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: async () => {
        setIsAuthenticated(true)
        await queryClient.invalidateQueries({ queryKey: queryKeys.profile })
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<RegisterSchema, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<RegisterSchema, 'confirm_password'>, {
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
    <div className=' bg-orange'>
      <Seo title={t('register')} description={t('registerDescription')} pathname='/register' />
      <div className='mx-auto max-w-7xl px-4'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>{t('register')}</div>
              <Input
                name='email'
                register={register}
                type='email'
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
                name='password'
                register={register}
                type='password'
                placeholder={t('password')}
                className='mt-2 w-full rounded-sm  p-3 outline-none focus:border-gray-500 focus:shadow-sm'
                errorMessage={errors.password?.message}
                autoComplete='on'
              />
              <Input
                name='confirm_password'
                register={register}
                type='password'
                placeholder={t('confirmPassword')}
                className='mt-2 w-full rounded-sm  p-3 outline-none focus:border-gray-500 focus:shadow-sm'
                errorMessage={errors.confirm_password?.message}
                autoComplete='on'
              />

              <div className='mt-2'>
                <Button
                  className='flex w-full items-center justify-center bg-red-500 px-2 py-4 text-center text-sm uppercase text-white hover:bg-red-600'
                  isLoading={registerAccountMutation.isPending}
                  disabled={registerAccountMutation.isPending}
                >
                  {t('register')}
                </Button>
              </div>

              <div className='mt-8 flex items-center justify-center gap-1'>
                <span className='text-slate-400'>{t('alreadyHaveAccount')}</span>
                <Link to={path.login} className='text-red-400'>
                  {t('login')}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
