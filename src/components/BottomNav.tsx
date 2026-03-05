import { Link, useLocation } from 'react-router-dom'
import { Home, Plus, Map, User, MessageSquare } from 'lucide-react'

const navItems = [
    { to: '/', icon: Home, label: 'HOME', id: 'nav-home' },
    { to: '/map', icon: Map, label: 'MAP', id: 'nav-map' },
    { to: '/report', icon: Plus, label: 'REPORT', id: 'nav-report', isReport: true },
    { to: '/inbox', icon: MessageSquare, label: 'INBOX', id: 'nav-inbox' },
    { to: '/profile', icon: User, label: 'PROFILE', id: 'nav-profile' },
]

export default function BottomNav() {
    const { pathname } = useLocation()

    return (
        <nav className="bottom-nav" aria-label="Main navigation">
            {navItems.map(({ to, icon: Icon, label, id, isReport }) => {
                const active = isReport ? pathname === to : pathname === to
                return (
                    <Link
                        key={id}
                        id={id}
                        to={to}
                        className={`nav-item ${isReport ? 'nav-item-report' : ''} ${active ? 'active' : ''}`}
                        aria-label={label}
                    >
                        <span className="nav-item-icon">
                            <Icon size={isReport ? 22 : 20} strokeWidth={active ? 2.5 : 2} />
                        </span>
                        {!isReport && (
                            <span className="nav-item-label">{label}</span>
                        )}
                    </Link>
                )
            })}
        </nav>
    )
}
