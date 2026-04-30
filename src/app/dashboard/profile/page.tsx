'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Header from '@/components/layout/Header'
import { mockWorker } from '@/data/mock'
import { WORKER_CATEGORIES } from '@/types'
import { getInitials, maskCNIC } from '@/lib/utils'
import {
  Camera, Edit3, Save, X, Star, Shield, ChevronRight,
  MapPin, Phone, Bell, LogOut
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [worker, setWorker] = useState(mockWorker)

  const updateField = (field: string, value: string | number) => {
    setWorker(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    setEditing(false)
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mazdoorping_user')
    }
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header title="Profile" />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4 pb-24">
        {/* Avatar Card */}
        <Card className="overflow-hidden border-border/60 animate-fade-in">
          <div className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 h-24 relative">
            <div className="absolute -top-4 -right-4 h-32 w-32 bg-white/10 rounded-full" />
            <div className="absolute -bottom-8 -left-8 h-24 w-24 bg-white/5 rounded-full" />
          </div>
          <CardContent className="p-4 -mt-12 relative">
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-xl font-bold text-primary">
                  <div className="w-full h-full rounded-2xl bg-primary/10 flex items-center justify-center">
                    {getInitials(worker.name)}
                  </div>
                </div>
                {editing && (
                  <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md ring-2 ring-white">
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-foreground">{worker.name}</h2>
                  {worker.is_verified && (
                    <Badge variant="success" className="text-[10px] rounded-lg">
                      <Shield className="h-3 w-3 mr-0.5" /> Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold">{worker.rating}</span>
                    <span className="text-xs text-muted-foreground">({worker.total_reviews} reviews)</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {WORKER_CATEGORIES[worker.category].icon} {WORKER_CATEGORIES[worker.category].en} · {worker.experience_years} yrs exp
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 animate-fade-in" style={{ animationDelay: '50ms' }}>
          <div className="text-center p-3 bg-white rounded-2xl border border-border/60">
            <p className="text-xl font-bold text-foreground">34</p>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Jobs Done</p>
            <p className="text-[10px] text-muted-foreground">مکمل کام</p>
          </div>
          <div className="text-center p-3 bg-white rounded-2xl border border-border/60">
            <p className="text-xl font-bold text-foreground flex items-center justify-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {worker.rating}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Rating</p>
            <p className="text-[10px] text-muted-foreground">درجہ بندی</p>
          </div>
          <div className="text-center p-3 bg-white rounded-2xl border border-border/60">
            <p className="text-xl font-bold text-foreground">{worker.experience_years}</p>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Years Exp</p>
            <p className="text-[10px] text-muted-foreground">تجربہ</p>
          </div>
        </div>

        {/* Profile Info */}
        <Card className="border-border/60 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground">Personal Information</h3>
              {!editing ? (
                <Button variant="ghost" size="sm" className="text-primary h-8 text-xs rounded-xl font-semibold" onClick={() => setEditing(true)}>
                  <Edit3 className="h-3 w-3 mr-1" /> Edit
                </Button>
              ) : (
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="text-primary h-8 text-xs rounded-xl font-semibold" onClick={handleSave}>
                    <Save className="h-3 w-3 mr-1" /> Save
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500 h-8 text-xs rounded-xl" onClick={() => { setEditing(false); setWorker(mockWorker) }}>
                    <X className="h-3 w-3 mr-1" /> Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Full Name</Label>
                {editing ? (
                  <Input value={worker.name} onChange={(e) => updateField('name', e.target.value)} className="h-10 rounded-xl" />
                ) : (
                  <span className="text-sm font-medium">{worker.name}</span>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Phone Number</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm">{worker.phone}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">CNIC</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{maskCNIC(worker.cnic)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">City</Label>
                  {editing ? (
                    <Input value={worker.city} onChange={(e) => updateField('city', e.target.value)} className="h-10 rounded-xl" />
                  ) : (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">{worker.city}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Area</Label>
                  {editing ? (
                    <Input value={worker.area || ''} onChange={(e) => updateField('area', e.target.value)} className="h-10 rounded-xl" />
                  ) : (
                    <span className="text-sm">{worker.area || 'Not set'}</span>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Skills</Label>
                <div className="flex flex-wrap gap-1.5">
                  {worker.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs rounded-lg">{skill}</Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Bio</Label>
                {editing ? (
                  <Textarea
                    value={worker.bio || ''}
                    onChange={(e) => updateField('bio', e.target.value)}
                    rows={3}
                    className="rounded-xl"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground leading-relaxed">{worker.bio || 'No bio added'}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="border-border/60 animate-fade-in" style={{ animationDelay: '150ms' }}>
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-foreground mb-2">Quick Links</h3>
            <div className="space-y-0.5">
              {[
                { label: 'My Reviews', labelUr: 'جائزے', icon: Star, href: '/dashboard/reviews', count: worker.total_reviews },
                { label: 'Notifications', labelUr: 'اطلاعات', icon: Bell, href: '/dashboard/notifications', count: 3 },
                { label: 'Verification Status', labelUr: 'تصدیق', icon: Shield, href: '#', count: null },
              ].map(link => (
                <button
                  key={link.label}
                  onClick={() => link.href !== '#' && router.push(link.href)}
                  className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <link.icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm font-medium">{link.label}</span>
                      <span className="text-[10px] text-muted-foreground ml-1.5">{link.labelUr}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {link.count !== null && (
                      <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{link.count}</span>
                    )}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full h-11 rounded-xl text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 font-semibold"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}
