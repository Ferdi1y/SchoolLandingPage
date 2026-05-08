import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    LayoutDashboard,
    Newspaper,
    Tag,
    Users,
    Trophy,
    Menu,
    X,
    ChevronDown,
    LogOut,
    User,
} from 'lucide-react';

const navItems = [
    { label: 'Dashboard', href: 'dashboard', icon: LayoutDashboard },
    { label: 'Berita', href: 'news.index', icon: Newspaper },
    { label: 'Pendaftaran', href: 'admin.pendaftaran.index', icon: Newspaper },
    { label: 'Users', href: 'users.index', icon: Users },
    
];

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

        if (!user) {
        return <div>Loading...</div>;
    }


    const isActive = (routeName) => {
        try { return route().current(routeName) || route().current(routeName + '.*'); }
        catch { return false; }
    };

    const initials = user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className="al-root">
            <style>{`
                .al-root { min-height:100vh; background:#F1F5F9; font-family:system-ui,sans-serif; }

                /* ── Navbar ── */
                .al-nav { background:#fff; border-bottom:1px solid #E2E8F0; position:sticky; top:0; z-index:40; }
                .al-nav-inner { max-width:1280px; margin:0 auto; padding:0 20px; display:flex; align-items:center; justify-content:space-between; height:56px; gap:12px; }

                /* Logo */
                .al-logo { display:flex; align-items:center; gap:10px; text-decoration:none; flex-shrink:0; }
                .al-logo-mark { width:32px; height:32px; background:#2563EB; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
                .al-logo-text { font-size:0.9rem; font-weight:700; color:#0F172A; letter-spacing:-0.02em; }

                /* Desktop nav links */
                .al-nav-links { display:flex; align-items:center; gap:2px; flex:1; padding:0 16px; }
                @media(max-width:768px){ .al-nav-links{ display:none; } }
                .al-nav-link { display:inline-flex; align-items:center; gap:7px; padding:6px 11px; border-radius:7px; font-size:0.83rem; font-weight:500; color:#64748B; text-decoration:none; transition:all 0.12s; white-space:nowrap; }
                .al-nav-link:hover { background:#F8FAFC; color:#334155; }
                .al-nav-link.active { background:#EFF6FF; color:#2563EB; }
                .al-nav-link svg { flex-shrink:0; }

                /* User menu */
                .al-user-area { display:flex; align-items:center; gap:8px; flex-shrink:0; }
                @media(max-width:768px){ .al-user-area{ display:none; } }
                .al-user-btn { display:inline-flex; align-items:center; gap:8px; padding:5px 10px 5px 5px; border:1px solid #E2E8F0; border-radius:8px; background:#fff; cursor:pointer; transition:all 0.12s; }
                .al-user-btn:hover { background:#F8FAFC; border-color:#CBD5E1; }
                .al-avatar { width:28px; height:28px; border-radius:6px; background:#EFF6FF; display:flex; align-items:center; justify-content:center; font-size:0.7rem; font-weight:700; color:#2563EB; flex-shrink:0; }
                .al-user-name { font-size:0.82rem; font-weight:500; color:#334155; max-width:120px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
                .al-chevron { color:#94A3B8; transition:transform 0.15s; }
                .al-chevron.open { transform:rotate(180deg); }

                /* Dropdown */
                .al-dropdown { position:relative; }
                .al-dropdown-menu { position:absolute; right:0; top:calc(100% + 6px); background:#fff; border:1px solid #E2E8F0; border-radius:10px; box-shadow:0 8px 24px rgba(0,0,0,0.08); min-width:180px; overflow:hidden; z-index:50; }
                .al-dropdown-header { padding:12px 14px; border-bottom:1px solid #F1F5F9; }
                .al-dropdown-name { font-size:0.82rem; font-weight:600; color:#0F172A; }
                .al-dropdown-email { font-size:0.75rem; color:#94A3B8; margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
                .al-dropdown-item { display:flex; align-items:center; gap:9px; padding:9px 14px; font-size:0.82rem; color:#475569; text-decoration:none; cursor:pointer; background:none; border:none; width:100%; text-align:left; transition:background 0.1s; }
                .al-dropdown-item:hover { background:#F8FAFC; color:#0F172A; }
                .al-dropdown-item.danger { color:#EF4444; }
                .al-dropdown-item.danger:hover { background:#FEF2F2; }
                .al-dropdown-divider { height:1px; background:#F1F5F9; }

                /* Mobile toggle */
                .al-mobile-toggle { display:none; align-items:center; justify-content:center; width:36px; height:36px; border:1px solid #E2E8F0; border-radius:8px; background:#fff; cursor:pointer; color:#64748B; }
                @media(max-width:768px){ .al-mobile-toggle{ display:flex; } }

                /* Mobile menu */
                .al-mobile-menu { display:none; border-top:1px solid #F1F5F9; background:#fff; }
                .al-mobile-menu.open { display:block; }
                @media(min-width:769px){ .al-mobile-menu{ display:none !important; } }
                .al-mobile-links { padding:8px 12px; display:flex; flex-direction:column; gap:2px; }
                .al-mobile-link { display:flex; align-items:center; gap:9px; padding:9px 12px; border-radius:8px; font-size:0.875rem; font-weight:500; color:#475569; text-decoration:none; transition:all 0.1s; }
                .al-mobile-link:hover { background:#F8FAFC; color:#334155; }
                .al-mobile-link.active { background:#EFF6FF; color:#2563EB; }
                .al-mobile-user { padding:12px; border-top:1px solid #F1F5F9; display:flex; align-items:center; justify-content:space-between; gap:10px; }
                .al-mobile-user-info { display:flex; align-items:center; gap:10px; }
                .al-mobile-avatar { width:36px; height:36px; border-radius:8px; background:#EFF6FF; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:700; color:#2563EB; flex-shrink:0; }
                .al-mobile-name { font-size:0.875rem; font-weight:600; color:#0F172A; }
                .al-mobile-email { font-size:0.75rem; color:#94A3B8; }
                .al-mobile-actions { display:flex; gap:6px; }
                .al-mobile-action-btn { display:inline-flex; align-items:center; gap:5px; padding:7px 10px; border:1px solid #E2E8F0; border-radius:7px; font-size:0.78rem; font-weight:500; color:#475569; text-decoration:none; background:#fff; cursor:pointer; transition:all 0.1s; }
                .al-mobile-action-btn:hover { background:#F8FAFC; }
                .al-mobile-action-btn.logout { color:#EF4444; border-color:#FEE2E2; }
                .al-mobile-action-btn.logout:hover { background:#FEF2F2; }

                /* Page header */
                .al-page-header { background:#fff; border-bottom:1px solid #E2E8F0; }
                .al-page-header-inner { max-width:1280px; margin:0 auto; padding:14px 20px; }

                /* Main content */
                .al-main { max-width:1280px; margin:0 auto; }
            `}</style>

            {/* ── Navbar ── */}
            <nav className="al-nav">
                <div className="al-nav-inner">
                    {/* Logo */}
                    <Link href={route('home')} className="al-logo">
                        <div className="al-logo-mark">
                            <ApplicationLogo style={{ width: 18, height: 18, fill: '#fff' }} />
                        </div>
                        <span className="al-logo-text">MTs Darul Ihsan</span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="al-nav-links">
                        {navItems.map(({ label, href, icon: Icon }) => (
                            <Link
                                key={href}
                                href={route(href)}
                                className={`al-nav-link${isActive(href.replace('.index', '').replace('.', '.')) ? ' active' : ''}`}
                            >
                                <Icon size={14} strokeWidth={1.8} />
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* User dropdown */}
                    <div className="al-user-area">
                        <div className="al-dropdown">
                            <button
                                className="al-user-btn"
                                onClick={() => setUserMenuOpen((p) => !p)}
                                onBlur={() => setTimeout(() => setUserMenuOpen(false), 150)}
                            >
                                <div className="al-avatar">{initials}</div>
                                <span className="al-user-name">{user.name}</span>
                                <ChevronDown size={13} className={`al-chevron${userMenuOpen ? ' open' : ''}`} />
                            </button>

                            {userMenuOpen && (
                                <div className="al-dropdown-menu">
                                    <div className="al-dropdown-header">
                                        <div className="al-dropdown-name">{user.name}</div>
                                        <div className="al-dropdown-email">{user.email}</div>
                                    </div>
                                    <Link href={route('profile.edit')} className="al-dropdown-item">
                                        <User size={14} /> Profil Saya
                                    </Link>
                                    <div className="al-dropdown-divider" />
                                    <Link href={route('logout')} method="post" as="button" className="al-dropdown-item danger">
                                        <LogOut size={14} /> Keluar
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        className="al-mobile-toggle"
                        onClick={() => setMobileOpen((p) => !p)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>

                {/* Mobile menu */}
                <div className={`al-mobile-menu${mobileOpen ? ' open' : ''}`}>
                    <div className="al-mobile-links">
                        {navItems.map(({ label, href, icon: Icon }) => (
                            <Link
                                key={href}
                                href={route(href)}
                                className={`al-mobile-link${isActive(href.replace('.index', '')) ? ' active' : ''}`}
                                onClick={() => setMobileOpen(false)}
                            >
                                <Icon size={16} strokeWidth={1.7} />
                                {label}
                            </Link>
                        ))}
                    </div>
                    <div className="al-mobile-user">
                        <div className="al-mobile-user-info">
                            <div className="al-mobile-avatar">{initials}</div>
                            <div>
                                <div className="al-mobile-name">{user.name}</div>
                                <div className="al-mobile-email">{user.email}</div>
                            </div>
                        </div>
                        <div className="al-mobile-actions">
                            <Link href={route('profile.edit')} className="al-mobile-action-btn">
                                <User size={13} /> Profil
                            </Link>
                            <Link href={route('logout')} method="post" as="button" className="al-mobile-action-btn logout">
                                <LogOut size={13} /> Keluar
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ── Page header ── */}
            {header && (
                <header className="al-page-header">
                    <div className="al-page-header-inner">
                        {header}
                    </div>
                </header>
            )}

            {/* ── Main ── */}
            <main className="al-main">
                {children}
            </main>
        </div>
    );
}