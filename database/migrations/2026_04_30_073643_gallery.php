<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Tabel kategori galeri dan tabel item galeri (foto & video).
     */
    public function up(): void
    {
        // ─── Tabel Kategori Galeri ────────────────────────────────────────────
        Schema::create('gallery_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Nama album/kategori, contoh: PHBI, Olahraga, Wisuda');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable()->comment('Gambar cover album');
            $table->date('event_date')->nullable()->comment('Tanggal kegiatan/event');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // ─── Tabel Item Galeri ────────────────────────────────────────────────
        Schema::create('galleries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gallery_category_id')
                ->constrained('gallery_categories')
                ->cascadeOnDelete()
                ->comment('Album tempat foto/video ini berada');
            $table->enum('type', ['photo', 'video'])->default('photo');
            $table->string('title')->nullable()->comment('Judul/caption foto atau video');
            $table->string('file_path')->nullable()->comment('Path file foto (untuk type=photo)');
            $table->string('video_url')->nullable()->comment('URL YouTube/Vimeo (untuk type=video)');
            $table->string('thumbnail')->nullable()->comment('Thumbnail video atau versi kecil foto');
            $table->string('file_size')->nullable()->comment('Ukuran file, contoh: 1.2 MB');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('galleries');
        Schema::dropIfExists('gallery_categories');
    }
};