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
        Schema::create('school_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Nama lengkap sekolah');
            $table->string('npsn', 20)->nullable()->comment('Nomor Pokok Sekolah Nasional');
            $table->string('nss', 20)->nullable()->comment('Nomor Statistik Sekolah');
            $table->string('accreditation', 5)->nullable()->comment('Akreditasi: A, B, C');
            $table->year('established_year')->nullable()->comment('Tahun berdiri');
            $table->string('principal_name')->nullable()->comment('Nama Kepala Sekolah');
            $table->string('email')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('website')->nullable();
            $table->text('address')->nullable();
            $table->string('village')->nullable()->comment('Kelurahan/Desa');
            $table->string('district')->nullable()->comment('Kecamatan');
            $table->string('city')->nullable()->comment('Kabupaten/Kota');
            $table->string('province')->nullable()->comment('Provinsi');
            $table->string('postal_code', 10)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->text('vision')->nullable()->comment('Visi sekolah');
            $table->longText('mission')->nullable()->comment('Misi sekolah (bisa multiple poin, JSON atau plain text)');
            $table->longText('history')->nullable()->comment('Sejarah singkat sekolah');
            $table->string('logo')->nullable()->comment('Path logo sekolah');
            $table->string('banner_image')->nullable()->comment('Path banner/foto utama sekolah');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
