import { Job } from '@/types'
import { WORKER_CATEGORIES } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPKR, formatTimeAgo } from '@/lib/utils'
import { MapPin, Clock } from 'lucide-react'
import Link from 'next/link'

interface JobCardProps {
  job: Job
}

export default function JobCard({ job }: JobCardProps) {
  const categoryInfo = WORKER_CATEGORIES[job.category]

  const urgencyVariant = job.urgency === 'emergency' ? 'destructive' : job.urgency === 'urgent' ? 'urgent' : 'secondary'

  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer active:scale-[0.98]">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground truncate">{job.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {categoryInfo.icon} {categoryInfo.en}
            </p>
          </div>
          {job.urgency !== 'normal' && (
            <Badge variant={urgencyVariant} className="text-[10px] shrink-0">
              {job.urgency === 'emergency' ? '🚨 Emergency' : '⚡ Urgent'}
            </Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{job.description}</p>

        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {job.area}{job.distance ? ` · ${job.distance}` : ''}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTimeAgo(job.created_at)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-bold text-primary text-sm">
            {formatPKR(job.budget_min)}{job.budget_max > job.budget_min ? ` - ${formatPKR(job.budget_max)}` : ''}
          </span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
            {job.employer_name}
          </span>
        </div>
      </Card>
    </Link>
  )
}
