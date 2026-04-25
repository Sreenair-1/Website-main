import { createSign } from 'crypto'

type BookingSubmission = {
  userId: string | null
  userEmail: string
  name: string
  phone: string
  company: string
  topic: string
  bookingDate: string
  durationMinutes: number
  notes: string
  status: 'pending'
  createdAt: string
}

type FirebaseIdentityLookupResponse = {
  users?: Array<{
    localId?: string
    email?: string
  }>
}

type FirestoreDocumentResponse = {
  documents?: Array<{
    name?: string
    fields?: Record<string, unknown>
  }>
  nextPageToken?: string
}

let cachedAccessToken: { token: string; expiresAt: number } | null = null

function getProjectId() {
  return process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
}

function getServiceAccountConfig() {
  const clientEmail = process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY
  const projectId = getProjectId()

  if (!clientEmail || !privateKey || !projectId) {
    throw new Error('Firebase service account is not configured')
  }

  return {
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, '\n'),
    projectId,
  }
}

function base64UrlEncode(input: string | Buffer) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

async function getServiceAccountAccessToken() {
  const now = Math.floor(Date.now() / 1000)

  if (cachedAccessToken && cachedAccessToken.expiresAt > now + 60) {
    return cachedAccessToken.token
  }

  const { clientEmail, privateKey } = getServiceAccountConfig()
  const header = base64UrlEncode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = base64UrlEncode(
    JSON.stringify({
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/datastore',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    })
  )

  const signer = createSign('RSA-SHA256')
  signer.update(`${header}.${payload}`)
  signer.end()
  const signature = base64UrlEncode(signer.sign(privateKey))
  const assertion = `${header}.${payload}.${signature}`

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  })

  if (!response.ok) {
    throw new Error('Unable to authenticate with Firebase service account')
  }

  const data = await response.json()
  const token = data?.access_token
  const expiresIn = Number(data?.expires_in ?? 3600)

  if (!token) {
    throw new Error('Firebase service account token was not returned')
  }

  cachedAccessToken = {
    token,
    expiresAt: now + expiresIn,
  }

  return token as string
}

function toFirestoreValue(value: unknown) {
  if (value === null || value === undefined) {
    return { nullValue: null }
  }

  if (typeof value === 'string') {
    return { stringValue: value }
  }

  if (typeof value === 'number') {
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value }
  }

  if (typeof value === 'boolean') {
    return { booleanValue: value }
  }

  if (value instanceof Date) {
    return { timestampValue: value.toISOString() }
  }

  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map((item) => toFirestoreValue(item)),
      },
    }
  }

  if (typeof value === 'object') {
    return {
      mapValue: {
        fields: Object.fromEntries(
          Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
            key,
            toFirestoreValue(entry),
          ])
        ),
      },
    }
  }

  return { stringValue: String(value) }
}

function fromFirestoreValue(value: any): unknown {
  if (value == null || typeof value !== 'object') {
    return value
  }

  if ('stringValue' in value) return value.stringValue
  if ('integerValue' in value) return Number(value.integerValue)
  if ('doubleValue' in value) return Number(value.doubleValue)
  if ('booleanValue' in value) return Boolean(value.booleanValue)
  if ('timestampValue' in value) return value.timestampValue
  if ('nullValue' in value) return null

  if ('arrayValue' in value) {
    return (value.arrayValue?.values || []).map((entry: any) => fromFirestoreValue(entry))
  }

  if ('mapValue' in value) {
    const fields = value.mapValue?.fields || {}
    return Object.fromEntries(
      Object.entries(fields).map(([key, entry]) => [key, fromFirestoreValue(entry)])
    )
  }

  return value
}

function fromFirestoreDocument(doc: { name?: string; fields?: Record<string, unknown> }) {
  const path = doc.name || ''
  const id = path.split('/').pop() || ''
  const fields = doc.fields || {}

  return {
    id,
    ...Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [key, fromFirestoreValue(value)])
    ),
  }
}

export async function verifyFirebaseIdToken(idToken: string) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  if (!apiKey) {
    throw new Error('Firebase API key is not configured')
  }

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
  })

  if (!response.ok) {
    throw new Error('Invalid Firebase auth token')
  }

  const data = (await response.json()) as FirebaseIdentityLookupResponse
  const user = data.users?.[0]

  if (!user?.localId) {
    throw new Error('Invalid Firebase auth token')
  }

  return {
    uid: user.localId,
    email: user.email ?? null,
  }
}

export async function createBookingRecord(input: BookingSubmission) {
  const { projectId } = getServiceAccountConfig()
  const accessToken = await getServiceAccountAccessToken()

  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/bookings`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          user_id: toFirestoreValue(input.userId),
          user_email: toFirestoreValue(input.userEmail),
          name: toFirestoreValue(input.name),
          phone: toFirestoreValue(input.phone),
          company: toFirestoreValue(input.company),
          topic: toFirestoreValue(input.topic),
          booking_date: toFirestoreValue(input.bookingDate),
          duration_minutes: toFirestoreValue(input.durationMinutes),
          notes: toFirestoreValue(input.notes),
          status: toFirestoreValue(input.status),
          created_at: toFirestoreValue(input.createdAt),
        },
      }),
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to save booking: ${errorText}`)
  }

  return response.json()
}

export async function listCollectionDocuments(collectionId: string) {
  const { projectId } = getServiceAccountConfig()
  const accessToken = await getServiceAccountAccessToken()
  const documents: Array<Record<string, unknown> & { id: string }> = []
  let pageToken: string | undefined

  do {
    const url = new URL(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionId}`
    )
    url.searchParams.set('pageSize', '1000')
    if (pageToken) {
      url.searchParams.set('pageToken', pageToken)
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to list ${collectionId}: ${errorText}`)
    }

    const payload = (await response.json()) as FirestoreDocumentResponse
    documents.push(...(payload.documents || []).map((doc) => fromFirestoreDocument(doc)))
    pageToken = payload.nextPageToken
  } while (pageToken)

  return documents
}
