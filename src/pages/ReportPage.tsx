import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, MapPin, UploadCloud, X, Phone, MessageSquare } from 'lucide-react'
import AppHeader from '../components/AppHeader'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import LocationPicker from '../components/LocationPicker'

const CATEGORIES = ['Electronics', 'Accessories', 'Bags', 'Pets', 'Documents', 'Clothing', 'Keys', 'Other']

export default function ReportPage() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)

    const [tab, setTab] = useState<'missing' | 'found'>('missing')
    const [itemName, setItemName] = useState('')
    const [category, setCategory] = useState('')
    const [location, setLocation] = useState('')
    const [lat, setLat] = useState<number | undefined>()
    const [lng, setLng] = useState<number | undefined>()
    const [description, setDescription] = useState('')
    const [itemColor, setItemColor] = useState('#6366f1')
    const [contact, setContact] = useState<'chat' | 'phone'>('chat')

    const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([])

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        files.forEach((file) => {
            const preview = URL.createObjectURL(file)
            setPhotos((prev) => [...prev, { file, preview }])
        })
    }

    const removePhoto = (index: number) => {
        URL.revokeObjectURL(photos[index].preview)
        setPhotos((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        alert('DEBUG: Submit Called')
        if (!user) {
            alert('DEBUG: No User')
            return
        }

        console.log('Submitting with tab:', tab)
        console.log('User ID:', user.id)

        setLoading(true)
        try {
            // 1. Insert Report
            const payload = {
                reporter_id: user.id,
                report_type: tab,
                item_name: itemName,
                category,
                location_text: location,
                location_lat: lat,
                location_lng: lng,
                description,
                item_color: itemColor,
                contact_preference: contact,
                status: 'active'
            }
            console.log('Insert payload:', payload)

            const { data: report, error: reportError } = await supabase
                .from('reports')
                .insert(payload)
                .select()
                .single()

            if (reportError) {
                console.error('Report Insert Error:', reportError)
                throw reportError
            }

            console.log('Report created:', report)

            // 2. Upload Photos
            if (photos.length > 0) {
                for (let i = 0; i < photos.length; i++) {
                    const photo = photos[i]
                    const fileExt = photo.file.name.split('.').pop()
                    const fileName = `reports/${report.id}/${i}-${Math.random().toString(36).substring(2)}.${fileExt}`

                    const { error: uploadError } = await supabase.storage
                        .from('report-media')
                        .upload(fileName, photo.file)

                    if (uploadError) throw uploadError

                    // 3. Insert Media record
                    const { data: publicUrl } = supabase.storage.from('report-media').getPublicUrl(fileName)

                    await supabase.from('media').insert({
                        report_id: report.id,
                        uploaded_by: user.id,
                        public_url: publicUrl.publicUrl,
                        file_name: photo.file.name,
                        file_type: photo.file.type,
                        storage_path: fileName,
                        sort_order: i
                    })
                }
            }

            alert('Report submitted successfully!')
            navigate('/')
        } catch (err: any) {
            console.error('Submission error full details:', err)
            const errorMsg = err.details || err.message || (typeof err === 'string' ? err : 'Unknown error')
            alert(`Submission Failed: ${errorMsg}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <AppHeader />
            <header className="back-header">
                <button
                    id="report-back-btn"
                    className="back-btn"
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                >
                    ←
                </button>
                <h1 className="back-header-title">Report Item</h1>
            </header>

            <main className="page-content" id="report-content" style={{ paddingTop: '20px', paddingLeft: '16px', paddingRight: '16px' }}>
                {/* Tabs */}
                <div className="report-tabs" role="tablist">
                    <button
                        type="button"
                        id="tab-missing"
                        role="tab"
                        aria-selected={tab === 'missing'}
                        className={`report-tab ${tab === 'missing' ? 'active' : ''}`}
                        onClick={() => setTab('missing')}
                    >
                        Report Missing
                    </button>
                    <button
                        type="button"
                        id="tab-found"
                        role="tab"
                        aria-selected={tab === 'found'}
                        className={`report-tab ${tab === 'found' ? 'active' : ''}`}
                        onClick={() => setTab('found')}
                    >
                        Report Found
                    </button>
                </div>

                <form className="report-form" onSubmit={handleSubmit} id="report-form">
                    {/* Item Name */}
                    <div className="input-group">
                        <label className="input-label" htmlFor="item-name">Item Name</label>
                        <input
                            id="item-name"
                            className="input-field no-icon"
                            type="text"
                            placeholder="e.g. Blue Leather Wallet"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="input-group">
                        <label className="input-label" htmlFor="item-category">Category</label>
                        <div className="select-wrapper">
                            <select
                                id="item-category"
                                className="select-field"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select category</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <span className="select-arrow"><ChevronDown size={15} /></span>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="input-group">
                        <label className="input-label" htmlFor="item-location">Location</label>
                        <LocationPicker
                            onLocationSelect={(lat, lng, address) => {
                                setLat(lat)
                                setLng(lng)
                                setLocation(address)
                            }}
                        />
                        <div className="input-wrapper" style={{ marginTop: '10px' }}>
                            <span className="input-icon"><MapPin size={16} /></span>
                            <input
                                id="item-location"
                                className="input-field"
                                type="text"
                                placeholder="Address will appear here..."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="input-group">
                        <label className="input-label" htmlFor="item-description">Description</label>
                        <textarea
                            id="item-description"
                            className="textarea-field"
                            placeholder="Any distinguishing features, colors, or marks?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                        />
                    </div>

                    {/* Color Picker */}
                    <div className="input-group">
                        <label className="input-label" htmlFor="item-color">Item Color (Optional)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <input
                                id="item-color"
                                type="color"
                                value={itemColor}
                                onChange={(e) => setItemColor(e.target.value)}
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    padding: '0',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    backgroundColor: 'transparent'
                                }}
                            />
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                {itemColor.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Photos */}
                    <div className="input-group">
                        <label className="input-label">Photos</label>
                        <div
                            className="upload-zone"
                            onClick={() => fileInputRef.current?.click()}
                            role="button"
                            tabIndex={0}
                            aria-label="Upload photos"
                            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                            id="photo-upload-zone"
                        >
                            <div className="upload-icon">
                                <UploadCloud size={22} />
                            </div>
                            <p className="upload-label">Tap to upload or drag and drop</p>
                            <p className="upload-hint">PNG, JPG up to 10MB</p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            style={{ display: 'none' }}
                            onChange={handlePhotoUpload}
                            id="photo-file-input"
                        />

                        {/* Photo previews */}
                        {photos.length > 0 && (
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                                {photos.map((item, i) => (
                                    <div key={i} style={{ position: 'relative', width: 70, height: 60 }}>
                                        <img
                                            src={item.preview}
                                            alt={`Upload ${i + 1}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(i)}
                                            style={{
                                                position: 'absolute',
                                                top: -6,
                                                right: -6,
                                                width: 20,
                                                height: 20,
                                                borderRadius: '50%',
                                                background: 'var(--text-primary)',
                                                color: '#fff',
                                                border: 'none',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                            aria-label={`Remove photo ${i + 1}`}
                                            id={`remove-photo-${i}`}
                                        >
                                            <X size={11} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Contact Preference */}
                    <div className="input-group" style={{ opacity: loading ? 0.5 : 1 }}>
                        <label className="input-label">Contact Preference</label>
                        <div className="contact-options">
                            <button
                                type="button"
                                id="contact-chat-btn"
                                className={`contact-option ${contact === 'chat' ? 'selected' : ''}`}
                                onClick={() => !loading && setContact('chat')}
                                aria-pressed={contact === 'chat'}
                                disabled={loading}
                            >
                                <div className={`contact-radio ${contact === 'chat' ? 'selected' : ''}`}>
                                    {contact === 'chat' && <div className="contact-radio-dot" />}
                                </div>
                                <MessageSquare size={15} />
                                In-app chat
                            </button>
                            <button
                                type="button"
                                id="contact-phone-btn"
                                className={`contact-option ${contact === 'phone' ? 'selected' : ''}`}
                                onClick={() => !loading && setContact('phone')}
                                aria-pressed={contact === 'phone'}
                                disabled={loading}
                            >
                                <div className={`contact-radio ${contact === 'phone' ? 'selected' : ''}`}>
                                    {contact === 'phone' && <div className="contact-radio-dot" />}
                                </div>
                                <Phone size={15} />
                                Phone call
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        id="report-submit-btn"
                        type="submit"
                        className="btn btn-primary btn-full"
                        style={{ padding: '15px', fontSize: '0.975rem', borderRadius: '12px', marginTop: 4 }}
                        disabled={loading}
                    >
                        {loading ? 'Submitting Report...' : 'Submit Report'}
                    </button>
                </form>
            </main>
        </>
    )
}
