'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import Header from '@/components/layout/Header'
import { mockWorker, mockReviews } from '@/data/mock'
import { formatTimeAgo } from '@/lib/utils'
import { Star, User, Filter } from 'lucide-react'

export default function ReviewsPage() {
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all')

  const avgRating = mockWorker.rating
  const totalReviews = mockWorker.total_reviews

  // Rating distribution
  const ratingDist = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: mockReviews.filter(r => r.rating === rating).length,
  }))

  const filteredReviews = useMemo(() => {
    if (selectedRating === 'all') return mockReviews
    return mockReviews.filter(r => r.rating === selectedRating)
  }, [selectedRating])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Reviews" showBack={true} />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Rating Summary */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-5">
              <div className="text-center">
                <p className="text-4xl font-bold text-foreground">{avgRating}</p>
                <div className="flex items-center gap-0.5 mt-1 justify-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(avgRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{totalReviews} reviews</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {ratingDist.map(({ rating, count }) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-3">{rating}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full transition-all"
                        style={{ width: `${totalReviews > 0 ? (count / totalReviews) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-4 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          <button
            onClick={() => setSelectedRating('all')}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedRating === 'all'
                ? 'bg-primary text-white'
                : 'bg-white border border-border text-muted-foreground'
            }`}
          >
            All ({totalReviews})
          </button>
          {[5, 4, 3, 2, 1].map(r => {
            const count = mockReviews.filter(rev => rev.rating === r).length
            return (
              <button
                key={r}
                onClick={() => setSelectedRating(r === selectedRating ? 'all' : r)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                  selectedRating === r
                    ? 'bg-primary text-white'
                    : 'bg-white border border-border text-muted-foreground'
                }`}
              >
                <Star className="h-3 w-3" /> {r} ({count})
              </button>
            )
          })}
        </div>

        {/* Reviews List */}
        <div className="space-y-3">
          {filteredReviews.map(review => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">{review.employer_name}</p>
                      <span className="text-[10px] text-muted-foreground">{formatTimeAgo(review.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">⭐</div>
            <p className="text-sm font-medium text-foreground">No reviews yet</p>
            <p className="text-xs text-muted-foreground mt-1">Complete jobs to receive reviews</p>
          </div>
        )}
      </div>
    </div>
  )
}
