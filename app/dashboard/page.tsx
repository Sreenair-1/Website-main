'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { collection, getDocs, query, where } from 'firebase/firestore'
import {
  Activity,
  ArrowRight,
  BarChart3,
  Clock3,
  LogOut,
  MessageSquareMore,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useAuth } from '@/providers/auth-provider'
import { db } from '@/lib/firebase'
import { Shield } from 'lucide-react'

interface DiagnosticResult {
  id: string
  title: string
  score: number
  category: string
  dimensions: Record<string, number>
  recommendations: string[]
  created_at: string
}

interface FeedbackSubmission {
  id: string
  user_id: string
  category: string
  rating: number
  message: string
  page_context: string
  would_recommend: boolean
  created_at: string
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString()
}

function getScoreLabel(score: number) {
  if (score >= 80) return 'Strong'
  if (score >= 60) return 'Balanced'
  if (score >= 40) return 'Needs attention'
  return 'At risk'
}

export default function DashboardPage() {
  const { user, role, loading, signOut } = useAuth()
  const router = useRouter()
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [feedback, setFeedback] = useState<FeedbackSubmission[]>([])
  const [loadingResults, setLoadingResults] = useState(true)
  const [loadingFeedback, setLoadingFeedback] = useState(true)
  const [aiInsights, setAiInsights] = useState<string>('')
  const [loadingInsights, setLoadingInsights] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    if (user) {
      fetchResults()
      fetchFeedback()
    }
  }, [user, loading, router])

  const fetchResults = async () => {
    try {
      if (!user) return

      const resultsQuery = query(collection(db, 'diagnostic_results'), where('user_id', '==', user.uid))
      const snapshot = await getDocs(resultsQuery)
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<DiagnosticResult, 'id'> & { createdAt?: string }),
        created_at:
          (doc.data() as { created_at?: string; createdAt?: string }).created_at ??
          (doc.data() as { created_at?: string; createdAt?: string }).createdAt ??
          new Date().toISOString(),
      }))

      items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setResults(items)
    } catch (err) {
      console.error('Failed to fetch results:', err)
    } finally {
      setLoadingResults(false)
    }
  }

  const fetchFeedback = async () => {
    try {
      if (!user) return

      const feedbackQuery = query(collection(db, 'feedback_submissions'), where('user_id', '==', user.uid))
      const snapshot = await getDocs(feedbackQuery)
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<FeedbackSubmission, 'id'>),
      }))

      items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setFeedback(items)
    } catch (err) {
      console.error('Failed to fetch feedback:', err)
    } finally {
      setLoadingFeedback(false)
    }
  }

  const fetchAIInsights = async (result: DiagnosticResult) => {
    setLoadingInsights(true)
    try {
      const token = await user?.getIdToken()
      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          score: result.score,
          dimensions: result.dimensions,
          industry: 'Technology',
        }),
      })

      if (!response.ok) throw new Error('Failed to get insights')
      const data = await response.json()
      setAiInsights(data.insights)
    } catch (err) {
      console.error('Failed to fetch AI insights:', err)
      setAiInsights('Unable to generate insights at this time. Please try again later.')
    } finally {
      setLoadingInsights(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (err) {
      console.error('Failed to sign out:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const latestResult = results[0]
  const latestScore = latestResult?.score ?? 0
  const averageFeedbackRating =
    feedback.length > 0
      ? (feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length).toFixed(1)
      : '0.0'
  const recommendRate =
    feedback.length > 0
      ? Math.round((feedback.filter((item) => item.would_recommend).length / feedback.length) * 100)
      : 0
  const totalRecommendations = latestResult?.recommendations?.length ?? 0
  const topDimension = latestResult
    ? Object.entries(latestResult.dimensions).sort((a, b) => b[1] - a[1])[0]
    : null
  const chartColors = ['#0f62fe', '#6366f1', '#ec4899', '#f59e0b', '#10b981']

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-8 rounded-3xl border border-border bg-card/85 px-5 py-4 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <span className="font-bold">IO</span>
              </div>
              <div>
                <div className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Client Portal</div>
                <div className="font-bold">IndusOpa Consulting</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
                {user.email}
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/40"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </nav>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-primary/10 via-card to-secondary/20 p-8 shadow-sm">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                Performance overview
              </div>

              <div className="max-w-2xl">
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Your consulting workspace</h1>
                <p className="mt-4 max-w-xl text-lg text-muted-foreground">
                  Review your latest readiness assessment, track feedback, and move straight into the next client
                  action with one clean workspace.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Activity className="h-4 w-4 text-primary" />
                    Latest score
                  </div>
                  <div className="mt-3 text-3xl font-bold">{latestScore}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{getScoreLabel(latestScore)}</div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquareMore className="h-4 w-4 text-primary" />
                    Feedback
                  </div>
                  <div className="mt-3 text-3xl font-bold">{feedback.length}</div>
                  <div className="mt-1 text-sm text-muted-foreground">submissions</div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 text-primary" />
                    Avg rating
                  </div>
                  <div className="mt-3 text-3xl font-bold">{averageFeedbackRating}</div>
                  <div className="mt-1 text-sm text-muted-foreground">out of 5</div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Actions
                  </div>
                  <div className="mt-3 text-3xl font-bold">{totalRecommendations}</div>
                  <div className="mt-1 text-sm text-muted-foreground">next steps</div>
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-primary">Quick insight</p>
                <h2 className="text-xl font-bold">What should happen next?</h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-border bg-secondary/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">Assessment status</span>
                  <span className="text-sm font-semibold">{results.length > 0 ? 'Active' : 'No data yet'}</span>
                </div>
                <div className="mt-3 text-2xl font-bold">
                  {latestResult ? latestResult.title : 'Complete your first assessment'}
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Use the dashboard to review readiness, capture feedback, and guide the next consulting step.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-secondary/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">Top dimension</span>
                  <Clock3 className="h-4 w-4 text-primary" />
                </div>
                <div className="mt-3 text-lg font-semibold">
                  {topDimension ? `${topDimension[0].charAt(0).toUpperCase()}${topDimension[0].slice(1)}` : 'No assessment yet'}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {topDimension ? `${topDimension[1]} points in your strongest area` : 'Run an assessment to unlock this view.'}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/diagnostics"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Take assessment
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/booking"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium transition-colors hover:bg-secondary/40"
                >
                  Book consult
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <Link
            href="/diagnostics"
            className="group rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
            <h3 className="mt-5 text-xl font-bold">Take Assessment</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Review transformation readiness and generate a new score for the dashboard.
            </p>
          </Link>

          <Link
            href="/booking"
            className="group rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/30">
                <Clock3 className="h-5 w-5 text-primary" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
            <h3 className="mt-5 text-xl font-bold">Book Consultation</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Schedule a live discussion with the consulting team and capture your next milestone.
            </p>
          </Link>

          <Link
            href="/feedback"
            className="group rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <MessageSquareMore className="h-5 w-5 text-primary" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
            <h3 className="mt-5 text-xl font-bold">Share Feedback</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Tell us what feels clear, what feels missing, and where the product can feel sharper.
            </p>
          </Link>

          {role === 'admin' ? (
            <Link
              href="/admin/feedback"
              className="group rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
              <h3 className="mt-5 text-xl font-bold">Admin feedback tools</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Open the AI summary and download the feedback export as CSV.
              </p>
            </Link>
          ) : (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/30">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <h3 className="mt-5 text-xl font-bold">Admin tools locked</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Only admin accounts can view the feedback summary and export the data.
              </p>
            </div>
          )}
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-primary">Latest assessment</p>
                <h2 className="mt-1 text-2xl font-bold">Consulting scorecard</h2>
              </div>
              <div className="rounded-2xl border border-border bg-secondary/5 px-4 py-3 text-right">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Current score</div>
                <div className="text-3xl font-bold text-primary">{latestScore}</div>
              </div>
            </div>

            {loadingResults ? (
              <div className="py-12 text-center text-sm text-muted-foreground">Loading assessments...</div>
            ) : results.length === 0 ? (
              <div className="rounded-2xl border border-border bg-secondary/10 p-8 text-center">
                <h3 className="text-xl font-bold">No assessments yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Take your first transformation readiness assessment to unlock charts and recommendations.
                </p>
                <Link
                  href="/diagnostics"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Start assessment
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid gap-8 lg:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background p-4">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Category scores
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart
                        data={Object.entries(latestResult.dimensions).map(([key, value]) => ({
                          name: key.charAt(0).toUpperCase() + key.slice(1),
                          value: typeof value === 'number' ? value : 0,
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="rounded-2xl border border-border bg-background p-4">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Score mix
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={Object.entries(latestResult.dimensions).map(([key, value]) => ({
                            name: key.charAt(0).toUpperCase() + key.slice(1),
                            value: typeof value === 'number' ? value : 0,
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={82}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartColors.map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {latestResult.recommendations?.length > 0 && (
                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <h3 className="text-lg font-bold">Recommendations</h3>
                    </div>
                    <div className="grid gap-3">
                      {latestResult.recommendations.map((rec, idx) => (
                        <div
                          key={idx}
                          className="flex gap-3 rounded-2xl border border-border bg-secondary/5 p-4"
                        >
                          <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {idx + 1}
                          </span>
                          <span className="text-sm leading-6 text-foreground">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.25em] text-primary">AI consultant insight</p>
                      <h3 className="text-xl font-bold">Readable next-step guidance</h3>
                    </div>
                  </div>

                  {aiInsights ? (
                    <div className="mt-5 whitespace-pre-wrap rounded-2xl border border-border bg-card p-5 text-sm leading-7 text-foreground">
                      {aiInsights}
                    </div>
                  ) : (
                    <button
                      onClick={() => fetchAIInsights(latestResult)}
                      disabled={loadingInsights}
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loadingInsights ? 'Generating insights...' : 'Generate AI insights'}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-primary">Feedback</p>
                  <h3 className="text-xl font-bold">Recent customer notes</h3>
                </div>
                <MessageSquareMore className="h-5 w-5 text-primary" />
              </div>

              {loadingFeedback ? (
                <div className="text-sm text-muted-foreground">Loading feedback...</div>
              ) : feedback.length === 0 ? (
                <div className="rounded-2xl border border-border bg-secondary/10 p-4 text-sm text-muted-foreground">
                  No feedback submitted yet. Your first submission will appear here.
                </div>
              ) : (
                <div className="space-y-3">
                  {feedback.slice(0, 4).map((item) => (
                    <div key={item.id} className="rounded-2xl border border-border bg-secondary/5 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-sm font-semibold">{item.category}</div>
                          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            {item.page_context}
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-primary">{item.rating}/5</div>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-bold">Feedback signals</h3>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-secondary/5 p-4">
                  <div className="text-sm text-muted-foreground">Recommend rate</div>
                  <div className="mt-2 text-3xl font-bold">{recommendRate}%</div>
                </div>
                <div className="rounded-2xl border border-border bg-secondary/5 p-4">
                  <div className="text-sm text-muted-foreground">Review load</div>
                  <div className="mt-2 text-3xl font-bold">{feedback.length}</div>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                This keeps feedback visible alongside the scorecard, so every next step feels connected to real user
                input.
              </p>
            </div>

            {results.length > 1 && (
              <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-primary">History</p>
                    <h3 className="text-xl font-bold">Past assessments</h3>
                  </div>
                  <Clock3 className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-3">
                  {results.slice(1).map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center justify-between rounded-2xl border border-border bg-secondary/5 p-4 transition-colors hover:bg-secondary/10"
                    >
                      <div>
                        <p className="font-medium">{result.title}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(result.created_at)}</p>
                      </div>
                      <div className="text-2xl font-bold text-primary">{result.score}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
