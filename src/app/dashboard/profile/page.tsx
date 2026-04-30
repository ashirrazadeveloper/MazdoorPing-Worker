'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Header from '@/components/layout/Header'
import { useAuth } from '@/components/auth/AuthProvider'
import { updateWorkerProfile, getWorkerSkills, updateWorkerSkills } from '@/lib/services'
import type { Worker } from '@/types'
import { getInitials, maskCNIC } from '@/lib/utils'
import { Edit3, Save, X, Star, Shield, ChevronRight, MapPin, Phone, Bell, LogOut, Loader2 } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const { workerProfile, user, signOut, refreshProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [worker, setWorker] = useState<Worker | null>(null)
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (!workerProfile) return
      setWorker(workerProfile)
      try {
        const skillData = await getWorkerSkills(workerProfile.id)
        setSkills(skillData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (workerProfile) fetchData()
  }, [workerProfile])

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

  const updateField = (field: string, value: string | number | boolean) => {
    setWorker(prev => prev ? { ...prev, [field]: value } : null)
  }

  const handleSave = async () => {
    if (!worker) return
    setSaving(true)
    try {
      await updateWorkerProfile(worker.id, {
        bio: worker.bio,
        area: worker.area,
        base_rate: worker.base_rate,
        is_available: worker.is_available,
        city: worker.city,
        experience_years: worker.experience_years,
      })
      await updateWorkerSkills(worker.id, skills)
      setEditing(false)
      await refreshProfile()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading || !worker) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <Header title="Profile" />
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
          <div className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    )
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
                    {getInitials(worker.category?.name || 'W')}
                  </div>
                </div>
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-foreground">{worker.category?.name || 'Worker'}</h2>
                  {worker.is_verified && (
                    <Badge variant="success" className="text-[10px] rounded-lg">
                      <Shield className="h-3 w-3 mr-0.5" /> Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold">{Number(worker.rating).toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({worker.total_reviews} reviews)</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {worker.category?.icon || '🔧'} {worker.category?.name || ''} · {worker.experience_years} yrs exp
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 animate-fade-in" style={{ animationDelay: '50ms' }}>
          <div className="text-center p-3 bg-white rounded-2xl border border-border/60">
            <p className="text-xl font-bold text-foreground">{worker.total_jobs}</p>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Jobs Done</p>
            <p className="text-[10px] text-muted-foreground">مکمل کام</p>
          </div>
          <div className="text-center p-3 bg-white rounded-2xl border border-border/60">
            <p className="text-xl font-bold text-foreground flex items-center justify-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {Number(worker.rating).toFixed(1)}
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
                  <Button variant="ghost" size="sm" className="text-primary h-8 text-xs rounded-xl font-semibold" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Save className="h-3 w-3 mr-1" /> Save</>}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500 h-8 text-xs rounded-xl" onClick={() => {
                    setEditing(false)
                    if (workerProfile) setWorker(workerProfile)
                  }}>
                    <X className="h-3 w-3 mr-1" /> Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Category</Label>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{worker.category?.icon || '🔧'}</span>
                  <span className="text-sm font-medium">{worker.category?.name || 'Not set'}</span>
                  {worker.category?.name_ur && <span className="text-xs text-muted-foreground">({worker.category.name_ur})</span>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Phone Number</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm">{user?.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">CNIC</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{worker.cnic ? maskCNIC(worker.cnic) : 'Not provided'}</span>
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

              {editing && (
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Experience (years)</Label>
                  <Input type="number" value={worker.experience_years} onChange={(e) => updateField('experience_years', parseInt(e.target.value) || 0)} className="h-10 rounded-xl" />
                </div>
              )}

              {editing && (
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Base Rate (PKR/day)</Label>
                  <Input type="number" value={worker.base_rate} onChange={(e) => updateField('base_rate', parseInt(e.target.value) || 500)} className="h-10 rounded-xl" />
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Skills</Label>
                {editing ? (
                  <>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a skill..."
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
                        className="h-10 rounded-xl flex-1"
                      />
                      <Button type="button" variant="outline" onClick={addSkill} className="h-10 w-10 rounded-xl p-0">+</Button>
                    </div>
                  </>
                ) : null}
                <div className="flex flex-wrap gap-1.5">
                  {skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs rounded-lg gap-1">
                      {skill}
                      {editing && (
                        <button onClick={() => removeSkill(skill)} className="hover:text-red-500"><X className="h-3 w-3" /></button>
                      )}
                    </Badge>
                  ))}
                  {skills.length === 0 && <span className="text-sm text-muted-foreground">No skills added</span>}
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

              {editing && (
                <div className="flex items-center gap-3">
                  <Label className="text-sm font-medium">Available for work</Label>
                  <button
                    type="button"
                    onClick={() => updateField('is_available', !worker.is_available)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${worker.is_available ? 'bg-primary' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${worker.is_available ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              )}
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
                { label: 'Notifications', labelUr: 'اطلاعات', icon: Bell, href: '/dashboard/notifications', count: null },
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
                    {link.count !== null && link.count > 0 && (
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
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}
