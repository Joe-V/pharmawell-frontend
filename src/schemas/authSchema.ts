import { z } from 'zod'

const passwordRules = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .regex(/[A-Za-z]/, 'Password must include at least one letter.')
  .regex(/[0-9!@#$%^&*(),.?":{}|<>_\-+=]/, 'Include a number or symbol.')

export const loginSchema = z.object({
  email: z.email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
  rememberMe: z.boolean().optional(),
})

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Full name must be at least 2 characters.'),
    email: z.email('Please enter a valid email address.'),
    phoneNumber: z
      .string()
      .trim()
      .min(8, 'Please enter a valid phone number.')
      .regex(/^\+?[0-9\s\-()]{8,20}$/, 'Invalid phone number format.'),
    password: passwordRules,
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .length(6, 'Enter all 6 digits from your email.')
    .regex(/^\d{6}$/, 'Verification code must contain digits only.'),
})

export const forgotPasswordSchema = z.object({
  email: z.email('Please enter a valid email address.'),
})

export const resetPasswordSchema = z
  .object({
    newPassword: passwordRules,
    confirmPassword: z.string().min(1, 'Please confirm your new password.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>