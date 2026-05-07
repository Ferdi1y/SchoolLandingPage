import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { Newspaper, Info, X } from 'lucide-react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

const formStyles = `
  .form-page { padding:24px; }
  .breadcrumb { display:flex; align-items:center; gap:8px; margin-bottom:20px; }
  .breadcrumb-link { display:inline-flex; align-items:center; gap:6px; font-size:0.875rem; color:#2563EB; text-decoration:none; font-weight:500; }
  .breadcrumb-link:hover { color:#1D4ED8; }
  .form-card { background:#fff; border:1px solid #E2E8F0; border-radius:12px; overflow:hidden; }
  .form-card-header { padding:20px 24px; border-bottom:1px solid #F1F5F9; background:#F8FAFC; }
  .form-card-title { font-size:1rem; font-weight:600; color:#0F172A; margin:0; display:flex; align-items:center; gap:10px; }
  .form-card-icon { width:32px; height:32px; background:#EFF6FF; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#2563EB; flex-shrink:0; }
  .form-body { padding:24px; }
  .form-section { margin-bottom:20px; }
  .form-label { font-size:0.875rem; font-weight:500; color:#374151; display:block; margin-bottom:7px; }
  .form-label .req { color:#EF4444; margin-left:2px; }
  .form-input { width:100%; padding:9px 13px; border:1px solid #E2E8F0; border-radius:8px; font-size:0.875rem; color:#0F172A; outline:none; transition:all 0.15s; background:#FAFAFA; box-sizing:border-box; }
  .form-input:focus { border-color:#2563EB; background:#fff; box-shadow:0 0 0 3px rgba(37,99,235,0.08); }
  .form-textarea { width:100%; padding:9px 13px; border:1px solid #E2E8F0; border-radius:8px; font-size:0.875rem; color:#0F172A; outline:none; transition:all 0.15s; background:#FAFAFA; box-sizing:border-box; resize:vertical; line-height:1.6; }
  .form-textarea:focus { border-color:#2563EB; background:#fff; box-shadow:0 0 0 3px rgba(37,99,235,0.08); }
  .form-textarea.mono { font-family:monospace; font-size:0.82rem; }
  .form-hint { font-size:0.75rem; color:#94A3B8; margin-top:5px; }
  .form-hint code { color:#2563EB; background:#EFF6FF; padding:1px 5px; border-radius:4px; font-size:0.78rem; }
  .form-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  @media(max-width:600px){ .form-grid-2{ grid-template-columns:1fr; } }
  .upload-zone { border:1.5px dashed #CBD5E1; border-radius:10px; padding:20px; transition:border-color 0.15s; }
  .upload-zone:hover { border-color:#93C5FD; }
  .upload-center { display:flex; flex-direction:column; align-items:center; gap:6px; margin-bottom:12px; }
  .upload-icon { color:#CBD5E1; }
  .upload-text { font-size:0.875rem; color:#64748B; }
  .upload-hint { font-size:0.75rem; color:#94A3B8; }
  .upload-preview { display:block; max-width:200px; max-height:140px; border-radius:8px; margin:0 auto 10px; border:1px solid #E2E8F0; object-fit:cover; }
  .upload-change-text { text-align:center; font-size:0.8rem; color:#64748B; margin-bottom:10px; }
  .file-input { width:100%; font-size:0.8rem; color:#64748B; cursor:pointer; }
  .checkbox-row { display:flex; align-items:center; gap:10px; padding:14px; background:#FAFAFA; border:1px solid #E2E8F0; border-radius:8px; cursor:pointer; transition:background 0.12s; }
  .checkbox-row:hover { background:#F0F9FF; border-color:#BAE6FD; }
  .checkbox-row input { width:16px; height:16px; accent-color:#2563EB; cursor:pointer; flex-shrink:0; }
  .checkbox-label { font-size:0.875rem; font-weight:500; color:#374151; cursor:pointer; }
  .info-box { display:flex; gap:12px; padding:14px 16px; border-radius:8px; border:1px solid; }
  .info-box-blue { background:#EFF6FF; border-color:#BFDBFE; }
  .info-box-amber { background:#FFFBEB; border-color:#FDE68A; }
  .info-box-icon-blue { color:#2563EB; flex-shrink:0; margin-top:1px; }
  .info-box-icon-amber { color:#D97706; flex-shrink:0; margin-top:1px; }
  .info-box-title { font-size:0.8rem; font-weight:600; color:#1E40AF; margin:0 0 6px; }
  .info-box-title-amber { font-size:0.8rem; font-weight:600; color:#92400E; margin:0 0 6px; }
  .info-box-list { list-style:disc; padding-left:14px; margin:0; }
  .info-box-list li { font-size:0.78rem; color:#1D4ED8; margin-bottom:3px; }
  .info-box-list-amber li { font-size:0.78rem; color:#92400E; margin-bottom:3px; }
  .form-footer { display:flex; align-items:center; justify-content:flex-end; gap:10px; padding:16px 24px; border-top:1px solid #F1F5F9; background:#F8FAFC; }
  .btn-cancel-form { padding:9px 20px; border:1px solid #E2E8F0; border-radius:8px; background:#fff; font-size:0.875rem; font-weight:500; color:#475569; text-decoration:none; cursor:pointer; transition:all 0.15s; display:inline-flex; align-items:center; }
  .btn-cancel-form:hover { background:#F8FAFC; border-color:#CBD5E1; }
  .btn-submit { padding:9px 22px; background:#2563EB; border:none; border-radius:8px; font-size:0.875rem; font-weight:500; color:#fff; cursor:pointer; transition:background 0.15s; }
  .btn-submit:hover { background:#1D4ED8; }
  .btn-submit:disabled { background:#94A3B8; cursor:not-allowed; }
  .page-header { display:flex; align-items:center; justify-content:space-between; gap:16px; }
  .page-header-left { display:flex; align-items:center; gap:14px; }
  .page-icon-wrap { width:40px; height:40px; background:#EFF6FF; border-radius:10px; display:flex; align-items:center; justify-content:center; color:#2563EB; flex-shrink:0; }
  .page-title { font-size:1.2rem; font-weight:600; color:#0F172A; margin:0; }
  .page-subtitle { font-size:0.8rem; color:#64748B; margin:0; }
`;

export default function NewsCreate({ categories }) {
  const { data, setData, post, processing, errors } = useForm({
    news_category_id: '',
    title: '',
    excerpt: '',
    content: '',
    thumbnail: null,
    status: 'draft',
    is_featured: false,
    published_at: '',
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData('thumbnail', file);
      const reader = new FileReader();
      reader.onload = (ev) => setThumbnailPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('news.store'));
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="page-header">
          <div className="page-header-left">
            <div className="page-icon-wrap">
              <Newspaper size={20} strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="page-title">Tambah Berita Baru</h1>
              <p className="page-subtitle">Buat dan publikasikan berita terbaru</p>
            </div>
          </div>
        </div>
      }
    >
      <Head title="Tambah Berita" />
      <style>{formStyles}</style>

      <div className="form-page">
        <div className="breadcrumb">
          <Link href={route('news.index')} className="breadcrumb-link">
            <ArrowLeftIcon style={{ width: 15, height: 15 }} />
            Kembali ke Daftar Berita
          </Link>
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-card">
            <div className="form-card-header">
              <div className="form-card-title">
                <div className="form-card-icon"><Newspaper size={15} /></div>
                Informasi Berita
              </div>
            </div>

            <div className="form-body">
              {/* Kategori */}
              <div className="form-section">
                <label className="form-label" htmlFor="news_category_id">Kategori <span className="req">*</span></label>
                <div style={{ position: 'relative' }}>
                  <select
                    id="news_category_id"
                    value={data.news_category_id}
                    onChange={(e) => setData('news_category_id', e.target.value)}
                    className="form-input"
                    style={{ appearance: 'none', paddingRight: 32 }}
                  >
                    <option value="">— Pilih Kategori —</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <span style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'#94A3B8' }}>▾</span>
                </div>
                <InputError message={errors.news_category_id} className="mt-2" />
              </div>

              {/* Judul */}
              <div className="form-section">
                <label className="form-label" htmlFor="title">Judul Berita <span className="req">*</span></label>
                <input
                  id="title"
                  type="text"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  className="form-input"
                  placeholder="Masukkan judul berita yang menarik..."
                />
                <InputError message={errors.title} className="mt-2" />
              </div>

              {/* Excerpt */}
              <div className="form-section">
                <label className="form-label" htmlFor="excerpt">Ringkasan <span style={{ color:'#94A3B8', fontWeight:400 }}>(opsional)</span></label>
                <textarea
                  id="excerpt"
                  value={data.excerpt}
                  onChange={(e) => setData('excerpt', e.target.value)}
                  rows="2"
                  maxLength="200"
                  className="form-textarea"
                  placeholder="Tulis ringkasan singkat berita (maks. 200 karakter)..."
                />
                <div className="form-hint">{data.excerpt.length}/200 karakter</div>
                <InputError message={errors.excerpt} className="mt-2" />
              </div>

              {/* Konten */}
              <div className="form-section">
                <label className="form-label" htmlFor="content">Konten <span className="req">*</span></label>
                <textarea
                  id="content"
                  value={data.content}
                  onChange={(e) => setData('content', e.target.value)}
                  rows="12"
                  className="form-textarea mono"
                  placeholder="Tulis konten berita lengkap di sini..."
                />
                <InputError message={errors.content} className="mt-2" />
              </div>

              {/* Thumbnail */}
              <div className="form-section">
                <label className="form-label" htmlFor="thumbnail">Thumbnail <span style={{ color:'#94A3B8', fontWeight:400 }}>(opsional)</span></label>
                <div className="upload-zone">
                  {thumbnailPreview ? (
                    <>
                      <img src={thumbnailPreview} alt="Preview" className="upload-preview" />
                      <p className="upload-change-text">Klik di bawah untuk mengganti gambar</p>
                    </>
                  ) : (
                    <div className="upload-center">
                      <PhotoIcon style={{ width: 36, height: 36 }} className="upload-icon" />
                      <p className="upload-text">Klik untuk unggah gambar thumbnail</p>
                    </div>
                  )}
                  <input
                    id="thumbnail"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif"
                    onChange={handleThumbnailChange}
                    className="file-input"
                  />
                  <p className="upload-hint">Format: JPEG, PNG, JPG, GIF · Maks. 2 MB</p>
                </div>
                <InputError message={errors.thumbnail} className="mt-2" />
              </div>

              {/* Status & Published At */}
              <div className="form-grid-2 form-section">
                <div>
                  <label className="form-label" htmlFor="status">Status <span className="req">*</span></label>
                  <div style={{ position: 'relative' }}>
                    <select
                      id="status"
                      value={data.status}
                      onChange={(e) => setData('status', e.target.value)}
                      className="form-input"
                      style={{ appearance: 'none', paddingRight: 32 }}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Dipublikasikan</option>
                      <option value="archived">Diarsipkan</option>
                    </select>
                    <span style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'#94A3B8' }}>▾</span>
                  </div>
                  <InputError message={errors.status} className="mt-2" />
                </div>
                <div>
                  <label className="form-label" htmlFor="published_at">Tanggal Publikasi <span style={{ color:'#94A3B8', fontWeight:400 }}>(opsional)</span></label>
                  <input
                    id="published_at"
                    type="datetime-local"
                    value={data.published_at}
                    onChange={(e) => setData('published_at', e.target.value)}
                    className="form-input"
                  />
                  <InputError message={errors.published_at} className="mt-2" />
                </div>
              </div>

              {/* Featured */}
              <div className="form-section">
                <label className="checkbox-row" htmlFor="is_featured">
                  <input
                    id="is_featured"
                    type="checkbox"
                    checked={data.is_featured}
                    onChange={(e) => setData('is_featured', e.target.checked)}
                  />
                  <span className="checkbox-label">⭐ Tandai sebagai Berita Unggulan</span>
                </label>
              </div>

              {/* Tips */}
              <div className="info-box info-box-blue">
                <Info size={16} className="info-box-icon-blue" />
                <div>
                  <p className="info-box-title">Tips membuat berita yang baik</p>
                  <ul className="info-box-list">
                    <li>Gunakan judul yang menarik dan deskriptif</li>
                    <li>Ringkasan akan tampil di halaman daftar berita</li>
                    <li>Tambahkan gambar untuk meningkatkan keterbacaan</li>
                    <li>Berita unggulan ditampilkan di posisi utama halaman</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="form-footer">
              <Link href={route('news.index')} className="btn-cancel-form">Batal</Link>
              <button type="submit" disabled={processing} className="btn-submit">
                {processing ? 'Menyimpan...' : 'Simpan Berita'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}