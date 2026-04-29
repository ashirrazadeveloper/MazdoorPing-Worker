'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Phone, Lock, Eye, EyeOff, User, CreditCard, MapPin, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { WORKER_CATEGORIES, type WorkerCategory } from '@/types'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<WorkerCategory[]>([])

  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    cnic: '',
    city: 'Lahore',
    experience: '',
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
      if (!form.cnic || form.cnic.length < 13) {
        setError('Please enter a valid CNIC number')
        setLoading(false)
        return
      }

      // Simulate registration delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      router.push('/')
    } catch {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-primary px-6 pt-12 pb-10 rounded-b-[2rem]">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
            <span className="text-3xl">👷</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-green-100 text-sm mt-1">Join thousands of workers on MazdoorPing</p>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className={`h-1.5 rounded-full transition-all ${step === 1 ? 'w-10 bg-white' : 'w-6 bg-white/50'}`} />
            <div className={`h-1.5 rounded-full transition-all ${step === 2 ? 'w-10 bg-white' : 'w-6 bg-white/50'}`} />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground mb-1">Personal Information</h2>
              <p className="text-sm text-muted-foreground mb-4">Step 1 of 2</p>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Muhammad Ali"
                    value={form.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    className="pl-10"
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reg-phone"
                    type="tel"
                    placeholder="03XX-XXXXXXX"
                    value={form.phone}
                    onChange={(e) => updateForm('phone', e.target.value)}
                    className="pl-10"
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={(e) => updateForm('password', e.target.value)}
                    className="pl-10 pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="city"
                    placeholder="Lahore"
                    value={form.city}
                    onChange={(e) => updateForm('city', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button onClick={handleNext} className="w-full h-12 text-base" size="lg">
                Next Step
              </Button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <h2 className="text-lg font-bold text-foreground mb-1">Work Details</h2>
              <p className="text-sm text-muted-foreground mb-4">Step 2 of 2</p>

              <div className="space-y-2">
                <Label htmlFor="cnic">CNIC Number *</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cnic"
                    placeholder="XXXXX-XXXXXXX-X"
                    value={form.cnic}
                    onChange={(e) => updateForm('cnic', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Experience (years)</Label>
                <Input
                  type="number"
                  placeholder="5"
                  value={form.experience}
                  onChange={(e) => updateForm('experience', e.target.value)}
                  min="0"
                  max="50"
                />
              </div>

              <div className="space-y-2">
                <Label>Select Your Skills / Categories *</Label>
                <p className="text-xs text-muted-foreground">Choose one or more categories you work in</p>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {(Object.keys(WORKER_CATEGORIES) as WorkerCategory[]).map((cat) => {
                    const info = WORKER_CATEGORIES[cat]
                    const isSelected = selectedCategories.includes(cat)
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm transition-colors ${
                          isSelected
                            ? 'border-primary bg-green-50 text-primary'
                            : 'border-border bg-background hover:border-primary/50 text-foreground'
                        }`}
                      >
                        <span>{info.icon}</span>
                        <span className="truncate text-xs">{info.en}</span>
                        {isSelected && <CheckCircle2 className="h-3.5 w-3.5 ml-auto shrink-0 text-primary" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={handleBack} className="flex-1 h-12">
                  Back
                </Button>
                <Button type="submit" className="flex-1 h-12 text-base" disabled={loading}>
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
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
