import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router'
import { Clock, Lock, Mail, ShieldCheck } from 'lucide-react'
import { authApi } from '../../api/authApi'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { OTPInput } from '../../components/auth/OTPInput'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../hooks/useAuth'
import {
  verifyEmailSchema,
  type VerifyEmailFormValues,
} from '../../schemas/authSchema'
import { ApiException } from '../../types/api'
import { getDefaultRouteForRole } from '../../types/auth'

type VerifyLocationState = {
  email?: string
  message?: string
}

export function VerifyEmailPage() {
  const { verifyEmail } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const state = location.state as VerifyLocationState | null
  const initialEmail = state?.email ?? searchParams.get('email') ?? ''

  const [email, setEmail] = useState(initialEmail)
  const [cooldown, setCooldown] = useState(45)
  const [infoBanner, setInfoBanner] = useState(state?.message ?? '')

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = window.setInterval(() => {
      setCooldown((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [cooldown])

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { code: '' },
  })

  const verifyMutation = useMutation({
    mutationFn: (values: VerifyEmailFormValues) =>
      verifyEmail({ email: email.trim(), code: values.code }),
    onSuccess: (auth) => {
      navigate(getDefaultRouteForRole(auth.user.role), { replace: true })
    },
  })

  const resendMutation = useMutation({
    mutationFn: () => authApi.resendVerification({ email: email.trim() }),
    onSuccess: (res) => {
      setInfoBanner(res.message || 'A new verification code was sent.')
      setCooldown(45)
    },
  })

  const formattedTimer = `00:${String(cooldown).padStart(2, '0')}`

  const errorMessage =
    verifyMutation.error instanceof ApiException
      ? verifyMutation.error.message
      : resendMutation.error instanceof ApiException
        ? resendMutation.error.message
        : null

  return (
    <AuthLayout
      heroTitle="A secure and trusted experience"
      heroSubtitle="We're verifying your email to keep your account and health information safe and secure."
      heroVariant="shield"
      heroFeatures={[
        { icon: <ShieldCheck className="h-4 w-4" />, text: 'Your data is protected' },
        { icon: <Lock className="h-4 w-4" />, text: 'Secure account access' },
        { icon: <Mail className="h-4 w-4" />, text: 'Quick and easy verification' },
      ]}
      cardIcon={<Mail className="h-6 w-6" />}
      title="Verify your email"
      subtitle={
        email ? (
          <>
            A 6-digit code was sent to{' '}
            <span className="font-semibold text-foreground">{email}</span>.
          </>
        ) : (
          'Enter your email and the 6-digit code sent to your inbox.'
        )
      }
    >
      <form
        onSubmit={handleSubmit((values) => {
          if (!email.trim()) return
          verifyMutation.mutate(values)
        })}
        className="space-y-5"
        noValidate
      >
        {errorMessage && (
          <div className="rounded-xl border border-destructive-border bg-destructive-soft px-4 py-3 text-xs font-medium text-destructive-soft-foreground">
            {errorMessage}
          </div>
        )}

        {infoBanner && (
          <div className="rounded-xl border border-info-border bg-info-soft px-4 py-3 text-xs font-medium text-info-soft-foreground">
            {infoBanner}
          </div>
        )}

        {!initialEmail && (
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}

        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <OTPInput
              value={field.value}
              onChange={field.onChange}
              error={errors.code?.message}
              disabled={verifyMutation.isPending}
            />
          )}
        />

        <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 text-primary" />
          {cooldown > 0 ? (
            <span>Resend code in {formattedTimer}</span>
          ) : (
            <button
              type="button"
              disabled={!email.trim() || resendMutation.isPending}
              onClick={() => resendMutation.mutate()}
              className="font-semibold text-primary hover:text-primary-hover disabled:text-disabled-foreground cursor-pointer"
            >
              {resendMutation.isPending ? 'Sending...' : 'Resend code'}
            </button>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          fullWidth
          disabled={!email.trim()}
          isLoading={verifyMutation.isPending}
        >
          Verify code
        </Button>

        <div className="border-t border-border pt-4 text-center">
          <Link
            to="/register"
            className="text-sm font-semibold text-primary hover:text-primary-hover"
          >
            Back
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}