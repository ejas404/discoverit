import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, User, Mail, Lock, Eye, EyeOff, Info, ArrowRight } from 'lucide-react'

export default function SignUpPage() {
    const navigate = useNavigate()
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        navigate('/')
    }

    const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3

    return (
        <div className="auth-page">
            <header className="back-header">
                <button
                    id="signup-back-btn"
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
                    {/* Icon */}
                    <div className="auth-icon-wrap" aria-hidden="true">
                        <UserPlus size={30} strokeWidth={2} />
                    </div>

                    <h2 className="auth-title">Create Account</h2>
                    <p className="auth-subtitle">Join our community today and explore more.</p>

                    <form className="auth-form" onSubmit={handleSubmit} id="signup-form">
                        {/* Full Name */}
                        <div className="input-group">
                            <label className="input-label" htmlFor="signup-name">Full Name</label>
                            <div className="input-wrapper">
                                <span className="input-icon"><User size={16} /></span>
                                <input
                                    id="signup-name"
                                    className="input-field"
                                    type="text"
                                    placeholder="John Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    autoComplete="name"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="input-group">
                            <label className="input-label" htmlFor="signup-email">Email Address</label>
                            <div className="input-wrapper">
                                <span className="input-icon"><Mail size={16} /></span>
                                <input
                                    id="signup-email"
                                    className="input-field"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="input-group">
                            <label className="input-label" htmlFor="signup-password">Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon"><Lock size={16} /></span>
                                <input
                                    id="signup-password"
                                    className="input-field"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                    style={{ paddingRight: '44px' }}
                                />
                                <button
                                    type="button"
                                    className="input-icon-right"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    id="signup-toggle-password-btn"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            {/* Password strength bar */}
                            {password.length > 0 && (
                                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                                    {[1, 2, 3].map((level) => (
                                        <div
                                            key={level}
                                            style={{
                                                height: 4,
                                                flex: 1,
                                                borderRadius: 4,
                                                background: passwordStrength >= level
                                                    ? level === 1 ? '#EF4444' : level === 2 ? '#F59E0B' : '#10B981'
                                                    : '#E5E7EB',
                                                transition: 'background 0.3s',
                                            }}
                                        />
                                    ))}
                                </div>
                            )}

                            <p className="password-hint">
                                <Info size={13} />
                                Must be at least 8 characters long
                            </p>
                        </div>

                        {/* Submit */}
                        <button
                            id="signup-submit-btn"
                            type="submit"
                            className="btn btn-primary btn-full"
                            style={{ padding: '15px', fontSize: '0.975rem', borderRadius: '12px' }}
                        >
                            Create Account <ArrowRight size={18} />
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                            Already have an account?
                        </p>
                        <Link
                            to="/login"
                            id="goto-login-link"
                            style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}
                        >
                            Log in to DiscoverIt
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
