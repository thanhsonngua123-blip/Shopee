import { forwardRef, InputHTMLAttributes, useState } from 'react'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}
const InputV2 = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  {
    errorMessage,
    className,
    classNameInput = 'p-3 w-full border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
    classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
    onChange,
    value = '',
    ...res
  },
  ref
) {
  const [localValue, setLocalValue] = useState<string>(value as string)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (/^\d+$/.test(value) || value === '') {
      onChange?.(e)
      setLocalValue(value)
    }
  }
  return (
    <div>
      <div className={className}>
        <input ref={ref} className={classNameInput} onChange={handleChange} value={value || localValue} {...res} />
      </div>
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})

export default InputV2
