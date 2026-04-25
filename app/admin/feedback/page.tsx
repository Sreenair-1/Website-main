'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Download, MessageSquareMore, Star, TrendingUp } from 'lucide-react'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useAuth } from '@/providers/auth-provider'

type FeedbackSummaryResponse = {
  summary: string
  stats: {
    totalFeedback: number
    averageRating: number
    recommendCount: number
    recommendRate: number
    topCategories: Array<{ category: string; count: number }>
  }
  recentFeedback: Array<{
    id: string
    created_at: string
    email: string
    category: string
    rating: number
    would_recommend: boolean
    page_context: string
      message: string
    }>
  allFeedback: Array<{
    id: string
    created_at: string
    email: string
    category: string
    rating: number
    would_recommend: boolean
    page_context: string
    message: string
    user_id: string
  }>
}

function csvEscape(value: unknown) {
  const text = String(value ?? '')
  return `"${text.replace(/"/g, '""')}"`
}

function buildCsv(feedback: FeedbackSummaryResponse['allFeedback']) {
  const rows = [
    [
      'id',
      'created_at',
      'email',
      'category',
      'rating',
      'would_recommend',
      'page_context',
      'user_id',
      'message',
    ],
    ...feedback.map((item) => [
      item.id,
      item.created_at,
      item.email,
      item.category,
      item.rating,
      item.would_recommend ? 'yes' : 'no',
      item.page_context,
      item.user_id,
      item.message,
    ]),
  ]

  return rows.map((row) => row.map(csvEscape).join(',')).join('\n')
}

export default function AdminFeedbackPage() {
  const { user, role, loading } = useAuth()
  const router = useRouter()
  const [summary, setSummary] = useState<FeedbackSummaryResponse | null>(null)
  const [loadingSummary, setLoadingSummary] = useState(true)
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    if (user) {
      fetchSummary()
    }
  }, [user, loading, router])

  const fetchSummary = async () => {
    try {
      if (!user) return

      const token = await user.getIdToken()
      const response = await fetch('/api/admin/feedback/summary', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 403) {
        setError('You do not have access to the admin feedback tools.')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to load feedback summary')
      }

      const data = (await response.json()) as FeedbackSummaryResponse
      setSummary(data)
    } catch (err) {
      console.error('Failed to load admin feedback summary:', err)
      setError(err instanceof Error ? err.message : 'Failed to load feedback summary')
    } finally {
      setLoadingSummary(false)
    }
  }

  const handleExport = async () => {
    if (!user) return

    setExporting(true)
    try {
      if (summary?.allFeedback?.length) {
        const csv = buildCsv(summary.allFeedback)
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = `feedback-submissions-${new Date().toISOString().slice(0, 10)}.csv`
        document.body.appendChild(anchor)
        anchor.click()
        anchor.remove()
        URL.revokeObjectURL(url)
        return
      }

      const token = await user.getIdToken()
      const response = await fetch('/api/admin/feedback/export', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const contentType = response.headers.get('content-type') || ''
      if (!response.ok) {
        const message = contentType.includes('application/json')
          ? (await response.json().catch(() => null))?.error || 'Failed to export feedback'
          : await response.text().catch(() => 'Failed to export feedback')
        throw new Error(message)
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = 'feedback-submissions.csv'
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to export feedback:', err)
      setError(err instanceof Error ? err.message : 'Failed to export feedback')
    } finally {
      setExporting(false)
    }
  }

  if (loading || loadingSummary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (role !== 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-20">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.25em] text-primary">Access restricted</p>
            <h1 className="mt-4 text-3xl font-bold">Admin access required</h1>
            <p className="mt-3 text-muted-foreground">
              This feedback export and summary view is only available to users with the admin role.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Back to dashboard
              </Link>
              <Link
                href="/"
                className="rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/40"
              >
                Go home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
              <MessageSquareMore className="h-4 w-4 text-primary" />
              admin feedback summary
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">Feedback overview</h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Review customer sentiment, spot recurring friction, and export the full feedback log for analysis.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {exporting ? 'Preparing export...' : 'Download CSV'}
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/40"
            >
              Back to dashboard
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-8 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {summary && (
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="text-sm text-muted-foreground">Total feedback</div>
                  <div className="mt-2 text-3xl font-bold">{summary.stats.totalFeedback}</div>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="text-sm text-muted-foreground">Average rating</div>
                  <div className="mt-2 text-3xl font-bold">{summary.stats.averageRating}/5</div>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="text-sm text-muted-foreground">Recommend rate</div>
                  <div className="mt-2 text-3xl font-bold">{summary.stats.recommendRate}%</div>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">AI summary</h2>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                  {summary.summary}
                </p>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">Top categories</h2>
                </div>
                <div className="mt-5 space-y-3">
                  {summary.stats.topCategories.length === 0 ? (
                    <div className="rounded-2xl border border-border bg-secondary/10 p-4 text-sm text-muted-foreground">
                      No category trends yet.
                    </div>
                  ) : (
                    summary.stats.topCategories.map((item) => (
                      <div key={item.category} className="flex items-center justify-between rounded-2xl border border-border bg-secondary/5 px-4 py-3">
                        <span className="text-sm font-medium">{item.category}</span>
                        <span className="text-sm text-muted-foreground">{item.count}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-bold">Recent feedback</h2>
                <div className="mt-5 space-y-4">
                  {summary.recentFeedback.length === 0 ? (
                    <div className="rounded-2xl border border-border bg-secondary/10 p-4 text-sm text-muted-foreground">
                      No feedback submitted yet.
                    </div>
                  ) : (
                    summary.recentFeedback.map((item) => (
                      <div key={item.id} className="rounded-2xl border border-border bg-secondary/5 p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <div className="text-sm font-semibold">{item.category}</div>
                            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                              {new Date(item.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-primary">{item.rating}/5</div>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
