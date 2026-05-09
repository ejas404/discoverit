import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { Search } from 'lucide-react'

// Fix for default marker icon in leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIconRetina,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

interface LocationPickerProps {
    onLocationSelect: (lat: number, lng: number, address: string) => void
    initialLat?: number
    initialLng?: number
}

function MapEvents({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng)
        },
    })
    return null
}

export default function LocationPicker({ onLocationSelect, initialLat, initialLng }: LocationPickerProps) {
    const [position, setPosition] = useState<[number, number] | null>(
        initialLat && initialLng ? [initialLat, initialLng] : null
    )
    const [addressQuery, setAddressQuery] = useState('')
    const [searching, setSearching] = useState(false)

    // Center of map defaults to a general area if no position
    const center: [number, number] = position || [20.5937, 78.9629] // India center as fallback

    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            const data = await response.json()
            return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
        } catch (error) {
            console.error('Reverse geocoding error:', error)
            return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
        }
    }

    const handleMapClick = async (lat: number, lng: number) => {
        setPosition([lat, lng])
        const address = await reverseGeocode(lat, lng)
        onLocationSelect(lat, lng, address)
    }

    const handleSearchAddress = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!addressQuery.trim()) return

        setSearching(true)
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressQuery)}&limit=1`)
            const data = await response.json()
            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0]
                const newLat = parseFloat(lat)
                const newLng = parseFloat(lon)
                setPosition([newLat, newLng])
                onLocationSelect(newLat, newLng, display_name)
            }
        } catch (error) {
            console.error('Geocoding error:', error)
        } finally {
            setSearching(false)
        }
    }

    useEffect(() => {
        if (!position && "geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const lat = pos.coords.latitude
                    const lng = pos.coords.longitude
                    setPosition([lat, lng])
                    const address = await reverseGeocode(lat, lng)
                    onLocationSelect(lat, lng, address)
                },
                (err) => console.log('Geolocation error:', err)
            )
        }
    }, [])

    return (
        <div className="location-picker" style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid var(--border)' }}>
            <div className="location-search-bar" style={{ padding: '8px', background: 'white', display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)' }}>
                <form onSubmit={handleSearchAddress} style={{ flex: 1, display: 'flex', gap: '8px' }}>
                    <div className="input-wrapper" style={{ flex: 1 }}>
                        <span className="input-icon"><Search size={14} /></span>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Search for a location..."
                            style={{ padding: '8px 8px 8px 36px', height: '36px', borderRadius: '8px' }}
                            value={addressQuery}
                            onChange={(e) => setAddressQuery(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm" disabled={searching} style={{ height: '36px', borderRadius: '8px' }}>
                        {searching ? '...' : 'Search'}
                    </button>
                </form>
            </div>

            <div style={{ height: '250px', width: '100%' }}>
                <MapContainer
                    center={center}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapEvents onLocationSelect={handleMapClick} />
                    {position && <Marker position={position} icon={DefaultIcon} />}
                </MapContainer>
            </div>
            <p style={{ padding: '8px 12px', fontSize: '0.75rem', color: 'var(--text-secondary)', background: '#F9FAFB', margin: 0, borderTop: '1px solid var(--border)' }}>
                Tap on map to set precise location.
            </p>
        </div>
    )
}
