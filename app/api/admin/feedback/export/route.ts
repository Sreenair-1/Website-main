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

function csvEscape(value: unknown) {
  const text = String(value ?? '')
  return `"${text.replace(/"/g, '""')}"`
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

    const rows = [
      [
        'id',
        'created_at',
        'email',
        'category',
        'rating',
        'would_recommend',
        'page_context',
        'message',
      ],
      ...sortedFeedback.map((item) => [
        item.id,
        item.created_at,
        item.email,
        item.category,
        item.rating,
        item.would_recommend ? 'yes' : 'no',
        item.page_context,
        item.message,
      ]),
    ]

    const csv = rows.map((row) => row.map(csvEscape).join(',')).join('\n')

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="feedback-submissions.csv"',
      },
    })
  } catch (error) {
    console.error('Feedback export error:', error)

    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ error: 'Failed to export feedback' }, { status: 500 })
  }
}
