import { requireRole } from '@/lib/server/rbac'

export async function requireAdmin(idToken: string) {
  return requireRole(idToken, ['admin'])
}
