import { describe, it, expect } from 'vitest'
import { authSchema, registerSchema, loginSchema, filterSchema, commonSchema } from '../rules'

describe('authSchema', () => {
  it('accepts valid email and password', () => {
    const result = authSchema.omit({ confirm_password: true }).safeParse({
      email: 'test@example.com',
      password: 'password123'
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty email', () => {
    const result = authSchema.omit({ confirm_password: true }).safeParse({ email: '', password: 'password123' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email format', () => {
    const result = authSchema.omit({ confirm_password: true }).safeParse({ email: 'notanemail', password: 'pass123' })
    expect(result.success).toBe(false)
  })

  it('rejects email shorter than 5 chars', () => {
    const result = authSchema.omit({ confirm_password: true }).safeParse({ email: 'a@b.', password: 'pass123' })
    expect(result.success).toBe(false)
  })

  it('rejects password shorter than 6 chars', () => {
    const result = authSchema.omit({ confirm_password: true }).safeParse({ email: 'test@example.com', password: '123' })
    expect(result.success).toBe(false)
  })

  it('rejects empty password', () => {
    const result = authSchema.omit({ confirm_password: true }).safeParse({ email: 'test@example.com', password: '' })
    expect(result.success).toBe(false)
  })
})

describe('loginSchema', () => {
  it('accepts valid login data', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: 'securepass' })
    expect(result.success).toBe(true)
  })

  it('rejects missing email', () => {
    const result = loginSchema.safeParse({ password: 'securepass' })
    expect(result.success).toBe(false)
  })
})

describe('registerSchema', () => {
  it('accepts when passwords match', () => {
    const result = registerSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
      confirm_password: 'password123'
    })
    expect(result.success).toBe(true)
  })

  it('rejects when confirm_password does not match password', () => {
    const result = registerSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
      confirm_password: 'different'
    })
    expect(result.success).toBe(false)
    const issue = result.error?.issues.find((i) => i.path.includes('confirm_password'))
    expect(issue?.message).toBe('Mật khẩu không trùng khớp')
  })
})

describe('filterSchema', () => {
  it('accepts valid price range', () => {
    const result = filterSchema.safeParse({ price_min: '100', price_max: '500' })
    expect(result.success).toBe(true)
  })

  it('accepts only price_min filled', () => {
    const result = filterSchema.safeParse({ price_min: '100', price_max: '' })
    expect(result.success).toBe(true)
  })

  it('accepts only price_max filled', () => {
    const result = filterSchema.safeParse({ price_min: '', price_max: '500' })
    expect(result.success).toBe(true)
  })

  it('rejects when both are empty', () => {
    const result = filterSchema.safeParse({ price_min: '', price_max: '' })
    expect(result.success).toBe(false)
  })

  it('rejects when price_max < price_min', () => {
    const result = filterSchema.safeParse({ price_min: '500', price_max: '100' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Giá không phù hợp')
  })

  it('accepts when price_max equals price_min', () => {
    const result = filterSchema.safeParse({ price_min: '200', price_max: '200' })
    expect(result.success).toBe(true)
  })
})

describe('commonSchema', () => {
  it('accepts a non-empty name', () => {
    const result = commonSchema.safeParse({ name: 'Áo thun' })
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = commonSchema.safeParse({ name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects whitespace-only name', () => {
    const result = commonSchema.safeParse({ name: '   ' })
    expect(result.success).toBe(false)
  })
})
