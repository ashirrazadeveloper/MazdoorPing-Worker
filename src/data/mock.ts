import { Worker, Job, Transaction, Notification, Review, Bid } from '@/types'

// ============================================
// Mock Worker Data
// ============================================
export const mockWorker: Worker = {
  id: 'worker-001',
  name: 'Muhammad Ali',
  phone: '03001234567',
  cnic: '35201-1234567-1',
  city: 'Lahore',
  area: 'Gulberg III',
  category: 'electrician',
  skills: ['Wiring', 'Panel Installation', 'AC Wiring', 'Generator Repair', 'UPS Installation'],
  bio: 'Experienced electrician with 8 years of expertise in residential and commercial electrical work.',
  experience_years: 8,
  avatar_url: undefined,
  rating: 4.7,
  total_reviews: 34,
  is_verified: true,
  wallet_balance: 12500,
  total_earnings: 285000,
  created_at: '2024-01-15T10:00:00Z',
}

// ============================================
// Mock Jobs
// ============================================
export const mockJobs: Job[] = [
  {
    id: 'job-001',
    title: 'Complete House Wiring',
    description: 'Need complete electrical wiring for a 5 marla house. Include switch boards, fans, and light points. Material will be provided by the owner. Need experienced electrician who can finish within 3 days.',
    category: 'electrician',
    budget_min: 15000,
    budget_max: 20000,
    city: 'Lahore',
    area: 'DHA Phase 5',
    address: 'House 42, Street 12, DHA Phase 5',
    urgency: 'normal',
    status: 'open',
    employer_id: 'emp-001',
    employer_name: 'Ahmed Khan',
    employer_phone: '03211234567',
    employer_rating: 4.5,
    requirements: ['5+ years experience', 'Own tools', 'Can start immediately'],
    created_at: '2024-04-29T08:00:00Z',
    distance: '3.5 km',
  },
  {
    id: 'job-002',
    title: 'Urgent: AC Repair',
    description: 'Split AC not cooling properly. Need urgent repair. Model: Gree 1.5 ton inverter. Located on 3rd floor, lift available.',
    category: 'ac_technician',
    budget_min: 2000,
    budget_max: 3500,
    city: 'Lahore',
    area: 'Gulberg II',
    urgency: 'urgent',
    status: 'open',
    employer_id: 'emp-002',
    employer_name: 'Fatima Zahra',
    employer_phone: '03331234567',
    employer_rating: 4.8,
    requirements: ['AC repair experience', 'Gas refilling kit'],
    created_at: '2024-04-29T09:30:00Z',
    distance: '1.2 km',
  },
  {
    id: 'job-003',
    title: 'Bathroom Plumbing Work',
    description: 'Leaking pipes in two bathrooms need replacement. Also need new tap installations. Material cost will be separate.',
    category: 'plumber',
    budget_min: 5000,
    budget_max: 8000,
    city: 'Lahore',
    area: 'Johar Town',
    urgency: 'normal',
    status: 'open',
    employer_id: 'emp-003',
    employer_name: 'Imran Ahmed',
    employer_rating: 4.2,
    created_at: '2024-04-29T07:00:00Z',
    distance: '5.1 km',
  },
  {
    id: 'job-004',
    title: 'Furniture Repair & Assembly',
    description: 'Need to repair 3 wardrobes and assemble 2 new bed frames. All material is available on site.',
    category: 'carpenter',
    budget_min: 8000,
    budget_max: 12000,
    city: 'Lahore',
    area: 'Model Town',
    urgency: 'normal',
    status: 'open',
    employer_id: 'emp-004',
    employer_name: 'Sara Malik',
    employer_rating: 4.6,
    created_at: '2024-04-28T14:00:00Z',
    distance: '4.0 km',
  },
  {
    id: 'job-005',
    title: 'Emergency: Power Outage',
    description: 'Complete power outage in my flat. No tripping visible. Need immediate inspection and repair. 2nd floor flat.',
    category: 'electrician',
    budget_min: 3000,
    budget_max: 5000,
    city: 'Lahore',
    area: 'Gulberg III',
    urgency: 'emergency',
    status: 'open',
    employer_id: 'emp-005',
    employer_name: 'Usman Tariq',
    employer_phone: '03451234567',
    employer_rating: 4.0,
    requirements: ['Emergency availability', 'Can come within 1 hour'],
    created_at: '2024-04-29T11:00:00Z',
    distance: '0.5 km',
  },
  {
    id: 'job-006',
    title: 'Wall Painting - 2 Rooms',
    description: 'Need to paint 2 bedrooms (14x12 each) with emulsion paint. Walls are already plastered. Paint and tools to be arranged by the painter.',
    category: 'painter',
    budget_min: 10000,
    budget_max: 15000,
    city: 'Lahore',
    area: 'Cantt Area',
    urgency: 'normal',
    status: 'open',
    employer_id: 'emp-006',
    employer_name: 'Zainab Noor',
    employer_rating: 4.9,
    created_at: '2024-04-28T10:00:00Z',
    distance: '6.2 km',
  },
  {
    id: 'job-007',
    title: 'Gate Welding & Repair',
    description: 'Main gate welding work. Need to fix broken hinges and reinforce the gate frame. Also need a small window grill.',
    category: 'welder',
    budget_min: 4000,
    budget_max: 6000,
    city: 'Lahore',
    area: 'Iqbal Town',
    urgency: 'normal',
    status: 'open',
    employer_id: 'emp-007',
    employer_name: 'Hassan Raza',
    employer_rating: 4.3,
    created_at: '2024-04-29T06:00:00Z',
    distance: '7.8 km',
  },
  {
    id: 'job-008',
    title: 'House Deep Cleaning',
    description: 'Complete deep cleaning of a 10 marla house before moving in. 5 bedrooms, 3 bathrooms, kitchen, and lounge. Need professional cleaning.',
    category: 'cleaner',
    budget_min: 6000,
    budget_max: 9000,
    city: 'Lahore',
    area: 'Bahria Town',
    urgency: 'normal',
    status: 'open',
    employer_id: 'emp-008',
    employer_name: 'Ayesha Siddiqui',
    employer_rating: 4.7,
    created_at: '2024-04-28T16:00:00Z',
    distance: '9.3 km',
  },
]

// ============================================
// Mock Active Jobs (My Jobs)
// ============================================
export const mockActiveJobs: Job[] = [
  {
    id: 'job-101',
    title: 'Office Wiring Installation',
    description: 'Complete wiring for a small office space. 3 rooms with AC, lights, and power outlets.',
    category: 'electrician',
    budget_min: 25000,
    budget_max: 30000,
    city: 'Lahore',
    area: 'Liberty Market',
    urgency: 'normal',
    status: 'in_progress',
    employer_id: 'emp-101',
    employer_name: 'Tariq Enterprises',
    employer_phone: '03219876543',
    employer_rating: 4.4,
    worker_id: 'worker-001',
    worker_bid: 27000,
    created_at: '2024-04-27T09:00:00Z',
    scheduled_date: '2024-04-27',
  },
]

export const mockPendingBids: Bid[] = [
  {
    id: 'bid-001',
    job_id: 'job-002',
    worker_id: 'worker-001',
    amount: 3000,
    message: 'I can come right away. I have all the tools and gas kit ready.',
    status: 'pending',
    created_at: '2024-04-29T10:00:00Z',
    job: mockJobs[1],
  },
  {
    id: 'bid-002',
    job_id: 'job-004',
    worker_id: 'worker-001',
    amount: 10000,
    message: 'Experienced in furniture assembly and repair. Can start tomorrow.',
    status: 'pending',
    created_at: '2024-04-28T15:00:00Z',
    job: mockJobs[3],
  },
]

export const mockCompletedJobs: Job[] = [
  {
    id: 'job-201',
    title: 'Fan Installation - 5 Fans',
    description: 'Install 5 ceiling fans in a newly constructed house.',
    category: 'electrician',
    budget_min: 3000,
    budget_max: 5000,
    city: 'Lahore',
    area: 'Gulberg I',
    urgency: 'normal',
    status: 'completed',
    employer_id: 'emp-201',
    employer_name: 'Naveed Akhtar',
    employer_rating: 4.6,
    worker_id: 'worker-001',
    worker_bid: 4000,
    created_at: '2024-04-20T08:00:00Z',
  },
  {
    id: 'job-202',
    title: 'Short Circuit Repair',
    description: 'Fix short circuit issue in living room wiring.',
    category: 'electrician',
    budget_min: 1500,
    budget_max: 3000,
    city: 'Lahore',
    area: 'Gulberg III',
    urgency: 'normal',
    status: 'completed',
    employer_id: 'emp-202',
    employer_name: 'Kamran Sheikh',
    employer_rating: 4.1,
    worker_id: 'worker-001',
    worker_bid: 2500,
    created_at: '2024-04-18T14:00:00Z',
  },
  {
    id: 'job-203',
    title: 'UPS Installation',
    description: 'Install 3kVA UPS with battery connection and wiring.',
    category: 'electrician',
    budget_min: 4000,
    budget_max: 6000,
    city: 'Lahore',
    area: 'MM Alam Road',
    urgency: 'normal',
    status: 'completed',
    employer_id: 'emp-203',
    employer_name: 'Bilal Maqsood',
    employer_rating: 4.9,
    worker_id: 'worker-001',
    worker_bid: 5000,
    created_at: '2024-04-15T10:00:00Z',
  },
]

export const mockCancelledJobs: Job[] = [
  {
    id: 'job-301',
    title: 'Generator Repair',
    description: 'Repair Honda generator - not starting.',
    category: 'electrician',
    budget_min: 2000,
    budget_max: 4000,
    city: 'Lahore',
    area: 'Garden Town',
    urgency: 'normal',
    status: 'cancelled',
    employer_id: 'emp-301',
    employer_name: 'Aslam Bhatti',
    employer_rating: 3.5,
    worker_id: 'worker-001',
    worker_bid: 3000,
    created_at: '2024-04-22T11:00:00Z',
  },
]

// ============================================
// Mock Transactions
// ============================================
export const mockTransactions: Transaction[] = [
  { id: 'tx-001', worker_id: 'worker-001', type: 'earning', amount: 27000, description: 'Office Wiring Installation - Tariq Enterprises', reference_id: 'job-101', created_at: '2024-04-29T12:00:00Z' },
  { id: 'tx-002', worker_id: 'worker-001', type: 'commission', amount: -2700, description: 'Platform Commission (10%)', reference_id: 'job-101', created_at: '2024-04-29T12:00:00Z' },
  { id: 'tx-003', worker_id: 'worker-001', type: 'earning', amount: 4000, description: 'Fan Installation - Naveed Akhtar', reference_id: 'job-201', created_at: '2024-04-20T18:00:00Z' },
  { id: 'tx-004', worker_id: 'worker-001', type: 'commission', amount: -400, description: 'Platform Commission (10%)', reference_id: 'job-201', created_at: '2024-04-20T18:00:00Z' },
  { id: 'tx-005', worker_id: 'worker-001', type: 'withdrawal', amount: -5000, description: 'Withdrawal - JazzCash', method: 'jazzcash', created_at: '2024-04-19T09:00:00Z' },
  { id: 'tx-006', worker_id: 'worker-001', type: 'earning', amount: 2500, description: 'Short Circuit Repair - Kamran Sheikh', reference_id: 'job-202', created_at: '2024-04-18T17:00:00Z' },
  { id: 'tx-007', worker_id: 'worker-001', type: 'commission', amount: -250, description: 'Platform Commission (10%)', reference_id: 'job-202', created_at: '2024-04-18T17:00:00Z' },
  { id: 'tx-008', worker_id: 'worker-001', type: 'earning', amount: 5000, description: 'UPS Installation - Bilal Maqsood', reference_id: 'job-203', created_at: '2024-04-15T16:00:00Z' },
  { id: 'tx-009', worker_id: 'worker-001', type: 'commission', amount: -500, description: 'Platform Commission (10%)', reference_id: 'job-203', created_at: '2024-04-15T16:00:00Z' },
  { id: 'tx-010', worker_id: 'worker-001', type: 'withdrawal', amount: -10000, description: 'Withdrawal - EasyPaisa', method: 'easypaisa', created_at: '2024-04-10T11:00:00Z' },
]

// ============================================
// Mock Notifications
// ============================================
export const mockNotifications: Notification[] = [
  { id: 'notif-001', worker_id: 'worker-001', type: 'bid_accepted', title: 'Bid Accepted! 🎉', message: 'Tariq Enterprises accepted your bid of PKR 27,000 for Office Wiring Installation.', is_read: false, created_at: '2024-04-29T12:00:00Z' },
  { id: 'notif-002', worker_id: 'worker-001', type: 'job_match', title: 'New Job Match', message: 'Emergency: Power Outage in Gulberg III - just 0.5 km away!', is_read: false, created_at: '2024-04-29T11:00:00Z' },
  { id: 'notif-003', worker_id: 'worker-001', type: 'payment', title: 'Payment Received! 💰', message: 'PKR 24,300 received for Office Wiring Installation.', is_read: false, created_at: '2024-04-29T12:05:00Z' },
  { id: 'notif-004', worker_id: 'worker-001', type: 'job_match', title: 'New Job Available', message: 'Urgent: AC Repair in Gulberg II - budget PKR 2,000-3,500.', is_read: true, created_at: '2024-04-29T09:30:00Z' },
  { id: 'notif-005', worker_id: 'worker-001', type: 'system', title: 'Profile Verified ✅', message: 'Your profile has been verified. You will now appear in employer search results.', is_read: true, created_at: '2024-04-28T14:00:00Z' },
  { id: 'notif-006', worker_id: 'worker-001', type: 'bid_rejected', title: 'Bid Rejected', message: 'Your bid for Generator Repair was not accepted by the employer.', is_read: true, created_at: '2024-04-23T10:00:00Z' },
  { id: 'notif-007', worker_id: 'worker-001', type: 'payment', title: 'Withdrawal Processed', message: 'Your withdrawal of PKR 5,000 to JazzCash has been processed.', is_read: true, created_at: '2024-04-19T10:00:00Z' },
  { id: 'notif-008', worker_id: 'worker-001', type: 'system', title: 'Welcome to MazdoorPing! 🎊', message: 'Your worker account has been created. Complete your profile to start receiving job matches.', is_read: true, created_at: '2024-01-15T10:00:00Z' },
]

// ============================================
// Mock Reviews
// ============================================
export const mockReviews: Review[] = [
  { id: 'rev-001', worker_id: 'worker-001', employer_id: 'emp-201', employer_name: 'Naveed Akhtar', job_id: 'job-201', rating: 5, comment: 'Excellent work! Very professional and punctual. Installed all 5 fans perfectly. Will hire again.', created_at: '2024-04-21T08:00:00Z' },
  { id: 'rev-002', worker_id: 'worker-001', employer_id: 'emp-202', employer_name: 'Kamran Sheikh', job_id: 'job-202', rating: 4, comment: 'Good work, fixed the short circuit quickly. Slightly delayed but overall satisfied.', created_at: '2024-04-19T09:00:00Z' },
  { id: 'rev-003', worker_id: 'worker-001', employer_id: 'emp-203', employer_name: 'Bilal Maqsood', job_id: 'job-203', rating: 5, comment: 'Best electrician in Lahore! Very knowledgeable and clean work. UPS running perfectly.', created_at: '2024-04-16T14:00:00Z' },
  { id: 'rev-004', worker_id: 'worker-001', employer_id: 'emp-204', employer_name: 'Zubair Ahmad', job_id: 'job-204', rating: 5, comment: 'Ali did an amazing job with our complete house wiring. Very neat and professional. Highly recommend!', created_at: '2024-04-10T11:00:00Z' },
  { id: 'rev-005', worker_id: 'worker-001', employer_id: 'emp-205', employer_name: 'Tahir Hussain', job_id: 'job-205', rating: 4, comment: 'Good work on the switch board replacement. Reasonable pricing too.', created_at: '2024-04-05T16:00:00Z' },
  { id: 'rev-006', worker_id: 'worker-001', employer_id: 'emp-206', employer_name: 'Farhan Ali', job_id: 'job-206', rating: 3, comment: 'Work was okay but took longer than expected. Communication could be better.', created_at: '2024-03-28T10:00:00Z' },
  { id: 'rev-007', worker_id: 'worker-001', employer_id: 'emp-207', employer_name: 'Waqar Javed', job_id: 'job-207', rating: 5, comment: 'Fantastic service! Fixed our commercial panel in record time. Very skilled professional.', created_at: '2024-03-20T12:00:00Z' },
]

// ============================================
// Helper: Get today's earnings
// ============================================
export function getTodayEarnings(): number {
  const today = new Date().toDateString()
  return mockTransactions
    .filter(t => t.type === 'earning' && new Date(t.created_at).toDateString() === today)
    .reduce((sum, t) => sum + t.amount, 0)
}

// Fallback for today earnings in mock data
export function getMockTodayEarnings(): number {
  return 27000 // Office Wiring job from today
}
