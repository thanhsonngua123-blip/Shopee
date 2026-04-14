import { commonSchema } from '@/utils/rules'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import useQueryConfig from './useQueryConfig'
import omit from 'lodash/omit'
import { createSearchParams, useNavigate } from 'react-router-dom'
import path from '@/constants/path'

export default function useSearchProducts() {
  const queryConfig = useQueryConfig()
  const navigate = useNavigate()
  const { handleSubmit, register } = useForm({
    defaultValues: {
      name: ''
    },
    resolver: zodResolver(commonSchema)
  })
  const onSubmitSearch = handleSubmit((data) => {
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            name: data.name
          },
          ['order', 'sort_by']
        )
      : {
          ...queryConfig,
          name: data.name
        }
    navigate({
      pathname: path.home,
      search: createSearchParams(config).toString()
    })
  })
  return { onSubmitSearch, register }
}
