'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/Header'
import { mockNotifications } from '@/data/mock'
import { formatTimeAgo } from '@/lib/utils'
import { CheckCheck, Briefcase, CheckCircle, XCircle, AlertTriangle, Info, type LucideIcon } from 'lucide-react'

const notifIcons: Record<string, { icon: LucideIcon; color: string }> = {
  job_match: { icon: Briefcase, color: 'bg-blue-100 text-blue-600' },
  bid_accepted: { icon: CheckCircle, color: 'bg-green-100 text-green-600' },
  bid_rejected: { icon: XCircle, color: 'bg-red-100 text-red-600' },
  payment: { icon: Briefcase, color: 'bg-purple-100 text-purple-600' },
  system: { icon: Info, color: 'bg-gray-100 text-gray-600' },
  sos: { icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)

  const unreadCount = notifications.filter(n => !n.is_read).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Notifications" showBack={true} />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Header with mark all read */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-primary h-8 text-xs" onClick={markAllRead}>
              <CheckCheck className="h-3.5 w-3.5 mr-1" /> Mark all read
            </Button>
          )}
        </div>

        {/* Notification list */}
        <div className="space-y-2">
          {notifications.map(notif => {
            const iconInfo = notifIcons[notif.type] || notifIcons.system
            const Icon = iconInfo.icon

            return (
              <button
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`w-full text-left p-4 rounded-xl border transition-colors ${
                  notif.is_read
                    ? 'bg-white border-border'
                    : 'bg-green-50 border-primary/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${iconInfo.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`text-sm font-semibold ${notif.is_read ? 'text-foreground' : 'text-foreground'}`}>
                        {notif.title}
                      </h4>
                      {!notif.is_read && (
                        <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notif.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1.5">{formatTimeAgo(notif.created_at)}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🔔</div>
            <p className="text-sm font-medium text-foreground">No notifications</p>
            <p className="text-xs text-muted-foreground mt-1">You&apos;re all caught up!</p>
          </div>
        )}
      </div>
    </div>
  )
}
