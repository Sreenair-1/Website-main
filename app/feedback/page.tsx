'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'
import { Star, MessageSquareMore, Lightbulb, TrendingUp } from 'lucide-react'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useAuth } from '@/providers/auth-provider'
import { db } from '@/lib/firebase'

const FEEDBACK_CATEGORIES = [
  'Website experience',
  'Assessment flow',
  'Dashboard',
  'Booking',
  'Case studies',
  'Support',
] as const

interface FeedbackItem {
  id: string
  user_id: string
  email: string
  category: string
  rating: number
  message: string
  page_context: string
  would_recommend: boolean
  created_at: string
}

export default function FeedbackPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [category, setCategory] = useState<(typeof FEEDBACK_CATEGORIES)[number]>('Website experience')
  const [rating, setRating] = useState(4)
  const [message, setMessage] = useState('')
  const [wouldRecommend, setWouldRecommend] = useState(true)
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [loadingFeedback, setLoadingFeedback] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    if (user) {
      fetchFeedback()
    }
  }, [user, loading, router])

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
        ...(doc.data() as Omit<FeedbackItem, 'id'>),
      }))

      items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setFeedback(items)
    } catch (err) {
      console.error('Failed to load feedback:', err)
    } finally {
      setLoadingFeedback(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!user) return

    if (message.trim().length < 10) {
      setError('Please add a little more detail so we can act on your feedback.')
      return
    }

    setSaving(true)
    try {
      await addDoc(collection(db, 'feedback_submissions'), {
        user_id: user.uid,
        email: user.email || '',
        category,
        rating,
        message: message.trim(),
        page_context: 'dashboard',
        would_recommend: wouldRecommend,
        created_at: new Date().toISOString(),
      })

      setMessage('')
      setRating(4)
      setCategory('Website experience')
      setWouldRecommend(true)
      setSuccess('Thanks, your feedback was saved.')
      await fetchFeedback()
    } catch (err) {
      console.error('Failed to save feedback:', err)
      setError(err instanceof Error ? err.message : 'Failed to save feedback')
    } finally {
      setSaving(false)
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

  const averageRating =
    feedback.length > 0
      ? (feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length).toFixed(1)
      : '0.0'

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
              <MessageSquareMore className="h-4 w-4 text-primary" />
              Version 1.1 user feedback system
            </div>

            <div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Tell us what to improve</h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Your feedback helps shape the next iteration of the consultancy experience. Rate the product,
                share what feels missing, and leave concrete suggestions.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-5">
                <Lightbulb className="h-6 w-6 text-primary" />
                <p className="mt-3 text-sm text-muted-foreground">Capture suggestions while the experience is fresh.</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <TrendingUp className="h-6 w-6 text-primary" />
                <p className="mt-3 text-sm text-muted-foreground">Track satisfaction and spot patterns over time.</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <Star className="h-6 w-6 text-primary" />
                <p className="mt-3 text-sm text-muted-foreground">Keep the product opinionated and user-led.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium">What are you reviewing?</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as (typeof FEEDBACK_CATEGORIES)[number])}
                    className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {FEEDBACK_CATEGORIES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium">Overall rating</label>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                          rating === value
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background hover:bg-secondary/40'
                        }`}
                      >
                        <Star className="h-4 w-4" />
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Your feedback</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    placeholder="Tell us what worked well and what we should improve next."
                    className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <label className="flex items-center gap-3 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={wouldRecommend}
                    onChange={(e) => setWouldRecommend(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  I would recommend this experience to someone else
                </label>

                {error && (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="rounded-lg border border-primary/20 bg-primary/10 p-4 text-sm text-primary">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? 'Saving feedback...' : 'Submit feedback'}
                </button>
              </div>
            </form>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-secondary/20 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-primary">Feedback summary</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="text-sm text-muted-foreground">Average rating</div>
                  <div className="mt-2 text-3xl font-bold">{averageRating}</div>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="text-sm text-muted-foreground">Total submissions</div>
                  <div className="mt-2 text-3xl font-bold">{feedback.length}</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Version 1.1 turns feedback into a simple, repeatable loop that you can act on.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Your recent feedback</h2>
                <Link href="/dashboard" className="text-sm text-primary hover:underline">
                  Back to dashboard
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                {loadingFeedback ? (
                  <div className="text-sm text-muted-foreground">Loading feedback...</div>
                ) : feedback.length === 0 ? (
                  <div className="rounded-2xl border border-border bg-secondary/10 p-4 text-sm text-muted-foreground">
                    No feedback submitted yet. Your first entry will appear here.
                  </div>
                ) : (
                  feedback.slice(0, 5).map((item) => (
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
      </main>

      <Footer />
    </div>
  )
}
