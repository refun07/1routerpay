<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Provider;
use Illuminate\Http\Response;

class SeoController extends Controller
{
    /** Marketing pages that should always be indexed. */
    private const PATHS = ['/', '/providers', '/routing', '/pricing', '/developers', '/status'];

    public function sitemap(): Response
    {
        $urls = collect(self::PATHS)->map(fn (string $path) => url($path));

        $urls = $urls->merge(
            Provider::query()->where('is_public', true)->pluck('slug')
                ->map(fn (string $slug) => url("/providers/{$slug}"))
        );

        $xml = view('seo.sitemap', ['urls' => $urls])->render();

        return response($xml, 200, ['Content-Type' => 'application/xml']);
    }

    public function robots(): Response
    {
        $body = implode("\n", [
            'User-agent: *',
            'Allow: /',
            'Disallow: /login',
            'Disallow: /register',
            '',
            'Sitemap: '.url('/sitemap.xml'),
            '',
        ]);

        return response($body, 200, ['Content-Type' => 'text/plain']);
    }
}
