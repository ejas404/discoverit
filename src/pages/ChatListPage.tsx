import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import AppHeader from '../components/AppHeader'

interface Conversation {
    id: string
    report_id: string
    last_message: string
    last_message_at: string
    reporter_id: string
    finder_id: string
    reporter_unread: number
    finder_unread: number
    report: {
        item_name: string
    }
    other_party: {
        full_name: string
        avatar_url: string | null
    }
}

export default function ChatListPage() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return

        const fetchConversations = async () => {
            try {
                // Fetch conversations where user is either reporter or finder
                const { data, error } = await supabase
                    .from('conversations')
                    .select(`
                        *,
                        report:reports(item_name),
                        reporter:users!conversations_reporter_id_fkey(full_name, avatar_url),
                        finder:users!conversations_finder_id_fkey(full_name, avatar_url)
                    `)
                    .or(`reporter_id.eq.${user.id},finder_id.eq.${user.id}`)
                    .order('last_message_at', { ascending: false })

                if (error) throw error

                const formatted = data.map((conv: any) => {
                    const isReporter = conv.reporter_id === user.id
                    return {
                        ...conv,
                        other_party: isReporter ? conv.finder : conv.reporter,
                        unread_count: isReporter ? conv.reporter_unread : conv.finder_unread
                    }
                })

                setConversations(formatted)
            } catch (err) {
                console.error('Error fetching conversations:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchConversations()

        // Real-time subscription to conversation updates
        const subscription = supabase
            .channel('conversations_updates')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'conversations'
            }, () => {
                fetchConversations()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        }
    }, [user])

    const formatDate = (dateStr: string) => {
        if (!dateStr) return ''
        const date = new Date(dateStr)
        const now = new Date()
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24))

        if (diffDays === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        if (diffDays === 1) return 'Yesterday'
        if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'short' })
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }

    return (
        <div className="chat-list-page">
            <AppHeader />

            <main className="page-content" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '10px' }}>
                <div className="section-header" style={{ marginBottom: '20px' }}>
                    <h1 className="hero-title" style={{ fontSize: '1.8rem' }}>Messages</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Chat with people about lost or found items.</p>
                </div>

                {loading ? (
                    <div className="loading-state" style={{ textAlign: 'center', padding: '40px' }}>
                        <div className="spinner"></div>
                        <p>Loading messages...</p>
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '20px', border: '1px solid var(--border)' }}>
                        <div className="empty-icon" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>
                            <MessageSquare size={48} style={{ margin: '0 auto' }} />
                        </div>
                        <h3>No messages yet</h3>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '250px', margin: '10px auto' }}>
                            Start a conversation by clicking "Message" on an item detail page.
                        </p>
                        <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
                            Browse Items
                        </button>
                    </div>
                ) : (
                    <div className="conv-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {conversations.map((conv: any) => (
                            <div
                                key={conv.id}
                                className="conv-card"
                                onClick={() => navigate(`/chat/${conv.id}`)}
                                style={{
                                    display: 'flex',
                                    padding: '16px',
                                    background: 'white',
                                    borderRadius: '16px',
                                    border: '1px solid var(--border)',
                                    cursor: 'pointer',
                                    transition: 'transform 0.1s',
                                    alignItems: 'center',
                                    gap: '12px',
                                    position: 'relative'
                                }}
                            >
                                <div className="conv-avatar" style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    background: 'var(--primary-light)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    color: 'var(--primary)',
                                    overflow: 'hidden'
                                }}>
                                    {conv.other_party.avatar_url ? (
                                        <img src={conv.other_party.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        conv.other_party.full_name?.charAt(0) || '?'
                                    )}
                                </div>

                                <div className="conv-info" style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                                            {conv.other_party.full_name}
                                        </h3>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {formatDate(conv.last_message_at)}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                                        <span className="badge" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>{conv.report.item_name}</span>
                                    </div>
                                    <p style={{
                                        fontSize: '0.85rem',
                                        color: conv.unread_count > 0 ? 'var(--text-primary)' : 'var(--text-muted)',
                                        fontWeight: conv.unread_count > 0 ? 600 : 400,
                                        margin: 0,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {conv.last_message || 'No messages yet'}
                                    </p>
                                </div>

                                {conv.unread_count > 0 && (
                                    <div style={{
                                        background: 'var(--primary)',
                                        color: 'white',
                                        fontSize: '0.7rem',
                                        fontWeight: 'bold',
                                        minWidth: '20px',
                                        height: '20px',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '0 6px'
                                    }}>
                                        {conv.unread_count}
                                    </div>
                                )}

                                <ChevronRight size={18} style={{ color: 'var(--border)' }} />
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
