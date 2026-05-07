<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NewsUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        // Ambil ID dari route parameter
        $newsId = $this->route('news');

        return [
            'news_category_id' => 'required|exists:news_categories,id',
            'user_id'          => 'required|exists:users,id',
            'title'            => 'required|string|max:255',
            'slug'             => [
                'required',
                'string',
                'max:255',
                // Unique dengan exception ID yang sedang diedit
                "unique:news,slug,{$newsId},id,deleted_at,NULL"
            ],
            'excerpt'          => 'nullable|string|max:500',
            'content'          => 'required|string',
            // Penting: hanya validasi thumbnail jika ada file
            'thumbnail'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'status'           => 'required|in:draft,published,archived',
            'is_featured'      => 'nullable|boolean',
        ];
    }

    /**
     * Custom error messages
     */
    public function messages(): array
    {
        return [
            'news_category_id.required' => 'Kategori berita wajib dipilih.',
            'news_category_id.exists'   => 'Kategori yang dipilih tidak ditemukan.',
            'user_id.required'          => 'User ID wajib ada.',
            'user_id.exists'            => 'User tidak ditemukan.',
            'title.required'            => 'Judul berita tidak boleh kosong.',
            'title.max'                 => 'Judul maksimal 255 karakter.',
            'content.required'          => 'Konten berita wajib diisi.',
            'slug.unique'               => 'Slug ini sudah digunakan oleh berita lain.',
            'slug.required'             => 'Slug tidak boleh kosong.',
            'thumbnail.image'           => 'File harus berupa gambar.',
            'thumbnail.mimes'           => 'Format gambar hanya JPG, JPEG, PNG, WEBP.',
            'thumbnail.max'             => 'Ukuran file thumbnail maksimal 2 MB.',
            'status.in'                 => 'Status harus draft, published, atau archived.',
        ];
    }

    /**
     * Prepare data for validation
     */
    protected function prepareForValidation(): void
    {
        // Convert checkbox string to boolean
        if ($this->is_featured === 'false' || $this->is_featured === '') {
            $this->merge([
                'is_featured' => false,
            ]);
        } elseif ($this->is_featured === 'true' || $this->is_featured === '1') {
            $this->merge([
                'is_featured' => true,
            ]);
        }
    }
}