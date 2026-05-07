<?php

use App\Http\Controllers\AchievementController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PendaftaranController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::get('/dashboard', [NewsController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::get('berita/{slug}', [NewsController::class, 'showberita'])->name('berita.show');

Route::middleware('auth')->group(function () {
    Route::controller(ProfileController::class)->group(function () {
        Route::get('/profile', 'edit')->name('profile.edit');
        Route::patch('/profile', 'update')->name('profile.update');
        Route::delete('/profile', 'destroy')->name('profile.destroy');
    });
});
Route::get('/pendaftaran', [PendaftaranController::class, 'create'])->name('pendaftaran.create');
Route::post('/pendaftaran', [PendaftaranController::class, 'store'])->name('pendaftaran.store');
Route::get('/pendaftaran/sukses', [PendaftaranController::class, 'success'])->name('pendaftaran.success');

// Admin Routes (gunakan middleware auth + role)
Route::prefix('admin')->middleware('auth')->group(function () {
    Route::get('/pendaftaran', [PendaftaranController::class, 'index'])->name('admin.pendaftaran.index');
    Route::get('/pendaftaran/{id}', [PendaftaranController::class, 'show'])->name('admin.pendaftaran.show');
    Route::post('/pendaftaran/{id}/verify', [PendaftaranController::class, 'verify'])->name('admin.pendaftaran.verify');
    Route::get('/pendaftaran/{id}/edit', [PendaftaranController::class, 'edit'])->name('admin.pendaftaran.edit');
    Route::put('/pendaftaran/{id}', [PendaftaranController::class, 'update'])->name('admin.pendaftaran.update');
});

Route::resource('news', NewsController::class);

Route::prefix('api')->group(function () {
    Route::get('/getBerita', [NewsController::class, 'getBerita']);

    Route::middleware('auth')->group(function () {
        // API auth routes here
    });
});

Route::prefix('achievements')->controller(AchievementController::class)->group(function () {
    Route::get('/', 'index');
    Route::get('/featured', 'featured');
    Route::get('/statistics', 'statistics');
    Route::get('/{id}', 'show');

    Route::middleware('auth')->group(function () {
        Route::post('/', 'store');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });
});

require __DIR__.'/auth.php';