<?php

namespace App\Http\Controllers;

use App\Models\PendaftaranSiswa;
use App\Models\TahunAjaran;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class PendaftaranController extends Controller
{
    // ===================== USER SIDE (Calon Siswa / Orang Tua) =====================

    /**
     * Tampilkan Form Pendaftaran (User)
     */
    public function create()
    {
        $tahunAktif = TahunAjaran::where('is_active', true)->first();

        return Inertia::render('Pendaftaran/Create', [
            'tahun_ajaran' => $tahunAktif ? $tahunAktif->nama : null,
        ]);
    }

    /**
     * Simpan Pendaftaran Baru (User)
     */

    /**
     * Simpan Pendaftaran Baru (User)
     */
    public function store(Request $request)
{
// Validasi request
    $validated = $request->validate([
        'nama_lengkap'          => 'required|string|max:150',
        'nisn'                  => 'nullable|string|max:15|unique:pendaftaran_siswa,nisn',
        'nik'                   => 'nullable|string|max:20|unique:pendaftaran_siswa,nik',
        'tempat_lahir'          => 'required|string|max:100',
        'tanggal_lahir'         => 'required|date',
        'jenis_kelamin'         => 'required|in:L,P',
        'anak_ke'               => 'nullable|integer',
        'jumlah_saudara'        => 'nullable|integer',
        'alamat_lengkap'        => 'required|string',
        'rt'                    => 'nullable|string|max:5',
        'rw'                    => 'nullable|string|max:5',
        'kelurahan'             => 'required|string|max:100',
        'kecamatan'             => 'required|string|max:100',
        'kota_kabupaten'        => 'required|string|max:100',
        'provinsi'              => 'required|string|max:100',
        'kode_pos'              => 'nullable|string|max:10',
        'no_hp_siswa'           => 'nullable|string|max:20',
        'email'                 => 'nullable|email|max:100',
        'nama_ayah'             => 'nullable|string|max:150',
        'pekerjaan_ayah'        => 'nullable|string|max:100',
        'pendidikan_ayah'       => 'nullable|string|max:50',
        'no_hp_ayah'            => 'nullable|string|max:20',
        'nama_ibu'              => 'nullable|string|max:150',
        'pekerjaan_ibu'         => 'nullable|string|max:100',
        'pendidikan_ibu'        => 'nullable|string|max:50',
        'no_hp_ibu'             => 'nullable|string|max:20',
        'nama_wali'             => 'nullable|string|max:150',
        'hubungan_wali'         => 'nullable|string|max:50',
        'no_hp_wali'            => 'nullable|string|max:20',
        'asal_sekolah'          => 'required|string|max:150',
        'alamat_sekolah'        => 'nullable|string',
        'tahun_lulus'           => 'nullable|digits:4|integer',
        'alasan_memilih_sekolah'=> 'nullable|string',
        'prestasi'              => 'nullable|string',
        'foto_3x4'              => 'required|image|mimes:jpg,jpeg,png|max:2048',
        'ijazah'                => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
        'kk'                    => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
        'akta_kelahiran'        => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
    ]);

    // Ambil tahun ajaran aktif
    $tahunAjaran = DB::table('tahun_ajaran')
        ->where('is_active', 1)
        ->first();

    if (!$tahunAjaran) {
        return back()->withErrors(['error' => 'Tidak ada tahun ajaran aktif.']);
    }

    // Generate nomor pendaftaran
    $count = DB::table('pendaftaran_siswa')
        ->where('tahun_ajaran', $tahunAjaran->nama)
        ->count();

    $nomorPendaftaran = 'PSB-' . $tahunAjaran->nama . '-' . str_pad($count + 1, 4, '0', STR_PAD_LEFT);

    // Upload file
    $foto3x4       = $request->file('foto_3x4')->store('pendaftaran/foto', 'public');
    $ijazah        = $request->file('ijazah')->store('pendaftaran/ijazah', 'public');
    $kk            = $request->file('kk')->store('pendaftaran/kk', 'public');
    $aktaKelahiran = $request->file('akta_kelahiran')->store('pendaftaran/akta', 'public');

    // Insert menggunakan Query Builder
    $id = DB::table('pendaftaran_siswa')->insertGetId([
        'nomor_pendaftaran'      => $nomorPendaftaran,
        'tahun_ajaran'           => $tahunAjaran->nama,
        'nama_lengkap'           => $validated['nama_lengkap'],
        'nisn'                   => $validated['nisn'] ?? null,
        'nik'                    => $validated['nik'] ?? null,
        'tempat_lahir'           => $validated['tempat_lahir'],
        'tanggal_lahir'          => $validated['tanggal_lahir'],
        'jenis_kelamin'          => $validated['jenis_kelamin'],
        'anak_ke'                => $validated['anak_ke'] ?? null,
        'jumlah_saudara'         => $validated['jumlah_saudara'] ?? null,
        'alamat_lengkap'         => $validated['alamat_lengkap'],
        'rt'                     => $validated['rt'] ?? null,
        'rw'                     => $validated['rw'] ?? null,
        'kelurahan'              => $validated['kelurahan'],
        'kecamatan'              => $validated['kecamatan'],
        'kota_kabupaten'         => $validated['kota_kabupaten'],
        'provinsi'               => $validated['provinsi'],
        'kode_pos'               => $validated['kode_pos'] ?? null,
        'no_hp_siswa'            => $validated['no_hp_siswa'] ?? null,
        'email'                  => $validated['email'] ?? null,
        'nama_ayah'              => $validated['nama_ayah'] ?? null,
        'pekerjaan_ayah'         => $validated['pekerjaan_ayah'] ?? null,
        'pendidikan_ayah'        => $validated['pendidikan_ayah'] ?? null,
        'no_hp_ayah'             => $validated['no_hp_ayah'] ?? null,
        'nama_ibu'               => $validated['nama_ibu'] ?? null,
        'pekerjaan_ibu'          => $validated['pekerjaan_ibu'] ?? null,
        'pendidikan_ibu'         => $validated['pendidikan_ibu'] ?? null,
        'no_hp_ibu'              => $validated['no_hp_ibu'] ?? null,
        'nama_wali'              => $validated['nama_wali'] ?? null,
        'hubungan_wali'          => $validated['hubungan_wali'] ?? null,
        'no_hp_wali'             => $validated['no_hp_wali'] ?? null,
        'asal_sekolah'           => $validated['asal_sekolah'],
        'alamat_sekolah'         => $validated['alamat_sekolah'] ?? null,
        'tahun_lulus'            => $validated['tahun_lulus'] ?? null,
        'alasan_memilih_sekolah' => $validated['alasan_memilih_sekolah'] ?? null,
        'prestasi'               => $validated['prestasi'] ?? null,
        'status'                 => 'pending',
        'foto_3x4'               => $foto3x4,
        'ijazah'                 => $ijazah,
        'kk'                     => $kk,
        'akta_kelahiran'         => $aktaKelahiran,
        'tanggal_daftar'         => now(),
        'updated_at'             => now(),
    ]);
            Session::flash('nomor_pendaftaran', $nomorPendaftaran);

    
    return redirect()->route('pendaftaran.success', ['id' => $id])
        ->with('success', 'Pendaftaran berhasil dikirim!');
}
    /**
     * Halaman Sukses
     */
    public function success()
    {
        // Jika langsung akses /pendaftaran/sukses tanpa data session → redirect
        if (!session()->has('nomor_pendaftaran')) {
            return redirect()->route('home');
        }

        return Inertia::render('Pendaftaran/Success', [
            'nomor_pendaftaran' => session('nomor_pendaftaran'),
            'nama_lengkap'      => session('nama_lengkap'),
        ]);
    }


    // ===================== ADMIN SIDE =====================

    /**
     * Daftar Semua Pendaftaran (Admin)
     */
  // ===================== ADMIN SIDE =====================

/**
 * Daftar Semua Pendaftaran (Admin)
 */
public function index(Request $request)
{
    $query = DB::table('pendaftaran_siswa as p')
        ->leftJoin('users as u', 'p.verified_by', '=', 'u.id')
        ->select(
            'p.*',
            'u.name as verifier_name',
            'u.email as verifier_email'
        )
        ->whereNull('p.deleted_at')
        ->orderBy('p.tanggal_daftar', 'desc');

    // Filter status
    if ($request->filled('status') && $request->status !== 'all') {
        $query->where('p.status', $request->status);
    }

    // Filter tahun ajaran
    if ($request->filled('tahun_ajaran')) {
        $query->where('p.tahun_ajaran', $request->tahun_ajaran);
    }

    // Filter pencarian
    if ($request->filled('search')) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('p.nama_lengkap', 'like', "%{$search}%")
              ->orWhere('p.nomor_pendaftaran', 'like', "%{$search}%")
              ->orWhere('p.nisn', 'like', "%{$search}%");
        });
    }

    $pendaftaran = $query->paginate(15);

    return Inertia::render('Admin/Pendaftaran/Index', [
        'pendaftaran' => $pendaftaran,
        'filters'     => $request->only(['status', 'tahun_ajaran', 'search']),
    ]);
}

/**
 * Detail Pendaftaran (Admin)
 */
public function show($id)
{
    $pendaftaran = DB::table('pendaftaran_siswa as p')
        ->leftJoin('users as u', 'p.verified_by', '=', 'u.id')
        ->select(
            'p.*',
            'u.name as verifier_name',
            'u.email as verifier_email'
        )
        ->whereNull('p.deleted_at')
        ->where('p.id', $id)
        ->first();

    abort_if(is_null($pendaftaran), 404, 'Data pendaftaran tidak ditemukan.');

    return Inertia::render('Admin/Pendaftaran/Show', [
        'pendaftaran' => $pendaftaran,
    ]);
}

/**
 * Verifikasi / Update Status (Admin)
 */
public function verify(Request $request, $id)
{
    $request->validate([
        'status'  => 'required|in:diterima,ditolak,cadangan',
        'catatan' => 'nullable|string',
    ]);

    $exists = DB::table('pendaftaran_siswa')
        ->whereNull('deleted_at')
        ->where('id', $id)
        ->exists();

    abort_if(!$exists, 404, 'Data pendaftaran tidak ditemukan.');

    DB::table('pendaftaran_siswa')
        ->where('id', $id)
        ->update([
            'status'             => $request->status,
            'verified_by'        => Auth::id(),
            'tanggal_verifikasi' => now(),
            'catatan'            => $request->catatan,
            'updated_at'         => now(),
        ]);

    return redirect()->route('admin.pendaftaran.show', $id)
        ->with('success', 'Status pendaftaran berhasil diperbarui.');
}

/**
 * Edit Data Pendaftaran (Admin)
 */
public function edit($id)
{
    $pendaftaran = DB::table('pendaftaran_siswa')
        ->whereNull('deleted_at')
        ->where('id', $id)
        ->first();

    abort_if(is_null($pendaftaran), 404, 'Data pendaftaran tidak ditemukan.');

    return Inertia::render('Admin/Pendaftaran/Edit', [
        'pendaftaran' => $pendaftaran,
    ]);
}

/**
 * Update Data Pendaftaran (Admin)
 */
public function update(Request $request, $id)
{
    $validated = $request->validate([
        'nama_lengkap'          => 'required|string|max:150',
        'nisn'                  => 'nullable|string|max:15',
        'nik'                   => 'nullable|string|max:20',
        'tempat_lahir'          => 'required|string|max:100',
        'tanggal_lahir'         => 'required|date',
        'jenis_kelamin'         => 'required|in:L,P',
        'anak_ke'               => 'nullable|integer',
        'jumlah_saudara'        => 'nullable|integer',
        'alamat_lengkap'        => 'required|string',
        'rt'                    => 'nullable|string|max:5',
        'rw'                    => 'nullable|string|max:5',
        'kelurahan'             => 'required|string|max:100',
        'kecamatan'             => 'required|string|max:100',
        'kota_kabupaten'        => 'required|string|max:100',
        'provinsi'              => 'required|string|max:100',
        'kode_pos'              => 'nullable|string|max:10',
        'no_hp_siswa'           => 'nullable|string|max:20',
        'email'                 => 'nullable|email|max:100',
        'nama_ayah'             => 'nullable|string|max:150',
        'pekerjaan_ayah'        => 'nullable|string|max:100',
        'pendidikan_ayah'       => 'nullable|string|max:50',
        'no_hp_ayah'            => 'nullable|string|max:20',
        'nama_ibu'              => 'nullable|string|max:150',
        'pekerjaan_ibu'         => 'nullable|string|max:100',
        'pendidikan_ibu'        => 'nullable|string|max:50',
        'no_hp_ibu'             => 'nullable|string|max:20',
        'nama_wali'             => 'nullable|string|max:150',
        'hubungan_wali'         => 'nullable|string|max:50',
        'no_hp_wali'            => 'nullable|string|max:20',
        'asal_sekolah'          => 'required|string|max:150',
        'alamat_sekolah'        => 'nullable|string',
        'tahun_lulus'           => 'nullable|digits:4|integer',
        'alasan_memilih_sekolah'=> 'nullable|string',
        'prestasi'              => 'nullable|string',
        'status'                => 'required|in:pending,verifikasi,diterima,ditolak,cadangan',
    ]);

    $exists = DB::table('pendaftaran_siswa')
        ->whereNull('deleted_at')
        ->where('id', $id)
        ->exists();

    abort_if(!$exists, 404, 'Data pendaftaran tidak ditemukan.');

    DB::table('pendaftaran_siswa')
        ->where('id', $id)
        ->update(array_merge($validated, [
            'updated_at' => now(),
        ]));

    return redirect()->route('admin.pendaftaran.index')
        ->with('success', 'Data pendaftaran berhasil diperbarui.');
}}