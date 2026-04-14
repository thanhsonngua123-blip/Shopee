import { z } from 'zod'

export const authSchema = z.object({
  email: z
    .string()
    .regex(/^\S+@\S+\.\S+$/, 'Email không hợp lệ')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự')
    .nonempty('Email là bắt buộc'),

  password: z
    .string()
    .nonempty('Mật khẩu là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự'),

  confirm_password: z
    .string()
    .nonempty('Nhập lại mật khẩu là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự')
})

export const registerSchema = authSchema.superRefine((data, ctx) => {
  if (data.confirm_password !== data.password) {
    ctx.addIssue({
      code: 'custom',
      path: ['confirm_password'],
      message: 'Mật khẩu không trùng khớp'
    })
  }
})

export const filterSchema = z
  .object({
    price_min: z.string(),
    price_max: z.string()
  })
  .refine(
    (data) => {
      const { price_min, price_max } = data
      if (price_min !== '' && price_max !== '') {
        return Number(price_max) >= Number(price_min)
      }
      return price_max !== '' || price_min !== ''
    },
    {
      message: 'Giá không phù hợp',
      path: ['price_min']
    }
  )

export const loginSchema = authSchema.omit({
  confirm_password: true
})

export const commonSchema = z.object({
  name: z.string().trim().nonempty('Tên sản phẩm là bắt buộc')
})

export const userSchema = z.object({
  name: z.string().trim().max(160, 'Độ dài tối đa 160 ký tự'),
  phone: z.string().trim().max(20, 'Độ dài tối đa 20 ký tự'),
  address: z.string().trim().max(160, 'Độ dài tối đa 160 ký tự'),
  date_of_birth: z.date().max(new Date(), 'Hãy chọn ngày sinh hợp lệ'),
  password: authSchema.shape.password,
  new_password: authSchema.shape.password,
  confirm_password: authSchema.shape.confirm_password,
  avatar: z.string().trim().max(1000, 'Độ dài tối đa 1000 ký tự')
})

export const profileSchema = userSchema.pick({
  name: true,
  date_of_birth: true,
  address: true,
  phone: true,
  avatar: true
})

export const passwordSchema = userSchema
  .pick({
    password: true,
    new_password: true,
    confirm_password: true
  })
  .superRefine((data, ctx) => {
    if (data.new_password !== data.confirm_password) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirm_password'],
        message: 'Mật khẩu không trùng khớp'
      })
    }
  })

export type CommonSchema = z.infer<typeof commonSchema>
export type UserSchema = z.infer<typeof userSchema>
export type RegisterSchema = z.infer<typeof registerSchema>
export type LoginSchema = z.infer<typeof loginSchema>
export type FilterProduct = z.infer<typeof filterSchema>
