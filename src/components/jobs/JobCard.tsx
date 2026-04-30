import { Job } from '@/types'
import { WORKER_CATEGORIES } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPKR, formatTimeAgo } from '@/lib/utils'
import { MapPin, Clock, Star, Zap } from 'lucide-react'
import Link from 'next/link'

interface JobCardProps {
  job: Job
  showEmployer?: boolean
}

export default function JobCard({ job, showEmployer = true }: JobCardProps) {
  const categoryInfo = WORKER_CATEGORIES[job.category]

  const urgencyColor = job.urgency === 'emergency'
    ? 'bg-red-100 text-red-700 border-red-200'
    : job.urgency === 'urgent'
      ? 'bg-orange-100 text-orange-700 border-orange-200'
      : ''

  return (
    <Link href={`/dashboard/jobs/${job.id}`}>
      <Card className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-[0.98] border-border/60 hover:border-primary/20 animate-fade-in">
        {/* Top row: Title + Urgency */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-lg shrink-0">{categoryInfo.icon}</span>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm text-foreground truncate">{job.title}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">{categoryInfo.en} · {categoryInfo.ur}</p>
            </div>
          </div>
          {job.urgency !== 'normal' && (
            <Badge className={`text-[10px] shrink-0 border ${urgencyColor || 'border-transparent bg-orange-100 text-orange-800'}`}>
              {job.urgency === 'emergency' ? '🚨 Emergency' : '⚡ Urgent'}
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{job.description}</p>

        {/* Requirements tags */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="flex gap-1.5 mb-3 overflow-x-auto no-scrollbar">
            {job.requirements.slice(0, 3).map((req, i) => (
              <span key={i} className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {req}
              </span>
            ))}
            {job.requirements.length > 3 && (
              <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                +{job.requirements.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Location + Time */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {job.area}{job.distance ? ` · ${job.distance}` : ''}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTimeAgo(job.created_at)}
          </span>
        </div>

        {/* Bottom: Budget + Employer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="font-bold text-primary text-sm">
              {formatPKR(job.budget_min)}{job.budget_max > job.budget_min ? ` - ${formatPKR(job.budget_max)}` : ''}
            </span>
          </div>
          {showEmployer && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {job.employer_rating && (
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              )}
              <span className="bg-muted/70 px-2 py-0.5 rounded-md">{job.employer_name}</span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
