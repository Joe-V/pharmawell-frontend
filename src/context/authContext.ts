import { createContext } from 'react'
import type {
  AuthResponse,
  AuthUser,
  GoogleLoginRequest,
  LoginRequest,
  VerifyEmailRequest,
} from '../types/auth'

export type AuthState = {
  user: AuthUser | null
  isAuthenticated: boolean
}

export type AuthContextValue = AuthState & {
  login: (payload: LoginRequest, rememberMe?: boolean) => Promise<AuthResponse>
  verifyEmail: (payload: VerifyEmailRequest) => Promise<AuthResponse>
  googleLogin: (payload: GoogleLoginRequest) => Promise<AuthResponse>
  logout: () => Promise<void>
  refreshUser: () => Promise<AuthUser>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)