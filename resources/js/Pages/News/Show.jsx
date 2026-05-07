import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Newspaper, Edit2, Eye, Calendar, User, Clock, Star, Tag, Hash } from 'lucide-react';

export default function NewsShow({ news }) {
  const statusConfig = {
    published: { label: 'Dipublikasikan', cls: 'status-published' },
    draft: { label: 'Draft', cls: 'status-draft' },
    archived: { label: 'Diarsipkan', cls: 'status-archived' },
  };

  const formatDateFull = (d) => d ? new Date(d).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }) : 'Belum ditentukan';

  const formatDateShort = (d) => new Date(d).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const formatDatetime = (d) => new Date(d).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const status = statusConfig[news.status] || statusConfig.draft;

  return (
    <AuthenticatedLayout
      header={
        <div className="page-header">
          <div className="page-header-left">
            <div className="page-icon-wrap">
              <Newspaper size={20} strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="page-title">Detail Berita</h1>
              <p className="page-subtitle">Pratinjau lengkap berita</p>
            </div>
          </div>
          <Link href={route('news.edit', news.id)} className="btn-edit">
            <Edit2 size={15} />
            Edit Berita
          </Link>
        </div>
      }
    >
      <Head title={news.title} />

      <style>{`
        .page-header { display:flex; align-items:center; justify-content:space-between; gap:16px; }
        .page-header-left { display:flex; align-items:center; gap:14px; }
        .page-icon-wrap { width:40px; height:40px; background:#EFF6FF; border-radius:10px; display:flex; align-items:center; justify-content:center; color:#2563EB; flex-shrink:0; }
        .page-title { font-size:1.2rem; font-weight:600; color:#0F172A; margin:0; }
        .page-subtitle { font-size:0.8rem; color:#64748B; margin:0; }
        .btn-edit { display:inline-flex; align-items:center; gap:8px; padding:9px 18px; background:#2563EB; color:#fff; font-size:0.875rem; font-weight:500; border-radius:8px; text-decoration:none; transition:background 0.15s; }
        .btn-edit:hover { background:#1D4ED8; color:#fff; }
        .show-page { padding:24px; }
        .breadcrumb { display:flex; align-items:center; gap:8px; margin-bottom:20px; }
        .breadcrumb-link { display:inline-flex; align-items:center; gap:6px; font-size:0.875rem; color:#2563EB; text-decoration:none; font-weight:500; }
        .breadcrumb-link:hover { color:#1D4ED8; }
        .show-card { background:#fff; border:1px solid #E2E8F0; border-radius:12px; overflow:hidden; }
        .show-hero { padding:24px; border-bottom:1px solid #F1F5F9; background:#F8FAFC; }
        .badges-row { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:14px; }
        .cat-badge { display:inline-flex; padding:4px 12px; border-radius:20px; font-size:0.78rem; font-weight:500; color:#fff; }
        .featured-badge { display:inline-flex; align-items:center; gap:4px; padding:4px 12px; border-radius:20px; font-size:0.78rem; font-weight:500; background:#FEF3C7; color:#92400E; }
        .status-published { display:inline-flex; padding:4px 12px; border-radius:20px; font-size:0.78rem; font-weight:500; background:#DCFCE7; color:#15803D; }
        .status-draft { display:inline-flex; padding:4px 12px; border-radius:20px; font-size:0.78rem; font-weight:500; background:#FEF9C3; color:#854D0E; }
        .status-archived { display:inline-flex; padding:4px 12px; border-radius:20px; font-size:0.78rem; font-weight:500; background:#F1F5F9; color:#475569; }
        .show-title { font-size:1.5rem; font-weight:700; color:#0F172A; margin:0 0 10px; line-height:1.35; }
        .show-excerpt { font-size:0.9rem; color:#64748B; margin:0 0 20px; line-height:1.6; }
        .meta-grid { display:grid; grid-template-columns:repeat(4, 1fr); gap:10px; }
        @media(max-width:640px){ .meta-grid{ grid-template-columns:repeat(2,1fr); } }
        .meta-card { background:#fff; border:1px solid #E2E8F0; border-radius:8px; padding:12px 14px; }
        .meta-label { display:flex; align-items:center; gap:5px; font-size:0.72rem; color:#94A3B8; text-transform:uppercase; letter-spacing:0.05em; font-weight:500; margin-bottom:5px; }
        .meta-value { font-size:0.875rem; font-weight:600; color:#0F172A; }
        .meta-value-blue { font-size:0.78rem; font-weight:500; color:#2563EB; word-break:break-all; font-family:monospace; }
        .show-body { padding:24px; }
        .thumb-wrap { margin-bottom:24px; }
        .thumb-img { width:100%; max-height:400px; object-fit:cover; border-radius:10px; border:1px solid #E2E8F0; display:block; }
        .content-area { font-size:0.9rem; color:#334155; line-height:1.8; white-space:pre-wrap; text-align:justify; }
        .detail-section { margin-top:24px; padding-top:24px; border-top:1px solid #F1F5F9; }
        .detail-section-title { font-size:0.8rem; font-weight:600; color:#94A3B8; text-transform:uppercase; letter-spacing:0.05em; margin:0 0 14px; }
        .detail-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        @media(max-width:600px){ .detail-grid{ grid-template-columns:1fr; } }
        .detail-item-label { font-size:0.75rem; color:#94A3B8; text-transform:uppercase; letter-spacing:0.04em; font-weight:500; margin-bottom:4px; display:flex; align-items:center; gap:5px; }
        .detail-item-value { font-size:0.875rem; color:#334155; }
        .show-footer { display:flex; align-items:center; justify-content:flex-end; gap:10px; padding:16px 24px; border-top:1px solid #F1F5F9; background:#F8FAFC; }
        .btn-back { padding:9px 20px; border:1px solid #E2E8F0; border-radius:8px; background:#fff; font-size:0.875rem; font-weight:500; color:#475569; text-decoration:none; display:inline-flex; align-items:center; transition:all 0.15s; }
        .btn-back:hover { background:#F8FAFC; border-color:#CBD5E1; }
      `}</style>

      <div className="show-page">
        <div className="breadcrumb">
          <Link href={route('news.index')} className="breadcrumb-link">
            <ArrowLeftIcon style={{ width: 15, height: 15 }} />
            Kembali ke Daftar Berita
          </Link>
        </div>

        <div className="show-card">
          {/* Hero / Header */}
          <div className="show-hero">
            <div className="badges-row">
              <span className="cat-badge" style={{ backgroundColor: news.category_color || '#64748B' }}>
                {news.category_name}
              </span>
              {news.is_featured && (
                <span className="featured-badge"><Star size={12} />Unggulan</span>
              )}
              <span className={statusConfig[news.status]?.cls || 'status-draft'}>
                {statusConfig[news.status]?.label || news.status}
              </span>
            </div>

            <h1 className="show-title">{news.title}</h1>
            {news.excerpt && <p className="show-excerpt">{news.excerpt}</p>}

            <div className="meta-grid">
              <div className="meta-card">
                <div className="meta-label"><User size={11} />Penulis</div>
                <div className="meta-value">{news.user_name}</div>
              </div>
              <div className="meta-card">
                <div className="meta-label"><Calendar size={11} />Dibuat</div>
                <div className="meta-value">{formatDateShort(news.created_at)}</div>
              </div>
              <div className="meta-card">
                <div className="meta-label"><Eye size={11} />Views</div>
                <div className="meta-value">{news.views_count}</div>
              </div>
              <div className="meta-card">
                <div className="meta-label"><Hash size={11} />Slug</div>
                <div className="meta-value-blue">{news.slug}</div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="show-body">
            {news.thumbnail && (
              <div className="thumb-wrap">
                <img src={`/storage/${news.thumbnail}`} alt={news.title} className="thumb-img" />
              </div>
            )}

            <div className="content-area">{news.content}</div>

            {/* Informasi Tambahan */}
            <div className="detail-section">
              <p className="detail-section-title">Informasi Tambahan</p>
              <div className="detail-grid">
                <div>
                  <div className="detail-item-label"><Calendar size={11} />Tanggal Publikasi</div>
                  <div className="detail-item-value">{formatDateFull(news.published_at)}</div>
                </div>
                <div>
                  <div className="detail-item-label"><Clock size={11} />Terakhir Diperbarui</div>
                  <div className="detail-item-value">{formatDatetime(news.updated_at)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="show-footer">
            <Link href={route('news.index')} className="btn-back">Kembali</Link>
            <Link href={route('news.edit', news.id)} className="btn-edit">
              <Edit2 size={15} />
              Edit Berita
            </Link>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}