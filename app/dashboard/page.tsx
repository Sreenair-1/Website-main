'use client'

import { useAuth } from '@/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import Link from 'next/link'
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
import { LogOut, MessageSquareMore, Star, Zap } from 'lucide-react'

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
  created_at: string
}

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
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

      const resultsQuery = query(
        collection(db, 'diagnostic_results'),
        where('user_id', '==', user.uid)
      )

      const snapshot = await getDocs(resultsQuery)
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<DiagnosticResult, 'id'>),
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

      const feedbackQuery = query(
        collection(db, 'feedback_submissions'),
        where('user_id', '==', user.uid)
      )

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
      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
  const COLORS = ['#0f62fe', '#6366f1', '#ec4899', '#f59e0b', '#10b981']

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">IO</span>
            </div>
            <span className="font-bold">IndusOpa</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Track your transformation journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link
            href="/diagnostics"
            className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-8 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold mb-2">Take Assessment</h3>
            <p className="text-muted-foreground mb-4">
              Evaluate your organization&apos;s transformation readiness
            </p>
            <div className="text-primary font-medium">Start →</div>
          </Link>

          <Link
            href="/booking"
            className="bg-gradient-to-br from-secondary/10 to-accent/10 border border-secondary/20 rounded-lg p-8 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold mb-2">Book Consultation</h3>
            <p className="text-muted-foreground mb-4">
              Schedule a consultation with our experts
            </p>
            <div className="text-accent font-medium">Schedule →</div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 mb-12">
          <Link
            href="/feedback"
            className="rounded-lg border border-border bg-card p-8 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquareMore className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Version 1.1</p>
                <h3 className="text-xl font-bold">Share feedback</h3>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              Tell us what feels clear, what feels missing, and where we should improve the experience.
            </p>
            <div className="text-primary font-medium">Open feedback form →</div>
          </Link>

          <div className="rounded-lg border border-border bg-card p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Feedback status</p>
                <h3 className="text-xl font-bold">Your voice in the product</h3>
              </div>
              <Star className="h-5 w-5 text-primary" />
            </div>
            <p className="text-muted-foreground">
              Version 1.1 adds a direct feedback loop so every user can rate the experience and leave notes
              for future improvements.
            </p>
          </div>
        </div>

        {loadingResults ? (
          <div className="text-center py-12 text-muted-foreground">Loading assessments...</div>
        ) : results.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <h3 className="text-xl font-bold mb-2">No Assessments Yet</h3>
            <p className="text-muted-foreground mb-6">
              Take your first transformation readiness assessment to get started
            </p>
            <Link
              href="/diagnostics"
              className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Start Assessment
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Your Assessments</h2>

            {latestResult && (
              <div className="bg-card rounded-lg border border-border p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{latestResult.title}</h3>
                    <p className="text-muted-foreground">
                      {new Date(latestResult.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-5xl font-bold text-primary">{latestResult.score}</div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="font-bold mb-4">Category Scores</h4>
                    <ResponsiveContainer width="100%" height={300}>
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
                        <Bar dataKey="value" fill="var(--color-primary)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h4 className="font-bold mb-4">Score Distribution</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={Object.entries(latestResult.dimensions).map(([key, value]) => ({
                            name: key.charAt(0).toUpperCase() + key.slice(1),
                            value: typeof value === 'number' ? value : 0,
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {COLORS.map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {latestResult.recommendations && latestResult.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-bold mb-4">Recommendations</h4>
                    <div className="space-y-2">
                      {latestResult.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex gap-2 p-3 bg-secondary/5 rounded border border-border">
                          <span className="text-primary font-bold flex-shrink-0">✓</span>
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 p-6 border-2 border-primary/30 rounded-lg bg-gradient-to-br from-primary/5 to-transparent">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="text-lg font-bold">AI Consultant Insight</h4>
                  </div>

                  {aiInsights ? (
                    <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap text-sm leading-relaxed font-mono">
                      {aiInsights}
                    </div>
                  ) : (
                    <button
                      onClick={() => fetchAIInsights(latestResult)}
                      disabled={loadingInsights}
                      className="w-full bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingInsights ? 'Generating insights...' : 'Generate AI-Powered Insights'}
                    </button>
                  )}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Recent Feedback</h3>
                <Link href="/feedback" className="text-sm text-primary hover:underline">
                  Leave feedback
                </Link>
              </div>
              {loadingFeedback ? (
                <div className="text-sm text-muted-foreground">Loading feedback...</div>
              ) : feedback.length === 0 ? (
                <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
                  No feedback submitted yet. Use the new feedback form to tell us what to improve.
                </div>
              ) : (
                <div className="space-y-3">
                  {feedback.slice(0, 3).map((item) => (
                    <div key={item.id} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold capitalize">{item.category}</span>
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">
                            {item.page_context}
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-primary">{item.rating}/5</div>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {results.length > 1 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Past Assessments</h3>
                <div className="space-y-3">
                  {results.slice(1).map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div>
                        <p className="font-medium">{result.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(result.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-primary">{result.score}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
