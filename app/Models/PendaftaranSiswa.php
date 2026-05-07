<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PendaftaranSiswa extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'pendaftaran_siswa';

    protected $primaryKey = 'id';

    protected $fillable = [
        'nomor_pendaftaran',
        'tahun_ajaran',
        'nama_lengkap',
        'nisn',
        'nik',
        'tempat_lahir',
        'tanggal_lahir',
        'jenis_kelamin',
        'anak_ke',
        'jumlah_saudara',
        'alamat_lengkap',
        'rt',
        'rw',
        'kelurahan',
        'kecamatan',
        'kota_kabupaten',
        'provinsi',
        'kode_pos',
        'no_hp_siswa',
        'email',
        'nama_ayah',
        'pekerjaan_ayah',
        'pendidikan_ayah',
        'no_hp_ayah',
        'nama_ibu',
        'pekerjaan_ibu',
        'pendidikan_ibu',
        'no_hp_ibu',
        'nama_wali',
        'hubungan_wali',
        'no_hp_wali',
        'asal_sekolah',
        'alamat_sekolah',
        'tahun_lulus',
        'alasan_memilih_sekolah',
        'prestasi',
        'status',
        'foto_3x4',
        'ijazah',
        'kk',
        'akta_kelahiran',
        'verified_by',
        'tanggal_verifikasi',
        'catatan',
    ];

    protected $casts = [
        'tanggal_lahir'      => 'date',
        'tahun_lulus'        => 'integer',
        'tanggal_verifikasi' => 'datetime',
        'anak_ke'            => 'integer',
        'jumlah_saudara'     => 'integer',
        'tanggal_daftar'     => 'datetime',
        'created_at'         => 'datetime',
        'updated_at'         => 'datetime',
        'deleted_at'         => 'datetime',
    ];

    // Relationship
    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    // Scope
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeDiterima($query)
    {
        return $query->where('status', 'diterima');
    }

    // Accessor
    public function getFullAddressAttribute()
    {
        return "{$this->alamat_lengkap}, RT {$this->rt}/RW {$this->rw}, {$this->kelurahan}, {$this->kecamatan}, {$this->kota_kabupaten}";
    }
}