<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Tabel prestasi sekolah & statistik (untuk counter di Landing Page).
     */
    public function up(): void
    {
        // ─── Tabel Prestasi / Achievements ───────────────────────────────────
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->string('title')->comment('Nama prestasi, contoh: Juara 1 MTQ Kabupaten');
            $table->text('description')->nullable();
            $table->string('photo')->nullable()->comment('Foto piala/piagam/penerima');
            $table->enum('level', ['sekolah', 'kecamatan', 'kabupaten', 'provinsi', 'nasional', 'internasional'])
                ->comment('Tingkat kompetisi');
            $table->enum('category', ['akademik', 'olahraga', 'seni', 'keagamaan', 'lainnya'])
                ->default('akademik');
            $table->enum('rank', ['Juara 1', 'Juara 2', 'Juara 3', 'Harapan 1', 'Harapan 2', 'Finalis', 'Peserta Terbaik'])
                ->comment('Peringkat yang diraih');
            $table->string('participant_name')->nullable()->comment('Nama siswa/tim peraih prestasi');
            $table->date('achievement_date')->comment('Tanggal meraih prestasi');
            $table->year('academic_year')->nullable()->comment('Tahun ajaran, contoh: 2024');
            $table->boolean('is_featured')->default(false)->comment('Ditampilkan di landing page?');
            $table->timestamps();

            $table->index(['is_featured', 'achievement_date']);
        });

        // ─── Tabel Statistik / Counter ────────────────────────────────────────
        Schema::create('school_statistics', function (Blueprint $table) {
            $table->id();
            $table->string('label')->comment('Label counter, contoh: Total Siswa, Guru Berpengalaman');
            $table->string('value')->comment('Nilai, bisa string: "500+", "25", "10 Tahun"');
            $table->string('icon')->nullable()->comment('Nama ikon Lucide/Heroicons');
            $table->string('color', 20)->default('#3B82F6')->comment('Warna ikon (HEX)');
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
        Schema::dropIfExists('school_statistics');
        Schema::dropIfExists('achievements');
    }
};