import { Link, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

interface AppHeaderProps {
    isLoggedIn?: boolean
}

export default function AppHeader({ isLoggedIn = false }: AppHeaderProps) {
    const navigate = useNavigate()

    return (
        <header className="app-header">
            <Link to="/" className="header-logo" aria-label="DiscoverIt home">
                <div className="header-logo-icon" aria-hidden="true">
                    <Search size={18} strokeWidth={2.5} />
                </div>
                <span className="header-logo-text">DiscoverIt</span>
            </Link>

            <div className="header-actions">
                {isLoggedIn ? (
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
