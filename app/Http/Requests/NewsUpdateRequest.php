<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
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
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $newsId = $this->route('news'); // pastikan route pakai {news}
          return [
            'news_category_id' => 'required|exists:news_categories,id',
            'user_id'          => 'required|exists:users,id',
            'title'            => 'required|string|max:255',
            'slug'             => 'required|string|max:255|unique:news,slug,' . $newsId,
            'excerpt'          => 'nullable|string|max:500',
            'content'          => 'required|string',
            'thumbnail'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'status'           => 'required|in:draft,published',
            'is_featured'      => 'nullable|boolean',
            'views_count'      => 'nullable|integer|min:0',
            'published_at'     => 'nullable|date',
        ];
    }
}
