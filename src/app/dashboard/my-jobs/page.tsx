'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/Header'
import { WORKER_CATEGORIES } from '@/types'
import { mockActiveJobs, mockPendingBids, mockCompletedJobs, mockCancelledJobs } from '@/data/mock'
import { formatPKR } from '@/lib/utils'
import { Briefcase, Clock, CheckCircle, XCircle, Phone, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default function MyJobsPage() {
  const [activeTab, setActiveTab] = useState('active')

  const tabs = [
    { value: 'active', label: 'Active', count: mockActiveJobs.length, icon: Briefcase },
    { value: 'pending', label: 'Pending', count: mockPendingBids.length, icon: Clock },
    { value: 'completed', label: 'Done', count: mockCompletedJobs.length, icon: CheckCircle },
    { value: 'cancelled', label: 'Cancelled', count: mockCancelledJobs.length, icon: XCircle },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header title="My Jobs" />

      <div className="max-w-lg mx-auto px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full">
            {tabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-xs flex-1 gap-1">
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-0.5 h-4 min-w-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold inline-flex items-center justify-center px-1">
                    {tab.count}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Active Jobs */}
          <TabsContent value="active">
            {mockActiveJobs.length > 0 ? (
              <div className="space-y-3">
                {mockActiveJobs.map(job => (
                  <div key={job.id} className="animate-fade-in">
                    <ActiveJobCard job={job} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="👷"
                title="No active jobs"
                description="Browse available jobs and place bids to start working"
                actionLabel="Find Jobs"
                actionHref="/dashboard/jobs"
              />
            )}
          </TabsContent>

          {/* Pending Bids */}
          <TabsContent value="pending">
            {mockPendingBids.length > 0 ? (
              <div className="space-y-3">
                {mockPendingBids.map(bid => (
                  <div key={bid.id} className="animate-fade-in">
                    <PendingBidCard bid={bid} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="⏳"
                title="No pending bids"
                description="Place bids on jobs you're interested in"
                actionLabel="Find Jobs"
                actionHref="/dashboard/jobs"
              />
            )}
          </TabsContent>

          {/* Completed Jobs */}
          <TabsContent value="completed">
            {mockCompletedJobs.length > 0 ? (
              <div className="space-y-3">
                {mockCompletedJobs.map(job => (
                  <div key={job.id} className="animate-fade-in">
                    <CompletedJobCard job={job} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="✅"
                title="No completed jobs yet"
                description="Complete jobs will appear here"
              />
            )}
          </TabsContent>

          {/* Cancelled Jobs */}
          <TabsContent value="cancelled">
            {mockCancelledJobs.length > 0 ? (
              <div className="space-y-3">
                {mockCancelledJobs.map(job => (
                  <div key={job.id} className="animate-fade-in">
                    <CancelledJobCard job={job} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="❌"
                title="No cancelled jobs"
                description="Cancelled jobs will appear here"
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Active Job Card
function ActiveJobCard({ job }: { job: typeof mockActiveJobs[0] }) {
  const categoryInfo = WORKER_CATEGORIES[job.category]
  return (
    <Card className="border-primary/20 bg-gradient-to-r from-green-50/50 to-white">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{categoryInfo.icon}</span>
            <div>
              <h3 className="font-semibold text-sm text-foreground">{job.title}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">{categoryInfo.en} · {job.area}</p>
            </div>
          </div>
          <Badge variant="success" className="shrink-0 rounded-lg">Active</Badge>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          <div>
            <p className="text-[10px] text-muted-foreground">Your Bid</p>
            <p className="text-sm font-bold text-primary">{formatPKR(job.worker_bid || 0)}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-9 rounded-xl text-xs">
              <Phone className="h-3.5 w-3.5 mr-1" /> Call
            </Button>
            <Button size="sm" className="h-9 rounded-xl text-xs">
              <MessageSquare className="h-3.5 w-3.5 mr-1" /> Chat
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Pending Bid Card
function PendingBidCard({ bid }: { bid: typeof mockPendingBids[0] }) {
  if (!bid.job) return null
  const categoryInfo = WORKER_CATEGORIES[bid.job.category]
  return (
    <Card className="border-border/60">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{categoryInfo.icon}</span>
            <div>
              <h3 className="font-semibold text-sm text-foreground">{bid.job.title}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">{categoryInfo.en} · {bid.job.area}</p>
            </div>
          </div>
          <Badge variant="warning" className="shrink-0 rounded-lg">Pending</Badge>
        </div>
        {bid.message && (
          <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2.5 mt-2 italic">
            &quot;{bid.message}&quot;
          </p>
        )}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          <div>
            <p className="text-[10px] text-muted-foreground">Your Bid</p>
            <p className="text-sm font-bold text-foreground">{formatPKR(bid.amount)}</p>
          </div>
          <p className="text-xs text-muted-foreground">Budget: {formatPKR(bid.job.budget_min)}-{formatPKR(bid.job.budget_max)}</p>
        </div>
      </CardContent>
    </Card>
  )
}

// Completed Job Card
function CompletedJobCard({ job }: { job: typeof mockCompletedJobs[0] }) {
  const categoryInfo = WORKER_CATEGORIES[job.category]
  return (
    <Card className="border-border/60">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{categoryInfo.icon}</span>
            <div>
              <h3 className="font-semibold text-sm text-foreground">{job.title}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">{categoryInfo.en} · {job.area}</p>
            </div>
          </div>
          <Badge variant="success" className="shrink-0 rounded-lg">
            <CheckCircle className="h-3 w-3 mr-0.5" /> Done
          </Badge>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          <div>
            <p className="text-[10px] text-muted-foreground">Earned</p>
            <p className="text-sm font-bold text-emerald-600">{formatPKR(job.worker_bid || 0)}</p>
          </div>
          <p className="text-xs text-muted-foreground">{job.employer_name}</p>
        </div>
      </CardContent>
    </Card>
  )
}

// Cancelled Job Card
function CancelledJobCard({ job }: { job: typeof mockCancelledJobs[0] }) {
  const categoryInfo = WORKER_CATEGORIES[job.category]
  return (
    <Card className="border-border/60 opacity-70">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{categoryInfo.icon}</span>
            <div>
              <h3 className="font-semibold text-sm text-foreground line-through">{job.title}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">{categoryInfo.en} · {job.area}</p>
            </div>
          </div>
          <Badge variant="destructive" className="shrink-0 rounded-lg">Cancelled</Badge>
        </div>
      </CardContent>
    </Card>
  )
}

// Empty State
function EmptyState({ icon, title, description, actionLabel, actionHref }: {
  icon: string
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}) {
  return (
    <div className="text-center py-16 animate-fade-in">
      <div className="text-5xl mb-4">{icon}</div>
      <p className="text-base font-semibold text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button size="sm" className="mt-4 rounded-xl">{actionLabel}</Button>
        </Link>
      )}
    </div>
  )
}
