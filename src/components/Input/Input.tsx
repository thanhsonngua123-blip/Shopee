import { Eye, EyeOff } from 'lucide-react'
import { InputHTMLAttributes, useState } from 'react'
import type { FieldValues, Path, RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props<TFieldValues extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>
  name: Path<TFieldValues>
  register?: UseFormRegister<TFieldValues>
  classNameInput?: string
  classNameError?: string
}

export default function Input<TFieldValues extends FieldValues = FieldValues>({
  type,
  errorMessage,
  name,
  register,
  className,
  rules,
  classNameInput = 'p-3 w-full border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
  classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
  ...rest
}: Props<TFieldValues>) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const registerResult = register && name ? register(name, rules) : null

  return (
    <div className={className}>
      <div className='relative'>
        <input
          type={isPassword && !show ? 'password' : type || 'text'}
          className={classNameInput}
          {...registerResult}
          {...rest}
        />
        {isPassword && (
          <button
            type='button'
            className='absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500'
            onClick={() => setShow((prev) => !prev)}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}
