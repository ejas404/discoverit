import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, Info, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

import authIllustration from '../assets/auth_illustration.png'

export default function SignUpPage() {
    const navigate = useNavigate()
    const { user } = useAuth()

    useEffect(() => {
        if (user && !showOtpStep) {
            navigate('/')
        }
    }, [user, navigate])

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showOtpStep, setShowOtpStep] = useState(false)
    const [otpCode, setOtpCode] = useState('')
    const [resendCountdown, setResendCountdown] = useState(0)

    useEffect(() => {
        let timer: any
        if (resendCountdown > 0) {
            timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000)
        }
        return () => clearTimeout(timer)
    }, [resendCountdown])

    const handleResendOtp = async () => {
        if (resendCountdown > 0) return

        setLoading(true)
        setError(null)
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email,
            })
            if (error) throw error
            setResendCountdown(60)
            alert('OTP resent successfully!')
        } catch (err: any) {
            setError(err.message || 'Failed to resend OTP')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            })

            if (error) throw error

            // If signup is successful, show OTP input
            setShowOtpStep(true)
        } catch (err: any) {
            setError(err.message || 'An error occurred during sign up')
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token: otpCode,
                type: 'signup',
            })

            if (error) throw error

            // Success! logged in
            navigate('/')
        } catch (err: any) {
            setError(err.message || 'Invalid or expired code')
        } finally {
            setLoading(false)
        }
    }

    const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3

    return (
        <div className="auth-page">
            <header className="back-header">
                <button
                    id="signup-back-btn"
                    className="back-btn"
                    onClick={() => showOtpStep ? setShowOtpStep(false) : navigate(-1)}
                    aria-label="Go back"
                >
                    ←
                </button>
                <h1 className="back-header-title">DiscoverIt</h1>
            </header>

            <div className="auth-body page-content-no-nav">
                <div className="auth-card fade-in">
                    {/* Illustration */}
                    <img
                        src={authIllustration}
                        alt="DiscoverIt Illustration"
                        className="auth-banner"
                        style={{ objectFit: 'contain', background: 'transparent' }}
                    />

                    <h2 className="auth-title">{showOtpStep ? 'Verify Email' : 'Join DiscoverIt'}</h2>
                    <p className="auth-subtitle">
                        {showOtpStep
                            ? `We've sent a code to ${email}. Please enter it below.`
                            : 'Join our community today.'}
                    </p>

                    {error && <div className="auth-error" style={{ color: 'red', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>}

                    {!showOtpStep ? (
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
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight size={18} />
                            </button>
                        </form>
                    ) : (
                        <form className="auth-form" onSubmit={handleVerifyOtp} id="otp-form">
                            <div className="input-group">
                                <label className="input-label" htmlFor="otp-code">Verification Code</label>
                                <div className="input-wrapper">
                                    <span className="input-icon"><Lock size={16} /></span>
                                    <input
                                        id="otp-code"
                                        className="input-field"
                                        type="text"
                                        placeholder="12345678"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value)}
                                        required
                                        maxLength={8}
                                        style={{ letterSpacing: '0.2rem', textAlign: 'center', fontSize: '1.2rem' }}
                                    />
                                </div>
                                <p className="password-hint" style={{ marginTop: '1rem' }}>
                                    Enter the 8-digit code sent to your email.
                                </p>
                            </div>

                            <button
                                id="otp-submit-btn"
                                type="submit"
                                className="btn btn-primary btn-full"
                                style={{ padding: '15px', fontSize: '0.975rem', borderRadius: '12px', marginTop: '1rem' }}
                                disabled={loading}
                            >
                                {loading ? 'Verifying...' : 'Verify Code'} <ArrowRight size={18} />
                            </button>

                            <button
                                id="resend-otp-btn"
                                type="button"
                                className="btn"
                                style={{
                                    background: 'none',
                                    color: resendCountdown > 0 ? '#94A3B8' : 'var(--primary)',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    marginTop: '1rem',
                                    width: '100%',
                                    cursor: resendCountdown > 0 ? 'not-allowed' : 'pointer',
                                    textDecoration: 'underline'
                                }}
                                onClick={handleResendOtp}
                                disabled={loading || resendCountdown > 0}
                            >
                                {resendCountdown > 0
                                    ? `Resend code in ${resendCountdown}s`
                                    : "Didn't get the code? Resend"}
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline btn-full"
                                style={{ marginTop: '1rem', border: 'none' }}
                                onClick={() => setShowOtpStep(false)}
                            >
                                Change Email
                            </button>
                        </form>
                    )}

                    {!showOtpStep && (
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
                    )}
                </div>
            </div>
        </div>
    )
}
