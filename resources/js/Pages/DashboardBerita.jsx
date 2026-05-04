import { useState, useEffect } from "react";

const API_BASE = "/api";

const STATUS_CONFIG = {
  published: { label: "Published", bg: "#EAF3DE", color: "#3B6D11", border: "#639922" },
  draft: { label: "Draft", bg: "#FAEEDA", color: "#854F0B", border: "#BA7517" },
  archived: { label: "Archived", bg: "#F1EFE8", color: "#444441", border: "#888780" },
};

function Badge({ status }) {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.archived;
  return (
    <span style={{
      fontSize: 11, fontWeight: 500, padding: "2px 8px",
      borderRadius: 20, background: c.bg, color: c.color,
      border: `1px solid ${c.border}`, letterSpacing: "0.3px"
    }}>{c.label}</span>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 640,
        maxHeight: "90vh", overflow: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.18)"
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px 16px", borderBottom: "1px solid #eee", position: "sticky", top: 0, background: "#fff", zIndex: 1
        }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#1a1a1a" }}>{title}</h2>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer", fontSize: 20,
            color: "#888", lineHeight: 1, padding: "0 4px"
          }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

function FormField({ label, required, children, hint }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
        {label} {required && <span style={{ color: "#E24B4A" }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#9CA3AF" }}>{hint}</p>}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "8px 12px", border: "1px solid #D1D5DB", borderRadius: 8,
  fontSize: 14, outline: "none", boxSizing: "border-box", background: "#FAFAFA",
  transition: "border-color 0.15s", color: "#111827"
};

const selectStyle = { ...inputStyle, appearance: "none", cursor: "pointer" };

function NewsForm({ categories, initial, onSubmit, loading }) {
  const [form, setForm] = useState({
    news_category_id: "",
    title: "",
    excerpt: "",
    content: "",
    status: "draft",
    is_featured: false,
    published_at: "",
    ...initial,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handle = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handle}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
        <div style={{ gridColumn: "1/-1" }}>
          <FormField label="Judul Berita" required>
            <input style={inputStyle} value={form.title} onChange={e => set("title", e.target.value)} placeholder="Masukkan judul berita..." required />
          </FormField>
        </div>
        <FormField label="Kategori" required>
          <select style={selectStyle} value={form.news_category_id} onChange={e => set("news_category_id", e.target.value)} required>
            <option value="">Pilih kategori...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </FormField>
        <FormField label="Status" required>
          <select style={selectStyle} value={form.status} onChange={e => set("status", e.target.value)} required>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </FormField>
        <div style={{ gridColumn: "1/-1" }}>
          <FormField label="Excerpt" hint="Ringkasan singkat berita (maks. 200 karakter)">
            <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 64 }}
              value={form.excerpt} onChange={e => set("excerpt", e.target.value)}
              maxLength={200} placeholder="Ringkasan singkat..." />
          </FormField>
        </div>
        <div style={{ gridColumn: "1/-1" }}>
          <FormField label="Konten" required>
            <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 140 }}
              value={form.content} onChange={e => set("content", e.target.value)}
              placeholder="Tulis konten berita di sini..." required />
          </FormField>
        </div>
        <FormField label="Tanggal Publish">
          <input type="datetime-local" style={inputStyle} value={form.published_at}
            onChange={e => set("published_at", e.target.value)} />
        </FormField>
        <FormField label="Thumbnail" hint="JPEG, PNG, GIF — maks. 2MB">
          <input type="file" accept="image/*" style={{ ...inputStyle, padding: "6px 12px" }} />
        </FormField>
        <div style={{ gridColumn: "1/-1", display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
          <input type="checkbox" id="is_featured" checked={!!form.is_featured}
            onChange={e => set("is_featured", e.target.checked)}
            style={{ width: 16, height: 16, cursor: "pointer", accentColor: "#185FA5" }} />
          <label htmlFor="is_featured" style={{ fontSize: 14, color: "#374151", cursor: "pointer" }}>
            Tandai sebagai berita unggulan
          </label>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8, paddingTop: 16, borderTop: "1px solid #eee" }}>
        <button type="submit" disabled={loading} style={{
          padding: "9px 24px", background: loading ? "#93C5FD" : "#185FA5",
          color: "#fff", border: "none", borderRadius: 8, fontWeight: 600,
          fontSize: 14, cursor: loading ? "not-allowed" : "pointer", transition: "background 0.15s"
        }}>
          {loading ? "Menyimpan..." : "Simpan Berita"}
        </button>
      </div>
    </form>
  );
}

function ConfirmDelete({ news, onConfirm, onCancel, loading }) {
  return (
    <div style={{ textAlign: "center", padding: "8px 0" }}>
      <div style={{
        width: 56, height: 56, borderRadius: 28, background: "#FCEBEB",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 16px", fontSize: 24
      }}>🗑️</div>
      <h3 style={{ margin: "0 0 8px", fontSize: 17, color: "#111827" }}>Hapus Berita?</h3>
      <p style={{ margin: "0 0 24px", fontSize: 14, color: "#6B7280", lineHeight: 1.6 }}>
        Anda akan menghapus <strong>"{news?.title}"</strong>.<br />
        Tindakan ini tidak bisa dibatalkan.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
        <button onClick={onCancel} style={{
          padding: "9px 20px", background: "#F9FAFB", border: "1px solid #D1D5DB",
          borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", color: "#374151"
        }}>Batal</button>
        <button onClick={onConfirm} disabled={loading} style={{
          padding: "9px 20px", background: loading ? "#F09595" : "#E24B4A",
          color: "#fff", border: "none", borderRadius: 8, fontSize: 14,
          fontWeight: 600, cursor: loading ? "not-allowed" : "pointer"
        }}>{loading ? "Menghapus..." : "Ya, Hapus"}</button>
      </div>
    </div>
  );
}

function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderTop: "1px solid #F3F4F6" }}>
      <span style={{ fontSize: 13, color: "#6B7280" }}>
        Menampilkan {meta.from}–{meta.to} dari {meta.total} berita
      </span>
      <div style={{ display: "flex", gap: 6 }}>
        {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onPageChange(p)} style={{
            width: 32, height: 32, borderRadius: 6, border: "1px solid",
            borderColor: p === meta.current_page ? "#185FA5" : "#E5E7EB",
            background: p === meta.current_page ? "#185FA5" : "#fff",
            color: p === meta.current_page ? "#fff" : "#374151",
            fontWeight: 500, fontSize: 13, cursor: "pointer"
          }}>{p}</button>
        ))}
      </div>
    </div>
  );
}

// Simulasi data untuk preview (tanpa backend nyata)
const MOCK_CATEGORIES = [
  { id: 1, name: "Teknologi" }, { id: 2, name: "Bisnis" },
  { id: 3, name: "Olahraga" }, { id: 4, name: "Hiburan" },
];

const MOCK_NEWS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: ["Inovasi AI Mengubah Dunia Teknologi 2024", "Startup Lokal Raih Pendanaan Seri B", "Timnas Juara Piala Asia Tenggara", "Film Animasi Lokal Tembus Pasar Global", "Kebijakan Energi Baru Pemerintah", "UMKM Digital Tumbuh 40% Tahun Ini"][i % 6],
  excerpt: "Ringkasan singkat dari berita ini yang menggambarkan isi utama artikel dengan jelas.",
  status: ["published", "draft", "archived", "published", "draft", "published"][i % 6],
  is_featured: i % 4 === 0,
  views_count: Math.floor(Math.random() * 5000),
  created_at: new Date(Date.now() - i * 86400000 * 2).toISOString(),
  category: MOCK_CATEGORIES[i % 4],
  user: { name: "Admin Redaksi" },
}));

export default function NewsDashboard() {
  const [news, setNews] = useState(MOCK_NEWS);
  const [categories] = useState(MOCK_CATEGORIES);
  const [modal, setModal] = useState(null); // null | 'create' | 'edit' | 'delete' | 'view'
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = news.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || n.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const PAGE_SIZE = 8;
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = {
    total: news.length,
    published: news.filter(n => n.status === "published").length,
    draft: news.filter(n => n.status === "draft").length,
    featured: news.filter(n => n.is_featured).length,
  };

  const handleCreate = async (form) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const newItem = {
      id: Date.now(), ...form,
      views_count: 0,
      created_at: new Date().toISOString(),
      category: categories.find(c => c.id == form.news_category_id) || {},
      user: { name: "Admin" },
    };
    setNews(prev => [newItem, ...prev]);
    setModal(null);
    setLoading(false);
    showToast("Berita berhasil ditambahkan!");
  };

  const handleEdit = async (form) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setNews(prev => prev.map(n => n.id === selected.id
      ? { ...n, ...form, category: categories.find(c => c.id == form.news_category_id) || n.category }
      : n
    ));
    setModal(null);
    setLoading(false);
    showToast("Berita berhasil diperbarui!");
  };

  const handleDelete = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setNews(prev => prev.filter(n => n.id !== selected.id));
    setModal(null);
    setLoading(false);
    showToast("Berita berhasil dihapus!", "info");
  };

  const fmtDate = (d) => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  const fmtViews = (v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v);

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#F8FAFC" }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 9999,
          padding: "12px 20px", borderRadius: 10,
          background: toast.type === "success" ? "#0F6E56" : "#185FA5",
          color: "#fff", fontSize: 14, fontWeight: 500,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          animation: "slideIn 0.2s ease"
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: "#185FA5",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18
            }}>📰</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>Newsroom Dashboard</h1>
              <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>Kelola semua konten berita</p>
            </div>
          </div>
          <button onClick={() => { setSelected(null); setModal("create"); }} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "9px 18px", background: "#185FA5", color: "#fff",
            border: "none", borderRadius: 9, fontWeight: 600, fontSize: 14,
            cursor: "pointer", transition: "background 0.15s"
          }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Tulis Berita
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 32px" }}>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Total Berita", value: stats.total, icon: "📋", color: "#E6F1FB", text: "#185FA5" },
            { label: "Dipublikasikan", value: stats.published, icon: "✅", color: "#EAF3DE", text: "#3B6D11" },
            { label: "Draft", value: stats.draft, icon: "📝", color: "#FAEEDA", text: "#854F0B" },
            { label: "Unggulan", value: stats.featured, icon: "⭐", color: "#FBEAF0", text: "#993556" },
          ].map(s => (
            <div key={s.label} style={{
              background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB",
              padding: "18px 20px", display: "flex", alignItems: "center", gap: 14
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
              <div>
                <p style={{ margin: 0, fontSize: 12, color: "#6B7280", fontWeight: 500 }}>{s.label}</p>
                <p style={{ margin: "2px 0 0", fontSize: 24, fontWeight: 700, color: s.text }}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", overflow: "hidden" }}>

          {/* Table Header */}
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <input
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="🔍  Cari judul berita..."
              style={{ ...inputStyle, width: 260, background: "#F9FAFB" }}
            />
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} style={{ ...selectStyle, width: 150 }}>
              <option value="all">Semua Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <span style={{ marginLeft: "auto", fontSize: 13, color: "#9CA3AF" }}>
              {filtered.length} berita ditemukan
            </span>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#F9FAFB" }}>
                  {["Judul", "Kategori", "Status", "Views", "Featured", "Tanggal", "Aksi"].map(h => (
                    <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontWeight: 600, color: "#6B7280", fontSize: 12, whiteSpace: "nowrap", borderBottom: "1px solid #F3F4F6" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: "center", padding: "48px 24px", color: "#9CA3AF" }}>
                    <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
                    <p style={{ margin: 0, fontWeight: 500 }}>Tidak ada berita ditemukan</p>
                  </td></tr>
                ) : paginated.map((n, i) => (
                  <tr key={n.id} style={{ borderBottom: "1px solid #F9FAFB", background: i % 2 === 0 ? "#fff" : "#FAFBFC", transition: "background 0.1s" }}>
                    <td style={{ padding: "13px 16px", maxWidth: 280 }}>
                      <div style={{ fontWeight: 500, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.title}</div>
                      <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{n.user?.name}</div>
                    </td>
                    <td style={{ padding: "13px 16px", color: "#6B7280", whiteSpace: "nowrap" }}>
                      <span style={{ padding: "2px 10px", background: "#E6F1FB", color: "#185FA5", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
                        {n.category?.name || "—"}
                      </span>
                    </td>
                    <td style={{ padding: "13px 16px" }}><Badge status={n.status} /></td>
                    <td style={{ padding: "13px 16px", color: "#6B7280", fontVariantNumeric: "tabular-nums" }}>{fmtViews(n.views_count)}</td>
                    <td style={{ padding: "13px 16px", textAlign: "center" }}>
                      {n.is_featured ? <span style={{ color: "#D4A017", fontSize: 16 }}>★</span> : <span style={{ color: "#D1D5DB" }}>☆</span>}
                    </td>
                    <td style={{ padding: "13px 16px", color: "#6B7280", whiteSpace: "nowrap", fontSize: 12 }}>{fmtDate(n.created_at)}</td>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => { setSelected(n); setModal("view"); }} title="Lihat" style={{ padding: "5px 10px", border: "1px solid #E5E7EB", borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 14 }}>👁</button>
                        <button onClick={() => { setSelected(n); setModal("edit"); }} title="Edit" style={{ padding: "5px 10px", border: "1px solid #E5E7EB", borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 14 }}>✏️</button>
                        <button onClick={() => { setSelected(n); setModal("delete"); }} title="Hapus" style={{ padding: "5px 10px", border: "1px solid #FCA5A5", borderRadius: 6, background: "#FFF5F5", cursor: "pointer", fontSize: 14 }}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderTop: "1px solid #F3F4F6" }}>
              <span style={{ fontSize: 13, color: "#6B7280" }}>
                Halaman {page} dari {totalPages}
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{
                  padding: "5px 14px", border: "1px solid #E5E7EB", borderRadius: 6,
                  background: "#fff", cursor: page === 1 ? "not-allowed" : "pointer",
                  color: page === 1 ? "#D1D5DB" : "#374151", fontSize: 13, fontWeight: 500
                }}>‹ Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => Math.abs(p - page) <= 2).map(p => (
                  <button key={p} onClick={() => setPage(p)} style={{
                    width: 32, height: 32, border: "1px solid", borderRadius: 6,
                    borderColor: p === page ? "#185FA5" : "#E5E7EB",
                    background: p === page ? "#185FA5" : "#fff",
                    color: p === page ? "#fff" : "#374151",
                    fontWeight: 500, fontSize: 13, cursor: "pointer"
                  }}>{p}</button>
                ))}
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={{
                  padding: "5px 14px", border: "1px solid #E5E7EB", borderRadius: 6,
                  background: "#fff", cursor: page === totalPages ? "not-allowed" : "pointer",
                  color: page === totalPages ? "#D1D5DB" : "#374151", fontSize: 13, fontWeight: 500
                }}>Next ›</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create */}
      {modal === "create" && (
        <Modal title="✏️  Tambah Berita Baru" onClose={() => setModal(null)}>
          <NewsForm categories={categories} onSubmit={handleCreate} loading={loading} />
        </Modal>
      )}

      {/* Modal: Edit */}
      {modal === "edit" && selected && (
        <Modal title="📝  Edit Berita" onClose={() => setModal(null)}>
          <NewsForm categories={categories} initial={{
            ...selected,
            news_category_id: selected.category?.id || "",
          }} onSubmit={handleEdit} loading={loading} />
        </Modal>
      )}

      {/* Modal: Delete */}
      {modal === "delete" && (
        <Modal title="Konfirmasi Hapus" onClose={() => setModal(null)}>
          <ConfirmDelete news={selected} onConfirm={handleDelete} onCancel={() => setModal(null)} loading={loading} />
        </Modal>
      )}

      {/* Modal: View */}
      {modal === "view" && selected && (
        <Modal title="Detail Berita" onClose={() => setModal(null)}>
          <div style={{ lineHeight: 1.7 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: "0 0 8px", fontSize: 20, color: "#111827", lineHeight: 1.4 }}>{selected.title}</h2>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <Badge status={selected.status} />
                  <span style={{ padding: "2px 10px", background: "#E6F1FB", color: "#185FA5", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{selected.category?.name}</span>
                  {selected.is_featured && <span style={{ padding: "2px 10px", background: "#FBEAF0", color: "#993556", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>★ Unggulan</span>}
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px", background: "#F9FAFB", borderRadius: 10, padding: "14px 16px", marginBottom: 16, fontSize: 13 }}>
              <div><span style={{ color: "#9CA3AF" }}>Penulis: </span><span style={{ color: "#374151", fontWeight: 500 }}>{selected.user?.name}</span></div>
              <div><span style={{ color: "#9CA3AF" }}>Views: </span><span style={{ color: "#374151", fontWeight: 500 }}>{selected.views_count?.toLocaleString()}</span></div>
              <div><span style={{ color: "#9CA3AF" }}>Dibuat: </span><span style={{ color: "#374151", fontWeight: 500 }}>{fmtDate(selected.created_at)}</span></div>
            </div>
            {selected.excerpt && (
              <div style={{ padding: "12px 16px", background: "#EFF6FF", borderLeft: "3px solid #185FA5", borderRadius: "0 8px 8px 0", marginBottom: 16, fontSize: 14, color: "#374151", fontStyle: "italic" }}>
                {selected.excerpt}
              </div>
            )}
            <p style={{ margin: 0, fontSize: 14, color: "#374151", whiteSpace: "pre-wrap" }}>{selected.content}</p>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24, paddingTop: 16, borderTop: "1px solid #eee" }}>
              <button onClick={() => { setModal("edit"); }} style={{
                padding: "9px 20px", background: "#185FA5", color: "#fff", border: "none",
                borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer"
              }}>Edit Berita</button>
            </div>
          </div>
        </Modal>
      )}

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        button:hover { opacity: 0.9; }
        tr:hover td { background: #F0F7FF !important; }
        input:focus, select:focus, textarea:focus { border-color: #185FA5 !important; box-shadow: 0 0 0 3px rgba(24,95,165,0.12); background: #fff !important; }
      `}</style>
    </div>
  );
}