import React, { useState, useMemo } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Edit2, Trash2, Eye, Plus, Search, ChevronDown, Loader2 } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function NewsIndex({ news, categories }) {
  const { flash } = usePage().props;
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedNews, setSelectedNews] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Show flash message on mount
  React.useEffect(() => {
    if (flash?.success) {
      // Toast notification logic (optional)
      console.log('Success:', flash.success);
    }
  }, [flash]);

  // Filter dan search logic
  const filteredNews = useMemo(() => {
    return news.data.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = !filterCategory || item.category_id.toString() === filterCategory;
      const matchStatus = !filterStatus || item.status === filterStatus;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [news.data, searchQuery, filterCategory, filterStatus]);

  // Handle checkbox untuk select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedNews(filteredNews.map(item => item.id));
    } else {
      setSelectedNews([]);
    }
  };

  // Handle single checkbox
  const handleSelectNews = (id) => {
    setSelectedNews(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Delete single news
  const handleDelete = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      setIsDeleting(true);
      router.delete(route('news.destroy', deleteConfirm), {
        onSuccess: () => {
          setIsDeleting(false);
          setDeleteConfirm(null);
        },
        onError: () => {
          setIsDeleting(false);
        }
      });
    }
  };

  // Delete bulk news
  const handleBulkDelete = () => {
    if (selectedNews.length > 0) {
      setDeleteConfirm('bulk');
    }
  };

  const confirmBulkDelete = () => {
    setIsDeleting(true);
    // Implement bulk delete route sesuai dengan backend Anda
    router.post(route('news.bulk-delete'), { ids: selectedNews }, {
      onSuccess: () => {
        setIsDeleting(false);
        setDeleteConfirm(null);
        setSelectedNews([]);
      },
      onError: () => {
        setIsDeleting(false);
      }
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-100 text-emerald-800';
      case 'draft':
        return 'bg-amber-100 text-amber-800';
      case 'archived':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  // Get status label
  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Find category name by id
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || '-';
  };

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Flash Message */}
          {flash?.success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-emerald-900">{flash.success}</p>
              </div>
              <button
                onClick={() => {}}
                className="text-emerald-400 hover:text-emerald-600"
              >
                ✕
              </button>
            </div>
          )}

          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Manajemen Berita</h1>
              <p className="text-slate-600 mt-1">Kelola semua berita dan artikel portal sekolah</p>
            </div>
            <Link
              href={route('news.create')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
              Tambah Berita Baru
            </Link>
          </div>

          {/* Search & Filter Section */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari judul berita..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all bg-white"
                >
                  <option value="">Semua Kategori</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all bg-white"
                >
                  <option value="">Semua Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
                <ChevronDown size={18} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedNews.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
              <p className="text-sm font-medium text-blue-900">
                {selectedNews.length} berita dipilih
              </p>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Hapus Dipilih
              </button>
            </div>
          )}

          {/* Data Table */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            {filteredNews.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-6 py-4 text-left">
                          <input
                            type="checkbox"
                            checked={selectedNews.length === filteredNews.length && filteredNews.length > 0}
                            onChange={handleSelectAll}
                            className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                          />
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Judul Berita</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Kategori</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Penulis</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Views</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Tanggal</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredNews.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedNews.includes(item.id)}
                              onChange={() => handleSelectNews(item.id)}
                              className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {item.thumbnail ? (
                                <img
                                  src={item.thumbnail}
                                  alt={item.title}
                                  className="w-8 h-8 rounded object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded bg-slate-200 flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">
                                  {item.title}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: item.category.color }}
                            >
                              {item.category.name}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-slate-700">{item.user.name}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-slate-900">
                              {item.views_count || 0}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {getStatusLabel(item.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-slate-600">
                              {formatDate(item.created_at)}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={route('news.show', item.id)}
                                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Lihat"
                              >
                                <Eye size={18} />
                              </Link>
                              <Link
                                href={route('news.edit', item.id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </Link>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Hapus"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {news.last_page > 1 && (
                  <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                      Menampilkan <span className="font-medium">{news.from}</span> hingga{' '}
                      <span className="font-medium">{news.to}</span> dari{' '}
                      <span className="font-medium">{news.total}</span> berita
                    </div>

                    <div className="flex items-center gap-2">
                      {news.current_page > 1 && (
                        <Link
                          href={news.first_page_url}
                          className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          Pertama
                        </Link>
                      )}

                      {news.prev_page_url && (
                        <Link
                          href={news.prev_page_url}
                          className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          ← Sebelumnya
                        </Link>
                      )}

                      <div className="flex items-center gap-1">
                        {Array.from({ length: news.last_page }, (_, i) => i + 1).map(page => (
                          <Link
                            key={page}
                            href={`${news.path}?page=${page}`}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              page === news.current_page
                                ? 'bg-blue-600 text-white'
                                : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {page}
                          </Link>
                        ))}
                      </div>

                      {news.next_page_url && (
                        <Link
                          href={news.next_page_url}
                          className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          Selanjutnya →
                        </Link>
                      )}

                      {news.current_page < news.last_page && (
                        <Link
                          href={news.last_page_url}
                          className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          Akhir
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="px-6 py-16 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Belum ada berita yang dibuat
                </h3>
                <p className="text-slate-600 mb-6 max-w-sm mx-auto">
                  Mulai buat berita baru untuk portal sekolah MTs Darul Ihsan Anda sekarang.
                </p>
                <Link
                  href={route('news.create')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <Plus size={20} />
                  Buat Berita Pertama
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 text-center mb-2">
                {deleteConfirm === 'bulk' ? 'Hapus Berita Terpilih?' : 'Hapus Berita?'}
              </h3>
              <p className="text-slate-600 text-center mb-6">
                {deleteConfirm === 'bulk'
                  ? `Anda akan menghapus ${selectedNews.length} berita. Tindakan ini tidak dapat dibatalkan.`
                  : 'Berita yang dihapus tidak dapat dipulihkan kembali.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={deleteConfirm === 'bulk' ? confirmBulkDelete : confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Menghapus...
                    </>
                  ) : (
                    'Hapus'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}