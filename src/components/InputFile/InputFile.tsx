import { Fragment, useCallback, useRef } from 'react'
import { toast } from 'react-toastify'

interface Props {
  onChange?: (file: File) => void | Promise<void>
  onFileSelect?: (file: File) => void
}

export default function InputFile({ onChange, onFileSelect }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const fileFromLocal = e.target.files?.[0]
      if (!fileFromLocal) return

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(fileFromLocal.type)) {
        toast.error('Chỉ chấp nhận file JPG, JPEG, PNG')
        return
      }

      const maxSize = 1024 * 1024
      if (fileFromLocal.size > maxSize) {
        toast.error('Dung lượng file không được vượt quá 1MB')
        return
      }

      onFileSelect?.(fileFromLocal)
      await onChange?.(fileFromLocal)

      // Allow selecting the same file repeatedly.
      e.target.value = ''
    },
    [onChange, onFileSelect]
  )

  const handleUpload = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <Fragment>
      <input type='file' accept='.jpg,.jpeg,.png' className='hidden' ref={fileInputRef} onChange={onFileChange} />
      <button
        type='button'
        onClick={handleUpload}
        className='mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-4 w-4'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
        </svg>
        Chọn ảnh
      </button>
    </Fragment>
  )
}

