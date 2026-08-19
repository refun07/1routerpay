<?php

use App\Http\Controllers\Public\ContactSalesController;
use App\Http\Controllers\Public\PricingController;
use App\Http\Controllers\Public\RankingsController;
use App\Http\Controllers\Public\ProviderController;
use App\Http\Controllers\Public\StatusController;
use Illuminate\Support\Facades\Route;

/*
 | Public, unauthenticated marketing endpoints.
 |
 | Only endpoints that are actually implemented are exposed. The merchant-facing
 | /v1 payment API is intentionally absent until it exists.
 */

Route::prefix('public')->name('public.')->group(function () {
    Route::middleware('throttle:60,1')->group(function () {
        Route::get('providers', [ProviderController::class, 'index'])->name('providers.index');
        Route::get('providers/{slug}', [ProviderController::class, 'show'])->name('providers.show');
        Route::get('pricing', PricingController::class)->name('pricing');
        Route::get('platform-status', StatusController::class)->name('status');
        Route::get('rankings', RankingsController::class)->name('rankings');
        Route::get('faqs', fn () => response()->json(['data' => config('faqs')]))->name('faqs');
    });

    // Write endpoint is rate limited far more tightly.
    Route::post('contact-sales', ContactSalesController::class)
        ->middleware('throttle:5,1')
        ->name('contact-sales');
});
