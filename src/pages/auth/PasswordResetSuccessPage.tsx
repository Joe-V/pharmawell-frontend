import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Check, Leaf, ShieldCheck, Truck } from 'lucide-react'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { Button } from '../../components/ui/Button'

export function PasswordResetSuccessPage() {
  const navigate = useNavigate()
  const [secondsLeft, setSecondsLeft] = useState(5)

  useEffect(() => {
    if (secondsLeft <= 0) return

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [secondsLeft])

  useEffect(() => {
    if (secondsLeft > 0) return

    if (window.opener) {
      window.close()
    }
    navigate('/login', { replace: true })
  }, [secondsLeft, navigate])

  return (
    <AuthLayout
      heroTitle="Your account is updated"
      heroSubtitle="Your password has been reset successfully. You can now log in to your PharmaWell account and continue managing your health and wellness needs."
      heroFeatures={[
        { icon: <Truck className="h-4 w-4" />, text: 'Fast & reliable delivery' },
        { icon: <ShieldCheck className="h-4 w-4" />, text: 'Genuine medicines' },
        { icon: <Leaf className="h-4 w-4" />, text: 'Wide range of health products' },
      ]}
      cardIcon={<Check className="h-7 w-7" strokeWidth={2.5} />}
      cardIconVariant="success"
      title="Password reset successful!"
      subtitle="Your password has been updated and you can now log in to your account."
    >
      <div className="space-y-4 text-center">
        <p className="text-xs font-medium text-subtle-foreground">
          Redirecting to login in {secondsLeft}s...
        </p>

        <Link to="/login" replace className="block">
          <Button size="lg" fullWidth>
            Back to login
          </Button>
        </Link>
      </div>
    </AuthLayout>
  )
}