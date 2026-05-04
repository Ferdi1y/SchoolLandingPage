<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'photo',
        'level',
        'category',
        'rank',
        'participant_name',
        'achievement_date',
        'academic_year',
        'is_featured'
    ];

    protected $casts = [
        'achievement_date' => 'date',
        'academic_year' => 'integer',
        'is_featured' => 'boolean'
    ];

    // Accessor untuk level
    public function getLevelLabelAttribute()
    {
        $labels = [
            'sekolah' => 'Sekolah',
            'kecamatan' => 'Kecamatan',
            'kabupaten' => 'Kabupaten',
            'provinsi' => 'Provinsi',
            'nasional' => 'Nasional',
            'internasional' => 'Internasional'
        ];
        return $labels[$this->level] ?? $this->level;
    }

    // Accessor untuk category
    public function getCategoryLabelAttribute()
    {
        $labels = [
            'akademik' => 'Akademik',
            'olahraga' => 'Olahraga',
            'seni' => 'Seni',
            'keagamaan' => 'Keagamaan',
            'lainnya' => 'Lainnya'
        ];
        return $labels[$this->category] ?? $this->category;
    }

    // Scope untuk featured achievements
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    // Scope berdasarkan level
    public function scopeByLevel($query, $level)
    {
        return $query->where('level', $level);
    }

    // Scope berdasarkan category
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }
}