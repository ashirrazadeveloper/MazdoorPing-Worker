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
    { value: 'completed', label: 'Completed', count: mockCompletedJobs.length, icon: CheckCircle },
    { value: 'cancelled', label: 'Cancelled', count: mockCancelledJobs.length, icon: XCircle },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="My Jobs" />

      <div className="max-w-lg mx-auto px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            {tabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-xs">
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-1 h-4 w-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold inline-flex items-center justify-center">
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
                  <ActiveJobCard key={job.id} job={job} />
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
                  <PendingBidCard key={bid.id} bid={bid} />
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
                  <CompletedJobCard key={job.id} job={job} />
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
                  <CancelledJobCard key={job.id} job={job} />
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
    <Card className="border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-sm text-foreground">{job.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{categoryInfo.icon} {categoryInfo.en} · {job.area}</p>
          </div>
          <Badge variant="success" className="shrink-0">Active</Badge>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Your Bid</p>
            <p className="text-sm font-bold text-primary">{formatPKR(job.worker_bid || 0)}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-9">
              <Phone className="h-3.5 w-3.5 mr-1" /> Call
            </Button>
            <Button size="sm" className="h-9">
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
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-sm text-foreground">{bid.job.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{categoryInfo.icon} {categoryInfo.en} · {bid.job.area}</p>
          </div>
          <Badge variant="warning" className="shrink-0">Pending</Badge>
        </div>
        {bid.message && (
          <p className="text-xs text-muted-foreground bg-muted/50 rounded-md p-2 mt-2">
            &quot;{bid.message}&quot;
          </p>
        )}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Your Bid</p>
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
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-sm text-foreground">{job.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{categoryInfo.icon} {categoryInfo.en} · {job.area}</p>
          </div>
          <Badge variant="success" className="shrink-0">Completed</Badge>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Earned</p>
            <p className="text-sm font-bold text-green-600">{formatPKR(job.worker_bid || 0)}</p>
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
    <Card className="opacity-70">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-sm text-foreground line-through">{job.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{categoryInfo.icon} {categoryInfo.en} · {job.area}</p>
          </div>
          <Badge variant="destructive" className="shrink-0">Cancelled</Badge>
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
    <div className="text-center py-12">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button size="sm" className="mt-4">{actionLabel}</Button>
        </Link>
      )}
    </div>
  )
}
