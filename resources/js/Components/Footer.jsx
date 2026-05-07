import React from "react";

export default function Footer() {
  return (
    <footer id="kontak" className="bg-emerald-950 text-emerald-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">

        {/* Grid utama */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">

          {/* Brand — full width di mobile, span-2 di lg */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center overflow-hidden">
                <img
                  src="https://yt3.googleusercontent.com/ytc/AIdro_l8GLL-fpAqhHuLkiC22YBb-1qJWN65NoPLEWh-MREGCQ=s900-c-k-c0x00ffffff-no-rj"
                  alt="Logo MTs Darul Ihsan"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-white font-bold text-base leading-tight">MTs Darul Ihsan</p>
                <p className="text-emerald-400 text-xs mt-0.5">Sekolah Islami Modern</p>
              </div>
            </div>

            <p className="text-emerald-400 text-sm leading-relaxed mb-5 max-w-sm">
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
                  className="w-9 h-9 rounded-xl bg-emerald-900 hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center text-lg"
                  title={s.label}
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Kontak */}
          <div className="sm:col-span-1">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Kontak
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0">📍</span>
                <span className="text-emerald-400 leading-relaxed">
                  Jl. Siti Aisyah, Teluk Lerong Ilir, Kec. Samarinda Ulu, Kota Samarinda, Kalimantan Timur 75128.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="shrink-0">📞</span>
                <a
                  href="tel:+62805417778995"
                  className="text-emerald-400 hover:text-amber-400 transition-colors break-all"
                >
                  +6280 54 1777 8995
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="shrink-0">✉️</span>
                <a
                  href="mailto:info@mtsdarulihsan.sch.id"
                  className="text-emerald-400 hover:text-amber-400 transition-colors break-all"
                >
                  info@mtsdarulihsan.sch.id
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="shrink-0">🌐</span>
                <a
                  href="https://mtsdarulihsan.sch.id"
                  className="text-emerald-400 hover:text-amber-400 transition-colors break-all"
                >
                  mtsdarulihsan.sch.id
                </a>
              </li>
            </ul>
          </div>

          {/* Tautan Cepat */}
          <div className="sm:col-span-1">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Tautan Cepat
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                "Profil Sekolah",
                "Program Akademik",
                "Pendaftaran",
                "Berita & Kegiatan",
                "Kontak Kami",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-emerald-400 hover:text-amber-400 transition-colors flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 shrink-0 rounded-full bg-amber-500 group-hover:scale-125 transition-transform" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
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