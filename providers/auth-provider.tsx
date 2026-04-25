'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import type { AppRole } from '@/lib/server/rbac'
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'

interface AuthContextType {
  user: User | null
  role: AppRole
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<AppRole>('guest')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (!firebaseUser) {
        setRole('guest')
        setLoading(false)
        return
      }

      try {
        const token = await firebaseUser.getIdToken()
        const response = await fetch('/api/session', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          setRole('client')
          return
        }

        const data = (await response.json()) as { role?: AppRole }
        setRole(data.role ?? 'client')
      } catch (error) {
        console.error('Failed to load session role:', error)
        setRole('client')
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    if (!result.user) throw new Error('Sign up failed')
  }

  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    if (!result.user) throw new Error('Sign in failed')
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
    setRole('guest')
  }

  return <AuthContext.Provider value={{ user, role, loading, signUp, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
