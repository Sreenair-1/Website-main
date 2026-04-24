import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { buildBookingDate } from '@/lib/booking'
import { createBookingRecord, verifyFirebaseIdToken } from '@/lib/server/firebase-rest'

export const runtime = 'nodejs'

const bookingSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().max(40).optional().default(''),
  company: z.string().trim().max(120).optional().default(''),
  topic: z.string().trim().min(1).max(120),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().trim().min(1).max(20),
  booking_date: z.string().datetime().optional(),
  notes: z.string().trim().max(2000).optional().default(''),
})

export async function POST(request: NextRequest) {
  try {
    const body = bookingSchema.parse(await request.json())

    const bookingDate =
      body.booking_date ||
      buildBookingDate(body.date, body.time)?.toISOString()

    if (!bookingDate) {
      return NextResponse.json({ error: 'Please choose a valid date and time' }, { status: 400 })
    }

    const authHeader = request.headers.get('authorization')
    let userId: string | null = null
    let userEmail = body.email

    if (authHeader?.startsWith('Bearer ')) {
      try {
        const identity = await verifyFirebaseIdToken(authHeader.slice(7))
        userId = identity.uid
        userEmail = identity.email ?? body.email
      } catch (error) {
        console.warn('Booking auth token could not be verified:', error)
      }
    }

    const result = await createBookingRecord({
      userId,
      userEmail,
      name: body.name,
      phone: body.phone,
      company: body.company,
      topic: body.topic,
      bookingDate,
      durationMinutes: 60,
      notes: `Company: ${body.company}\nPhone: ${body.phone}\n\n${body.notes}`.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ id: result.name }, { status: 201 })
  } catch (error) {
    console.error('Booking API error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid booking request' }, { status: 400 })
    }

    const message = error instanceof Error ? error.message : 'Failed to save booking'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
