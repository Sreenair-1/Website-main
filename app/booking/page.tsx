'use client'

import { useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import Link from 'next/link'
import { Calendar, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { buildBookingDate } from '@/lib/booking'

const CONSULTATION_TOPICS = [
  'Design Thinking Workshop',
  'Strategy Assessment',
  'Team Training',
  'Process Improvement',
  'Innovation Challenge',
  'Digital Transformation',
  'Other',
]

const TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
]

export default function BookingPage() {
  const { user, loading } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    company: '',
    topic: '',
    date: '',
    time: '',
    notes: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.email || !formData.topic || !formData.date || !formData.time) {
      setError('Please fill in all required fields')
      return
    }

    setSaving(true)

    try {
      const bookingDate = buildBookingDate(formData.date, formData.time)
      if (!bookingDate || Number.isNaN(bookingDate.getTime())) {
        throw new Error('Please choose a valid date and time')
      }

      const authToken = user ? await user.getIdToken() : null
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          topic: formData.topic,
          date: formData.date,
          time: formData.time,
          notes: formData.notes,
          booking_date: bookingDate.toISOString(),
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error || 'Failed to book consultation')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to book consultation')
      console.error('Booking error:', err)
    } finally {
      setSaving(false)
    }
  }

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-12 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Success</span>
            </div>
            <h1 className="mb-4 text-4xl font-bold">Booking Confirmed!</h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Thank you for scheduling a consultation with us. We&apos;ve received your booking request and will confirm
              the appointment within 24 hours.
            </p>
            <div className="mb-8 rounded-lg border border-border bg-secondary/5 p-6 text-left">
              <h3 className="mb-4 font-semibold">Booking Details</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Topic:</span> {formData.topic}
                </p>
                <p>
                  <span className="font-medium text-foreground">Date:</span> {new Date(formData.date).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium text-foreground">Time:</span> {formData.time}
                </p>
                <p>
                  <span className="font-medium text-foreground">Email:</span> {formData.email}
                </p>
              </div>
            </div>
            <p className="mb-8 text-muted-foreground">
              We&apos;ll send you a confirmation email with meeting details and a calendar invite.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/dashboard"
                className="rounded-md bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/"
                className="rounded-md border border-border px-6 py-2 text-foreground transition-colors hover:bg-secondary/5"
              >
                Back Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <Link href="/" className="mb-4 inline-block text-sm text-primary hover:underline">
              Back Home
            </Link>
            <h1 className="mb-2 text-4xl font-bold">Schedule a Consultation</h1>
            <p className="text-muted-foreground">
              Book a 60-minute consultation with our design thinking experts to discuss your transformation journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-border bg-card p-8">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                <User className="mr-2 inline h-4 w-4" />
                Your Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full rounded-md border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                <Mail className="mr-2 inline h-4 w-4" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full rounded-md border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                <Phone className="mr-2 inline h-4 w-4" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-md border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Company Name</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your Company"
                className="w-full rounded-md border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Consultation Topic *</label>
              <select
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className="w-full rounded-md border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select a topic</option>
                {CONSULTATION_TOPICS.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                <Calendar className="mr-2 inline h-4 w-4" />
                Preferred Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={getMinDate()}
                className="w-full rounded-md border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                <Clock className="mr-2 inline h-4 w-4" />
                Preferred Time (EST) *
              </label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full rounded-md border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select a time</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                <MessageSquare className="mr-2 inline h-4 w-4" />
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Tell us about your organization and what you'd like to discuss"
                rows={4}
                className="w-full resize-none rounded-md border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-md bg-primary py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Booking...' : 'Schedule Consultation'}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              * Required fields. We&apos;ll confirm your appointment within 24 hours.
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}
