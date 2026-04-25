import { NextRequest, NextResponse } from 'next/server'

import { resolveIdentityRole } from '@/lib/server/rbac'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const identity = await resolveIdentityRole(authHeader.slice(7))

    return NextResponse.json({
      uid: identity.uid,
      email: identity.email,
      role: identity.role,
    })
  } catch (error) {
    console.error('Session lookup error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
