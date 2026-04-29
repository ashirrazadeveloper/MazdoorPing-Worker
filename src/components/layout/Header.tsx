'use client'

import { Bell, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { mockNotifications } from '@/data/mock'

interface HeaderProps {
  title: string
  showBack?: boolean
  showNotifications?: boolean
}

export default function Header({ title, showBack = false, showNotifications = false }: HeaderProps) {
  const router = useRouter()
  const unreadCount = mockNotifications.filter(n => !n.is_read).length

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="p-1 -ml-1 rounded-lg hover:bg-muted transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <h1 className="text-lg font-bold text-foreground truncate">{title}</h1>
        </div>
        {showNotifications && (
          <button
            onClick={() => router.push('/notifications')}
            className="relative p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  )
}
