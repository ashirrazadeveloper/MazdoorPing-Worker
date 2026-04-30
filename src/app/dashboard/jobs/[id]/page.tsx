'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import {
  ArrowLeft, MapPin, Clock, User, Star,
  Send, CheckCircle2, Loader2
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { getJobById, placeBid } from '@/lib/services'
import { useAuth } from '@/components/auth/AuthProvider'
import type { Job } from '@/types'
import { formatPKR, formatTimeAgo } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

const Map = dynamic(() => import('@/components/Map'), { ssr: false })

export default function JobDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { workerProfile } = useAuth()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBidDialog, setShowBidDialog] = useState(false)
  const [bidAmount, setBidAmount] = useState('')
  const [bidMessage, setBidMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchJob() {
      try {
        const data = await getJobById(params.id as string)
        setJob(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (params.id) fetchJob()
  }, [params.id])

  const handleSubmitBid = async () => {
    if (!bidAmount || !workerProfile) return
    setSubmitting(true)
    try {
      await placeBid(job!.id, workerProfile.id, parseFloat(bidAmount), bidMessage)
      setSubmitted(true)
      setTimeout(() => {
        setShowBidDialog(false)
        setSubmitted(false)
        setBidAmount('')
        setBidMessage('')
      }, 1500)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <header className="sticky top-0 z-40 glass border-b border-border/50">
          <div className="flex items-center h-14 px-4 max-w-lg mx-auto">
            <button onClick={() => router.back()} className="p-2 -ml-2 rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold truncate ml-2">Job Details</h1>
          </div>
        </header>
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-base font-semibold">Job not found</p>
          <Button variant="outline" className="mt-4 rounded-xl" onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  const urgencyColor = job.urgency === 'emergency'
    ? 'bg-red-100 text-red-700 border-red-200'
    : job.urgency === 'urgent'
      ? 'bg-orange-100 text-orange-700 border-orange-200'
      : ''

  const employerName = job.employer?.full_name || 'Employer'
  const employerRating = job.employer?.rating
  const categoryInfo = job.category
  const hasCoords = job.latitude != null && job.longitude != null

  // Default coords for Pakistan cities
  const cityCoords: Record<string, [number, number]> = {
    'Lahore': [31.5204, 74.3587],
    'Karachi': [24.8607, 67.0011],
    'Islamabad': [33.6844, 73.0479],
    'Rawalpindi': [33.5651, 73.0169],
    'Faisalabad': [31.4504, 73.1350],
    'Multan': [30.1575, 71.5249],
    'Peshawar': [34.0151, 71.5249],
    'Quetta': [30.1798, 66.9750],
  }
  const mapLat = hasCoords ? Number(job.latitude) : (cityCoords[job.city]?.[0] || 31.5204)
  const mapLng = hasCoords ? Number(job.longitude) : (cityCoords[job.city]?.[1] || 74.3587)

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
              <span className="text-2xl">{categoryInfo?.icon || '🔧'}</span>
              <div>
                <h2 className="text-xl font-bold text-foreground">{job.title}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{categoryInfo?.name || 'Job'} {categoryInfo?.name_ur && `· ${categoryInfo.name_ur}`}</p>
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
            <Badge variant="outline" className="text-xs rounded-lg">
              {job.budget_type}
            </Badge>
          </div>
        </div>

        {/* Budget */}
        <Card className="border-primary/20 bg-gradient-to-br from-green-50 to-emerald-50 animate-fade-in" style={{ animationDelay: '50ms' }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Budget Range</p>
                <p className="text-2xl font-extrabold text-primary">
                  {job.budget_min != null ? formatPKR(job.budget_min) : 'Negotiable'}
                  {job.budget_max != null && job.budget_min != null && ` - ${formatPKR(job.budget_max)}`}
                </p>
              </div>
              {job.budget_min != null && job.budget_max != null && (
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">Average</p>
                  <div className="bg-white rounded-xl px-3 py-1.5 shadow-sm mt-1">
                    <p className="text-sm font-bold text-foreground">
                      {formatPKR(Math.round((job.budget_min + job.budget_max) / 2))}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        {job.description && (
          <Card className="border-border/60 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-4">
              <h3 className="text-sm font-bold text-foreground mb-2">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Map */}
        <Card className="border-border/60 overflow-hidden animate-fade-in" style={{ animationDelay: '120ms' }}>
          <Map latitude={mapLat} longitude={mapLng} zoom={14} className="h-52 w-full" />
        </Card>

        {/* Location & Time */}
        <Card className="border-border/60 animate-fade-in" style={{ animationDelay: '150ms' }}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                <MapPin className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{job.area || job.city}</p>
                {job.address && <p className="text-xs text-muted-foreground truncate">{job.address}</p>}
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
                  <p className="text-xs text-muted-foreground">Scheduled: {job.scheduled_date}{job.scheduled_time ? ` at ${job.scheduled_time}` : ''}</p>
                )}
                {job.duration && (
                  <p className="text-xs text-muted-foreground">Duration: {job.duration}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Required */}
        {job.skills_required && job.skills_required.length > 0 && (
          <Card className="border-border/60 animate-fade-in" style={{ animationDelay: '180ms' }}>
            <CardContent className="p-4">
              <h3 className="text-sm font-bold text-foreground mb-3">Skills Required</h3>
              <div className="flex flex-wrap gap-1.5">
                {job.skills_required.map((skill, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">{skill}</span>
                ))}
              </div>
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
                <p className="text-sm font-semibold text-foreground">{employerName}</p>
                {employerRating != null && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">{Number(employerRating).toFixed(1)} employer rating</span>
                  </div>
                )}
              </div>
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
              {job.title} · {categoryInfo?.name}
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
                <p className="text-lg font-bold text-primary mt-1">
                  {job.budget_min != null ? formatPKR(job.budget_min) : 'Negotiable'}
                  {job.budget_max != null && job.budget_min != null && ` - ${formatPKR(job.budget_max)}`}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Your Bid Amount (PKR) *</label>
                <Input
                  type="number"
                  placeholder="Enter your bid amount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
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
                disabled={!bidAmount || submitting}
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {submitting ? 'Submitting...' : 'Submit Bid'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
