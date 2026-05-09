import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Send, Image, MoreVertical, Phone, ArrowLeft, Check, CheckCheck } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface Message {
    id: string
    sender_id: string
    content: string
    created_at: string
    status: 'sent' | 'delivered' | 'read'
}

interface Conversation {
    id: string
    report_id: string
    reporter_id: string
    finder_id: string
    report: {
        item_name: string
    }
    reporter: {
        full_name: string
        avatar_url: string | null
    }
    finder: {
        full_name: string
        avatar_url: string | null
    }
}

export default function ChatPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [conversation, setConversation] = useState<Conversation | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        if (!user || !id) return

        const fetchChatData = async () => {
            try {
                // Fetch conversation details
                const { data: conv, error: convError } = await supabase
                    .from('conversations')
                    .select(`
                        *,
                        report:reports(item_name),
                        reporter:users!conversations_reporter_id_fkey(full_name, avatar_url),
                        finder:users!conversations_finder_id_fkey(full_name, avatar_url)
                    `)
                    .eq('id', id)
                    .single()

                if (convError) throw convError
                setConversation(conv)

                // Fetch existing messages
                const { data: msgs, error: msgsError } = await supabase
                    .from('messages')
                    .select('*')
                    .eq('conversation_id', id)
                    .order('created_at', { ascending: true })

                if (msgsError) throw msgsError
                setMessages(msgs)

                // Mark messages as read
                if (id) {
                    const isReporter = conv.reporter_id === user.id
                    await supabase
                        .from('conversations')
                        .update({
                            [isReporter ? 'reporter_unread' : 'finder_unread']: 0
                        })
                        .eq('id', id)
                }

            } catch (err) {
                console.error('Error fetching chat:', err)
                navigate('/chats')
            } finally {
                setLoading(false)
                setTimeout(scrollToBottom, 100)
            }
        }

        fetchChatData()

        // Real-time subscription for new messages
        const channel = supabase
            .channel(`chat:${id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${id}`
            }, (payload) => {
                setMessages(prev => [...prev, payload.new as Message])
                setTimeout(scrollToBottom, 50)

                // Clear unread count while user is actively in the chat
                if (id) {
                    supabase.from('conversations')
                        .update({
                            [conversation?.reporter_id === user.id ? 'reporter_unread' : 'finder_unread']: 0
                        })
                        .eq('id', id).then()
                }
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [id, user, navigate, conversation?.reporter_id, conversation?.finder_id])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !user || !id) return

        const content = newMessage.trim()
        setNewMessage('')

        try {
            const { error } = await supabase
                .from('messages')
                .insert({
                    conversation_id: id,
                    sender_id: user.id,
                    content: content
                })

            if (error) throw error
        } catch (err) {
            console.error('Error sending message:', err)
            setNewMessage(content) // restore if failed
        }
    }

    if (loading) {
        return (
            <div className="chat-page-loading" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner"></div>
            </div>
        )
    }

    if (!conversation) return null

    const otherParty = conversation.reporter_id === user?.id ? conversation.finder : conversation.reporter

    return (
        <div className="chat-page" style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
            {/* Header */}
            <header className="chat-header" style={{
                background: 'white',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                borderBottom: '1px solid var(--border)',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <button onClick={() => navigate('/chats')} style={{ background: 'none', border: 'none', padding: '4px' }}>
                    <ArrowLeft size={20} />
                </button>

                <div className="header-avatar" style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: 'var(--primary)',
                    overflow: 'hidden'
                }}>
                    {otherParty.avatar_url ? (
                        <img src={otherParty.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : otherParty.full_name?.charAt(0)}
                </div>

                <div className="header-info" style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '0.95rem', margin: 0 }}>{otherParty.full_name}</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                        Relates to: {conversation.report.item_name}
                    </p>
                </div>

                <div className="header-actions" style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--primary)' }}><Phone size={20} /></button>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}><MoreVertical size={20} /></button>
                </div>
            </header>

            {/* Messages Area */}
            <div className="messages-container" style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                {messages.map((msg, idx) => {
                    const isOwn = msg.sender_id === user?.id
                    const showDate = idx === 0 ||
                        new Date(msg.created_at).toDateString() !== new Date(messages[idx - 1].created_at).toDateString()

                    return (
                        <div key={msg.id}>
                            {showDate && (
                                <div style={{ textAlign: 'center', margin: '20px 0 10px' }}>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        background: '#E2E8F0',
                                        padding: '4px 10px',
                                        borderRadius: '10px',
                                        color: '#64748B',
                                        fontWeight: 600
                                    }}>
                                        {new Date(msg.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            )}
                            <div style={{
                                display: 'flex',
                                justifyContent: isOwn ? 'flex-end' : 'flex-start',
                                marginBottom: '4px'
                            }}>
                                <div style={{
                                    maxWidth: '80%',
                                    padding: '12px 16px',
                                    borderRadius: isOwn ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                    background: isOwn ? 'var(--primary)' : 'white',
                                    color: isOwn ? 'white' : 'var(--text-primary)',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    position: 'relative'
                                }}>
                                    <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.4 }}>{msg.content}</p>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        gap: '4px',
                                        marginTop: '4px',
                                        opacity: 0.7
                                    }}>
                                        <span style={{ fontSize: '0.65rem' }}>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {isOwn && (
                                            msg.status === 'read' ? <CheckCheck size={12} /> : <Check size={12} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <footer className="chat-footer" style={{
                background: 'white',
                padding: '12px 16px',
                borderTop: '1px solid var(--border)',
                paddingBottom: 'calc(12px + env(safe-area-inset-bottom))'
            }}>
                <form onSubmit={handleSendMessage} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: '#F1F5F9',
                    padding: '8px 12px',
                    borderRadius: '24px'
                }}>
                    <button type="button" style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                        <Image size={20} />
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        style={{
                            flex: 1,
                            background: 'none',
                            border: 'none',
                            outline: 'none',
                            fontSize: '0.95rem',
                            padding: '4px 0'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        style={{
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            opacity: newMessage.trim() ? 1 : 0.5
                        }}
                    >
                        <Send size={18} />
                    </button>
                </form>
            </footer>
        </div>
    )
}
