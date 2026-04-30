'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Phone, Lock, Eye, EyeOff, HardHat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signInWithPhone } from '@/lib/services'

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!phone || !password) {
        setError('Please enter phone number and password')
        setLoading(false)
        return
      }

      const formattedPhone = phone.startsWith('+92') ? phone : `+92${phone.replace(/^0/, '')}`

      const { error: authError } = await signInWithPhone(formattedPhone, password)

      if (authError) {
        setError(authError.message || 'Login failed. Please check your credentials.')
        setLoading(false)
        return
      }

      router.push('/dashboard')
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col">
      {/* Green Gradient Header */}
      <div className="relative bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 px-6 pt-14 pb-20 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 h-40 w-40 bg-white/10 rounded-full" />
        <div className="absolute -bottom-16 -left-10 h-48 w-48 bg-white/5 rounded-full" />
        <div className="absolute top-8 right-20 h-16 w-16 bg-white/5 rounded-full" />

        <div className="max-w-md mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-5 shadow-lg border border-white/20">
            <HardHat className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">MazdoorPing</h1>
          <p className="text-green-100 text-sm mt-2 font-medium">Find work. Earn daily. Build your future.</p>
          <p className="text-green-200/80 text-xs mt-1">پگاڑ کی تلاش کریں۔ روزانہ کمائیں۔</p>
        </div>
      </div>

      {/* Login Form Card */}
      <div className="flex-1 px-6 -mt-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-black/5 p-6 max-w-md mx-auto border border-border/30 animate-fade-in">
          <h2 className="text-xl font-bold text-foreground mb-1">Welcome Back! 👋</h2>
          <p className="text-sm text-muted-foreground mb-6">Login to your worker account</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs font-semibold">Phone Number</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <span className="text-base">🇵🇰</span>
                  <span className="text-xs text-muted-foreground">+92</span>
                </div>
                <Phone className="absolute left-[62px] top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="03XX-XXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-[76px] h-12 rounded-xl border-border/80 focus:border-primary"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-12 h-12 rounded-xl border-border/80 focus:border-primary"
                  autoComplete="current-password"
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

            <Button type="submit" className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-600/25" size="lg" disabled={loading}>
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </div>

        {/* Register link */}
        <div className="text-center mt-6 mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary font-bold hover:underline">
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
