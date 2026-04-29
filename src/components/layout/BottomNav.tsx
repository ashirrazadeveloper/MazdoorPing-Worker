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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border safe-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard' || pathname === ''
            : pathname.startsWith(item.href)
          const isSos = item.href === '/dashboard/sos'

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-1 px-2 rounded-lg transition-colors',
                isActive && !isSos ? 'text-primary' : 'text-muted-foreground',
                isSos && 'text-red-500 hover:text-red-600',
                !isActive && !isSos && 'hover:text-foreground'
              )}
            >
              <item.icon className={cn('h-5 w-5', isSos && 'h-6 w-6')} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
