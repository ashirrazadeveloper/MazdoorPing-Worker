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
  MapPin, Phone, Briefcase, Clock
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [worker, setWorker] = useState(mockWorker)

  const updateField = (field: string, value: string | number) => {
    setWorker(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // In production, save to Supabase
    setEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Profile" />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4 pb-24">
        {/* Avatar Card */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-green-600 h-20" />
          <CardContent className="p-4 -mt-10 relative">
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl bg-primary/10 border-4 border-white flex items-center justify-center text-2xl font-bold text-primary shadow-md">
                  {getInitials(worker.name)}
                </div>
                {editing && (
                  <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-foreground">{worker.name}</h2>
                  {worker.is_verified && (
                    <Badge variant="success" className="text-[10px]">
                      <Shield className="h-3 w-3 mr-0.5" /> Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{worker.rating}</span>
                    <span className="text-xs text-muted-foreground">({worker.total_reviews} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground">Personal Information</h3>
              {!editing ? (
                <Button variant="ghost" size="sm" className="text-primary h-8 text-xs" onClick={() => setEditing(true)}>
                  <Edit3 className="h-3 w-3 mr-1" /> Edit
                </Button>
              ) : (
                <Button variant="ghost" size="sm" className="text-red-500 h-8 text-xs" onClick={() => { setEditing(false); setWorker(mockWorker) }}>
                  <X className="h-3 w-3 mr-1" /> Cancel
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Full Name</Label>
                {editing ? (
                  <Input value={worker.name} onChange={(e) => updateField('name', e.target.value)} />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{worker.name}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Phone Number</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm">{worker.phone}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">CNIC</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{maskCNIC(worker.cnic)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">City</Label>
                  {editing ? (
                    <Input value={worker.city} onChange={(e) => updateField('city', e.target.value)} />
                  ) : (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">{worker.city}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Area</Label>
                  {editing ? (
                    <Input value={worker.area || ''} onChange={(e) => updateField('area', e.target.value)} />
                  ) : (
                    <span className="text-sm">{worker.area || 'Not set'}</span>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Category</Label>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm">{WORKER_CATEGORIES[worker.category].icon} {WORKER_CATEGORIES[worker.category].en}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Experience</Label>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm">{worker.experience_years} years</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Skills</Label>
                <div className="flex flex-wrap gap-1.5">
                  {worker.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Bio</Label>
                {editing ? (
                  <Textarea
                    value={worker.bio || ''}
                    onChange={(e) => updateField('bio', e.target.value)}
                    rows={3}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{worker.bio || 'No bio added'}</p>
                )}
              </div>
            </div>

            {editing && (
              <Button className="w-full mt-4 h-11" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Quick Links</h3>
            <div className="space-y-1">
              {[
                { label: 'My Reviews', icon: Star, href: '/reviews', count: worker.total_reviews },
                { label: 'Notifications', icon: Bell, href: '/notifications', count: 3 },
                { label: 'Verification Status', icon: Shield, href: '#', count: null },
              ].map(link => (
                <button
                  key={link.label}
                  onClick={() => link.href !== '#' && router.push(link.href)}
                  className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <link.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {link.count !== null && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{link.count}</span>
                    )}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Bell(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
  )
}
