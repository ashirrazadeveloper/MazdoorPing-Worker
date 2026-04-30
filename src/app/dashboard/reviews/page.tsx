'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import Header from '@/components/layout/Header'
import { mockWorker, mockReviews } from '@/data/mock'
import { formatTimeAgo } from '@/lib/utils'
import { Star, User } from 'lucide-react'

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
    <div className="min-h-screen bg-gray-50/50">
      <Header title="Reviews" showBack={true} />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Rating Summary */}
        <Card className="border-border/60 animate-fade-in">
          <CardContent className="p-5">
            <div className="flex items-center gap-5">
              <div className="text-center shrink-0">
                <p className="text-5xl font-extrabold text-foreground">{avgRating}</p>
                <div className="flex items-center gap-0.5 mt-2 justify-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(avgRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 font-medium">{totalReviews} reviews</p>
              </div>
              <div className="flex-1 space-y-2">
                {ratingDist.map(({ rating, count }) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-3 font-medium">{rating}</span>
                    <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                        style={{ width: `${totalReviews > 0 ? (count / totalReviews) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-4 text-right font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
          <button
            onClick={() => setSelectedRating('all')}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              selectedRating === 'all'
                ? 'bg-primary text-white shadow-md shadow-primary/25'
                : 'bg-white border border-border text-muted-foreground hover:border-primary/50'
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
                className={`shrink-0 px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                  selectedRating === r
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'bg-white border border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                <Star className="h-3 w-3" /> {r} ({count})
              </button>
            )
          })}
        </div>

        {/* Reviews List */}
        <div className="space-y-3">
          {filteredReviews.map((review, idx) => (
            <Card key={review.id} className="border-border/60 animate-slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">{review.employer_name}</p>
                      <span className="text-[10px] text-muted-foreground shrink-0">{formatTimeAgo(review.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-0.5 mt-1">
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
          <div className="text-center py-16 animate-fade-in">
            <div className="text-5xl mb-4">⭐</div>
            <p className="text-base font-semibold text-foreground">No reviews yet</p>
            <p className="text-sm text-muted-foreground mt-1">Complete jobs to receive reviews</p>
          </div>
        )}
      </div>
    </div>
  )
}
