<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\NewsCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Http\Requests\NewsUpdateRequest;
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
    try {
        $validated = $request->validate([
            'news_category_id' => 'required|exists:news_categories,id',
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:200',
            'content' => 'required|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|in:draft,published,archived',
            'is_featured' => 'nullable|boolean',
            'published_at' => 'nullable|date',
        ]);

        // Boolean handling
        $validated['is_featured'] = $request->boolean('is_featured');

        // Slug unik
        $slug = Str::slug($validated['title']);
        $count = DB::table('news')->where('slug', 'like', "$slug%")->count();
        $validated['slug'] = $count ? "{$slug}-{$count}" : $slug;

        // User login
        $validated['user_id'] = auth()->id();

        // Upload thumbnail
        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')
                ->store('news/thumbnails', 'public');
        }

        // Auto publish date
        if ($validated['status'] === 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        // Timestamp manual
        $validated['created_at'] = now();
        $validated['updated_at'] = now();

        DB::table('news')->insert($validated);

        return redirect()->route('news.index')
            ->with('success', 'Berita berhasil ditambahkan');

    } catch (\Throwable $e) {

        // Log error (penting buat debugging)
        Log::error('Gagal tambah berita', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return redirect()->back()
            ->withInput()
            ->with('error', 'Terjadi kesalahan saat menyimpan data');
    }
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
       public function update(NewsUpdateRequest $request, string $id)
    {
        try {
            // Cek apakah berita exists
            $news = DB::table('news')
                ->where('id', $id)
                ->whereNull('deleted_at')
                ->first();
 
            if (!$news) {
                return redirect()
                    ->route('news.index')
                    ->with('error', 'Berita tidak ditemukan');
            }
 
            // Ambil data yang sudah divalidasi
            $validated = $request->validated();
 
            // Logika slug: hanya update jika title berubah
            if ($request->title !== $news->title) {
                $validated['slug'] = Str::slug($request->title);
            } else {
                // Jika title tidak berubah, gunakan slug lama
                $validated['slug'] = $news->slug;
            }
 
            // Handle thumbnail upload HANYA jika ada file baru
            if ($request->hasFile('thumbnail')) {
                $file = $request->file('thumbnail');
 
                // Validasi ulang file (security)
                if (!$file->isValid()) {
                    return redirect()
                        ->back()
                        ->withInput()
                        ->with('error', 'File tidak valid. Silakan coba lagi.');
                }
 
                // Hapus file lama jika ada
                if ($news->thumbnail && Storage::disk('public')->exists($news->thumbnail)) {
                    Storage::disk('public')->delete($news->thumbnail);
                }
 
                // Store file baru
                $path = $file->store('news/thumbnails', 'public');
                $validated['thumbnail'] = $path;
            } else {
                // Jika tidak ada file baru, JANGAN ubah thumbnail
                unset($validated['thumbnail']);
            }
 
            // Update timestamp
            $validated['updated_at'] = now();
 
            // Lakukan update
            DB::table('news')
                ->where('id', $id)
                ->update($validated);
 
            return redirect()
                ->route('news.index')
                ->with('success', 'Berita berhasil diperbarui!');
 
        } catch (\Throwable $e) {
            Log::error('Gagal update berita ID: ' . $id, [
                'error'   => $e->getMessage(),
                'trace'   => $e->getTraceAsString(),
                'file'    => $e->getFile(),
                'line'    => $e->getLine(),
            ]);
 
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
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
    public function getBerita(){
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
            ->get();

        return response()->json($news);
    }

    public function showberita($slug)
    {
        // Query builder untuk mengambil detail news berdasarkan slug
        $news = DB::table('news')
            ->join('users', 'news.user_id', '=', 'users.id')
            ->join('news_categories', 'news.news_category_id', '=', 'news_categories.id')
            ->select(
                'news.*',
                'users.name as user_name',
                'news_categories.name as category_name',
                'news_categories.color as category_color'
            )
            ->where('news.slug', $slug)
            ->whereNull('news.deleted_at')
            ->first();
        
        if (!$news) {
            abort(404);
        }
        // Increment views menggunakan query builder
        DB::table('news')
            ->where('id', $news->id)
            ->increment('views_count');

        return Inertia::render('showBerita', [
            'news' => $news
        ]);
    }
}