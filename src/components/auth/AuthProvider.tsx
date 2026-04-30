'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getWorkerProfile } from '@/lib/services'
import type { AuthContextType, Worker } from '@/types'
import { Clock, XCircle, Ban, Loader2 } from 'lucide-react'

const AuthContext = createContext<AuthContextType>({
  user: null as never,
  session: null as never,
  workerProfile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [session, setSession] = useState<any>(null)
  const [workerProfile, setWorkerProfile] = useState<Worker | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = useCallback(async (userId?: string) => {
    const uid = userId || user?.id
    if (!uid) return
    try {
      const profile = await getWorkerProfile(uid)
      setWorkerProfile(profile)
    } catch (err) {
      console.error('Error fetching worker profile:', err)
    }
  }, [user?.id])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await refreshProfile(session.user.id)
      } else {
        setWorkerProfile(null)
      }
      setLoading(false)
    })

    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) {
        await refreshProfile(s.user.id)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [refreshProfile])

  // Redirect unauthenticated users to /login (except on login/register pages)
  const publicPaths = ['/login', '/register']
  const isPublicPath = publicPaths.includes(pathname)

  useEffect(() => {
    if (!loading && !session && !isPublicPath) {
      router.replace('/login')
    }
  }, [loading, session, isPublicPath, router])

  // Redirect authenticated users away from login/register
  useEffect(() => {
    if (!loading && session && isPublicPath) {
      if (workerProfile?.status === 'active') {
        router.replace('/dashboard')
      }
    }
  }, [loading, session, isPublicPath, workerProfile, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setWorkerProfile(null)
    router.replace('/login')
  }

  // Show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // No session - redirect handled by useEffect, show nothing briefly
  if (!session) {
    if (isPublicPath) {
      return <>{children}</>
    }
    return null
  }

  // Session exists but no worker profile yet (profile table may not be created yet)
  if (session && !workerProfile && !isPublicPath) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Setting up your account...</p>
        </div>
      </div>
    )
  }

  // Public paths - just render children
  if (isPublicPath) {
    return <>{children}</>
  }

  // Worker verification flow
  if (workerProfile?.status === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          <div className="h-20 w-20 rounded-3xl bg-amber-100 flex items-center justify-center mx-auto mb-6">
            <Clock className="h-10 w-10 text-amber-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground mb-2">Verification Pending</h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Your account is currently under review. Our team will verify your documents and approve your account within <strong>24-48 hours</strong>.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-xs text-amber-700">
              📋 We&apos;re verifying your CNIC and work details. You&apos;ll receive a notification once your account is approved.
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-muted-foreground hover:text-foreground font-medium"
          >
            Sign out
          </button>
        </div>
      </div>
    )
  }

  if (workerProfile?.status === 'rejected') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          <div className="h-20 w-20 rounded-3xl bg-red-100 flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground mb-2">Account Rejected</h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Unfortunately, your account verification was not successful. This may be due to incomplete or invalid information.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-xs text-red-700">
              ❌ Please contact support or try registering again with correct information.
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-muted-foreground hover:text-foreground font-medium"
          >
            Sign out
          </button>
        </div>
      </div>
    )
  }

  if (workerProfile?.status === 'suspended') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          <div className="h-20 w-20 rounded-3xl bg-gray-200 flex items-center justify-center mx-auto mb-6">
            <Ban className="h-10 w-10 text-gray-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground mb-2">Account Suspended</h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Your account has been temporarily suspended due to a policy violation. Please contact our support team for assistance.
          </p>
          <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-600">
              🚫 Contact support at help@mazdoorping.pk to resolve this issue.
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-muted-foreground hover:text-foreground font-medium"
          >
            Sign out
          </button>
        </div>
      </div>
    )
  }

  // Active worker - render children
  return (
    <AuthContext.Provider value={{ user, session, workerProfile, loading, signOut: handleSignOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
