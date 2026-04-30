import { supabase } from './supabase'
import type { Worker, Job, Bid, Transaction, Notification, Review, Category, SOSAlert, Withdrawal } from '@/types'

// ============================================
// Categories
// ============================================
export async function getCategories(): Promise<Category[]> {
  const { data } = await supabase.from('categories').select('*').eq('is_active', true).order('name')
  return data || []
}

// ============================================
// Worker Profile
// ============================================
export async function getWorkerProfile(userId: string): Promise<Worker | null> {
  const { data } = await supabase.from('workers')
    .select('*, category:categories(*)')
    .eq('id', userId)
    .single()
  return data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateWorkerProfile(userId: string, updates: Record<string, any>): Promise<Worker | null> {
  const { data } = await supabase.from('workers').update(updates).eq('id', userId).select('*, category:categories(*)').single()
  return data
}

// ============================================
// Jobs
// ============================================
export async function getAvailableJobs(filters?: { category_id?: string; city?: string; search?: string }): Promise<Job[]> {
  let query = supabase.from('jobs')
    .select('*, category:categories(*), employer:employers!employer_id(id, full_name, rating)')
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  if (filters?.category_id) query = query.eq('category_id', filters.category_id)
  if (filters?.city) query = query.eq('city', filters.city)
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,area.ilike.%${filters.search}%`)
  }

  const { data } = await query
  return data || []
}

export async function getJobById(jobId: string): Promise<Job | null> {
  const { data } = await supabase.from('jobs')
    .select('*, category:categories(*), employer:employers!employer_id(*)')
    .eq('id', jobId)
    .single()
  return data
}

// Worker's own jobs
export async function getMyJobs(workerId: string): Promise<Job[]> {
  const { data } = await supabase.from('jobs')
    .select('*, category:categories(*), employer:employers!employer_id(id, full_name, rating)')
    .eq('worker_id', workerId)
    .order('created_at', { ascending: false })
  return data || []
}

// ============================================
// Bids
// ============================================
export async function getMyBids(workerId: string): Promise<Bid[]> {
  const { data } = await supabase.from('bids')
    .select('*, job:jobs(*, category:categories(*), employer:employers!employer_id(id, full_name, rating))')
    .eq('worker_id', workerId)
    .order('created_at', { ascending: false })
  return data || []
}

export async function placeBid(jobId: string, workerId: string, amount: number, message: string): Promise<Bid | null> {
  const { data } = await supabase.from('bids').insert({
    job_id: jobId,
    worker_id: workerId,
    amount,
    message
  }).select().single()
  return data
}

// ============================================
// Wallet / Transactions
// ============================================
export async function getTransactions(workerId: string): Promise<Transaction[]> {
  const { data } = await supabase.from('transactions')
    .select('*')
    .eq('worker_id', workerId)
    .order('created_at', { ascending: false })
  return data || []
}

export async function requestWithdrawal(workerId: string, amount: number, method: string, accountDetails: string): Promise<Withdrawal | null> {
  const { data } = await supabase.from('withdrawals').insert({
    worker_id: workerId,
    amount,
    method,
    account_details: accountDetails
  }).select().single()
  return data
}

// ============================================
// Notifications
// ============================================
export async function getNotifications(userId: string): Promise<Notification[]> {
  const { data } = await supabase.from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return data || []
}

export async function markNotificationRead(notifId: string): Promise<void> {
  await supabase.from('notifications').update({ is_read: true }).eq('id', notifId)
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false)
}

// ============================================
// Reviews
// ============================================
export async function getWorkerReviews(workerId: string): Promise<Review[]> {
  const { data } = await supabase.from('reviews')
    .select('*, employer:employers!employer_id(id, full_name)')
    .eq('worker_id', workerId)
    .order('created_at', { ascending: false })
  return data || []
}

// ============================================
// Worker Skills
// ============================================
export async function getWorkerSkills(workerId: string): Promise<string[]> {
  const { data } = await supabase.from('worker_skills')
    .select('skill')
    .eq('worker_id', workerId)
  return (data || []).map(d => d.skill)
}

export async function updateWorkerSkills(workerId: string, skills: string[]): Promise<void> {
  await supabase.from('worker_skills').delete().eq('worker_id', workerId)
  if (skills.length > 0) {
    await supabase.from('worker_skills').insert(
      skills.map(skill => ({ worker_id: workerId, skill }))
    )
  }
}

// ============================================
// SOS Alerts
// ============================================
export async function createSOSAlert(workerId: string, alertData: {
  type: string
  latitude: number
  longitude: number
  address: string
  message: string
  emergency_contact: string
  job_id?: string
}): Promise<SOSAlert | null> {
  const { data } = await supabase.from('sos_alerts').insert({
    worker_id: workerId,
    ...alertData
  }).select().single()
  return data
}

export async function getMySOSAlerts(workerId: string): Promise<SOSAlert[]> {
  const { data } = await supabase.from('sos_alerts')
    .select('*')
    .eq('worker_id', workerId)
    .order('created_at', { ascending: false })
  return data || []
}

// ============================================
// Auth helpers
// ============================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function signUpWithPhone(phone: string, password: string, metadata: Record<string, any>) {
  const { data, error } = await supabase.auth.signUp({
    phone,
    password,
    options: { data: metadata }
  })
  return { data, error }
}

export async function signInWithPhone(phone: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    phone,
    password
  })
  return { data, error }
}

export async function signOut() {
  await supabase.auth.signOut()
}
