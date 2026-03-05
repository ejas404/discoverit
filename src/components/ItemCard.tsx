import { MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export interface ItemCardProps {
    id: string
    name: string
    location: string
    status: 'MISSING' | 'FOUND'
    imageUrl: string
    category?: string
}

export default function ItemCard({ id, name, location, status, imageUrl }: ItemCardProps) {
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
                <img src={imageUrl} alt={name} loading="lazy" />
                <div className="item-card-badge">
                    <span className={`badge badge-${status.toLowerCase()}`}>
                        {status}
                    </span>
                </div>
            </div>
            <div className="item-card-body">
                <h3 className="item-card-name">{name}</h3>
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
