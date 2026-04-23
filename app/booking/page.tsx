'use client'

import { useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { db } from '@/lib/firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import Link from 'next/link'
import { Calendar, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react'

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

function buildBookingDate(date: string, time: string) {
  const [timePart, meridiem] = time.split(' ')
  const [hoursRaw, minutesRaw] = timePart.split(':')
  let hours = Number(hoursRaw)
  const minutes = Number(minutesRaw)

  if (Number.isNaN(hours) || Number.isNaN(minutes) || !meridiem) {
    return null
  }

  if (meridiem === 'PM' && hours !== 12) {
    hours += 12
  }

  if (meridiem === 'AM' && hours === 12) {
    hours = 0
  }

  const [year, month, day] = date.split('-').map(Number)
  if ([year, month, day].some((part) => Number.isNaN(part))) {
    return null
  }

  return new Date(year, month - 1, day, hours, minutes, 0, 0)
}

export default function BookingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
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
    setFormData(prev => ({ ...prev, [name]: value }))
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

      const data = {
        user_id: user?.uid || null,
        user_email: formData.email,
        name: formData.name,
        phone: formData.phone,
        company: formData.company,
        topic: formData.topic,
        booking_date: bookingDate.toISOString(),
        duration_minutes: 60,
        notes: `Company: ${formData.company}\nPhone: ${formData.phone}\n\n${formData.notes}`,
        status: 'pending',
        created_at: serverTimestamp(),
      }

      await addDoc(collection(db, 'bookings'), data)

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to book consultation')
      console.error('Booking error:', err)
    } finally {
      setSaving(false)
    }
  }

  // Get minimum date (today or tomorrow if past booking hours)
  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-2xl mx-auto bg-card rounded-lg border border-border p-12 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Booking Confirmed!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Thank you for scheduling a consultation with us. We&apos;ve received your booking request and will confirm the appointment within 24 hours.
          </p>
          <div className="bg-secondary/5 rounded-lg p-6 mb-8 text-left border border-border">
            <h3 className="font-semibold mb-4">Booking Details</h3>
            <div className="space-y-2 text-muted-foreground">
              <p><span className="font-medium text-foreground">Topic:</span> {formData.topic}</p>
              <p><span className="font-medium text-foreground">Date:</span> {new Date(formData.date).toLocaleDateString()}</p>
              <p><span className="font-medium text-foreground">Time:</span> {formData.time}</p>
              <p><span className="font-medium text-foreground">Email:</span> {formData.email}</p>
            </div>
          </div>
          <p className="text-muted-foreground mb-8">
            We&apos;ll send you a confirmation email with meeting details and a calendar invite.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="border border-border text-foreground px-6 py-2 rounded-md hover:bg-secondary/5 transition-colors"
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
      <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-primary hover:underline text-sm mb-4 inline-block">
            ← Back Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">Schedule a Consultation</h1>
          <p className="text-muted-foreground">
            Book a 60-minute consultation with our design thinking experts to discuss your transformation journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border p-8 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Your Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full px-4 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Company Name
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Your Company"
              className="w-full px-4 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Consultation Topic *
            </label>
            <select
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select a topic</option>
              {CONSULTATION_TOPICS.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Preferred Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={getMinDate()}
              className="w-full px-4 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Preferred Time (EST) *
            </label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select a time</option>
              {TIME_SLOTS.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Tell us about your organization and what you'd like to discuss"
              rows={4}
              className="w-full px-4 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
