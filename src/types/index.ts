// ============================================
// MazdoorPing Worker App - Type Definitions
// ============================================

// Category from Supabase
export interface Category {
  id: string
  name: string
  name_ur: string | null
  icon: string | null
  description: string | null
  base_rate: number
  commission_rate: number
  is_active: boolean
  total_workers: number
  created_at: string
  updated_at: string
}

// Worker from Supabase (joined with category)
export interface Worker {
  id: string
  category_id: string | null
  city: string
  area: string | null
  cnic: string | null
  bio: string | null
  experience_years: number
  rating: number
  total_reviews: number
  total_jobs: number
  total_earnings: number
  wallet_balance: number
  base_rate: number
  status: 'pending' | 'active' | 'rejected' | 'suspended'
  is_verified: boolean
  is_available: boolean
  latitude: number | null
  longitude: number | null
  created_at: string
  updated_at: string
  // Joined from categories table
  category: Category | null
}

// Employer from Supabase
export interface Employer {
  id: string
  company_name: string | null
  business_type: string | null
  city: string
  area: string | null
  rating: number
  total_reviews: number
  total_jobs_posted: number
  total_spent: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Job from Supabase (joined with category and employer)
export interface Job {
  id: string
  employer_id: string
  worker_id: string | null
  category_id: string
  title: string
  description: string | null
  budget_type: 'hourly' | 'daily' | 'fixed' | 'negotiable'
  budget_min: number | null
  budget_max: number | null
  city: string
  area: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
  status: 'open' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
  urgency: 'normal' | 'urgent' | 'emergency'
  workers_needed: number
  duration: string | null
  skills_required: string[] | null
  scheduled_date: string | null
  scheduled_time: string | null
  final_price: number | null
  commission: number
  completed_at: string | null
  created_at: string
  updated_at: string
  // Joined tables
  category: Category | null
  employer: { id: string; full_name: string | null; rating: number } | null
}

// Bid from Supabase (joined with job)
export interface Bid {
  id: string
  job_id: string
  worker_id: string
  amount: number
  message: string | null
  estimated_duration: string | null
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  // Joined
  job: Job | null
}

// Transaction from Supabase
export interface Transaction {
  id: string
  worker_id: string | null
  employer_id: string | null
  job_id: string | null
  type: 'earning' | 'commission' | 'withdrawal' | 'payout' | 'refund'
  amount: number
  description: string | null
  status: 'pending' | 'completed' | 'failed'
  method: string | null
  created_at: string
}

// Notification from Supabase
export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  is_read: boolean
  data: Record<string, unknown> | null
  created_at: string
}

// Review from Supabase
export interface Review {
  id: string
  job_id: string
  worker_id: string
  employer_id: string
  rating: number
  comment: string | null
  is_anonymous: boolean
  created_at: string
  // Joined
  employer: { id: string; full_name: string | null } | null
}

// Alert type for SOS
export type AlertType = 'emergency' | 'harassment' | 'accident' | 'theft' | 'other'

// SOS Alert from Supabase
export interface SOSAlert {
  id: string
  worker_id: string
  job_id: string | null
  type: 'emergency' | 'harassment' | 'accident' | 'theft' | 'other'
  latitude: number
  longitude: number
  address: string | null
  message: string
  status: 'active' | 'acknowledged' | 'resolved'
  emergency_contact: string | null
  created_at: string
  resolved_at: string | null
}

// Withdrawal from Supabase
export interface Withdrawal {
  id: string
  worker_id: string
  amount: number
  method: 'jazzcash' | 'easypaisa' | 'bank'
  account_details: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  processed_at: string | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseUser = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseSession = any

// Auth context types
export interface AuthContextType {
  user: SupabaseUser
  session: SupabaseSession
  workerProfile: Worker | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}
