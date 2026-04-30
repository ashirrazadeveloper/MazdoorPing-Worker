'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  AlertTriangle, Phone,
  Ambulance, ShieldAlert, UserX, Car, AlertOctagon
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { createSOSAlert, getMySOSAlerts } from '@/lib/services'
import type { SOSAlert, AlertType } from '@/types'
import { formatTimeAgo } from '@/lib/utils'

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
  const { workerProfile } = useAuth()
  const [selectedAlert, setSelectedAlert] = useState<AlertType>('emergency')
  const [message, setMessage] = useState('')
  const [emergencyContact, setEmergencyContact] = useState('')
  const [alertSent, setAlertSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([])

  useEffect(() => {
    if (workerProfile) {
      getMySOSAlerts(workerProfile.id).then(setSosAlerts).catch(console.error)
    }
  }, [workerProfile])

  const sendSOS = async () => {
    if (!workerProfile) return
    setSending(true)

    try {
      // Get current location
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 })
      })

      const lat = pos.coords.latitude
      const lng = pos.coords.longitude

      await createSOSAlert(workerProfile.id, {
        type: selectedAlert,
        latitude: lat,
        longitude: lng,
        address: `${workerProfile.area || ''}, ${workerProfile.city}`,
        message: message || `SOS - ${selectedAlert} alert from ${workerProfile.city}`,
        emergency_contact: emergencyContact,
      })

      setAlertSent(true)

      // Refresh alerts list
      const updatedAlerts = await getMySOSAlerts(workerProfile.id)
      setSosAlerts(updatedAlerts)

      setTimeout(() => {
        setAlertSent(false)
        setMessage('')
      }, 5000)
    } catch (err) {
      console.error('SOS error:', err)
      // Still try to send SOS without location
      if (workerProfile) {
        await createSOSAlert(workerProfile.id, {
          type: selectedAlert,
          latitude: workerProfile.latitude || 31.5204,
          longitude: workerProfile.longitude || 74.3587,
          address: `${workerProfile.area || ''}, ${workerProfile.city}`,
          message: message || `SOS - ${selectedAlert} alert from ${workerProfile.city}`,
          emergency_contact: emergencyContact,
        })
        setAlertSent(true)
        setTimeout(() => {
          setAlertSent(false)
          setMessage('')
        }, 5000)
      }
    } finally {
      setSending(false)
    }
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

        {/* Message input */}
        <Card className="border-border/60 animate-fade-in" style={{ animationDelay: '75ms' }}>
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-foreground mb-2">Additional Details</h3>
            <textarea
              placeholder="Describe your emergency (optional)..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <input
              placeholder="Emergency contact number (optional)"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="w-full mt-2 h-10 rounded-xl border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
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
                disabled={sending}
                className="h-28 w-28 rounded-full bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 active:scale-95 transition-all flex items-center justify-center shadow-2xl shadow-red-500/40 animate-pulse-sos disabled:opacity-50"
              >
                {sending ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="text-white text-3xl font-black tracking-wider">SOS</span>
                )}
              </button>
              <p className="text-sm text-red-600 font-semibold mt-5">
                {sending ? 'Sending alert...' : 'Tap to send emergency alert'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Your GPS location will be shared with emergency contacts
              </p>
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

        {/* SOS History */}
        {sosAlerts.length > 0 && (
          <Card className="border-border/60 animate-fade-in" style={{ animationDelay: '125ms' }}>
            <CardContent className="p-4">
              <h3 className="text-sm font-bold text-foreground mb-3">SOS History</h3>
              <div className="space-y-2">
                {sosAlerts.slice(0, 5).map(alert => (
                  <div key={alert.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                      alert.status === 'active' ? 'bg-red-100' : alert.status === 'resolved' ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      <AlertTriangle className={`h-4 w-4 ${
                        alert.status === 'active' ? 'text-red-600' : alert.status === 'resolved' ? 'text-green-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}</p>
                      <p className="text-[11px] text-muted-foreground">{formatTimeAgo(alert.created_at)}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      alert.status === 'active' ? 'bg-red-100 text-red-700'
                        : alert.status === 'resolved' ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
