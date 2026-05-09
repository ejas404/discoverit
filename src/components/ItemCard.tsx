import { MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import placeholderImg from '../assets/placeholder.png'

export interface ItemCardProps {
    id: string
    name: string
    location: string
    status: 'MISSING' | 'FOUND'
    imageUrl?: string | null
    category?: string
    color?: string | null
}

export default function ItemCard({ id, name, location, status, imageUrl, color }: ItemCardProps) {
    const navigate = useNavigate()

    return (
        <article
            className="item-card fade-in"
            onClick={() => navigate(`/item/${id}`)}
            role="button"
            tabIndex={0}
            aria-label={`${status} item: ${name} at ${location}`}
            onKeyDown={(e) => e.key === 'Enter' && navigate(`/item/${id}`)}
        >
            <div className="item-card-image">
                <img
                    src={imageUrl || placeholderImg}
                    alt={name}
                    loading="lazy"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = placeholderImg
                    }}
                />
                <div className="item-card-badge">
                    <span className={`badge badge-${status.toLowerCase()}`}>
                        {status}
                    </span>
                </div>
            </div>
            <div className="item-card-body">
                <h3 className="item-card-name" style={{ marginBottom: color ? '4px' : '8px' }}>{name}</h3>

                {color && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Color:</span>
                        <div
                            style={{
                                width: '14px',
                                height: '14px',
                                borderRadius: '4px',
                                backgroundColor: color,
                                border: '1px solid rgba(0,0,0,0.1)'
                            }}
                        />
                    </div>
                )}

                <div className="item-card-location">
                    <MapPin size={13} strokeWidth={2} />
                    <span>{location}</span>
                </div>
                <button className="item-card-detail-btn" id={`item-detail-${id}`}>
                    View Details
                </button>
            </div>
        </article>
    )
}
