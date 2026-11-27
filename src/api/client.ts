import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { authStorage, UNAUTHORIZED_EVENT } from '../lib/authStorage'
import { ApiException, type ApiErrorResponse } from '../types/api'
import type { AuthResponse } from '../types/auth'

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://online-pharmacy-healthcare-store-api-production.up.railway.app/api'

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

const SKIP_REFRESH_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/verify-email',
  '/auth/resend-verification',
  '/auth/refresh',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/google',
]

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function toApiException(error: unknown): ApiException {
  if (error instanceof ApiException) return error

  if (error instanceof AxiosError) {
    const statusCode = error.response?.status ?? 500
    const payload = error.response?.data as ApiErrorResponse | undefined

    const firstFieldError = payload?.errors
      ? Object.values(payload.errors).flat()[0]
      : undefined

    const message =
      payload?.message ||
      firstFieldError ||
      payload?.detail ||
      payload?.title ||
      (statusCode === 429
        ? 'Too many requests. Please wait a moment and try again.'
        : error.code === 'ECONNABORTED'
          ? 'Request timed out. Please try again.'
          : error.message || 'An unexpected network error occurred.')

    return new ApiException(message, statusCode, payload?.errors)
  }

  if (error instanceof Error) {
    return new ApiException(error.message)
  }

  return new ApiException('An unexpected error occurred.')
}

let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  const refreshToken = authStorage.getRefreshToken()
  if (!refreshToken) {
    throw new ApiException('Session expired. Please log in again.', 401)
  }

  // Raw axios call avoids triggering apiClient interceptors recursively
  const { data } = await axios.post<AuthResponse>(
    `${BASE_URL}/auth/refresh`,
    { refreshToken },
    {
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' },
    }
  )

  authStorage.setSession(data)
  return data.accessToken
}

apiClient.interceptors.request.use((config) => {
  const token = authStorage.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined
    const statusCode = error.response?.status
    const requestUrl = originalRequest?.url ?? ''

    const shouldSkipRefresh = SKIP_REFRESH_PATHS.some((path) =>
      requestUrl.includes(path)
    )

    if (
      statusCode === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !shouldSkipRefresh &&
      authStorage.getRefreshToken()
    ) {
      originalRequest._retry = true

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null
          })
        }

        const newAccessToken = await refreshPromise
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        authStorage.clear()
        window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
        return Promise.reject(toApiException(refreshError))
      }
    }

    if (statusCode === 401 && !shouldSkipRefresh) {
      authStorage.clear()
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }

    return Promise.reject(toApiException(error))
  }
)