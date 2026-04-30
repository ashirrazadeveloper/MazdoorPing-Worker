'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapProps {
  latitude: number
  longitude: number
  zoom?: number
  markers?: Array<{ lat: number; lng: number; label?: string }>
  className?: string
}

export default function MapComponent({ latitude, longitude, zoom = 13, markers, className = 'h-48 w-full rounded-xl' }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current).setView([latitude, longitude], zoom)
    mapInstanceRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map)

    // Custom green marker
    const icon = L.divIcon({
      html: `<div style="background:#16A34A;width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      className: ''
    })

    if (markers && markers.length > 0) {
      markers.forEach(m => {
        L.marker([m.lat, m.lng], { icon })
          .addTo(map)
          .bindPopup(m.label || 'Location')
      })
    } else {
      L.marker([latitude, longitude], { icon }).addTo(map)
    }

    // Fix map rendering after container is visible
    setTimeout(() => {
      map.invalidateSize()
    }, 100)

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [latitude, longitude, zoom, markers])

  return <div ref={mapRef} className={className} />
}
