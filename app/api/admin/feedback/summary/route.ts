import { NextRequest, NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/server/admin'
import { listCollectionDocuments } from '@/lib/server/firebase-rest'

export const runtime = 'nodejs'

type FeedbackSubmission = {
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

function escapeText(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function buildPrompt(feedback: FeedbackSubmission[]) {
  const recentSamples = feedback
    .slice(0, 12)
    .map((item) => `- ${item.category} | ${item.rating}/5 | ${item.message}`)
    .join('\n')

  const total = feedback.length
  const averageRating =
    total > 0
      ? (feedback.reduce((sum, item) => sum + item.rating, 0) / total).toFixed(1)
      : '0.0'
  const recommendRate =
    total > 0
      ? Math.round((feedback.filter((item) => item.would_recommend).length / total) * 100)
      : 0

  return `You are an operations consultant summarizing user feedback for a consultancy website.

Create a concise executive summary that an admin can read quickly.

Totals:
- Feedback entries: ${total}
- Average rating: ${averageRating}/5
- Recommend rate: ${recommendRate}%

Recent feedback:
${recentSamples || '- No feedback yet'}

Write in this structure:
Executive Summary:
Strengths:
Frictions:
Recommended Next Actions:

Keep it practical, specific, and short.`
}

async function getAiSummary(prompt: string) {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    return null
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 700,
    }),
  })

  if (!response.ok) {
    return null
  }

  const data = await response.json()
  return data?.choices?.[0]?.message?.content ?? null
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await requireAdmin(authHeader.slice(7))

    const feedback = (await listCollectionDocuments('feedback_submissions')) as FeedbackSubmission[]

    const sortedFeedback = [...feedback].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    const totalFeedback = sortedFeedback.length
    const averageRating =
      totalFeedback > 0
        ? Number(
            (
              sortedFeedback.reduce((sum, item) => sum + Number(item.rating || 0), 0) /
              totalFeedback
            ).toFixed(1)
          )
        : 0
    const recommendCount = sortedFeedback.filter((item) => item.would_recommend).length

    const categoryCounts = sortedFeedback.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {})

    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }))

    const summary =
      (await getAiSummary(buildPrompt(sortedFeedback))) ||
      `Feedback snapshot: ${totalFeedback} submissions, average rating ${averageRating}/5, and ${recommendCount} recommendations. The most common topics are ${topCategories
        .map((item) => item.category)
        .join(', ') || 'none yet'}.`

    return NextResponse.json({
      summary,
      stats: {
        totalFeedback,
        averageRating,
        recommendCount,
        recommendRate: totalFeedback > 0 ? Math.round((recommendCount / totalFeedback) * 100) : 0,
        topCategories,
      },
      allFeedback: sortedFeedback,
      recentFeedback: sortedFeedback.slice(0, 25).map((item) => ({
        ...item,
        message: escapeText(item.message),
      })),
    })
  } catch (error) {
    console.error('Feedback summary error:', error)

    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ error: 'Failed to build feedback summary' }, { status: 500 })
  }
}
