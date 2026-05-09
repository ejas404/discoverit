import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, Lock, Eye, FileText, Scale } from 'lucide-react'
import AppHeader from '../components/AppHeader'

export default function PrivacyPolicyPage() {
    const navigate = useNavigate()

    return (
        <div className="privacy-page">
            <AppHeader />
            <header className="back-header">
                <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
                <h1 className="back-header-title">Privacy & Policy</h1>
                <div style={{ width: 40 }} />
            </header>

            <main className="page-content" style={{ paddingTop: '24px', paddingLeft: '16px', paddingRight: '16px', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        width: 64,
                        height: 64,
                        background: 'var(--primary-light)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)',
                        margin: '0 auto 16px'
                    }}>
                        <Shield size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Your Safety is Our Priority</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Please read our terms and privacy policy carefully.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                            <Lock size={20} style={{ color: 'var(--primary)' }} />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Data Security</h3>
                        </div>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            DiscoverIt uses industry-standard encryption to protect your account and personal information.
                            Your contact details (phone number, etc.) are only shared with other users if you explicitly
                            choose to provide them during a conversation.
                        </p>
                    </section>

                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                            <Scale size={20} style={{ color: 'var(--primary)' }} />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Limitation of Liability</h3>
                        </div>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            DiscoverIt is a community platform. We do not verify the authenticity of items reported as
                            lost or found. We are not responsible for any losses, damages, or disputes that may arise
                            from interactions between users. <strong>Always meet in a public, well-lit place</strong>
                            when exchanging items.
                        </p>
                    </section>

                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                            <Eye size={20} style={{ color: 'var(--primary)' }} />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Community Guidelines</h3>
                        </div>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            Users are strictly prohibited from posting fraudulent reports, inappropriate content, or
                            harassing others. All reports are subject to moderation. Violation of these terms will
                            result in an immediate and permanent ban.
                        </p>
                    </section>

                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                            <FileText size={20} style={{ color: 'var(--primary)' }} />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Content Usage</h3>
                        </div>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            By reporting an item, you grant DiscoverIt the right to display the images and descriptions
                            to other users of the platform for the purpose of facilitating the return of the item.
                            You retain ownership of your original content but agree to our moderation policies.
                        </p>
                    </section>
                </div>

                <div style={{
                    marginTop: 48,
                    padding: 20,
                    background: '#F8FAFC',
                    borderRadius: 16,
                    border: '1px solid #E2E8F0',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                        Last Updated: April 2026. <br />
                        Questions? Contact us at support@discoverit.com
                    </p>
                </div>
            </main>
        </div>
    )
}
