import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AxiosError } from 'axios'
import path from '@/constants/path'
import config from '@/constants/config'
import HttpStatusCode from '@/constants/httpStatusCode.enum'
import { setAccessTokenToLS, setRefreshTokenToLS } from '../auth'

type AxiosRequestConfigMock = { headers: Record<string, unknown>; url?: string }

type RequestHandler = {
  onFulfilled: (requestConfig: AxiosRequestConfigMock) => Promise<AxiosRequestConfigMock> | AxiosRequestConfigMock
  onRejected?: (error: unknown) => Promise<unknown> | unknown
}

type ResponseHandler = {
  onFulfilled: (response: unknown) => Promise<unknown> | unknown
  onRejected: (error: unknown) => Promise<unknown>
}

const mockPost = vi.fn()
const mockRequest = vi.fn()
let requestHandlers: RequestHandler[] = []
let responseHandlers: ResponseHandler[] = []

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: {
          use: (onFulfilled: RequestHandler['onFulfilled'], onRejected?: RequestHandler['onRejected']) => {
            requestHandlers.push({ onFulfilled, onRejected })
            return requestHandlers.length - 1
          }
        },
        response: {
          use: (onFulfilled: ResponseHandler['onFulfilled'], onRejected: ResponseHandler['onRejected']) => {
            responseHandlers.push({ onFulfilled, onRejected })
            return responseHandlers.length - 1
          }
        }
      },
      request: mockRequest
    })),
    post: mockPost
  },
  AxiosError: class extends Error {}
}))

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn()
  }
}))

describe('http utils', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    localStorage.clear()
    requestHandlers = []
    responseHandlers = []
  })

  const importHttp = async () => {
    const module = await import('@/utils/http')
    return module.default
  }

  it('gắn authorization header khi có access token', async () => {
    setAccessTokenToLS('Bearer test-token')
    await importHttp()

    const request = { headers: {} }
    const result = await requestHandlers[0].onFulfilled(request)

    expect(result.headers.authorization).toBe('Bearer test-token')
  })

  it('không gắn authorization header khi không có access token', async () => {
    await importHttp()

    const request = { headers: {} }
    const result = await requestHandlers[0].onFulfilled(request)

    expect(result.headers.authorization).toBeUndefined()
  })

  it('lưu access token, refresh token và profile khi login thành công', async () => {
    const profile = {
      _id: '123',
      email: 'user@example.com',
      roles: ['User'],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z'
    }

    await importHttp()

    const response = {
      config: { url: path.login },
      data: {
        data: {
          access_token: 'Bearer refreshed-token',
          refresh_token: 'refresh-token',
          user: profile
        }
      }
    }

    await responseHandlers[0].onFulfilled(response)

    expect(localStorage.getItem('access_token')).toBe('Bearer refreshed-token')
    expect(localStorage.getItem('refresh_token')).toBe('refresh-token')
    expect(localStorage.getItem('profile')).toBe(JSON.stringify(profile))
  })

  it('xóa dữ liệu localStorage khi logout thành công', async () => {
    setAccessTokenToLS('Bearer token')
    setRefreshTokenToLS('refresh-token')
    localStorage.setItem('profile', JSON.stringify({ _id: '123' }))

    await importHttp()

    const response = {
      config: { url: path.logout },
      data: {}
    }

    await responseHandlers[0].onFulfilled(response)

    expect(localStorage.getItem('access_token')).toBeNull()
    expect(localStorage.getItem('refresh_token')).toBeNull()
    expect(localStorage.getItem('profile')).toBeNull()
  })

  it('refresh access token khi nhận 401 và có refresh token', async () => {
    setAccessTokenToLS('Bearer old-token')
    setRefreshTokenToLS('refresh-token')

    await importHttp()

    mockPost.mockResolvedValueOnce({
      data: {
        data: {
          access_token: 'Bearer new-token',
          refresh_token: 'new-refresh-token',
          user: {
            _id: '123',
            email: 'user@example.com',
            roles: ['User'],
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z'
          }
        }
      }
    })
    mockRequest.mockResolvedValueOnce({ status: 200 })

    const error = {
      response: { status: HttpStatusCode.Unauthorized, data: { message: 'Unauthorized' } },
      message: 'Unauthorized',
      config: { url: '/products', headers: {} }
    } as unknown as AxiosError

    const result = await responseHandlers[0].onRejected(error)

    expect(result).toEqual({ status: 200 })
    expect(mockPost).toHaveBeenCalledWith(
      `${config.baseURL}${path.refreshToken}`,
      { refresh_token: 'refresh-token' },
      expect.any(Object)
    )
    expect(mockRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/products',
        headers: expect.objectContaining({ authorization: 'Bearer new-token' })
      })
    )
    expect(localStorage.getItem('access_token')).toBe('Bearer new-token')
    expect(localStorage.getItem('refresh_token')).toBe('new-refresh-token')
  })

  it('xóa localStorage và reject khi nhận 401 nhưng không có refresh token', async () => {
    setAccessTokenToLS('Bearer old-token')
    localStorage.removeItem('refresh_token')

    await importHttp()

    const error = {
      response: { status: HttpStatusCode.Unauthorized, data: { message: 'Unauthorized' } },
      message: 'Unauthorized',
      config: { url: '/products' }
    } as unknown as AxiosError

    await expect(responseHandlers[0].onRejected(error)).rejects.toEqual(error)
    expect(localStorage.getItem('access_token')).toBeNull()
    expect(localStorage.getItem('refresh_token')).toBeNull()
  })

  it('hiển thị toast error cho lỗi không phải 422', async () => {
    await importHttp()

    const error = {
      response: { status: HttpStatusCode.InternalServerError, data: { message: 'Server error' } },
      message: 'Server error',
      config: { url: '/products' }
    } as unknown as AxiosError

    await expect(responseHandlers[0].onRejected(error)).rejects.toEqual(error)
    const { toast } = await import('react-toastify')
    expect(toast.error).toHaveBeenCalledWith('Server error')
  })

  it('không hiển thị toast error khi status là 422', async () => {
    await importHttp()

    const error = {
      response: { status: HttpStatusCode.UnprocessableEntity, data: { message: 'Validation failed' } },
      message: 'Validation failed',
      config: { url: '/products' }
    } as unknown as AxiosError

    await expect(responseHandlers[0].onRejected(error)).rejects.toEqual(error)
    const { toast } = await import('react-toastify')
    expect(toast.error).not.toHaveBeenCalled()
  })
})
