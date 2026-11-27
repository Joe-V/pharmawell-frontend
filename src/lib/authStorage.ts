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

export const authStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  getSession(): StoredSession | null {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    const expiresAt = localStorage.getItem(EXPIRES_AT_KEY) ?? ''
    const rawUser = localStorage.getItem(USER_KEY)

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

  setSession(auth: Pick<AuthResponse, 'accessToken' | 'refreshToken' | 'expiresAt' | 'user'>): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken)
    localStorage.setItem(EXPIRES_AT_KEY, auth.expiresAt)
    localStorage.setItem(USER_KEY, JSON.stringify(auth.user))
  },

  setUser(user: AuthUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(EXPIRES_AT_KEY)
    localStorage.removeItem(USER_KEY)
  },
}