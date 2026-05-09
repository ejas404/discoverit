import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, MapPin, ChevronDown, ArrowRight, Bell } from 'lucide-react'
import AppHeader from '../components/AppHeader'
import ItemCard from '../components/ItemCard'
import { supabase } from '../lib/supabase'
import heroSvg from '../assets/undraw_searching-everywhere_tffi.svg'

const CATEGORIES = ['All', 'Electronics', 'Accessories', 'Bags', 'Pets', 'Documents']

export default function HomePage() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [location, setLocation] = useState('')
    const [category, setCategory] = useState('All')
    const [reports, setReports] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [userCoords, setUserCoords] = useState<{ lat: number, lng: number } | null>(null)
    const [sortingNearMe, setSortingNearMe] = useState(false)

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const { data, error } = await supabase
                    .from('reports')
                    .select(`
                        *,
                        media (public_url)
                    `)
                    .eq('status', 'active')
                    .order('created_at', { ascending: false })
                    .limit(5)

                if (error) throw error
                setReports(data || [])
            } catch (err) {
                console.error('Error fetching reports:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchReports()
    }, [])

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371 // Radius of the earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180
        const dLon = (lon2 - lon1) * Math.PI / 180
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return R * c
    }

    const sortByNearest = (coords: { lat: number, lng: number }, data: any[]) => {
        return [...data].sort((a, b) => {
            if (!a.location_lat || !a.location_lng) return 1
            if (!b.location_lat || !b.location_lng) return -1
            const distA = calculateDistance(coords.lat, coords.lng, a.location_lat, a.location_lng)
            const distB = calculateDistance(coords.lat, coords.lng, b.location_lat, b.location_lng)
            return distA - distB
        })
    }

    const handleNearMe = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser')
            return
        }

        setSortingNearMe(true)
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
                setUserCoords(coords)
                setReports(prev => sortByNearest(coords, prev))
                setSortingNearMe(false)
            },
            (err) => {
                console.error(err)
                alert('Unable to get your location')
                setSortingNearMe(false)
            }
        )
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        navigate(`/search?q=${searchQuery}&location=${location}&category=${category}`)
    }

    return (
        <>
            <AppHeader />
            <main className="page-content" id="main-content">
                {/* Hero */}
                <section className="hero-svg-section fade-in" aria-label="Hero">
                    <div className="hero-svg-badge" aria-live="polite">
                        <Bell size={11} />
                        New Reports Nearby
                    </div>
                    <div className="hero-svg-inner">
                        <div className="hero-svg-text">
                            <h1 className="hero-title">
                                Find What's Lost.<br />
                                <span>Report What's Found.</span>
                            </h1>
                            <p className="hero-subtitle">
                                The community-driven platform to reunite people with their belongings instantly.
                            </p>
                            <div className="hero-actions">
                                <button
                                    id="hero-search-btn"
                                    className="btn btn-primary"
                                    onClick={() => document.getElementById('search-input')?.focus()}
                                >
                                    <Search size={16} />
                                    Search Now
                                </button>
                                <button
                                    id="hero-report-btn"
                                    className="btn btn-outline"
                                    onClick={() => navigate('/report')}
                                >
                                    Report Item
                                </button>
                            </div>
                        </div>
                        <div className="hero-svg-illustration" aria-hidden="true">
                            <img src={heroSvg} alt="" />
                        </div>
                    </div>
                </section>

                {/* Quick Search */}
                <section className="search-section fade-in fade-in-delay-2" aria-label="Quick Search">
                    <div className="search-card">
                        <p className="search-card-title">Quick Search</p>
                        <p className="search-card-sub">What are you looking for?</p>

                        <form onSubmit={handleSearch}>
                            <div className="input-wrapper">
                                <span className="input-icon"><Search size={16} /></span>
                                <input
                                    id="search-input"
                                    className="input-field"
                                    type="text"
                                    placeholder="e.g. iPhone 13, Wallet, Keys"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    aria-label="Search query"
                                />
                            </div>

                            <div className="search-row">
                                <div className="input-group">
                                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Location</span>
                                    <div className="input-wrapper">
                                        <span className="input-icon"><MapPin size={15} /></span>
                                        <input
                                            id="location-input"
                                            className="input-field"
                                            type="text"
                                            placeholder="City or Zip"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            aria-label="Location"
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Category</span>
                                    <div className="select-wrapper">
                                        <select
                                            id="category-select"
                                            className="select-field"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            aria-label="Category"
                                        >
                                            {CATEGORIES.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        <span className="select-arrow"><ChevronDown size={15} /></span>
                                    </div>
                                </div>
                            </div>

                            <div className="search-btn-row">
                                <button id="search-submit-btn" type="submit" className="btn btn-primary btn-full">
                                    <Search size={16} />
                                    Search Items
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                {/* Latest Activities */}
                <section className="section-gap" aria-label="Latest Activities">
                    <div className="section-header">
                        <h2 className="section-title">{userCoords ? 'Nearest Items' : 'Latest Activities'}</h2>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button
                                onClick={handleNearMe}
                                className={`btn btn-sm ${userCoords ? 'btn-primary' : 'btn-outline'}`}
                                disabled={sortingNearMe}
                                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                            >
                                <MapPin size={14} />
                                {sortingNearMe ? 'Locating...' : userCoords ? 'Near Me' : 'Find Near Me'}
                            </button>
                            <Link to="/search" className="section-view-all" id="view-all-link">
                                View All <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>

                    <div className="activities-list">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="skeleton-card" style={{ height: 280, borderRadius: 20, background: '#eee' }}></div>
                            ))
                        ) : reports.length === 0 ? (
                            <div className="empty-state" style={{ padding: '40px 20px', textAlign: 'center', background: '#f8fafc', borderRadius: 20, gridColumn: '1 / -1' }}>
                                <p style={{ color: '#64748B' }}>No recent items reported.</p>
                            </div>
                        ) : (
                            reports.map((report, i) => (
                                <div
                                    key={report.id}
                                    className={`fade-in fade-in-delay-${Math.min(i + 1, 3)}`}
                                >
                                    <ItemCard
                                        id={report.id}
                                        name={report.item_name}
                                        location={report.location_text}
                                        status={report.report_type === 'missing' ? 'MISSING' : 'FOUND'}
                                        imageUrl={report.media?.[0]?.public_url}
                                        color={report.item_color}
                                    />
                                </div>
                            ))
                        )}
                    </div>

                    <div style={{ height: 16 }} />
                </section>
            </main>
        </>
    )
}
