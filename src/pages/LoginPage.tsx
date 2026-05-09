import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import authIllustration from '../assets/auth_illustration.png'
import { useEffect } from 'react'

export default function LoginPage() {
    const navigate = useNavigate()
    const { user } = useAuth()

    useEffect(() => {
        if (user) {
            navigate('/')
        }
    }, [user, navigate])

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const location = useLocation()
    const from = location.state?.from?.pathname || '/'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            navigate(from, { replace: true })
        } catch (err: any) {
            setError(err.message || 'An error occurred during login')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <header className="back-header">
                <button
                    id="login-back-btn"
                    className="back-btn"
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                >
                    ←
                </button>
                <h1 className="back-header-title">DiscoverIt</h1>
            </header>

            <div className="auth-body page-content-no-nav">
                <div className="auth-card fade-in">
                    {/* Logo Icon */}
                    <div className="auth-icon-wrap" aria-hidden="true">
                        <Search size={30} strokeWidth={2.5} />
                    </div>

                    <h2 className="auth-title">DiscoverIt</h2>
                    <p className="auth-subtitle">Welcome back! Please enter your details.</p>

                    {/* Banner */}
                    <img
                        src={authIllustration}
                        alt="DiscoverIt Illustration"
                        className="auth-banner"
                        style={{ objectFit: 'contain', background: 'transparent' }}
                    />

                    {error && <div className="auth-error" style={{ color: 'red', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit} id="login-form">
                        {/* Email */}
                        <div className="input-group">
                            <label className="input-label" htmlFor="login-email">Email</label>
                            <div className="input-wrapper">
                                <span className="input-icon"><Mail size={16} /></span>
                                <input
                                    id="login-email"
                                    className="input-field"
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="input-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label className="input-label" htmlFor="login-password">Password</label>
                                <Link to="/forgot-password" className="auth-forgot" id="forgot-password-link">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="input-wrapper">
                                <span className="input-icon"><Lock size={16} /></span>
                                <input
                                    id="login-password"
                                    className="input-field"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    style={{ paddingRight: '44px' }}
                                />
                                <button
                                    type="button"
                                    className="input-icon-right"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    id="toggle-password-btn"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <label className="auth-remember" htmlFor="remember-me">
                            <input
                                id="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            Remember me for 30 days
                        </label>

                        {/* Submit */}
                        <button
                            id="login-submit-btn"
                            type="submit"
                            className="btn btn-primary btn-full"
                            style={{ padding: '15px', fontSize: '0.975rem', borderRadius: '12px' }}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'} <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="auth-divider" style={{ marginTop: '16px' }}>
                        Don't have an account?{' '}
                        <Link to="/signup" className="auth-switch" id="goto-signup-link" style={{ display: 'inline', fontWeight: 700, color: 'var(--primary)' }}>
                            Sign up for free
                        </Link>
                    </div>
                </div>
            </div>

            <footer className="auth-footer">
                <a href="#" id="privacy-link">Privacy Policy</a>
                <a href="#" id="terms-link">Terms of Service</a>
                <a href="#" id="support-link">Support</a>
            </footer>
        </div>
    )
}
