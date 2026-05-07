import { useState, useEffect, useRef } from "react";

// ─── Utility ────────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// ─── useInView hook ──────────────────────────────────────────────────────────
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { threshold: 0.15, ...options });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

// ─── Counter ─────────────────────────────────────────────────────────────────
function Counter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Fonts & Global styles injection ─────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');

  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', sans-serif; }

  .font-display { font-family: 'Cormorant Garamond', serif; }
  .font-arabic { font-family: 'Amiri', serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes floatY {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-14px); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(0.9); opacity: 1; }
    100% { transform: scale(1.4); opacity: 0; }
  }

  .animate-fadeUp   { animation: fadeUp 0.8s cubic-bezier(.22,.68,0,1.2) both; }
  .animate-fadeIn   { animation: fadeIn 0.9s ease both; }
  .animate-float    { animation: floatY 5s ease-in-out infinite; }
  .animate-spin-slow { animation: spin-slow 20s linear infinite; }
  .animate-pulse-ring { animation: pulse-ring 1.8s ease-out infinite; }

  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
  .delay-400 { animation-delay: 0.4s; }
  .delay-500 { animation-delay: 0.5s; }
  .delay-600 { animation-delay: 0.6s; }
  .delay-700 { animation-delay: 0.7s; }

  .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(.22,.68,0,1.2); }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  .gold-shimmer {
    background: linear-gradient(90deg, #d4af37 0%, #f7e48a 30%, #d4af37 60%, #b8920a 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }

  .glass { backdrop-filter: blur(16px) saturate(160%); -webkit-backdrop-filter: blur(16px) saturate(160%); }

  .card-hover { transition: transform 0.4s cubic-bezier(.22,.68,0,1.2), box-shadow 0.4s ease; }
  .card-hover:hover { transform: translateY(-6px) scale(1.01); box-shadow: 0 24px 60px rgba(0,0,0,0.15); }

  .img-zoom img { transition: transform 0.7s cubic-bezier(.22,.68,0,1.2); }
  .img-zoom:hover img { transform: scale(1.08); }

  .btn-gold {
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #d4af37 0%, #f7e48a 50%, #b8920a 100%);
    color: #1a3a2a;
    font-weight: 700;
    transition: box-shadow 0.3s ease, transform 0.2s ease;
  }
  .btn-gold::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #f7e48a 0%, #d4af37 100%);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .btn-gold:hover { box-shadow: 0 12px 40px rgba(212,175,55,0.45); transform: translateY(-2px); }
  .btn-gold:hover::after { opacity: 1; }
  .btn-gold > * { position: relative; z-index: 1; }

  .ornament-border {
    border-image: repeating-linear-gradient(90deg, #d4af37 0px, #d4af37 6px, transparent 6px, transparent 12px) 1;
  }

  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

  .geometric-bg {
    background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23d4af37' stroke-opacity='0.08' stroke-width='0.5'%3E%3Cpath d='M40 0 L80 20 L80 60 L40 80 L0 60 L0 20 Z'/%3E%3Cpath d='M40 15 L65 27.5 L65 52.5 L40 65 L15 52.5 L15 27.5 Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  .star-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 2 L22 14 L34 8 L26 18 L38 20 L26 22 L34 32 L22 26 L20 38 L18 26 L6 32 L14 22 L2 20 L14 18 L6 8 L18 14 Z' fill='%23d4af37' fill-opacity='0.06'/%3E%3C/svg%3E");
  }

  .section-enter { opacity: 0; transform: translateY(40px); }
  .section-enter.in-view { animation: fadeUp 0.9s cubic-bezier(.22,.68,0,1.2) forwards; }
`;

// ─── Inject styles ────────────────────────────────────────────────────────────
function StyleInjector() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

// ─── Reveal wrapper ───────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.75s cubic-bezier(.22,.68,0,1.2) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Islamic Ornament SVG ─────────────────────────────────────────────────────
function IslamicOrn({ size = 120, opacity = 0.12, color = "#d4af37", spin = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={spin ? "animate-spin-slow" : ""} style={{ opacity }}>
      <circle cx="60" cy="60" r="54" stroke={color} strokeWidth="1" />
      <circle cx="60" cy="60" r="40" stroke={color} strokeWidth="0.8" />
      <circle cx="60" cy="60" r="26" stroke={color} strokeWidth="0.6" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const r = Math.PI * a / 180;
        const x1 = 60 + 28 * Math.cos(r), y1 = 60 + 28 * Math.sin(r);
        const x2 = 60 + 52 * Math.cos(r), y2 = 60 + 52 * Math.sin(r);
        return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="0.6" />;
      })}
      <polygon points="60,8 68,52 112,60 68,68 60,112 52,68 8,60 52,52" stroke={color} strokeWidth="0.8" fill="none" />
    </svg>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Beranda", href: "#beranda" },
    { label: "Profil", href: "#tentang" },
    { label: "Program", href: "#program" },
    { label: "Fasilitas", href: "#fasilitas" },
    { label: "Prestasi", href: "#prestasi" },
    { label: "PPDB", href: "#ppdb" },
    { label: "Kontak", href: "#kontak" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass bg-white/92 shadow-[0_4px_32px_rgba(0,60,30,0.12)] border-b border-emerald-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 shrink-0">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-900 shadow-lg overflow-hidden">
              <img
                src="https://yt3.googleusercontent.com/ytc/AIdro_l8GLL-fpAqhHuLkiC22YBb-1qJWN65NoPLEWh-MREGCQ=s900-c-k-c0x00ffffff-no-rj"
                alt="MTs"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <p className={`font-bold text-sm leading-tight transition-colors ${scrolled ? "text-emerald-900" : "text-white"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
              MTs Darul Ihsan
            </p>
            <p className={`text-[10px] tracking-widest uppercase transition-colors ${scrolled ? "text-amber-600" : "text-amber-300"}`}>
              Smd · Est. 2012
            </p>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`text-xs font-medium tracking-wide transition-colors hover:text-amber-500 ${scrolled ? "text-emerald-800" : "text-white/85"}`}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full transition-colors ${scrolled ? "text-emerald-700 hover:bg-emerald-50" : "text-white/80 hover:bg-white/10"}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3a9 9 0 100 18A9 9 0 0012 3zm0 2a7 7 0 110 14A7 7 0 0112 5z" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
            )}
          </button>
          <a
            href="/pendaftaran"
            className="btn-gold px-5 py-2.5 rounded-full text-xs flex items-center gap-1.5"
          >
            <span>✦</span>
            <span>Daftar Sekarang</span>
          </a>
        </div>

        {/* Mobile burger */}
        <button
          className={`lg:hidden p-1.5 rounded-lg transition-colors ${scrolled ? "text-emerald-900" : "text-white"}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-400 ${menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="glass bg-white/96 border-t border-emerald-100 px-5 py-5 flex flex-col gap-2">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-emerald-800 font-medium text-sm py-2 px-3 rounded-xl hover:bg-emerald-50 hover:text-amber-600 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="/pendaftaran"
            className="btn-gold mt-2 text-center py-3 rounded-xl text-sm"
            onClick={() => setMenuOpen(false)}
          >
            ✦ Daftar Sekarang
          </a>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <section id="beranda" className="relative min-h-screen flex items-center overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0">
        <img
          src="https://mtsdarulihsansmd.sch.id/theme/images/slider-3.jpg"
          alt="Gedung MTs Darul Ihsan"
          className="w-full h-full object-cover scale-105 transition-transform duration-[15s] ease-out"
          style={{ transform: loaded ? "scale(1)" : "scale(1.05)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/95 via-emerald-900/85 to-emerald-800/70" />
        <div className="absolute inset-0 geometric-bg" />
      </div>

      {/* Floating ornaments */}
      <div className="absolute top-20 right-10 hidden md:block animate-float" style={{ animationDelay: "0s" }}>
        <IslamicOrn size={160} opacity={0.12} spin />
      </div>
      <div className="absolute bottom-20 right-1/4 hidden lg:block animate-float" style={{ animationDelay: "2s" }}>
        <IslamicOrn size={80} opacity={0.08} />
      </div>
      <div className="absolute top-1/2 left-8 hidden lg:block animate-float" style={{ animationDelay: "1s" }}>
        <IslamicOrn size={60} opacity={0.07} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-28 sm:py-36 w-full grid lg:grid-cols-2 gap-12 items-center">
        <div>
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/30 bg-amber-400/10 mb-7"
            style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(16px)", transition: "all 0.6s ease 0.1s" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
            </span>
            <span className="text-amber-300 text-xs font-semibold tracking-widest uppercase">PPDB 2025/2026 · Kuota Terbatas</span>
          </div>

          {/* Headline */}
          <div
            style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(24px)", transition: "all 0.8s ease 0.2s" }}
          >
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.0] mb-2">
              Mencetak
            </h1>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.0] mb-2">
              <span className="gold-shimmer">Generasi</span>
            </h1>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.0] mb-6">
              Qur'ani
            </h1>
          </div>

          {/* Arabic verse */}
          <div
            className="mb-5 border-l-2 border-amber-500/50 pl-4"
            style={{ opacity: loaded ? 1 : 0, transition: "all 0.8s ease 0.35s" }}
          >
            <p className="font-arabic text-amber-300 text-xl sm:text-2xl leading-relaxed text-right mb-1">
              يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ
            </p>
            <p className="text-emerald-300/70 text-xs italic">
              "Allah akan meninggikan orang-orang yang beriman dan berilmu beberapa derajat." (QS. Al-Mujadilah: 11)
            </p>
          </div>

          <p
            className="text-emerald-100/75 text-base sm:text-lg leading-relaxed max-w-lg mb-8"
            style={{ opacity: loaded ? 1 : 0, transition: "all 0.8s ease 0.45s" }}
          >
            Berakhlak mulia, berprestasi akademik, dan siap menghadapi tantangan zaman dengan pondasi iman yang kokoh.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap gap-3"
            style={{ opacity: loaded ? 1 : 0, transition: "all 0.8s ease 0.55s" }}
          >
            <a href="#ppdb" className="btn-gold px-7 py-3.5 rounded-full text-sm flex items-center gap-2">
              <span>Pendaftaran PPDB 2025/2026</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a href="#tentang" className="px-7 py-3.5 rounded-full border border-white/25 text-white text-sm font-medium hover:bg-white/10 transition-all duration-300">
              Lihat Profil
            </a>
          </div>

          {/* Stats */}
          <div
            className="flex gap-8 sm:gap-12 mt-12 pt-8 border-t border-white/10"
            style={{ opacity: loaded ? 1 : 0, transition: "all 0.8s ease 0.65s" }}
          >
            {[
              { num: "500+", label: "Santri Aktif" },
              { num: "25+", label: "Tenaga Pengajar" },
              { num: "12+", label: "Tahun Berdiri" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl font-bold text-amber-400">{s.num}</p>
                <p className="text-emerald-300/60 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — mosaic */}
        <div
          className="hidden lg:grid grid-cols-2 gap-3"
          style={{ opacity: loaded ? 1 : 0, transition: "all 1s ease 0.4s" }}
        >
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl overflow-hidden h-56 img-zoom shadow-2xl shadow-black/40">
              <img src="https://mtsdarulihsansmd.sch.id/assets/images/8195030a143741e8bdc612acd98bbd9d.jpeg" alt="Kegiatan belajar" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden h-44 img-zoom shadow-2xl shadow-black/40">
              <img src="https://images.unsplash.com/photo-1599687351724-dfa3c4ff81b1?w=600&q=80" alt="Tahfidz" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-8">
            <div className="rounded-2xl overflow-hidden h-44 img-zoom shadow-2xl shadow-black/40">
              <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80" alt="Akademik" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden h-56 img-zoom shadow-2xl shadow-black/40">
              <img src="https://mtsdarulihsansmd.sch.id/assets/images/9cbea35a84a95188cd3b27e51422fe17.jpeg" alt="Lingkungan" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
        <p className="text-white text-[10px] tracking-widest uppercase">Scroll</p>
        <div className="w-5 h-9 rounded-full border border-white/40 flex items-start justify-center pt-2">
          <div className="w-0.5 h-3 rounded-full bg-white/60 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

// ─── Sambutan ────────────────────────────────────────────────────────────────
function Sambutan() {
  const [ref, inView] = useInView();
  return (
    <section className="py-16 sm:py-24 bg-[#0d2b1e] overflow-hidden relative">
      <div className="absolute inset-0 star-pattern opacity-40" />
      <div className="absolute top-8 right-8 hidden md:block">
        <IslamicOrn size={200} opacity={0.06} color="#d4af37" spin />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">
            Sambutan
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
            Kepala <span className="gold-shimmer">Madrasah</span>
          </h2>
        </Reveal>

        <div ref={ref} className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Photo card */}
          <Reveal delay={100}>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden aspect-[3/4] max-w-sm mx-auto shadow-2xl shadow-black/50">
                <img
                  src="http://mtsdarulihsansmd.sch.id/theme/images/welcome.png"
                  alt="Kepala Madrasah"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass bg-black/30 rounded-2xl p-4 border border-white/10">
                  <p className="font-display text-white font-bold text-lg">Fathurrahman, S.Ag</p>
                  <p className="text-amber-400 text-xs mt-1">Kepala MTs Darul Ihsan</p>
                </div>
              </div>
              {/* Gold accent */}
              <div className="absolute -top-4 -right-4 w-20 h-20">
                <IslamicOrn size={80} opacity={0.4} color="#d4af37" />
              </div>
            </div>
          </Reveal>

          {/* Quote */}
          <Reveal delay={200}>
            <div className="text-white">
              <div className="font-display text-8xl text-amber-400/20 leading-none select-none -mb-6">"</div>
              <p className="font-arabic text-amber-300 text-xl leading-loose mb-4 text-right">
                اطلبوا العلم من المهد إلى اللحد
              </p>
              <p className="text-emerald-300/60 text-xs italic mb-6 text-right">"Tuntutlah ilmu dari buaian hingga liang lahat"</p>
              <p className="text-emerald-100/70 leading-relaxed text-base mb-4">
                Assalamu'alaikum warahmatullahi wabarakatuh. MTs Darul Ihsan hadir sebagai madrasah yang tidak hanya mendidik akal, tetapi juga membentuk hati. Kami berkomitmen melahirkan generasi yang unggul dalam ilmu, kokoh dalam iman, dan mulia dalam akhlak.
              </p>
              <p className="text-emerald-100/70 leading-relaxed text-base mb-8">
                Setiap program kami dirancang dengan cermat untuk membekali santri menghadapi tantangan masa depan, berlandaskan nilai-nilai Al-Qur'an dan Sunnah Rasulullah ﷺ.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-0.5 bg-amber-400/40" />
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>
                <div className="w-12 h-0.5 bg-amber-400/40" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Visi Misi ───────────────────────────────────────────────────────────────
function VisiMisi() {
  const cards = [
    { icon: "📖", title: "Tahfidz Qur'an", desc: "Program hafalan terstruktur dengan bimbingan hafidz bersanad, target 3 juz dalam 3 tahun.", color: "from-emerald-500 to-teal-600" },
    { icon: "🌐", title: "Kurikulum Terpadu", desc: "Memadukan kurikulum Kemendikbud dengan muatan keislaman mendalam dan bahasa Arab.", color: "from-blue-500 to-indigo-600" },
    { icon: "🏆", title: "Prestasi Akademik", desc: "Lulusan kami diterima di SMA/MA unggulan dan meraih beasiswa nasional.", color: "from-amber-500 to-orange-600" },
    { icon: "💻", title: "Fasilitas Modern", desc: "Lab komputer, perpustakaan digital, masjid, dan ruang kelas ber-AC yang nyaman.", color: "from-rose-500 to-pink-600" },
    { icon: "🌙", title: "Pembinaan Akhlak", desc: "Bimbingan karakter Islami melalui kegiatan harian, mentoring, dan pembiasaan sunnah.", color: "from-violet-500 to-purple-600" },
    { icon: "⚽", title: "Pengembangan Bakat", desc: "Lebih dari 12 ekstrakurikuler: olahraga, seni, robotics, dan English/Arabic club.", color: "from-cyan-500 to-sky-600" },
  ];

  return (
    <section id="tentang" className="py-16 sm:py-24 lg:py-28 bg-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-amber-50 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-emerald-50 translate-y-1/2 -translate-x-1/4" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Image */}
          <Reveal>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl shadow-emerald-900/15 img-zoom">
                <img src="https://i.ytimg.com/vi/fZ6Ik_W1LWs/sddefault.jpg" alt="Gedung Sekolah" className="w-full h-full object-cover" />
              </div>
              {/* Accreditation badge */}
              <div className="absolute -bottom-5 -right-3 sm:-right-5 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl p-4 shadow-2xl text-white">
                <p className="font-display text-3xl font-bold text-amber-400">A+</p>
                <p className="text-emerald-200 text-xs mt-0.5">Akreditasi BAN-S/M</p>
              </div>
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-amber-100/80 -z-10" />
            </div>
          </Reveal>

          {/* Text */}
          <Reveal delay={150}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-widest mb-4 border border-emerald-200">
              Tentang Kami
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-emerald-900 leading-tight mb-5">
              Lebih dari Sekadar{" "}
              <em className="not-italic text-amber-500">Sekolah</em>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              MTs Darul Ihsan adalah madrasah tsanawiyah unggulan yang berdiri sejak 2012 di bawah naungan Yayasan Darul Ihsan. Kami menghadirkan pendidikan Islam terpadu yang memadukan kurikulum nasional dengan nilai-nilai keislaman yang kuat.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Dengan lingkungan belajar yang kondusif, tenaga pendidik berpengalaman, dan fasilitas modern, setiap siswa dibimbing meraih prestasi akademik sekaligus membentuk karakter Islami yang kokoh.
            </p>
            {/* Visi */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 mb-3">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">Visi</p>
              <p className="text-emerald-900 font-medium text-sm">Terwujudnya lulusan yang beriman, bertaqwa, berakhlak mulia, berprestasi, dan berwawasan global.</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">Misi</p>
              <p className="text-amber-900 font-medium text-sm">Menyelenggarakan pendidikan Islami terpadu yang berkualitas, inovatif, dan berkarakter.</p>
            </div>
          </Reveal>
        </div>

        {/* Keunggulan grid */}
        <Reveal>
          <h3 className="font-display text-3xl font-bold text-emerald-900 text-center mb-8">Keunggulan <span className="text-amber-500">Kami</span></h3>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <div className="group p-5 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-xl hover:shadow-gray-100/80 transition-all duration-400 card-hover">
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} text-xl mb-3 shadow-md`}>
                  {c.icon}
                </div>
                <h4 className="font-bold text-emerald-900 text-sm mb-1.5">{c.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Program ──────────────────────────────────────────────────────────────────
function Program() {
  const [active, setActive] = useState(0);
  const programs = [
    {
      icon: "📖", title: "Tahfidz Al-Qur'an",
      color: "from-emerald-500 to-teal-600",
      desc: "Program unggulan menghafal Al-Qur'an dengan metode talaqqi dari hafidz/hafidzah bersanad. Target minimal 3 juz selama 3 tahun dengan setoran harian dan muroja'ah terstruktur.",
      img: "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&q=80",
      features: ["Metode Talaqqi & Musyafahah", "Muroja'ah Harian Terstruktur", "Sanad Tersertifikasi", "Munaqasyah Akhir Tahun"],
    },
    {
      icon: "🎓", title: "Akademik Unggulan",
      color: "from-blue-500 to-indigo-600",
      desc: "Pembelajaran sains, matematika, dan bahasa dengan pendekatan STEM terpadu. Siswa dipersiapkan untuk Ujian Nasional, olimpiade sains, dan kompetisi akademik tingkat nasional.",
      img: "https://mtsdarulihsansmd.sch.id/assets/images/84a04be7bb5faa4b12b175c0899b08e5.jpeg",
      features: ["STEM Terpadu & Kontekstual", "Bahasa Arab & Inggris Intensif", "Olimpiade Sains Nasional", "Kelas Akselerasi"],
    },
    {
      icon: "🤖", title: "Coding & Robotics",
      color: "from-violet-500 to-purple-600",
      desc: "Program STEM inovatif yang memperkenalkan siswa pada dunia teknologi, pemrograman, dan robotika. Melatih computational thinking sejak dini dalam bingkai nilai Islami.",
      img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
      features: ["Dasar Pemrograman Python", "Desain & Rakit Robot", "Kompetisi Robotika", "IoT untuk Pemula"],
    },
    {
      icon: "✍️", title: "Kaligrafi & Seni Islam",
      color: "from-amber-500 to-orange-600",
      desc: "Mendalami seni kaligrafi Arab sebagai ekspresi cinta kepada Al-Qur'an. Siswa diikutsertakan dalam perlombaan tingkat daerah dan nasional.",
      img: "https://www.auramedia.co/wp-content/uploads/2023/10/IMG-20231018-WA0095.jpg",
      features: ["Naskhi, Tsuluts & Diwani", "Dekorasi Mushaf & Hiasan", "Pameran Karya Siswa", "Lomba Kaligrafi Nasional"],
    },
    {
      icon: "⚽", title: "Olahraga & Kepramukaan",
      color: "from-rose-500 to-pink-600",
      desc: "Pembinaan karakter melalui kepramukaan, olahraga, dan seni bela diri yang dilandasi semangat sportivitas dan nilai-nilai Islami.",
      img: "https://mtsdarulihsansmd.sch.id/assets/images/9cbea35a84a95188cd3b27e51422fe17.jpeg",
      features: ["Pramuka Aktif & Berprestasi", "Futsal, Voli & Badminton", "Pencak Silat", "Perkemahan Nasional"],
    },
    {
      icon: "🎤", title: "English & Arabic Club",
      color: "from-cyan-500 to-sky-600",
      desc: "Lingkungan bilingual yang mempersiapkan siswa berkomunikasi internasional. Debat, pidato, dan workshop bahasa difasilitasi penutur asli.",
      img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
      features: ["Conversation Club Harian", "Public Speaking & Debat", "Pidato Bahasa Arab", "Persiapan TOEFL/IELTS"],
    },
  ];

  return (
    <section id="program" className="py-16 sm:py-24 lg:py-28 bg-gradient-to-br from-gray-50 to-emerald-50/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-widest mb-3 border border-emerald-200">
            Program Kami
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-emerald-900 mb-3">
            Program <span className="text-amber-500">Unggulan</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            Dirancang mengoptimalkan potensi akademik, spiritual, dan karakter setiap santri.
          </p>
        </Reveal>

        {/* Tab pills */}
        <Reveal>
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide justify-start sm:justify-center">
            {programs.map((p, i) => (
              <button
                key={p.title}
                onClick={() => setActive(i)}
                className={`flex-none flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-300 whitespace-nowrap ${
                  active === i
                    ? "bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                    : "bg-white text-emerald-800 border border-emerald-100 hover:border-emerald-300"
                }`}
              >
                <span>{p.icon}</span> {p.title}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Active program detail */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <Reveal>
            <div className="rounded-3xl overflow-hidden aspect-video img-zoom shadow-2xl shadow-gray-300/50">
              <img src={programs[active].img} alt={programs[active].title} className="w-full h-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${programs[active].color} text-2xl mb-4 shadow-lg`}>
              {programs[active].icon}
            </div>
            <h3 className="font-display text-3xl sm:text-4xl font-bold text-emerald-900 mb-4">{programs[active].title}</h3>
            <p className="text-gray-600 leading-relaxed mb-6">{programs[active].desc}</p>
            <ul className="space-y-2.5">
              {programs[active].features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
                  <div className={`w-2 h-2 shrink-0 rounded-full bg-gradient-to-br ${programs[active].color}`} />
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* All programs mini grid */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {programs.map((p, i) => (
            <Reveal key={p.title} delay={i * 60}>
              <button
                onClick={() => setActive(i)}
                className={`group w-full p-4 rounded-2xl text-center transition-all duration-300 card-hover ${
                  active === i ? "bg-emerald-700 text-white shadow-lg" : "bg-white border border-gray-100 hover:border-emerald-200"
                }`}
              >
                <div className="text-2xl mb-2">{p.icon}</div>
                <p className={`text-xs font-semibold leading-tight ${active === i ? "text-white" : "text-emerald-900"}`}>{p.title}</p>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Fasilitas ────────────────────────────────────────────────────────────────
function Fasilitas() {
  const [lightbox, setLightbox] = useState(null);
  const items = [
    { img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80", label: "Ruang Kelas Ber-AC", icon: "🏫" },
    { img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80", label: "Laboratorium Komputer", icon: "💻" },
    { img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80", label: "Perpustakaan Digital", icon: "📚" },
    { img: "https://images.unsplash.com/photo-1591429939960-b7d5add10b5c?w=800&q=80", label: "Masjid Sekolah", icon: "🕌" },
    { img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80", label: "Lapangan Olahraga", icon: "⚽" },
    { img: "https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=800&q=80", label: "Laboratorium Sains", icon: "🔬" },
  ];

  return (
    <section id="fasilitas" className="py-16 sm:py-24 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold uppercase tracking-widest mb-3 border border-amber-200">
            Fasilitas
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-emerald-900 mb-3">
            Fasilitas <span className="text-amber-500">Lengkap</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">Lingkungan belajar yang kondusif, modern, dan Islami untuk mendukung tumbuh kembang optimal setiap santri.</p>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {items.map((item, i) => (
            <Reveal key={item.label} delay={i * 70}>
              <div
                className="group relative rounded-2xl overflow-hidden cursor-pointer img-zoom shadow-md hover:shadow-2xl hover:shadow-emerald-200/40 transition-all duration-400"
                style={{ aspectRatio: i % 3 === 0 ? "4/3" : "1/1" }}
                onClick={() => setLightbox(item)}
              >
                <img src={item.img} alt={item.label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <p className="text-white font-bold text-xs sm:text-sm">{item.label}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.img} alt={lightbox.label} className="w-full object-cover" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <p className="text-white font-bold text-lg">{lightbox.icon} {lightbox.label}</p>
            </div>
            <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors" onClick={() => setLightbox(null)}>✕</button>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── Prestasi ────────────────────────────────────────────────────────────────
function Prestasi() {
  const stats = [
    { label: "Santri Aktif", end: 500, suffix: "+" },
    { label: "Guru Berpengalaman", end: 28, suffix: "+" },
    { label: "Tahun Berdiri", end: 12, suffix: "+" },
    { label: "Prestasi Diraih", end: 150, suffix: "+" },
  ];

  const awards = [
    { year: "2024", title: "Juara 1 Olimpiade Matematika", level: "Tingkat Provinsi", icon: "🥇" },
    { year: "2024", title: "Juara 2 Kaligrafi Al-Qur'an", level: "Tingkat Nasional", icon: "✍️" },
    { year: "2023", title: "Juara 1 Musabaqah Tilawatil Qur'an", level: "Tingkat Kabupaten", icon: "🏆" },
    { year: "2023", title: "Sekolah Adiwiyata", level: "Penghargaan Nasional", icon: "🌿" },
    { year: "2022", title: "Juara 1 Robotics Competition", level: "Tingkat Provinsi", icon: "🤖" },
    { year: "2022", title: "Juara 3 Debat Bahasa Inggris", level: "Tingkat Nasional", icon: "🎤" },
  ];

  return (
    <section id="prestasi" className="py-16 sm:py-24 lg:py-28 bg-gradient-to-br from-emerald-950 to-[#0a1f15] overflow-hidden relative">
      <div className="absolute inset-0 geometric-bg opacity-30" />
      <div className="absolute top-0 right-0 w-96 h-96 opacity-5">
        <IslamicOrn size={384} opacity={1} color="#d4af37" spin />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">
            Prestasi
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">
            Capaian <span className="gold-shimmer">Gemilang</span>
          </h2>
          <p className="text-emerald-300/60 max-w-xl mx-auto text-sm">Bukti nyata dedikasi dan kerja keras seluruh civitas MTs Darul Ihsan.</p>
        </Reveal>

        {/* Counter row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-14">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100}>
              <div className="text-center p-6 rounded-3xl border border-white/8 glass bg-white/5">
                <p className="font-display text-4xl sm:text-5xl font-bold text-amber-400 mb-1">
                  <Counter end={s.end} suffix={s.suffix} />
                </p>
                <p className="text-emerald-300/60 text-xs">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Awards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {awards.map((a, i) => (
            <Reveal key={a.title} delay={i * 80}>
              <div className="group flex items-start gap-4 p-5 rounded-2xl border border-white/8 bg-white/4 hover:bg-white/8 hover:border-amber-400/30 transition-all duration-300 card-hover">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-400/20 flex items-center justify-center text-xl">
                  {a.icon}
                </div>
                <div>
                  <p className="text-amber-400 text-xs font-semibold mb-1">{a.year} · {a.level}</p>
                  <p className="text-white font-semibold text-sm leading-snug">{a.title}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Berita ───────────────────────────────────────────────────────────────────
function Berita() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("api/getBerita");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const items = Array.isArray(data) ? data : data?.data ?? [];
        const filtered = items
          .filter((n) => n?.status === "published")
          .sort((a, b) => {
            if (a.is_featured && !b.is_featured) return -1;
            if (!a.is_featured && b.is_featured) return 1;
            return new Date(b.published_at) - new Date(a.published_at);
          })
          .slice(0, 3);
        setNews(filtered);
      } catch (err) {
        setError("Gagal memuat berita.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <section id="berita" className="py-16 sm:py-24 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-widest mb-3 border border-emerald-200">
              Informasi Terkini
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-emerald-900">
              Berita <span className="text-amber-500">Terbaru</span>
            </h2>
          </div>
          <a href="/berita" className="text-emerald-700 font-semibold text-sm flex items-center gap-2 hover:text-amber-500 transition-colors group self-start">
            Lihat Semua
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </Reveal>

        {loading && (
          <div className="grid sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl overflow-hidden bg-gray-100 animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && news.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">📰</p>
            <p className="text-sm">Belum ada berita tersedia.</p>
          </div>
        )}

        {!loading && !error && news.length > 0 && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {news.map((item, idx) => (
              <Reveal key={item?.slug ?? idx} delay={idx * 100}>
                <a
                  href={`/berita/${item?.slug ?? ''}`}
                  className="group block bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-200/80 hover:shadow-2xl hover:shadow-emerald-200/50 card-hover border border-gray-100"
                >
                  <div className="relative h-48 overflow-hidden bg-emerald-100 img-zoom">
                    {item?.thumbnail
                      ? <img src={'/storage/' + item.thumbnail} alt={item?.title ?? "Berita"} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-5xl">📰</div>}
                    {item?.is_featured && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-400 text-emerald-900 text-xs font-bold">⭐ Unggulan</div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-emerald-600 text-xs font-medium mb-2">{formatDate(item?.published_at)}</p>
                    <h3 className="font-bold text-emerald-900 text-sm sm:text-base leading-snug mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {item?.title ?? "Judul tidak tersedia"}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                      {item?.excerpt ?? "Tidak ada ringkasan."}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                      Baca Selengkapnya
                      <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Gallery Banner ───────────────────────────────────────────────────────────
function GalleryBanner() {
  const images = [
    { src: "https://mtsdarulihsansmd.sch.id/assets/images/8195030a143741e8bdc612acd98bbd9d.jpeg", label: "Kegiatan Belajar" },
    { src: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&q=80", label: "Upacara Bendera" },
    { src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80", label: "Prestasi Siswa" },
    { src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80", label: "Ekstrakurikuler" },
    { src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80", label: "Wisuda Santri" },
    { src: "https://www.auramedia.co/wp-content/uploads/2023/10/IMG-20231018-WA0095.jpg", label: "Kaligrafi" },
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#0a1f15] overflow-hidden">
      <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
          Galeri <span className="gold-shimmer">Kegiatan</span>
        </h2>
        <p className="text-emerald-400/60 mt-2 text-sm">Momen berharga di MTs Darul Ihsan</p>
      </Reveal>

      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 px-4 sm:px-8 snap-x snap-mandatory scrollbar-hide">
        {images.map((img, i) => (
          <div key={img.label}
            className="relative flex-none w-56 sm:w-72 h-72 sm:h-96 rounded-3xl overflow-hidden snap-start group cursor-pointer img-zoom"
          >
            <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
              <p className="text-white font-bold text-sm">{img.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Testimoni ────────────────────────────────────────────────────────────────
function Testimoni() {
  const [active, setActive] = useState(0);
  const testimonials = [
    {
      name: "Hj. Siti Rahmawati", role: "Orang Tua Siswa Kelas VIII",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
      text: "Alhamdulillah, anak saya sangat berkembang sejak masuk MTs Darul Ihsan. Tidak hanya nilai akademiknya yang meningkat, akhlaknya pun semakin baik dan tanggung jawabnya bertambah. Guru-gurunya sangat perhatian.",
      stars: 5,
    },
    {
      name: "Ahmad Fauzan", role: "Alumni 2022 · Mahasiswa UIN Malang",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&q=80",
      text: "Tiga tahun di MTs Darul Ihsan membentuk saya menjadi pribadi yang lebih disiplin dan cinta Al-Qur'an. Program tahfidznya luar biasa. Sampai di UIN, saya terasa lebih siap dari teman-teman yang lain.",
      stars: 5,
    },
    {
      name: "Bapak Drs. Mahmud Syarif", role: "Kepala SMA Nur Hidayah",
      avatar: "https://images.unsplash.com/photo-1607990283143-e81e7a2c9349?w=200&q=80",
      text: "Lulusan MTs Darul Ihsan selalu tampil dengan percaya diri, berakhlak mulia, dan siap secara akademik. Mereka menjadi siswa teladan di sekolah kami. Rekomendasi terbaik untuk orang tua yang peduli masa depan anaknya.",
      stars: 5,
    },
    {
      name: "Nur Halimah", role: "Orang Tua Santri Baru 2024",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
      text: "Proses pendaftaran PPDB sangat mudah dan transparan. Staf sangat informatif dan ramah. Setelah melihat fasilitas dan program yang ditawarkan, kami yakin MTs Darul Ihsan adalah pilihan terbaik.",
      stars: 5,
    },
  ];

  const t = testimonials[active];

  return (
    <section id="testimoni" className="py-16 sm:py-24 lg:py-28 bg-gradient-to-br from-emerald-50 to-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold uppercase tracking-widest mb-3 border border-amber-200">
            Testimoni
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-emerald-900">
            Kata <span className="text-amber-500">Mereka</span>
          </h2>
        </Reveal>

        {/* Main testimonial */}
        <Reveal>
          <div className="relative bg-white rounded-3xl p-8 sm:p-12 shadow-2xl shadow-emerald-100/80 border border-emerald-50 mb-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 opacity-5">
              <IslamicOrn size={160} opacity={1} color="#059669" />
            </div>
            <div className="font-display text-8xl text-emerald-100 leading-none select-none mb-4">"</div>
            <p className="text-gray-700 text-lg sm:text-xl leading-relaxed font-light max-w-3xl mb-8 -mt-8">
              {t.text}
            </p>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-100" />
                <div>
                  <p className="font-bold text-emerald-900">{t.name}</p>
                  <p className="text-gray-400 text-sm">{t.role}</p>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(t.stars)].map((_, i) => <span key={i} className="text-amber-400 text-lg">★</span>)}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Switcher */}
        <div className="flex gap-3 justify-center flex-wrap">
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setActive(i)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-full transition-all duration-300 ${
                active === i
                  ? "bg-emerald-700 text-white shadow-lg"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-emerald-200"
              }`}
            >
              <img src={t.avatar} alt={t.name} className="w-6 h-6 rounded-full object-cover" />
              <span className="text-xs font-medium hidden sm:block">{t.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PPDB Section ─────────────────────────────────────────────────────────────
function PPDB() {
  const waves = [
    { wave: "Gelombang I", period: "1 Jan – 28 Feb 2025", status: "Ditutup", color: "bg-gray-100 text-gray-500" },
    { wave: "Gelombang II", period: "1 Mar – 30 Apr 2025", status: "Berlangsung", color: "bg-emerald-100 text-emerald-700" },
    { wave: "Gelombang III", period: "1 Mei – 30 Jun 2025", status: "Segera Dibuka", color: "bg-amber-100 text-amber-700" },
  ];

  const requirements = ["Fotokopi Akta Kelahiran", "Fotokopi KK & KTP Orang Tua", "Pas Foto 3x4 (4 lembar)", "Rapor SD/MI Kelas 4-6", "Surat Keterangan Lulus / Ijazah", "Mengisi formulir online"];

  return (
    <section id="ppdb" className="py-16 sm:py-24 lg:py-28 bg-white overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-widest mb-3 border border-emerald-200">
            Penerimaan Peserta Didik Baru
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-emerald-900 mb-3">
            PPDB <span className="text-amber-500">2025/2026</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">Bergabunglah bersama ratusan santri berprestasi. Kuota terbatas, segera daftarkan putra-putri Anda!</p>
        </Reveal>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Gelombang */}
          <Reveal>
            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
              <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                <span className="text-lg">📅</span> Jadwal Pendaftaran
              </h3>
              <div className="space-y-3">
                {waves.map((w) => (
                  <div key={w.wave} className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-gray-100">
                    <div>
                      <p className="font-bold text-emerald-900 text-sm">{w.wave}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{w.period}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${w.color}`}>{w.status}</span>
                  </div>
                ))}
              </div>
              {/* Biaya highlight */}
              <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
                <p className="text-amber-700 text-xs font-semibold mb-1">💰 Biaya Pendaftaran</p>
                <p className="font-display text-2xl font-bold text-amber-600">Rp 150.000</p>
                <p className="text-amber-600/70 text-xs mt-0.5">Beasiswa penuh tersedia untuk siswa berprestasi</p>
              </div>
            </div>
          </Reveal>

          {/* Persyaratan */}
          <Reveal delay={100}>
            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
              <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                <span className="text-lg">📋</span> Persyaratan
              </h3>
              <ul className="space-y-2.5">
                {requirements.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-sm text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* CTA & WhatsApp */}
          <Reveal delay={200}>
            <div className="flex flex-col gap-4">
              <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-3xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                  <IslamicOrn size={96} opacity={1} color="#d4af37" />
                </div>
                <p className="text-emerald-200 text-xs uppercase tracking-widest mb-2">Daftar Online</p>
                <h4 className="font-display text-2xl font-bold mb-3">Daftarkan Sekarang!</h4>
                <p className="text-emerald-200/80 text-sm mb-5">Isi formulir pendaftaran online dan kami akan menghubungi Anda dalam 1x24 jam.</p>
                <a href="/pendaftaran" className="btn-gold w-full block text-center py-3.5 rounded-2xl text-sm">
                  Daftar Online →
                </a>
              </div>
              {/* WhatsApp card */}
              <div className="bg-[#dcfce7] rounded-3xl p-5 border border-green-200 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-green-900 text-sm">Hubungi via WhatsApp</p>
                  <a href="https://wa.me/6281234567890" className="text-green-700 text-xs font-medium hover:underline">0812-3456-7890</a>
                </div>
              </div>
              {/* Chips */}
              <div className="flex flex-wrap gap-2">
                {["Gratis Formulir", "Tes Online", "Beasiswa Tersedia", "Kuota Terbatas"].map((c) => (
                  <span key={c} className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium">{c}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://mtsdarulihsansmd.sch.id/theme/images/slider.jpg" alt="bg" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/97 to-emerald-900/92" />
        <div className="absolute inset-0 geometric-bg opacity-30" />
      </div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block animate-float">
        <IslamicOrn size={240} opacity={0.08} color="#d4af37" spin />
      </div>

      <Reveal className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <p className="font-arabic text-amber-300/80 text-xl sm:text-2xl mb-2">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
        <span className="inline-block px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-5">
          PPDB 2025/2026 · Dibuka Sekarang
        </span>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
          Wujudkan Impian<br />
          <span className="gold-shimmer">Bersama Kami</span>
        </h2>
        <p className="text-emerald-100/70 text-base sm:text-lg mb-8 max-w-xl mx-auto">
          Jadikan putra-putri Anda generasi Muslim yang cerdas, berakhlak, dan berprestasi di MTs Darul Ihsan.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/pendaftaran" className="btn-gold px-8 py-4 rounded-2xl text-sm">
            Daftar Online Sekarang
          </a>
          <a href="https://wa.me/6281234567890" className="px-8 py-4 rounded-2xl border-2 border-white/25 text-white text-sm font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Hubungi via WhatsApp
          </a>
        </div>
      </Reveal>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer id="kontak" className="bg-[#060f09] text-white pt-16 pb-8 overflow-hidden relative">
      <div className="absolute inset-0 star-pattern opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-emerald-800">
                <img src="https://yt3.googleusercontent.com/ytc/AIdro_l8GLL-fpAqhHuLkiC22YBb-1qJWN65NoPLEWh-MREGCQ=s900-c-k-c0x00ffffff-no-rj" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-sm">MTs Darul Ihsan</p>
                <p className="text-amber-400/60 text-xs">Smd · Est. 2012</p>
              </div>
            </div>
            <p className="font-arabic text-amber-300/70 text-lg mb-1 leading-loose">العلم نور</p>
            <p className="text-emerald-300/40 text-xs italic mb-4">"Ilmu adalah cahaya"</p>
            <p className="text-emerald-300/50 text-xs leading-relaxed">
              Madrasah tsanawiyah unggulan yang memadukan ilmu pengetahuan dengan nilai-nilai keislaman.
            </p>
            {/* Socmed */}
            <div className="flex gap-3 mt-5">
              {[
                { label: "Instagram", href: "#", icon: "📸" },
                { label: "YouTube", href: "#", icon: "▶️" },
                { label: "Facebook", href: "#", icon: "👍" },
              ].map((s) => (
                <a key={s.label} href={s.href} className="w-8 h-8 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center text-sm hover:bg-white/15 hover:border-white/20 transition-all">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">Navigasi</p>
            <ul className="space-y-2.5">
              {["Beranda", "Profil Madrasah", "Program Unggulan", "Fasilitas", "Prestasi", "Berita", "PPDB 2025/2026"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-emerald-300/50 text-sm hover:text-amber-400 transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Program */}
          <div>
            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">Program</p>
            <ul className="space-y-2.5">
              {["Tahfidz Al-Qur'an", "Akademik Unggulan", "Coding & Robotics", "Kaligrafi Islam", "English & Arabic", "Ekstrakurikuler"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-emerald-300/50 text-sm hover:text-amber-400 transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">Kontak</p>
            <div className="space-y-3">
              {[
                { icon: "📍", text: "Jl. Siti Aisyah, Teluk Lerong Ilir, Kec. Samarinda Ulu, Kota Samarinda, Kalimantan Timur, 75128." },
                { icon: "📞", text: "(0541) 7778995." },
                { icon: "📧", text: "info@mtsdarulihsansmd.sch.id" },
                { icon: "🕐", text: "Senin–Sabtu: 07.00–15.00 WITA" },
              ].map((c) => (
                <div key={c.text} className="flex items-start gap-3">
                  <span className="text-sm shrink-0 mt-0.5">{c.icon}</span>
                  <p className="text-emerald-300/50 text-xs leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
            {/* Maps embed placeholder */}
            <div className="mt-4 rounded-xl overflow-hidden border border-white/10 h-28 bg-white/5 flex items-center justify-center">
              <p className="text-emerald-300/30 text-xs text-center px-4">📍 Google Maps Embed<br /><span className="text-[10px]">Tambahkan iframe Google Maps</span></p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-emerald-300/30 text-xs text-center sm:text-left">
            © 2025 MTs Darul Ihsan Samarinda. All rights reserved.
          </p>
          <p className="text-emerald-300/20 text-xs">Dirancang dengan ♥ untuk pendidikan Islami</p>
        </div>
      </div>
    </footer>
  );
}

// ─── WhatsApp Floating ────────────────────────────────────────────────────────
function WAFloat() {
  return (
    <a
      href="https://wa.me/6281234567890"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-2xl shadow-green-500/40 transition-all duration-300 hover:scale-105 group"
    >
      <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      <span className="text-sm font-semibold max-w-0 overflow-hidden group-hover:max-w-[120px] transition-all duration-500 whitespace-nowrap">
        Hubungi Kami
      </span>
    </a>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function Welcome() {
  return (
    <>
      <StyleInjector />
      <div className="min-h-screen antialiased bg-white">
        <Navbar />
        <Hero />
        <Sambutan />
        <VisiMisi />
        <Program />
        <Fasilitas />
        <Prestasi />
        <Berita />
        <GalleryBanner />
        <Testimoni />
        <PPDB />
        <CTABanner />
        <Footer />
        <WAFloat />
      </div>
    </>
  );
}