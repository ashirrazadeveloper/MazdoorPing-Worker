'use client'

import { Bell, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  title: string
  showBack?: boolean
  showNotifications?: boolean
}

export default function Header({ title, showBack = false, showNotifications = false }: HeaderProps) {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-40 glass border-b border-border/50">
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-xl hover:bg-muted/80 transition-colors active:scale-95"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <h1 className="text-lg font-bold text-foreground truncate">{title}</h1>
        </div>
        {showNotifications && (
          <button
            onClick={() => router.push('/dashboard/notifications')}
            className="relative p-2 -mr-2 rounded-xl hover:bg-muted/80 transition-colors active:scale-95"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
        )}
      </div>
    </header>
  )
}
