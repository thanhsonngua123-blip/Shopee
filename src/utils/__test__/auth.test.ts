import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { User } from '../../types/user.type'
import {
  LocalStorageEventTarget,
  setAccessTokenToLS,
  setRefreshTokenToLS,
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  getProfile,
  setProfile
} from '../auth'

const access_token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZGFmZDk1MzVlZmY0OGYxNmVlZDVhYyIsImVtYWlsIjoidHV5ZDE4NUBnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDI2LTA0LTEyVDE1OjMwOjQ3LjMxN1oiLCJpYXQiOjE3NzYwMDc4NDcsImV4cCI6MTc3NjAxMTQ0N30.TC4SaGJyafCTCkdOSXZfpqBvmUDKyDIHix5W9QWBUr8'

const refresh_token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZGFmZDk1MzVlZmY0OGYxNmVlZDVhYyIsImVtYWlsIjoidHV5ZDE4NUBnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDI2LTA0LTEyVDE1OjMwOjQ3LjMxN1oiLCJpYXQiOjE3NzYwMDc4NDcsImV4cCI6MTc3NjAxMTQ0N30.TC4SaGJyafCTCkdOSXZfpqBvmUDKyDIHix5W9QWBUr8'

const profile: User = {
  _id: '69dafd9535eff48f16eed5ac',
  roles: ['User'],
  email: 'tuyd185@gmail.com',
  createdAt: '2026-04-12T02:04:05.280Z',
  updatedAt: '2026-04-12T02:04:05.280Z'
}

describe('auth utils', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('setAccessTokenToLS lưu access token vào localStorage', () => {
    setAccessTokenToLS(access_token)
    expect(localStorage.getItem('access_token')).toBe(access_token)
  })

  it('getAccessTokenFromLS trả về access token đã lưu', () => {
    localStorage.setItem('access_token', access_token)
    expect(getAccessTokenFromLS()).toBe(access_token)
  })

  it('getAccessTokenFromLS trả về chuỗi rỗng nếu không có access token', () => {
    expect(getAccessTokenFromLS()).toBe('')
  })

  it('setRefreshTokenToLS lưu refresh token vào localStorage', () => {
    setRefreshTokenToLS(refresh_token)
    expect(localStorage.getItem('refresh_token')).toBe(refresh_token)
  })

  it('getRefreshTokenFromLS trả về refresh token đã lưu', () => {
    localStorage.setItem('refresh_token', refresh_token)
    expect(getRefreshTokenFromLS()).toBe(refresh_token)
  })

  it('getRefreshTokenFromLS trả về chuỗi rỗng nếu không có refresh token', () => {
    expect(getRefreshTokenFromLS()).toBe('')
  })

  it('setProfile và getProfile hoạt động với JSON', () => {
    setProfile(profile)
    expect(getProfile()).toEqual(profile)
  })

  it('getProfile trả về null nếu không có profile', () => {
    expect(getProfile()).toBeNull()
  })

  it('clearLS xóa tất cả token và profile, đồng thời dispatch event clear', () => {
    setAccessTokenToLS(access_token)
    setRefreshTokenToLS(refresh_token)
    setProfile(profile)

    const clearListener = vi.fn()
    LocalStorageEventTarget.addEventListener('clear', clearListener)

    clearLS()

    expect(localStorage.getItem('access_token')).toBeNull()
    expect(localStorage.getItem('refresh_token')).toBeNull()
    expect(localStorage.getItem('profile')).toBeNull()
    expect(clearListener).toHaveBeenCalledTimes(1)
  })
})
