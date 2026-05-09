import { Link, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function AppHeader() {
    const navigate = useNavigate()
    const { user, loading } = useAuth()

    if (loading) return (
        <header className="app-header">
            <Link to="/" className="header-logo"><div className="header-logo-icon"><Search size={18} /></div><span className="header-logo-text">DiscoverIt</span></Link>
        </header>
    )

    return (
        <header className="app-header">
            <Link to="/" className="header-logo" aria-label="DiscoverIt home">
                <div className="header-logo-icon" aria-hidden="true">
                    <Search size={18} strokeWidth={2.5} />
                </div>
                <span className="header-logo-text">DiscoverIt</span>
            </Link>

            <div className="header-actions">
                {user ? (
                    <button
                        id="header-profile-btn"
                        className="header-btn-signup"
                        onClick={() => navigate('/profile')}
                    >
                        My Profile
                    </button>
                ) : (
                    <>
                        <button
                            id="header-login-btn"
                            className="header-btn-login"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </button>
                        <button
                            id="header-signup-btn"
                            className="header-btn-signup"
                            onClick={() => navigate('/signup')}
                        >
                            Sign Up
                        </button>
                    </>
                )}
            </div>
        </header>
    )
}
