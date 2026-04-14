import HttpStatusCode from '@/constants/httpStatusCode.enum'
import path from '@/constants/path'
import config from '@/constants/config'
import { AuthResponse } from '@/types/auth.type'
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setProfile,
  setRefreshTokenToLS
} from './auth'

type ErrorResponseData = {
  message?: string
}

type RequestConfigWithRetry = AxiosRequestConfig & {
  _retry?: boolean
}

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null = null

  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'expire-access-token': 60 * 60 * 24,
        'expire-refresh-token': 60 * 60 * 24 * 160
      }
    })

    this.instance.interceptors.request.use((requestConfig) => {
      if (this.accessToken) {
        requestConfig.headers = requestConfig.headers || {}
        requestConfig.headers.authorization = this.accessToken
      }
      return requestConfig
    })

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === path.login || url === path.register || url === path.refreshToken) {
          const data = response.data as AuthResponse
          this.accessToken = data.data?.access_token || ''
          this.refreshToken = data.data?.refresh_token || this.refreshToken
          setAccessTokenToLS(this.accessToken)
          setRefreshTokenToLS(this.refreshToken)
          if (data.data?.user) {
            setProfile(data.data.user)
          }
        } else if (url === path.logout) {
          this.accessToken = ''
          this.refreshToken = ''
          clearLS()
        }
        return response
      },
      async (error: AxiosError<ErrorResponseData>) => {
        const status = error.response?.status
        const message = error.response?.data?.message || error.message
        const originalRequest = error.config as RequestConfigWithRetry
        const isAuthRequest =
          originalRequest?.url === path.login ||
          originalRequest?.url === path.register ||
          originalRequest?.url === path.refreshToken

        if (status === HttpStatusCode.Unauthorized && originalRequest && !originalRequest._retry && !isAuthRequest) {
          if (!this.refreshToken) {
            this.accessToken = ''
            this.refreshToken = ''
            clearLS()
            return Promise.reject(error)
          }

          originalRequest._retry = true

          try {
            const newAccessToken = await this.handleRefreshToken()
            originalRequest.headers = originalRequest.headers || {}
            originalRequest.headers.authorization = newAccessToken
            return this.instance.request(originalRequest)
          } catch (refreshError) {
            this.accessToken = ''
            this.refreshToken = ''
            clearLS()
            return Promise.reject(refreshError)
          }
        }

        if (status !== HttpStatusCode.UnprocessableEntity) {
          toast.error(message)
        }

        return Promise.reject(error)
      }
    )
  }

  private async handleRefreshToken(): Promise<string> {
    if (!this.refreshToken) {
      return Promise.reject(new Error('Refresh token not available'))
    }

    if (!this.refreshTokenRequest) {
      this.refreshTokenRequest = axios
        .post<AuthResponse>(
          `${config.baseURL}${path.refreshToken}`,
          { refresh_token: this.refreshToken },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        .then((response) => {
          const data = response.data
          const accessToken = data.data?.access_token || ''
          const refreshToken = data.data?.refresh_token || this.refreshToken

          this.accessToken = accessToken
          this.refreshToken = refreshToken
          setAccessTokenToLS(accessToken)
          setRefreshTokenToLS(refreshToken)

          if (data.data?.user) {
            setProfile(data.data.user)
          }

          return accessToken
        })
        .finally(() => {
          this.refreshTokenRequest = null
        })
    }

    return this.refreshTokenRequest
  }
}

const http = new Http().instance

export default http
