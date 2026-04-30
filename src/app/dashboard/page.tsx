'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Briefcase, Wallet, AlertTriangle, ChevronRight, TrendingUp, Star, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Header from '@/components/layout/Header'
import JobCard from '@/components/jobs/JobCard'
import { useAuth } from '@/components/auth/AuthProvider'
import { getAvailableJobs, getTransactions } from '@/lib/services'
import type { Job, Transaction } from '@/types'
import { formatPKR, getInitials } from '@/lib/utils'

export default function DashboardPage() {
  const { workerProfile } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (!workerProfile) return
      try {
        const [jobsData, txData] = await Promise.all([
          getAvailableJobs({ city: workerProfile.city }),
          getTransactions(workerProfile.id),
        ])
        setJobs(jobsData)
        setTransactions(txData)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    if (workerProfile) {
      fetchData()
    }
  }, [workerProfile])

  if (!workerProfile || loading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <Header title="MazdoorPing" />
        <div className="max-w-lg mx-auto px-4 py-4 space-y-5">
          {/* Skeleton welcome card */}
          <div className="h-40 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const worker = workerProfile
  const todayEarnings = transactions
    .filter(t => t.type === 'earning' && new Date(t.created_at).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + t.amount, 0)

  const weeklyEarnings = transactions
    .filter(t => {
      if (t.type !== 'earning') return false
      const d = new Date(t.created_at)
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 86400000)
      return d >= weekAgo
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const monthlyEarnings = transactions
    .filter(t => {
      if (t.type !== 'earning') return false
      const d = new Date(t.created_at)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const availableJobs = jobs.slice(0, 4)

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header title="MazdoorPing" showNotifications={true} />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-5">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 border-0 text-white overflow-hidden shadow-lg shadow-green-600/20">
          <CardContent className="p-5 relative">
            {/* Decorative */}
            <div className="absolute top-0 right-0 h-32 w-32 bg-white/5 rounded-full -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 h-20 w-20 bg-white/5 rounded-full -ml-8 -mb-8" />

            <div className="relative flex items-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow-md border border-white/20 font-bold">
                {getInitials(worker.category?.name || 'W')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-green-100 text-xs font-medium">Assalam-o-Alaikum 🤲</p>
                <h2 className="text-lg font-bold truncate">{worker.category?.name || 'Worker'}</h2>
                <p className="text-green-100/80 text-[11px] mt-0.5">
                  {worker.category?.icon || '🔧'} {worker.category?.name_ur || ''} · {worker.area || worker.city}
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2.5 py-1 border border-white/20 shrink-0">
                <span className="text-[11px] font-semibold">
                  {worker.is_verified ? '✅ Verified' : '⏳ Pending'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="overflow-hidden border-border/60 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="h-9 w-9 rounded-xl bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-[11px] text-muted-foreground font-medium">Today&apos;s Earnings</span>
              </div>
              <p className="text-xl font-bold text-foreground">{formatPKR(todayEarnings)}</p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-border/60 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="h-9 w-9 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-[11px] text-muted-foreground font-medium">Total Jobs</span>
              </div>
              <p className="text-xl font-bold text-foreground">{worker.total_jobs}</p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-border/60 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="h-9 w-9 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                </div>
                <span className="text-[11px] text-muted-foreground font-medium">Rating</span>
              </div>
              <p className="text-xl font-bold text-foreground">{Number(worker.rating).toFixed(1)} <span className="text-sm text-muted-foreground font-normal">({worker.total_reviews})</span></p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-border/60 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="h-9 w-9 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Wallet className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-[11px] text-muted-foreground font-medium">Wallet</span>
              </div>
              <p className="text-xl font-bold text-foreground">{formatPKR(Number(worker.wallet_balance))}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3">
          <Link href="/dashboard/jobs" className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white border border-border/60 hover:bg-green-50 hover:border-green-200 transition-all press-effect">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center shadow-sm">
              <Briefcase className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-[11px] font-semibold text-foreground">Find Jobs</span>
            <span className="text-[10px] text-muted-foreground">کام تلاش</span>
          </Link>
          <Link href="/dashboard/my-jobs" className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white border border-border/60 hover:bg-blue-50 hover:border-blue-200 transition-all press-effect">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-sm">
              <Zap className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-[11px] font-semibold text-foreground">My Jobs</span>
            <span className="text-[10px] text-muted-foreground">میرے کام</span>
          </Link>
          <Link href="/dashboard/wallet" className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white border border-border/60 hover:bg-purple-50 hover:border-purple-200 transition-all press-effect">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center shadow-sm">
              <Wallet className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-[11px] font-semibold text-foreground">Wallet</span>
            <span className="text-[10px] text-muted-foreground">بٹوہ</span>
          </Link>
          <Link href="/dashboard/sos" className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white border border-border/60 hover:bg-red-50 hover:border-red-200 transition-all press-effect">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center shadow-sm">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <span className="text-[11px] font-semibold text-foreground">SOS</span>
            <span className="text-[10px] text-muted-foreground">ہنگامی</span>
          </Link>
        </div>

        {/* Available Jobs Nearby */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-foreground">Jobs Nearby</h3>
            <Link href="/dashboard/jobs" className="text-sm text-primary font-semibold flex items-center gap-0.5 hover:underline">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {availableJobs.length > 0 ? (
              availableJobs.map((job, idx) => (
                <div key={job.id} className="animate-slide-up" style={{ animationDelay: `${idx * 80}ms` }}>
                  <JobCard job={job} />
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-white rounded-2xl border border-border/60">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-sm font-semibold text-foreground">No jobs available yet</p>
                <p className="text-xs text-muted-foreground mt-1">Check back later for new opportunities</p>
              </div>
            )}
          </div>
        </div>

        {/* Earnings Summary */}
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-primary" />
                Earnings Summary
              </h3>
              <Link href="/dashboard/wallet" className="text-xs text-primary font-semibold hover:underline">
                View Details
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <p className="text-[10px] text-muted-foreground font-medium">This Week</p>
                <p className="text-sm font-bold text-green-700 mt-1">{formatPKR(weeklyEarnings)}</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-xl">
                <p className="text-[10px] text-muted-foreground font-medium">This Month</p>
                <p className="text-sm font-bold text-emerald-700 mt-1">{formatPKR(monthlyEarnings)}</p>
              </div>
              <div className="text-center p-3 bg-primary/5 rounded-xl">
                <p className="text-[10px] text-muted-foreground font-medium">All Time</p>
                <p className="text-sm font-bold text-primary mt-1">{formatPKR(Number(worker.total_earnings))}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
