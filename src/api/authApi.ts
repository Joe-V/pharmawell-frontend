import { apiClient } from './client'
import type { MessageResponse } from '../types/api'
import type {
  AuthResponse,
  AuthUser,
  ForgotPasswordRequest,
  GoogleLoginRequest,
  LoginRequest,
  RegisterRequest,
  ResendVerificationRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from '../types/auth'

export const authApi = {
  async register(payload: RegisterRequest): Promise<MessageResponse> {
    const { data } = await apiClient.post<MessageResponse>('/auth/register', payload)
    return data
  },

  async verifyEmail(payload: VerifyEmailRequest): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/verify-email', payload)
    return data
  },

  async resendVerification(
    payload: ResendVerificationRequest
  ): Promise<MessageResponse> {
    const { data } = await apiClient.post<MessageResponse>(
      '/auth/resend-verification',
      payload
    )
    return data
  },

  async login(payload: LoginRequest): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', payload)
    return data
  },

  async googleLogin(payload: GoogleLoginRequest): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/google', payload)
    return data
  },

  async forgotPassword(
    payload: ForgotPasswordRequest
  ): Promise<MessageResponse> {
    const { data } = await apiClient.post<MessageResponse>(
      '/auth/forgot-password',
      payload
    )
    return data
  },

  async resetPassword(payload: ResetPasswordRequest): Promise<MessageResponse> {
    const { data } = await apiClient.post<MessageResponse>(
      '/auth/reset-password',
      payload
    )
    return data
  },

  async getMe(): Promise<AuthUser> {
    const { data } = await apiClient.get<AuthUser>('/auth/me')
    return data
  },

  async logout(): Promise<MessageResponse> {
    const { data } = await apiClient.post<MessageResponse>('/auth/logout')
    return data
  },
}