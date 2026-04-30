'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/Header'
import { mockNotifications } from '@/data/mock'
import { formatTimeAgo } from '@/lib/utils'
import { CheckCheck, Briefcase, CheckCircle, XCircle, AlertTriangle, Info, DollarSign, type LucideIcon } from 'lucide-react'

const notifIcons: Record<string, { icon: LucideIcon; color: string }> = {
  job_match: { icon: Briefcase, color: 'bg-blue-100 text-blue-600' },
  bid_accepted: { icon: CheckCircle, color: 'bg-emerald-100 text-emerald-600' },
  bid_rejected: { icon: XCircle, color: 'bg-red-100 text-red-600' },
  payment: { icon: DollarSign, color: 'bg-purple-100 text-purple-600' },
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
    <div className="min-h-screen bg-gray-50/50">
      <Header title="Notifications" showBack={true} />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Header with mark all read */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? (
              <span><span className="font-semibold text-foreground">{unreadCount}</span> unread notification{unreadCount !== 1 ? 's' : ''}</span>
            ) : (
              'All caught up! ✅'
            )}
          </p>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-primary h-8 text-xs rounded-xl font-semibold" onClick={markAllRead}>
              <CheckCheck className="h-3.5 w-3.5 mr-1" /> Mark all read
            </Button>
          )}
        </div>

        {/* Notification list */}
        <div className="space-y-2">
          {notifications.map((notif, idx) => {
            const iconInfo = notifIcons[notif.type] || notifIcons.system
            const Icon = iconInfo.icon

            return (
              <button
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 animate-fade-in ${
                  notif.is_read
                    ? 'bg-white border-border/60 hover:shadow-sm'
                    : 'bg-green-50/80 border-primary/20 hover:shadow-sm'
                }`}
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${iconInfo.color}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-foreground leading-snug">
                        {notif.title}
                      </h4>
                      {!notif.is_read && (
                        <div className="h-2.5 w-2.5 rounded-full bg-primary shrink-0 mt-1 ring-2 ring-primary/20" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{notif.message}</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1.5">{formatTimeAgo(notif.created_at)}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-5xl mb-4">🔔</div>
            <p className="text-base font-semibold text-foreground">No notifications</p>
            <p className="text-sm text-muted-foreground mt-1">You&apos;re all caught up!</p>
          </div>
        )}
      </div>
    </div>
  )
}
