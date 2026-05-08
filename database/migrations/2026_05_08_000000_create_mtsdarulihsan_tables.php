<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // ============================================
        // 1. achievements
        // ============================================
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('photo')->nullable();
            $table->enum('level', ['sekolah', 'kecamatan', 'kabupaten', 'provinsi', 'nasional', 'internasional'])->default('sekolah');
            $table->enum('category', ['akademik', 'olahraga', 'seni', 'keagamaan', 'lainnya'])->default('akademik');
            $table->enum('rank', ['Juara 1', 'Juara 2', 'Juara 3', 'Harapan 1', 'Harapan 2', 'Finalis', 'Peserta Terbaik'])->default('Juara 1');
            $table->string('participant_name')->nullable();
            $table->date('achievement_date');
            $table->integer('academic_year')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->timestamps();

            $table->index(['is_featured', 'achievement_date']);
        });

        // ============================================
        // 2. cache
        // ============================================
        Schema::create('cache', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->mediumText('value');
            $table->integer('expiration');

            $table->index('expiration');
        });

        // ============================================
        // 3. cache_locks
        // ============================================
        Schema::create('cache_locks', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->string('owner');
            $table->integer('expiration');

            $table->index('expiration');
        });

        // ============================================
        // 4. failed_jobs
        // ============================================
        Schema::create('failed_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique();
            $table->text('connection');
            $table->text('queue');
            $table->longText('payload');
            $table->longText('exception');
            $table->timestamp('failed_at')->useCurrent();
        });

        // ============================================
        // 5. gallery_categories
        // ============================================
        Schema::create('gallery_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable();
            $table->date('event_date')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // ============================================
        // 6. galleries
        // ============================================
        Schema::create('galleries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gallery_category_id')->constrained('gallery_categories')->cascadeOnDelete();
            $table->enum('type', ['photo', 'video'])->default('photo');
            $table->string('title')->nullable();
            $table->string('file_path')->nullable();
            $table->string('video_url')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('file_size')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('gallery_category_id');
        });

        // ============================================
        // 7. jobs
        // ============================================
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('queue');
            $table->longText('payload');
            $table->unsignedTinyInteger('attempts')->default(0);
            $table->unsignedInteger('reserved_at')->nullable();
            $table->unsignedInteger('available_at');
            $table->unsignedInteger('created_at');

            $table->index('queue');
            $table->index('reserved_at');
            $table->index('available_at');
        });

        // ============================================
        // 8. job_batches
        // ============================================
        Schema::create('job_batches', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->integer('total_jobs');
            $table->integer('pending_jobs');
            $table->integer('failed_jobs');
            $table->longText('failed_job_ids')->nullable();
            $table->mediumText('options')->nullable();
            $table->integer('cancelled_at')->nullable();
            $table->integer('created_at');
            $table->integer('finished_at')->nullable();
        });

        // ============================================
        // 9. migrations (biasanya sudah dibuat Laravel)
        // ============================================
        if (!Schema::hasTable('migrations')) {
            Schema::create('migrations', function (Blueprint $table) {
                $table->increments('id');
                $table->string('migration');
                $table->integer('batch');
            });
        }

        // ============================================
        // 10. personal_access_tokens
        // ============================================
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable'); // tokenable_type + tokenable_id + index
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });

        // ============================================
        // 11. school_profiles
        // ============================================
        Schema::create('school_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('npsn', 20)->nullable();
            $table->string('nss', 20)->nullable();
            $table->string('accreditation', 5)->nullable();
            $table->integer('established_year')->nullable();
            $table->string('principal_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('website')->nullable();
            $table->text('address')->nullable();
            $table->string('village')->nullable();
            $table->string('district')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('postal_code', 10)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->text('vision')->nullable();
            $table->text('mission')->nullable();
            $table->text('history')->nullable();
            $table->string('logo')->nullable();
            $table->string('banner_image')->nullable();
            $table->timestamps();
        });

        // ============================================
        // 12. school_statistics
        // ============================================
        Schema::create('school_statistics', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('value');
            $table->string('icon')->nullable();
            $table->string('color', 20)->default('#3B82F6');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // ============================================
        // 13. sessions
        // ============================================
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        // ============================================
        // 14. tahun_ajaran
        // ============================================
        Schema::create('tahun_ajaran', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nama', 10);
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });

        // ============================================
        // 15. users
        // ============================================
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });
        Schema::create('news_categories', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('slug')->unique();

            $table->string('color', 20)->default('#3B82F6');

            $table->integer('sort_order')->default(0);

            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });

        Schema::create('news', function (Blueprint $table) {
            $table->id();

            $table->foreignId('news_category_id')
                ->constrained('news_categories')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('title');

            $table->string('slug')->unique();

            $table->string('excerpt')->nullable();

            $table->longText('content');

            $table->string('thumbnail')->nullable();

            $table->enum('status', [
                'draft',
                'published',
                'archived'
            ])->default('draft');

            $table->boolean('is_featured')->default(false);

            $table->unsignedBigInteger('views_count')->default(0);

            $table->timestamp('published_at')->nullable();

            $table->timestamps();

            $table->softDeletes();

            $table->index('status');
            $table->index('is_featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop dalam urutan terbalik (perhatikan foreign key)
        Schema::dropIfExists('users');
        Schema::dropIfExists('tahun_ajaran');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('school_statistics');
        Schema::dropIfExists('school_profiles');
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('migrations');
        Schema::dropIfExists('job_batches');
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('galleries');
        Schema::dropIfExists('gallery_categories');
        Schema::dropIfExists('failed_jobs');
        Schema::dropIfExists('cache_locks');
        Schema::dropIfExists('cache');
        Schema::dropIfExists('achievements');
        Schema::dropIfExists('news_categories');
        Schema::dropIfExists('news');
    }
};
