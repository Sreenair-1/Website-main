import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { getAIInsights } from '@/lib/groq'
import { verifyFirebaseIdToken } from '@/lib/server/firebase-rest'

export const runtime = 'nodejs'

const aiInsightsSchema = z.object({
  score: z.number().min(0).max(100),
  dimensions: z.record(z.number().min(0).max(100)),
  industry: z.string().trim().max(120).optional(),
  company_name: z.string().trim().max(120).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await verifyFirebaseIdToken(authHeader.slice(7))

    const body = aiInsightsSchema.parse(await request.json())
    const insights = await getAIInsights(body)

    return NextResponse.json({ insights })
  } catch (error) {
    console.error('API error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid insight request' }, { status: 400 })
    }

    if (error instanceof Error && error.message.toLowerCase().includes('auth token')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 })
  }
}
