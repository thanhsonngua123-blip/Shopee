import userApi from '@/apis/user.api'
import Input from '@/components/Input'
import { queryKeys } from '@/constants/queryKeys'
import { ErrorResponse } from '@/types/utils.type'
import { passwordSchema, UserSchema } from '@/utils/rules'
import { isAxiosUnprocessableEntityError } from '@/utils/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useForm } from 'react-hook-form'

import { toast } from 'react-toastify'

type ProfileData = Pick<UserSchema, 'password' | 'new_password' | 'confirm_password'>

export default function ChangePassword() {
  const { register, handleSubmit, clearErrors, setError, formState, reset } = useForm<ProfileData>({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    },
    resolver: zodResolver(passwordSchema),
    mode: 'onSubmit'
  })

  const { errors } = formState

  const queryClient = useQueryClient()
  const updateProfileMutation = useMutation({
    mutationFn: (body: Omit<ProfileData, 'confirm_password'>) =>
      userApi.updateProfile({
        password: body.password,
        new_password: body.new_password
      })
  })
  const onSubmit = handleSubmit(async (data: ProfileData) => {
    try {
      await updateProfileMutation.mutateAsync({
        password: data.password,
        new_password: data.new_password
      })

      await queryClient.invalidateQueries({ queryKey: queryKeys.profile })
      toast.success('Đổi mật khẩu thành công', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false
      })
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<Partial<ProfileData>>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.entries(formError).forEach(([key, message]) => {
            setError(key as keyof ProfileData, {
              type: 'server',
              message: message as string
            })
          })
        }
      } else {
        toast.error('Đổi mật khẩu thất bại', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false
        })
      }
    }
    reset()
  })

  return (
    <div className='rounded-lg bg-white shadow-sm'>
      <div className='border-b border-gray-100 px-4 py-6 sm:px-6 lg:px-8'>
        <h1 className='text-2xl font-semibold text-gray-900'>Đổi mật khẩu</h1>
        <p className='mt-1 text-sm text-gray-500'>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>

      <form className='px-4 py-6 sm:px-6 lg:px-8' onSubmit={onSubmit}>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            <div className='grid grid-cols-1 gap-2 sm:grid-cols-3 sm:items-start'>
              <label className='pt-3 text-sm font-medium text-gray-700'>Mật khẩu cũ</label>
              <div className='sm:col-span-2'>
                <Input
                  className='w-full rounded-lg  px-4 py-1 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                  register={register}
                  name='password'
                  type='password'
                  placeholder='Nhập mật khẩu cũ'
                  errorMessage={errors.password?.message}
                />
              </div>
            </div>

            <div className='grid grid-cols-1 gap-2 sm:grid-cols-3 sm:items-start'>
              <label className='pt-3 text-sm font-medium text-gray-700'>Mật khẩu mới</label>
              <div className='sm:col-span-2'>
                <Input
                  className='w-full rounded-lg  px-4 py-1 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                  register={register}
                  name='new_password'
                  type='password'
                  placeholder='Nhập mật khẩu mới'
                  errorMessage={errors.new_password?.message}
                />
              </div>
            </div>

            <div className='grid grid-cols-1 gap-2 sm:grid-cols-3 sm:items-start'>
              <label className='pt-3 text-sm font-medium text-gray-700'>Xác nhận mật khẩu mới</label>
              <div className='sm:col-span-2'>
                <Input
                  className='w-full rounded-lg  px-4 py-1 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                  register={register}
                  name='confirm_password'
                  type='password'
                  placeholder='Xác nhận mật khẩu mới'
                  rules={{
                    onChange: () => {
                      clearErrors('confirm_password')
                    }
                  }}
                  errorMessage={errors.confirm_password?.message}
                />
              </div>
            </div>

            <div className='pt-2'>
              <button
                type='submit'
                className='w-full rounded-lg bg-orange px-8 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-orange active:bg-orange sm:w-auto'
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
