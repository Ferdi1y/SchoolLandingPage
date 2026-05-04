<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AchievementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'level' => 'required|in:sekolah,kecamatan,kabupaten,provinsi,nasional,internasional',
            'category' => 'required|in:akademik,olahraga,seni,keagamaan, lainnya',
            'rank' => 'required|in:Juara 1,Juara 2,Juara 3,Harapan 1,Harapan 2,Finalis,Peserta Terbaik',
            'participant_name' => 'nullable|string|max:255',
            'achievement_date' => 'required|date',
            'academic_year' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'is_featured' => 'boolean'
        ];
    }

    public function messages(): array
    {
        return [
            'level.in' => 'Level harus salah satu dari: sekolah, kecamatan, kabupaten, provinsi, nasional, internasional',
            'category.in' => 'Category harus salah satu dari: akademik, olahraga, seni, keagamaan, lainnya',
            'rank.in' => 'Rank harus salah satu dari: Juara 1, Juara 2, Juara 3, Harapan 1, Harapan 2, Finalis, Peserta Terbaik',
        ];
    }
}