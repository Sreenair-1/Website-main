'use client'

import Link from 'next/link'
import { useAuth } from '@/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { ArrowRight, Shield } from 'lucide-react'

export function Header() {
  const { user, role, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-xl font-semibold tracking-tight text-foreground">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
            IO
          </span>
          <span>
            IndusOpa<span className="text-primary">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/case-studies" className="transition-colors hover:text-foreground">
            Solutions
          </Link>
          <Link href="/diagnostics" className="transition-colors hover:text-foreground">
            Diagnostics
          </Link>
          <Link href="/feedback" className="transition-colors hover:text-foreground">
            Feedback
          </Link>
          <Link href="/booking" className="transition-colors hover:text-foreground">
            Book consult
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
            <Link
              href="/dashboard"
              className="hidden rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground sm:inline-flex"
            >
              Dashboard
            </Link>
            {role === 'admin' && (
              <Link
                href="/admin/feedback"
                className="hidden items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/15 sm:inline-flex"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-full border border-foreground px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hidden rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/40 sm:inline-flex"
              >
                Login
              </Link>
              <Link
                href="/booking"
                className="hidden rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground sm:inline-flex"
              >
                Browse
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Client portal
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
