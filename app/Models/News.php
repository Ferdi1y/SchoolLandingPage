<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class News extends Model
{
    use SoftDeletes;

    protected $table = 'news'; // sesuaikan kalau nama tabel beda

    protected $fillable = [
        'news_category_id',
        'user_id',
        'title',
        'slug',
        'excerpt',
        'content',
        'thumbnail',
        'status',
        'is_featured',
        'views_count',
        'published_at',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'views_count' => 'integer',
        'published_at' => 'datetime',
    ];

    // ================= RELATION =================

    public function category()
    {
        return $this->belongsTo(NewsCategory::class, 'news_category_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}