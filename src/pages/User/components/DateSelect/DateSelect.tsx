import range from 'lodash/range'
import { useEffect, useState } from 'react'

interface Props {
  onChange?: (value: Date) => void
  value?: Date
  errorMessage?: string
}

export default function DateSelect({ onChange, value, errorMessage }: Props) {
  const [date, setDate] = useState({
    day: value ? value.getDate() : 1,
    month: value ? value.getMonth() + 1 : 0,
    year: value ? value.getFullYear() : 1990
  })

  useEffect(() => {
    if (value) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDate({
        day: value.getDate(),
        month: value.getMonth() + 1,
        year: value.getFullYear()
      })
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value: valueFromSelect } = e.target
    const newDate = {
      day: value ? value.getDate() : date.day,
      month: value ? value.getMonth() + 1 : date.month,
      year: value ? value.getFullYear() : date.year,
      [name]: Number(valueFromSelect)
    }
    setDate(newDate)
    if (onChange) onChange(new Date(newDate.year, newDate.month - 1, newDate.day))
  }

  return (
    <div className='flex flex-wrap mt-2 px-4'>
      <div className='w-[80%] '>
        <div className='flex justify-between'>
          <select
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-orange cursor-pointer'
            name='day'
            onChange={handleChange}
            value={value ? value.getDate() : date.day}
          >
            <option disabled>Ngày</option>
            {range(1, 32).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <select
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-orange cursor-pointer'
            name='month'
            onChange={handleChange}
            value={value ? value.getMonth() + 1 : date.month}
          >
            <option disabled>Tháng</option>
            {range(1, 13).map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <select
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-orange cursor-pointer'
            name='year'
            onChange={handleChange}
            value={value ? value.getFullYear() : date.year}
          >
            <option disabled>Năm</option>
            {range(1900, new Date().getFullYear() + 1).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errorMessage}</div>
      </div>
    </div>
  )
}
