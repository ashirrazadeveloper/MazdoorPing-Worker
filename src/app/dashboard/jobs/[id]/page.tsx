'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, MapPin, Clock, User, Star,
  Send, CheckCircle2
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

  const urgencyColor = job.urgency === 'emergency'
    ? 'bg-red-100 text-red-700 border-red-200'
    : job.urgency === 'urgent'
      ? 'bg-orange-100 text-orange-700 border-orange-200'
      : ''

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="flex items-center h-14 px-4 max-w-lg mx-auto">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-xl hover:bg-muted/80 transition-colors active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold text-foreground truncate ml-2">Job Details</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4 pb-28">
        {/* Job Title & Status */}
        <div className="animate-fade-in">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{categoryInfo.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-foreground">{job.title}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{categoryInfo.en} · {categoryInfo.ur}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs rounded-lg">
              {job.city}
            </Badge>
            {job.urgency !== 'normal' && (
              <Badge className={`text-xs rounded-lg border ${urgencyColor}`}>
                {job.urgency === 'emergency' ? '🚨 Emergency' : '⚡ Urgent'}
              </Badge>
            )}
          </div>
        </div>

        {/* Budget */}
        <Card className="border-primary/20 bg-gradient-to-br from-green-50 to-emerald-50 animate-fade-in" style={{ animationDelay: '50ms' }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Budget Range</p>
                <p className="text-2xl font-extrabold text-primary">
                  {formatPKR(job.budget_min)} - {formatPKR(job.budget_max)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground">Average Rate</p>
                <div className="bg-white rounded-xl px-3 py-1.5 shadow-sm mt-1">
                  <p className="text-sm font-bold text-foreground">
                    {formatPKR(Math.round((job.budget_min + job.budget_max) / 2))}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="border-border/60 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-foreground mb-2">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
          </CardContent>
        </Card>

        {/* Location & Time */}
        <Card className="border-border/60 animate-fade-in" style={{ animationDelay: '150ms' }}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                <MapPin className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{job.area}</p>
                {job.address && <p className="text-xs text-muted-foreground truncate">{job.address}</p>}
                {job.distance && <p className="text-xs text-primary font-semibold mt-0.5">{job.distance} away</p>}
              </div>
            </div>
            <Separator className="my-1" />
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
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
          <Card className="border-border/60 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-4">
              <h3 className="text-sm font-bold text-foreground mb-3">Requirements</h3>
              <ul className="space-y-2.5">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Employer Info */}
        <Card className="border-border/60 animate-fade-in" style={{ animationDelay: '250ms' }}>
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Employer</h3>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{job.employer_name}</p>
                {job.employer_rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">{job.employer_rating} employer rating</span>
                  </div>
                )}
              </div>
              {job.employer_phone && (
                <a href={`tel:${job.employer_phone}`} className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-green-600" />
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-border/50 p-4 safe-bottom">
        <div className="max-w-lg mx-auto">
          <Button
            className="w-full h-12 text-base font-bold rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-600/25"
            size="lg"
            onClick={() => setShowBidDialog(true)}
          >
            Place Bid
          </Button>
        </div>
      </div>

      {/* Bid Dialog */}
      <Dialog open={showBidDialog} onOpenChange={setShowBidDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Place Your Bid</DialogTitle>
            <DialogDescription>
              {job.title} · {categoryInfo.en}
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-lg font-bold text-foreground">Bid Placed!</p>
              <p className="text-sm text-muted-foreground mt-1">Waiting for employer response</p>
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground font-medium">Budget Range</p>
                <p className="text-lg font-bold text-primary mt-1">{formatPKR(job.budget_min)} - {formatPKR(job.budget_max)}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Your Bid Amount (PKR) *</label>
                <Input
                  type="number"
                  placeholder="Enter your bid amount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  min={job.budget_min}
                  max={job.budget_max}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Message to Employer</label>
                <Textarea
                  placeholder="Why should they choose you? Mention your experience and availability..."
                  value={bidMessage}
                  onChange={(e) => setBidMessage(e.target.value)}
                  rows={3}
                  className="rounded-xl"
                />
              </div>

              <Button
                className="w-full h-12 rounded-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-600/25"
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

function Phone(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  )
}
