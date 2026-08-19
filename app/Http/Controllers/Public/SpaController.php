<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Support\PageMeta;
use Illuminate\Contracts\View\View;

class SpaController extends Controller
{
    /**
     * Render the Laravel shell for a public page with server-side SEO metadata.
     */
    public function __invoke(string $page = 'home'): View
    {
        return view('app', [
            'meta' => PageMeta::for($page),
            'brand' => [
                'productName' => config('marketing.product_name'),
                'tagline' => config('marketing.tagline'),
                'supportEmail' => config('marketing.support_email'),
                'salesEmail' => config('marketing.sales_email'),
                'apiBaseUrl' => config('marketing.api_base_url'),
                'links' => config('marketing.links'),
                // Drop unpublished entries here rather than in the frontend.
                'footerLinks' => collect(config('marketing.footer_links'))
                    ->map(fn (array $links) => array_filter($links))
                    ->filter(fn (array $links) => $links !== [])
                    ->all(),
                'social' => array_filter(config('marketing.social')),
                'heroMetrics' => config('marketing.hero_metrics'),
                'providerMarkFallback' => config('marketing.provider_mark_fallback'),
            ],
        ]);
    }
}
