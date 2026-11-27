import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { Heart, ShieldCheck, Truck, UserPlus } from 'lucide-react'
import { authApi } from '../../api/authApi'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { GoogleSignInButton } from '../../components/auth/GoogleSignInButton'
import { PasswordInput } from '../../components/auth/PasswordInput'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { registerSchema, type RegisterFormValues } from '../../schemas/authSchema'
import { ApiException } from '../../types/api'

export function RegisterPage() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  })

  const registerMutation = useMutation({
    mutationFn: (values: RegisterFormValues) =>
      authApi.register({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phoneNumber: values.phoneNumber.trim(),
        password: values.password,
      }),
    onSuccess: (res, variables) => {
      navigate(`/verify-email?email=${encodeURIComponent(variables.email.trim())}`, {
        state: {
          email: variables.email.trim(),
          message: res.message,
        },
      })
    },
  })

  const errorMessage =
    registerMutation.error instanceof ApiException
      ? registerMutation.error.message
      : registerMutation.error
        ? 'Could not create account. Please try again.'
        : null

  return (
    <AuthLayout
      heroTitle="Your trusted online pharmacy"
      heroSubtitle="Create an account to enjoy a faster, safer, and more personalized pharmacy experience."
      heroFeatures={[
        { icon: <Truck className="h-4 w-4" />, text: 'Quicker, easier ordering' },
        { icon: <ShieldCheck className="h-4 w-4" />, text: 'Secure and private account' },
        { icon: <Heart className="h-4 w-4" />, text: 'Manage orders, refills, and prescriptions' },
      ]}
      cardIcon={<UserPlus className="h-6 w-6" />}
      title="Create an account"
      subtitle="Join PharmaWell to take care of your health online."
    >
      <form
        onSubmit={handleSubmit((values) => registerMutation.mutate(values))}
        className="space-y-3.5"
        noValidate
      >
        {errorMessage && (
          <div className="rounded-xl border border-destructive-border bg-destructive-soft px-4 py-3 text-xs font-medium text-destructive-soft-foreground">
            {errorMessage}
          </div>
        )}

        <Input
          label="Full name"
          autoComplete="name"
          placeholder="Enter your full name"
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Phone number"
          type="tel"
          autoComplete="tel"
          placeholder="+20 10 1234 5678"
          error={errors.phoneNumber?.message}
          {...register('phoneNumber')}
        />

        <PasswordInput
          label="Password"
          autoComplete="new-password"
          placeholder="Create a password"
          error={errors.password?.message}
          {...register('password')}
        />

        <PasswordInput
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Confirm your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div className="pt-1">
          <Button
            type="submit"
            size="lg"
            fullWidth
            isLoading={registerMutation.isPending}
          >
            Create account
          </Button>
        </div>

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
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-primary hover:text-primary-hover"
          >
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}