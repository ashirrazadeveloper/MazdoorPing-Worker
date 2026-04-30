'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  AlertTriangle, Phone, MapPin, Navigation,
  Ambulance, ShieldAlert, UserX, Car, AlertOctagon
} from 'lucide-react'
import { mockWorker } from '@/data/mock'
import type { AlertType } from '@/types'

const alertTypes: { type: AlertType; label: string; labelUr: string; icon: typeof AlertTriangle; color: string }[] = [
  { type: 'emergency', label: 'Medical Emergency', labelUr: 'طبی ایمرجنسی', icon: Ambulance, color: 'bg-red-100 text-red-700 border-red-300' },
  { type: 'harassment', label: 'Harassment', labelUr: 'ہراسانی', icon: UserX, color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { type: 'accident', label: 'Accident', labelUr: 'حادثہ', icon: Car, color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  { type: 'theft', label: 'Theft / Crime', labelUr: 'چوری / جرائم', icon: ShieldAlert, color: 'bg-purple-100 text-purple-700 border-purple-300' },
  { type: 'other', label: 'Other Emergency', labelUr: 'دیگر ایمرجنسی', icon: AlertOctagon, color: 'bg-gray-100 text-gray-700 border-gray-300' },
]

const emergencyContacts = [
  { label: 'Emergency', labelUr: 'ایمرجنسی', number: '15', color: 'bg-red-500' },
  { label: 'Rescue 1124', labelUr: 'ریسکیو', number: '1124', color: 'bg-orange-500' },
  { label: 'Police', labelUr: 'پولیس', number: '911', color: 'bg-blue-500' },
]

export default function SOSPage() {
  const [selectedAlert, setSelectedAlert] = useState<AlertType>('emergency')
  const [alertSent, setAlertSent] = useState(false)
  const [locationStatus, setLocationStatus] = useState<'idle' | 'fetching' | 'done'>('idle')

  const sendSOS = async () => {
    setLocationStatus('fetching')
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLocationStatus('done')
    await new Promise(resolve => setTimeout(resolve, 1000))
    setAlertSent(true)
    setTimeout(() => setAlertSent(false), 5000)
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="flex items-center h-14 px-4 max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h1 className="text-lg font-bold text-red-600">SOS Emergency</h1>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* Emergency Alert Banner */}
        <div className="bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl p-4 text-white animate-fade-in shadow-lg shadow-red-500/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Emergency SOS</p>
              <p className="text-xs text-red-100 mt-0.5">Your safety is our priority. Press SOS to alert admin and share your location.</p>
            </div>
          </div>
        </div>

        {/* Alert Type Selection */}
        <Card className="border-border/60 animate-fade-in" style={{ animationDelay: '50ms' }}>
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">What type of emergency?</h3>
            <div className="space-y-2">
              {alertTypes.map(alert => {
                const Icon = alert.icon
                return (
                  <button
                    key={alert.type}
                    onClick={() => setSelectedAlert(alert.type)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 ${
                      selectedAlert === alert.type
                        ? `${alert.color} scale-[1.01]`
                        : 'border-transparent bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                      selectedAlert === alert.type ? 'bg-white/60' : 'bg-white'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold">{alert.label}</p>
                      <p className="text-[11px] opacity-70">{alert.labelUr}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* SOS Button */}
        <div className="flex flex-col items-center py-4">
          {alertSent ? (
            <div className="text-center animate-fade-in">
              <div className="h-28 w-28 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 ring-4 ring-green-200">
                <span className="text-5xl">✅</span>
              </div>
              <p className="text-lg font-bold text-green-600">Alert Sent!</p>
              <p className="text-sm text-muted-foreground mt-1">Help is on the way. Stay calm.</p>
              <p className="text-xs text-muted-foreground mt-2">GPS location has been shared with admin</p>
            </div>
          ) : (
            <>
              <button
                onClick={sendSOS}
                className="h-28 w-28 rounded-full bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 active:scale-95 transition-all flex items-center justify-center shadow-2xl shadow-red-500/40 animate-pulse-sos"
              >
                <span className="text-white text-3xl font-black tracking-wider">SOS</span>
              </button>
              <p className="text-sm text-red-600 font-semibold mt-5">
                Tap to send emergency alert
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Your GPS location will be shared with emergency contacts
              </p>

              {locationStatus === 'fetching' && (
                <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground animate-fade-in">
                  <Navigation className="h-4 w-4 animate-pulse" />
                  Getting your location...
                </div>
              )}
            </>
          )}
        </div>

        {/* Emergency Contacts */}
        <Card className="border-border/60 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Emergency Contacts</h3>
            <div className="grid grid-cols-3 gap-3">
              {emergencyContacts.map(contact => (
                <a
                  key={contact.number}
                  href={`tel:${contact.number}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border border-border/60 hover:shadow-md transition-all press-effect"
                >
                  <div className={`h-12 w-12 rounded-xl ${contact.color} flex items-center justify-center shadow-sm`}>
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground">{contact.number}</p>
                    <p className="text-[10px] text-muted-foreground">{contact.label}</p>
                    <p className="text-[10px] text-muted-foreground">{contact.labelUr}</p>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Location Status */}
        <Card className="border-border/60 animate-fade-in" style={{ animationDelay: '150ms' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                locationStatus === 'done' ? 'bg-green-100' : 'bg-muted'
              }`}>
                <MapPin className={`h-5 w-5 ${locationStatus === 'done' ? 'text-green-600' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {locationStatus === 'done' ? 'Location Shared ✓' : 'GPS Location'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {locationStatus === 'done'
                    ? `${mockWorker.area}, ${mockWorker.city}`
                    : 'Location will be captured when you press SOS'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Tips */}
        <Card className="border-yellow-200/60 bg-yellow-50/50 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-yellow-800 mb-2">⚠️ Safety Tips</h3>
            <ul className="space-y-2 text-xs text-yellow-700 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>Share your job location with a family member</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>Don&apos;t go alone to unfamiliar locations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>Keep your phone charged</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>Trust your instincts - leave if uncomfortable</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>Use SOS before situation escalates</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
