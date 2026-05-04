<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\AchievementController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/
Route::get('/dashboard', function () {
    return Inertia::render('DashboardBerita');
})->middleware(['auth', 'verified'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| Profile (Auth Required)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::controller(ProfileController::class)->group(function () {
        Route::get('/profile', 'edit')->name('profile.edit');
        Route::patch('/profile', 'update')->name('profile.update');
        Route::delete('/profile', 'destroy')->name('profile.destroy');
    });
});


Route::middleware('auth')->group(function () {
    Route::get('/news/create', [NewsController::class, 'create'])->name('news.create');
});

// ✅ API
Route::prefix('api')->group(function () {

    Route::apiResource('news', NewsController::class)->only(['index', 'show']);

    Route::middleware('auth')->group(function () {
        Route::apiResource('news', NewsController::class)
            ->only(['store', 'update', 'destroy']);
    });
});

/*
|--------------------------------------------------------------------------
| Achievements
|--------------------------------------------------------------------------
*/
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