import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeftIcon,
    PhotoIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function NewsCreate({ categories }) {
    const { data, setData, post, processing, errors, reset } = useForm({
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
            reader.onload = (event) => {
                setThumbnailPreview(event.target.result);
            };
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
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Tambah Berita Baru
                    </h2>
                </div>
            }
        >
            <Head title="Tambah Berita" />

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

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            {/* Kategori */}
                            <div className="mb-6">
                                <InputLabel htmlFor="news_category_id">
                                    Kategori <span className="text-red-500">*</span>
                                </InputLabel>
                                <select
                                    id="news_category_id"
                                    value={data.news_category_id}
                                    onChange={(e) =>
                                        setData('news_category_id', e.target.value)
                                    }
                                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">-- Pilih Kategori --</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.news_category_id}
                                    className="mt-2"
                                />
                            </div>

                            {/* Title */}
                            <div className="mb-6">
                                <InputLabel htmlFor="title">
                                    Judul <span className="text-red-500">*</span>
                                </InputLabel>
                                <TextInput
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="mt-2 w-full"
                                    placeholder="Masukkan judul berita"
                                    required
                                />
                                <InputError
                                    message={errors.title}
                                    className="mt-2"
                                />
                            </div>

                            {/* Excerpt */}
                            <div className="mb-6">
                                <InputLabel htmlFor="excerpt">
                                    Ringkasan (Opsional)
                                </InputLabel>
                                <textarea
                                    id="excerpt"
                                    value={data.excerpt}
                                    onChange={(e) => setData('excerpt', e.target.value)}
                                    rows="2"
                                    maxLength="200"
                                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Masukkan ringkasan berita (maksimal 200 karakter)"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {data.excerpt.length}/200 karakter
                                </p>
                                <InputError
                                    message={errors.excerpt}
                                    className="mt-2"
                                />
                            </div>

                            {/* Content */}
                            <div className="mb-6">
                                <InputLabel htmlFor="content">
                                    Konten <span className="text-red-500">*</span>
                                </InputLabel>
                                <textarea
                                    id="content"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    rows="10"
                                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                    placeholder="Masukkan konten berita lengkap"
                                    required
                                />
                                <InputError
                                    message={errors.content}
                                    className="mt-2"
                                />
                            </div>

                            {/* Thumbnail */}
                            <div className="mb-6">
                                <InputLabel htmlFor="thumbnail">
                                    Thumbnail (Opsional)
                                </InputLabel>
                                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6">
                                    {thumbnailPreview ? (
                                        <div className="mb-4">
                                            <img
                                                src={thumbnailPreview}
                                                alt="Preview"
                                                className="max-w-xs max-h-48 rounded-lg mx-auto"
                                            />
                                            <p className="text-center text-sm text-gray-600 mt-2">
                                                Klik di bawah untuk mengubah gambar
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-600">
                                                Klik untuk upload gambar
                                            </p>
                                        </div>
                                    )}
                                    <input
                                        id="thumbnail"
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg,image/gif"
                                        onChange={handleThumbnailChange}
                                        className="w-full cursor-pointer"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Format: JPEG, PNG, JPG, GIF. Ukuran maksimal: 2MB
                                    </p>
                                </div>
                                <InputError
                                    message={errors.thumbnail}
                                    className="mt-2"
                                />
                            </div>

                            {/* Status & Featured */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Status */}
                                <div>
                                    <InputLabel htmlFor="status">
                                        Status <span className="text-red-500">*</span>
                                    </InputLabel>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) =>
                                            setData('status', e.target.value)
                                        }
                                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">
                                            Dipublikasikan
                                        </option>
                                        <option value="archived">Diarsipkan</option>
                                    </select>
                                    <InputError
                                        message={errors.status}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Published At */}
                                <div>
                                    <InputLabel htmlFor="published_at">
                                        Tanggal Publikasi (Opsional)
                                    </InputLabel>
                                    <TextInput
                                        id="published_at"
                                        type="datetime-local"
                                        value={data.published_at}
                                        onChange={(e) =>
                                            setData('published_at', e.target.value)
                                        }
                                        className="mt-2 w-full"
                                    />
                                    <InputError
                                        message={errors.published_at}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            {/* Featured Checkbox */}
                            <div className="mb-6 flex items-center gap-3">
                                <input
                                    id="is_featured"
                                    type="checkbox"
                                    checked={data.is_featured}
                                    onChange={(e) =>
                                        setData('is_featured', e.target.checked)
                                    }
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded cursor-pointer"
                                />
                                <label
                                    htmlFor="is_featured"
                                    className="text-sm font-medium text-gray-700 cursor-pointer"
                                >
                                    Tandai sebagai Berita Unggulan ⭐
                                </label>
                            </div>

                            {/* Info Box */}
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex gap-3">
                                    <CheckCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-blue-800">
                                        <p className="font-medium mb-1">
                                            Tips Membuat Berita:
                                        </p>
                                        <ul className="list-disc list-inside space-y-1 text-xs">
                                            <li>
                                                Gunakan judul yang menarik dan deskriptif
                                            </li>
                                            <li>
                                                Ringkasan akan tampil di halaman daftar
                                            </li>
                                            <li>
                                                Tambahkan gambar untuk berita yang lebih
                                                menarik
                                            </li>
                                            <li>
                                                Berita unggulan akan ditampilkan di posisi
                                                utama
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 justify-end">
                                <Link
                                    href={route('news.index')}
                                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Berita'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}