'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Header from '@/components/layout/Header'
import JobCard from '@/components/jobs/JobCard'
import { getAvailableJobs, getCategories } from '@/lib/services'
import type { Job, Category } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

const CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta']

export default function FindJobsPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedCity, setSelectedCity] = useState('Lahore')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true)
      try {
        const filters: Record<string, string> = { city: selectedCity }
        if (selectedCategory !== 'all') filters.category_id = selectedCategory
        if (search) filters.search = search
        const data = await getAvailableJobs(filters)
        setJobs(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [selectedCategory, selectedCity, search])

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesBudgetMin = !budgetMin || (job.budget_min != null && job.budget_min >= parseInt(budgetMin))
      const matchesBudgetMax = !budgetMax || (job.budget_max != null && job.budget_max <= parseInt(budgetMax))
      return matchesBudgetMin && matchesBudgetMax
    })
  }, [jobs, budgetMin, budgetMax])

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
    <div className="min-h-screen bg-gray-50/50">
      <Header title="Find Jobs" />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs, areas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-12 h-11 rounded-xl bg-white border-border/60"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl"
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
          <div className="flex items-center gap-2 flex-wrap animate-fade-in">
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="gap-1 rounded-lg px-3 py-1">
                {categories.find(c => c.id === selectedCategory)?.icon} {categories.find(c => c.id === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory('all')}><X className="h-3 w-3 ml-0.5" /></button>
              </Badge>
            )}
            {(budgetMin || budgetMax) && (
              <Badge variant="secondary" className="gap-1 rounded-lg px-3 py-1">
                PKR {budgetMin || '0'}-{budgetMax || '∞'}
                <button onClick={() => { setBudgetMin(''); setBudgetMax('') }}><X className="h-3 w-3 ml-0.5" /></button>
              </Badge>
            )}
            <button onClick={clearFilters} className="text-xs text-primary font-semibold hover:underline">
              Clear all
            </button>
          </div>
        )}

        {/* Category quick filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-primary text-white shadow-md shadow-primary/25'
                : 'bg-white border border-border text-muted-foreground hover:border-primary/50'
            }`}
          >
            All
          </button>
          {categories.slice(0, 9).map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === selectedCategory ? 'all' : cat.id)}
              className={`shrink-0 px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'bg-white border border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {loading ? 'Searching...' : `${filteredJobs.length} job${filteredJobs.length !== 1 ? 's' : ''} found`}
          </p>
          <Badge variant="outline" className="text-[10px] rounded-lg px-2 py-0.5">
            📍 {selectedCity}
          </Badge>
        </div>

        {/* Job list */}
        <div className="space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-36 bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job, idx) => (
              <div key={job.id} className="animate-slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
                <JobCard job={job} />
              </div>
            ))
          ) : (
            <div className="text-center py-16 animate-fade-in">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-base font-semibold text-foreground">No jobs found</p>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">Try adjusting your filters or search to find more opportunities</p>
              {activeFilterCount > 0 && (
                <Button variant="outline" size="sm" className="mt-4 rounded-xl" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filter Dialog */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
            <DialogDescription>Narrow down your job search</DialogDescription>
          </DialogHeader>

          <div className="space-y-5 mt-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold">City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Budget Range (PKR)</label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  className="w-full rounded-xl"
                />
                <span className="text-muted-foreground font-medium">—</span>
                <Input
                  placeholder="Max"
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  className="w-full rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1 rounded-xl h-11" onClick={clearFilters}>Reset</Button>
            <Button className="flex-1 rounded-xl h-11" onClick={() => setShowFilters(false)}>Apply Filters</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
