import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon, PencilIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function NewsShow({ news }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Detail Berita
                    </h2>
                </div>
            }
        >
            <Head title={news.title} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-6 flex items-center gap-2 text-sm">
                        <Link
                            href={route('news.index')}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                            Kembali ke Berita
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-8 border-b border-gray-200">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span
                                            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                                            style={{
                                                backgroundColor: news.category_color,
                                            }}
                                        >
                                            {news.category_name}
                                        </span>
                                        {news.is_featured && (
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                                ⭐ Unggulan
                                            </span>
                                        )}
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                news.status === 'published'
                                                    ? 'bg-green-100 text-green-800'
                                                    : news.status === 'draft'
                                                      ? 'bg-gray-100 text-gray-800'
                                                      : 'bg-orange-100 text-orange-800'
                                            }`}
                                        >
                                            {news.status === 'published'
                                                ? '✓ Dipublikasikan'
                                                : news.status === 'draft'
                                                  ? '📝 Draft'
                                                  : '📦 Diarsipkan'}
                                        </span>
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        {news.title}
                                    </h1>
                                    <p className="text-gray-600 text-lg">
                                        {news.excerpt ||
                                            'Tidak ada ringkasan untuk berita ini'}
                                    </p>
                                </div>
                            </div>

                            {/* Meta Information */}
                            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                    <p className="text-xs text-gray-600 uppercase tracking-wider">
                                        Penulis
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 mt-1">
                                        {news.user_name}
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                    <p className="text-xs text-gray-600 uppercase tracking-wider">
                                        Dibuat
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 mt-1">
                                        {new Date(news.created_at).toLocaleDateString(
                                            'id-ID'
                                        )}
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                    <p className="text-xs text-gray-600 uppercase tracking-wider">
                                        Views
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 mt-1 flex items-center gap-1">
                                        <EyeIcon className="w-4 h-4" />
                                        {news.views_count}
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                    <p className="text-xs text-gray-600 uppercase tracking-wider">
                                        Slug
                                    </p>
                                    <p className="text-sm font-semibold text-blue-600 mt-1 truncate">
                                        {news.slug}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-8">
                            {/* Thumbnail */}
                            {news.thumbnail && (
                                <div className="mb-8">
                                    <img
                                        src={`/storage/${news.thumbnail}`}
                                        alt={news.title}
                                        className="w-full max-h-96 object-cover rounded-lg shadow-md"
                                    />
                                </div>
                            )}

                            {/* Main Content */}
                            <div className="prose prose-sm max-w-none mb-8">
                                <div className="text-gray-800 whitespace-pre-wrap leading-relaxed text-justify">
                                    {news.content}
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="border-t border-gray-200 pt-6 mt-8">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                                    Informasi Lainnya
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">
                                            Tanggal Publikasi
                                        </p>
                                        <p className="text-sm text-gray-900">
                                            {news.published_at
                                                ? new Date(
                                                    news.published_at
                                                ).toLocaleDateString('id-ID', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })
                                                : 'Belum ditentukan'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">
                                            Terakhir Diperbarui
                                        </p>
                                        <p className="text-sm text-gray-900">
                                            {new Date(news.updated_at).toLocaleDateString(
                                                'id-ID',
                                                {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                }
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer / Action Buttons */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-4 justify-end">
                            <Link
                                href={route('news.index')}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium"
                            >
                                Kembali
                            </Link>
                            <Link
                                href={route('news.edit', news.id)}
                                className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-medium flex items-center gap-2"
                            >
                                <PencilIcon className="w-4 h-4" />
                                Edit
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}