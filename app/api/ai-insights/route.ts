import { NextRequest, NextResponse } from 'next/server'
import { getAIInsights } from '@/lib/groq'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const insights = await getAIInsights({
      score: body.score,
      dimensions: body.dimensions,
      industry: body.industry,
      company_name: body.company_name,
    })

    return NextResponse.json({ insights })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    )
  }
}
