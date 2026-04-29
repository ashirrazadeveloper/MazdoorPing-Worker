'use client'

import Link from 'next/link'
import { Briefcase, Wallet, AlertTriangle, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Header from '@/components/layout/Header'
import JobCard from '@/components/jobs/JobCard'
import { mockWorker, mockJobs, getMockTodayEarnings } from '@/data/mock'
import { formatPKR } from '@/lib/utils'

export default function DashboardPage() {
  const worker = mockWorker
  const todayEarnings = getMockTodayEarnings()
  const availableJobs = mockJobs.filter(j => j.status === 'open').slice(0, 4)

  const stats = [
    { label: "Today's Earnings", labelUr: 'آج کی آمدنی', value: formatPKR(todayEarnings), icon: '💰', color: 'bg-green-50 text-green-700' },
    { label: 'Active Jobs', labelUr: 'فعال کام', value: '1', icon: '👷', color: 'bg-blue-50 text-blue-700' },
    { label: 'Rating', labelUr: 'درجہ بندی', value: `${worker.rating} ⭐`, icon: '⭐', color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Wallet Balance', labelUr: 'بیلنس', value: formatPKR(worker.wallet_balance), icon: '💼', color: 'bg-purple-50 text-purple-700' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="MazdoorPing" showNotifications={true} />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-6">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-primary to-green-600 border-0 text-white overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                👷
              </div>
              <div className="flex-1">
                <p className="text-green-100 text-sm">Assalam-o-Alaikum 🤲</p>
                <h2 className="text-lg font-bold">{worker.name}</h2>
                <p className="text-green-100 text-xs">
                  {WORKER_CATEGORY_LABEL} · {worker.area}, {worker.city}
                </p>
              </div>
              <div className="bg-white/20 rounded-lg px-2 py-1">
                <span className="text-xs font-medium">✅ Verified</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{stat.icon}</span>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3">
          <Link href="/dashboard/jobs" className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border border-border hover:bg-green-50 transition-colors">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-xs font-medium text-foreground">Find Jobs</span>
          </Link>
          <Link href="/dashboard/my-jobs" className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border border-border hover:bg-blue-50 transition-colors">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-foreground">My Jobs</span>
          </Link>
          <Link href="/dashboard/wallet" className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border border-border hover:bg-purple-50 transition-colors">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-foreground">Wallet</span>
          </Link>
          <Link href="/dashboard/sos" className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border border-border hover:bg-red-50 transition-colors">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <span className="text-xs font-medium text-foreground">SOS</span>
          </Link>
        </div>

        {/* Available Jobs Nearby */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-foreground">Jobs Nearby</h3>
            <Link href="/dashboard/jobs" className="text-sm text-primary font-medium flex items-center gap-0.5 hover:underline">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {availableJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>

        {/* Earnings Summary */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">Earnings Summary</h3>
              <Link href="/dashboard/wallet" className="text-xs text-primary font-medium hover:underline">
                View Details
              </Link>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">This Week</span>
              <span className="text-sm font-semibold text-foreground">{formatPKR(27000)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">This Month</span>
              <span className="text-sm font-semibold text-foreground">{formatPKR(86500)}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">All Time</span>
              <span className="text-sm font-semibold text-primary">{formatPKR(worker.total_earnings)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const WORKER_CATEGORY_LABEL = 'Electrician'
