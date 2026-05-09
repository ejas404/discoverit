import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { MapPin, Phone, MessageSquare, Share2, Flag } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import AppHeader from '../components/AppHeader'
import placeholderImg from '../assets/placeholder.png'

export default function ItemDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuth()
    const [item, setItem] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const { data, error } = await supabase
                    .from('reports')
                    .select(`
                        *,
                        media (public_url),
                        reporter:users!reports_reporter_id_fkey(full_name, avatar_url)
                    `)
                    .eq('id', id)
                    .single()

                if (error) throw error
                setItem(data)
            } catch (err) {
                console.error('Error fetching item:', err)
            } finally {
                setLoading(false)
            }
        }

        if (id) fetchItem()
    }, [id])

    const handleMessage = async () => {
        if (!user) {
            navigate('/login', { state: { from: location } })
            return
        }

        // For mock data, we might not have a reporter_id or valid UUID
        const reporterId = (item as any).reporter_id
        if (!reporterId) {
            alert('This is a demo item. Real-time chat requires real items from the database.')
            return
        }

        if (reporterId === user.id) {
            alert("You cannot message yourself about your own item.")
            return
        }

        try {
            // Check if conversation already exists
            const { data: existing } = await supabase
                .from('conversations')
                .select('id')
                .eq('report_id', item.id)
                .eq('finder_id', user.id)
                .maybeSingle()

            if (existing) {
                navigate(`/chat/${existing.id}`)
                return
            }

            // Create new conversation
            const { data: newConv, error } = await supabase
                .from('conversations')
                .insert({
                    report_id: item.id,
                    reporter_id: reporterId,
                    finder_id: user.id
                })
                .select()
                .single()

            if (error) throw error
            navigate(`/chat/${newConv.id}`)
        } catch (err) {
            console.error('Chat error:', err)
            alert('Unable to start conversation. Please try again.')
        }
    }

    const handleCall = () => {
        if (!user) {
            navigate('/login', { state: { from: location } })
        } else {
            // In a real app, this would be item.founder_phone
            const phoneNumber = '+1 (555) 012-3456'
            alert(`Calling reporter at ${phoneNumber}`)
        }
    }

    if (loading) {
        return (
            <div className="flex-center" style={{ height: '100vh', flexDirection: 'column', gap: 12 }}>
                <div className="spinner"></div>
                <p style={{ color: 'var(--text-muted)' }}>Loading item details...</p>
            </div>
        )
    }

    if (!item) {
        return (
            <div className="flex-center" style={{ height: '100vh', padding: 20, textAlign: 'center', flexDirection: 'column' }}>
                <h3>Item not found</h3>
                <p style={{ color: 'var(--text-muted)' }}>This item may have been removed or resolved.</p>
                <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/')}>Back to Home</button>
            </div>
        )
    }

    return (
        <div style={{ paddingBottom: 20 }}>
            <AppHeader />
            <header className="back-header">
                <button
                    id="detail-back-btn"
                    className="back-btn"
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                >
                    ←
                </button>
                <h1 className="back-header-title">Item Details</h1>
                <button
                    id="detail-share-btn"
                    className="back-btn"
                    aria-label="Share item"
                    onClick={() => {
                        navigator.share({
                            title: item.item_name,
                            text: `Check out this ${item.report_type} item on DiscoverIt: ${item.item_name}`,
                            url: window.location.href
                        }).catch(() => alert('Sharing not supported on this browser'))
                    }}
                >
                    <Share2 size={18} />
                </button>
            </header>

            <main className="page-content" id="detail-content">
                {/* Image */}
                <div style={{ position: 'relative', height: 300, background: '#F3F4F6' }}>
                    <img
                        src={item.media?.[0]?.public_url || placeholderImg}
                        alt={item.item_name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = placeholderImg
                        }}
                    />
                    <div style={{ position: 'absolute', top: 14, left: 14 }}>
                        <span className={`badge badge-${item.report_type === 'missing' ? 'missing' : 'found'}`}>
                            {item.report_type === 'missing' ? 'MISSING' : 'FOUND'}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>{item.item_name}</h2>

                        {item.item_color && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 8 }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Item Color:</span>
                                <div
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '6px',
                                        backgroundColor: item.item_color,
                                        border: '1px solid rgba(0,0,0,0.1)'
                                    }}
                                />
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.item_color.toUpperCase()}</span>
                            </div>
                        )}

                        <div className="item-card-location">
                            <MapPin size={15} />
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.location_text}</span>
                        </div>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px',
                        border: '1px solid var(--border)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</p>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            {item.description || "No additional details provided for this item."}
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                        <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700 }}>
                            {item.category}
                        </span>
                    </div>

                    <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#eee', overflow: 'hidden' }}>
                                {item.reporter?.avatar_url ? (
                                    <img src={item.reporter.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--primary)' }}>
                                        {item.reporter?.full_name?.charAt(0) || '?'}
                                    </div>
                                )}
                            </div>
                            <div>
                                <p style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{item.reporter?.full_name || 'Anonymous User'}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Reporter</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button
                                id="contact-chat-detail-btn"
                                className="btn btn-primary"
                                style={{ flex: 1, borderRadius: '12px', padding: '14px' }}
                                onClick={handleMessage}
                            >
                                <MessageSquare size={17} />
                                Message
                            </button>
                            <button
                                id="contact-phone-detail-btn"
                                className="btn btn-outline"
                                style={{ flex: 1, borderRadius: '12px', padding: '14px' }}
                                onClick={handleCall}
                            >
                                <Phone size={17} />
                                Call
                            </button>
                        </div>
                    </div>

                    <button
                        id="flag-report-btn"
                        style={{
                            background: 'none',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            color: 'var(--text-muted)',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            justifyContent: 'center',
                            padding: '12px',
                            marginTop: 10
                        }}
                    >
                        <Flag size={14} />
                        Report this post as inappropriate
                    </button>
                </div>
            </main>
        </div>
    )
}
