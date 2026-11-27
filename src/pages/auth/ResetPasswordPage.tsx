import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { KeyRound, Lock, ShieldCheck } from 'lucide-react'
import { authApi } from '../../api/authApi'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { PasswordInput } from '../../components/auth/PasswordInput'
import { Button } from '../../components/ui/Button'
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '../../schemas/authSchema'
import { ApiException } from '../../types/api'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const email = searchParams.get('email') ?? ''
  const token = searchParams.get('token') ?? ''
  const isLinkInvalid = !email || !token

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  const resetMutation = useMutation({
    mutationFn: (values: ResetPasswordFormValues) =>
      authApi.resetPassword({
        email,
        token,
        newPassword: values.newPassword,
      }),
    onSuccess: () => {
      navigate('/password-reset-success', { replace: true })
    },
  })

  const errorMessage =
    resetMutation.error instanceof ApiException
      ? resetMutation.error.message
      : resetMutation.error
        ? 'Failed to reset password. The link may have expired.'
        : null

  return (
    <AuthLayout
      heroTitle="Reset your password"
      heroSubtitle="Create a new, secure password to keep your account and health information safe."
      heroFeatures={[
        { icon: <Lock className="h-4 w-4" />, text: 'Use at least 8 characters' },
        { icon: <ShieldCheck className="h-4 w-4" />, text: 'Include a mix of letters, numbers, or symbols' },
        { icon: <ShieldCheck className="h-4 w-4" />, text: 'Keep your password private and unique' },
      ]}
      cardIcon={<KeyRound className="h-6 w-6" />}
      title="Reset your password"
      subtitle="Enter a new password for your account."
    >
      {isLinkInvalid ? (
        <div className="space-y-4 text-center">
          <div className="rounded-xl border border-destructive-border bg-destructive-soft px-4 py-3 text-xs font-medium text-destructive-soft-foreground">
            This password reset link is missing required details or has expired.
          </div>
          <Link to="/forgot-password" className="block">
            <Button size="lg" fullWidth>
              Request a new reset link
            </Button>
          </Link>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit((values) => resetMutation.mutate(values))}
          className="space-y-4"
          noValidate
        >
          {errorMessage && (
            <div className="rounded-xl border border-destructive-border bg-destructive-soft px-4 py-3 text-xs font-medium text-destructive-soft-foreground">
              {errorMessage}
            </div>
          )}

          <PasswordInput
            label="New password"
            autoComplete="new-password"
            placeholder="Enter new password"
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />

          <PasswordInput
            label="Confirm new password"
            autoComplete="new-password"
            placeholder="Confirm new password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <div className="pt-1">
            <Button
              type="submit"
              size="lg"
              fullWidth
              isLoading={resetMutation.isPending}
            >
              Reset password
            </Button>
          </div>

          <p className="border-t border-border pt-4 text-center text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link
              to="/login"
              className="font-semibold text-primary hover:text-primary-hover"
            >
              Log in
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  )
}