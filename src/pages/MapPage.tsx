import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import AppHeader from '../components/AppHeader'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { MapPin, Search } from 'lucide-react'

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

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap()
    map.setView(center)
    return null
}

export default function MapPage() {
    const navigate = useNavigate()
    const [reports, setReports] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [center, setCenter] = useState<[number, number]>([20.5937, 78.9629]) // Default India center
    const [zoom, setZoom] = useState(5)

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const { data, error } = await supabase
                    .from('reports')
                    .select('*, media(public_url)')
                    .eq('status', 'active')
                    .not('location_lat', 'is', null)
                    .not('location_lng', 'is', null)

                if (error) throw error
                setReports(data || [])
            } catch (err) {
                console.error('Error fetching reports for map:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchReports()

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setCenter([pos.coords.latitude, pos.coords.longitude])
                setZoom(13)
            })
        }
    }, [])

    return (
        <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
            <AppHeader />

            <main style={{ flex: 1, position: 'relative' }}>
                {loading && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(255,255,255,0.7)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <div className="spinner"></div>
                    </div>
                )}

                <MapContainer
                    center={center}
                    zoom={zoom}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ChangeView center={center} />
                    {reports.map((report) => (
                        <Marker
                            key={report.id}
                            position={[report.location_lat, report.location_lng]}
                            icon={DefaultIcon}
                        >
                            <Popup>
                                <div style={{ minWidth: '150px' }}>
                                    <div style={{ height: '80px', borderRadius: '8px', overflow: 'hidden', marginBottom: '8px', background: '#eee' }}>
                                        <img
                                            src={report.media?.[0]?.public_url || '/placeholder.png'}
                                            alt={report.item_name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <h4 style={{ margin: '0 0 4px', fontSize: '0.9rem' }}>{report.item_name}</h4>
                                    <p style={{ margin: '0 0 8px', fontSize: '0.75rem', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <MapPin size={10} /> {report.location_text}
                                    </p>
                                    <button
                                        onClick={() => navigate(`/item/${report.id}`)}
                                        style={{
                                            width: '100%',
                                            padding: '6px',
                                            background: 'var(--primary)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1000,
                    width: '90%',
                    maxWidth: '400px'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '12px 16px',
                        borderRadius: '24px',
                        boxShadow: 'var(--shadow-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <Search size={18} color="var(--primary)" />
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            Showing {reports.length} items on map
                        </span>
                    </div>
                </div>
            </main>
        </div>
    )
}
