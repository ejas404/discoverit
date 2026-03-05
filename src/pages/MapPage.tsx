import { Map } from 'lucide-react'
import AppHeader from '../components/AppHeader'

export default function MapPage() {
    return (
        <>
            <AppHeader />
            <main
                className="page-content"
                id="map-content"
                style={{ display: 'flex', flexDirection: 'column' }}
            >
                <div className="map-placeholder">
                    <div className="map-icon-wrap">
                        <Map size={36} strokeWidth={1.5} />
                    </div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        Map View
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: 260 }}>
                        See all reported lost and found items near you on an interactive map.
                    </p>
                    <div
                        style={{
                            width: '100%',
                            height: 300,
                            background: 'linear-gradient(135deg, #EEF0FF 0%, #DDE1FF 100%)',
                            borderRadius: 'var(--radius-xl)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--primary)',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            border: '2px dashed var(--primary-light)',
                            marginTop: 8,
                        }}
                    >
                        Interactive map coming soon
                    </div>
                </div>
            </main>
        </>
    )
}
