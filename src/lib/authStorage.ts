import type { AuthResponse, AuthUser } from '../types/auth'

const ACCESS_TOKEN_KEY = 'pharmawell_access_token'
const REFRESH_TOKEN_KEY = 'pharmawell_refresh_token'
const EXPIRES_AT_KEY = 'pharmawell_expires_at'
const USER_KEY = 'pharmawell_user'

export const UNAUTHORIZED_EVENT = 'pharmawell:unauthorized'

export type StoredSession = {
  accessToken: string
  refreshToken: string
  expiresAt: string
  user: AuthUser
}

function getActiveStorage(): Storage {
  if (localStorage.getItem(REFRESH_TOKEN_KEY)) return localStorage
  if (sessionStorage.getItem(REFRESH_TOKEN_KEY)) return sessionStorage
  return localStorage
}

export const authStorage = {
  getAccessToken(): string | null {
    return (
      localStorage.getItem(ACCESS_TOKEN_KEY) ??
      sessionStorage.getItem(ACCESS_TOKEN_KEY)
    )
  },

  getRefreshToken(): string | null {
    return (
      localStorage.getItem(REFRESH_TOKEN_KEY) ??
      sessionStorage.getItem(REFRESH_TOKEN_KEY)
    )
  },

  getSession(): StoredSession | null {
    const storage = getActiveStorage()
    const accessToken = storage.getItem(ACCESS_TOKEN_KEY)
    const refreshToken = storage.getItem(REFRESH_TOKEN_KEY)
    const expiresAt = storage.getItem(EXPIRES_AT_KEY) ?? ''
    const rawUser = storage.getItem(USER_KEY)

    if (!accessToken || !refreshToken || !rawUser) {
      return null
    }

    try {
      const user = JSON.parse(rawUser) as AuthUser
      return { accessToken, refreshToken, expiresAt, user }
    } catch {
      this.clear()
      return null
    }
  },

  setSession(
    auth: Pick<AuthResponse, 'accessToken' | 'refreshToken' | 'expiresAt' | 'user'>,
    rememberMe?: boolean
  ): void {
    const target =
      rememberMe === undefined
        ? getActiveStorage()
        : rememberMe
          ? localStorage
          : sessionStorage

    this.clear()
    target.setItem(ACCESS_TOKEN_KEY, auth.accessToken)
    target.setItem(REFRESH_TOKEN_KEY, auth.refreshToken)
    target.setItem(EXPIRES_AT_KEY, auth.expiresAt)
    target.setItem(USER_KEY, JSON.stringify(auth.user))
  },

  setUser(user: AuthUser): void {
    getActiveStorage().setItem(USER_KEY, JSON.stringify(user))
  },

  clear(): void {
    ;[localStorage, sessionStorage].forEach((storage) => {
      storage.removeItem(ACCESS_TOKEN_KEY)
      storage.removeItem(REFRESH_TOKEN_KEY)
      storage.removeItem(EXPIRES_AT_KEY)
      storage.removeItem(USER_KEY)
    })
  },
}