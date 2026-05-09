import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Search, ArrowRight, CheckCircle2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function ResetPasswordPage() {
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        // Check if we have a session (Supabase handles the recovery link by setting a session)
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession()
            if (!data.session) {
                // If no session, they shouldn't be here unless they just clicked the link
                // Supabase might have already handled the fragment
            }
        }
        checkSession()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError("Passwords don't match")
            return
        }

        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            })

            if (error) throw error
            setSuccess(true)

            // Log out after reset to force fresh login
            await supabase.auth.signOut()

            setTimeout(() => {
                navigate('/login')
            }, 3000)
        } catch (err: any) {
            setError(err.message || 'An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="auth-page">
                <div className="auth-body page-content-no-nav">
                    <div className="auth-card fade-in text-center" style={{ textAlign: 'center' }}>
                        <div className="auth-icon-wrap" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                            <CheckCircle2 size={30} />
                        </div>
                        <h2 className="auth-title">Password Reset</h2>
                        <p className="auth-subtitle">
                            Your password has been reset successfully. Redirecting you to login...
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="auth-page">
            <header className="back-header">
                <h1 className="back-header-title">Set New Password</h1>
            </header>

            <div className="auth-body page-content-no-nav">
                <div className="auth-card fade-in">
                    <div className="auth-icon-wrap">
                        <Search size={30} strokeWidth={2.5} />
                    </div>

                    <h2 className="auth-title">New Password</h2>
                    <p className="auth-subtitle">Please enter your new password below.</p>

                    {error && <div className="auth-error" style={{ color: 'red', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="input-label" htmlFor="new-password">New Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon"><Lock size={16} /></span>
                                <input
                                    id="new-password"
                                    className="input-field"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div className="input-group" style={{ marginTop: '12px' }}>
                            <label className="input-label" htmlFor="confirm-password">Confirm Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon"><Lock size={16} /></span>
                                <input
                                    id="confirm-password"
                                    className="input-field"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-full"
                            style={{ padding: '15px', marginTop: '20px' }}
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Reset Password'} <ArrowRight size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
