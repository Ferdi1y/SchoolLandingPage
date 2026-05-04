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

// ─── Navbar ─────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Tentang", "Program", "Berita", "Testimoni", "Kontak"];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg shadow-emerald-900/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg" style={{ fontFamily: "'Amiri', serif" }}>
                <img src="https://yt3.googleusercontent.com/ytc/AIdro_l8GLL-fpAqhHuLkiC22YBb-1qJWN65NoPLEWh-MREGCQ=s900-c-k-c0x00ffffff-no-rj" alt="MTs" />
            </span>
          </div>
          <div>
            <p className={`font-bold text-sm leading-tight transition-colors ${scrolled ? "text-emerald-900" : "text-white"}`}>
              MTs Darul Ihsan
            </p>
            <p className={`text-xs transition-colors ${scrolled ? "text-emerald-600" : "text-emerald-200"}`}>
              Sekolah Islami Modern
            </p>
          </div>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className={`text-sm font-medium transition-colors hover:text-amber-400 ${
                scrolled ? "text-emerald-800" : "text-white/90"
              }`}
            >
              {l}
            </a>
          ))}
          <a
            href="#daftar"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-900 text-sm font-bold shadow-md hover:shadow-amber-300/40 hover:scale-105 transition-all duration-300"
          >
            Daftar Sekarang
          </a>
        </div>

        {/* Mobile burger */}
        <button
          className={`md:hidden transition-colors ${scrolled ? "text-emerald-900" : "text-white"}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/97 backdrop-blur-lg border-t border-emerald-100 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-emerald-800 font-medium text-sm hover:text-amber-500 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {l}
            </a>
          ))}
          <a
            href="#daftar"
            className="text-center px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-900 text-sm font-bold"
            onClick={() => setMenuOpen(false)}
          >
            Daftar Sekarang
          </a>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0">
        <img
          src="https://mtsdarulihsansmd.sch.id/theme/images/slider-3.jpg"
          alt="School background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/90 via-emerald-900/80 to-emerald-800/70" />
        {/* Decorative geometric overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating ornament */}
      <div className="absolute top-32 right-10 w-64 h-64 opacity-10 hidden lg:block">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 10 L190 55 L190 145 L100 190 L10 145 L10 55 Z" stroke="#f59e0b" strokeWidth="2"/>
          <path d="M100 30 L170 67.5 L170 132.5 L100 170 L30 132.5 L30 67.5 Z" stroke="#f59e0b" strokeWidth="1.5"/>
          <circle cx="100" cy="100" r="40" stroke="#f59e0b" strokeWidth="1"/>
          <circle cx="100" cy="100" r="20" stroke="#f59e0b" strokeWidth="0.5"/>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/20 border border-amber-400/40 mb-8">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-300 text-xs font-semibold tracking-wider uppercase">
              Pendaftaran 2025/2026 Dibuka
            </span>
          </div>

          <h1
            className="text-5xl lg:text-7xl font-black text-white leading-[1.05] mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            MTs
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
              Darul Ihsan
            </span>
          </h1>

          <p className="text-lg text-emerald-100/80 leading-relaxed mb-4 max-w-md">
            Membentuk generasi Muslim yang cerdas, berakhlak mulia, dan siap
            menghadapi tantangan zaman.
          </p>

          <p
            className="text-amber-300/90 font-medium italic text-base mb-10"
            style={{ fontFamily: "'Amiri', serif" }}
          >
            "العلم نور" — Ilmu adalah cahaya
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#daftar"
              className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-900 font-bold text-base shadow-2xl shadow-amber-500/30 hover:shadow-amber-400/50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Daftar Sekarang
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#tentang"
              className="px-8 py-4 rounded-2xl border border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-all duration-300"
            >
              Pelajari Lebih
            </a>
          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-14">
            {[
              { num: "500+", label: "Santri Aktif" },
              { num: "25+", label: "Guru Berpengalaman" },
              { num: "12", label: "Tahun Berdiri" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-black text-amber-400">{s.num}</p>
                <p className="text-emerald-300 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — image mosaic */}
        <div className="hidden lg:grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl overflow-hidden h-56 shadow-2xl shadow-black/40">
              <img src="https://mtsdarulihsansmd.sch.id/assets/images/8195030a143741e8bdc612acd98bbd9d.jpeg" alt="Kegiatan belajar" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="rounded-3xl overflow-hidden h-40 shadow-2xl shadow-black/40">
              <img src="https://images.unsplash.com/photo-1599687351724-dfa3c4ff81b1?w=600&q=80" alt="Tahfidz" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-8">
            <div className="rounded-3xl overflow-hidden h-40 shadow-2xl shadow-black/40">
              <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80" alt="Ekstrakurikuler" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="rounded-3xl overflow-hidden h-56 shadow-2xl shadow-black/40">
              <img src="https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=600&q=80" alt="Lingkungan sekolah" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center pt-2">
          <div className="w-1 h-3 rounded-full bg-white/60" />
        </div>
      </div>
    </section>
  );
}

// ─── Tentang ─────────────────────────────────────────────────────────────────
function Tentang() {
  return (
    <section id="tentang" className="py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
        {/* Images */}
        <div className="relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/20 aspect-[4/3]">
            <img
              src="https://i.ytimg.com/vi/fZ6Ik_W1LWs/sddefault.jpg"
              alt="Gedung sekolah"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Floating card */}
          <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-5 shadow-2xl text-white hidden sm:block">
            <p className="text-4xl font-black">A+</p>
            <p className="text-emerald-200 text-xs mt-1">Akreditasi BAN-S/M</p>
          </div>
          {/* Decorative blob */}
          <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-amber-100 -z-10" />
          <div className="absolute -bottom-4 left-8 w-20 h-20 rounded-full bg-emerald-100 -z-10" />
        </div>

        {/* Text */}
        <div>
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-5 border border-emerald-200">
            Tentang Kami
          </span>
          <h2
            className="text-4xl lg:text-5xl font-black text-emerald-900 leading-tight mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Lebih dari Sekadar{" "}
            <span className="text-amber-500">Sekolah</span>
          </h2>
          <p className="text-gray-600 leading-relaxed mb-5">
            MTs Darul Ihsan adalah madrasah tsanawiyah swasta unggulan yang
            berdiri sejak 2012 di bawah naungan Yayasan Darul Ihsan. Kami
            berkomitmen menghadirkan pendidikan Islam terpadu yang memadukan
            kurikulum nasional dengan nilai-nilai keislaman yang kuat.
          </p>
          <p className="text-gray-600 leading-relaxed mb-8">
            Dengan lingkungan belajar yang kondusif, tenaga pendidik
            berpengalaman, dan fasilitas modern, kami membimbing setiap siswa
            untuk meraih prestasi akademik sekaligus membentuk karakter Islami
            yang kokoh.
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "🕌", title: "Lingkungan Islami", desc: "Nuansa pesantren modern" },
              { icon: "📚", title: "Kurikulum Terpadu", desc: "Nasional + Keislaman" },
              { icon: "🏆", title: "Prestasi Nasional", desc: "Puluhan penghargaan" },
              { icon: "💻", title: "Fasilitas Modern", desc: "Lab & perpustakaan digital" },
            ].map((h) => (
              <div key={h.title} className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-emerald-50 transition-colors group">
                <span className="text-2xl">{h.icon}</span>
                <div>
                  <p className="font-bold text-emerald-900 text-sm group-hover:text-emerald-700">{h.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Program ─────────────────────────────────────────────────────────────────
function Program() {
  const programs = [
    {
      icon: "📖",
      title: "Tahfidz Al-Qur'an",
      color: "from-emerald-500 to-emerald-700",
      bg: "bg-emerald-50",
      accent: "text-emerald-700",
      desc: "Program menghafal Al-Qur'an terstruktur dengan bimbingan hafidz/hafidzah berpengalaman. Target minimal 3 juz selama 3 tahun.",
      img: "data:image/jpeg;base64,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",
      features: ["Metode Talaqqi", "Muroja'ah Harian", "Sanad Tersertifikasi"],
    },
    {
      icon: "🎓",
      title: "Akademik Unggulan",
      color: "from-blue-500 to-indigo-700",
      bg: "bg-blue-50",
      accent: "text-blue-700",
      desc: "Pembelajaran sains, matematika, dan bahasa dengan pendekatan kontekstual. Dipersiapkan untuk UN dan kompetisi nasional.",
      img: "https://mtsdarulihsansmd.sch.id/assets/images/84a04be7bb5faa4b12b175c0899b08e5.jpeg",
      features: ["STEM Terpadu", "Bahasa Arab & Inggris", "Olimpiade Sains"],
    },
    {
      icon: "✍️",
      title: "Kaligrafi & Seni Islam",
      color: "from-amber-500 to-orange-600",
      bg: "bg-amber-50",
      accent: "text-amber-700",
      desc: "Mendalami seni kaligrafi Arab sebagai warisan budaya Islam. Siswa diikutsertakan dalam perlombaan kaligrafi tingkat daerah dan nasional.",
      img: "https://www.auramedia.co/wp-content/uploads/2023/10/IMG-20231018-WA0095.jpg",
      features: ["Naskhi & Tsuluts", "Dekorasi Mushaf", "Pameran Karya"],
    },
    {
      icon: "⚽",
      bg: "bg-rose-50",
      accent: "text-rose-700",
      desc: "Pembentukan karakter melalui kegiatan kepramukaan, olahraga, dan seni bela diri yang dilandasi semangat sportivitas Islami.",
      img: "https://mtsdarulihsansmd.sch.id/assets/images/9cbea35a84a95188cd3b27e51422fe17.jpeg",
      features: ["Pramuka Aktif", "Futsal & Voli", "Pencak Silat"],
    },
  ];

  return (
    <section id="program" className="py-28 bg-gradient-to-br from-gray-50 to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-4 border border-emerald-200">
            Program Kami
          </span>
          <h2
            className="text-4xl lg:text-5xl font-black text-emerald-900 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Program <span className="text-amber-500">Unggulan</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Dirancang untuk mengoptimalkan potensi akademik, spiritual, dan
            karakter setiap siswa.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((p) => (
            <div
              key={p.title}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-200/80 hover:shadow-2xl hover:shadow-emerald-200/50 hover:-translate-y-2 transition-all duration-500"
            >
              {/* Image */}
              <div className="h-44 overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} text-xl mb-3 shadow-md`}>
                  {p.icon}
                </div>
                <h3 className="font-black text-emerald-900 text-base mb-2">{p.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-4">{p.desc}</p>
                <ul className="space-y-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${p.color}`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
        const res = await fetch("/api/news");
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
        setError("Gagal memuat berita. Silakan coba lagi nanti.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <section id="berita" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-4 border border-emerald-200">
              Informasi Terkini
            </span>
            <h2
              className="text-4xl lg:text-5xl font-black text-emerald-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Berita <span className="text-amber-500">Terbaru</span>
            </h2>
          </div>
          <a
            href="/berita"
            className="text-emerald-700 font-semibold text-sm flex items-center gap-2 hover:text-amber-500 transition-colors group"
          >
            Lihat Semua
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl overflow-hidden bg-gray-100 animate-pulse">
                <div className="h-52 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                  <div className="h-3 bg-gray-200 rounded w-4/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <p className="text-gray-500">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && news.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📰</p>
            <p>Belum ada berita yang tersedia.</p>
          </div>
        )}

        {/* News grid */}
        {!loading && !error && news.length > 0 && (
          <div className="grid md:grid-cols-3 gap-8">
            {news.map((item, idx) => (
              <a
                key={item?.slug ?? idx}
                href={`/berita/${item?.slug}`}
                className="group block bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-200/80 hover:shadow-2xl hover:shadow-emerald-200/50 hover:-translate-y-2 transition-all duration-500 border border-gray-100"
              >
                {/* Thumbnail */}
                <div className="relative h-52 overflow-hidden bg-emerald-100">
                  {item?.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item?.title ?? "Berita"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">📰</div>
                  )}
                  {item?.is_featured && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-400 text-emerald-900 text-xs font-bold shadow">
                      ⭐ Unggulan
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-emerald-600 text-xs font-semibold mb-2">
                    {formatDate(item?.published_at)}
                  </p>
                  <h3 className="font-black text-emerald-900 text-base leading-snug mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {item?.title ?? "Judul tidak tersedia"}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
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
    { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80", label: "Kegiatan Belajar" },
    { src: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&q=80", label: "Upacara" },
    { src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80", label: "Prestasi Siswa" },
    { src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80", label: "Ekstrakurikuler" },
    { src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80", label: "Wisuda" },
  ];

  return (
    <section className="py-20 bg-emerald-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <h2
          className="text-3xl font-black text-white"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Galeri <span className="text-amber-400">Kegiatan</span>
        </h2>
        <p className="text-emerald-400 mt-2 text-sm">Momen berharga di MTs Darul Ihsan</p>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 px-6 scrollbar-hide snap-x snap-mandatory">
        {images.map((img) => (
          <div
            key={img.label}
            className="relative flex-none w-64 h-80 rounded-3xl overflow-hidden snap-start group cursor-pointer"
          >
            <img
              src={img.src}
              alt={img.label}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 to-transparent" />
            <div className="absolute bottom-4 left-4">
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
  const testimonials = [
    {
      name: "Hj. Siti Rahmawati",
      role: "Orang Tua Siswa Kelas IX",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
      text: "Alhamdulillah, anak saya sangat berkembang sejak masuk MTs Darul Ihsan. Tidak hanya nilainya yang bagus, akhlaknya pun semakin baik. Gurunya ramah dan penuh perhatian.",
      stars: 5,
    },
    {
      name: "Ahmad Fauzan",
      role: "Alumni 2022 — Mahasiswa UIN Malang",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&q=80",
      text: "Tiga tahun di MTs Darul Ihsan membentuk saya menjadi pribadi yang lebih disiplin dan cinta Al-Qur'an. Program tahfidznya luar biasa dan sangat mendukung saya di jenjang berikutnya.",
      stars: 5,
    },
    {
      name: "Bapak Drs. Mahmud Syarif",
      role: "Kepala Sekolah SMA Nur Hidayah",
      avatar: "https://images.unsplash.com/photo-1607990283143-e81e7a2c9349?w=200&q=80",
      text: "Lulusan MTs Darul Ihsan selalu tampil percaya diri dan berakhlak. Mereka siap secara akademik maupun mental. Sekolah yang sangat kami rekomendasikan.",
      stars: 5,
    },
  ];

  return (
    <section id="testimoni" className="py-28 bg-gradient-to-br from-emerald-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest mb-4 border border-amber-200">
            Testimoni
          </span>
          <h2
            className="text-4xl lg:text-5xl font-black text-emerald-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Kata <span className="text-amber-500">Mereka</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/80 hover:shadow-2xl hover:shadow-emerald-200/50 hover:-translate-y-1 transition-all duration-500 border border-gray-100 flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <span key={i} className="text-amber-400 text-lg">★</span>
                ))}
              </div>

              {/* Quote mark */}
              <div className="text-6xl leading-none text-emerald-100 font-serif mb-2 select-none">"</div>

              <p className="text-gray-600 leading-relaxed text-sm flex-1 -mt-4">{t.text}</p>

              {/* Person */}
              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-200"
                />
                <div>
                  <p className="font-bold text-emerald-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section id="daftar" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=80"
          alt="bg"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/95 to-emerald-800/90" />
      </div>

      {/* Decorative */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 hidden lg:block">
        <svg viewBox="0 0 400 400" className="h-full" fill="none">
          <circle cx="300" cy="200" r="180" stroke="#f59e0b" strokeWidth="2"/>
          <circle cx="300" cy="200" r="120" stroke="#f59e0b" strokeWidth="1.5"/>
          <circle cx="300" cy="200" r="60" stroke="#f59e0b" strokeWidth="1"/>
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-widest mb-6">
          Pendaftaran Siswa Baru 2025/2026
        </span>
        <h2
          className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Wujudkan Impian
          <br />
          <span className="text-amber-400">Bersama Kami</span>
        </h2>
        <p className="text-emerald-100/80 text-lg mb-10 max-w-2xl mx-auto">
          Daftarkan putra-putri Anda sekarang dan jadikan mereka generasi
          Muslim yang cerdas, berakhlak, dan berprestasi.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a
            href="/pendaftaran"
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-900 font-black text-base shadow-2xl shadow-amber-500/30 hover:shadow-amber-400/50 hover:scale-105 transition-all duration-300"
          >
            Daftar Online Sekarang
          </a>
          <a
            href="https://wa.me/6281234567890"
            className="px-10 py-4 rounded-2xl border-2 border-white/30 text-white font-bold text-base hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Hubungi via WhatsApp
          </a>
        </div>

        {/* Info chips */}
        <div className="flex flex-wrap justify-center gap-3">
          {["Kuota Terbatas", "Beasiswa Tersedia", "Gratis Formulir", "Tes Online"].map((chip) => (
            <span
              key={chip}
              className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-medium"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer id="kontak" className="bg-emerald-950 text-emerald-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg" style={{ fontFamily: "'Amiri', serif" }}>
                    <img src="https://yt3.googleusercontent.com/ytc/AIdro_l8GLL-fpAqhHuLkiC22YBb-1qJWN65NoPLEWh-MREGCQ=s900-c-k-c0x00ffffff-no-rj" alt="" />
                </span>
              </div>
              <div>
                <p className="text-white font-bold text-base">MTs Darul Ihsan</p>
                <p className="text-emerald-400 text-xs">Sekolah Islami Modern</p>
              </div>
            </div>
            <p className="text-emerald-400 text-sm leading-relaxed max-w-sm mb-6">
              Membentuk generasi Muslim yang cerdas, berakhlak mulia, dan siap
              menghadapi tantangan zaman dengan pondasi iman yang kokoh.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[
                { label: "Instagram", icon: "📷", href: "#" },
                { label: "Facebook", icon: "📘", href: "#" },
                { label: "YouTube", icon: "📹", href: "#" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="w-9 h-9 rounded-xl bg-emerald-900 hover:bg-emerald-700 transition-colors flex items-center justify-center text-lg"
                  title={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Kontak</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-0.5">📍</span>
                <span className="text-emerald-400">Jl. Pendidikan No. 12, Kel. Sungai Lulut, Banjarmasin Timur, Kalimantan Selatan 70238</span>
              </li>
              <li className="flex items-center gap-3">
                <span>📞</span>
                <a href="tel:+6281234567890" className="text-emerald-400 hover:text-amber-400 transition-colors">
                  +62 812-3456-7890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span>✉️</span>
                <a href="mailto:info@mtsdarulihsan.sch.id" className="text-emerald-400 hover:text-amber-400 transition-colors">
                  info@mtsdarulihsan.sch.id
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span>🌐</span>
                <a href="https://mtsdarulihsan.sch.id" className="text-emerald-400 hover:text-amber-400 transition-colors">
                  mtsdarulihsan.sch.id
                </a>
              </li>
            </ul>
          </div>

          {/* Link cepat */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Tautan Cepat</h4>
            <ul className="space-y-3 text-sm">
              {[
                "Profil Sekolah",
                "Program Akademik",
                "Pendaftaran",
                "Berita & Kegiatan",
                "Kontak Kami",
              ].map((link) => (
                <li key={link}>
                  <a href="#" className="text-emerald-400 hover:text-amber-400 transition-colors flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-amber-500" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-8 border-t border-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-emerald-600 text-xs">
            © {new Date().getFullYear()} MTs Darul Ihsan. Seluruh hak cipta dilindungi.
          </p>
          <p className="text-emerald-600 text-xs">
            Dikelola oleh{" "}
            <span className="text-emerald-400">Yayasan Darul Ihsan</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function Welcome() {
  // Load Google Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Amiri:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <div className="min-h-screen antialiased font-sans bg-white">
      <Navbar />
      <Hero />
      <Tentang />
      <Program />
      <Berita />
      <GalleryBanner />
      <Testimoni />
      <CTA />
      <Footer />
    </div>
  );
}