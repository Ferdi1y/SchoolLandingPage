<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TahunAjaran extends Model
{
    protected $table = 'tahun_ajaran';

    // Timestamp diaktifkan karena tabel sudah punya created_at & updated_at
    public $timestamps = true;

    protected $fillable = [
        'nama',
        'tanggal_mulai',
        'tanggal_selesai',
        'is_active'
    ];

    protected $casts = [
        'tanggal_mulai'   => 'date',
        'tanggal_selesai' => 'date',
        'is_active'       => 'boolean',
    ];

    public function pendaftaranSiswa()
    {
        return $this->hasMany(PendaftaranSiswa::class, 'tahun_ajaran', 'nama');
    }
}