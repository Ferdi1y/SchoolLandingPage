<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\NewsCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class NewsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Query builder untuk news dengan join ke users dan news_categories
        $news = DB::table('news')
            ->join('users', 'news.user_id', '=', 'users.id')
            ->join('news_categories', 'news.news_category_id', '=', 'news_categories.id')
            ->select(
                'news.*',
                'users.name as user_name',
                'news_categories.name as category_name',
                'news_categories.color as category_color'
            )
            ->whereNull('news.deleted_at') // Soft delete
            ->orderBy('news.created_at', 'desc')
            ->paginate(15);

        $categories = DB::table('news_categories')
            ->where('is_active', 1)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('News/Index', [
            'news' => $news,
            'categories' => $categories
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        try{
         // Query builder untuk mengambil semua kategori
        $categories = DB::table('news_categories')
            ->where('is_active', 1)
            ->orderBy('sort_order')
            ->get();
        
        return Inertia::render('News/Create', [
            'categories' => $categories
        ]);
        
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            abort(403, 'Unauthorized');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'news_category_id' => 'required|exists:news_categories,id',
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:200',
            'content' => 'required|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|in:draft,published,archived',
            'is_featured' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        // Auto-generate slug dari title
        $slug = Str::slug($validated['title']);
        
        // Set user_id dari user yang login
        $validated['user_id'] = auth()->id();
        $validated['slug'] = $slug;

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('news/thumbnails', 'public');
            $validated['thumbnail'] = $path;
        }

        // Insert menggunakan query builder
        $newsId = DB::table('news')->insertGetId($validated);

        return redirect()->route('news.index')
            ->with('success', 'Berita berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Query builder untuk mengambil detail news
        $news = DB::table('news')
            ->join('users', 'news.user_id', '=', 'users.id')
            ->join('news_categories', 'news.news_category_id', '=', 'news_categories.id')
            ->select(
                'news.*',
                'users.name as user_name',
                'news_categories.name as category_name',
                'news_categories.color as category_color'
            )
            ->where('news.id', $id)
            ->whereNull('news.deleted_at')
            ->first();
        
        if (!$news) {
            abort(404);
        }
        
        // Increment views menggunakan query builder
        DB::table('news')
            ->where('id', $id)
            ->increment('views_count');

        return Inertia::render('News/Show', [
            'news' => $news
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // Query builder untuk mengambil detail news
        $news = DB::table('news')
            ->where('id', $id)
            ->whereNull('deleted_at')
            ->first();
        
        if (!$news) {
            abort(404);
        }
        
        // Query builder untuk mengambil semua kategori
        $categories = DB::table('news_categories')
            ->where('is_active', 1)
            ->orderBy('sort_order')
            ->get();
        
        return Inertia::render('News/Edit', [
            'news' => $news,
            'categories' => $categories
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Cek apakah news exists
        $news = DB::table('news')
            ->where('id', $id)
            ->whereNull('deleted_at')
            ->first();
        
        if (!$news) {
            abort(404);
        }

        $validated = $request->validate([
            'news_category_id' => 'required|exists:news_categories,id',
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:200',
            'content' => 'required|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|in:draft,published,archived',
            'is_featured' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        // Update slug jika title berubah
        if ($request->title !== $news->title) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            // Hapus thumbnail lama
            if ($news->thumbnail) {
                Storage::disk('public')->delete($news->thumbnail);
            }
            
            $path = $request->file('thumbnail')->store('news/thumbnails', 'public');
            $validated['thumbnail'] = $path;
        }

        // Update menggunakan query builder
        DB::table('news')
            ->where('id', $id)
            ->update($validated);

        return redirect()->route('news.index')
            ->with('success', 'Berita berhasil diupdate');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Cek apakah news exists
        $news = DB::table('news')
            ->where('id', $id)
            ->whereNull('deleted_at')
            ->first();
        
        if (!$news) {
            abort(404);
        }
        
        // Hapus thumbnail jika ada
        if ($news->thumbnail) {
            Storage::disk('public')->delete($news->thumbnail);
        }

        // Soft delete menggunakan query builder
        DB::table('news')
            ->where('id', $id)
            ->update(['deleted_at' => now()]);

        return redirect()->route('news.index')
            ->with('success', 'Berita berhasil dihapus');
    }
}