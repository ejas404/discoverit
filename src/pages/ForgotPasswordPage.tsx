import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Search, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function ForgotPasswordPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            })

            if (error) throw error
            setSubmitted(true)
        } catch (err: any) {
            setError(err.message || 'An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="auth-page">
                <header className="back-header">
                    <button className="back-btn" onClick={() => navigate('/login')}>
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="back-header-title">Check Email</h1>
                </header>

                <div className="auth-body page-content-no-nav">
                    <div className="auth-card fade-in text-center" style={{ textAlign: 'center' }}>
                        <div className="auth-icon-wrap" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                            <CheckCircle2 size={30} />
                        </div>
                        <h2 className="auth-title">Email Sent</h2>
                        <p className="auth-subtitle">
                            We've sent a password reset link to <strong>{email}</strong>.
                            Please check your inbox and follow the instructions.
                        </p>

                        <div style={{ marginTop: '24px' }}>
                            <button
                                className="btn btn-primary btn-full"
                                onClick={() => navigate('/login')}
                                style={{ padding: '15px' }}
                            >
                                Back to Login
                            </button>
                        </div>

                        <p style={{ marginTop: '20px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            Didn't receive the email? Check your spam folder or{' '}
                            <button
                                onClick={() => setSubmitted(false)}
                                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                            >
                                try again
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="auth-page">
            <header className="back-header">
                <button
                    className="back-btn"
                    onClick={() => navigate('/login')}
                    aria-label="Back to login"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="back-header-title">Forgot Password</h1>
            </header>

            <div className="auth-body page-content-no-nav">
                <div className="auth-card fade-in">
                    <div className="auth-icon-wrap">
                        <Search size={30} strokeWidth={2.5} />
                    </div>

                    <h2 className="auth-title">Reset Password</h2>
                    <p className="auth-subtitle">Enter your email and we'll send you a link to reset your password.</p>

                    {error && <div className="auth-error" style={{ color: 'red', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="input-label" htmlFor="reset-email">Email Address</label>
                            <div className="input-wrapper">
                                <span className="input-icon"><Mail size={16} /></span>
                                <input
                                    id="reset-email"
                                    className="input-field"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-full"
                            style={{ padding: '15px', marginTop: '10px' }}
                            disabled={loading}
                        >
                            {loading ? 'Sending link...' : 'Send Reset Link'} <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="auth-divider" style={{ marginTop: '24px' }}>
                        Remember your password?{' '}
                        <Link to="/login" className="auth-switch" style={{ display: 'inline', fontWeight: 700, color: 'var(--primary)' }}>
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
