import userApi from '@/apis/user.api'
import Input from '@/components/Input'
import InputFile from '@/components/InputFile'
import InputNumber from '@/components/InputNumber'
import { queryKeys } from '@/constants/queryKeys'
import { profileSchema, UserSchema } from '@/utils/rules'
import { getAvatarURL } from '@/utils/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import DateSelect from '../../components/DateSelect'

type ProfileData = Pick<UserSchema, 'name' | 'date_of_birth' | 'address' | 'phone' | 'avatar'>

function Info() {
  const { t } = useTranslation('user')
  const { register, formState, control } = useFormContext<ProfileData>()
  const { errors } = formState

  return (
    <Fragment>
      <div className='grid grid-cols-1 gap-2 sm:grid-cols-3 sm:items-start'>
        <label className='pt-3 text-sm font-medium text-gray-700'>{t('nameLabel')}</label>
        <div className='sm:col-span-2'>
          <Input
            className='w-full rounded-lg  px-4 py-1 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
            register={register}
            name='name'
            placeholder={t('enterName')}
            errorMessage={errors.name?.message}
          />
        </div>
      </div>

      <div className='grid grid-cols-1 gap-2 sm:grid-cols-3 sm:items-start'>
        <label className='pt-3 text-sm font-medium text-gray-700'>{t('phoneLabel')}</label>
        <div className='sm:col-span-2'>
          <Controller
            control={control}
            name='phone'
            render={({ field }) => (
              <InputNumber
                className='w-full rounded-lg  px-4 py-1 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                placeholder={t('enterPhone')}
                errorMessage={errors.phone?.message}
                {...field}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
    </Fragment>
  )
}

export default function Profile() {
  const { t } = useTranslation('user')
  const queryClient = useQueryClient()
  const [file, setFile] = useState<File | null>(null)
  const previewImage = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file])

  const methods = useForm<ProfileData>({
    defaultValues: {
      name: '',
      date_of_birth: new Date(1990, 0, 1),
      address: '',
      phone: '',
      avatar: ''
    },
    resolver: zodResolver(profileSchema)
  })

  const { register, handleSubmit, setValue, control, formState, reset } = methods
  const { errors } = formState

  const { data: profileData, isLoading } = useQuery({
    queryKey: queryKeys.profile,
    queryFn: userApi.getProfile
  })

  const profile = profileData?.data.data

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileData) =>
      userApi.updateProfile({
        ...data,
        date_of_birth: data.date_of_birth instanceof Date ? data.date_of_birth.toISOString() : data.date_of_birth
      })
  })

  const uploadAvatarMutation = useMutation({
    mutationFn: (formData: FormData) => userApi.uploadAvatar(formData)
  })

  useEffect(() => {
    if (!profile) return
    reset({
      name: profile.name || '',
      phone: profile.phone || '',
      address: profile.address || '',
      date_of_birth: profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1),
      avatar: profile.avatar || ''
    })
  }, [profile, reset])

  useEffect(
    () => () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage)
      }
    },
    [previewImage]
  )

  const resolvedAvatar = useMemo(() => previewImage || getAvatarURL(profile?.avatar), [previewImage, profile?.avatar])

  const uploadAvatar = async (selectedFile: File) => {
    const formData = new FormData()
    formData.append('image', selectedFile)
    try {
      const uploadRes = await uploadAvatarMutation.mutateAsync(formData)
      if (uploadRes.data.data) {
        setValue('avatar', uploadRes.data.data)
      }
    } catch {
      toast.error(t('uploadAvatarFailed'))
    }
  }

  const onSubmit = handleSubmit(async (data: ProfileData) => {
    try {
      await updateProfileMutation.mutateAsync(data)
      await queryClient.invalidateQueries({ queryKey: queryKeys.profile })
      toast.success(t('profileUpdateSuccess'), {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false
      })
    } catch {
      toast.error(t('profileUpdateFailed'), {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false
      })
    }
  })

  if (isLoading) {
    return (
      <div className='rounded-sm bg-white px-7 pb-20 shadow'>
        <div className='border-b border-gray-200 py-6'>
          <h1 className='text-lg font-medium capitalize text-gray-900'>{t('profileHeader')}</h1>
          <div className='mt-1 text-sm text-gray-700'>{t('loadingOrders')}</div>
        </div>
      </div>
    )
  }

  return (
    <div className='rounded-lg bg-white shadow-sm'>
      <div className='border-b border-gray-100 px-4 py-6 sm:px-6 lg:px-8'>
        <h1 className='text-2xl font-semibold text-gray-900'>{t('profileHeader')}</h1>
        <p className='mt-1 text-sm text-gray-500'>{t('profileSubtitle')}</p>
      </div>

      <FormProvider {...methods}>
        <form className='px-4 py-6 sm:px-6 lg:px-8' onSubmit={onSubmit}>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
            <div className='space-y-6 lg:col-span-2'>
              <div className='grid grid-cols-1 gap-2 sm:grid-cols-3 sm:items-center'>
                <label className='text-sm font-medium text-gray-700'>{t('email')}</label>
                <div className='rounded-lg bg-gray-50 px-5 py-1 text-sm text-gray-700 sm:col-span-2'>
                  {profile?.email}
                </div>
              </div>

              <Info />

              <div className='grid grid-cols-1 gap-2 sm:grid-cols-3 sm:items-start'>
                <label className='pt-3 text-sm font-medium text-gray-700'>{t('addressLabel')}</label>
                <div className='sm:col-span-2'>
                  <Input
                    className='w-full rounded-lg  px-4 py-1 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                    register={register}
                    name='address'
                    placeholder={t('enterAddressDetail')}
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 gap-2 sm:grid-cols-3 sm:items-start'>
                <label className='pt-3 text-sm font-medium text-gray-700'>{t('dateOfBirthLabel')}</label>
                <div className='sm:col-span-2'>
                  <Controller
                    control={control}
                    name='date_of_birth'
                    render={({ field }) => (
                      <DateSelect
                        errorMessage={errors.date_of_birth?.message}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>

              <div className='pt-2'>
                <button
                  type='submit'
                  className='w-full rounded-lg bg-orange px-8 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-orange active:bg-orange sm:w-auto'
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? t('saving') : t('saveChanges')}
                </button>
              </div>
            </div>

            <div className='flex flex-col items-center lg:border-l lg:border-l-gray-100 lg:pl-8'>
              <div className='h-32 w-32 overflow-hidden rounded-full  shadow-lg ring-1 ring-gray-200'>
                <img src={resolvedAvatar} alt='avatar' className='h-full w-full object-cover' />
              </div>
              <InputFile onChange={uploadAvatar} onFileSelect={setFile} />
              <div className='mt-6 space-y-1 text-center text-xs text-gray-400'>
                <div>{t('avatarMaxSize', { size: '1MB' })}</div>
                <div>{t('avatarFormats')}</div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
