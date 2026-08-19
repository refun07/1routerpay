<?php

use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\SessionController;
use App\Http\Controllers\Dashboard\ApiKeyController;
use App\Http\Controllers\Public\SeoController;
use App\Http\Controllers\Public\SpaController;
use Illuminate\Support\Facades\Route;

/*
 | Public marketing routes.
 |
 | Every page is served by a Laravel-rendered shell so titles, descriptions and
 | canonical URLs exist in the initial HTML. React takes over client-side routing
 | after hydration.
 */

$pages = [
    '/' => 'home',
    'providers' => 'providers',
    'providers/{slug}' => 'providers',
    'routing' => 'routing',
    'pricing' => 'pricing',
    'developers' => 'developers',
    'status' => 'status',
    'rankings' => 'rankings',
    'benchmarks' => 'benchmarks',
    'docs' => 'docs',
    'contact-sales' => 'contact-sales',
    'login' => 'login',
    'register' => 'register',
    'dashboard' => 'dashboard',
];

foreach ($pages as $uri => $page) {
    Route::get($uri, fn () => app(SpaController::class)($page))
        ->name('page.'.$page.($uri === 'providers/{slug}' ? '.show' : ''));
}

/*
 | Authentication and the merchant dashboard.
 |
 | These live on the web routes so they inherit the session and CSRF middleware:
 | the SPA is served from the same origin, so a cookie session is both simpler
 | and safer than handing a token to JavaScript.
 */
Route::prefix('api/auth')->name('auth.')->group(function () {
    Route::post('register', RegisterController::class)
        ->middleware(['guest', 'throttle:10,1'])->name('register');

    Route::post('login', [SessionController::class, 'store'])
        ->middleware(['guest', 'throttle:5,1'])->name('login');

    Route::get('me', [SessionController::class, 'show'])->name('me');

    Route::post('logout', [SessionController::class, 'destroy'])
        ->middleware('auth')->name('logout');
});

Route::prefix('api/dashboard')->name('dashboard.')->middleware('auth')->group(function () {
    Route::get('api-keys', [ApiKeyController::class, 'index'])->name('api-keys.index');
    Route::post('api-keys', [ApiKeyController::class, 'store'])
        ->middleware('throttle:20,1')->name('api-keys.store');
    Route::delete('api-keys/{apiKey}', [ApiKeyController::class, 'destroy'])->name('api-keys.destroy');
});

Route::get('sitemap.xml', [SeoController::class, 'sitemap'])->name('sitemap');
Route::get('robots.txt', [SeoController::class, 'robots'])->name('robots');

// Anything else still renders the SPA, which shows an in-app 404.
Route::fallback(fn () => response(app(SpaController::class)('home')->render(), 404));
