import { useState, useMemo } from "react";
import { Head, Link } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Footer from "@/Components/Footer";

function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function readingTime(content = "") {
    const words = content.replace(/<[^>]+>/g, "").split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
}

function NewsCard({ item }) {
    return (
        <article className="news-card">
            <div className="card-thumb">
                {item.thumbnail ? (
                    <img src={`/storage/${item.thumbnail}`} alt={item.title} loading="lazy" />
                ) : (
                    <div
                        className="card-thumb-placeholder"
                        style={{ background: `linear-gradient(135deg, ${item.category_color}22, ${item.category_color}55)` }}
                    >
                        <svg width="36" height="36" fill="none" stroke={item.category_color} strokeWidth="1.5" viewBox="0 0 24 24" style={{ opacity: 0.5 }}>
                            <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-6-4h3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                )}
                <div className="card-thumb-overlay" />
                {item.is_featured === 1 && (
                    <div className="card-featured-badge">⭐ Unggulan</div>
                )}
                {item.status !== "published" && (
                    <div className={`card-status-badge card-status-${item.status}`}>
                        {item.status === "draft" ? "Draft" : "Arsip"}
                    </div>
                )}
            </div>

            <div className="card-body">
                <div className="card-meta-row">
                    <span
                        className="card-category"
                        style={{ background: item.category_color || "#059669" }}
                    >
                        <span className="category-dot" />
                        {item.category_name}
                    </span>
                    <span className="card-date">
                        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {formatDate(item.published_at || item.created_at)}
                    </span>
                </div>

                <h2 className="card-title">
                    <Link href={`/news/${item.slug}`}>{item.title}</Link>
                </h2>

                {item.excerpt && (
                    <p className="card-excerpt">{item.excerpt}</p>
                )}

                <div className="card-footer">
                    <div className="card-author">
                        <div className="card-avatar">
                            {item.user_name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <span className="card-author-name">{item.user_name}</span>
                    </div>
                    <div className="card-stats">
                        <span className="card-stat">
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                            {item.views_count?.toLocaleString("id-ID") || 0}
                        </span>
                        <span className="card-stat">
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {readingTime(item.content)} mnt
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default function AllNews({ news = [] }) {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [activeStatus, setActiveStatus] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [page, setPage] = useState(1);
    const PER_PAGE = 12;

    const categories = useMemo(() => {
        const map = {};
        news.forEach((n) => {
            if (!map[n.news_category_id]) {
                map[n.news_category_id] = { id: n.news_category_id, name: n.category_name, color: n.category_color };
            }
        });
        return Object.values(map);
    }, [news]);

    const filtered = useMemo(() => {
        let result = [...news];
        if (activeCategory !== "all") result = result.filter((n) => String(n.news_category_id) === String(activeCategory));
        if (activeStatus !== "all") result = result.filter((n) => n.status === activeStatus);
        if (search.trim()) result = result.filter((n) =>
            n.title.toLowerCase().includes(search.toLowerCase()) ||
            (n.excerpt || "").toLowerCase().includes(search.toLowerCase())
        );
        if (sortBy === "newest") result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        else if (sortBy === "oldest") result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        else if (sortBy === "popular") result.sort((a, b) => b.views_count - a.views_count);
        else if (sortBy === "featured") result.sort((a, b) => b.is_featured - a.is_featured);
        return result;
    }, [news, activeCategory, activeStatus, search, sortBy]);

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
    const resetPage = (fn) => (val) => { fn(val); setPage(1); };

    const stats = useMemo(() => ({
        total: news.length,
        published: news.filter((n) => n.status === "published").length,
        draft: news.filter((n) => n.status === "draft").length,
        featured: news.filter((n) => n.is_featured).length,
    }), [news]);

    return (
        <>
            <Head title="Semua Berita" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

                :root {
                    --green-deep: #065f46;
                    --green-mid: #059669;
                    --green-light: #d1fae5;
                    --yellow-warm: #f59e0b;
                    --yellow-light: #fef3c7;
                    --white: #ffffff;
                    --gray-soft: #f8fafc;
                    --gray-text: #374151;
                    --gray-muted: #9ca3af;
                }
                * { box-sizing: border-box; }
                body { font-family: 'DM Sans', sans-serif; background-color: var(--gray-soft); margin: 0; }

                .page-wrapper {
                    min-height: 100vh;
                    background:
                        radial-gradient(ellipse at 10% 0%, rgba(6,95,70,0.06) 0%, transparent 50%),
                        radial-gradient(ellipse at 90% 100%, rgba(245,158,11,0.07) 0%, transparent 50%),
                        #f8fafc;
                }

                /* NAVBAR */
                .navbar {
                    background: var(--white);
                    border-bottom: 2px solid var(--green-light);
                    position: sticky; top: 0; z-index: 50;
                    box-shadow: 0 1px 12px rgba(6,95,70,0.08);
                }
                .navbar-inner {
                    max-width: 1200px; margin: 0 auto;
                    padding: 14px 24px;
                    display: flex; align-items: center; gap: 16px;
                }
                .navbar-brand {
                    display: flex; align-items: center; gap: 10px;
                    text-decoration: none; flex-shrink: 0;
                }
                .navbar-brand span {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.2rem; font-weight: 700;
                    color: var(--green-deep); letter-spacing: -0.3px;
                }
                .navbar-search { flex: 1; max-width: 380px; margin-left: auto; position: relative; }
                .navbar-search svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--gray-muted); pointer-events: none; }
                .navbar-search input {
                    width: 100%; padding: 8px 14px 8px 36px;
                    font-family: 'DM Sans', sans-serif; font-size: 0.875rem;
                    background: var(--gray-soft);
                    border: 1.5px solid var(--green-light); border-radius: 50px;
                    outline: none; color: var(--gray-text); transition: all 0.2s;
                }
                .navbar-search input:focus {
                    border-color: var(--green-mid); background: var(--white);
                    box-shadow: 0 0 0 3px rgba(5,150,105,0.1);
                }

                /* MAIN */
                .main-wrapper { max-width: 1200px; margin: 0 auto; padding: 40px 24px 80px; }

                /* PAGE HEADING */
                .page-heading { margin-bottom: 32px; }
                .page-heading h1 {
                    font-family: 'Playfair Display', serif;
                    font-size: 2rem; font-weight: 800;
                    color: var(--green-deep); margin: 0 0 6px; letter-spacing: -0.5px;
                }
                .page-heading p { font-size: 0.92rem; color: var(--gray-muted); margin: 0 0 24px; }

                /* STATS */
                .stats-strip { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; margin-bottom: 24px; }
                .stat-card {
                    background: var(--white); border-radius: 14px; padding: 16px 18px;
                    border: 1px solid var(--green-light); box-shadow: 0 2px 10px rgba(6,95,70,0.05);
                    display: flex; align-items: center; gap: 12px;
                }
                .stat-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .stat-number { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 800; line-height: 1; }
                .stat-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; color: var(--gray-muted); margin-top: 3px; }

                /* FILTER BAR */
                .filter-bar {
                    background: var(--white); border-radius: 16px; padding: 16px 20px;
                    border: 1px solid var(--green-light); box-shadow: 0 2px 10px rgba(6,95,70,0.05);
                    margin-bottom: 24px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px;
                }
                .filter-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--gray-muted); flex-shrink: 0; }
                .filter-pills { display: flex; flex-wrap: wrap; gap: 8px; flex: 1; }
                .filter-pill-all {
                    display: inline-flex; align-items: center;
                    padding: 5px 14px; border-radius: 50px;
                    font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 600;
                    cursor: pointer; border: 1.5px solid #e5e7eb;
                    background: var(--gray-soft); color: var(--gray-text); transition: all 0.2s;
                }
                .filter-pill-all.active { background: var(--green-deep); color: var(--white); border-color: var(--green-deep); }
                .filter-pill-cat {
                    display: inline-flex; align-items: center; gap: 5px;
                    padding: 5px 12px; border-radius: 50px;
                    font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 600;
                    cursor: pointer; border: 1.5px solid transparent; transition: all 0.2s;
                }
                .category-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
                .filter-selects { display: flex; gap: 8px; margin-left: auto; flex-shrink: 0; }
                .filter-select {
                    font-family: 'DM Sans', sans-serif; font-size: 0.78rem;
                    background: var(--gray-soft); border: 1.5px solid var(--green-light);
                    border-radius: 10px; padding: 6px 10px; color: var(--gray-text);
                    outline: none; cursor: pointer; transition: border-color 0.2s;
                }
                .filter-select:focus { border-color: var(--green-mid); }

                /* RESULT INFO */
                .result-info { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; font-size: 0.85rem; color: var(--gray-muted); }
                .result-info strong { color: var(--green-deep); }
                .result-info em { color: var(--green-mid); font-style: normal; font-weight: 600; }

                /* NEWS GRID */
                .news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }

                /* NEWS CARD */
                .news-card {
                    background: var(--white); border-radius: 20px; overflow: hidden;
                    border: 1px solid var(--green-light); box-shadow: 0 4px 20px rgba(6,95,70,0.07);
                    display: flex; flex-direction: column;
                    transition: transform 0.25s ease, box-shadow 0.25s ease;
                }
                .news-card:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(6,95,70,0.14); }

                .card-thumb { position: relative; width: 100%; aspect-ratio: 16/9; overflow: hidden; background: var(--green-light); }
                .card-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s ease; }
                .news-card:hover .card-thumb img { transform: scale(1.04); }
                .card-thumb-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
                .card-thumb-overlay { position: absolute; bottom: 0; left: 0; right: 0; height: 50%; background: linear-gradient(to top, rgba(6,95,70,0.4), transparent); }

                .card-featured-badge {
                    position: absolute; top: 12px; right: 12px;
                    background: linear-gradient(135deg, var(--yellow-warm), #d97706);
                    color: white; font-size: 0.68rem; font-weight: 700;
                    letter-spacing: 1px; text-transform: uppercase;
                    padding: 4px 10px; border-radius: 50px;
                    box-shadow: 0 2px 8px rgba(245,158,11,0.45);
                }
                .card-status-badge { position: absolute; top: 12px; left: 12px; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; padding: 4px 10px; border-radius: 50px; }
                .card-status-draft { background: var(--yellow-light); color: #92400e; }
                .card-status-archived { background: #f1f5f9; color: #64748b; }

                .card-body { padding: 18px 20px; display: flex; flex-direction: column; flex: 1; }
                .card-meta-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }

                .card-category {
                    display: inline-flex; align-items: center; gap: 4px;
                    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.8px;
                    text-transform: uppercase; padding: 4px 10px; border-radius: 50px; color: white;
                }
                .card-date { display: flex; align-items: center; gap: 4px; font-size: 0.75rem; color: var(--gray-muted); }

                .card-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.05rem; font-weight: 700; line-height: 1.35;
                    color: var(--green-deep); margin: 0 0 8px;
                    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
                }
                .card-title a { text-decoration: none; color: inherit; transition: color 0.2s; }
                .card-title a:hover { color: var(--green-mid); }

                .card-excerpt {
                    font-size: 0.84rem; line-height: 1.65; color: #6b7280;
                    margin: 0 0 14px; flex: 1;
                    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
                }

                .card-footer { margin-top: auto; padding-top: 12px; border-top: 1px solid var(--green-light); display: flex; align-items: center; justify-content: space-between; }
                .card-author { display: flex; align-items: center; gap: 7px; }
                .card-avatar {
                    width: 26px; height: 26px; border-radius: 50%;
                    background: linear-gradient(135deg, var(--green-mid), var(--green-deep));
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Playfair Display', serif; font-size: 0.75rem; font-weight: 700; color: white; flex-shrink: 0;
                }
                .card-author-name { font-size: 0.78rem; font-weight: 500; color: var(--green-deep); max-width: 100px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .card-stats { display: flex; align-items: center; gap: 10px; }
                .card-stat { display: flex; align-items: center; gap: 3px; font-size: 0.75rem; color: var(--gray-muted); }

                /* EMPTY */
                .empty-state { text-align: center; padding: 80px 24px; color: var(--gray-muted); }
                .empty-state svg { opacity: 0.25; margin-bottom: 16px; }
                .empty-state h3 { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: var(--green-deep); margin: 0 0 6px; }
                .empty-state p { font-size: 0.88rem; margin: 0; }

                /* PAGINATION */
                .pagination { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 40px; }
                .page-btn {
                    height: 36px; min-width: 36px; padding: 0 12px; border-radius: 10px;
                    font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600;
                    cursor: pointer; border: 1.5px solid var(--green-light);
                    background: var(--white); color: var(--green-deep); transition: all 0.2s;
                    display: flex; align-items: center; justify-content: center; gap: 4px;
                }
                .page-btn:hover:not(:disabled) { background: var(--green-light); border-color: var(--green-mid); }
                .page-btn.active { background: var(--green-deep); color: var(--white); border-color: var(--green-deep); box-shadow: 0 2px 10px rgba(6,95,70,0.3); }
                .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
                .page-ellipsis { font-size: 0.85rem; color: var(--gray-muted); padding: 0 4px; }

                @media (max-width: 640px) {
                    .main-wrapper { padding: 24px 16px 60px; }
                    .page-heading h1 { font-size: 1.5rem; }
                    .stats-strip { grid-template-columns: 1fr 1fr; }
                    .filter-selects { margin-left: 0; }
                    .news-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="page-wrapper">
                {/* Navbar */}
                <nav className="navbar">
                    <div className="navbar-inner">
                        <Link href="/" className="navbar-brand">
                            <ApplicationLogo className="h-8 w-8 fill-current" style={{ color: "#065f46" }} />
                            <span>NewsPortal</span>
                        </Link>
                        <div className="navbar-search">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Cari berita..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            />
                        </div>
                    </div>
                </nav>

                <div className="main-wrapper">
                    {/* Heading + Stats */}
                    <div className="page-heading">
                        <h1>Semua Berita</h1>
                        <p>Menampilkan seluruh berita yang tersedia di sistem</p>

                        <div className="stats-strip">
                            {[
                                { label: "Total Berita", value: stats.total, bg: "rgba(6,95,70,0.1)", color: "#065f46", d: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-6-4h3" },
                                { label: "Dipublikasi", value: stats.published, bg: "rgba(5,150,105,0.12)", color: "#059669", d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
                                { label: "Draft", value: stats.draft, bg: "rgba(245,158,11,0.12)", color: "#d97706", d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
                                { label: "Unggulan", value: stats.featured, bg: "rgba(245,158,11,0.15)", color: "#f59e0b", d: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
                            ].map((s) => (
                                <div className="stat-card" key={s.label}>
                                    <div className="stat-icon" style={{ background: s.bg }}>
                                        <svg width="18" height="18" fill="none" stroke={s.color} strokeWidth="1.8" viewBox="0 0 24 24">
                                            <path d={s.d} strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="stat-number" style={{ color: s.color }}>{s.value}</div>
                                        <div className="stat-label">{s.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="filter-bar">
                        <span className="filter-label">Filter</span>
                        <div className="filter-pills">
                            <button
                                className={`filter-pill-all ${activeCategory === "all" ? "active" : ""}`}
                                onClick={() => resetPage(setActiveCategory)("all")}
                            >
                                Semua
                            </button>
                            {categories.map((cat) => {
                                const isActive = String(activeCategory) === String(cat.id);
                                return (
                                    <button
                                        key={cat.id}
                                        className="filter-pill-cat"
                                        onClick={() => resetPage(setActiveCategory)(String(cat.id))}
                                        style={{
                                            background: isActive ? cat.color : `${cat.color}18`,
                                            color: isActive ? "#fff" : cat.color,
                                            borderColor: `${cat.color}55`,
                                            boxShadow: isActive ? `0 2px 8px ${cat.color}44` : "none",
                                        }}
                                    >
                                        <span className="category-dot" style={{ background: isActive ? "rgba(255,255,255,0.7)" : cat.color }} />
                                        {cat.name}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="filter-selects">
                            <select className="filter-select" value={activeStatus} onChange={(e) => resetPage(setActiveStatus)(e.target.value)}>
                                <option value="all">Semua Status</option>
                                <option value="published">Dipublikasi</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Arsip</option>
                            </select>
                            <select className="filter-select" value={sortBy} onChange={(e) => resetPage(setSortBy)(e.target.value)}>
                                <option value="newest">Terbaru</option>
                                <option value="oldest">Terlama</option>
                                <option value="popular">Terpopuler</option>
                                <option value="featured">Unggulan</option>
                            </select>
                        </div>
                    </div>

                    {/* Result Info */}
                    <div className="result-info">
                        <span>
                            Menampilkan <strong>{filtered.length}</strong> berita
                            {search && <> untuk "<em>{search}</em>"</>}
                        </span>
                        {totalPages > 1 && <span>Halaman {page} dari {totalPages}</span>}
                    </div>

                    {/* Grid */}
                    {paginated.length > 0 ? (
                        <div className="news-grid">
                            {paginated.map((item) => <NewsCard key={item.id} item={item} />)}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <svg width="64" height="64" fill="none" stroke="#065f46" strokeWidth="1" viewBox="0 0 24 24">
                                <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <h3>Tidak ada berita ditemukan</h3>
                            <p>Coba ubah filter atau kata kunci pencarian</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button className="page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Prev
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                                .reduce((acc, p, idx, arr) => {
                                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                                    acc.push(p);
                                    return acc;
                                }, [])
                                .map((p, i) =>
                                    p === "..." ? (
                                        <span key={`e-${i}`} className="page-ellipsis">…</span>
                                    ) : (
                                        <button key={p} className={`page-btn ${page === p ? "active" : ""}`} onClick={() => setPage(p)}>
                                            {p}
                                        </button>
                                    )
                                )}
                            <button className="page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                                Next
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                <Footer />
            </div>
        </>
    );
}
