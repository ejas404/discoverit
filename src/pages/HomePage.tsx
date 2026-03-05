import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, MapPin, ChevronDown, ArrowRight, Bell } from 'lucide-react'
import AppHeader from '../components/AppHeader'
import ItemCard from '../components/ItemCard'
import { ITEMS } from '../data/items'
import heroSvg from '../assets/undraw_searching-everywhere_tffi.svg'

const CATEGORIES = ['All', 'Electronics', 'Accessories', 'Bags', 'Pets', 'Documents']

export default function HomePage() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [location, setLocation] = useState('')
    const [category, setCategory] = useState('All')

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        // Search logic would go here
    }

    return (
        <>
            <AppHeader />
            <main className="page-content" id="main-content">
                {/* Hero */}
                <section className="hero-svg-section fade-in" aria-label="Hero">
                    <div className="hero-svg-badge" aria-live="polite">
                        <Bell size={11} />
                        New Reports in San Francisco
                    </div>
                    <div className="hero-svg-inner">
                        <div className="hero-svg-text">
                            <h1 className="hero-title">
                                Find What's Lost.<br />
                                <span>Report What's Found.</span>
                            </h1>
                            <p className="hero-subtitle">
                                The community-driven platform to reunite people with their belongings instantly.
                            </p>
                            <div className="hero-actions">
                                <button
                                    id="hero-search-btn"
                                    className="btn btn-primary"
                                    onClick={() => document.getElementById('search-input')?.focus()}
                                >
                                    <Search size={16} />
                                    Search Now
                                </button>
                                <button
                                    id="hero-report-btn"
                                    className="btn btn-outline"
                                    onClick={() => navigate('/report')}
                                >
                                    Report Item
                                </button>
                            </div>
                        </div>
                        <div className="hero-svg-illustration" aria-hidden="true">
                            <img src={heroSvg} alt="" />
                        </div>
                    </div>
                </section>

                {/* Quick Search */}
                <section className="search-section fade-in fade-in-delay-2" aria-label="Quick Search">
                    <div className="search-card">
                        <p className="search-card-title">Quick Search</p>
                        <p className="search-card-sub">What are you looking for?</p>

                        <form onSubmit={handleSearch}>
                            <div className="input-wrapper">
                                <span className="input-icon"><Search size={16} /></span>
                                <input
                                    id="search-input"
                                    className="input-field"
                                    type="text"
                                    placeholder="e.g. iPhone 13, Wallet, Keys"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    aria-label="Search query"
                                />
                            </div>

                            <div className="search-row">
                                <div className="input-group">
                                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Location</span>
                                    <div className="input-wrapper">
                                        <span className="input-icon"><MapPin size={15} /></span>
                                        <input
                                            id="location-input"
                                            className="input-field"
                                            type="text"
                                            placeholder="City or Zip"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            aria-label="Location"
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Category</span>
                                    <div className="select-wrapper">
                                        <select
                                            id="category-select"
                                            className="select-field"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            aria-label="Category"
                                        >
                                            {CATEGORIES.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        <span className="select-arrow"><ChevronDown size={15} /></span>
                                    </div>
                                </div>
                            </div>

                            <div className="search-btn-row">
                                <button id="search-submit-btn" type="submit" className="btn btn-primary btn-full">
                                    <Search size={16} />
                                    Search Items
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                {/* Latest Activities */}
                <section className="section-gap" aria-label="Latest Activities">
                    <div className="section-header">
                        <h2 className="section-title">Latest Activities</h2>
                        <Link to="/map" className="section-view-all" id="view-all-link">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="activities-list">
                        {ITEMS.map((item, i) => (
                            <div
                                key={item.id}
                                className={`fade-in fade-in-delay-${Math.min(i + 1, 3)}`}
                            >
                                <ItemCard {...item} />
                            </div>
                        ))}
                    </div>

                    <div style={{ height: 16 }} />
                </section>
            </main>
        </>
    )
}
