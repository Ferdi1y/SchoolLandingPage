<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
     public function up(): void
    {
        // ─── Tabel Kategori Berita ────────────────────────────────────────────
        Schema::create('news_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Nama kategori, contoh: Kegiatan, Prestasi, Pengumuman');
            $table->string('slug')->unique()->comment('URL-friendly name');
            $table->string('color', 20)->default('#3B82F6')->comment('Warna badge kategori (HEX)');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
 
        // ─── Tabel Berita / Artikel ───────────────────────────────────────────
        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->foreignId('news_category_id')
                ->constrained('news_categories')
                ->restrictOnDelete();
            $table->foreignId('user_id')
                ->constrained('users')
                ->restrictOnDelete()
                ->comment('Admin yang membuat berita');
            $table->string('title')->comment('Judul berita');
            $table->string('slug')->unique()->comment('URL-friendly title');
            $table->string('excerpt')->nullable()->comment('Ringkasan singkat (untuk preview card)');
            $table->longText('content')->comment('Isi berita lengkap (HTML/Markdown)');
            $table->string('thumbnail')->nullable()->comment('Gambar thumbnail/cover berita');
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->boolean('is_featured')->default(false)->comment('Ditampilkan di halaman utama?');
            $table->unsignedBigInteger('views_count')->default(0);
            $table->timestamp('published_at')->nullable()->comment('Waktu publikasi (bisa dijadwalkan)');
            $table->timestamps();
            $table->softDeletes();
 
            // Indexes untuk query yang sering digunakan
            $table->index(['status', 'published_at']);
            $table->index('is_featured');
        });
    }
 
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news');
        Schema::dropIfExists('news_categories');
    }
};
 