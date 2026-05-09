import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, MapPin, Filter, X } from 'lucide-react'
import AppHeader from '../components/AppHeader'
import ItemCard from '../components/ItemCard'
import { supabase } from '../lib/supabase'

const CATEGORIES = ['All', 'Electronics', 'Accessories', 'Bags', 'Pets', 'Documents']

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const query = searchParams.get('q') || ''
    const locationParam = searchParams.get('location') || ''
    const categoryParam = searchParams.get('category') || 'All'

    const [searchInput, setSearchInput] = useState(query)
    const [showFilters, setShowFilters] = useState(false)
    const [reports, setReports] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true)
            try {
                let rpcQuery = supabase
                    .from('reports')
                    .select('*, media(public_url)')
                    .eq('status', 'active')

                if (query) {
                    rpcQuery = rpcQuery.ilike('item_name', `%${query}%`)
                }

                if (locationParam) {
                    rpcQuery = rpcQuery.ilike('location_text', `%${locationParam}%`)
                }

                if (categoryParam !== 'All') {
                    rpcQuery = rpcQuery.eq('category', categoryParam)
                }

                const { data, error } = await rpcQuery.order('created_at', { ascending: false })

                if (error) throw error
                setReports(data || [])
            } catch (err) {
                console.error('Error searching:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchResults()
    }, [query, locationParam, categoryParam])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setSearchParams({ q: searchInput, location: locationParam, category: categoryParam })
    }

    return (
        <>
            <AppHeader />
            <main className="page-content">
                <div className="search-bar-container" style={{ padding: '16px', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
                        <div className="input-wrapper" style={{ flex: 1 }}>
                            <span className="input-icon"><Search size={16} /></span>
                            <input
                                className="input-field"
                                type="text"
                                placeholder="Search items..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </div>
                        <button
                            type="button"
                            className="btn btn-outline"
                            style={{ padding: '8px 12px' }}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter size={18} />
                        </button>
                    </form>

                    {showFilters && (
                        <div className="filters-dropdown fade-in" style={{ marginTop: '12px', padding: '16px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Filters</h3>
                                <button onClick={() => setShowFilters(false)} style={{ background: 'none', border: 'none' }}><X size={18} /></button>
                            </div>

                            <div className="input-group" style={{ marginBottom: '12px' }}>
                                <label className="input-label">Category</label>
                                <select
                                    className="select-field"
                                    value={categoryParam}
                                    onChange={(e) => setSearchParams({ q: query, location: locationParam, category: e.target.value })}
                                >
                                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Location</label>
                                <div className="input-wrapper">
                                    <span className="input-icon"><MapPin size={16} /></span>
                                    <input
                                        className="input-field"
                                        type="text"
                                        placeholder="City, Zip..."
                                        value={locationParam}
                                        onChange={(e) => setSearchParams({ q: query, location: e.target.value, category: categoryParam })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="search-results" style={{ padding: '0 16px' }}>
                    <p style={{ margin: '16px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {loading ? 'Searching...' : `Showing ${reports.length} results ${query ? `for "${query}"` : ''}`}
                    </p>

                    <div className="activities-list">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="skeleton-card" style={{ height: 180, background: '#eee', borderRadius: 16 }}></div>
                            ))
                        ) : reports.length > 0 ? (
                            reports.map(report => (
                                <ItemCard
                                    key={report.id}
                                    id={report.id}
                                    name={report.item_name}
                                    location={report.location_text}
                                    status={report.report_type === 'missing' ? 'MISSING' : 'FOUND'}
                                    imageUrl={report.media?.[0]?.public_url}
                                    color={report.item_color}
                                />
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', marginTop: '40px', padding: '40px 20px', background: 'white', borderRadius: 20 }}>
                                <p style={{ color: 'var(--text-muted)' }}>No items found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    )
}
