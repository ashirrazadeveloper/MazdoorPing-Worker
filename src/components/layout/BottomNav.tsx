"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Briefcase, Wallet, AlertTriangle, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Home', labelUr: 'ہوم', icon: Home },
  { href: '/dashboard/jobs', label: 'Jobs', labelUr: 'کام', icon: Briefcase },
  { href: '/dashboard/wallet', label: 'Wallet', labelUr: 'پرس', icon: Wallet },
  { href: '/dashboard/sos', label: 'SOS', labelUr: 'ایس او ایس', icon: AlertTriangle },
  { href: '/dashboard/profile', label: 'Profile', labelUr: 'پروفائل', icon: User },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 safe-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)
          const isSos = item.href === '/dashboard/sos'
          const isSosActive = isSos && pathname === '/dashboard/sos'

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 min-w-[60px] py-1 px-2 rounded-xl transition-all duration-200 relative',
                isSos
                  ? isSosActive
                    ? 'text-red-500'
                    : 'text-muted-foreground hover:text-red-400'
                  : isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {/* Active indicator */}
              {isActive && !isSos && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-1 w-6 rounded-full bg-primary transition-all" />
              )}
              {isSosActive && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-1 w-6 rounded-full bg-red-500 transition-all" />
              )}
              <item.icon
                className={cn(
                  'h-5 w-5 transition-all duration-200',
                  isActive && !isSos && 'scale-110',
                  isSos && 'h-[22px] w-[22px]'
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={cn(
                'text-[10px] font-medium transition-all duration-200',
                isActive && !isSos && 'font-semibold',
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
