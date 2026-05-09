import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Settings,
    Shield,
    HelpCircle,
    LogOut,
    ChevronRight,
    Package,
    Star,
} from 'lucide-react'
import AppHeader from '../components/AppHeader'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function ProfilePage() {
    const navigate = useNavigate()
    const { user, signOut } = useAuth()
    const [stats, setStats] = useState({ reports: 0, resolved: 0, helped: 0 })

    useEffect(() => {
        if (!user) return

        const fetchStats = async () => {
            try {
                // Count reports
                const { count, error } = await supabase
                    .from('reports')
                    .select('*', { count: 'exact', head: true })
                    .eq('reporter_id', user.id)

                if (error) throw error

                // For now, other stats might be 0 or fetched from a 'users' table if it has those fields
                setStats(prev => ({ ...prev, reports: count || 0 }))
            } catch (err) {
                console.error('Error fetching stats:', err)
            }
        }

        fetchStats()
    }, [user])

    const handleLogout = async () => {
        await signOut()
        navigate('/login')
    }

    const MENU_ITEMS = [
        { icon: Package, label: 'My Reports', id: 'menu-reports', path: '/items/my-reports' },
        { icon: Star, label: 'Saved Items', id: 'menu-saved', path: '/items/saved' },
        { icon: Shield, label: 'Privacy & Policy', id: 'menu-privacy', path: '/privacy' },
        { icon: Settings, label: 'Settings', id: 'menu-settings', path: '/settings' },
        { icon: HelpCircle, label: 'Help & Support', id: 'menu-help', path: '/help' },
        { icon: LogOut, label: 'Log Out', id: 'menu-logout', danger: true },
    ]

    const handleMenuClick = (item: any) => {
        if (item.danger) {
            handleLogout()
        } else if (item.path) {
            navigate(item.path)
        }
    }

    if (!user) {
        return (
            <div className="profile-page">
                <AppHeader />
                <main className="page-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
                    <p>Please log in to view your profile.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/login')} style={{ marginTop: '1rem' }}>Login</button>
                </main>
            </div>
        )
    }

    const fullName = user.user_metadata?.full_name || 'DiscoverIt User'
    const email = user.email || ''
    const avatarLetter = fullName.charAt(0).toUpperCase()

    return (
        <div className="profile-page">
            <AppHeader />
            <main className="page-content" id="profile-content">
                {/* Profile Header */}
                <div className="profile-header-bg">
                    <div className="profile-avatar" aria-label="Profile avatar">{avatarLetter}</div>
                    <div className="profile-name" style={{ marginTop: 12 }}>{fullName}</div>
                    <div className="profile-email">{email}</div>
                </div>

                {/* Stats */}
                <div className="profile-stats" role="region" aria-label="Profile statistics" style={{ margin: '0 16px', position: 'relative', marginTop: -30 }}>
                    <div className="profile-stat">
                        <div className="profile-stat-num">{stats.reports}</div>
                        <div className="profile-stat-label">Reports</div>
                    </div>
                    <div className="profile-stat">
                        <div className="profile-stat-num">{stats.resolved}</div>
                        <div className="profile-stat-label">Resolved</div>
                    </div>
                    <div className="profile-stat">
                        <div className="profile-stat-num">{stats.helped}</div>
                        <div className="profile-stat-label">Helped</div>
                    </div>
                </div>

                {/* Menu */}
                <nav className="profile-menu" aria-label="Profile menu" style={{ marginTop: 24 }}>
                    {MENU_ITEMS.map((item) => {
                        const { icon: Icon, label, id, danger } = item
                        return (
                            <button
                                key={id}
                                id={id}
                                className="profile-menu-item"
                                onClick={() => handleMenuClick(item)}
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
                        )
                    })}
                </nav>

                <div style={{ padding: '24px 16px' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        Version 1.0.0 (Production)
                    </p>
                </div>
            </main>
        </div>
    )
}
