import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Moon, Pill, ShieldCheck, Store, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

type HeroFeature = {
  icon: ReactNode
  text: string
}

type AuthLayoutProps = {
  heroTitle: string
  heroSubtitle: string
  heroFeatures: HeroFeature[]
  heroVariant?: 'bottle' | 'shield'
  cardIcon: ReactNode
  cardIconVariant?: 'primary' | 'success'
  title: string
  subtitle?: ReactNode
  children: ReactNode
}

function PharmaWellMark() {
  return (
    <svg
      viewBox="0 0 36 36"
      className="h-9 w-9 shrink-0"
      aria-hidden="true"
      fill="none"
    >
      <rect x="13" y="2" width="10" height="32" rx="4" className="fill-primary" />
      <rect x="2" y="13" width="32" height="10" rx="4" className="fill-secondary" />
      <rect x="13" y="13" width="10" height="10" rx="2" className="fill-primary-hover" />
    </svg>
  )
}

function HeroVisual({ variant }: { variant: 'bottle' | 'shield' }) {
  return (
    <div className="relative mt-6 flex items-center justify-end pr-2 pt-4 select-none">
      <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-card/70 shadow-sm ring-1 ring-border">
        <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-md">
          {variant === 'shield' ? (
            <ShieldCheck className="h-16 w-16" strokeWidth={1.75} />
          ) : (
            <Pill className="h-16 w-16" strokeWidth={1.75} />
          )}
        </div>
        <span className="absolute -bottom-2 -left-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-secondary shadow-sm">
          <ShieldCheck className="h-6 w-6" />
        </span>
      </div>
    </div>
  )
}

export function AuthLayout({
  heroTitle,
  heroSubtitle,
  heroFeatures,
  heroVariant = 'bottle',
  cardIcon,
  cardIconVariant = 'primary',
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-border bg-navbar">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <PharmaWellMark />
            <div className="leading-tight">
              <span className="block text-lg font-bold tracking-tight text-foreground">
                PharmaWell
              </span>
              <span className="block text-xs text-muted-foreground">
                Online Pharmacy
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-lg border border-border bg-card p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft"
            >
              <Store className="h-4 w-4" />
              <span>Back to Store</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Split Grid */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-8 sm:px-6">
        <div className="grid w-full items-stretch gap-6 lg:grid-cols-12">
          {/* Left Hero Panel */}
          <section className="hidden lg:col-span-7 lg:flex lg:flex-col lg:justify-between rounded-3xl border border-border bg-linear-to-br from-auth-start to-auth-end p-10">
            <div className="space-y-6">
              <div className="space-y-3">
                <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground">
                  {heroTitle}
                </h1>
                <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                  {heroSubtitle}
                </p>
              </div>

              <ul className="space-y-3.5 pt-2">
                {heroFeatures.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-primary shadow-xs">
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <HeroVisual variant={heroVariant} />
          </section>

          {/* Right Form Card */}
          <section className="lg:col-span-5 flex flex-col justify-center rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-9">
            <div className="mb-6 flex flex-col items-center text-center">
              <div
                className={[
                  'mb-4 flex h-14 w-14 items-center justify-center',
                  cardIconVariant === 'success'
                    ? 'rounded-full bg-success-soft text-success'
                    : 'rounded-2xl bg-primary-soft text-primary',
                ].join(' ')}
              >
                {cardIcon}
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>

            {children}
          </section>
        </div>
      </main>
    </div>
  )
}