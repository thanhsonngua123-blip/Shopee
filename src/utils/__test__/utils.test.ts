/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest'
import {
  isAxiosError,
  isAxiosUnprocessableEntityError,
  formatCurrency,
  formatNumberToSocialStyle,
  rateSale,
  generateNameId,
  getIdFromNameId,
  getAvatarURL
} from '../utils'
import { AxiosError } from 'axios'

describe('utils', () => {
  describe('isAxiosError', () => {
    it('trả về false cho Error thường', () => {
      expect(isAxiosError(new Error())).toBe(false)
    })

    it('trả về true cho AxiosError', () => {
      const error = new AxiosError('Axios error')
      expect(isAxiosError(error)).toBe(true)
    })
  })

  describe('isAxiosUnprocessableEntityError', () => {
    it('trả về false khi không phải AxiosError', () => {
      expect(isAxiosUnprocessableEntityError(new Error())).toBe(false)
    })

    it('trả về false khi AxiosError không có response 422', () => {
      const error = new AxiosError('Axios error')
      expect(isAxiosUnprocessableEntityError(error)).toBe(false)
    })

    it('trả về true khi AxiosError có status 422', () => {
      const error = new AxiosError('Unprocessable Entity', undefined, undefined, undefined, {
        status: 422,
        statusText: 'Unprocessable Entity',
        headers: {},
        config: {},
        data: {}
      } as any)
      expect(isAxiosUnprocessableEntityError(error)).toBe(true)
    })
  })

  describe('formatCurrency', () => {
    it('định dạng số theo chuẩn de-DE', () => {
      expect(formatCurrency(1234567)).toBe('1.234.567')
    })
  })

  describe('formatNumberToSocialStyle', () => {
    it('định dạng số lớn thành dạng compact và thay dấu chấm bằng dấu phẩy', () => {
      expect(formatNumberToSocialStyle(1500)).toBe('1,5K')
    })

    it('giữ nguyên số lớn khi không cần làm tròn thập phân', () => {
      expect(formatNumberToSocialStyle(1000000)).toBe('1M')
    })
  })

  describe('rateSale', () => {
    it('tính phần trăm giảm giá đúng', () => {
      expect(rateSale(500, 1000)).toBe(50)
    })
  })

  describe('generateNameId và getIdFromNameId', () => {
    it('tạo nameId và lấy id đúng', () => {
      const nameId = generateNameId({ name: 'Hello World!', id: '123' })
      expect(nameId).toBe('Hello-World-i.123')
      expect(getIdFromNameId(nameId)).toBe('123')
    })
  })

  describe('getAvatarURL', () => {
    it('trả về avatar mặc định khi không có tên avatar', () => {
      expect(getAvatarURL()).toBe('https://down-vn.img.susercontent.com/file/5657717387ea44467bca92a1dcbaf8d6_tn')
    })

    it('trả về đường dẫn nguyên bản khi avatar đã là url', () => {
      expect(getAvatarURL('http://example.com/avatar.png')).toBe('http://example.com/avatar.png')
    })
  })
})
