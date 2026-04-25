import { verifyFirebaseIdToken } from '@/lib/server/firebase-rest'

export type AppRole = 'guest' | 'client' | 'consultant' | 'admin'

type Identity = {
  uid: string
  email: string | null
}

function parseCsv(value: string | undefined) {
  return (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function getRoleForIdentity(identity: Identity): Exclude<AppRole, 'guest'> {
  const adminEmails = parseCsv(process.env.ADMIN_EMAILS)
  const adminUids = parseCsv(process.env.ADMIN_UIDS)
  const consultantEmails = parseCsv(process.env.CONSULTANT_EMAILS)
  const consultantUids = parseCsv(process.env.CONSULTANT_UIDS)

  if ((identity.email && adminEmails.includes(identity.email)) || adminUids.includes(identity.uid)) {
    return 'admin'
  }

  if (
    (identity.email && consultantEmails.includes(identity.email)) ||
    consultantUids.includes(identity.uid)
  ) {
    return 'consultant'
  }

  return 'client'
}

export async function resolveIdentityRole(idToken: string) {
  const identity = await verifyFirebaseIdToken(idToken)
  return {
    ...identity,
    role: getRoleForIdentity(identity),
  }
}

export async function requireRole(idToken: string, allowedRoles: AppRole[]) {
  const identity = await resolveIdentityRole(idToken)

  if (!allowedRoles.includes(identity.role)) {
    throw new Error('Forbidden')
  }

  return identity
}
