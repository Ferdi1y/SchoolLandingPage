import React, { useState, useMemo } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Edit2, Trash2, Eye, Plus, Search, ChevronDown, Loader2, Newspaper, Star, X, CheckSquare } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function NewsIndex({ news, categories }) {
  const { flash } = usePage().props;
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedNews, setSelectedNews] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFlash, setShowFlash] = useState(true);
  const filteredNews = useMemo(() => {
 return news.data.filter(item => {
  const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());

  const matchCategory =
    !filterCategory || item.news_category_id.toString() === filterCategory;

  const matchStatus =
    !filterStatus || item.status === filterStatus;

  return matchSearch && matchCategory && matchStatus;
});
  }, [news.data, searchQuery, filterCategory, filterStatus]);

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedNews(filteredNews.map(item => item.id));
    else setSelectedNews([]);
  };

  const handleSelectNews = (id) => {
    setSelectedNews(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      setIsDeleting(true);
      router.delete(route('news.destroy', deleteConfirm), {
        onSuccess: () => { setIsDeleting(false); setDeleteConfirm(null); },
        onError: () => { setIsDeleting(false); }
      });
    }
  };

  const confirmBulkDelete = () => {
    setIsDeleting(true);
    router.post(route('news.bulk-delete'), { ids: selectedNews }, {
      onSuccess: () => { setIsDeleting(false); setDeleteConfirm(null); setSelectedNews([]); },
      onError: () => { setIsDeleting(false); }
    });
  };

  const statusConfig = {
    published: { label: 'Published', cls: 'status-published' },
    draft: { label: 'Draft', cls: 'status-draft' },
    archived: { label: 'Archived', cls: 'status-archived' },
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
 console.log(news.data);
  return (
    <AuthenticatedLayout
      header={
        <div className="page-header">
          <div className="page-header-left">
            <div className="page-icon-wrap">
              <Newspaper size={20} strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="page-title">Manajemen Berita</h1>
              <p className="page-subtitle">Kelola semua berita dan artikel portal sekolah</p>
            </div>
          </div>
          <Link href={route('news.create')} className="btn-primary">
            <Plus size={16} />
            Tambah Berita
          </Link>
        </div>
      }
    >
      <style>{`
        .page-header { display:flex; align-items:center; justify-content:space-between; gap:16px; }
        .page-header-left { display:flex; align-items:center; gap:14px; }
        .page-icon-wrap { width:40px; height:40px; background:#EFF6FF; border-radius:10px; display:flex; align-items:center; justify-content:center; color:#2563EB; flex-shrink:0; }
        .page-title { font-size:1.2rem; font-weight:600; color:#0F172A; margin:0; }
        .page-subtitle { font-size:0.8rem; color:#64748B; margin:0; }
        .btn-primary { display:inline-flex; align-items:center; gap:8px; padding:9px 18px; background:#2563EB; color:#fff; font-size:0.875rem; font-weight:500; border-radius:8px; text-decoration:none; transition:background 0.15s; }
        .btn-primary:hover { background:#1D4ED8; color:#fff; }
        .news-wrap { padding:24px; }
        .flash-bar { display:flex; align-items:center; gap:12px; padding:12px 16px; background:#F0FDF4; border:1px solid #BBF7D0; border-radius:8px; margin-bottom:20px; }
        .flash-text { flex:1; font-size:0.875rem; color:#15803D; font-weight:500; }
        .flash-close { background:none; border:none; cursor:pointer; color:#86EFAC; padding:2px; display:flex; align-items:center; }
        .flash-close:hover { color:#15803D; }
        .filter-card { background:#fff; border:1px solid #E2E8F0; border-radius:10px; padding:16px 20px; margin-bottom:16px; }
        .filter-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; }
        @media(max-width:640px){ .filter-grid{ grid-template-columns:1fr; } }
        .search-wrap { position:relative; }
        .search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#94A3B8; pointer-events:none; }
        .search-input { width:100%; padding:8px 12px 8px 36px; border:1px solid #E2E8F0; border-radius:8px; font-size:0.875rem; color:#0F172A; outline:none; background:#F8FAFC; transition:all 0.15s; box-sizing:border-box; }
        .search-input:focus { border-color:#2563EB; background:#fff; box-shadow:0 0 0 3px rgba(37,99,235,0.08); }
        .select-wrap { position:relative; }
        .filter-select { width:100%; padding:8px 32px 8px 12px; border:1px solid #E2E8F0; border-radius:8px; font-size:0.875rem; color:#0F172A; outline:none; background:#F8FAFC; appearance:none; cursor:pointer; transition:all 0.15s; }
        .filter-select:focus { border-color:#2563EB; background:#fff; box-shadow:0 0 0 3px rgba(37,99,235,0.08); }
        .select-arrow { position:absolute; right:10px; top:50%; transform:translateY(-50%); color:#94A3B8; pointer-events:none; }
        .bulk-bar { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; background:#EFF6FF; border:1px solid #BFDBFE; border-radius:8px; margin-bottom:16px; }
        .bulk-text { font-size:0.875rem; color:#1E40AF; font-weight:500; display:flex; align-items:center; gap:8px; }
        .btn-danger-sm { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; background:#EF4444; color:#fff; font-size:0.8rem; font-weight:500; border-radius:7px; border:none; cursor:pointer; transition:background 0.15s; }
        .btn-danger-sm:hover { background:#DC2626; }
        .table-card { background:#fff; border:1px solid #E2E8F0; border-radius:10px; overflow:hidden; }
        .table-scroll { overflow-x:auto; }
        table { width:100%; border-collapse:collapse; }
        thead tr { background:#F8FAFC; border-bottom:1px solid #E2E8F0; }
        th { padding:11px 16px; text-align:left; font-size:0.78rem; font-weight:600; color:#64748B; text-transform:uppercase; letter-spacing:0.04em; white-space:nowrap; }
        th:last-child { text-align:right; }
        tbody tr { border-bottom:1px solid #F1F5F9; transition:background 0.1s; }
        tbody tr:last-child { border-bottom:none; }
        tbody tr:hover { background:#F8FAFC; }
        td { padding:13px 16px; font-size:0.875rem; color:#334155; vertical-align:middle; }
        td:last-child { text-align:right; }
        .news-cell { display:flex; align-items:center; gap:10px; }
        .thumb-img { width:36px; height:36px; border-radius:6px; object-fit:cover; flex-shrink:0; }
        .thumb-placeholder { width:36px; height:36px; border-radius:6px; background:#F1F5F9; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
        .news-title { font-size:0.875rem; font-weight:500; color:#0F172A; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:220px; }
        .featured-dot { display:inline-flex; align-items:center; gap:4px; }
        .cat-badge { display:inline-flex; padding:3px 10px; border-radius:20px; font-size:0.75rem; font-weight:500; color:#fff; white-space:nowrap; }
        .status-published { display:inline-flex; padding:3px 10px; border-radius:20px; font-size:0.75rem; font-weight:500; background:#DCFCE7; color:#15803D; }
        .status-draft { display:inline-flex; padding:3px 10px; border-radius:20px; font-size:0.75rem; font-weight:500; background:#FEF9C3; color:#854D0E; }
        .status-archived { display:inline-flex; padding:3px 10px; border-radius:20px; font-size:0.75rem; font-weight:500; background:#F1F5F9; color:#475569; }
        .views-cell { font-size:0.875rem; font-weight:500; color:#0F172A; }
        .date-cell { font-size:0.8rem; color:#64748B; white-space:nowrap; }
        .action-row { display:flex; align-items:center; justify-content:flex-end; gap:4px; }
        .icon-btn { width:32px; height:32px; display:inline-flex; align-items:center; justify-content:center; border-radius:6px; border:none; cursor:pointer; background:transparent; transition:all 0.15s; text-decoration:none; }
        .icon-btn-view { color:#64748B; } .icon-btn-view:hover { background:#F1F5F9; color:#334155; }
        .icon-btn-edit { color:#2563EB; } .icon-btn-edit:hover { background:#EFF6FF; }
        .icon-btn-del { color:#EF4444; } .icon-btn-del:hover { background:#FEF2F2; }
        .empty-state { padding:60px 24px; text-align:center; }
        .empty-icon { width:56px; height:56px; background:#F1F5F9; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; color:#94A3B8; }
        .empty-title { font-size:1rem; font-weight:600; color:#0F172A; margin:0 0 8px; }
        .empty-text { font-size:0.875rem; color:#64748B; margin:0 0 20px; }
        .pagination { display:flex; align-items:center; justify-content:space-between; padding:14px 20px; border-top:1px solid #E2E8F0; flex-wrap:wrap; gap:10px; }
        .pag-info { font-size:0.8rem; color:#64748B; }
        .pag-pages { display:flex; align-items:center; gap:4px; }
        .pag-link { display:inline-flex; align-items:center; padding:6px 10px; border:1px solid #E2E8F0; border-radius:6px; font-size:0.8rem; color:#475569; text-decoration:none; transition:all 0.12s; }
        .pag-link:hover { background:#F8FAFC; border-color:#CBD5E1; }
        .pag-link-active { background:#2563EB; border-color:#2563EB; color:#fff; }
        .pag-link-active:hover { background:#1D4ED8; }
        .modal-overlay { position:fixed; inset:0; background:rgba(15,23,42,0.5); display:flex; align-items:center; justify-content:center; z-index:50; padding:16px; }
        .modal-card { background:#fff; border-radius:12px; padding:28px; max-width:380px; width:100%; box-shadow:0 20px 60px rgba(0,0,0,0.15); }
        .modal-icon { width:48px; height:48px; background:#FEF2F2; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; color:#EF4444; }
        .modal-title { text-align:center; font-size:1rem; font-weight:600; color:#0F172A; margin:0 0 8px; }
        .modal-text { text-align:center; font-size:0.875rem; color:#64748B; margin:0 0 24px; }
        .modal-actions { display:flex; gap:10px; }
        .btn-cancel { flex:1; padding:9px; border:1px solid #E2E8F0; border-radius:8px; background:#fff; font-size:0.875rem; font-weight:500; color:#475569; cursor:pointer; transition:all 0.15s; }
        .btn-cancel:hover { background:#F8FAFC; }
        .btn-confirm-del { flex:1; padding:9px; background:#EF4444; border:none; border-radius:8px; font-size:0.875rem; font-weight:500; color:#fff; cursor:pointer; transition:background 0.15s; display:flex; align-items:center; justify-content:center; gap:6px; }
        .btn-confirm-del:hover { background:#DC2626; }
        .btn-confirm-del:disabled, .btn-cancel:disabled { opacity:0.5; cursor:not-allowed; }
        input[type="checkbox"] { width:15px; height:15px; accent-color:#2563EB; cursor:pointer; }
      `}</style>

      <div className="news-wrap">
        {flash?.success && showFlash && (
          <div className="flash-bar">
            <span className="flash-text">{flash.success}</span>
            <button className="flash-close" onClick={() => setShowFlash(false)}><X size={14} /></button>
          </div>
        )}

        <div className="filter-card">
          <div className="filter-grid">
            <div className="search-wrap">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Cari judul berita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="select-wrap">
              <select className="filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="">Semua Kategori</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <ChevronDown size={14} className="select-arrow" />
            </div>
            <div className="select-wrap">
              <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">Semua Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
              <ChevronDown size={14} className="select-arrow" />
            </div>
          </div>
        </div>

        {selectedNews.length > 0 && (
          <div className="bulk-bar">
            <span className="bulk-text"><CheckSquare size={15} /> {selectedNews.length} berita dipilih</span>
            <button className="btn-danger-sm" onClick={() => setDeleteConfirm('bulk')}>
              <Trash2 size={13} /> Hapus Dipilih
            </button>
          </div>
        )}

        <div className="table-card">
          {filteredNews.length > 0 ? (
            <>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>
                        <input
                          type="checkbox"
                          checked={selectedNews.length === filteredNews.length && filteredNews.length > 0}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th>Judul Berita</th>
                      <th>Kategori</th>
                      <th>Penulis</th>
                      <th>Views</th>
                      <th>Status</th>
                      <th>Tanggal</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNews.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <input type="checkbox" checked={selectedNews.includes(item.id)} onChange={() => handleSelectNews(item.id)} />
                        </td>
                        <td>
                          <div className="news-cell">
                            {item.thumbnail
                              ? <img src={'/storage/' + item.thumbnail} alt={item.title} className="thumb-img" />
                              : <div className="thumb-placeholder"><Newspaper size={14} color="#CBD5E1" /></div>
                            }
                            <div>
                              <div className="news-title">
                                {item.is_featured && <Star size={12} style={{ display:'inline', color:'#F59E0B', marginRight:4, verticalAlign:'middle' }} />}
                                {item.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="cat-badge" style={{ backgroundColor: item.category_color || '#64748B' }}>
                            { item.category_name?.toLowerCase()  || '-'}
                          </span>
                        </td>
                        <td style={{ color: '#334155' }}>{item.user_name || '-'}</td>
                        <td><span className="views-cell">{item.views_count || 0}</span></td>
                        <td><span className={statusConfig[item.status]?.cls || 'status-draft'}>{statusConfig[item.status]?.label || item.status}</span></td>
                        <td><span className="date-cell">{formatDate(item.created_at)}</span></td>
                        <td>
                          <div className="action-row">
                            <Link href={route('news.show', item.id)} className="icon-btn icon-btn-view" title="Lihat"><Eye size={16} /></Link>
                            <Link href={route('news.edit', item.id)} className="icon-btn icon-btn-edit" title="Edit"><Edit2 size={16} /></Link>
                            <button className="icon-btn icon-btn-del" title="Hapus" onClick={() => setDeleteConfirm(item.id)}><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {news.last_page > 1 && (
                <div className="pagination">
                  <span className="pag-info">
                    Menampilkan <strong>{news.from}</strong>–<strong>{news.to}</strong> dari <strong>{news.total}</strong> berita
                  </span>
                  <div className="pag-pages">
                    {news.prev_page_url && <Link href={news.prev_page_url} className="pag-link">← Sebelumnya</Link>}
                    {Array.from({ length: news.last_page }, (_, i) => i + 1).map(page => (
                      <Link key={page} href={`${news.path}?page=${page}`} className={`pag-link ${page === news.current_page ? 'pag-link-active' : ''}`}>{page}</Link>
                    ))}
                    {news.next_page_url && <Link href={news.next_page_url} className="pag-link">Selanjutnya →</Link>}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon"><Newspaper size={24} /></div>
              <h3 className="empty-title">Belum ada berita</h3>
              <p className="empty-text">Mulai buat berita baru untuk portal sekolah Anda sekarang.</p>
              <Link href={route('news.create')} className="btn-primary" style={{ justifyContent:'center', display:'inline-flex' }}>
                <Plus size={16} /> Buat Berita Pertama
              </Link>
            </div>
          )}
        </div>
      </div>

      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-icon"><Trash2 size={22} /></div>
            <h3 className="modal-title">{deleteConfirm === 'bulk' ? 'Hapus Berita Terpilih?' : 'Hapus Berita Ini?'}</h3>
            <p className="modal-text">
              {deleteConfirm === 'bulk'
                ? `${selectedNews.length} berita akan dihapus secara permanen.`
                : 'Berita yang dihapus tidak dapat dipulihkan kembali.'}
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)} disabled={isDeleting}>Batal</button>
              <button
                className="btn-confirm-del"
                onClick={deleteConfirm === 'bulk' ? confirmBulkDelete : confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? <><Loader2 size={14} style={{ animation:'spin 1s linear infinite' }} /> Menghapus...</> : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}