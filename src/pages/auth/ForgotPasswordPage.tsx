import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { Lock, Mail, ShieldCheck, Zap } from 'lucide-react'
import { authApi } from '../../api/authApi'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '../../schemas/authSchema'
import { ApiException } from '../../types/api'

export function ForgotPasswordPage() {
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = window.setInterval(() => {
      setCooldown((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [cooldown])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const forgotMutation = useMutation({
    mutationFn: (values: ForgotPasswordFormValues) =>
      authApi.forgotPassword({ email: values.email.trim() }),
    onSuccess: (_res, variables) => {
      setSubmittedEmail(variables.email.trim())
      setCooldown(45)
    },
  })

  const errorMessage =
    forgotMutation.error instanceof ApiException
      ? forgotMutation.error.message
      : forgotMutation.error
        ? 'Could not send reset email. Please try again.'
        : null

  return (
    <AuthLayout
      heroTitle="Need a password reset?"
      heroSubtitle="No worries — we'll help you get back into your PharmaWell account quickly and securely."
      heroFeatures={[
        { icon: <Mail className="h-4 w-4" />, text: 'Secure email verification' },
        { icon: <ShieldCheck className="h-4 w-4" />, text: 'Keep your account protected' },
        { icon: <Zap className="h-4 w-4" />, text: 'Quick and easy reset' },
      ]}
      cardIcon={<Lock className="h-6 w-6" />}
      title="Forgot your password?"
      subtitle="Enter your email address and we'll send you a password reset link."
    >
      <form
        onSubmit={handleSubmit((values) => forgotMutation.mutate(values))}
        className="space-y-4"
        noValidate
      >
        {errorMessage && (
          <div className="rounded-xl border border-destructive-border bg-destructive-soft px-4 py-3 text-xs font-medium text-destructive-soft-foreground">
            {errorMessage}
          </div>
        )}

        {submittedEmail && (
          <div className="rounded-xl border border-success-border bg-success-soft px-4 py-3 text-xs font-medium text-success-soft-foreground">
            <p>
              If an account exists for <strong>{submittedEmail}</strong>, a
              password reset link has been sent. Please check your inbox.
            </p>
            <button
              type="button"
              disabled={cooldown > 0 || forgotMutation.isPending}
              onClick={() => forgotMutation.mutate({ email: submittedEmail })}
              className="mt-2 font-semibold underline disabled:opacity-60 cursor-pointer"
            >
              {cooldown > 0
                ? `Resend available in ${cooldown}s`
                : 'Resend reset email'}
            </button>
          </div>
        )}

        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Button
          type="submit"
          size="lg"
          fullWidth
          isLoading={forgotMutation.isPending}
        >
          Send reset link
        </Button>

        <div className="border-t border-border pt-4 text-center">
          <Link
            to="/login"
            className="text-sm font-semibold text-primary hover:text-primary-hover"
          >
            Back to login
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}