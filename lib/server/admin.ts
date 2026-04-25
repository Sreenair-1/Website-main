import { verifyFirebaseIdToken } from '@/lib/server/firebase-rest'

function parseCsv(value: string | undefined) {
  return (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function isAdminIdentity(identity: { uid: string; email: string | null }) {
  const adminEmails = parseCsv(process.env.ADMIN_EMAILS)
  const adminUids = parseCsv(process.env.ADMIN_UIDS)

  return (
    (identity.email && adminEmails.includes(identity.email)) ||
    adminUids.includes(identity.uid)
  )
}

export async function requireAdmin(idToken: string) {
  const identity = await verifyFirebaseIdToken(idToken)

  if (!isAdminIdentity(identity)) {
    throw new Error('Forbidden')
  }

  return identity
}
