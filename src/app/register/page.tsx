'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Eye, EyeOff, User, CreditCard, MapPin, CheckCircle2, HardHat, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signUpWithPhone, getCategories } from '@/lib/services'
import { supabase } from '@/lib/supabase'
import type { Category } from '@/types'

const CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala']

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')

  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    cnic: '',
    city: 'Lahore',
    experience: '5',
    bio: '',
    area: '',
    baseRate: '500',
  })

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error)
  }, [])

  const updateForm = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const addSkill = () => {
    const trimmed = skillInput.trim()
    if (trimmed && !skills.includes(trimmed) && skills.length < 10) {
      setSkills(prev => [...prev, trimmed])
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(prev => prev.filter(s => s !== skill))
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
      if (!selectedCategoryId) {
        setError('Please select a category')
        setLoading(false)
        return
      }
      if (!form.cnic || form.cnic.replace(/-/g, '').length < 13) {
        setError('Please enter a valid CNIC number')
        setLoading(false)
        return
      }

      const formattedPhone = form.phone.startsWith('+92') ? form.phone : `+92${form.phone.replace(/^0/, '')}`

      // Step 1: Sign up with Supabase Auth
      const { data: authData, error: authError } = await signUpWithPhone(formattedPhone, form.password, {
        full_name: form.name,
        role: 'worker',
        phone: formattedPhone,
      })

      if (authError) {
        setError(authError.message || 'Registration failed. Please try again.')
        setLoading(false)
        return
      }

      const authUser = authData.user
      if (!authUser) {
        setError('Registration failed. No user created.')
        setLoading(false)
        return
      }

      // Step 2: Insert into workers table with status='pending'
      const { error: workerError } = await supabase.from('workers').insert({
        id: authUser.id,
        category_id: selectedCategoryId,
        city: form.city,
        area: form.area || null,
        cnic: form.cnic,
        bio: form.bio || null,
        experience_years: parseInt(form.experience) || 0,
        base_rate: parseInt(form.baseRate) || 500,
        status: 'pending',
        is_verified: false,
        is_available: true,
      })

      if (workerError) {
        console.error('Worker insert error:', workerError)
        setError('Registration failed. Could not create worker profile.')
        setLoading(false)
        return
      }

      // Step 3: Insert skills
      if (skills.length > 0) {
        await supabase.from('worker_skills').insert(
          skills.map(skill => ({ worker_id: authUser.id, skill }))
        )
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err) {
      console.error('Registration error:', err)
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center animate-fade-in">
          <div className="h-20 w-20 rounded-3xl bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground mb-2">Registration Successful!</h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Your account has been created and is pending verification. You can now login with your credentials.
          </p>
          <p className="text-xs text-green-600 font-medium">Redirecting to login...</p>
        </div>
      </div>
    )
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
                  {categories.map((cat) => {
                    const isSelected = selectedCategoryId === cat.id
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategoryId(isSelected ? '' : cat.id)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-sm transition-all duration-200 ${
                          isSelected
                            ? 'border-primary bg-green-50 text-primary shadow-sm'
                            : 'border-border bg-background hover:border-primary/40 text-foreground'
                        }`}
                      >
                        <span className="text-base">{cat.icon || '🔧'}</span>
                        <div className="text-left min-w-0 flex-1">
                          <span className="text-xs font-medium block truncate">{cat.name}</span>
                          {cat.name_ur && <span className="text-[10px] text-muted-foreground block">{cat.name_ur}</span>}
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
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  placeholder="e.g. Gulberg III"
                  value={form.area}
                  onChange={(e) => updateForm('area', e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <div className="flex gap-2">
                  <Input
                    id="skills"
                    placeholder="Add a skill..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
                    className="h-11 rounded-xl flex-1"
                  />
                  <Button type="button" variant="outline" onClick={addSkill} className="h-11 w-11 rounded-xl p-0 shrink-0">
                    +
                  </Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {skills.map(skill => (
                      <span key={skill} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
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

              <div className="space-y-2">
                <Label htmlFor="baseRate">Base Rate (PKR/day)</Label>
                <Input
                  id="baseRate"
                  type="number"
                  placeholder="500"
                  value={form.baseRate}
                  onChange={(e) => updateForm('baseRate', e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={handleBack} className="flex-1 h-12 rounded-xl font-medium">
                  Back
                </Button>
                <Button type="submit" className="flex-1 h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-600/25" disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
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
