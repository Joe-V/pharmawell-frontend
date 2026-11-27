import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import { Leaf, Lock, PackageCheck, ShieldCheck, Truck } from 'lucide-react'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { GoogleSignInButton } from '../../components/auth/GoogleSignInButton'
import { PasswordInput } from '../../components/auth/PasswordInput'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../hooks/useAuth'
import { loginSchema, type LoginFormValues } from '../../schemas/authSchema'
import { ApiException } from '../../types/api'
import { getDefaultRouteForRole, isCustomerRole } from '../../types/auth'

type LocationState = {
  from?: { pathname?: string }
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  })

  const loginMutation = useMutation({
    mutationFn: (values: LoginFormValues) =>
      login(
        { email: values.email.trim(), password: values.password },
        values.rememberMe ?? true
      ),
    onSuccess: (auth) => {
      const fromPath = (location.state as LocationState | null)?.from?.pathname
      if (fromPath && isCustomerRole(auth.user.role)) {
        navigate(fromPath, { replace: true })
        return
      }
      navigate(getDefaultRouteForRole(auth.user.role), { replace: true })
    },
  })

  const errorMessage =
    loginMutation.error instanceof ApiException
      ? loginMutation.error.message
      : loginMutation.error
        ? 'Unable to sign in. Please try again.'
        : null

  const needsVerification = Boolean(
    errorMessage && errorMessage.toLowerCase().includes('verif')
  )

  return (
    <AuthLayout
      heroTitle="Your trusted online pharmacy"
      heroSubtitle="Order your medicines, wellness essentials, and everyday healthcare products, delivered to your doorstep with care."
      heroFeatures={[
        { icon: <Truck className="h-4 w-4" />, text: 'Fast & reliable delivery' },
        { icon: <ShieldCheck className="h-4 w-4" />, text: 'Genuine medicines' },
        { icon: <Leaf className="h-4 w-4" />, text: 'Wide range of health products' },
      ]}
      cardIcon={<Lock className="h-6 w-6" />}
      title="Welcome back"
      subtitle="Log in to your account"
    >
      <form
        onSubmit={handleSubmit((values) => loginMutation.mutate(values))}
        className="space-y-4"
        noValidate
      >
        {errorMessage && (
          <div className="rounded-xl border border-destructive-border bg-destructive-soft px-4 py-3 text-xs font-medium text-destructive-soft-foreground">
            <p>{errorMessage}</p>
            {needsVerification && loginMutation.variables?.email && (
              <Link
                to={`/verify-email?email=${encodeURIComponent(loginMutation.variables.email)}`}
                className="mt-1.5 inline-flex items-center gap-1 font-semibold underline"
              >
                <PackageCheck className="h-3.5 w-3.5" />
                Go to email verification
              </Link>
            )}
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

        <PasswordInput
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-between pt-0.5 text-sm">
          <label className="inline-flex items-center gap-2 text-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-input accent-primary cursor-pointer"
              {...register('rememberMe')}
            />
            <span>Remember me</span>
          </label>

          <Link
            to="/forgot-password"
            className="font-semibold text-primary hover:text-primary-hover"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          size="lg"
          fullWidth
          isLoading={loginMutation.isPending}
        >
          Log in
        </Button>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2.5 text-subtle-foreground">or</span>
          </div>
        </div>

        <GoogleSignInButton />

        <p className="border-t border-border pt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-primary hover:text-primary-hover"
          >
            Create account
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}