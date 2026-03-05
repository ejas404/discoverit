import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Phone, MessageSquare, Share2, Flag } from 'lucide-react'
import { ITEMS } from '../data/items'

export default function ItemDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const item = ITEMS.find((i) => i.id === id) || ITEMS[0]

    return (
        <>
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
                >
                    <Share2 size={18} />
                </button>
            </header>

            <main className="page-content" id="detail-content">
                {/* Image */}
                <div style={{ position: 'relative', height: 260, background: '#F3F4F6' }}>
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: 14, left: 14 }}>
                        <span className={`badge badge-${item.status.toLowerCase()}`}>{item.status}</span>
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 8 }}>{item.name}</h2>
                        <div className="item-card-location">
                            <MapPin size={15} />
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{item.location}</span>
                        </div>
                    </div>

                    <div style={{
                        background: 'var(--bg-input)',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px',
                    }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            This item was reported {item.status === 'MISSING' ? 'missing' : 'found'} at {item.location}.
                            If you have any information, please reach out to the reporter.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                        <span style={{ background: '#EEF0FF', color: 'var(--primary)', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600 }}>
                            {item.category}
                        </span>
                    </div>

                    <div style={{ height: 1, background: 'var(--border)' }} />

                    <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 12 }}>Contact Reporter</p>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button
                                id="contact-chat-detail-btn"
                                className="btn btn-primary"
                                style={{ flex: 1, borderRadius: 'var(--radius-md)', padding: '12px' }}
                            >
                                <MessageSquare size={17} />
                                Message
                            </button>
                            <button
                                id="contact-phone-detail-btn"
                                className="btn btn-outline"
                                style={{ flex: 1, borderRadius: 'var(--radius-md)', padding: '12px' }}
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
                            padding: '8px',
                        }}
                    >
                        <Flag size={14} />
                        Report as inappropriate
                    </button>
                </div>
            </main>
        </>
    )
}
