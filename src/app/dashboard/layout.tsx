'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import BottomNav from '@/components/layout/BottomNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const hideNav = pathname === '/dashboard/sos'

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className={hideNav ? 'flex-1 pb-4' : 'flex-1 pb-20'}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  )
}
