import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, MapPin, UploadCloud, X, Phone, MessageSquare } from 'lucide-react'

const CATEGORIES = ['Electronics', 'Accessories', 'Bags', 'Pets', 'Documents', 'Clothing', 'Keys', 'Other']

export default function ReportPage() {
    const navigate = useNavigate()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [tab, setTab] = useState<'missing' | 'found'>('missing')
    const [itemName, setItemName] = useState('')
    const [category, setCategory] = useState('')
    const [location, setLocation] = useState('')
    const [description, setDescription] = useState('')
    const [contact, setContact] = useState<'chat' | 'phone'>('chat')
    const [photos, setPhotos] = useState<string[]>([])

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        files.forEach((file) => {
            const reader = new FileReader()
            reader.onload = (ev) => {
                setPhotos((prev) => [...prev, ev.target?.result as string])
            }
            reader.readAsDataURL(file)
        })
    }

    const removePhoto = (index: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        alert('Report submitted successfully!')
        navigate('/')
    }

    return (
        <>
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

            <main className="page-content" id="report-content" style={{ padding: '20px 16px' }}>
                {/* Tabs */}
                <div className="report-tabs" role="tablist">
                    <button
                        id="tab-missing"
                        role="tab"
                        aria-selected={tab === 'missing'}
                        className={`report-tab ${tab === 'missing' ? 'active' : ''}`}
                        onClick={() => setTab('missing')}
                    >
                        Report Missing
                    </button>
                    <button
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
                        <div className="input-wrapper">
                            <span className="input-icon"><MapPin size={16} /></span>
                            <input
                                id="item-location"
                                className="input-field"
                                type="text"
                                placeholder="Where did you see it?"
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
                                {photos.map((src, i) => (
                                    <div key={i} style={{ position: 'relative', width: 70, height: 60 }}>
                                        <img
                                            src={src}
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
                    <div className="input-group">
                        <label className="input-label">Contact Preference</label>
                        <div className="contact-options">
                            <button
                                type="button"
                                id="contact-chat-btn"
                                className={`contact-option ${contact === 'chat' ? 'selected' : ''}`}
                                onClick={() => setContact('chat')}
                                aria-pressed={contact === 'chat'}
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
                                onClick={() => setContact('phone')}
                                aria-pressed={contact === 'phone'}
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
                    >
                        Submit Report
                    </button>
                </form>
            </main>
        </>
    )
}
