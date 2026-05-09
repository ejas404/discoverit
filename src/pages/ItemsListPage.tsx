import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import ItemCard from '../components/ItemCard'
import AppHeader from '../components/AppHeader'

export default function ItemsListPage() {
    const { type } = useParams<{ type: string }>() // 'my-reports' or 'saved'
    const navigate = useNavigate()
    const { user } = useAuth()
    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const isMyReports = type === 'my-reports'
    const title = isMyReports ? 'My Reports' : 'Saved Items'

    useEffect(() => {
        if (!user) return

        const fetchItems = async () => {
            setLoading(true)
            try {
                if (isMyReports) {
                    const { data, error } = await supabase
                        .from('reports')
                        .select('*, media(public_url)')
                        .eq('reporter_id', user.id)
                        .order('created_at', { ascending: false })

                    if (error) throw error
                    setItems(data || [])
                } else {
                    const { data, error } = await supabase
                        .from('saved_items')
                        .select('*, report:reports(*, media(public_url))')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false })

                    if (error) throw error
                    setItems(data?.map(s => s.report) || [])
                }
            } catch (err) {
                console.error('Error fetching list:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchItems()
    }, [user, isMyReports])

    return (
        <div className="items-list-page">
            <AppHeader />
            <header className="back-header">
                <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
                <h1 className="back-header-title">{title}</h1>
                <div style={{ width: 40 }} />
            </header>

            <main className="page-content" style={{ paddingTop: '20px', paddingLeft: '16px', paddingRight: '16px' }}>
                {loading ? (
                    <div className="flex-center" style={{ padding: 40, flexDirection: 'column', gap: 12 }}>
                        <div className="spinner"></div>
                        <p style={{ color: 'var(--text-muted)' }}>Loading items...</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '20px', border: '1px solid var(--border)' }}>
                        <h3>No items found</h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            {isMyReports
                                ? "You haven't reported any items yet."
                                : "You haven't saved any items yet."}
                        </p>
                        <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
                            Browse Items
                        </button>
                    </div>
                ) : (
                    <div className="activities-list">
                        {items.map((item) => (
                            <ItemCard
                                key={item.id}
                                id={item.id}
                                name={item.item_name}
                                location={item.location_text}
                                status={item.report_type === 'missing' ? 'MISSING' : 'FOUND'}
                                imageUrl={item.media?.[0]?.public_url}
                                color={item.item_color}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
