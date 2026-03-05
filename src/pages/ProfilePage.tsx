import { useNavigate } from 'react-router-dom'
import {
    Settings,
    Bell,
    Shield,
    HelpCircle,
    LogOut,
    ChevronRight,
    Package,
    Star,
} from 'lucide-react'
import AppHeader from '../components/AppHeader'

const MENU_ITEMS = [
    { icon: Package, label: 'My Reports', id: 'menu-reports' },
    { icon: Star, label: 'Saved Items', id: 'menu-saved' },
    { icon: Bell, label: 'Notifications', id: 'menu-notifications' },
    { icon: Shield, label: 'Privacy & Security', id: 'menu-privacy' },
    { icon: Settings, label: 'Settings', id: 'menu-settings' },
    { icon: HelpCircle, label: 'Help & Support', id: 'menu-help' },
    { icon: LogOut, label: 'Log Out', id: 'menu-logout', danger: true },
]

export default function ProfilePage() {
    const navigate = useNavigate()

    return (
        <>
            <AppHeader isLoggedIn />
            <main className="page-content" id="profile-content">
                {/* Profile Header */}
                <div className="profile-header-bg">
                    <div className="profile-avatar" aria-label="Profile avatar">JD</div>
                    <div className="profile-name">John Doe</div>
                    <div className="profile-email">johndoe@example.com</div>
                </div>

                {/* Stats */}
                <div className="profile-stats" role="region" aria-label="Profile statistics">
                    <div className="profile-stat">
                        <div className="profile-stat-num">5</div>
                        <div className="profile-stat-label">Reports</div>
                    </div>
                    <div className="profile-stat">
                        <div className="profile-stat-num">3</div>
                        <div className="profile-stat-label">Resolved</div>
                    </div>
                    <div className="profile-stat">
                        <div className="profile-stat-num">12</div>
                        <div className="profile-stat-label">Helped</div>
                    </div>
                </div>

                {/* Menu */}
                <nav className="profile-menu" aria-label="Profile menu">
                    {MENU_ITEMS.map(({ icon: Icon, label, id, danger }) => (
                        <button
                            key={id}
                            id={id}
                            className="profile-menu-item"
                            onClick={() => danger ? navigate('/login') : undefined}
                            style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                            aria-label={label}
                        >
                            <div
                                className="profile-menu-icon"
                                style={danger ? { background: '#FEE2E2', color: '#DC2626' } : {}}
                            >
                                <Icon size={18} strokeWidth={2} />
                            </div>
                            <span
                                className="profile-menu-text"
                                style={danger ? { color: '#DC2626' } : {}}
                            >
                                {label}
                            </span>
                            <ChevronRight size={16} className="profile-menu-arrow" />
                        </button>
                    ))}
                </nav>

                <div style={{ height: 16 }} />
            </main>
        </>
    )
}
