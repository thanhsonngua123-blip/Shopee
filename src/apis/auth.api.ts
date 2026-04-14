import path from '@/constants/path'
import { AuthResponse } from '@/types/auth.type'
import http from '@/utils/http'

const authApi = {
  registerAccount: (body: { email: string; password: string }) => http.post<AuthResponse>(path.register, body),
  loginAccount: (body: { email: string; password: string }) => http.post<AuthResponse>(path.login, body),
  refreshToken: (body: { refresh_token: string }) => http.post<AuthResponse>(path.refreshToken, body),
  logout: () => http.post(path.logout)
}

export default authApi
