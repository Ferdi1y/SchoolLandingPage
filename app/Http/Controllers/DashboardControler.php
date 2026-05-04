<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Stat cards
        $stats = [
            'total'     => News::count(),
            'published' => News::where('status', 'published')->count(),
            'draft'     => News::where('status', 'draft')->count(),
            'archived'  => News::where('status', 'archived')->count(),
            'featured'  => News::where('is_featured', true)->count(),
            'views'     => News::sum('views_count'),
        ];

        // 8 berita terbaru beserta kategori
        $recentNews = News::with('category:id,name')
            ->latest()
            ->take(8)
            ->get(['id', 'news_category_id', 'title', 'status', 'is_featured', 'views_count', 'published_at', 'created_at']);

        // 5 berita terpopuler
        $topNews = News::orderByDesc('views_count')
            ->take(5)
            ->get(['id', 'title', 'views_count']);

        return Inertia::render('Dashboard', [
            'stats'      => $stats,
            'recentNews' => $recentNews,
            'topNews'    => $topNews,
        ]);
    }
}