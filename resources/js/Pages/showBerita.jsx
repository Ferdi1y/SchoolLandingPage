import { Link, Head } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Footer from '@/Components/Footer';

export default function ShowBerita({ news }) {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            <Head title={news.title} />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

                :root {
                    --green-deep: #065f46;
                    --green-mid: #059669;
                    --green-light: #d1fae5;
                    --yellow-warm: #f59e0b;
                    --yellow-light: #fef3c7;
                    --yellow-pale: #fffbeb;
                    --white: #ffffff;
                    --gray-soft: #f8fafc;
                    --gray-text: #374151;
                    --gray-muted: #9ca3af;
                }

                * { box-sizing: border-box; }

                body {
                    font-family: 'DM Sans', sans-serif;
                    background-color: var(--gray-soft);
                    margin: 0;
                }

                .page-wrapper {
                    min-height: 100vh;
                    background:
                        radial-gradient(ellipse at 10% 0%, rgba(6,95,70,0.06) 0%, transparent 50%),
                        radial-gradient(ellipse at 90% 100%, rgba(245,158,11,0.07) 0%, transparent 50%),
                        #f8fafc;
                }

                /* ── NAVBAR ── */
                .navbar {
                    background: var(--white);
                    border-bottom: 2px solid var(--green-light);
                    position: sticky;
                    top: 0;
                    z-index: 50;
                    box-shadow: 0 1px 12px rgba(6,95,70,0.08);
                }
                .navbar-inner {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 14px 24px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .navbar-brand {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    text-decoration: none;
                }
                .navbar-brand span {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: var(--green-deep);
                    letter-spacing: -0.3px;
                }
                .back-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: var(--green-mid);
                    text-decoration: none;
                    padding: 7px 14px;
                    border: 1.5px solid var(--green-mid);
                    border-radius: 50px;
                    transition: all 0.2s ease;
                }
                .back-btn:hover {
                    background: var(--green-mid);
                    color: white;
                }

                /* ── MAIN CONTAINER ── */
                .article-wrapper {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 40px 24px 80px;
                }

                /* ── HERO CARD ── */
                .hero-card {
                    background: var(--white);
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 4px 24px rgba(6,95,70,0.09);
                    border: 1px solid var(--green-light);
                    margin-bottom: 32px;
                }

                .thumbnail-wrapper {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 16/7;
                    overflow: hidden;
                }
                .thumbnail-wrapper img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    transition: transform 0.6s ease;
                }
                .thumbnail-wrapper:hover img {
                    transform: scale(1.02);
                }
                .thumbnail-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 60%;
                    background: linear-gradient(to top, rgba(6,95,70,0.55), transparent);
                }

                /* Featured Badge */
                .featured-badge {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    background: linear-gradient(135deg, var(--yellow-warm), #d97706);
                    color: white;
                    font-size: 0.72rem;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    padding: 5px 12px;
                    border-radius: 50px;
                    box-shadow: 0 2px 10px rgba(245,158,11,0.45);
                }

                /* ── ARTICLE HEADER ── */
                .article-header {
                    padding: 28px 36px 24px;
                }

                .meta-row {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-bottom: 16px;
                }

                .category-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    letter-spacing: 0.8px;
                    text-transform: uppercase;
                    padding: 5px 12px;
                    border-radius: 50px;
                    color: white;
                }
                .category-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.7);
                }

                .date-chip {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 0.8rem;
                    color: var(--gray-muted);
                    font-weight: 400;
                }
                .date-chip svg { flex-shrink: 0; }

                .views-chip {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 0.8rem;
                    color: var(--gray-muted);
                    margin-left: auto;
                }

                .article-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 2rem;
                    font-weight: 800;
                    line-height: 1.28;
                    color: var(--green-deep);
                    margin: 0 0 16px;
                    letter-spacing: -0.5px;
                }

                .article-excerpt {
                    font-size: 1.05rem;
                    line-height: 1.7;
                    color: #4b5563;
                    font-style: italic;
                    border-left: 3px solid var(--yellow-warm);
                    padding-left: 16px;
                    margin: 0;
                }

                /* ── DIVIDER ── */
                .divider {
                    height: 1px;
                    margin: 0 36px;
                    background: linear-gradient(to right, var(--green-light), var(--yellow-light), transparent);
                }

                /* ── AUTHOR ROW ── */
                .author-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 18px 36px;
                }
                .author-avatar {
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--green-mid), var(--green-deep));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Playfair Display', serif;
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: white;
                    flex-shrink: 0;
                }
                .author-info small {
                    display: block;
                    font-size: 0.72rem;
                    color: var(--gray-muted);
                    font-weight: 400;
                    letter-spacing: 0.5px;
                }
                .author-info strong {
                    display: block;
                    font-size: 0.9rem;
                    color: var(--green-deep);
                    font-weight: 600;
                }

                /* ── CONTENT CARD ── */
                .content-card {
                    background: var(--white);
                    border-radius: 20px;
                    padding: 36px;
                    box-shadow: 0 4px 24px rgba(6,95,70,0.07);
                    border: 1px solid var(--green-light);
                    margin-bottom: 32px;
                }
                .content-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.72rem;
                    font-weight: 700;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    color: var(--green-mid);
                    margin-bottom: 20px;
                }
                .content-label::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: var(--green-light);
                }
                .article-content {
                    font-size: 1.05rem;
                    line-height: 1.9;
                    color: var(--gray-text);
                    white-space: pre-wrap;
                }

                /* ── INFO STRIP ── */
                .info-strip {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
                    gap: 16px;
                }
                .info-card {
                    background: var(--white);
                    border-radius: 14px;
                    padding: 18px 20px;
                    border: 1px solid var(--green-light);
                    box-shadow: 0 2px 10px rgba(6,95,70,0.05);
                }
                .info-card-label {
                    font-size: 0.7rem;
                    font-weight: 600;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    color: var(--gray-muted);
                    margin-bottom: 6px;
                }
                .info-card-value {
                    font-size: 0.92rem;
                    font-weight: 600;
                    color: var(--green-deep);
                }
                .info-card-value.accent {
                    color: var(--yellow-warm);
                }
                .info-card-value.green {
                    color: var(--green-mid);
                }

                /* ── STATUS PILL ── */
                .status-pill {
                    display: inline-block;
                    padding: 2px 10px;
                    border-radius: 50px;
                    font-size: 0.78rem;
                    font-weight: 600;
                }
                .status-published {
                    background: var(--green-light);
                    color: var(--green-deep);
                }

                /* ── RESPONSIVE ── */
                @media (max-width: 600px) {
                    .article-header { padding: 20px; }
                    .divider { margin: 0 20px; }
                    .author-row { padding: 14px 20px; }
                    .content-card { padding: 24px 20px; }
                    .article-title { font-size: 1.5rem; }
                    .views-chip { margin-left: 0; }
                }
            `}</style>

            <div className="page-wrapper">
                {/* Navbar */}
                <nav className="navbar">
                    <div className="navbar-inner">
                        <Link href="/" className="navbar-brand">
                            <ApplicationLogo className="h-8 w-8 fill-current" style={{ color: '#065f46' }} />
                            <span>NewsPortal</span>
                        </Link>
                        <Link href={route('home')} className="back-btn">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path d="M19 12H5M5 12l7-7M5 12l7 7" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Kembali
                        </Link>
                    </div>
                </nav>

                {/* Article */}
                <div className="article-wrapper">

                    {/* Hero Card */}
                    <div className="hero-card">

                        {/* Thumbnail */}
                        {news.thumbnail && (
                            <div className="thumbnail-wrapper">
                                <img
                                    src={`/storage/${news.thumbnail}`}
                                    alt={news.title}
                                />
                                <div className="thumbnail-overlay" />
                                {news.is_featured === 1 && (
                                    <div className="featured-badge">⭐ Unggulan</div>
                                )}
                            </div>
                        )}

                        {/* Header */}
                        <div className="article-header">
                            <div className="meta-row">
                                {news.category_name && (
                                    <span
                                        className="category-badge"
                                        style={{ background: news.category_color || '#059669' }}
                                    >
                                        <span className="category-dot" />
                                        {news.category_name}
                                    </span>
                                )}
                                <span className="date-chip">
                                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                                        <line x1="3" y1="10" x2="21" y2="10"/>
                                    </svg>
                                    {formatDate(news.published_at)}
                                </span>
                                <span className="views-chip">
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                    {news.views_count} tayangan
                                </span>
                            </div>

                            <h1 className="article-title">{news.title}</h1>

                            {news.excerpt && (
                                <p className="article-excerpt">{news.excerpt}</p>
                            )}
                        </div>

                        <div className="divider" />

                        {/* Author */}
                        {news.user_name && (
                            <div className="author-row">
                                <div className="author-avatar">
                                    {news.user_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="author-info">
                                    <small>Ditulis oleh</small>
                                    <strong>{news.user_name}</strong>
                                </div>
                                <div style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#9ca3af' }}>
                                    {formatTime(news.published_at)} WIB
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content Card */}
                    <div className="content-card">
                        <div className="content-label">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <polyline points="10 9 9 9 8 9"/>
                            </svg>
                            Isi Berita
                        </div>
                        <div className="article-content"
                            dangerouslySetInnerHTML={{ __html: news.content }}
                        />
                    </div>

                    {/* Info Strip */}
                    <div className="info-strip">
                        <div className="info-card">
                            <div className="info-card-label">Status</div>
                            <div className="info-card-value">
                                <span className={`status-pill ${news.status === 'published' ? 'status-published' : ''}`}>
                                    {news.status === 'published' ? 'Dipublikasikan' : news.status}
                                </span>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="info-card-label">Kategori</div>
                            <div className="info-card-value green">{news.category_name || '-'}</div>
                        </div>
                        <div className="info-card">
                            <div className="info-card-label">Tayangan</div>
                            <div className="info-card-value accent">{news.views_count?.toLocaleString('id-ID') || 0}×</div>
                        </div>
                        <div className="info-card">
                            <div className="info-card-label">Dipublikasikan</div>
                            <div className="info-card-value" style={{ fontSize: '0.82rem' }}>
                                {formatDate(news.published_at)}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}