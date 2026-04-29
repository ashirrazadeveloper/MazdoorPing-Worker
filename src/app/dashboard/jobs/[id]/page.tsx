'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, MapPin, Clock, User, Star,
  Send
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { WORKER_CATEGORIES } from '@/types'
import { mockJobs } from '@/data/mock'
import { formatPKR, formatTimeAgo } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [showBidDialog, setShowBidDialog] = useState(false)
  const [bidAmount, setBidAmount] = useState('')
  const [bidMessage, setBidMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Find job from mock data
  const job = mockJobs.find(j => j.id === params.id) || mockJobs[0]
  const categoryInfo = WORKER_CATEGORIES[job.category]

  const handleSubmitBid = () => {
    if (!bidAmount) return
    setSubmitted(true)
    setTimeout(() => {
      setShowBidDialog(false)
      setSubmitted(false)
      setBidAmount('')
      setBidMessage('')
    }, 1500)
  }

  const urgencyVariant = job.urgency === 'emergency' ? 'destructive' : job.urgency === 'urgent' ? 'urgent' : 'secondary'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center h-14 px-4 max-w-lg mx-auto">
          <button
            onClick={() => router.back()}
            className="p-1 -ml-1 rounded-lg hover:bg-muted transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold text-foreground truncate ml-3">Job Details</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4 pb-24">
        {/* Job Title & Status */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h2 className="text-xl font-bold text-foreground">{job.title}</h2>
            {job.urgency !== 'normal' && (
              <Badge variant={urgencyVariant} className="shrink-0">
                {job.urgency === 'emergency' ? '🚨 Emergency' : '⚡ Urgent'}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {categoryInfo.icon} {categoryInfo.en}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {job.city}
            </Badge>
          </div>
        </div>

        {/* Budget */}
        <Card className="border-primary/20 bg-green-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Budget Range</p>
              <p className="text-xl font-bold text-primary">
                {formatPKR(job.budget_min)} - {formatPKR(job.budget_max)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Avg Rate</p>
              <p className="text-sm font-semibold text-foreground">
                {formatPKR(Math.round((job.budget_min + job.budget_max) / 2))}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-foreground mb-2">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
          </CardContent>
        </Card>

        {/* Location & Time */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <MapPin className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{job.area}</p>
                {job.address && <p className="text-xs text-muted-foreground">{job.address}</p>}
                {job.distance && <p className="text-xs text-primary font-medium">{job.distance} away</p>}
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Posted {formatTimeAgo(job.created_at)}</p>
                {job.scheduled_date && (
                  <p className="text-xs text-muted-foreground">Scheduled: {job.scheduled_date}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-bold text-foreground mb-3">Requirements</h3>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] text-green-600">✓</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Employer Info */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Employer</h3>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{job.employer_name}</p>
                {job.employer_rating && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">{job.employer_rating} rating</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 safe-bottom">
        <div className="max-w-lg mx-auto">
          <Button
            className="w-full h-12 text-base font-semibold"
            size="lg"
            onClick={() => setShowBidDialog(true)}
          >
            Place Bid
          </Button>
        </div>
      </div>

      {/* Bid Dialog */}
      <Dialog open={showBidDialog} onOpenChange={setShowBidDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Place Your Bid</DialogTitle>
            <DialogDescription>
              {job.title} · {categoryInfo.en}
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="text-center py-8">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">✅</span>
              </div>
              <p className="text-lg font-bold text-foreground">Bid Placed!</p>
              <p className="text-sm text-muted-foreground mt-1">Waiting for employer response</p>
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Budget Range</p>
                <p className="text-lg font-bold text-primary">{formatPKR(job.budget_min)} - {formatPKR(job.budget_max)}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Your Bid Amount (PKR) *</label>
                <Input
                  type="number"
                  placeholder="Enter your bid amount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  min={job.budget_min}
                  max={job.budget_max}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message to Employer</label>
                <Textarea
                  placeholder="Why should they choose you? Mention your experience and availability..."
                  value={bidMessage}
                  onChange={(e) => setBidMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                className="w-full h-12"
                size="lg"
                onClick={handleSubmitBid}
                disabled={!bidAmount}
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Bid
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
