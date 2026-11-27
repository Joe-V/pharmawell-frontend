export const UserRole = {
  Customer: 'Customer',
  Pharmacist: 'Pharmacist',
  Admin: 'Admin',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

// Both Admin & Pharmacist share dashboard access right now
export const DASHBOARD_ROLES: readonly UserRole[] = [
  UserRole.Admin,
  UserRole.Pharmacist,
]

export function hasDashboardAccess(role?: UserRole | string | null): boolean {
  return role === UserRole.Admin || role === UserRole.Pharmacist
}

export function isCustomerRole(role?: UserRole | string | null): boolean {
  return role === UserRole.Customer
}

export function getDefaultRouteForRole(role?: UserRole | string | null): string {
  return hasDashboardAccess(role) ? '/admin' : '/'
}

export type AuthUser = {
  userId: string
  fullName: string
  email: string
  role: UserRole
  phoneNumber: string
  isEmailVerified: boolean
  createdAt: string
}

export type AuthResponse = {
  accessToken: string
  refreshToken: string
  expiresAt: string
  tokenType: string
  user: AuthUser
}

export type RegisterRequest = {
  fullName: string
  email: string
  password: string
  phoneNumber: string
}

export type VerifyEmailRequest = {
  email: string
  code: string
}

export type ResendVerificationRequest = {
  email: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type RefreshTokenRequest = {
  refreshToken: string
}


export type ForgotPasswordRequest = {
  email: string
}

export type ResetPasswordRequest = {
  email: string
  token: string
  newPassword: string
}

export type GoogleLoginRequest = {
  idToken: string
}