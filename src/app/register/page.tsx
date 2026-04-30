'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Eye, EyeOff, User, CreditCard, MapPin, CheckCircle2, HardHat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { WORKER_CATEGORIES, type WorkerCategory } from '@/types'

const CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala']

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<WorkerCategory[]>([])

  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    cnic: '',
    city: 'Lahore',
    experience: '5',
    bio: '',
    skills: '',
  })

  const updateForm = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const toggleCategory = (cat: WorkerCategory) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const handleNext = () => {
    setError('')
    if (step === 1) {
      if (!form.name || !form.phone || !form.password) {
        setError('Please fill in all required fields')
        return
      }
      if (form.phone.length < 11) {
        setError('Please enter a valid phone number')
        return
      }
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match')
        return
      }
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
      setStep(2)
    }
  }

  const handleBack = () => {
    setError('')
    setStep(1)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (selectedCategories.length === 0) {
        setError('Please select at least one category')
        setLoading(false)
        return
      }
      if (!form.cnic || form.cnic.replace(/-/g, '').length < 13) {
        setError('Please enter a valid CNIC number')
        setLoading(false)
        return
      }

      // Simulate registration delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      if (typeof window !== 'undefined') {
        localStorage.setItem('mazdoorping_user', JSON.stringify({
          id: 'worker-new',
          name: form.name,
          phone: form.phone,
          isAuthenticated: true,
        }))
      }
      router.push('/dashboard')
    } catch {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col">
      {/* Green Gradient Header */}
      <div className="relative bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 px-6 pt-14 pb-14 overflow-hidden">
        <div className="absolute -top-10 -right-10 h-40 w-40 bg-white/10 rounded-full" />
        <div className="absolute -bottom-16 -left-10 h-48 w-48 bg-white/5 rounded-full" />

        <div className="max-w-md mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-3 border border-white/20">
            <HardHat className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Create Account</h1>
          <p className="text-green-100 text-sm mt-1">Join thousands of workers on MazdoorPing</p>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-5">
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-12 bg-white' : 'w-6 bg-white/40'}`} />
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? 'w-12 bg-white' : 'w-6 bg-white/40'}`} />
          </div>
          <p className="text-green-100 text-xs mt-2">Step {step} of 2</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 -mt-6">
        <div className="bg-white rounded-3xl shadow-xl shadow-black/5 p-6 max-w-md mx-auto border border-border/30 animate-fade-in">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4 animate-fade-in">
              {error}
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground mb-1">Personal Information</h2>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-semibold">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Muhammad Ali"
                    value={form.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    className="pl-10 h-11 rounded-xl"
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-phone" className="text-xs font-semibold">Phone Number *</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="text-base">🇵🇰</span>
                    <span className="text-xs text-muted-foreground">+92</span>
                  </div>
                  <Input
                    id="reg-phone"
                    type="tel"
                    placeholder="03XX-XXXXXXX"
                    value={form.phone}
                    onChange={(e) => updateForm('phone', e.target.value)}
                    className="pl-[68px] h-11 rounded-xl"
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-city" className="text-xs font-semibold">City</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    value={form.city}
                    onChange={(e) => updateForm('city', e.target.value)}
                    className="w-full h-11 pl-10 pr-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-password" className="text-xs font-semibold">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={(e) => updateForm('password', e.target.value)}
                    className="pl-10 pr-10 h-11 rounded-xl"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-confirm-password" className="text-xs font-semibold">Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reg-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={(e) => updateForm('confirmPassword', e.target.value)}
                    className="pl-10 pr-10 h-11 rounded-xl"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button onClick={handleNext} className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-600/25" size="lg">
                Next Step
              </Button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <h2 className="text-lg font-bold text-foreground mb-1">Work Details</h2>

              <div className="space-y-2">
                <Label htmlFor="cnic" className="text-xs font-semibold">CNIC Number *</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cnic"
                    placeholder="XXXXX-XXXXXXX-X"
                    value={form.cnic}
                    onChange={(e) => updateForm('cnic', e.target.value)}
                    className="pl-10 h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Select Your Category *</Label>
                <p className="text-[11px] text-muted-foreground">Choose the type of work you do</p>
                <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                  {(Object.keys(WORKER_CATEGORIES) as WorkerCategory[]).map((cat) => {
                    const info = WORKER_CATEGORIES[cat]
                    const isSelected = selectedCategories.includes(cat)
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-sm transition-all duration-200 ${
                          isSelected
                            ? 'border-primary bg-green-50 text-primary shadow-sm'
                            : 'border-border bg-background hover:border-primary/40 text-foreground'
                        }`}
                      >
                        <span className="text-base">{info.icon}</span>
                        <div className="text-left min-w-0 flex-1">
                          <span className="text-xs font-medium block truncate">{info.en}</span>
                          <span className="text-[10px] text-muted-foreground block">{info.ur}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="h-3.5 w-3.5 ml-auto shrink-0 text-primary" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience (years)</Label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={form.experience}
                    onChange={(e) => updateForm('experience', e.target.value)}
                    className="flex-1 h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-sm font-bold text-primary w-8 text-center">{form.experience}</span>
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Fresher</span>
                  <span>Expert</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input
                  id="skills"
                  placeholder="Wiring, Panel Installation, AC Repair..."
                  value={form.skills}
                  onChange={(e) => updateForm('skills', e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  placeholder="Tell employers about yourself and your experience..."
                  value={form.bio}
                  onChange={(e) => updateForm('bio', e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={handleBack} className="flex-1 h-12 rounded-xl font-medium">
                  Back
                </Button>
                <Button type="submit" className="flex-1 h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-600/25" disabled={loading}>
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Login link */}
        <div className="text-center mt-4 mb-8">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
