// ============================================
// MazdoorPing Worker App - Type Definitions
// ============================================

export type WorkerCategory =
  | 'plumber'
  | 'electrician'
  | 'carpenter'
  | 'painter'
  | 'mason'
  | 'welder'
  | 'ac_technician'
  | 'cleaner'
  | 'driver'
  | 'laborer'
  | 'gardener'
  | 'tailor'
  | 'mechanic'
  | 'locksmith'

export const WORKER_CATEGORIES: Record<WorkerCategory, { en: string; ur: string; icon: string }> = {
  plumber: { en: 'Plumber', ur: 'پلمبر', icon: '🔧' },
  electrician: { en: 'Electrician', ur: 'بجلی کار', icon: '⚡' },
  carpenter: { en: 'Carpenter', ur: 'تیمر', icon: '🪚' },
  painter: { en: 'Painter', ur: 'پینٹر', icon: '🎨' },
  mason: { en: 'Mason', ur: 'راج', icon: '🧱' },
  welder: { en: 'Welder', ur: 'ولڈر', icon: '🔥' },
  ac_technician: { en: 'AC Technician', ur: 'اے سی ٹیکنیشن', icon: '❄️' },
  cleaner: { en: 'Cleaner', ur: 'صاف کرنے والا', icon: '🧹' },
  driver: { en: 'Driver', ur: 'ڈرائیور', icon: '🚗' },
  laborer: { en: 'Laborer', ur: 'مزدور', icon: '👷' },
  gardener: { en: 'Gardener', ur: 'باغوان', icon: '🌿' },
  tailor: { en: 'Tailor', ur: 'درزی', icon: '🧵' },
  mechanic: { en: 'Mechanic', ur: 'میکانک', icon: '🔩' },
  locksmith: { en: 'Locksmith', ur: 'قفل ساز', icon: '🔑' },
}

export type JobStatus = 'open' | 'in_progress' | 'completed' | 'cancelled'
export type BidStatus = 'pending' | 'accepted' | 'rejected'
export type NotificationType = 'job_match' | 'bid_accepted' | 'bid_rejected' | 'payment' | 'system' | 'sos'
export type TransactionType = 'earning' | 'withdrawal' | 'commission'
export type WithdrawalMethod = 'jazzcash' | 'easypaisa' | 'bank'
export type AlertType = 'emergency' | 'harassment' | 'accident' | 'theft' | 'other'

export interface Worker {
  id: string
  name: string
  phone: string
  cnic: string
  city: string
  area?: string
  category: WorkerCategory
  skills: string[]
  bio?: string
  experience_years: number
  avatar_url?: string
  rating: number
  total_reviews: number
  is_verified: boolean
  wallet_balance: number
  total_earnings: number
  created_at: string
}

export interface Job {
  id: string
  title: string
  description: string
  category: WorkerCategory
  budget_min: number
  budget_max: number
  city: string
  area: string
  address?: string
  urgency: 'normal' | 'urgent' | 'emergency'
  status: JobStatus
  employer_id: string
  employer_name: string
  employer_phone?: string
  employer_rating?: number
  requirements?: string[]
  images?: string[]
  worker_id?: string
  worker_bid?: number
  created_at: string
  updated_at?: string
  scheduled_date?: string
  distance?: string
}

export interface Bid {
  id: string
  job_id: string
  worker_id: string
  amount: number
  message: string
  status: BidStatus
  created_at: string
  job?: Job
}

export interface Transaction {
  id: string
  worker_id: string
  type: TransactionType
  amount: number
  description: string
  reference_id?: string
  method?: string
  created_at: string
}

export interface Notification {
  id: string
  worker_id: string
  type: NotificationType
  title: string
  message: string
  is_read: boolean
  data?: Record<string, unknown>
  created_at: string
}

export interface Review {
  id: string
  worker_id: string
  employer_id: string
  employer_name: string
  job_id: string
  rating: number
  comment: string
  created_at: string
}

export interface WithdrawalRequest {
  id: string
  worker_id: string
  amount: number
  method: WithdrawalMethod
  account_number: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}
