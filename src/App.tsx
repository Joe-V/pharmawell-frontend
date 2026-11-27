import { useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  Calendar,
  ChevronRight,
  Lock,
  Mail,
  Moon,
  ShoppingBag,
  Sun,
  Trash2,
} from 'lucide-react'
import { ThemeProvider } from './context/ThemeProvider'
import { useTheme } from './hooks/useTheme'
import { queryClient } from './lib/queryClient'
import { Button } from './components/ui/Button'
import { Input } from './components/ui/Input'
import { Select } from './components/ui/Select'

function ComponentPlayground() {
  const { theme, toggleTheme } = useTheme()
  const [email, setEmail] = useState('')
  const [price, setPrice] = useState('35.00')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('all')
  const [loadingDemo, setLoadingDemo] = useState(false)

  const handleLoadingTest = () => {
    setLoadingDemo(true)
    setTimeout(() => setLoadingDemo(false), 1200)
  }

  return (
    <div className="min-h-screen bg-background p-6 text-foreground md:p-10">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Top bar */}
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-navbar px-6 py-4 shadow-xs">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              PharmaWell UI Kit
            </p>
            <h1 className="text-xl font-bold text-foreground">
              Shared Primitives Preview
            </h1>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={toggleTheme}
            leftIcon={
              theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )
            }
          >
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </Button>
        </header>

        {/* Buttons */}
        <section className="space-y-5 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-base font-bold text-foreground">Buttons</h2>

          <div className="flex flex-wrap items-center gap-3">
            <Button leftIcon={<ShoppingBag className="h-4 w-4" />}>
              Continue Shopping
            </Button>
            <Button variant="outline" rightIcon={<ChevronRight className="h-4 w-4" />}>
              View Details
            </Button>
            <Button variant="secondary">Cancel</Button>
            <Button variant="ghost" rightIcon={<ChevronRight className="h-4 w-4" />}>
              View Order
            </Button>
            <Button variant="destructive" leftIcon={<Trash2 className="h-4 w-4" />}>
              Delete
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button isLoading={loadingDemo} onClick={handleLoadingTest}>
              {loadingDemo ? 'Saving...' : 'Click to Test Loading'}
            </Button>
            <Button disabled>Disabled</Button>
          </div>

          <Button
            size="lg"
            fullWidth
            leftIcon={<Lock className="h-4 w-4" />}
          >
            Place Order — EGP 365.50
          </Button>
        </section>

        {/* Inputs & Selects */}
        <section className="space-y-5 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-base font-bold text-foreground">
            Inputs &amp; Selects
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Email Address"
              required
              type="email"
              placeholder="sara.ahmed@example.com"
              leftIcon={<Mail className="h-4 w-4" />}
              helperText="We will send a 6-digit verification code."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Price (EGP)"
              required
              leftPrefix="EGP"
              placeholder="e.g., 35.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <Input
              label="With Validation Error"
              required
              defaultValue="bad-email"
              leftIcon={<Mail className="h-4 w-4" />}
              error="Please enter a valid email address."
            />

            <Input
              label="Disabled Input"
              disabled
              defaultValue="Read-only account ID"
            />

            <Select
              label="Category"
              required
              placeholder="Select a category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              helperText="Determines prescription requirement."
              options={[
                { label: 'Pain Relief & Fever', value: '1' },
                { label: 'Antibiotics (Rx)', value: '2' },
                { label: 'Vitamins & Supplements', value: '3' },
              ]}
            />

            <Select
              label="Order Status Filter"
              leftIcon={<Calendar className="h-4 w-4" />}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { label: 'All Statuses', value: 'all' },
                { label: 'Pending Approval', value: 'PendingApproval' },
                { label: 'Confirmed', value: 'Confirmed' },
                { label: 'Out for Delivery', value: 'OutForDelivery' },
                { label: 'Delivered', value: 'Delivered' },
              ]}
            />
          </div>
        </section>

        {/* Semantic Badges Preview */}
        <section className="space-y-3 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-base font-bold text-foreground">
            Status Tokens Check
          </h2>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-pending-bg px-3 py-1 text-pending">
              Pending Approval
            </span>
            <span className="rounded-full bg-confirmed-bg px-3 py-1 text-confirmed">
              Confirmed
            </span>
            <span className="rounded-full bg-delivery-bg px-3 py-1 text-delivery">
              Out for Delivery
            </span>
            <span className="rounded-full bg-delivered-bg px-3 py-1 text-delivered">
              Delivered
            </span>
            <span className="rounded-full bg-cancelled-bg px-3 py-1 text-cancelled">
              Cancelled
            </span>
          </div>
        </section>
      </div>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ComponentPlayground />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App