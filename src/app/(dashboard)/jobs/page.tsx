'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Header from '@/components/layout/Header'
import JobCard from '@/components/jobs/JobCard'
import { mockJobs } from '@/data/mock'
import { WORKER_CATEGORIES, type WorkerCategory } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

const CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar']

export default function FindJobsPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<WorkerCategory | 'all'>('all')
  const [selectedCity, setSelectedCity] = useState('Lahore')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const openJobs = mockJobs.filter(j => j.status === 'open')

  const filteredJobs = useMemo(() => {
    return openJobs.filter(job => {
      const matchesSearch = !search ||
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase()) ||
        job.area.toLowerCase().includes(search.toLowerCase())

      const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory

      const matchesCity = job.city === selectedCity

      const matchesBudgetMin = !budgetMin || job.budget_min >= parseInt(budgetMin)
      const matchesBudgetMax = !budgetMax || job.budget_max <= parseInt(budgetMax)

      return matchesSearch && matchesCategory && matchesCity && matchesBudgetMin && matchesBudgetMax
    })
  }, [search, selectedCategory, selectedCity, budgetMin, budgetMax, openJobs])

  const activeFilterCount = [
    selectedCategory !== 'all',
    budgetMin,
    budgetMax,
  ].filter(Boolean).length

  const clearFilters = () => {
    setSelectedCategory('all')
    setBudgetMin('')
    setBudgetMax('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Find Jobs" />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs, areas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-12 h-11"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => setShowFilters(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {/* Active filters */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {WORKER_CATEGORIES[selectedCategory].icon} {WORKER_CATEGORIES[selectedCategory].en}
                <button onClick={() => setSelectedCategory('all')}><X className="h-3 w-3" /></button>
              </Badge>
            )}
            {(budgetMin || budgetMax) && (
              <Badge variant="secondary" className="gap-1">
                PKR {budgetMin || '0'}-{budgetMax || '∞'}
                <button onClick={() => { setBudgetMin(''); setBudgetMax('') }}><X className="h-3 w-3" /></button>
              </Badge>
            )}
            <button onClick={clearFilters} className="text-xs text-primary font-medium hover:underline">
              Clear all
            </button>
          </div>
        )}

        {/* Category quick filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary text-white'
                : 'bg-white border border-border text-muted-foreground hover:border-primary'
            }`}
          >
            All
          </button>
          {(['electrician', 'plumber', 'carpenter', 'painter', 'ac_technician', 'welder', 'cleaner', 'mason'] as WorkerCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === selectedCategory ? 'all' : cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-white border border-border text-muted-foreground hover:border-primary'
              }`}
            >
              {WORKER_CATEGORIES[cat].icon} {WORKER_CATEGORIES[cat].en}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
          </p>
          <span className="text-xs text-muted-foreground">{selectedCity}</span>
        </div>

        {/* Job list */}
        <div className="space-y-3">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => <JobCard key={job.id} job={job} />)
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-sm font-medium text-foreground">No jobs found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or search</p>
              {activeFilterCount > 0 && (
                <Button variant="outline" size="sm" className="mt-3" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filter Dialog */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
            <DialogDescription>Narrow down your job search</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm"
              >
                {CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Budget Range (PKR)</label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  className="w-full"
                />
                <span className="text-muted-foreground">—</span>
                <Input
                  placeholder="Max"
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as WorkerCategory | 'all')}
                className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="all">All Categories</option>
                {(Object.keys(WORKER_CATEGORIES) as WorkerCategory[]).map(cat => (
                  <option key={cat} value={cat}>
                    {WORKER_CATEGORIES[cat].icon} {WORKER_CATEGORIES[cat].en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1" onClick={clearFilters}>Reset</Button>
            <Button className="flex-1" onClick={() => setShowFilters(false)}>Apply</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
