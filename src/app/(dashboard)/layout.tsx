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
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const hideNav = pathname === '/sos'

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className={`flex-1 pb-${hideNav ? '4' : '16'}`}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  )
}
